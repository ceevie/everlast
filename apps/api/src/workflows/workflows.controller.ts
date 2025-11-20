import {
  Controller,
  Get,
  Post,
  Delete,
  Patch,
  Put,
  Body,
  Param,
  UseGuards,
  NotFoundException,
} from "@nestjs/common";
import { WorkflowsService } from "./workflows.service";
import { TenantGuard } from "../common/guards/tenant.guard";
import { TenantId } from "../common/decorators/tenant.decorator";
import { CreateWorkflowDTO, WorkflowResponseDTO } from "@everlast/types";

@Controller("workflows")
@UseGuards(TenantGuard)
export class WorkflowsController {
  constructor(private readonly workflowsService: WorkflowsService) {}

  @Get()
  findAll(@TenantId() tenantId: string): Promise<WorkflowResponseDTO[]> {
    return this.workflowsService.findAll(tenantId);
  }

  @Post()
  create(
    @TenantId() tenantId: string,
    @Body() dto: CreateWorkflowDTO
  ): Promise<WorkflowResponseDTO> {
    return this.workflowsService.create(tenantId, dto);
  }

  @Get(":id")
  async findOne(
    @TenantId() tenantId: string,
    @Param("id") id: string
  ): Promise<WorkflowResponseDTO> {
    const workflow = await this.workflowsService.findOne(tenantId, id);
    if (!workflow) throw new NotFoundException("Workflow not found");
    return workflow;
  }

  @Delete(":id")
  async delete(@TenantId() tenantId: string, @Param("id") id: string): Promise<any> {
    const result = await this.workflowsService.delete(tenantId, id);
    if (!result) throw new NotFoundException("Workflow not found");
    return { success: true };
  }

  @Patch(":id")
  async updateStatus(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() data: Partial<CreateWorkflowDTO>
  ): Promise<WorkflowResponseDTO | null> {
    const updated = await this.workflowsService.updateStatus(
      tenantId,
      id,
      data
    );
    if (!updated) throw new NotFoundException("Workflow not found");
    return updated;
  }

  @Put(":id")
  async replace(
    @TenantId() tenantId: string,
    @Param("id") id: string,
    @Body() dto: CreateWorkflowDTO
  ): Promise<WorkflowResponseDTO | null> {
    const replaced = await this.workflowsService.replace(tenantId, id, dto);
    if (!replaced) throw new NotFoundException("Workflow not found");
    return replaced;
  }
}
