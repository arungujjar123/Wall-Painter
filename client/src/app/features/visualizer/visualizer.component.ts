import { Component, ElementRef, OnInit, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { ColorService } from '../../core/services/color.service';
import { ProjectService } from '../../core/services/project.service';
import { AuthService } from '../../core/services/auth.service';
import { Color } from '../../core/models/color.model';
import { Point, WallSelection, Project } from '../../core/models/project.model';
import { ColorSwatchComponent } from '../../shared/components/color-swatch/color-swatch.component';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-visualizer',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, ColorSwatchComponent],
  template: `
    <div class="visualizer-layout">
      <!-- Left Panel: Colors & Palettes -->
      <aside class="panel left-panel">
        <div class="panel-header">
          <div class="d-flex align-center gap-1">
            <i class="bi bi-palette-fill text-primary"></i>
            <h3>Paint Palettes</h3>
          </div>
          <span class="badge badge-gray">{{ filteredColors.length }} Shades</span>
        </div>

        <div class="search-filter-box">
          <div class="search-input-wrapper">
            <i class="bi bi-search"></i>
            <input 
              type="text" 
              [(ngModel)]="searchQuery" 
              (ngModelChange)="filterColors()" 
              placeholder="Search by color name..." 
              class="form-control form-control-sm">
          </div>

          <div class="category-tabs">
            <button 
              class="cat-tab" 
              [class.active]="selectedCategory === 'ALL'" 
              (click)="setCategory('ALL')">
              All
            </button>
            @for (cat of categories; track cat) {
              <button 
                class="cat-tab" 
                [class.active]="selectedCategory === cat" 
                (click)="setCategory(cat)">
                {{ cat }}
              </button>
            }
          </div>
        </div>

        <!-- Custom Color Picker -->
        <div class="custom-color-card">
          <span class="custom-label">Custom HEX Color:</span>
          <div class="d-flex align-center gap-1">
            <input 
              type="color" 
              [(ngModel)]="customHex" 
              (change)="applyCustomColor()" 
              class="color-native-input" 
              title="Pick custom color">
            <input 
              type="text" 
              [(ngModel)]="customHex" 
              (change)="applyCustomColor()" 
              class="form-control form-control-sm hex-text-input">
          </div>
        </div>

        <!-- Color Swatches Grid -->
        <div class="swatches-scrollable">
          <div class="swatches-grid">
            @for (color of filteredColors; track color._id) {
              <app-color-swatch 
                [color]="color"
                [isSelected]="selectedColor?._id === color._id"
                (colorSelected)="onSelectColor($event)">
              </app-color-swatch>
            }
          </div>
        </div>

        <!-- Active Color Summary Footer -->
        <div class="active-color-footer">
          <div class="active-chip" [style.background-color]="activeHex"></div>
          <div class="active-details">
            <span class="active-name">{{ selectedColor?.name || 'Custom Shade' }}</span>
            <span class="active-hex">{{ activeHex }} • {{ selectedColor?.brand || 'Custom' }}</span>
          </div>
        </div>
      </aside>

      <!-- Center Panel: Canvas Workspace -->
      <main class="center-workspace">
        <!-- Canvas Top Toolbar -->
        <div class="canvas-toolbar">
          <div class="tool-group">
            <button 
              class="tool-btn" 
              [class.active]="toolMode === 'polygon'"
              (click)="setTool('polygon')"
              title="Polygon Wall Selection Tool">
              <i class="bi bi-bounding-box-circles"></i>
              <span>Polygon Tool</span>
            </button>
            <button 
              class="tool-btn" 
              (click)="undoLastPoint()" 
              [disabled]="currentPolygonPoints.length === 0"
              title="Undo Point">
              <i class="bi bi-arrow-counterclockwise"></i>
              <span>Undo Point</span>
            </button>
            <button 
              class="tool-btn" 
              (click)="completePolygon()" 
              [disabled]="currentPolygonPoints.length < 3"
              title="Close and Paint Wall">
              <i class="bi bi-check2-circle"></i>
              <span>Paint Wall ({{ currentPolygonPoints.length }} pts)</span>
            </button>
          </div>

          <div class="tool-group">
            <button 
              class="tool-btn" 
              [class.active]="isBeforeView"
              (mousedown)="setBeforeView(true)"
              (mouseup)="setBeforeView(false)"
              (mouseleave)="setBeforeView(false)"
              title="Hold to see original room without paint">
              <i class="bi bi-eye"></i>
              <span>Hold for Original</span>
            </button>
            <button 
              class="tool-btn btn-danger-soft" 
              (click)="clearAllWalls()" 
              [disabled]="walls.length === 0 && currentPolygonPoints.length === 0"
              title="Clear all paint selections">
              <i class="bi bi-trash3"></i>
              <span>Clear</span>
            </button>
          </div>
        </div>

        <!-- Canvas Container -->
        <div class="canvas-viewport" #canvasContainer>
          @if (!roomImageLoaded) {
            <div class="upload-placeholder">
              <div class="placeholder-icon">
                <i class="bi bi-cloud-arrow-up"></i>
              </div>
              <h3>Load a Room Photo to Start</h3>
              <p>Upload a clear photo of your space or choose one of our sample interiors below.</p>
              
              <div class="upload-actions">
                <label class="btn btn-primary">
                  <i class="bi bi-upload"></i> Upload From Device
                  <input type="file" (change)="onFileSelected($event)" accept="image/jpeg,image/png,image/webp" style="display: none;">
                </label>
              </div>

              <div class="sample-rooms-section">
                <span class="sample-tag">Or try a sample room:</span>
                <div class="sample-rooms-grid">
                  <button class="sample-room-btn" (click)="loadSampleRoom('living')">
                    <i class="bi bi-house"></i> Modern Living Room
                  </button>
                  <button class="sample-room-btn" (click)="loadSampleRoom('bedroom')">
                    <i class="bi bi-lamp"></i> Cozy Bedroom
                  </button>
                  <button class="sample-room-btn" (click)="loadSampleRoom('kitchen')">
                    <i class="bi bi-cup-hot"></i> Minimalist Kitchen
                  </button>
                </div>
              </div>
            </div>
          }

          <canvas 
            #mainCanvas 
            (click)="onCanvasClick($event)"
            (mousemove)="onCanvasMouseMove($event)"
            (dblclick)="onCanvasDoubleClick($event)"
            [style.display]="roomImageLoaded ? 'block' : 'none'"
            class="interactive-canvas">
          </canvas>

          <!-- Instructions Overlay Hint -->
          @if (roomImageLoaded && currentPolygonPoints.length > 0) {
            <div class="canvas-hint">
              <i class="bi bi-info-circle"></i> Click to add wall boundary points. Click near starting point (yellow) or hit "Paint Wall" to finish.
            </div>
          }
        </div>
      </main>

      <!-- Right Panel: Wall Layers & Controls -->
      <aside class="panel right-panel">
        <div class="panel-header">
          <div class="d-flex align-center gap-1">
            <i class="bi bi-sliders2 text-primary"></i>
            <h3>Paint Settings</h3>
          </div>
        </div>

        <div class="controls-content">
          <!-- Room Image Source Switcher -->
          <div class="setting-block">
            <label class="setting-label">Room Image Source</label>
            <label class="btn btn-secondary btn-sm w-100">
              <i class="bi bi-image"></i> Change Room Photo
              <input type="file" (change)="onFileSelected($event)" accept="image/*" style="display: none;">
            </label>
          </div>

          <!-- Paint Opacity Slider -->
          <div class="setting-block">
            <div class="d-flex justify-between align-center mb-1">
              <label class="setting-label">Paint Opacity / Blend</label>
              <span class="slider-value">{{ Math.round(opacity * 100) }}%</span>
            </div>
            <input 
              type="range" 
              min="0.1" 
              max="0.95" 
              step="0.05" 
              [(ngModel)]="opacity" 
              (ngModelChange)="onSettingsChanged()" 
              class="custom-slider">
            <div class="slider-ticks">
              <span>Subtle (10%)</span>
              <span>Natural (65%)</span>
              <span>Opaque (95%)</span>
            </div>
          </div>

          <!-- Finish Type -->
          <div class="setting-block">
            <label class="setting-label">Wall Finish Simulator</label>
            <div class="finish-grid">
              <button 
                class="finish-btn" 
                [class.active]="finish === 'matte'" 
                (click)="setFinish('matte')">
                Matte
              </button>
              <button 
                class="finish-btn" 
                [class.active]="finish === 'eggshell'" 
                (click)="setFinish('eggshell')">
                Eggshell
              </button>
              <button 
                class="finish-btn" 
                [class.active]="finish === 'satin'" 
                (click)="setFinish('satin')">
                Satin
              </button>
              <button 
                class="finish-btn" 
                [class.active]="finish === 'gloss'" 
                (click)="setFinish('gloss')">
                Gloss
              </button>
            </div>
          </div>

          <!-- Wall Layers List -->
          <div class="setting-block layers-block">
            <div class="d-flex justify-between align-center mb-1">
              <label class="setting-label">Painted Walls ({{ walls.length }})</label>
              @if (walls.length > 0) {
                <span class="badge badge-teal">{{ walls.length }} Active</span>
              }
            </div>

            @if (walls.length === 0) {
              <div class="no-layers">
                <i class="bi bi-layers"></i>
                <p>No walls painted yet. Trace a wall with the polygon tool to apply your selected shade.</p>
              </div>
            } @else {
              <div class="layers-list">
                @for (wall of walls; track $index) {
                  <div class="layer-item">
                    <div class="layer-color-dot" [style.background-color]="wall.colorHex"></div>
                    <div class="layer-info">
                      <span class="layer-title">Wall #{{ $index + 1 }}</span>
                      <span class="layer-sub">{{ wall.colorHex }} • {{ wall.points.length }} pts</span>
                    </div>
                    <button class="layer-delete" (click)="deleteWall($index)" title="Remove paint on this wall">
                      <i class="bi bi-x"></i>
                    </button>
                  </div>
                }
              </div>
            }
          </div>

          <!-- Actions: Export & Save -->
          <div class="actions-block">
            <button class="btn btn-secondary w-100 mb-2" (click)="downloadCanvasImage()" [disabled]="!roomImageLoaded">
              <i class="bi bi-download"></i> Download Rendered PNG
            </button>

            <button class="btn btn-primary w-100" (click)="promptSaveModal()" [disabled]="!roomImageLoaded">
              <i class="bi bi-cloud-arrow-up"></i> Save Design to Portfolio
            </button>
          </div>
        </div>
      </aside>
    </div>

    <!-- Save Modal Dialog -->
    @if (showSaveModal) {
      <div class="modal-backdrop">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Save Room Visualization</h3>
            <button class="modal-close" (click)="showSaveModal = false"><i class="bi bi-x-lg"></i></button>
          </div>
          <div class="modal-body">
            @if (!authService.isLoggedIn) {
              <div class="alert alert-warning">
                <i class="bi bi-exclamation-circle"></i>
                <span>You need an account to save designs. Please <a routerLink="/login">Log In</a> or <a routerLink="/register">Register</a>.</span>
              </div>
            }

            <div class="form-group">
              <label class="form-label">Project Name</label>
              <input type="text" [(ngModel)]="saveProjectName" class="form-control" placeholder="e.g. Master Bedroom Navy Accent">
            </div>

            <div class="form-group checkbox-group">
              <label class="checkbox-label">
                <input type="checkbox" [(ngModel)]="saveIsPublic">
                <span>Share publicly in Inspiration Gallery</span>
              </label>
            </div>
          </div>
          <div class="modal-footer">
            <button class="btn btn-secondary" (click)="showSaveModal = false">Cancel</button>
            <button class="btn btn-primary" (click)="saveProjectToServer()" [disabled]="saveLoading || !authService.isLoggedIn">
              @if (saveLoading) {
                <span class="spinner-sm"></span> Saving...
              } @else {
                <i class="bi bi-check-lg"></i> Confirm & Save
              }
            </button>
          </div>
        </div>
      </div>
    }
  `,
  styles: [`
    .visualizer-layout {
      display: grid;
      grid-template-columns: 320px 1fr 300px;
      height: calc(100vh - 72px);
      background: #090c14;
      overflow: hidden;
    }
    .panel {
      background: var(--bg-card);
      border-right: 1px solid var(--border-color);
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .right-panel {
      border-right: none;
      border-left: 1px solid var(--border-color);
    }
    .panel-header {
      padding: 1.15rem 1.25rem;
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    .panel-header h3 {
      font-size: 1.05rem;
      font-weight: 700;
    }
    .text-primary { color: var(--primary); }
    .badge-teal { background: rgba(0, 229, 163, 0.15); color: var(--primary); }
    .search-filter-box {
      padding: 1rem 1.25rem 0.5rem;
    }
    .search-input-wrapper {
      position: relative;
      margin-bottom: 0.75rem;
    }
    .search-input-wrapper i {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
      font-size: 0.85rem;
    }
    .search-input-wrapper input {
      padding-left: 2rem;
    }
    .category-tabs {
      display: flex;
      gap: 0.35rem;
      overflow-x: auto;
      padding-bottom: 0.4rem;
    }
    .cat-tab {
      padding: 0.3rem 0.65rem;
      font-size: 0.75rem;
      font-weight: 600;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      cursor: pointer;
      white-space: nowrap;
      transition: var(--transition);
    }
    .cat-tab.active, .cat-tab:hover {
      background: var(--primary);
      color: #050a12;
      border-color: var(--primary);
    }
    .custom-color-card {
      margin: 0.5rem 1.25rem;
      padding: 0.6rem 0.8rem;
      background: var(--bg-surface);
      border-radius: var(--radius-md);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border: 1px solid var(--border-color);
    }
    .custom-label {
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-muted);
    }
    .color-native-input {
      width: 32px;
      height: 32px;
      border: none;
      border-radius: var(--radius-sm);
      cursor: pointer;
      background: transparent;
    }
    .hex-text-input {
      width: 80px;
      font-family: monospace;
      text-transform: uppercase;
      font-size: 0.8rem;
      padding: 0.25rem 0.4rem;
    }
    .swatches-scrollable {
      flex: 1;
      overflow-y: auto;
      padding: 0.75rem 1.25rem;
    }
    .swatches-grid {
      display: grid;
      grid-template-columns: repeat(3, 1fr);
      gap: 0.65rem;
    }
    .active-color-footer {
      padding: 0.85rem 1.25rem;
      border-top: 1px solid var(--border-color);
      display: flex;
      align-items: center;
      gap: 0.75rem;
      background: #0f1523;
    }
    .active-chip {
      width: 38px;
      height: 38px;
      border-radius: var(--radius-md);
      border: 2px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 8px rgba(0,0,0,0.4);
    }
    .active-details {
      display: flex;
      flex-direction: column;
    }
    .active-name {
      font-size: 0.875rem;
      font-weight: 700;
      color: #fff;
    }
    .active-hex {
      font-size: 0.75rem;
      color: var(--text-muted);
    }
    .center-workspace {
      display: flex;
      flex-direction: column;
      overflow: hidden;
      background: #07090f;
    }
    .canvas-toolbar {
      padding: 0.75rem 1.5rem;
      background: var(--bg-card);
      border-bottom: 1px solid var(--border-color);
      display: flex;
      justify-content: space-between;
      align-items: center;
      flex-wrap: wrap;
      gap: 0.75rem;
    }
    .tool-group {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    .tool-btn {
      display: inline-flex;
      align-items: center;
      gap: 0.4rem;
      padding: 0.45rem 0.85rem;
      font-size: 0.825rem;
      font-weight: 600;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      border-radius: var(--radius-md);
      cursor: pointer;
      transition: var(--transition);
    }
    .tool-btn:hover:not(:disabled) {
      border-color: var(--primary);
      color: var(--primary);
    }
    .tool-btn.active {
      background: rgba(0, 229, 163, 0.15);
      border-color: var(--primary);
      color: var(--primary);
    }
    .tool-btn:disabled {
      opacity: 0.4;
      cursor: not-allowed;
    }
    .btn-danger-soft {
      color: #f87171;
    }
    .btn-danger-soft:hover:not(:disabled) {
      border-color: #ef4444 !important;
      color: #ef4444 !important;
    }
    .canvas-viewport {
      flex: 1;
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      overflow: hidden;
      padding: 1.5rem;
    }
    .interactive-canvas {
      max-width: 100%;
      max-height: 100%;
      border-radius: var(--radius-md);
      box-shadow: 0 10px 40px rgba(0, 0, 0, 0.6);
      cursor: crosshair;
    }
    .canvas-hint {
      position: absolute;
      bottom: 1.5rem;
      background: rgba(11, 15, 25, 0.85);
      backdrop-filter: blur(8px);
      border: 1px solid var(--border-color);
      padding: 0.5rem 1rem;
      border-radius: var(--radius-full);
      font-size: 0.8rem;
      color: var(--text-main);
      box-shadow: var(--shadow-md);
      pointer-events: none;
    }
    .upload-placeholder {
      text-align: center;
      max-width: 500px;
      padding: 3rem 2rem;
      background: var(--bg-card);
      border: 2px dashed rgba(255, 255, 255, 0.12);
      border-radius: var(--radius-lg);
    }
    .placeholder-icon {
      font-size: 3rem;
      color: var(--primary);
      margin-bottom: 1rem;
    }
    .upload-placeholder h3 {
      font-size: 1.4rem;
      margin-bottom: 0.5rem;
    }
    .upload-placeholder p {
      color: var(--text-muted);
      font-size: 0.9rem;
      margin-bottom: 1.5rem;
    }
    .sample-rooms-section {
      margin-top: 2rem;
      padding-top: 1.5rem;
      border-top: 1px solid var(--border-color);
    }
    .sample-tag {
      font-size: 0.8rem;
      color: var(--text-dim);
      display: block;
      margin-bottom: 0.75rem;
    }
    .sample-rooms-grid {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
    .sample-room-btn {
      padding: 0.6rem 1rem;
      font-size: 0.85rem;
      font-weight: 500;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-main);
      border-radius: var(--radius-md);
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      transition: var(--transition);
    }
    .sample-room-btn:hover {
      background: var(--bg-card-hover);
      border-color: var(--primary);
      color: var(--primary);
    }
    .controls-content {
      padding: 1.25rem;
      overflow-y: auto;
      flex: 1;
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }
    .setting-block {
      display: flex;
      flex-direction: column;
    }
    .setting-label {
      font-size: 0.85rem;
      font-weight: 600;
      color: var(--text-muted);
      margin-bottom: 0.6rem;
    }
    .slider-value {
      font-size: 0.85rem;
      font-weight: 700;
      color: var(--primary);
    }
    .custom-slider {
      width: 100%;
      accent-color: var(--primary);
      height: 6px;
      border-radius: var(--radius-full);
      background: var(--bg-surface);
    }
    .slider-ticks {
      display: flex;
      justify-content: space-between;
      font-size: 0.675rem;
      color: var(--text-dim);
      margin-top: 0.35rem;
    }
    .finish-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 0.5rem;
    }
    .finish-btn {
      padding: 0.5rem;
      font-size: 0.8rem;
      font-weight: 600;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      color: var(--text-muted);
      border-radius: var(--radius-sm);
      cursor: pointer;
      transition: var(--transition);
    }
    .finish-btn.active, .finish-btn:hover {
      background: rgba(0, 229, 163, 0.15);
      border-color: var(--primary);
      color: var(--primary);
    }
    .layers-block {
      flex: 1;
    }
    .no-layers {
      padding: 1.5rem 1rem;
      text-align: center;
      background: var(--bg-surface);
      border-radius: var(--radius-md);
      border: 1px dashed var(--border-color);
    }
    .no-layers i {
      font-size: 1.5rem;
      color: var(--text-dim);
    }
    .no-layers p {
      font-size: 0.775rem;
      color: var(--text-muted);
      margin-top: 0.4rem;
    }
    .layers-list {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
      max-height: 180px;
      overflow-y: auto;
    }
    .layer-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.5rem 0.75rem;
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-md);
    }
    .layer-color-dot {
      width: 18px;
      height: 18px;
      border-radius: var(--radius-full);
      box-shadow: 0 1px 4px rgba(0,0,0,0.3);
      flex-shrink: 0;
    }
    .layer-info {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    .layer-title {
      font-size: 0.8rem;
      font-weight: 600;
      color: #fff;
    }
    .layer-sub {
      font-size: 0.7rem;
      color: var(--text-dim);
      font-family: monospace;
    }
    .layer-delete {
      background: transparent;
      border: none;
      color: var(--text-dim);
      font-size: 1.25rem;
      cursor: pointer;
    }
    .layer-delete:hover {
      color: #ef4444;
    }
    .actions-block {
      margin-top: auto;
      padding-top: 1rem;
      border-top: 1px solid var(--border-color);
    }
    .mb-1 { margin-bottom: 0.5rem; }
    .mb-2 { margin-bottom: 0.75rem; }
    .w-100 { width: 100%; }
    .modal-backdrop {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.75);
      backdrop-filter: blur(8px);
      z-index: 2000;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 1.5rem;
    }
    .modal-card {
      background: var(--bg-card);
      border: 1px solid var(--border-color);
      border-radius: var(--radius-lg);
      width: 100%;
      max-width: 480px;
      padding: 2rem;
      box-shadow: var(--shadow-lg);
    }
    .modal-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    .modal-close {
      background: transparent;
      border: none;
      color: var(--text-muted);
      font-size: 1.25rem;
      cursor: pointer;
    }
    .modal-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      margin-top: 2rem;
    }
    .checkbox-group {
      margin-top: 1rem;
    }
    .checkbox-label {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      cursor: pointer;
      font-size: 0.9rem;
      color: var(--text-main);
    }
    .alert-warning {
      background: rgba(245, 158, 11, 0.12);
      border: 1px solid rgba(245, 158, 11, 0.3);
      color: #fbbf24;
      padding: 0.75rem 1rem;
      border-radius: var(--radius-md);
      font-size: 0.85rem;
      display: flex;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
    }
    .spinner-sm {
      display: inline-block;
      width: 0.85rem;
      height: 0.85rem;
      border: 2px solid rgba(0,0,0,0.2);
      border-top-color: #000;
      border-radius: 50%;
      animation: spin 0.6s linear infinite;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    @media (max-width: 1100px) {
      .visualizer-layout {
        grid-template-columns: 280px 1fr;
      }
      .right-panel {
        display: none;
      }
    }
  `]
})
export class VisualizerComponent implements OnInit {
  @ViewChild('mainCanvas') canvasRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('canvasContainer') containerRef!: ElementRef<HTMLDivElement>;

  Math = Math;

  // Colors state
  allColors: Color[] = [];
  filteredColors: Color[] = [];
  categories: string[] = [];
  selectedCategory = 'ALL';
  searchQuery = '';
  selectedColor: Color | null = null;
  customHex = '#00E5A3';
  activeHex = '#457B9D';

  // Canvas & Image state
  roomImageLoaded = false;
  originalImageObj: HTMLImageElement | null = null;
  toolMode: 'polygon' = 'polygon';
  currentPolygonPoints: Point[] = [];
  mousePos: Point | null = null;
  isBeforeView = false;

  // Painting settings
  opacity = 0.65;
  finish: 'matte' | 'eggshell' | 'satin' | 'gloss' = 'matte';
  walls: WallSelection[] = [];

  // Save Modal state
  showSaveModal = false;
  saveProjectName = 'Living Room Paint Preview';
  saveIsPublic = true;
  saveLoading = false;
  currentProject: Project | null = null;
  currentImageFile: File | null = null;

  constructor(
    private colorService: ColorService,
    private projectService: ProjectService,
    public authService: AuthService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadColors();
    this.loadCategories();

    // Check if opening an existing project from query param
    this.route.queryParams.subscribe((params) => {
      if (params['projectId']) {
        this.loadExistingProject(params['projectId']);
      }
    });
  }

  loadColors() {
    this.colorService.getAllColors().subscribe({
      next: (res) => {
        this.allColors = res.data?.colors || [];
        this.filteredColors = [...this.allColors];
        if (this.allColors.length > 0) {
          this.onSelectColor(this.allColors[0]);
        }
      }
    });
  }

  loadCategories() {
    this.colorService.getCategories().subscribe({
      next: (res) => {
        this.categories = res.data?.categories || [];
      }
    });
  }

  loadExistingProject(id: string) {
    this.projectService.getProjectById(id).subscribe({
      next: (res) => {
        this.currentProject = res.data?.project;
        if (this.currentProject) {
          this.saveProjectName = this.currentProject.name;
          this.saveIsPublic = this.currentProject.isPublic;
          this.walls = this.currentProject.wallSelections || [];
          
          const imgUrl = this.currentProject.originalImage.startsWith('http') 
            ? this.currentProject.originalImage 
            : `${environment.serverUrl}${this.currentProject.originalImage}`;
          
          this.loadImageFromUrl(imgUrl);
        }
      }
    });
  }

  filterColors() {
    this.filteredColors = this.allColors.filter((c) => {
      const matchCat = this.selectedCategory === 'ALL' || c.category.includes(this.selectedCategory);
      const matchSearch = !this.searchQuery || c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || c.hex.toLowerCase().includes(this.searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }

  setCategory(cat: string) {
    this.selectedCategory = cat;
    this.filterColors();
  }

  onSelectColor(color: Color) {
    this.selectedColor = color;
    this.activeHex = color.hex;
    this.customHex = color.hex;
    this.finish = color.finish === 'semi-gloss' ? 'satin' : (color.finish as any) || 'matte';
  }

  applyCustomColor() {
    this.selectedColor = null;
    this.activeHex = this.customHex;
  }

  setTool(mode: 'polygon') {
    this.toolMode = mode;
  }

  setFinish(f: 'matte' | 'eggshell' | 'satin' | 'gloss') {
    this.finish = f;
    this.redrawCanvas();
  }

  onSettingsChanged() {
    this.redrawCanvas();
  }

  setBeforeView(before: boolean) {
    this.isBeforeView = before;
    this.redrawCanvas();
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.currentImageFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.loadImageFromUrl(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  }

  loadSampleRoom(roomType: 'living' | 'bedroom' | 'kitchen') {
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 800;
    const ctx = canvas.getContext('2d')!;

    // Draw realistic architectural room illustration
    // Ceiling
    const ceilGrad = ctx.createLinearGradient(0, 0, 0, 200);
    ceilGrad.addColorStop(0, '#e5e7eb');
    ceilGrad.addColorStop(1, '#d1d5db');
    ctx.fillStyle = ceilGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(1200, 0);
    ctx.lineTo(950, 180);
    ctx.lineTo(250, 180);
    ctx.closePath();
    ctx.fill();

    // Floor
    const floorGrad = ctx.createLinearGradient(0, 600, 0, 800);
    floorGrad.addColorStop(0, '#8d6e63');
    floorGrad.addColorStop(1, '#5d4037');
    ctx.fillStyle = floorGrad;
    ctx.beginPath();
    ctx.moveTo(250, 620);
    ctx.lineTo(950, 620);
    ctx.lineTo(1200, 800);
    ctx.lineTo(0, 800);
    ctx.closePath();
    ctx.fill();

    // Wood floor planks
    ctx.strokeStyle = 'rgba(0,0,0,0.15)';
    ctx.lineWidth = 2;
    for (let x = 100; x < 1100; x += 140) {
      ctx.beginPath();
      ctx.moveTo(x, 620);
      ctx.lineTo(x * 1.25 - 100, 800);
      ctx.stroke();
    }

    // Left Wall
    const leftWallGrad = ctx.createLinearGradient(0, 0, 250, 0);
    leftWallGrad.addColorStop(0, '#cbd5e1');
    leftWallGrad.addColorStop(1, '#94a3b8');
    ctx.fillStyle = leftWallGrad;
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(250, 180);
    ctx.lineTo(250, 620);
    ctx.lineTo(0, 800);
    ctx.closePath();
    ctx.fill();

    // Right Wall
    const rightWallGrad = ctx.createLinearGradient(950, 0, 1200, 0);
    rightWallGrad.addColorStop(0, '#94a3b8');
    rightWallGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = rightWallGrad;
    ctx.beginPath();
    ctx.moveTo(950, 180);
    ctx.lineTo(1200, 0);
    ctx.lineTo(1200, 800);
    ctx.lineTo(950, 620);
    ctx.closePath();
    ctx.fill();

    // Back Center Main Wall
    const backWallGrad = ctx.createLinearGradient(250, 180, 250, 620);
    backWallGrad.addColorStop(0, '#e2e8f0');
    backWallGrad.addColorStop(1, '#cbd5e1');
    ctx.fillStyle = backWallGrad;
    ctx.fillRect(250, 180, 700, 440);

    // Architectural Window on back wall
    ctx.fillStyle = '#bae6fd';
    ctx.fillRect(450, 240, 300, 220);
    // Window mullions
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 8;
    ctx.strokeRect(450, 240, 300, 220);
    ctx.beginPath();
    ctx.moveTo(600, 240);
    ctx.lineTo(600, 460);
    ctx.moveTo(450, 350);
    ctx.lineTo(750, 350);
    ctx.stroke();

    // Modern Sofa
    ctx.fillStyle = '#334155';
    ctx.beginPath();
    ctx.roundRect(420, 520, 360, 120, 16);
    ctx.fill();
    // Sofa cushions
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.roundRect(440, 500, 150, 60, 12);
    ctx.roundRect(610, 500, 150, 60, 12);
    ctx.fill();

    // Wall Art frame on Left Wall
    ctx.fillStyle = '#1e293b';
    ctx.beginPath();
    ctx.moveTo(60, 280);
    ctx.lineTo(190, 310);
    ctx.lineTo(190, 490);
    ctx.lineTo(60, 450);
    ctx.closePath();
    ctx.fill();

    const sampleDataUrl = canvas.toDataURL('image/png');
    this.loadImageFromUrl(sampleDataUrl);

    // Pre-populate an initial sample wall segment for quick testing
    this.walls = [
      {
        points: [
          { x: 250, y: 180 },
          { x: 950, y: 180 },
          { x: 950, y: 620 },
          { x: 250, y: 620 }
        ],
        colorHex: '#457B9D',
        opacity: 0.65,
        finish: 'matte'
      }
    ];
  }

  loadImageFromUrl(url: string) {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      this.originalImageObj = img;
      this.roomImageLoaded = true;
      setTimeout(() => {
        this.setupCanvasSize();
        this.redrawCanvas();
      }, 50);
    };
    img.src = url;
  }

  setupCanvasSize() {
    if (!this.originalImageObj || !this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    canvas.width = this.originalImageObj.width;
    canvas.height = this.originalImageObj.height;
  }

  onCanvasClick(event: MouseEvent) {
    if (!this.roomImageLoaded) return;
    const pt = this.getCanvasCoordinates(event);

    // Check if clicked close to the first point to close polygon
    if (this.currentPolygonPoints.length >= 3) {
      const firstPt = this.currentPolygonPoints[0];
      const dist = Math.hypot(pt.x - firstPt.x, pt.y - firstPt.y);
      if (dist < 20) {
        this.completePolygon();
        return;
      }
    }

    this.currentPolygonPoints.push(pt);
    this.redrawCanvas();
  }

  onCanvasDoubleClick(event: MouseEvent) {
    if (this.currentPolygonPoints.length >= 3) {
      this.completePolygon();
    }
  }

  onCanvasMouseMove(event: MouseEvent) {
    if (!this.roomImageLoaded || this.currentPolygonPoints.length === 0) return;
    this.mousePos = this.getCanvasCoordinates(event);
    this.redrawCanvas();
  }

  getCanvasCoordinates(event: MouseEvent): Point {
    const canvas = this.canvasRef.nativeElement;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    return {
      x: (event.clientX - rect.left) * scaleX,
      y: (event.clientY - rect.top) * scaleY
    };
  }

  completePolygon() {
    if (this.currentPolygonPoints.length < 3) return;

    this.walls.push({
      points: [...this.currentPolygonPoints],
      colorHex: this.activeHex,
      colorId: this.selectedColor?._id,
      opacity: this.opacity,
      finish: this.finish
    });

    this.currentPolygonPoints = [];
    this.mousePos = null;
    this.redrawCanvas();
  }

  undoLastPoint() {
    if (this.currentPolygonPoints.length > 0) {
      this.currentPolygonPoints.pop();
      this.redrawCanvas();
    }
  }

  clearAllWalls() {
    this.walls = [];
    this.currentPolygonPoints = [];
    this.redrawCanvas();
  }

  deleteWall(index: number) {
    this.walls.splice(index, 1);
    this.redrawCanvas();
  }

  redrawCanvas() {
    if (!this.canvasRef || !this.originalImageObj) return;
    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;

    // 1. Draw base original image
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this.originalImageObj, 0, 0);

    // If "Hold for Original" is active, skip drawing paint layers
    if (this.isBeforeView) {
      return;
    }

    // 2. Render all established wall selections
    for (const wall of this.walls) {
      if (wall.points.length < 3) continue;

      ctx.save();
      ctx.beginPath();
      ctx.moveTo(wall.points[0].x, wall.points[0].y);
      for (let i = 1; i < wall.points.length; i++) {
        ctx.lineTo(wall.points[i].x, wall.points[i].y);
      }
      ctx.closePath();

      // Realistic Wall Tint using Multiply & Overlay Blend Modes
      ctx.globalAlpha = wall.opacity || this.opacity;
      ctx.fillStyle = wall.colorHex || this.activeHex;
      ctx.fill();

      // Finish simulation (Gloss adds slight reflection tint)
      if (wall.finish === 'gloss') {
        ctx.globalCompositeOperation = 'screen';
        ctx.globalAlpha = 0.15;
        ctx.fillStyle = '#ffffff';
        ctx.fill();
      }

      ctx.restore();
    }

    // 3. Render in-progress polygon creation
    if (this.currentPolygonPoints.length > 0) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(this.currentPolygonPoints[0].x, this.currentPolygonPoints[0].y);
      for (let i = 1; i < this.currentPolygonPoints.length; i++) {
        ctx.lineTo(this.currentPolygonPoints[i].x, this.currentPolygonPoints[i].y);
      }

      if (this.mousePos) {
        ctx.lineTo(this.mousePos.x, this.mousePos.y);
      }

      // Live stroke
      ctx.strokeStyle = '#00e5a3';
      ctx.lineWidth = 3;
      ctx.setLineDash([6, 6]);
      ctx.stroke();

      // Draw vertex anchor points
      for (let i = 0; i < this.currentPolygonPoints.length; i++) {
        const pt = this.currentPolygonPoints[i];
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, i === 0 ? 8 : 5, 0, Math.PI * 2);
        ctx.fillStyle = i === 0 ? '#fbbf24' : '#00e5a3'; // First point is gold for easy closing
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.setLineDash([]);
        ctx.stroke();
      }

      ctx.restore();
    }
  }

  downloadCanvasImage() {
    if (!this.canvasRef) return;
    const canvas = this.canvasRef.nativeElement;
    const link = document.createElement('a');
    link.download = `smartwall-paint-preview-${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  promptSaveModal() {
    this.showSaveModal = true;
  }

  saveProjectToServer() {
    if (!this.canvasRef || !this.authService.isLoggedIn) return;

    this.saveLoading = true;
    const canvas = this.canvasRef.nativeElement;
    const paintedBase64 = canvas.toDataURL('image/png');

    if (this.currentProject) {
      // Update existing project
      this.projectService.saveDesign(this.currentProject._id, {
        paintedImage: paintedBase64,
        wallSelections: this.walls,
        name: this.saveProjectName
      }).subscribe({
        next: () => {
          this.saveLoading = false;
          this.showSaveModal = false;
          alert('Design successfully updated in your portfolio!');
        },
        error: (err) => {
          this.saveLoading = false;
          alert(err.error?.message || 'Error updating design.');
        }
      });
    } else {
      // Create new project with multipart form
      const formData = new FormData();
      formData.append('name', this.saveProjectName);
      formData.append('isPublic', String(this.saveIsPublic));
      formData.append('wallSelections', JSON.stringify(this.walls));

      if (this.currentImageFile) {
        formData.append('roomImage', this.currentImageFile);
      } else {
        // Sample room converted to blob
        const byteString = atob(this.originalImageObj!.src.split(',')[1]);
        const ab = new ArrayBuffer(byteString.length);
        const ia = new Uint8Array(ab);
        for (let i = 0; i < byteString.length; i++) {
          ia[i] = byteString.charCodeAt(i);
        }
        const blob = new Blob([ab], { type: 'image/png' });
        formData.append('roomImage', blob, 'sample-room.png');
      }

      this.projectService.createProject(formData).subscribe({
        next: (res) => {
          const newProjectId = res.data.project._id;
          // Save the painted rendered image
          this.projectService.saveDesign(newProjectId, {
            paintedImage: paintedBase64,
            wallSelections: this.walls
          }).subscribe({
            next: () => {
              this.saveLoading = false;
              this.showSaveModal = false;
              alert('Design successfully saved to your portfolio!');
              this.router.navigate(['/dashboard']);
            },
            error: () => {
              this.saveLoading = false;
              this.showSaveModal = false;
              this.router.navigate(['/dashboard']);
            }
          });
        },
        error: (err) => {
          this.saveLoading = false;
          alert(err.error?.message || 'Error creating project.');
        }
      });
    }
  }

  @HostListener('window:resize')
  onResize() {
    this.redrawCanvas();
  }
}
