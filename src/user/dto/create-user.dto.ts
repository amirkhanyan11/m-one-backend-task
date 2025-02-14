import {
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsPositive,
  IsString,
  IsStrongPassword,
  Length,
  Matches,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    description: 'Email address, unique for everyone',
    example: 'some@email.com',
  })
  @IsString()
  @IsEmail()
  email: string;

  @ApiProperty({
    description:
      'Should start with an uppercase character and contain only letters',
    example: 'Michael',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  @Matches(/^[A-Z][a-zA-Z]{0,24}$/, {
    message:
      'Name must start with a capital letter, contain only letters, and be at most 25 characters long.',
  })
  name: string;

  @ApiProperty({
    description:
      'Should start with an uppercase character and contain only letters',
    example: 'Jackson',
  })
  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  @Matches(/^[A-Z][a-zA-Z]{0,24}$/, {
    message:
      'Surname must start with a capital letter, contain only letters, and be at most 25 characters long.',
  })
  surname: string;

  @ApiProperty({
    description:
      'Strong password consisting of uppercase, lowercase character, at least one number and one symbol',
    example: 'StrongPassword1337$$$',
  })
  @IsString()
  @IsStrongPassword()
  password: string;

  @ApiProperty({
    description: 'Age of the user, must be positive a integer',
    example: '22',
  })
  @IsNumber()
  @IsPositive()
  age: number;
}
