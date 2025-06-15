import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateDocumentDto {
    @ValidateIf((o) => !o.newName)
    @IsString()
    description?: string;

    @ValidateIf((o) => !o.description)
    @IsString()
    newName?: string;
}
