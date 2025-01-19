import { Injectable, UnauthorizedException, ConflictException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { AuthDto } from './dto/auth.dto';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private jwtService: JwtService
    ) {}

    async register(authDto: AuthDto) {
        const { email, username, password, role = 'user' } = authDto;
        console.log('Register Payload:', authDto);
        
        // Validate inputs
        if (!password || typeof password !== 'string') {
            throw new Error('Invalid password provided');
        }
    
        // Check if email already exists
        const existingUser = await this.userRepository.findOneBy({ email });
        if (existingUser) {
            throw new ConflictException('Email is already registered');
        }
    
        // Generate salt and hash password
        const salt = await bcrypt.genSalt();
        if (!salt) {
            throw new Error('Failed to generate salt');
        }
    
        const hashedPassword = await bcrypt.hash(password, salt);
    
        // Create and save the new user
        const newUser = this.userRepository.create({
            email,
            username,
            password: hashedPassword,
            role,
        });
    
        return this.userRepository.save(newUser);
    }
    

    // ✅ Login a user
    async login(email: string, password: string) {
        const user = await this.userRepository.findOneBy({ email });

        // Check if user exists
        if (!user) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Validate the provided password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            throw new UnauthorizedException('Invalid email or password');
        }

        // Generate a JWT token
        const payload = { userId: user.id, email: user.email, role: user.role };
        const token = this.jwtService.sign(payload);

        return {
            message: 'Login successful',
            accessToken: token,
        };
    }

    // ✅ Get a user by their ID (for use in guards or services)
    async getUserById(userId: number): Promise<User> {
        const user = await this.userRepository.findOneBy({ id: userId });

        if (!user) {
            throw new NotFoundException('User not found');
        }

        return user;
    }
}
