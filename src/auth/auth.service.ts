import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { User, UserDocument } from 'src/users/schema/user.schema';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly JwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const existing = await this.userService.findByEmail(registerDto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }

    const user = await this.userService.createUser(registerDto);

    const accessToken = this.JwtService.signAsync({ id: user._id });

    return accessToken;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.findByEmail(loginDto.email);
    console.log(user);
    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const isPasswordValid = await user.comparePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const accessToken = this.JwtService.signAsync({ id: user._id });

    return accessToken;
  }
}
