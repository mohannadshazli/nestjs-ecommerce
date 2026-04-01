import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { ProductsService } from 'src/products/products.service';
import { InjectModel } from '@nestjs/mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';
import { Model, ObjectId, Types } from 'mongoose';
import { CartItems, CartItemsDocument } from './schemas/cart-items.schema';

@Injectable()
export class CartService {
  constructor(
    @InjectModel(Cart.name) private readonly cartModel: Model<CartDocument>,
    @InjectModel(CartItems.name)
    private readonly cartItemsModel: Model<CartItemsDocument>,
    private readonly productService: ProductsService,
  ) {}

  async get(user_id: string) {
    let cart = await this.cartModel
      .findOne({ user_id })
      .select('cart_items_ids')
      .populate('cart_items_ids');
    if (!cart) {
      throw new BadRequestException(
        'You have to add at least one product to the cart',
      );
    }
    return cart;
  }

  async create(productId: string, quantity: number = 0, userId: string) {
    const cart = await this.getOrCreateCart(userId);

    const product = await this.validateProduct(productId, quantity);

    const existingItem = await this.cartItemsModel.findOne({
      cart_id: `${cart._id}`,
      product_id: productId,
    });
    if (existingItem) {
      if (existingItem.quantity + quantity > product.stock) {
        throw new BadRequestException('Not enough stock');
      }
      await this.updateQuantity(existingItem, quantity);
      return existingItem;
    }

    const cartItem = await this.addNewItem(`${cart._id}`, productId, quantity);

    return cartItem;
  }

  private async getOrCreateCart(userId: string) {
    let cart = await this.cartModel.findOne({ user_id: userId });

    if (!cart) {
      cart = await this.cartModel.create({
        user_id: userId,
        cart_items_ids: [],
      });
    }

    return cart;
  }

  private async validateProduct(productId: string, quantity: number) {
    const product = await this.productService.findOne(productId);

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (product.stock < quantity) {
      throw new BadRequestException('Not enough stock');
    }

    return product;
  }

  private async updateQuantity(item: any, quantity: number) {
    item.quantity += quantity;
    await item.save();
  }

  private async addNewItem(
    cartId: string,
    productId: string,
    quantity: number,
  ) {
    const cartItem = await this.cartItemsModel.create({
      cart_id: cartId,
      product_id: productId,
      quantity,
    });

    await this.cartModel.findByIdAndUpdate(cartId, {
      $push: { cart_items_ids: cartItem._id },
    });

    return cartItem;
  }

  async increaseQuantity(cartItemId: string, quantity: number) {
    let cartItem = await this.cartItemsModel.findById(cartItemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const product = await this.productService.findOne(
      cartItem.product_id.toString(),
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (cartItem.quantity + quantity > product.stock) {
      throw new BadRequestException('Stock limit exceeded');
    }

    await this.cartItemsModel.updateOne(
      { _id: cartItemId },
      { $inc: { quantity: 1 } },
    );
    return this.cartItemsModel.findById(cartItemId);
  }

  async decreaseQuantity(cartItemId: string, quantity: number) {
    const cartItem = await this.cartItemsModel.findByIdAndUpdate(
      cartItemId,
      { $inc: { quantity: -quantity } },
      { new: true },
    );
    if (cartItem!.quantity <= 0) {
      await this.remove(cartItemId);
      return null;
    }
    return cartItem;
  }

  async remove(id: string) {
    const cartItem = await this.cartItemsModel.findById(id);
    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }
    return null;
  }
}
