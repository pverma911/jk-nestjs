import { Controller, Get, Post, Body, Param, Patch, UseGuards } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { CurrentUser } from 'src/decorators/user.decorator';
import { User } from 'src/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from 'src/guards/jwt.guard';
import { RolesGuard } from 'src/guards/roles.guard';
import { Roles } from 'src/decorators/role.decorator';
import { UserRole } from './user.enum';

/**
 * User Controller
 */
@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) { }

    @Post("/register")
    async create(@Body() registerUserDto: RegisterDto) {
        return await this.userService.register(registerUserDto);
    }

    @Post("/login")
    async login(@Body() loginDto: LoginDto) {
        return await this.userService.login(loginDto);
    }

    @UseGuards(JwtAuthGuard, RolesGuard)
    @Roles(UserRole.ADMIN)
    @Patch(':id/role')
    async updateRole(@Param('id') userId: string, @Body() updateRoleDto: UpdateRoleDto) {
        return await this.userService.updateRole(userId, updateRoleDto);
    }

    @UseGuards(JwtAuthGuard)
    @Get("/role")
    async getRole(@CurrentUser("role") role: string) {
        return this.userService.getUserRole(role);
    }
}