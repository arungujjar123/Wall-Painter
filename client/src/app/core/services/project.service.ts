import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Project } from '../models/project.model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  private apiUrl = `${environment.apiUrl}/projects`;

  constructor(private http: HttpClient) {}

  createProject(formData: FormData): Observable<{ success: boolean; data: { project: Project } }> {
    return this.http.post<{ success: boolean; data: { project: Project } }>(this.apiUrl, formData);
  }

  getUserProjects(page = 1, limit = 20): Observable<{ success: boolean; data: { projects: Project[]; pagination: any } }> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<{ success: boolean; data: { projects: Project[]; pagination: any } }>(this.apiUrl, { params });
  }

  getPublicProjects(page = 1, limit = 20): Observable<{ success: boolean; data: { projects: Project[]; pagination: any } }> {
    const params = new HttpParams().set('page', page.toString()).set('limit', limit.toString());
    return this.http.get<{ success: boolean; data: { projects: Project[]; pagination: any } }>(`${this.apiUrl}/public`, { params });
  }

  getProjectById(id: string): Observable<{ success: boolean; data: { project: Project } }> {
    return this.http.get<{ success: boolean; data: { project: Project } }>(`${this.apiUrl}/${id}`);
  }

  updateProject(id: string, data: Partial<Project>): Observable<{ success: boolean; data: { project: Project } }> {
    return this.http.put<{ success: boolean; data: { project: Project } }>(`${this.apiUrl}/${id}`, data);
  }

  saveDesign(id: string, designData: { paintedImage: string; wallSelections?: any[]; name?: string }): Observable<{ success: boolean; data: { project: Project } }> {
    return this.http.put<{ success: boolean; data: { project: Project } }>(`${this.apiUrl}/${id}/design`, designData);
  }

  deleteProject(id: string): Observable<{ success: boolean; message: string }> {
    return this.http.delete<{ success: boolean; message: string }>(`${this.apiUrl}/${id}`);
  }
}
