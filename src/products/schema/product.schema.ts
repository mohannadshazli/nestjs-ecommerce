import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

@Schema({
  timestamps: true,
})
export class Product {
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 100,
  })
  name: string;
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 500,
  })
  description: string;
  @Prop({
    required: true,
    trim: true,
    min: 0,
  })
  price: number;
  @Prop({
    required: true,
    trim: true,
    min: 0,
  })
  stock: number;
  @Prop({
    required: true,
    trim: true,
    minlength: 2,
    maxlength: 50,
  })
  category: string;
  @Prop({
    trim: true,
    default: 'http://localhost:3000/uploads/products/default.jpeg',
  })
  productImageUrl?: string;
  @Prop({
    trim: true,
    default: [],
  })
  productImagesUrls?: string[];
}

export const ProductSchema = SchemaFactory.createForClass(Product);
