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

export class CreateUserDto {
  @IsString()
  @IsEmail()
  email: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  @Matches(/^[A-Z][a-zA-Z]{0,24}$/, {
    message:
      'Name must start with a capital letter, contain only letters, and be at most 25 characters long.',
  })
  name: string;

  @IsString()
  @IsNotEmpty()
  @Length(1, 25)
  @Matches(/^[A-Z][a-zA-Z]{0,24}$/, {
    message:
      'Surname must start with a capital letter, contain only letters, and be at most 25 characters long.',
  })
  surname: string;

  @IsString()
  @IsStrongPassword()
  password: string;

  @IsNumber()
  @IsPositive()
  age: number;
}
