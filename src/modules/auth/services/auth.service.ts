import { Injectable } from '@nestjs/common';
import { LoginDto } from '../dtos';
import { InjectRepository } from '@nestjs/typeorm';
import { Roles, User } from 'entities';
import { Repository } from 'typeorm';
import { ADMIN_ROLES } from 'shared/constants';
import { hashPassword } from 'shared/crypto/hash';
/**
 *
 */
@Injectable()
export class AuthService {
  /**
   *
   */
  constructor(
    @InjectRepository(Roles) private rolesRepository: Repository<Roles>,
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}

  /**
   */
  public async login(_loginDto: LoginDto): Promise<any> {
    const user = await this.usersRepository.findOneBy({ id: 1 });
    return user;
  }

  /**
   *
   */
  public async initRoles(): Promise<void> {
    const check = await this.rolesRepository.find();
    if (!check || check.length === 0) {
      const admin = new Roles();
      admin.id = ADMIN_ROLES;
      await this.rolesRepository.save(admin);
    }
  }

  /**
   *
   */
  public async initAdmin(): Promise<void> {
    const userAdmin = await this.usersRepository.find();
    if (!userAdmin || userAdmin.length === 0) {
      const username = 'admin';
      const password = process.env['ADMIN_PASSWORD'] || '123456';
      const email = 'admin@gmail.com';
      const newUserAdmin = new User();
      newUserAdmin.name = username;
      newUserAdmin.password = await hashPassword(password); // Use argon2 to hash the password
      newUserAdmin.email = email;
      await this.usersRepository.save(newUserAdmin);
    }
  }
}
