import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { RegisterDto } from './dto/register.dto';
import { UserService } from './user.service';
/**
 * User Controller
 */
@Controller('users')
export class UserController {
    constructor (private readonly userService: UserService) { }
    @Get()
    findAll() {
        return [{ id: 1, name: 'S' }, { id: 2, name: 'K' }];
    }

    @Post("/register")
    async create(@Body() registerUserDto: RegisterDto) {
        return await this.userService.register(registerUserDto);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return { id, name: 'Sample User' };
    }

}