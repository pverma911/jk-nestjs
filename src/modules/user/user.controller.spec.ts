import { RegisterDto } from "./dto/register.dto";
import { UserController } from "./user.controller";
import { faker } from '@faker-js/faker';
import { UserRole } from "./user.enum";
import { v4 as uuid } from "uuid"
import { ResponseService } from "../../utils/response.utils";
import { HttpStatus } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserService } from "./user.service";
import { LoginDto } from "./dto/login.dto";
import { UpdateRoleDto } from "./dto/updateRole.dto";

describe('UserController', () => {
    let userController: UserController;
    let mockUserService = { register: jest.fn(), login: jest.fn(), updateRole: jest.fn(), getUserRole: jest.fn() };

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
                { provide: UserService, useValue: mockUserService },
            ],
        }).compile();

        userController = module.get<UserController>(UserController);
    });

    // Test for Register API
    it('should register user and respond correctly', async () => {
        const dto: RegisterDto = { email: faker.internet.email(), name: faker.person.fullName(), password: "123456", role: UserRole.EDITOR };
        const response = new ResponseService().serviceResponse(HttpStatus.CREATED, { userId: uuid() }, "Please proceed to login")
        mockUserService.register.mockResolvedValue(response);

        expect(await userController.create(dto)).toEqual(response);
        expect(mockUserService.register).toHaveBeenCalledWith(dto);
    });

    // Test for Login API
    it('should login user', async () => {
        const dto: LoginDto = { email: faker.internet.email(), password: "123456" };
        const response = new ResponseService().serviceResponse(HttpStatus.OK, { accessToken: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6ImYzZTdkZDU3LTU0NmUtNGUzOC04NWZhLWY0NDc3NTkxMjBkYSIsImVtYWlsIjoidmVybWEucHJhbnNodTY4OUBnbWFpbC5jb20iLCJyb2xlIjoiYWRtaW4iLCJpYXQiOjE3NDk5NzEzODgsImV4cCI6MTc1MDQwMzM4OH0.QNqHhWqEAVqJuaxgvHMpOy5rqvPmbsJpe_IkWtvf21g" }, "Logged In")
        mockUserService.login.mockResolvedValue(response);

        expect(await userController.login(dto)).toEqual(response);
        expect(mockUserService.login).toHaveBeenCalledWith(dto);
    });

    // Test for User role change API
    it('should be able to change role of user', async () => {
        const dto: UpdateRoleDto = { role: UserRole.VIEWER };
        const userId = uuid();
        const response = new ResponseService().serviceResponse(HttpStatus.OK, {}, "User role has been updated")
        mockUserService.updateRole.mockResolvedValue(response);

        expect(await userController.updateRole(userId, dto)).toEqual(response);
        expect(mockUserService.updateRole).toHaveBeenCalledWith(userId, dto);
    });

    // Test for User role fetch API
    it('should be able to fetch role of logged in user', async () => {
        const role = UserRole.VIEWER
        const response = new ResponseService().serviceResponse(HttpStatus.OK, { role }, "User role fetched")
        mockUserService.getUserRole.mockResolvedValue(response);

        expect(await userController.getRole(role)).toEqual(response);
        expect(mockUserService.getUserRole).toHaveBeenCalledWith(role);
    });
});
