import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { BudgetsService } from './budgets.service';
import { CreateBudgetDto } from './dto/create-budget.dto';
import { QueryBudgetsDto } from './dto/query-budgets.dto';
import { UpdateBudgetDto } from './dto/update-budget.dto';

// The shape of request.user (filled by JwtStrategy after the token is checked).
type AuthUser = { userId: number };

/**
 * Handles the /budgets routes. Every route needs a valid token.
 * The controller only reads the request and calls the service.
 */
@UseGuards(JwtAuthGuard)
@Controller('budgets')
export class BudgetsController {
  constructor(private readonly budgetsService: BudgetsService) {}

  // GET /api/v1/budgets   (optional filter: ?budgetMonth=2026-11-01)
  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryBudgetsDto) {
    return this.budgetsService.findAll(user.userId, query);
  }

  // GET /api/v1/budgets/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.budgetsService.findOne(id, user.userId);
  }

  // POST /api/v1/budgets
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateBudgetDto) {
    return this.budgetsService.create(user.userId, dto);
  }

  // PATCH /api/v1/budgets/:id   (monthlyLimit and/or alertThreshold)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser, @Body() dto: UpdateBudgetDto) {
    return this.budgetsService.update(id, user.userId, dto);
  }

  // DELETE /api/v1/budgets/:id   (204 No Content)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.budgetsService.remove(id, user.userId);
  }
}
