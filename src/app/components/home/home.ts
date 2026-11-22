import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { Banner } from '../../models/banner';
import { ProductService } from '../../services/product.service';
import { BannerService } from '../../services/banner.service';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-home',
  standalone: true,
  templateUrl: './home.html',
  styleUrl: './home.css',
})
export class Home implements OnInit {
  private productService = inject(ProductService);
  private bannerService = inject(BannerService);
  private cartService = inject(CartService);

  products = signal<Product[]>([]);
  banners = signal<Banner[]>([]);
  isLoading = signal<boolean>(true);
  errorMessage = signal<string>('');

  // 1. Sản phẩm mới: sắp xếp theo ID giảm dần, lấy 4 sản phẩm
  newProducts = computed(() =>
    [...this.products()]
      .sort((a, b) => b.id - a.id)
      .slice(0, 4)
  );

  // 2. Sản phẩm khuyến mãi: lọc discount > 0, sắp xếp giảm dần theo discount
  saleProducts = computed(() =>
    [...this.products()]
      .filter((p) => p.discount > 0)
      .sort((a, b) => b.discount - a.discount)
      .slice(0, 4)
  );

  // 3. Sản phẩm bán chạy: sắp xếp theo số lượng bán (sold) giảm dần
  bestSellingProducts = computed(() =>
    [...this.products()]
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 4)
  );

  ngOnInit(): void {
    this.loadData();
  }

  loadData(): void {
    this.isLoading.set(true);

    // Load tất cả sản phẩm cho các section
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải sản phẩm từ backend:', err);
        this.errorMessage.set('Không thể kết nối đến server backend.');
        this.isLoading.set(false);
      },
    });

    // Load 3 banner mới nhất cho trang chủ
    this.bannerService.getLatestBanners(3).subscribe({
      next: (data) => {
        this.banners.set(data);
      },
      error: (err) => {
        console.error('Lỗi khi tải banners:', err);
      },
    });
  }

  buyNow(product: Product): void {
    this.cartService.addToCart(product, 1);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }
}
