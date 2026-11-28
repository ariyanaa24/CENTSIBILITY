import { Body, Controller, Delete, Get, HttpCode, Param, ParseIntPipe, Post, Put, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../common/current-user.decorator';
import { CategoriesService } from './categories.service';
import { CategoryDto } from './dto/category.dto';
import { QueryCategoryDto } from './dto/query-category.dto';

// The shape of request.user (filled by JwtStrategy after the token is checked).
type AuthUser = { userId: number };

/**
 * Handles the /categories routes. The controller only reads the request and calls the service.
 */
@UseGuards(JwtAuthGuard) // every route in this controller needs a valid token
@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  // GET /api/v1/categories   (optional filter: ?categoryType=Expense)
  @Get()
  findAll(@CurrentUser() user: AuthUser, @Query() query: QueryCategoryDto) {
    return this.categoriesService.findAll(user.userId, query);
  }

  // GET /api/v1/categories/:id
  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.categoriesService.findOne(id, user.userId);
  }

  // POST /api/v1/categories
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CategoryDto) {
    return this.categoriesService.create(user.userId, dto);
  }

  // PUT /api/v1/categories/:id   (replaces the name and the type)
  @Put(':id')
  replace(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser, @Body() dto: CategoryDto) {
    return this.categoriesService.replace(id, user.userId, dto);
  }

  // DELETE /api/v1/categories/:id   (204, or 409 if it still has transactions)
  @Delete(':id')
  @HttpCode(204)
  remove(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.categoriesService.remove(id, user.userId);
  }
}
