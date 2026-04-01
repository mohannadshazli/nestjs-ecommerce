import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({
    type: Types.ObjectId,
    ref: 'User',
    required: true,
    trim: true,
  })
  user_id: Types.ObjectId;

  @Prop({ type: [{ type: Types.ObjectId, ref: 'CartItems' }] })
  cart_items_ids: Types.ObjectId[];
}

export const CartSchema = SchemaFactory.createForClass(Cart);
