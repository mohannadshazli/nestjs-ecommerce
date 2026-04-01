import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly JwtService: JwtService,
  ) {}
  async register(registerDto: RegisterDto) {
    const user = await this.userService.createUserforRegisteration(registerDto);

    const accessToken = await this.JwtService.signAsync({
      id: user._id,
      role: user.role,
    });

    return accessToken;
  }

  async login(loginDto: LoginDto) {
    const user = await this.userService.isExist(loginDto.email);
    if (!user) {
      throw new BadRequestException('Email or password is incorrect');
    }
    const isPasswordValid = await user.comparePassword(loginDto.password);

    if (!isPasswordValid) {
      throw new BadRequestException('Email or password is incorrect');
    }

    const accessToken = await this.JwtService.signAsync({
      id: user._id,
      role: user.role,
    });

    return accessToken;
  }
}
