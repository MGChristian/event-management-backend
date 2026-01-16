import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from './dto/update-user.dto';
import { GetUserDto } from './dto/get-user.dto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private usersRepository: Repository<User>,
  ) {}
  create(createUserDto: CreateUserDto) {
    const newUser = this.usersRepository.create(createUserDto);
    return this.usersRepository.save(newUser);
  }

  findOneById(id: number): Promise<GetUserDto | null> {
    return this.usersRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
      where: {
        id: id,
      },
    });
  }

  findOneByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({
      select: {
        id: true,
        name: true,
        email: true,
        password: true,
        role: true,
        isActive: true,
      },
      where: {
        email: email,
      },
    });
  }

  async findAll(): Promise<GetUserDto[]> {
    return this.usersRepository.find({
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
      },
    });
  }

  async update(id: number, UpdateUserDto: Partial<UpdateUserDto>) {
    return this.usersRepository.update(id, UpdateUserDto);
  }
}
