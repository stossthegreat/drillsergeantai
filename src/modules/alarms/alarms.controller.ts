import { Controller, Get, Post, Body, Param, Delete } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AlarmsService } from './alarms.service';

@ApiTags('Alarms')
@Controller('v1/alarms')
export class AlarmsController {
  constructor(private readonly alarmsService: AlarmsService) {}

  @Get()
  @ApiOperation({ summary: 'List user alarms' })
  @ApiResponse({ status: 200, description: 'Alarms retrieved' })
  @ApiBearerAuth()
  async list() {
    return this.alarmsService.list('demo-user-123');
  }

  @Post()
  @ApiOperation({ summary: 'Create new alarm' })
  @ApiResponse({ status: 201, description: 'Alarm created' })
  @ApiBearerAuth()
  async create(@Body() alarmData: any) {
    return this.alarmsService.create('demo-user-123', alarmData);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete alarm' })
  @ApiResponse({ status: 200, description: 'Alarm deleted' })
  @ApiBearerAuth()
  async delete(@Param('id') id: string) {
    return this.alarmsService.delete(id, 'demo-user-123');
  }

  @Post(':id/dismiss')
  @ApiOperation({ summary: 'Dismiss alarm' })
  @ApiResponse({ status: 200, description: 'Alarm dismissed' })
  @ApiBearerAuth()
  async dismiss(@Param('id') id: string) {
    return this.alarmsService.dismiss(id, 'demo-user-123');
  }

  @Post(':id/fire')
  @ApiOperation({ summary: 'Fire alarm with voice' })
  @ApiResponse({ status: 200, description: 'Alarm fired with voice' })
  @ApiBearerAuth()
  async fire(@Param('id') id: string) {
    return this.alarmsService.fireAlarm(id, 'demo-user-123');
  }
}
