import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { AdminService } from '../../../core/services/admin.service';
import { User } from '../../../core/models/user.model';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="container">
        <!-- Header -->
        <div class="admin-header">
          <div>
            <a routerLink="/admin" class="back-link"><i class="bi bi-arrow-left"></i> Back to Dashboard</a>
            <h1>User Accounts & Access</h1>
            <p class="subtitle">Manage customer accounts, grant administrative access, and review registered members.</p>
          </div>
        </div>

        <!-- Search Card -->
        <div class="card filter-card mb-3">
          <div class="search-box">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="onSearch()" 
              placeholder="Search user by name or email..." 
              class="form-control form-control-sm">
          </div>
        </div>

        <!-- Users Table -->
        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Fetching user accounts...</p>
          </div>
        } @else {
          <div class="card table-card">
            <div class="table-responsive">
              <table class="user-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Email Address</th>
                    <th>Role</th>
                    <th>Registered</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  @for (user of users; track user._id) {
                    <tr>
                      <td>
                        <div class="user-cell">
                          <div class="avatar-cell">
                            {{ user.name.charAt(0).toUpperCase() }}
                          </div>
                          <strong>{{ user.name }}</strong>
                        </div>
                      </td>
                      <td class="text-muted">{{ user.email }}</td>
                      <td>
                        <select 
                          [ngModel]="user.role" 
                          (ngModelChange)="changeRole(user, $event)" 
                          class="form-control form-control-sm role-select">
                          <option value="user">User</option>
                          <option value="admin">Admin</option>
                        </select>
                      </td>
                      <td class="text-dim">{{ user.createdAt | date:'mediumDate' }}</td>
                      <td>
                        <button class="btn btn-danger btn-sm" (click)="deleteUser(user._id)" title="Delete User">
                          <i class="bi bi-trash3"></i>
                        </button>
                      </td>
                    </tr>
                  }
                </tbody>
              </table>
            </div>
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    .admin-page { padding: 3rem 0 5rem; }
    .back-link {
      font-size: 0.85rem;
      color: var(--text-muted);
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      margin-bottom: 0.5rem;
    }
    .admin-header {
      margin-bottom: 2rem;
    }
    .admin-header h1 {
      font-size: 2.25rem;
      font-weight: 800;
    }
    .subtitle { color: var(--text-muted); }
    .filter-card { padding: 1rem 1.25rem; }
    .search-box {
      position: relative;
      max-width: 400px;
    }
    .search-box i {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
    }
    .search-box input { padding-left: 2rem; }
    .table-card { padding: 0; overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    .user-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .user-table th {
      padding: 1rem 1.25rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-dim);
      text-transform: uppercase;
      border-bottom: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.02);
    }
    .user-table td {
      padding: 0.9rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
    }
    .user-cell {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .avatar-cell {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      color: var(--primary);
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 0.85rem;
      border: 1px solid var(--border-color);
    }
    .role-select {
      width: 110px;
      padding: 0.35rem 0.6rem;
      font-size: 0.8rem;
    }
    .text-dim { color: var(--text-dim); }
    .mb-3 { margin-bottom: 1.5rem; }
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
    @keyframes spin { to { transform: rotate(360deg); } }
  `]
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = true;
  searchQuery = '';

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers(1, 50, this.searchQuery).subscribe({
      next: (res) => {
        this.users = res.data?.users || [];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  onSearch() {
    this.loadUsers();
  }

  changeRole(user: User, newRole: 'user' | 'admin') {
    this.adminService.updateUserRole(user._id, newRole).subscribe({
      next: () => {
        user.role = newRole;
      },
      error: (err) => {
        alert(err.error?.message || 'Error updating user role.');
      }
    });
  }

  deleteUser(userId: string) {
    if (confirm('Are you sure you want to delete this user?')) {
      this.adminService.deleteUser(userId).subscribe({
        next: () => {
          this.users = this.users.filter(u => u._id !== userId);
        }
      });
    }
  }
}
