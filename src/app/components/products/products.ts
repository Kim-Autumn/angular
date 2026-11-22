import { Component, OnInit, inject, signal } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../models/product';
import { Category } from '../../models/category';
import { ProductService } from '../../services/product.service';
import { CategoryService } from '../../services/category.service';
import { CartService } from '../../services/cart.service';

@Component({
  imports: [RouterLink],
  selector: 'app-products',
  standalone: true,
  styleUrl: './products.css',
  templateUrl: './products.html',
})
export class Products implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private productService = inject(ProductService);
  private categoryService = inject(CategoryService);
  cartService = inject(CartService);

  categories = signal<Category[]>([]);
  products = signal<Product[]>([]);
  isLoading = signal<boolean>(true);
  selectedCategorySlug = signal<string>('tat-ca');
  currentCategoryTitle = signal<string>('Tất cả hoa tươi');
  selectedSort = signal<string>('newest');
  searchKeyword = signal<string>('');

  ngOnInit(): void {
    // 1. Tải danh sách danh mục
    this.categoryService.getCategories().subscribe({
      next: (cats) => {
        this.categories.set(cats);
        this.updateCategoryTitle();
      },
      error: (err) => {
        console.error('Lỗi khi tải danh mục:', err);
      },
    });

    // 2. Lắng nghe thay đổi tham số slug
    this.route.paramMap.subscribe((params) => {
      const slug = params.get('slug') || 'tat-ca';
      this.selectedCategorySlug.set(slug);
      this.updateCategoryTitle();
      this.loadProducts();
    });

    // 3. Lắng nghe queryParams để tìm kiếm theo tên hoa (?search=...)
    this.route.queryParamMap.subscribe((qParams) => {
      const search = qParams.get('search') || '';
      this.searchKeyword.set(search);
      this.updateCategoryTitle();
      this.loadProducts();
    });
  }

  updateCategoryTitle(): void {
    const keyword = this.searchKeyword();
    if (keyword) {
      this.currentCategoryTitle.set(`Kết quả tìm kiếm cho: "${keyword}"`);
      return;
    }

    const slug = this.selectedCategorySlug();
    if (slug === 'tat-ca') {
      this.currentCategoryTitle.set('Tất cả hoa tươi');
      return;
    }
    const found = this.categories().find((c) => c.slug === slug);
    if (found) {
      this.currentCategoryTitle.set(found.name);
    } else {
      this.currentCategoryTitle.set('Danh mục hoa');
    }
  }

  loadProducts(): void {
    this.isLoading.set(true);
    const categorySlug = this.selectedCategorySlug();
    const sort = this.selectedSort();
    const search = this.searchKeyword();

    this.productService
      .getProducts({ categorySlug, sort, search })
      .subscribe({
        next: (data) => {
          this.products.set(data);
          this.isLoading.set(false);
        },
        error: (err) => {
          console.error('Lỗi khi tải sản phẩm:', err);
          this.isLoading.set(false);
        },
      });
  }

  onSelectSort(sortType: string): void {
    this.selectedSort.set(sortType);
    this.loadProducts();
  }

  buyNow(product: Product): void {
    this.cartService.addToCart(product, 1);
    alert(`Đã thêm "${product.name}" vào giỏ hàng!`);
  }
}
