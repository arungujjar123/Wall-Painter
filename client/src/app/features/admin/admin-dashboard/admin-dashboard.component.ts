import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AdminService, DashboardStats } from '../../../core/services/admin.service';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="container">
        <!-- Admin Header -->
        <div class="admin-header">
          <div>
            <span class="badge badge-purple">System Administration</span>
            <h1>Administration Overview</h1>
            <p class="subtitle">Monitor platform metrics, paint palettes, registered users, and system performance.</p>
          </div>
          <div class="quick-admin-nav">
            <a routerLink="/admin/colors" class="btn btn-primary btn-sm">
              <i class="bi bi-palette"></i> Manage Colors
            </a>
            <a routerLink="/admin/users" class="btn btn-secondary btn-sm">
              <i class="bi bi-people"></i> Manage Users
            </a>
          </div>
        </div>

        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading analytics & system metrics...</p>
          </div>
        } @else if (stats) {
          <!-- Metric KPI Grid -->
          <div class="grid grid-cols-4 stats-grid">
            <div class="card stat-card">
              <div class="stat-icon bg-purple"><i class="bi bi-people"></i></div>
              <div>
                <span class="stat-num">{{ stats.totalUsers }}</span>
                <span class="stat-txt">Registered Users</span>
              </div>
            </div>

            <div class="card stat-card">
              <div class="stat-icon bg-teal"><i class="bi bi-images"></i></div>
              <div>
                <span class="stat-num">{{ stats.totalProjects }}</span>
                <span class="stat-txt">Room Visualizations</span>
              </div>
            </div>

            <div class="card stat-card">
              <div class="stat-icon bg-blue"><i class="bi bi-palette"></i></div>
              <div>
                <span class="stat-num">{{ stats.totalColors }}</span>
                <span class="stat-txt">Catalogued Shades</span>
              </div>
            </div>

            <div class="card stat-card">
              <div class="stat-icon bg-amber"><i class="bi bi-texture"></i></div>
              <div>
                <span class="stat-num">{{ stats.totalPatterns }}</span>
                <span class="stat-txt">Active Wallpapers</span>
              </div>
            </div>
          </div>

          <!-- Activity Grids -->
          <div class="grid grid-cols-2 mt-4">
            <!-- Recent Users -->
            <div class="card">
              <div class="d-flex justify-between align-center mb-2">
                <h3>Recent Users</h3>
                <a routerLink="/admin/users" class="view-all-link">View All</a>
              </div>
              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Name</th>
                      <th>Email</th>
                      <th>Role</th>
                      <th>Joined</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (user of stats.recentUsers; track user._id) {
                      <tr>
                        <td><strong>{{ user.name }}</strong></td>
                        <td class="text-muted">{{ user.email }}</td>
                        <td>
                          <span class="badge" [ngClass]="user.role === 'admin' ? 'badge-purple' : 'badge-gray'">
                            {{ user.role }}
                          </span>
                        </td>
                        <td class="text-dim">{{ user.createdAt | date:'shortDate' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>

            <!-- Recent Projects -->
            <div class="card">
              <div class="d-flex justify-between align-center mb-2">
                <h3>Latest Saved Projects</h3>
                <span class="badge badge-gray">Real-time Feed</span>
              </div>
              <div class="table-responsive">
                <table class="admin-table">
                  <thead>
                    <tr>
                      <th>Project Name</th>
                      <th>Creator</th>
                      <th>Created</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (proj of stats.recentProjects; track proj._id) {
                      <tr>
                        <td><strong>{{ proj.name }}</strong></td>
                        <td>{{ proj.user?.name || 'User' }}</td>
                        <td class="text-dim">{{ proj.createdAt | date:'shortDate' }}</td>
                      </tr>
                    }
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page {
      padding: 3rem 0 5rem;
    }
    .admin-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2.5rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .admin-header h1 {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0.5rem 0 0.3rem;
    }
    .subtitle {
      color: var(--text-muted);
      font-size: 0.95rem;
    }
    .quick-admin-nav {
      display: flex;
      gap: 0.75rem;
    }
    .badge-purple { background: rgba(139, 92, 246, 0.15); color: var(--accent-purple); }
    .stats-grid {
      margin-bottom: 2.5rem;
    }
    .stat-card {
      display: flex;
      align-items: center;
      gap: 1.25rem;
      padding: 1.5rem;
    }
    .stat-icon {
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
    .stat-num {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 800;
      color: #fff;
      display: block;
      line-height: 1.1;
    }
    .stat-txt {
      font-size: 0.8rem;
      color: var(--text-muted);
    }
    .mt-4 { margin-top: 2rem; }
    .mb-2 { margin-bottom: 1rem; }
    .view-all-link {
      font-size: 0.85rem;
      font-weight: 600;
    }
    .table-responsive {
      overflow-x: auto;
    }
    .admin-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .admin-table th {
      text-align: left;
      padding: 0.75rem 0.5rem;
      color: var(--text-dim);
      font-weight: 600;
      font-size: 0.75rem;
      text-transform: uppercase;
      border-bottom: 1px solid var(--border-color);
    }
    .admin-table td {
      padding: 0.85rem 0.5rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      color: var(--text-main);
    }
    .text-dim { color: var(--text-dim); }
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
export class AdminDashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  loading = true;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.adminService.getDashboardStats().subscribe({
      next: (res) => {
        this.stats = res.data;
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }
}
