import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Req,
  HttpStatus,
  UseGuards,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { AuthGuard } from 'src/auth/guards/auth.guard';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { ParseObjectIdPipe } from '@nestjs/mongoose';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @ApiBody({ type: CreateCartDto })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Post()
  create(@Body() createCartDto: CreateCartDto, @Req() req: any) {
    return this.cartService.create(
      createCartDto.product_id,
      createCartDto.quantity,
      req.user.id,
    );
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get()
  getMyCart(@Req() req: any) {
    return this.cartService.get(req.user.id);
  }

  @ApiBody({
    description: 'increase cart item quantity by 1',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/item/:id/increase-quantity')
  increaseQuantity(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cartService.increaseQuantity(id);
  }

  @ApiBody({
    description: 'decrease cart item quantity by 1',
  })
  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Patch('/item/:id/decrease-quantity')
  decreaseQuantity(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cartService.decreaseQuantity(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/item/:id')
  remove(@Param('id', ParseObjectIdPipe) id: string) {
    return this.cartService.remove(id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Get('/total-price')
  getTotalPrice(@Req() req: any) {
    return this.cartService.getTotalPrice(req.user.id);
  }

  @ApiBearerAuth()
  @UseGuards(AuthGuard)
  @Delete('/clear')
  clearCart(@Req() req: any) {
    return this.cartService.clearCart(req.user.id);
  }
}
