import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import * as bcrypt from 'bcrypt';

export type UserDocument = HydratedDocument<User> & UserMethods;

export enum UserRole {
  CUSTOMER = 'customer',
  ADMIN = 'admin',
}

export interface UserMethods {
  comparePassword(password: string): Promise<boolean>;
}

@Schema({
  timestamps: true,
})
export class User {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  firstName: string;

  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  lastName: string;

  @Prop({
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
  })
  email: string;

  @Prop({
    required: true,
    minlength: 6,
    select: false,
  })
  password: string;

  @Prop({
    default: null,
  })
  phone?: string;

  @Prop({
    enum: UserRole,
    default: UserRole.CUSTOMER,
  })
  role: UserRole;

  @Prop({
    default: false,
  })
  isEmailVerified: boolean;

  @Prop({
    default: true,
  })
  isActive: boolean;

  @Prop({
    default: null,
  })
  avatar?: string;

  @Prop({
    default: null,
  })
  passwordResetToken?: string;

  @Prop({
    default: null,
  })
  passwordResetExpires?: Date;

  @Prop({
    default: null,
  })
  emailVerificationToken?: string;
}

export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.pre('save', async function () {
  if (!this.isModified('password')) return;

  this.password = await bcrypt.hash(this.password, 10);
});

UserSchema.methods.comparePassword = async function (
  password: string,
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};
