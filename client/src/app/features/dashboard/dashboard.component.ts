import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { Project } from '../../core/models/project.model';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="dashboard-page">
      <div class="container">
        <!-- Dashboard Header -->
        <div class="dashboard-header">
          <div class="welcome-box">
            @if (authService.currentUser$ | async; as user) {
              <h1>Welcome back, <span class="gradient-text">{{ user.name }}</span></h1>
            }
            <p class="subtitle">Manage your room design projects, custom wall palettes, and paint simulations.</p>
          </div>
          <div class="header-actions">
            <a routerLink="/visualizer" class="btn btn-primary">
              <i class="bi bi-plus-lg"></i> Start New Visualizer
            </a>
          </div>
        </div>

        <!-- Metric Cards -->
        <div class="grid grid-cols-4 stats-grid">
          <div class="card stat-card">
            <div class="stat-icon-wrapper bg-teal">
              <i class="bi bi-images"></i>
            </div>
            <div class="stat-info">
              <span class="stat-count">{{ projects.length }}</span>
              <span class="stat-desc">Saved Projects</span>
            </div>
          </div>

          <div class="card stat-card">
            <div class="stat-icon-wrapper bg-blue">
              <i class="bi bi-palette"></i>
            </div>
            <div class="stat-info">
              <span class="stat-count">{{ getTotalWalls() }}</span>
              <span class="stat-desc">Walls Painted</span>
            </div>
          </div>

          <div class="card stat-card">
            <div class="stat-icon-wrapper bg-purple">
              <i class="bi bi-eye"></i>
            </div>
            <div class="stat-info">
              <span class="stat-count">{{ getPublicCount() }}</span>
              <span class="stat-desc">Public in Gallery</span>
            </div>
          </div>

          <div class="card stat-card">
            <div class="stat-icon-wrapper bg-amber">
              <i class="bi bi-stars"></i>
            </div>
            <div class="stat-info">
              <span class="stat-count">PRO</span>
              <span class="stat-desc">Membership Plan</span>
            </div>
          </div>
        </div>

        <!-- Projects Section -->
        <div class="projects-section">
          <div class="section-top">
            <h2>Your Room Visualizations</h2>
            <span class="project-count-badge badge badge-gray">{{ projects.length }} Total</span>
          </div>

          @if (loading) {
            <div class="loading-state">
              <div class="spinner"></div>
              <p>Loading your design projects...</p>
            </div>
          } @else if (projects.length === 0) {
            <div class="card empty-state">
              <div class="empty-icon">
                <i class="bi bi-paint-bucket"></i>
              </div>
              <h3>No Room Designs Yet</h3>
              <p>You haven't saved any wall painting projects yet. Upload a photo of your living room, bedroom, or exterior to see the magic!</p>
              <a routerLink="/visualizer" class="btn btn-primary mt-2">
                <i class="bi bi-brush"></i> Launch Wall Visualizer
              </a>
            </div>
          } @else {
            <div class="grid grid-cols-3 project-grid">
              @for (project of projects; track project._id) {
                <div class="card project-card">
                  <div class="project-thumbnail-wrapper">
                    @if (project.paintedImage) {
                      <img [src]="getImageUrl(project.paintedImage)" [alt]="project.name" class="project-img">
                      <span class="badge badge-primary thumb-tag">Painted Preview</span>
                    } @else {
                      <img [src]="getImageUrl(project.originalImage)" [alt]="project.name" class="project-img">
                      <span class="badge badge-gray thumb-tag">Original Photo</span>
                    }
                  </div>

                  <div class="project-content">
                    <h3 class="project-title">{{ project.name || 'Untitled Room' }}</h3>
                    <p class="project-date">
                      <i class="bi bi-calendar3"></i> {{ project.createdAt | date:'mediumDate' }}
                    </p>

                    <div class="walls-badge-group">
                      <span class="badge badge-blue">
                        <i class="bi bi-layers"></i> {{ project.wallSelections.length }} Walls Styled
                      </span>
                      @if (project.isPublic) {
                        <span class="badge badge-primary"><i class="bi bi-globe"></i> Public</span>
                      }
                    </div>

                    <div class="project-actions">
                      <button (click)="openVisualizer(project)" class="btn btn-outline btn-sm">
                        <i class="bi bi-brush"></i> Edit in Visualizer
                      </button>
                      <button (click)="deleteProject(project._id)" class="btn btn-danger btn-sm" title="Delete">
                        <i class="bi bi-trash3"></i>
                      </button>
                    </div>
                  </div>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard-page {
      padding: 3rem 0 5rem;
    }
    .dashboard-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .welcome-box h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin-bottom: 0.4rem;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 1rem;
    }
    .stats-grid {
      margin-bottom: 3.5rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
    }
    .stat-icon-wrapper {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
    }
    .bg-teal { background: rgba(0, 229, 163, 0.15); color: var(--primary); }
    .bg-blue { background: rgba(59, 130, 246, 0.15); color: var(--secondary); }
    .bg-purple { background: rgba(139, 92, 246, 0.15); color: var(--accent-purple); }
    .bg-amber { background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); }
    .stat-info {
      display: flex;
      flex-direction: column;
    }
    .stat-count {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 800;
      color: #fff;
      line-height: 1.1;
    }
    .stat-desc {
      font-size: 0.825rem;
      color: var(--text-muted);
    }
    .section-top {
      display: flex;
      align-items: center;
      gap: 1rem;
      margin-bottom: 1.75rem;
    }
    .section-top h2 {
      font-size: 1.5rem;
    }
    .project-card {
      padding: 0;
      overflow: hidden;
      display: flex;
      flex-direction: column;
    }
    .project-thumbnail-wrapper {
      width: 100%;
      height: 190px;
      position: relative;
      background: #0f141f;
      overflow: hidden;
    }
    .project-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }
    .project-card:hover .project-img {
      transform: scale(1.04);
    }
    .thumb-tag {
      position: absolute;
      top: 0.75rem;
      left: 0.75rem;
    }
    .project-content {
      padding: 1.25rem;
      display: flex;
      flex-direction: column;
      flex: 1;
    }
    .project-title {
      font-size: 1.15rem;
      font-weight: 700;
      margin-bottom: 0.3rem;
    }
    .project-date {
      font-size: 0.8rem;
      color: var(--text-dim);
      margin-bottom: 0.75rem;
    }
    .walls-badge-group {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .project-actions {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-top: auto;
    }
    .empty-state {
      text-align: center;
      padding: 4rem 2rem;
    }
    .empty-icon {
      width: 72px;
      height: 72px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      color: var(--primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 2.25rem;
      margin-bottom: 1.5rem;
    }
    .empty-state h3 {
      font-size: 1.5rem;
      margin-bottom: 0.5rem;
    }
    .empty-state p {
      color: var(--text-muted);
      max-width: 480px;
      margin: 0 auto;
    }
    .mt-2 { margin-top: 1.5rem; }
    .loading-state {
      text-align: center;
      padding: 4rem 2rem;
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
export class DashboardComponent implements OnInit {
  projects: Project[] = [];
  loading = true;

  constructor(
    public authService: AuthService,
    private projectService: ProjectService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadProjects();
  }

  loadProjects() {
    this.loading = true;
    this.projectService.getUserProjects().subscribe({
      next: (res) => {
        this.projects = res.data?.projects || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  getTotalWalls(): number {
    return this.projects.reduce((acc, p) => acc + (p.wallSelections?.length || 0), 0);
  }

  getPublicCount(): number {
    return this.projects.filter(p => p.isPublic).length;
  }

  getImageUrl(path: string): string {
    if (!path) return '';
    if (path.startsWith('data:') || path.startsWith('http')) return path;
    return `${environment.serverUrl}${path}`;
  }

  openVisualizer(project: Project) {
    this.router.navigate(['/visualizer'], { queryParams: { projectId: project._id } });
  }

  deleteProject(id: string) {
    if (confirm('Are you sure you want to delete this room project?')) {
      this.projectService.deleteProject(id).subscribe({
        next: () => {
          this.projects = this.projects.filter(p => p._id !== id);
        }
      });
    }
  }
}
