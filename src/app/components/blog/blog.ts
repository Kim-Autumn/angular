import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Blog } from '../../models/blog';
import { BlogService } from '../../services/blog.service';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.css',
})
export class BlogComponent implements OnInit {
  private blogService = inject(BlogService);

  blogs = signal<Blog[]>([]);
  isLoading = signal<boolean>(true);

  ngOnInit(): void {
    this.blogService.getBlogs().subscribe({
      next: (data) => {
        this.blogs.set(data);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Lỗi khi tải bài viết:', err);
        this.isLoading.set(false);
      },
    });
  }
}
