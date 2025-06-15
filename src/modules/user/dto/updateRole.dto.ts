import { IsEnum } from "class-validator";
import { UserRole } from "../user.enum";


export class UpdateRoleDto {
    @IsEnum(UserRole)
    role: UserRole
}
