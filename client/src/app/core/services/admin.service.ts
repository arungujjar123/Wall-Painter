import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface DashboardStats {
  totalUsers: number;
  totalProjects: number;
  totalColors: number;
  totalPatterns: number;
  recentUsers: any[];
  recentProjects: any[];
  projectsPerDay: any[];
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient) {}

  getDashboardStats(): Observable<{ success: boolean; data: DashboardStats }> {
    return this.http.get<{ success: boolean; data: DashboardStats }>(`${this.apiUrl}/dashboard`);
  }

  getAllUsers(page = 1, limit = 20, search?: string): Observable<any> {
    let params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    if (search) params = params.set('search', search);
    return this.http.get(`${this.apiUrl}/users`, { params });
  }

  updateUserRole(userId: string, role: 'user' | 'admin'): Observable<any> {
    return this.http.put(`${this.apiUrl}/users/${userId}/role`, { role });
  }

  deleteUser(userId: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/users/${userId}`);
  }

  getSystemInfo(): Observable<any> {
    return this.http.get(`${this.apiUrl}/system`);
  }
}
