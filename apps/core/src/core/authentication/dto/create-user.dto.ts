import { IsNotEmpty, IsString, Min, IsOptional } from 'class-validator';

export class CreateUserDto {
    @IsString()
    @IsNotEmpty()
    username: string;

    @IsString()
    @IsNotEmpty()
    email: string;

    @IsString()
    @IsOptional()
    phoneNumber?: string;    

    @IsNotEmpty()
    password: string;

    @IsOptional()
    @IsString()
    role: string

    @IsOptional()
    @IsString()
    adminKey:string
}
