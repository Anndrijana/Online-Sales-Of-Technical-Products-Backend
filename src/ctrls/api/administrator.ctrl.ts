import { EditingAdministratorDto } from '../../dtos/administrator/editing.administrator.dto';
import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';
import { AddingAdministratorDto } from 'src/dtos/administrator/adding.administrator.dto';
import { AdministratorService } from 'src/services/administrator/administrator.service';

@Controller('api/administrator')
export class AdministratorController {
  constructor(private administratorService: AdministratorService) {}

  @Get()
  getAllAdmins(): Promise<Administrator[]> {
    return this.administratorService.getAll();
  }

  @Get(':id')
  getAdminById(@Param('id') administratorId: number): Promise<Administrator> {
    return this.administratorService.getById(administratorId);
  }

  @Put()
  addAdmin(@Body() data: AddingAdministratorDto): Promise<Administrator> {
    return this.administratorService.add(data);
  }

  @Post(':id')
  editAdmin(
    @Param('id') administratorId: number,
    @Body() data: EditingAdministratorDto,
  ): Promise<Administrator> {
    return this.administratorService.editById(administratorId, data);
  }
}
