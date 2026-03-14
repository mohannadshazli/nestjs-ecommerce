import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from 'src/auth/auth.module';
import { BrandsModule } from 'src/brands/brands.module';
import { CartModule } from 'src/cart/cart.module';
import { CategoriesModule } from 'src/categories/categories.module';
import { OrdersModule } from 'src/orders/orders.module';
import { PaymentModule } from 'src/payment/payment.module';
import { ProductsModule } from 'src/products/products.module';
import { UsersModule } from 'src/users/users.module';
import { AppConfigModule } from 'src/common/config/config.module';

@Module({
  imports: [
    AppConfigModule,
    AuthModule,
    BrandsModule,
    CartModule,
    CategoriesModule,
    OrdersModule,
    PaymentModule,
    ProductsModule,
    UsersModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
