import { ApiProperty } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsString,
  Length,
  MinLength,
} from 'class-validator';
import { Match } from 'src/common/decorators/match.decorator';

export class RegisterDto {
  @ApiProperty()
  @Length(2, 50)
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiProperty()
  @Length(2, 50)
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty({ example: 'user@example.com' })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @MinLength(6)
  @IsString()
  @IsNotEmpty()
  password: string;

  @ApiProperty()
  @Match('password', { message: 'Passwords do not match' })
  passwordConfirm: string;
}
