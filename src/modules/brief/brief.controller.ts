import { Controller, Get, Post, Body, UseGuards, Req } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { BriefService } from './brief.service';
import { AuthGuard } from '../auth/auth.guard';

@ApiTags('Brief')
@Controller('v1/brief')
export class BriefController {
  constructor(private readonly briefService: BriefService) {}

  @Get('today')
  @ApiOperation({ summary: 'Get comprehensive daily brief' })
  @ApiResponse({ status: 200, description: 'Daily brief with missions, achievements, targets, and today list' })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async getTodaysBrief(@Req() req: any) {
    const userId = req.user?.id;
    return this.briefService.getTodaysBrief(userId);
  }

  @Post('today/select')
  @ApiOperation({ summary: 'Select habit for today' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async selectToday(@Req() req: any, @Body() body: { habitId: string; date?: string }) {
    const userId = req.user?.id;
    return this.briefService.selectForToday(userId, body.habitId, body.date);
  }

  @Post('today/deselect')
  @ApiOperation({ summary: 'Remove habit from today' })
  @ApiResponse({ status: 200 })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  async deselectToday(@Req() req: any, @Body() body: { habitId: string; date?: string }) {
    const userId = req.user?.id;
    return this.briefService.deselectForToday(userId, body.habitId, body.date);
  }
}
