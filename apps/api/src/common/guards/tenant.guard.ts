import {
  CanActivate,
  ExecutionContext,
  Injectable,
  BadRequestException,
} from "@nestjs/common";

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const tenantId = request.headers["x-tenant-id"];

    if (!tenantId) {
      throw new BadRequestException('Header "x-tenant-id" is required');
    }

    // tenantId am Request-Objekt speichern (für @Tenant() Decorator)
    request.tenantId = tenantId;

    return true;
  }
}
