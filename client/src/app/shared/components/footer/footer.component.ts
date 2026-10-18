import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <footer class="app-footer">
      <div class="container footer-content">
        <div class="footer-col brand-col">
          <div class="footer-logo">
            <div class="logo-icon-sm">
              <i class="bi bi-paint-bucket"></i>
            </div>
            <span class="footer-brand-title">SmartWall Visualizer</span>
          </div>
          <p class="footer-desc">
            Next-generation MEAN stack virtual room preview platform. Empowering homeowners, architects, and paint specialists to simulate realistic wall finishes with polygon precision.
          </p>
          <div class="footer-socials">
            <a href="#" aria-label="Github"><i class="bi bi-github"></i></a>
            <a href="#" aria-label="LinkedIn"><i class="bi bi-linkedin"></i></a>
            <a href="#" aria-label="Twitter"><i class="bi bi-twitter-x"></i></a>
          </div>
        </div>

        <div class="footer-col">
          <h4 class="col-title">Navigation</h4>
          <ul class="col-links">
            <li><a routerLink="/">Home Overview</a></li>
            <li><a routerLink="/visualizer">Visualizer Canvas</a></li>
            <li><a routerLink="/gallery">Inspiration Gallery</a></li>
            <li><a routerLink="/dashboard">My Projects</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="col-title">Paint Partners</h4>
          <ul class="col-links">
            <li><a href="https://www.behr.com/consumer/colors/paint" target="_blank" rel="noopener">Behr Visualizer Reference</a></li>
            <li><a href="https://www.unifiedmentor.com/" target="_blank" rel="noopener">Unified Mentor</a></li>
            <li><a href="#">Asian Paints Catalogs</a></li>
            <li><a href="#">Dulux Color Standards</a></li>
          </ul>
        </div>

        <div class="footer-col">
          <h4 class="col-title">Technology Stack</h4>
          <div class="tech-pills">
            <span class="badge badge-gray">Angular 17</span>
            <span class="badge badge-gray">Node.js</span>
            <span class="badge badge-gray">Express</span>
            <span class="badge badge-gray">MongoDB</span>
            <span class="badge badge-gray">HTML5 Canvas</span>
            <span class="badge badge-gray">JWT Security</span>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <div class="container bottom-flex">
          <p>© 2026 Smart Wall Paint Visualizer. MEAN Stack Production Solution.</p>
          <p class="designed-by">Built for Unified Mentor Capstone Project</p>
        </div>
      </div>
    </footer>
  `,
  styles: [`
    .app-footer {
      background: #070a10;
      border-top: 1px solid var(--border-color);
      margin-top: auto;
      padding-top: 4rem;
    }
    .footer-content {
      display: grid;
      grid-template-columns: 2fr 1fr 1.2fr 1fr;
      gap: 3rem;
      padding-bottom: 3rem;
    }
    .brand-col .footer-desc {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin: 1rem 0 1.5rem;
      line-height: 1.6;
    }
    .footer-logo {
      display: flex;
      align-items: center;
      gap: 0.6rem;
    }
    .logo-icon-sm {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      background: var(--gradient-primary);
      color: #050a12;
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    .footer-brand-title {
      font-family: var(--font-heading);
      font-size: 1.15rem;
      font-weight: 700;
      color: #fff;
    }
    .footer-socials {
      display: flex;
      gap: 1rem;
    }
    .footer-socials a {
      width: 36px;
      height: 36px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1rem;
    }
    .footer-socials a:hover {
      background: var(--primary);
      color: #050a12;
      border-color: var(--primary);
    }
    .col-title {
      font-size: 1rem;
      color: #fff;
      margin-bottom: 1.25rem;
      font-weight: 600;
    }
    .col-links {
      list-style: none;
      display: flex;
      flex-direction: column;
      gap: 0.75rem;
    }
    .col-links a {
      color: var(--text-muted);
      font-size: 0.875rem;
      text-decoration: none;
    }
    .col-links a:hover {
      color: var(--primary);
      padding-left: 4px;
    }
    .tech-pills {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }
    .footer-bottom {
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding: 1.5rem 0;
      font-size: 0.85rem;
      color: var(--text-dim);
    }
    .bottom-flex {
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 1rem;
    }
    @media (max-width: 900px) {
      .footer-content {
        grid-template-columns: 1fr;
        gap: 2rem;
      }
    }
  `]
})
export class FooterComponent {}
