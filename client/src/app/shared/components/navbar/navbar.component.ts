import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <header class="app-header">
      <div class="header-container">
        <!-- Logo -->
        <a routerLink="/" class="logo-group">
          <div class="logo-icon">
            <i class="bi bi-paint-bucket"></i>
          </div>
          <div class="logo-text">
            <span class="logo-brand">SmartWall</span>
            <span class="logo-tag">Paint Visualizer</span>
          </div>
        </a>

        <!-- Desktop Navigation -->
        <nav class="desktop-nav">
          <a routerLink="/" routerLinkActive="active" [routerLinkActiveOptions]="{exact: true}" class="nav-item">
            <i class="bi bi-house"></i> Home
          </a>
          <a routerLink="/visualizer" routerLinkActive="active" class="nav-item">
            <i class="bi bi-brush"></i> Visualizer
          </a>
          <a routerLink="/gallery" routerLinkActive="active" class="nav-item">
            <i class="bi bi-images"></i> Inspiration Gallery
          </a>
          @if (authService.currentUser$ | async; as user) {
            <a routerLink="/dashboard" routerLinkActive="active" class="nav-item">
              <i class="bi bi-grid-1x2"></i> My Designs
            </a>
            @if (user.role === 'admin') {
              <a routerLink="/admin" routerLinkActive="active" class="nav-item admin-badge-link">
                <i class="bi bi-shield-lock"></i> Admin Panel
              </a>
            }
          }
        </nav>

        <!-- Right User Actions -->
        <div class="header-actions">
          @if (authService.currentUser$ | async; as user) {
            <div class="user-profile-menu">
              <div class="user-avatar" (click)="toggleDropdown()">
                <span>{{ user.name.charAt(0).toUpperCase() }}</span>
              </div>
              <div class="user-info d-none-mobile">
                <span class="user-name">{{ user.name }}</span>
                <span class="user-role badge" [ngClass]="user.role === 'admin' ? 'badge-primary' : 'badge-gray'">
                  {{ user.role }}
                </span>
              </div>
              <button class="btn btn-outline btn-sm logout-btn" (click)="logout()" title="Logout">
                <i class="bi bi-box-arrow-right"></i>
                <span class="d-none-mobile">Logout</span>
              </button>
            </div>
          } @else {
            <div class="auth-buttons">
              <a routerLink="/login" class="btn btn-outline btn-sm">Log In</a>
              <a routerLink="/register" class="btn btn-primary btn-sm">Get Started</a>
            </div>
          }

          <!-- Mobile Menu Toggle -->
          <button class="mobile-toggle" (click)="isMobileMenuOpen = !isMobileMenuOpen" aria-label="Toggle navigation">
            <i class="bi" [ngClass]="isMobileMenuOpen ? 'bi-x-lg' : 'bi-list'"></i>
          </button>
        </div>
      </div>

      <!-- Mobile Dropdown Menu -->
      @if (isMobileMenuOpen) {
        <div class="mobile-menu">
          <a routerLink="/" (click)="isMobileMenuOpen = false" class="mobile-nav-item">
            <i class="bi bi-house"></i> Home
          </a>
          <a routerLink="/visualizer" (click)="isMobileMenuOpen = false" class="mobile-nav-item">
            <i class="bi bi-brush"></i> Visualizer Studio
          </a>
          <a routerLink="/gallery" (click)="isMobileMenuOpen = false" class="mobile-nav-item">
            <i class="bi bi-images"></i> Inspiration Gallery
          </a>
          @if (authService.currentUser$ | async; as user) {
            <a routerLink="/dashboard" (click)="isMobileMenuOpen = false" class="mobile-nav-item">
              <i class="bi bi-grid-1x2"></i> My Designs
            </a>
            @if (user.role === 'admin') {
              <a routerLink="/admin" (click)="isMobileMenuOpen = false" class="mobile-nav-item">
                <i class="bi bi-shield-lock"></i> Admin Panel
              </a>
            }
            <button (click)="logout(); isMobileMenuOpen = false" class="mobile-nav-item text-danger border-0 bg-transparent text-left w-100">
              <i class="bi bi-box-arrow-right"></i> Log Out
            </button>
          } @else {
            <div class="mobile-auth-grid">
              <a routerLink="/login" (click)="isMobileMenuOpen = false" class="btn btn-outline">Log In</a>
              <a routerLink="/register" (click)="isMobileMenuOpen = false" class="btn btn-primary">Sign Up</a>
            </div>
          }
        </div>
      }
    </header>
  `,
  styles: [`
    .app-header {
      position: sticky;
      top: 0;
      z-index: 1000;
      background: rgba(11, 15, 25, 0.85);
      backdrop-filter: blur(12px);
      -webkit-backdrop-filter: blur(12px);
      border-bottom: 1px solid var(--border-color);
    }
    .header-container {
      max-width: 1360px;
      margin: 0 auto;
      padding: 0.85rem 1.5rem;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
    }
    .logo-group {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .logo-icon {
      width: 42px;
      height: 42px;
      background: var(--gradient-primary);
      color: #050a12;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.35rem;
      box-shadow: 0 4px 14px rgba(0, 229, 163, 0.35);
    }
    .logo-text {
      display: flex;
      flex-direction: column;
    }
    .logo-brand {
      font-family: var(--font-heading);
      font-size: 1.25rem;
      font-weight: 800;
      letter-spacing: -0.02em;
      color: #fff;
      line-height: 1.1;
    }
    .logo-tag {
      font-size: 0.75rem;
      color: var(--primary);
      text-transform: uppercase;
      letter-spacing: 0.08em;
      font-weight: 600;
    }
    .desktop-nav {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .nav-item {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.5rem 0.85rem;
      color: var(--text-muted);
      font-weight: 500;
      font-size: 0.925rem;
      border-radius: var(--radius-md);
      transition: var(--transition);
      text-decoration: none;
    }
    .nav-item:hover {
      color: #fff;
      background: rgba(255, 255, 255, 0.05);
    }
    .nav-item.active {
      color: var(--primary);
      background: rgba(0, 229, 163, 0.08);
      font-weight: 600;
    }
    .admin-badge-link {
      color: #a78bfa;
    }
    .admin-badge-link:hover, .admin-badge-link.active {
      color: #c4b5fd;
      background: rgba(139, 92, 246, 0.15);
    }
    .header-actions {
      display: flex;
      align-items: center;
      gap: 1rem;
    }
    .auth-buttons {
      display: flex;
      align-items: center;
      gap: 0.65rem;
    }
    .user-profile-menu {
      display: flex;
      align-items: center;
      gap: 0.75rem;
    }
    .user-avatar {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 2px solid var(--primary);
      color: var(--primary);
      font-weight: 700;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .user-info {
      display: flex;
      flex-direction: column;
    }
    .user-name {
      font-size: 0.85rem;
      font-weight: 600;
      color: #fff;
    }
    .mobile-toggle {
      display: none;
      background: transparent;
      border: 1px solid var(--border-color);
      color: var(--text-main);
      padding: 0.4rem 0.6rem;
      border-radius: var(--radius-sm);
      font-size: 1.25rem;
      cursor: pointer;
    }
    .mobile-menu {
      display: none;
      flex-direction: column;
      padding: 1rem 1.5rem 1.5rem;
      background: var(--bg-card);
      border-top: 1px solid var(--border-color);
      gap: 0.5rem;
    }
    .mobile-nav-item {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      padding: 0.75rem 0.5rem;
      color: var(--text-main);
      font-size: 1rem;
      font-weight: 500;
      text-decoration: none;
      border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    }
    .mobile-auth-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.75rem;
      margin-top: 0.75rem;
    }
    @media (max-width: 900px) {
      .desktop-nav { display: none; }
      .mobile-toggle { display: block; }
      .mobile-menu { display: flex; }
      .d-none-mobile { display: none !important; }
    }
  `]
})
export class NavbarComponent {
  isMobileMenuOpen = false;
  isDropdownOpen = false;

  constructor(public authService: AuthService, private router: Router) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout();
  }
}
