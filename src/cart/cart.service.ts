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
    let cart = await this.cartModel.findOne({ user_id }).populate({
      path: 'cart_items_ids',
      populate: { path: 'product_id' },
    });
    if (!cart) {
      throw new BadRequestException(
        'You have to add at least one product to the cart',
      );
    }
    return cart;
  }

  async create(productId: string, quantity: number = 1, userId: string) {
    if (quantity <= 0) {
      throw new BadRequestException('Quantity must be at least 1');
    }

    if (!Types.ObjectId.isValid(productId)) {
      throw new BadRequestException('Invalid product ID');
    }
    const cart = await this.getOrCreateCart(userId);

    const product = await this.validateProduct(productId, quantity);

    const existingItem = await this.cartItemsModel.findOne({
      cart_id: cart._id,
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

  async increaseQuantity(cartItemId: string) {
    const cartItem = await this.cartItemsModel.findById(cartItemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    const product = await this.productService.findOne(
      cartItem.product_id.toString(),
    );

    if (!product) {
      throw new NotFoundException('Product not found');
    }

    if (cartItem.quantity + 1 > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} items available in stock`,
      );
    }

    // Atomic update with validation
    const updated = await this.cartItemsModel.findOneAndUpdate(
      {
        _id: cartItemId,
        quantity: { $lt: product.stock }, // Ensure we don't exceed stock
      },
      { $inc: { quantity: 1 } },
      { new: true },
    );

    if (!updated) {
      throw new BadRequestException('Could not increase quantity');
    }

    return updated;
  }

  async decreaseQuantity(cartItemId: string) {
    const cartItem = await this.cartItemsModel.findById(cartItemId);

    if (!cartItem) {
      throw new NotFoundException('Cart item not found');
    }

    // If quantity is 1, remove instead of decreasing
    if (cartItem.quantity === 1) {
      await this.remove(cartItemId);
      return { removed: true, message: 'Item removed from cart' };
    }

    // Decrease quantity atomically (prevent going below 0)
    const updated = await this.cartItemsModel.findOneAndUpdate(
      { _id: cartItemId, quantity: { $gt: 1 } },
      { $inc: { quantity: -1 } },
      { new: true },
    );

    if (!updated) {
      throw new BadRequestException('Cannot decrease quantity');
    }

    return { removed: false, cartItem: updated };
  }

  async remove(id: string) {
    const cartItem = await this.cartItemsModel.findById(id);
    if (!cartItem) {
      throw new NotFoundException('Item not found in this cart');
    }

    await this.cartModel.findByIdAndUpdate(cartItem.cart_id, {
      $pull: { cart_items_ids: id },
    });

    await this.cartItemsModel.findByIdAndDelete(id);

    return { message: 'Item removed successfully' };
  }

  async getTotalPrice(userId: string) {
    const cart = await this.cartModel.findOne({ user_id: userId.toString() });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    const result = await this.cartItemsModel.aggregate([
      { $match: { cart_id: cart._id } },
      {
        $lookup: {
          from: 'products',
          localField: 'product_id',
          foreignField: '_id',
          as: 'product',
        },
      },
      { $unwind: '$product' },
      {
        $group: {
          _id: null,
          total: { $sum: { $multiply: ['$quantity', '$product.price'] } },
        },
      },
    ]);
    console.log(result);

    return result[0]?.total || 0;
  }

  async clearCart(userId: string) {
    const cart = await this.cartModel.findOne({ user_id: userId });

    if (!cart) {
      throw new NotFoundException('Cart not found');
    }

    await this.cartItemsModel.deleteMany({
      cart_id: cart._id.toString(),
    });

    await this.cartModel.findByIdAndUpdate(cart._id, {
      cart_items_ids: [],
    });

    return { message: 'Cart cleared successfully' };
  }
}
