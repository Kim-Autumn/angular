import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { ProductService } from '../../services/product.service';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-product',
  standalone: true,
  styleUrl: './product.css',
  templateUrl: './product.html',
})
export class ProductComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private cartService = inject(CartService);

  product = signal<Product | null>(null);
  quantity = signal<number>(1);
  isLoading = signal<boolean>(true);
  notFound = signal<boolean>(false);

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const slugOrId = params.get('slug') || params.get('id');
      if (slugOrId) {
        this.loadProduct(slugOrId);
      }
    });
  }

  loadProduct(idOrSlug: string): void {
    this.isLoading.set(true);
    this.notFound.set(false);

    this.productService.getProductById(idOrSlug).subscribe({
      next: (data) => {
        this.product.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải chi tiết sản phẩm:', err);
        this.notFound.set(true);
        this.isLoading.set(false);
      },
    });
  }

  increaseQty(): void {
    this.quantity.update((q) => q + 1);
  }

  decreaseQty(): void {
    this.quantity.update((q) => (q > 1 ? q - 1 : 1));
  }

  addToCart(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
      alert(`Đã thêm ${this.quantity()} bó "${p.name}" vào giỏ hàng!`);
    }
  }

  buyNow(): void {
    const p = this.product();
    if (p) {
      this.cartService.addToCart(p, this.quantity());
      this.router.navigate(['/cart']);
    }
  }
}

export { ProductComponent as Product };
