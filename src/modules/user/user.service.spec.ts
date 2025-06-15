import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { UserRepository } from './user.repository';
import { JwtService } from '@nestjs/jwt';
import { ConflictException, HttpStatus, NotFoundException, UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { v4 as uuid } from "uuid"
import { faker } from '@faker-js/faker/.';
import { UserRole } from './user.enum';
import { RegisterDto } from './dto/register.dto';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../../entities/user.entity';
import { ResponseService } from '../../utils/response.utils';
import { LoginDto } from './dto/login.dto';

describe('UserService', () => {
    let service: UserService;
    let jwtService: JwtService;
    const userRepoToken = getRepositoryToken(UserRepository);
    let userRepo: UserRepository
    const responseService = new ResponseService()

    const mockUser: Pick<User, "id" | "name" | "email" | "role" | "password" | "created_at" | "updated_at"> = {
        id: uuid(),
        name: faker.person.fullName(),
        email: faker.internet.email(),
        role: UserRole.ADMIN,
        password: bcrypt.hashSync('123456', 10),
        created_at: new Date(),
        updated_at: new Date(),
    };

    const sampleToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZTdkZDU3LTU0NmUtNGUzOC04NWZhLWY0NDc3NTkxMjBkYSIsImVtYWlsIjoidmVybWEucHJhbnNodTY4OUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk5NzEzODgsImV4cCI6MTc1MDQwMzM4OH0.QNqHhWqEAVqJuaxgvHMpOy5rqvPmbsJpe_IkWtvf21g"

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: UserRepository, useValue: {
                        findUserByEmail: jest.fn(() => mockUser),
                        create: jest.fn(() => mockUser),
                        save: jest.fn(() => mockUser),
                        findById: jest.fn(() => mockUser),
                    }
                },
                { provide: JwtService, useValue: { sign: jest.fn(() => sampleToken) } },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        jwtService = module.get<JwtService>(JwtService);
        userRepo = module.get<UserRepository>(userRepoToken);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('register', () => {
        it('should create a new user if email is not taken', async () => {
            const dto: RegisterDto = { email: mockUser.email, name: mockUser.name, password: mockUser.password, role: mockUser.role };

            const response = responseService.serviceResponse(HttpStatus.CREATED, { userId: mockUser.id }, "Please proceed to login")

            jest.spyOn(userRepo, 'findUserByEmail').mockResolvedValue(null);
            await userRepo.findUserByEmail(mockUser.email);

            const createUser = userRepo.create(dto);

            await userRepo.save(createUser);

            const result = await service.register(dto);

            expect(userRepo.findUserByEmail).toHaveBeenCalledWith(dto.email);

            expect(userRepo.create).toHaveBeenCalledWith(dto);

            expect(userRepo.save).toHaveBeenCalledWith(createUser);

            expect(result).toEqual(response);
            expect(result.statusCode).toBe(HttpStatus.CREATED);
            expect(result.data.userId).toBe(mockUser.id);
        });

        it('should throw ConflictException if user exists', async () => {
            const dto: RegisterDto = { email: mockUser.email, name: mockUser.name, password: mockUser.password, role: mockUser.role };

            await userRepo.findUserByEmail(dto.email);

            await expect(service.register(dto)).rejects.toThrow(
                ConflictException,
            );
        });
    });

    describe('login', () => {
        const dto: LoginDto = { email: mockUser.email, password: "123456" };
        it('should login user with valid credentials', async () => {
            const response = responseService.serviceResponse(HttpStatus.OK, { accessToken: sampleToken }, "Logged In")

            await userRepo.findUserByEmail(dto.email)

            const jwtPayload = { id: mockUser.id, email: mockUser.email, role: mockUser.role };
            const token = jwtService.sign(jwtPayload);

            const result = await service.login(dto);

            expect(result).toEqual(response);
            expect(result.statusCode).toBe(HttpStatus.OK);
            expect(result.data.accessToken).toBe(token);
        });

        it('should throw UnauthorizedException if email is invalid', async () => {
            jest.spyOn(userRepo, 'findUserByEmail').mockResolvedValue(null);

            await expect(service.login(dto)).rejects.toThrow(
                UnauthorizedException,
            );
        });

        it('should throw UnauthorizedException if password is incorrect', async () => {
            await userRepo.findUserByEmail(dto.email);

            await expect(service.login({ email: mockUser.email, password: 'password123' })).rejects.toThrow(
                UnauthorizedException,
            );
        });
    });

    describe('updateRole', () => {
        it('should update user role', async () => {
            const user = await userRepo.findById(<string> mockUser.id);
            await userRepo.save({ ...user, role: UserRole.VIEWER });

            const response = responseService.serviceResponse(HttpStatus.OK, {}, "User role has been updated")

            const result = await service.updateRole(<string> mockUser.id, { role: UserRole.VIEWER });

            expect(userRepo.findById).toHaveBeenCalledWith(mockUser.id);
            expect(userRepo.save).toHaveBeenCalled();
            expect(result).toEqual(response);
            expect(result.statusCode).toBe(HttpStatus.OK);
        });

        it('should throw NotFoundException if user not found', async () => {
            jest.spyOn(userRepo, 'findById').mockResolvedValue(null);

            await expect(service.updateRole(<string> mockUser.id, { role: UserRole.VIEWER })).rejects.toThrow(NotFoundException);
        });
    });

    describe('should get user role', () => {
        it('should return user role', async () => {
            const response = responseService.serviceResponse(HttpStatus.OK, { role: UserRole.ADMIN }, "User role fetched")

            const result = service.getUserRole(UserRole.ADMIN);
            expect(result).toEqual(response);
            expect(result.statusCode).toBe(HttpStatus.OK);

        });
    });
});
