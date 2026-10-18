import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="home-page">
      <!-- Hero Section -->
      <section class="hero-section">
        <div class="container hero-container">
          <div class="hero-content">
            <div class="hero-badge">
              <span class="pulse-dot"></span>
              <span>Next-Gen MEAN Stack Architecture</span>
            </div>
            <h1 class="hero-title">
              Visualize Your Dream Room <span class="gradient-text">Before You Paint</span>
            </h1>
            <p class="hero-subtitle">
              Eliminate guesswork and costly repaints. Upload any room photo, trace walls with our polygon selection engine, and simulate 50+ designer paint shades in realistic lighting instantly.
            </p>
            <div class="hero-cta-group">
              <a routerLink="/visualizer" class="btn btn-primary btn-lg">
                <i class="bi bi-brush"></i> Launch Visualizer Studio
              </a>
              <a routerLink="/gallery" class="btn btn-secondary btn-lg">
                <i class="bi bi-compass"></i> Explore Inspiration
              </a>
            </div>

            <div class="hero-stats">
              <div class="stat-item">
                <span class="stat-number">50+</span>
                <span class="stat-label">Designer Shades</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">100%</span>
                <span class="stat-label">Interactive Canvas</span>
              </div>
              <div class="stat-divider"></div>
              <div class="stat-item">
                <span class="stat-number">0 Cost</span>
                <span class="stat-label">Virtual Preview</span>
              </div>
            </div>
          </div>

          <div class="hero-visual">
            <div class="visual-card">
              <div class="visual-badge">Live Interactive Simulator</div>
              <div class="visual-image-wrapper">
                <div class="room-preview-box">
                  <div class="preview-wall-base"></div>
                  <div class="preview-wall-tint" [style.background-color]="activeColorHex"></div>
                  <div class="furniture-overlay">
                    <i class="bi bi-lamp furniture-icon"></i>
                    <i class="bi bi-sofa furniture-icon sofa"></i>
                  </div>
                </div>
              </div>
              <div class="visual-palette-bar">
                <span class="palette-label">Try quick shades:</span>
                <div class="quick-swatches">
                  @for (c of sampleColors; track c.name) {
                    <button 
                      class="quick-circle" 
                      [style.background-color]="c.hex"
                      [class.active]="activeColorHex === c.hex"
                      (click)="activeColorHex = c.hex"
                      [title]="c.name">
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- Key Problems & Solutions -->
      <section class="features-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge badge-primary">Why SmartWall?</span>
            <h2 class="section-title">Bridging The Gap Between Imagination & Reality</h2>
            <p class="section-desc">Traditional paint chips fail to capture how lighting, room dimensions, and shadows alter colors in your real home.</p>
          </div>

          <div class="grid grid-cols-3 features-grid">
            <div class="card feature-card">
              <div class="feature-icon-box bg-teal">
                <i class="bi bi-polygon"></i>
              </div>
              <h3>Polygon Wall Mapping</h3>
              <p>Trace complex wall boundaries, ceiling borders, and window frames with click-and-snap precision on your real uploaded room photo.</p>
            </div>

            <div class="card feature-card">
              <div class="feature-icon-box bg-blue">
                <i class="bi bi-palette"></i>
              </div>
              <h3>50+ Curated Palettes</h3>
              <p>Explore catalogued shades from Asian Paints, Dulux, Berger, and Nerolac, classified by Living Room, Bedroom, Kitchen, and Accent styles.</p>
            </div>

            <div class="card feature-card">
              <div class="feature-icon-box bg-purple">
                <i class="bi bi-sliders"></i>
              </div>
              <h3>Realistic Lighting & Opacity</h3>
              <p>Control translucent blending modes to simulate how natural daylight and artificial lamps filter through matte, satin, or gloss paint layers.</p>
            </div>

            <div class="card feature-card">
              <div class="feature-icon-box bg-rose">
                <i class="bi bi-arrow-left-right"></i>
              </div>
              <h3>Before & After Comparison</h3>
              <p>Toggle seamlessly with one click between your original room and your custom virtual paint design to evaluate contrast and harmony.</p>
            </div>

            <div class="card feature-card">
              <div class="feature-icon-box bg-amber">
                <i class="bi bi-cloud-arrow-down"></i>
              </div>
              <h3>High-Res Export & Save</h3>
              <p>Download full-resolution rendered images to share with painters, contractors, family members, or interior designers before purchasing paint.</p>
            </div>

            <div class="card feature-card">
              <div class="feature-icon-box bg-green">
                <i class="bi bi-shield-check"></i>
              </div>
              <h3>Secure Cloud Storage</h3>
              <p>Save multiple design iterations under your user account with MongoDB storage and JWT security for future remodeling consultations.</p>
            </div>
          </div>
        </div>
      </section>

      <!-- How It Works Steps -->
      <section class="steps-section">
        <div class="container">
          <div class="section-header text-center">
            <span class="badge badge-blue">Simple 4-Step Workflow</span>
            <h2 class="section-title">How To Paint Your Room Virtually</h2>
          </div>

          <div class="steps-container">
            <div class="step-card">
              <div class="step-number">01</div>
              <h4>Upload Room Photo</h4>
              <p>Snap a picture of your bedroom, living room, or facade and upload in JPG, PNG, or WEBP format.</p>
            </div>
            <div class="step-arrow"><i class="bi bi-chevron-right"></i></div>

            <div class="step-card">
              <div class="step-number">02</div>
              <h4>Trace Wall Boundaries</h4>
              <p>Use the polygon tool to outline any wall, pillar, or accent feature with custom corner points.</p>
            </div>
            <div class="step-arrow"><i class="bi bi-chevron-right"></i></div>

            <div class="step-card">
              <div class="step-number">03</div>
              <h4>Pick Color & Finish</h4>
              <p>Select from 50+ curated paint shades, tune the opacity, and inspect matte versus gloss finishes.</p>
            </div>
            <div class="step-arrow"><i class="bi bi-chevron-right"></i></div>

            <div class="step-card">
              <div class="step-number">04</div>
              <h4>Download & Paint</h4>
              <p>Compare before/after previews, export the high-res image, and save to your project portfolio.</p>
            </div>
          </div>

          <div class="text-center mt-4">
            <a routerLink="/visualizer" class="btn btn-primary btn-lg">
              <i class="bi bi-play-circle"></i> Try It Now Free
            </a>
          </div>
        </div>
      </section>
    </div>
  `,
  styles: [`
    .hero-section {
      padding: 5rem 0 4rem;
      position: relative;
      overflow: hidden;
    }
    .hero-container {
      display: grid;
      grid-template-columns: 1.15fr 0.85fr;
      align-items: center;
      gap: 3.5rem;
    }
    .hero-badge {
      display: inline-flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.35rem 0.9rem;
      background: rgba(0, 229, 163, 0.1);
      border: 1px solid rgba(0, 229, 163, 0.25);
      border-radius: var(--radius-full);
      color: var(--primary);
      font-size: 0.825rem;
      font-weight: 600;
      margin-bottom: 1.5rem;
    }
    .pulse-dot {
      width: 8px;
      height: 8px;
      border-radius: var(--radius-full);
      background: var(--primary);
      box-shadow: 0 0 10px var(--primary);
      animation: pulse 2s infinite;
    }
    @keyframes pulse {
      0%, 100% { opacity: 1; transform: scale(1); }
      50% { opacity: 0.4; transform: scale(0.8); }
    }
    .hero-title {
      font-size: 3.25rem;
      font-weight: 800;
      letter-spacing: -0.03em;
      margin-bottom: 1.25rem;
      line-height: 1.15;
    }
    .hero-subtitle {
      font-size: 1.15rem;
      color: var(--text-muted);
      line-height: 1.7;
      margin-bottom: 2rem;
      max-width: 580px;
    }
    .hero-cta-group {
      display: flex;
      gap: 1rem;
      flex-wrap: wrap;
      margin-bottom: 2.5rem;
    }
    .hero-stats {
      display: flex;
      align-items: center;
      gap: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    .stat-item {
      display: flex;
      flex-direction: column;
    }
    .stat-number {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 800;
      color: #fff;
    }
    .stat-label {
      font-size: 0.825rem;
      color: var(--text-muted);
    }
    .stat-divider {
      width: 1px;
      height: 36px;
      background: var(--border-color);
    }
    .visual-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      box-shadow: var(--shadow-lg);
      position: relative;
    }
    .visual-badge {
      position: absolute;
      top: 1rem;
      right: 1.5rem;
      font-size: 0.75rem;
      font-weight: 700;
      background: rgba(0, 229, 163, 0.15);
      color: var(--primary);
      padding: 0.25rem 0.6rem;
      border-radius: var(--radius-full);
      z-index: 10;
    }
    .room-preview-box {
      width: 100%;
      height: 280px;
      background: #1e2638;
      border-radius: var(--radius-md);
      position: relative;
      overflow: hidden;
      border: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .preview-wall-tint {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.75;
      transition: background-color 0.4s ease;
    }
    .furniture-overlay {
      position: relative;
      z-index: 2;
      display: flex;
      align-items: flex-end;
      gap: 3rem;
      color: rgba(255, 255, 255, 0.85);
    }
    .furniture-icon {
      font-size: 3rem;
    }
    .furniture-icon.sofa {
      font-size: 4.5rem;
    }
    .visual-palette-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin-top: 1rem;
    }
    .palette-label {
      font-size: 0.85rem;
      color: var(--text-muted);
    }
    .quick-swatches {
      display: flex;
      gap: 0.5rem;
    }
    .quick-circle {
      width: 28px;
      height: 28px;
      border-radius: var(--radius-full);
      border: 2px solid transparent;
      cursor: pointer;
      transition: var(--transition);
    }
    .quick-circle.active, .quick-circle:hover {
      transform: scale(1.15);
      border-color: #fff;
    }
    .features-section, .steps-section {
      padding: 5rem 0;
      border-top: 1px solid var(--border-color);
    }
    .section-header {
      margin-bottom: 3.5rem;
    }
    .section-title {
      font-size: 2.25rem;
      font-weight: 800;
      margin: 0.75rem 0;
    }
    .section-desc {
      color: var(--text-muted);
      max-width: 600px;
      margin: 0 auto;
    }
    .feature-card {
      padding: 2rem;
    }
    .feature-icon-box {
      width: 52px;
      height: 52px;
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 1.5rem;
      margin-bottom: 1.25rem;
    }
    .bg-teal { background: rgba(0, 229, 163, 0.15); color: var(--primary); }
    .bg-blue { background: rgba(59, 130, 246, 0.15); color: var(--secondary); }
    .bg-purple { background: rgba(139, 92, 246, 0.15); color: var(--accent-purple); }
    .bg-rose { background: rgba(244, 63, 94, 0.15); color: var(--accent-rose); }
    .bg-amber { background: rgba(245, 158, 11, 0.15); color: var(--accent-amber); }
    .bg-green { background: rgba(16, 185, 129, 0.15); color: var(--success); }
    .feature-card h3 {
      font-size: 1.2rem;
      margin-bottom: 0.6rem;
    }
    .feature-card p {
      color: var(--text-muted);
      font-size: 0.925rem;
      line-height: 1.6;
    }
    .steps-container {
      display: grid;
      grid-template-columns: 1fr auto 1fr auto 1fr auto 1fr;
      align-items: center;
      gap: 1rem;
    }
    .step-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      padding: 1.5rem;
      text-align: center;
    }
    .step-number {
      font-family: var(--font-heading);
      font-size: 1.75rem;
      font-weight: 800;
      color: var(--primary);
      margin-bottom: 0.5rem;
    }
    .step-card h4 {
      font-size: 1.05rem;
      margin-bottom: 0.5rem;
    }
    .step-card p {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.5;
    }
    .step-arrow {
      color: var(--text-dim);
      font-size: 1.5rem;
    }
    .mt-4 { margin-top: 3rem; }
    .text-center { text-align: center; }

    @media (max-width: 1024px) {
      .hero-container {
        grid-template-columns: 1fr;
      }
      .steps-container {
        grid-template-columns: 1fr;
        gap: 1.5rem;
      }
      .step-arrow {
        display: none;
      }
    }
  `]
})
export class HomeComponent {
  activeColorHex = '#457B9D';

  sampleColors = [
    { name: 'Ocean Breeze', hex: '#457B9D' },
    { name: 'Tranquil Sage', hex: '#9CAE96' },
    { name: 'Warm Cashmere', hex: '#E6D7C3' },
    { name: 'Midnight Navy', hex: '#1B263B' },
    { name: 'Tuscan Sun', hex: '#F4A261' },
    { name: 'Emerald Jewel', hex: '#0B6623' }
  ];
}
