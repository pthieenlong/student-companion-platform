import { IsEmail, IsNotEmpty, IsOptional, IsString, IsStrongPassword } from "class-validator";
import { Match } from '../../../common/decorators/match.decorator';

export class LoginDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsString()
  @IsNotEmpty()
  password: string;
}

export class RegisterDTO {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  @IsStrongPassword({
    minLength: 4,
    minNumbers: 1,
    minSymbols: 1,
    minUppercase: 1
  })
  password: string;

  @IsString()
  @IsNotEmpty()
  @Match('password', {
    message: "Password is not match"
  })
  confirmPassword: string;

  @IsString()
  @IsOptional()
  phoneNumber: string;

  @IsString()
  fullName: string;
}