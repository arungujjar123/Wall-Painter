import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Pattern } from '../models/pattern.model';

@Injectable({
  providedIn: 'root'
})
export class PatternService {
  private apiUrl = `${environment.apiUrl}/patterns`;

  constructor(private http: HttpClient) {}

  getAllPatterns(category?: string): Observable<{ success: boolean; data: { patterns: Pattern[]; count: number } }> {
    let params = new HttpParams();
    if (category) params = params.set('category', category);
    return this.http.get<{ success: boolean; data: { patterns: Pattern[]; count: number } }>(this.apiUrl, { params });
  }

  getPatternById(id: string): Observable<{ success: boolean; data: { pattern: Pattern } }> {
    return this.http.get<{ success: boolean; data: { pattern: Pattern } }>(`${this.apiUrl}/${id}`);
  }

  createPattern(formData: FormData): Observable<{ success: boolean; data: { pattern: Pattern } }> {
    return this.http.post<{ success: boolean; data: { pattern: Pattern } }>(this.apiUrl, formData);
  }

  updatePattern(id: string, data: Partial<Pattern>): Observable<{ success: boolean; data: { pattern: Pattern } }> {
    return this.http.put<{ success: boolean; data: { pattern: Pattern } }>(`${this.apiUrl}/${id}`, data);
  }

  deletePattern(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
