import { IsNotEmpty, IsString, MaxLength, MinLength } from "class-validator";

export class AuthDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @MinLength(3)
    username: string;

    @IsString()
    @IsNotEmpty()
    @MaxLength(150)
    @MinLength(3)
    password: string;


}