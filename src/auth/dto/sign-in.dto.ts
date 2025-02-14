import { IsEmail, IsString, IsStrongPassword } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class SignInDto {
  @ApiProperty({
    description: 'Email address, unique for everyone',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Strong password consisting of uppercase, lowercase character, at least one number and one symbol',
  })
  @IsString()
  @IsStrongPassword()
  password: string;
}
