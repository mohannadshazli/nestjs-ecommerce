import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';
import { CartItems } from './cart-items.schema';

export type CartDocument = HydratedDocument<Cart>;

@Schema({
  timestamps: true,
})
export class Cart {
  @Prop({
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    trim: true,
  })
  user_id: Types.ObjectId;

  @Prop({ type: [{ type: mongoose.Schema.Types.ObjectId, ref: 'CartItems' }] })
  cart_items_ids: Types.ObjectId[];

  @Prop({ type: Number, default: 0 })
  total_price: number;
}

export const CartSchema = SchemaFactory.createForClass(Cart);
