import { Controller, Get, Post, Body, Param, Patch, UseGuards, HttpStatus } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
import { LoginDto } from './dto/login.dto';
import { UpdateRoleDto } from './dto/updateRole.dto';
import { CurrentUser } from '../../decorators/user.decorator';
import { JwtAuthGuard } from '../../guards/jwt.guard';
import { RolesGuard } from '../../guards/roles.guard';
import { Roles } from '../../decorators/role.decorator';
import { UserRole } from './user.enum';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

/**
 * User Controller
 */
@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) { }

    @ApiOperation({ summary: 'Register a new user' })
    @ApiBody({ type: RegisterDto })
    @ApiResponse({
        status: HttpStatus.CREATED,
        description: 'User created successfully',
        schema: {
            example: {
                statusCode: HttpStatus.CREATED,
                success: true,
                message: 'Please proceed to login',
                data: {
                    userId: '37771e10-b1ee-434a-aaed-5f205bbc0718',
                },
            },
        },
    })
    @ApiResponse({ status: HttpStatus.CONFLICT, description: 'User with this email already exists' })
    @Post("/register")
    async create(@Body() registerUserDto: RegisterDto) {
        return await this.userService.register(registerUserDto);
    }

    @ApiOperation({ summary: 'Login a user and return JWT token' })
    @ApiBody({ type: LoginDto })
    @ApiResponse({
        status: HttpStatus.OK, description: 'User logged in successfully', schema: {
            example: {
                statusCode: HttpStatus.OK,
                success: true,
                message: "Logged In",
                data: {
                    accessToken: 'ey24.sesa24.ssr6t3',
                },
            },
        },
    })
    @ApiResponse({ status: 401, description: 'Invalid email/password' })
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