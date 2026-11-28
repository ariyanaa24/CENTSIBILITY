import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { PaginationDto } from '../common/pagination.dto';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { TransactionsService } from './transactions.service';

// The shape of request.user (filled by JwtStrategy after the token is checked).
type AuthUser = { userId: number };

/**
 * Handles the /transactions routes. Every route needs a valid token.
 * The controller only reads the request and calls the service.
 */
@UseGuards(JwtAuthGuard)
@Controller('transactions')
export class TransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // GET /api/v1/transactions?categoryId=&startDate=&endDate=&sort=&page=&limit=
  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryTransactionsDto) {
    return this.transactionsService.findAll(user.userId, query);
  }

  // GET /api/v1/transactions/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.transactionsService.findOne(id, user.userId);
  }

  // POST /api/v1/transactions
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateTransactionDto) {
    return this.transactionsService.create(user.userId, dto);
  }

  // PATCH /api/v1/transactions/:id   (only the fields that change)
  @Patch(':id')
  update(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser, @Body() dto: UpdateTransactionDto) {
    return this.transactionsService.update(id, user.userId, dto);
  }

  // DELETE /api/v1/transactions/:id   (204 No Content)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.transactionsService.remove(id, user.userId);
  }
}

// Nested resource: GET /api/v1/categories/:id/transactions
@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoryTransactionsController {
  constructor(private readonly transactionsService: TransactionsService) {}

  // GET /api/v1/categories/:id/transactions   (?page=&limit=)
  @Get(':id/transactions')
  findByCategory(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser, @Query() query: PaginationDto) {
    return this.transactionsService.findByCategory(id, user.userId, query);
  }
}
