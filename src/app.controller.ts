import { Controller, Get } from '@nestjs/common';
import { Administrator } from 'entities/administrator.entity';
import { AdministratorService } from './services/administrator/administrator.service';

@Controller()
export class AppController {
  constructor(private administratorService: AdministratorService) {}
  @Get()
  getHomePage(): string {
    return 'Home page!';
  }

  @Get('api/administrator')
  getAllAdmins(): Promise<Administrator[]> {
    return this.administratorService.getAll();
  }
}
