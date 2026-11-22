import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Banner } from '../models/banner';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class BannerService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/banners`;

  getBanners(): Observable<Banner[]> {
    return this.http.get<Banner[]>(this.apiUrl);
  }

  getLatestBanners(limit: number = 3): Observable<Banner[]> {
    return this.http.get<Banner[]>(`${this.apiUrl}/latest?limit=${limit}`);
  }
}
