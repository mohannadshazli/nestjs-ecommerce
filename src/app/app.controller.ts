import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { ApiTags } from '@nestjs/swagger';
import formatDate from 'mohannad-utils';

@ApiTags('system')
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    const now = new Date();
    const formattedDate = formatDate(now, 'YYYY-MM-DD');
    return `Hello! Current date is: ${formattedDate}`;
    //return this.appService.getHello();
  }
}
