import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="auth-wrapper">
      <div class="auth-card">
        <div class="auth-header">
          <div class="auth-logo-badge">
            <i class="bi bi-person-lock"></i>
          </div>
          <h2>Welcome Back</h2>
          <p>Log in to access your saved room projects and custom palettes</p>
        </div>

        @if (errorMessage) {
          <div class="alert alert-danger">
            <i class="bi bi-exclamation-triangle"></i>
            <span>{{ errorMessage }}</span>
          </div>
        }

        <form (ngSubmit)="onSubmit()" class="auth-form">
          <div class="form-group">
            <label class="form-label" for="email">Email Address</label>
            <input 
              type="email" 
              id="email" 
              name="email" 
              [(ngModel)]="email" 
              class="form-control" 
              placeholder="e.g. user@wallpaint.com"
              required>
          </div>

          <div class="form-group">
            <div class="d-flex justify-between align-center">
              <label class="form-label" for="password">Password</label>
            </div>
            <input 
              type="password" 
              id="password" 
              name="password" 
              [(ngModel)]="password" 
              class="form-control" 
              placeholder="••••••••"
              required>
          </div>

          <button type="submit" class="btn btn-primary w-100" [disabled]="loading">
            @if (loading) {
              <span class="spinner"></span> Logging In...
            } @else {
              <i class="bi bi-box-arrow-in-right"></i> Sign In to Account
            }
          </button>
        </form>

        <div class="demo-credentials">
          <p class="demo-title">Quick Demo Logins (Click to autofill):</p>
          <div class="demo-btn-group">
            <button type="button" class="btn btn-secondary btn-sm" (click)="fillDemo('user')">
              <i class="bi bi-person"></i> Demo User
            </button>
            <button type="button" class="btn btn-secondary btn-sm" (click)="fillDemo('admin')">
              <i class="bi bi-shield-check"></i> Admin Account
            </button>
          </div>
        </div>

        <div class="auth-footer">
          <p>Don't have an account? <a routerLink="/register">Create an account</a></p>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-wrapper {
      min-height: calc(100vh - 160px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 2rem 1.5rem;
    }
    .auth-card {
      width: 100%;
      max-width: 440px;
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 2.5rem;
      box-shadow: var(--shadow-lg);
    }
    .auth-header {
      text-align: center;
      margin-bottom: 2rem;
    }
    .auth-logo-badge {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      background: rgba(var(--primary-rgb), 0.15);
      color: var(--primary);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      font-size: 1.6rem;
      margin-bottom: 1rem;
    }
    .auth-header h2 {
      font-size: 1.75rem;
      margin-bottom: 0.5rem;
    }
    .auth-header p {
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .alert-danger {
      background: rgba(239, 68, 68, 0.12);
      border: 1px solid rgba(239, 68, 68, 0.3);
      color: #f87171;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.5rem;
    }
    .w-100 {
      width: 100%;
    }
    .demo-credentials {
      margin-top: 1.75rem;
      padding-top: 1.5rem;
      border-top: 1px dashed var(--border-color);
    }
    .demo-title {
      font-size: 0.8rem;
      color: var(--text-dim);
      margin-bottom: 0.75rem;
      text-align: center;
    }
    .demo-btn-group {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
    }
    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      font-size: 0.875rem;
      color: var(--text-muted);
    }
    .spinner {
      display: inline-block;
      width: 1rem;
      height: 1rem;
      border: 2px solid rgba(0, 0, 0, 0.2);
      border-top-color: #000;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent {
  email = '';
  password = '';
  loading = false;
  errorMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  fillDemo(type: 'user' | 'admin') {
    if (type === 'admin') {
      this.email = 'admin@wallpaint.com';
      this.password = 'admin123';
    } else {
      this.email = 'user@wallpaint.com';
      this.password = 'user123';
    }
  }

  onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Please provide both email and password.';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        const returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
        this.router.navigateByUrl(returnUrl);
      },
      error: (err) => {
        this.loading = false;
        this.errorMessage = err.error?.message || 'Login failed. Please check your credentials.';
      }
    });
  }
}
