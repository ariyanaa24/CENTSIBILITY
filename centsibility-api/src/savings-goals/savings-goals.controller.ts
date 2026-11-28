import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CreateSavingsGoalDto } from './dto/create-savings-goal.dto';
import { QuerySavingsGoalsDto } from './dto/query-savings-goals.dto';
import { UpdateSavingsGoalDto } from './dto/update-savings-goal.dto';
import { SavingsGoalsService } from './savings-goals.service';

// The shape of request.user (filled by JwtStrategy after the token is checked).
type AuthUser = { userId: number };

/**
 * Handles the /savings-goals routes. Every route needs a valid token.
 * The controller only reads the request and calls the service.
 */
@UseGuards(JwtAuthGuard)
@Controller('savings-goals')
export class SavingsGoalsController {
  constructor(private readonly goalsService: SavingsGoalsService) {}

  // GET /api/v1/savings-goals   (optional filter: ?status=Active)
  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: QuerySavingsGoalsDto) {
    return this.goalsService.findAll(user.userId, query);
  }

  // GET /api/v1/savings-goals/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.goalsService.findOne(id, user.userId);
  }

  // POST /api/v1/savings-goals
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateSavingsGoalDto) {
    return this.goalsService.create(user.userId, dto);
  }

  // PATCH /api/v1/savings-goals/:id   (for example { "currentAmount": 3000 })
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser, @Body() dto: UpdateSavingsGoalDto) {
    return this.goalsService.update(id, user.userId, dto);
  }

  // DELETE /api/v1/savings-goals/:id   (204 No Content)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.goalsService.remove(id, user.userId);
  }
}
