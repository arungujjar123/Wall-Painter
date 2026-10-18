import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { Project } from '../../core/models/project.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="gallery-page">
      <div class="container">
        <!-- Gallery Header -->
        <div class="gallery-header text-center">
          <span class="badge badge-primary">Community Showcase</span>
          <h1 class="gallery-title">Virtual Room Inspiration Gallery</h1>
          <p class="gallery-subtitle">
            Explore realistic interior room transformations painted and submitted by homeowners, designers, and architects.
          </p>
        </div>

        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Fetching shared designs...</p>
          </div>
        } @else if (projects.length === 0) {
          <div class="card empty-gallery">
            <div class="empty-icon"><i class="bi bi-images"></i></div>
            <h3>Be The First To Showcase Your Room</h3>
            <p>No community designs published yet. Jump into the visualizer studio, style a room, and check "Share publicly" to feature your work!</p>
            <a routerLink="/visualizer" class="btn btn-primary mt-2">
              <i class="bi bi-brush"></i> Open Visualizer Studio
            </a>
          </div>
        } @else {
          <div class="grid grid-cols-3 gallery-grid">
            @for (project of projects; track project._id) {
              <div class="card gallery-card">
                <div class="gallery-img-wrapper">
                  <img 
                    [src]="getImageUrl(project.paintedImage || project.originalImage)" 
                    [alt]="project.name" 
                    class="gallery-img">
                  <div class="gallery-badge-overlay">
                    <span class="badge badge-primary">
                      {{ project.wallSelections.length }} Walls Styled
                    </span>
                  </div>
                </div>

                <div class="gallery-card-body">
                  <h3 class="gallery-card-title">{{ project.name }}</h3>
                  
                  <div class="user-creator">
                    <div class="creator-avatar">
                      <i class="bi bi-person"></i>
                    </div>
                    <span class="creator-name">{{ getCreatorName(project.user) }}</span>
                  </div>

                  <div class="gallery-card-footer">
                    <button class="btn btn-outline btn-sm w-100" (click)="remixInVisualizer(project)">
                      <i class="bi bi-sliders"></i> Try In Visualizer
                    </button>
                  </div>
                </div>
              </div>
            }
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .gallery-page {
      padding: 3.5rem 0 6rem;
    }
    .gallery-header {
      margin-bottom: 3.5rem;
    }
    .gallery-title {
      font-size: 2.75rem;
      font-weight: 800;
      margin: 0.75rem 0;
    }
    .gallery-subtitle {
      color: var(--text-muted);
      font-size: 1.05rem;
      max-width: 650px;
      margin: 0 auto;
    }
    .gallery-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .gallery-img-wrapper {
      position: relative;
      width: 100%;
      height: 220px;
      background: #0f1523;
      overflow: hidden;
    }
    .gallery-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
    .gallery-card:hover .gallery-img {
      transform: scale(1.05);
    }
    .gallery-badge-overlay {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
    }
    .gallery-card-body {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .gallery-card-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.75rem;
    }
    .user-creator {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .creator-avatar {
      width: 26px;
      height: 26px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      color: var(--primary);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.75rem;
    }
    .creator-name {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .gallery-card-footer {
      margin-top: auto;
    }
    .empty-gallery {
      text-align: center;
      padding: 4rem 2rem;
    }
    .empty-icon {
      font-size: 3rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }
    .empty-gallery h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .empty-gallery p {
      color: var(--text-muted);
      max-width: 500px;
      margin: 0 auto;
    }
    .mt-2 { margin-top: 1.5rem; }
    .w-100 { width: 100%; }
    .text-center { text-align: center; }
    .loading-state {
      text-align: center;
      padding: 4rem 0;
      color: var(--text-muted);
    }
    .spinner {
      width: 2rem;
      height: 2rem;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-top-color: var(--primary);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      margin: 0 auto 1rem;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class GalleryComponent implements OnInit {
  projects: Project[] = [];
  loading = true;

  constructor(private projectService: ProjectService, private router: Router) {}

  ngOnInit() {
    this.loadGalleryProjects();
  }

  loadGalleryProjects() {
    this.loading = true;
    this.projectService.getPublicProjects().subscribe({
      next: (res) => {
        this.projects = res.data?.projects || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getCreatorName(user: any): string {
    if (!user) return 'Community Member';
    if (typeof user === 'string') return 'Community Member';
    return user.name || 'Community Member';
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    return `${environment.serverUrl}${path}`;
  }

  remixInVisualizer(project: Project) {
    this.router.navigate(['/visualizer'], { queryParams: { projectId: project._id } });
  }
}
