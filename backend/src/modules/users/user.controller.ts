import { Body, Controller, Get, Param, Put, Req, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/roles.guard';
import { Role } from '../../common/roles.decorator';
import { RequestWithUser } from 'src/common/interfaces/request-with-user.interface';
import { UpdateUserDto } from './dto/update-user.dto';

@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@Role('admin')  // Only admins can access this endpoint
export class UserController {
    constructor(private readonly userService: UserService) {}

    @Get()
    async getAllUsers() {
        return this.userService.getAllUsers();
    }

    @Get(':id')
    async getUserById(@Param('id') id: number) {
        return this.userService.getUserById(id);
    }

    @Put('update')
    async updateUser(@Req() request: RequestWithUser, @Body() updateData: UpdateUserDto) {
        const userId = request.user.userId;
        return this.userService.updateUser(userId, updateData);
    }
}
