import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Blog } from '../models/blog';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BlogService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/blogs`;

  getBlogs(): Observable<Blog[]> {
    return this.http.get<Blog[]>(this.apiUrl);
  }

  getBlogBySlug(slug: string): Observable<Blog> {
    return this.http.get<Blog>(`${this.apiUrl}/${slug}`);
  }
}
