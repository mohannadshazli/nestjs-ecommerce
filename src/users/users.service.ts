import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { InjectModel } from '@nestjs/mongoose';
import { User, UserDocument } from './schema/user.schema';
import { Model } from 'mongoose';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async getUsers() {
    const users = await this.userModel.find();
    return users;
  }

  async createUserByManager(dto: CreateUserDto) {
    const existing = await this.isExist(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    const user = await this.userModel.create(dto);
    return user;
  }

  async createUserforRegisteration(dto: CreateUserDto) {
    const existing = await this.isExist(dto.email);
    if (existing) {
      throw new ConflictException('Email already exists');
    }
    return this.userModel.create(dto);
  }

  async isExist(email: string): Promise<UserDocument | null> {
    const existing = await this.userModel
      .findOne({ email })
      .select('+password')
      .exec();
    if (existing) {
      return existing;
    }
    return null;
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
