import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CategoriesService } from '../categories/categories.service';
import { PaginationDto } from '../common/pagination.dto';
import { Transaction } from '../entities/transaction.entity';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { QueryTransactionsDto } from './dto/query-transactions.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';

/**
 * Business logic for transactions: ownership checks, filters, sorting, and pagination.
 */
@Injectable()
export class TransactionsService {
  constructor(
    @InjectRepository(Transaction) private readonly transactionsRepo: Repository<Transaction>,
    private readonly categoriesService: CategoriesService,
  ) {}

  // GET /transactions  (filter, sort, paginate)
  async findAll(userId: number, query: QueryTransactionsDto) {
    // A date range must start before it ends.
    if (query.startDate && query.endDate && query.startDate > query.endDate) {
      throw new BadRequestException({
        message: 'Invalid query parameter.',
        errors: ['startDate must not be later than endDate.'],
      });
    }

    // Build the query step by step. It is always limited to the logged-in user's rows.
    const qb = this.transactionsRepo.createQueryBuilder('t').where('t.userId = :userId', { userId });

    // Add each filter only if the client sent it.
    if (query.categoryId) qb.andWhere('t.categoryId = :categoryId', { categoryId: query.categoryId });
    if (query.startDate) qb.andWhere('t.transactionDate >= :startDate', { startDate: query.startDate });
    if (query.endDate) qb.andWhere('t.transactionDate <= :endDate', { endDate: query.endDate });
    return this.paginate(qb, query.sort, query.page, query.limit);
  }

  // GET /categories/:id/transactions
  async findByCategory(categoryId: number, userId: number, query: PaginationDto) {
    await this.categoriesService.findOwned(categoryId, userId); // 404 or 403
    const qb = this.transactionsRepo
      .createQueryBuilder('t')
      .where('t.userId = :userId', { userId })
      .andWhere('t.categoryId = :categoryId', { categoryId });
    return this.paginate(qb, '-transactionDate', query.page, query.limit);
  }

  /**
   * Gets one transaction. 404 if missing, 403 if it belongs to another user.
   */
  async findOne(id: number, userId: number) {
    return this.toResponse(await this.findOwned(id, userId));
  }

  /**
   * Logs a new transaction. The category must exist and belong to the user.
   */
  async create(userId: number, dto: CreateTransactionDto) {
    await this.categoriesService.findOwned(dto.categoryId, userId); // 404 if the category does not exist
    const saved = await this.transactionsRepo.save(
      this.transactionsRepo.create({
        userId,
        categoryId: dto.categoryId,
        amount: dto.amount,
        transactionDate: dto.transactionDate,
        description: dto.description ?? null,
        receiptImagePath: dto.receiptImagePath ?? null,
      }),
    );
    return this.toResponse(saved);
  }

  // PATCH: change only the fields that were sent
  async update(id: number, userId: number, dto: UpdateTransactionDto) {
    const transaction = await this.findOwned(id, userId);
    if (dto.categoryId !== undefined && dto.categoryId !== transaction.categoryId) {
      await this.categoriesService.findOwned(dto.categoryId, userId);
    }
    Object.assign(transaction, dto);
    return this.toResponse(await this.transactionsRepo.save(transaction));
  }

  /**
   * Deletes a transaction (ownership is checked first).
   */
  async remove(id: number, userId: number) {
    const transaction = await this.findOwned(id, userId);
    await this.transactionsRepo.remove(transaction);
  }

  /**
   * Finds a transaction by ID.
   * Throws 404 if it does not exist and 403 if it is not the user's.
   */
  private async findOwned(id: number, userId: number) {
    const transaction = await this.transactionsRepo.findOne({ where: { transactionId: id } });
    if (!transaction) {
      throw new NotFoundException({ message: 'Transaction not found.', errors: [`No transaction exists with ID ${id}.`] });
    }
    if (transaction.userId !== userId) {
      throw new ForbiddenException({ message: 'Access denied.', errors: ['This transaction belongs to another user.'] });
    }
    return transaction;
  }

  /**
   * Sorts the query, returns only one page, and wraps the result as { page, limit, totalItems, data }.
   */
  private async paginate(qb: any, sort: string, page: number, limit: number) {
    // A leading minus means descending: '-transactionDate' = newest first.
    const desc = sort.startsWith('-');
    const field = desc ? sort.slice(1) : sort;
    const [rows, totalItems] = await qb
      .orderBy(`t.${field}`, desc ? 'DESC' : 'ASC')
      // Second sort key, so rows with equal values always come in the same order.
      .addOrderBy('t.transactionId', 'DESC')
      // Pagination: skip the rows of the earlier pages, then take 'limit' rows.
      .skip((page - 1) * limit)
      .take(limit)
      .getManyAndCount();
    return { page, limit, totalItems, data: rows.map((t: Transaction) => this.toResponse(t)) };
  }

  /**
   * Only these fields are sent to the client.
   */
  private toResponse(t: Transaction) {
    return {
      transactionId: t.transactionId,
      userId: t.userId,
      categoryId: t.categoryId,
      amount: t.amount,
      transactionDate: t.transactionDate,
      description: t.description ?? null,
      receiptImagePath: t.receiptImagePath ?? null,
    };
  }
}
