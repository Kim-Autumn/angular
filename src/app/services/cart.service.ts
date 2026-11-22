import { Injectable, signal, computed } from '@angular/core';
import { Product } from '../models/product';
import { CartItem } from '../models/cart-item';

const CART_STORAGE_KEY = 'bhshop_cart';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  cartItems = signal<CartItem[]>(this.loadFromStorage());

  // Tổng số lượng món hàng trong giỏ
  totalCount = computed(() =>
    this.cartItems().reduce((sum, item) => sum + item.quantity, 0)
  );

  // Tổng tiền thực tế của giỏ hàng
  totalPrice = computed(() =>
    this.cartItems().reduce((sum, item) => {
      const numericPrice = this.parsePrice(item.product.price);
      return sum + numericPrice * item.quantity;
    }, 0)
  );

  // Thêm sản phẩm vào giỏ
  addToCart(product: Product, quantity: number = 1): void {
    const currentItems = [...this.cartItems()];
    const existingIndex = currentItems.findIndex(
      (item) => item.product.id === product.id
    );

    if (existingIndex > -1) {
      currentItems[existingIndex] = {
        ...currentItems[existingIndex],
        quantity: currentItems[existingIndex].quantity + quantity,
      };
    } else {
      currentItems.push({ product, quantity });
    }

    this.saveToStorage(currentItems);
  }

  // Cập nhật số lượng (+1 hoặc -1)
  updateQuantity(productId: number, delta: number): void {
    let currentItems = [...this.cartItems()];
    const itemIndex = currentItems.findIndex(
      (item) => item.product.id === productId
    );

    if (itemIndex > -1) {
      const newQty = currentItems[itemIndex].quantity + delta;
      if (newQty <= 0) {
        currentItems.splice(itemIndex, 1);
      } else {
        currentItems[itemIndex] = {
          ...currentItems[itemIndex],
          quantity: newQty,
        };
      }
      this.saveToStorage(currentItems);
    }
  }

  // Xóa hẳn 1 sản phẩm khỏi giỏ
  removeFromCart(productId: number): void {
    const updated = this.cartItems().filter(
      (item) => item.product.id !== productId
    );
    this.saveToStorage(updated);
  }

  // Xóa toàn bộ giỏ
  clearCart(): void {
    this.saveToStorage([]);
  }

  private parsePrice(priceStr: string | number): number {
    if (typeof priceStr === 'number') return priceStr;
    const clean = String(priceStr).replace(/[^0-9]/g, '');
    return parseInt(clean, 10) || 0;
  }

  private loadFromStorage(): CartItem[] {
    try {
      const raw = localStorage.getItem(CART_STORAGE_KEY);
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  }

  private saveToStorage(items: CartItem[]): void {
    this.cartItems.set(items);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error('Không thể lưu giỏ hàng vào LocalStorage', e);
    }
  }
}
