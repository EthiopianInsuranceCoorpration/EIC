import { Controller, Post, Get, Param, Body, Patch, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { CorporateService } from './corporate.service';
import { CreateCorporateClientDto } from './dto/create-corporate-client.dto';
import { CorporateClient } from './entities/corporate-client.entity';
import { CoveragePlan } from './entities/coverage-plan.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserType } from '../common/enums/user-type.enum';

@ApiTags('corporate')
@Controller('corporate')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
export class CorporateController
{
  constructor(private readonly corporateService: CorporateService) { }

  @Post()
  @Roles(UserType.ADMIN, UserType.INSURANCE_ADMIN)
  @ApiOperation({ summary: 'Create a new corporate client' })
  @ApiResponse({ status: 201, type: CorporateClient })
  async create(@Body() dto: CreateCorporateClientDto): Promise<CorporateClient>
  {
    return this.corporateService.createCorporateClient(dto);
  }

  @Get()
  @Roles(UserType.ADMIN, UserType.INSURANCE_ADMIN)
  @ApiOperation({ summary: 'Get all corporate clients' })
  @ApiResponse({ status: 200, type: [CorporateClient] })
  async findAll(): Promise<CorporateClient[]>
  {
    return this.corporateService.findAll();
  }

  @Get(':id')
  @Roles(UserType.ADMIN, UserType.INSURANCE_ADMIN, UserType.CORPORATE_ADMIN)
  @ApiOperation({ summary: 'Get a corporate client by ID' })
  @ApiResponse({ status: 200, type: CorporateClient })
  async findOne(@Param('id') id: string): Promise<CorporateClient>
  {
    return this.corporateService.findOne(id);
  }

  @Get('insurance/:insuranceCompanyId')
  @Roles(UserType.ADMIN, UserType.INSURANCE_ADMIN)
  @ApiOperation({ summary: 'Get corporate clients by insurance company ID' })
  @ApiResponse({ status: 200, type: [CorporateClient] })
  async findByInsuranceCompany(@Param('insuranceCompanyId') insuranceCompanyId: string): Promise<CorporateClient[]>
  {
    return this.corporateService.findByInsuranceCompany(insuranceCompanyId);
  }

  @Patch(':id/status')
  @Roles(UserType.ADMIN, UserType.INSURANCE_ADMIN)
  @ApiOperation({ summary: 'Update corporate client status' })
  @ApiResponse({ status: 200, type: CorporateClient })
  async updateStatus(
    @Param('id') id: string,
    @Body('isActive') isActive: boolean
  ): Promise<CorporateClient>
  {
    return this.corporateService.updateStatus(id, isActive);
  }

  @Patch(':clientId/coverage-plan/:planId')
  @Roles(UserType.ADMIN, UserType.INSURANCE_ADMIN, UserType.CORPORATE_ADMIN)
  @ApiOperation({ summary: 'Update coverage plan' })
  @ApiResponse({ status: 200, type: CoveragePlan })
  async updateCoveragePlan(
    @Param('clientId') clientId: string,
    @Param('planId') planId: string,
    @Body() updates: Partial<CoveragePlan>
  ): Promise<CoveragePlan>
  {
    return this.corporateService.updateCoveragePlan(clientId, planId, updates);
  }
}