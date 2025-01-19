import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

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

    async updateUser(userId: number, updateData: Partial<User>): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new Error('User not found');
        }

        // Handle password hashing
        if (updateData.password) {
            const salt = await bcrypt.genSalt();
            updateData.password = await bcrypt.hash(updateData.password, salt);
        }

        Object.assign(user, updateData); // Update fields

        return this.userRepository.save(user);
    }
}
