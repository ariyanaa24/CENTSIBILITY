import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.decorator';
import { PaginationDto } from '../../common/pagination.dto';

/**
 * Query string for GET /transactions: filters, sorting, and (inherited) page and limit.
 */
export class QueryTransactionsDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'categoryId must be a whole number.' })
  categoryId?: number;

  @IsOptional()
  // Dates are inclusive and must be written as YYYY-MM-DD.
  @IsDateOnly()
  startDate?: string;

  @IsOptional()
  @IsDateOnly()
  endDate?: string;

  // a minus sign means descending, e.g. -transactionDate = newest first
  @IsOptional()
  @IsIn(['transactionDate', '-transactionDate', 'amount', '-amount'], {
    message: 'sort must be transactionDate, -transactionDate, amount, or -amount.',
  })
  sort: string = '-transactionDate';
}
