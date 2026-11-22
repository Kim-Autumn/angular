import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-cart',
  standalone: true,
  styleUrl: './cart.css',
  templateUrl: './cart.html',
})
export class Cart {
  cartService = inject(CartService);

  cartItems = this.cartService.cartItems;
  totalCount = this.cartService.totalCount;
  totalPrice = this.cartService.totalPrice;

  increase(productId: number): void {
    this.cartService.updateQuantity(productId, 1);
  }

  decrease(productId: number): void {
    this.cartService.updateQuantity(productId, -1);
  }

  remove(productId: number): void {
    this.cartService.removeFromCart(productId);
  }

  alertCheckout(): void {
    alert('Cảm ơn bạn đã đặt hàng! Tổng đơn hàng: ' + this.formatPrice(this.totalPrice()));
  }

  formatPrice(val: number): string {
    return val.toLocaleString('vi-VN') + 'đ';
  }
}
