import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { QuerySavingsGoalsDto } from './dto/query-savings-goals.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { SavingsGoalsService } from './savings-goals.service';

type AuthUser = { userId: number };

@UseGuards(JwtAuthGuard)
@Controller('savings-goals')
export class SavingsGoalsController {
  constructor(private readonly goalsService: SavingsGoalsService) {}

  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: QuerySavingsGoalsDto) {
    return this.goalsService.findAll(user.userId, query);
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.goalsService.findOne(id, user.userId);
  }

  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateSavingsGoalDto) {
    return this.goalsService.create(user.userId, dto);
  }

  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser, @Body() dto: UpdateSavingsGoalDto) {
    return this.goalsService.update(id, user.userId, dto);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.goalsService.remove(id, user.userId);
  }
}
