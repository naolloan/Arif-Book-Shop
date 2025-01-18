import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) {}

    // Get all users
    async getAllUsers(): Promise<User[]> {
        return this.userRepository.find();
    }

    // Get a single user by ID
    async getUserById(id: number): Promise<User | null> {
        return this.userRepository.findOneBy({ id });
    }
}
