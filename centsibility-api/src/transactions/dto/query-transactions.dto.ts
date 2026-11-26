import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional } from 'class-validator';
import { IsDateOnly } from '../../common/is-date-only.decorator';
import { PaginationDto } from '../../common/pagination.dto';

export class QueryTransactionsDto extends PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt({ message: 'categoryId must be a whole number.' })
  categoryId?: number;

  @IsOptional()
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
