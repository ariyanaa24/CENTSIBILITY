import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

/**
 * Business logic for users: register, view, and update the profile.
 */
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly usersRepo: Repository<User>) {}

  /**
   * Registers a new user. Returns the user without the password.
   */
  async create(dto: CreateUserDto) {
    // 409 if the email is already registered.
    await this.assertEmailFree(dto.email);
    const passwordHash = await bcrypt.hash(dto.password, 10); // never save the plain password
    const saved = await this.usersRepo.save(
      this.usersRepo.create({
        firstName: dto.firstName,
        lastName: dto.lastName,
        email: dto.email,
        passwordHash,
      }),
    );
    return this.toResponse(saved);
  }

  /**
   * Gets one user by ID (404 if not found).
   */
  async findOne(id: number) {
    const user = await this.usersRepo.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException({ message: 'User not found.', errors: [`No user exists with ID ${id}.`] });
    }
    return this.toResponse(user);
  }

  /**
   * Changes only the fields the client sent (PATCH).
   */
  async update(id: number, dto: UpdateUserDto) {
    const user = await this.usersRepo.findOne({ where: { userId: id } });
    if (!user) {
      throw new NotFoundException({ message: 'User not found.', errors: [`No user exists with ID ${id}.`] });
    }

    // Only check for a duplicate when the email is really changing.
    if (dto.email && dto.email !== user.email) await this.assertEmailFree(dto.email);

    // Copy the sent fields onto the saved user.
    Object.assign(user, dto);
    return this.toResponse(await this.usersRepo.save(user));
  }

  // used by AuthService (passwordHash is hidden by default, so we ask for it here)
  findByEmailWithPassword(email: string) {
    return this.usersRepo
      .createQueryBuilder('u')
      .addSelect('u.passwordHash')
      .where('u.email = :email', { email })
      .getOne();
  }

  /**
   * Throws 409 Conflict if another user already has this email.
   */
  private async assertEmailFree(email: string) {
    const exists = await this.usersRepo.findOne({ where: { email } });
    if (exists) {
      throw new ConflictException({
        message: 'Email is already registered.',
        errors: [`A user with email ${email} already exists.`],
      });
    }
  }

  // only these fields are returned, never passwordHash
  private toResponse(u: User) {
    return {
      userId: u.userId,
      firstName: u.firstName,
      lastName: u.lastName,
      email: u.email,
      dateCreated: u.dateCreated,
    };
  }
}
