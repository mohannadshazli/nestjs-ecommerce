import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import mongoose, { HydratedDocument, Types } from 'mongoose';

export type CartItemsDocument = HydratedDocument<CartItems>;

@Schema({
  timestamps: true,
})
export class CartItems {
  @Prop({
    type: Types.ObjectId,
    ref: 'Cart',
    required: true,
    trim: true,
  })
  cart_id: Types.ObjectId;
  @Prop({
    type: Types.ObjectId,
    ref: 'Product',
    required: true,
    trim: true,
  })
  product_id: Types.ObjectId;
  @Prop({
    required: true,
    trim: true,
  })
  quantity: number;
}

export const CartItemsSchema = SchemaFactory.createForClass(CartItems);
