import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding started...');

  // 1. Tenant (Idempotent via upsert)
  // Feste ID für einfachen Zugriff im Frontend
  const TENANT_ID = 'tenant-demo-001';

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'demo-company' },
    update: {},
    create: {
      id: TENANT_ID,
      name: 'Demo Company GmbH',
      slug: 'demo-company',
      contactEmail: 'contact@demo-company.com',
    },
  });
  console.log(`✅ Tenant: ${tenant.name} (${tenant.id})`);

  // 2. User (Idempotent via upsert)
  const user = await prisma.user.upsert({
    where: { email: 'max.mustermann@demo-company.com' },
    update: {},
    create: {
      email: 'max.mustermann@demo-company.com',
      name: 'Max Mustermann',
      tenantId: tenant.id,
      role: 'ADMIN',
    },
  });
  console.log(`✅ User: ${user.name}`);

  const pageId = process.env.META_PAGE_ID;
  if (pageId) {
    const integration = await prisma.integration.upsert({
      where: {
        provider_externalPageId: {
          provider: "META",
          externalPageId: pageId,
        },
      },
      update: {
        tenantId: tenant.id,
        accessToken: process.env.META_PAGE_ACCESS_TOKEN || undefined,
        isActive: true,
      },
      create: {
        tenantId: tenant.id,
        provider: "META",
        externalPageId: pageId,
        accessToken: process.env.META_PAGE_ACCESS_TOKEN || null,
        isActive: true,
      },
    });
    console.log(`✅ Meta-Integration: Page ${integration.externalPageId}`);
  } else {
    console.log("ℹ️  META_PAGE_ID nicht gesetzt — Meta-Integration übersprungen");
  }

  console.log('✅ Seeding finished (Basic setup only).');
}

main()
  .then(async () => { await prisma.$disconnect(); })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
