import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Color, ColorFilter } from '../models/color.model';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  private apiUrl = `${environment.apiUrl}/colors`;

  constructor(private http: HttpClient) {}

  getAllColors(filter?: ColorFilter): Observable<{ success: boolean; data: { colors: Color[]; count: number } }> {
    let params = new HttpParams();
    if (filter?.category) params = params.set('category', filter.category);
    if (filter?.brand) params = params.set('brand', filter.brand);
    if (filter?.finish) params = params.set('finish', filter.finish);
    if (filter?.search) params = params.set('search', filter.search);

    return this.http.get<{ success: boolean; data: { colors: Color[]; count: number } }>(this.apiUrl, { params });
  }

  getColorById(id: string): Observable<{ success: boolean; data: { color: Color } }> {
    return this.http.get<{ success: boolean; data: { color: Color } }>(`${this.apiUrl}/${id}`);
  }

  getCategories(): Observable<{ success: boolean; data: { categories: string[] } }> {
    return this.http.get<{ success: boolean; data: { categories: string[] } }>(`${this.apiUrl}/categories`);
  }

  getBrands(): Observable<{ success: boolean; data: { brands: string[] } }> {
    return this.http.get<{ success: boolean; data: { brands: string[] } }>(`${this.apiUrl}/brands`);
  }

  createColor(colorData: Partial<Color>): Observable<{ success: boolean; data: { color: Color } }> {
    return this.http.post<{ success: boolean; data: { color: Color } }>(this.apiUrl, colorData);
  }

  updateColor(id: string, colorData: Partial<Color>): Observable<{ success: boolean; data: { color: Color } }> {
    return this.http.put<{ success: boolean; data: { color: Color } }>(`${this.apiUrl}/${id}`, colorData);
  }

  deleteColor(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
