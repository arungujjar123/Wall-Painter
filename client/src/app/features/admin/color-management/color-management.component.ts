import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { ColorService } from '../../../core/services/color.service';
import { Color } from '../../../core/models/color.model';

@Component({
  selector: 'app-color-management',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  template: `
    <div class="admin-page">
      <div class="container">
        <!-- Header -->
        <div class="admin-header">
          <div>
            <a routerLink="/admin" class="back-link"><i class="bi bi-arrow-left"></i> Back to Dashboard</a>
            <h1>Paint Color Management</h1>
            <p class="subtitle">Add, edit, or disable paint colors and manufacturer shades available in the visualizer.</p>
          </div>
          <button class="btn btn-primary btn-sm" (click)="openAddModal()">
            <i class="bi bi-plus-lg"></i> Add New Shade
          </button>
        </div>

        <!-- Filter bar -->
        <div class="card filter-card mb-3">
          <div class="filter-flex">
            <div class="search-box">
              <i class="bi bi-search"></i>
              <input 
                type="text" 
                [(ngModel)]="searchQuery" 
                (ngModelChange)="filterColors()" 
                placeholder="Search color by name or hex..." 
                class="form-control form-control-sm">
            </div>

            <div class="select-group">
              <select [(ngModel)]="selectedBrand" (ngModelChange)="filterColors()" class="form-control form-control-sm">
                <option value="ALL">All Brands</option>
                <option value="Asian Paints">Asian Paints</option>
                <option value="Dulux">Dulux</option>
                <option value="Berger">Berger</option>
                <option value="Nerolac">Nerolac</option>
                <option value="Nippon Paint">Nippon Paint</option>
              </select>

              <select [(ngModel)]="selectedCategory" (ngModelChange)="filterColors()" class="form-control form-control-sm">
                <option value="ALL">All Categories</option>
                <option value="Living Room">Living Room</option>
                <option value="Bedroom">Bedroom</option>
                <option value="Kitchen">Kitchen</option>
                <option value="Bathroom">Bathroom</option>
                <option value="Accent">Accent</option>
                <option value="Nursery">Nursery</option>
                <option value="Exterior">Exterior</option>
              </select>
            </div>
          </div>
        </div>

        <!-- Color Table -->
        @if (loading) {
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading paint catalog...</p>
          </div>
        } @else {
          <div class="card table-card">
            <div class="table-responsive">
              <table class="color-table">
                <thead>
                  <tr>
                    <th>Color Swatch</th>
                    <th>Color Name</th>
                    <th>HEX Code</th>
                    <th>Brand</th>
                    <th>Finish</th>
                    <th>Categories</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  @for (color of filteredColors; track color._id) {
                    <tr>
                      <td>
                        <div class="color-swatch-cell" [style.background-color]="color.hex"></div>
                      </td>
                      <td><strong>{{ color.name }}</strong></td>
                      <td><code class="hex-badge">{{ color.hex }}</code></td>
                      <td>{{ color.brand }}</td>
                      <td><span class="badge badge-gray">{{ color.finish }}</span></td>
                      <td>
                        <div class="cat-pill-group">
                          @for (cat of color.category; track cat) {
                            <span class="badge badge-blue cat-pill">{{ cat }}</span>
                          }
                        </div>
                      </td>
                      <td>
                        <button class="btn btn-danger btn-sm" (click)="deleteColor(color._id)" title="Deactivate Shade">
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

    <!-- Add Color Modal -->
    @if (showModal) {
      <div class="modal-backdrop">
        <div class="modal-card">
          <div class="modal-header">
            <h3>Add New Paint Color</h3>
            <button class="modal-close" (click)="showModal = false"><i class="bi bi-x-lg"></i></button>
          </div>
          <form (ngSubmit)="saveNewColor()">
            <div class="modal-body">
              <div class="form-group">
                <label class="form-label">Color Name</label>
                <input type="text" [(ngModel)]="newColor.name" name="name" class="form-control" placeholder="e.g. Royal Sapphire" required>
              </div>

              <div class="grid grid-cols-2">
                <div class="form-group">
                  <label class="form-label">HEX Code</label>
                  <div class="d-flex align-center gap-1">
                    <input type="color" [(ngModel)]="newColor.hex" name="colorPicker" class="color-picker-input">
                    <input type="text" [(ngModel)]="newColor.hex" name="hex" class="form-control" placeholder="#0F52BA" required>
                  </div>
                </div>

                <div class="form-group">
                  <label class="form-label">Brand</label>
                  <select [(ngModel)]="newColor.brand" name="brand" class="form-control">
                    <option value="Asian Paints">Asian Paints</option>
                    <option value="Dulux">Dulux</option>
                    <option value="Berger">Berger</option>
                    <option value="Nerolac">Nerolac</option>
                    <option value="Nippon Paint">Nippon Paint</option>
                  </select>
                </div>
              </div>

              <div class="grid grid-cols-2">
                <div class="form-group">
                  <label class="form-label">Finish</label>
                  <select [(ngModel)]="newColor.finish" name="finish" class="form-control">
                    <option value="matte">Matte</option>
                    <option value="eggshell">Eggshell</option>
                    <option value="satin">Satin</option>
                    <option value="semi-gloss">Semi-Gloss</option>
                    <option value="gloss">Gloss</option>
                  </select>
                </div>

                <div class="form-group">
                  <label class="form-label">Primary Category</label>
                  <select [(ngModel)]="newColorCategory" name="primaryCat" class="form-control">
                    <option value="Living Room">Living Room</option>
                    <option value="Bedroom">Bedroom</option>
                    <option value="Kitchen">Kitchen</option>
                    <option value="Bathroom">Bathroom</option>
                    <option value="Accent">Accent</option>
                    <option value="Exterior">Exterior</option>
                    <option value="Nursery">Nursery</option>
                  </select>
                </div>
              </div>

              <div class="form-group">
                <label class="form-label">Description (Optional)</label>
                <input type="text" [(ngModel)]="newColor.description" name="description" class="form-control" placeholder="Brief aesthetic description">
              </div>
            </div>

            <div class="modal-footer">
              <button type="button" class="btn btn-secondary" (click)="showModal = false">Cancel</button>
              <button type="submit" class="btn btn-primary">Save Shade</button>
            </div>
          </form>
        </div>
      </div>
    }
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
      display: flex;
      justify-content: space-between;
      align-items: flex-end;
      margin-bottom: 2rem;
      flex-wrap: wrap;
      gap: 1.5rem;
    }
    .admin-header h1 {
      font-size: 2.25rem;
      font-weight: 800;
    }
    .subtitle { color: var(--text-muted); }
    .filter-card {
      padding: 1rem 1.25rem;
    }
    .filter-flex {
      display: flex;
      justify-content: space-between;
      gap: 1rem;
      flex-wrap: wrap;
    }
    .search-box {
      position: relative;
      flex: 1;
      min-width: 260px;
    }
    .search-box i {
      position: absolute;
      left: 0.75rem;
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-dim);
    }
    .search-box input { padding-left: 2rem; }
    .select-group {
      display: flex;
      gap: 0.75rem;
    }
    .table-card { padding: 0; overflow: hidden; }
    .table-responsive { overflow-x: auto; }
    .color-table {
      width: 100%;
      border-collapse: collapse;
      font-size: 0.875rem;
    }
    .color-table th {
      padding: 1rem 1.25rem;
      text-align: left;
      font-size: 0.75rem;
      font-weight: 600;
      color: var(--text-dim);
      text-transform: uppercase;
      border-bottom: 1px solid var(--border-color);
      background: rgba(255, 255, 255, 0.02);
    }
    .color-table td {
      padding: 0.9rem 1.25rem;
      border-bottom: 1px solid rgba(255, 255, 255, 0.04);
      vertical-align: middle;
    }
    .color-swatch-cell {
      width: 32px;
      height: 32px;
      border-radius: var(--radius-sm);
      border: 1px solid rgba(255, 255, 255, 0.2);
      box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    }
    .hex-badge {
      background: var(--bg-surface);
      padding: 0.2rem 0.5rem;
      border-radius: var(--radius-sm);
      font-family: monospace;
      color: var(--primary);
      font-size: 0.8rem;
    }
    .cat-pill-group {
      display: flex;
      flex-wrap: wrap;
      gap: 0.35rem;
    }
    .cat-pill { font-size: 0.7rem; }
    .color-picker-input {
      width: 36px;
      height: 36px;
      border: none;
      cursor: pointer;
      background: transparent;
    }
    .mb-3 { margin-bottom: 1.5rem; }
    .modal-backdrop {
      position: fixed;
      top: 0; left: 0; width: 100vw; height: 100vh;
      background: rgba(0,0,0,0.75);
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
      max-width: 520px;
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
      margin-top: 1.5rem;
    }
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
export class ColorManagementComponent implements OnInit {
  colors: Color[] = [];
  filteredColors: Color[] = [];
  loading = true;

  searchQuery = '';
  selectedBrand = 'ALL';
  selectedCategory = 'ALL';

  showModal = false;
  newColorCategory = 'Living Room';
  newColor: Partial<Color> = {
    name: '',
    hex: '#0F52BA',
    brand: 'Asian Paints',
    finish: 'matte',
    description: ''
  };

  constructor(private colorService: ColorService) {}

  ngOnInit() {
    this.loadColors();
  }

  loadColors() {
    this.loading = true;
    this.colorService.getAllColors().subscribe({
      next: (res) => {
        this.colors = res.data?.colors || [];
        this.filteredColors = [...this.colors];
        this.loading = false;
      },
      error: () => {
        this.loading = false;
      }
    });
  }

  filterColors() {
    this.filteredColors = this.colors.filter((c) => {
      const matchBrand = this.selectedBrand === 'ALL' || c.brand === this.selectedBrand;
      const matchCat = this.selectedCategory === 'ALL' || c.category.includes(this.selectedCategory);
      const matchSearch = !this.searchQuery || 
        c.name.toLowerCase().includes(this.searchQuery.toLowerCase()) || 
        c.hex.toLowerCase().includes(this.searchQuery.toLowerCase());

      return matchBrand && matchCat && matchSearch;
    });
  }

  openAddModal() {
    this.showModal = true;
  }

  saveNewColor() {
    if (!this.newColor.name || !this.newColor.hex) return;

    // Convert hex to rgb
    const hex = this.newColor.hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16) || 0;
    const g = parseInt(hex.substring(2, 4), 16) || 0;
    const b = parseInt(hex.substring(4, 6), 16) || 0;

    const payload: Partial<Color> = {
      ...this.newColor,
      rgb: { r, g, b },
      category: [this.newColorCategory]
    };

    this.colorService.createColor(payload).subscribe({
      next: (res) => {
        this.colors.unshift(res.data.color);
        this.filterColors();
        this.showModal = false;
        this.newColor = { name: '', hex: '#0F52BA', brand: 'Asian Paints', finish: 'matte' };
      },
      error: (err) => {
        alert(err.error?.message || 'Error creating color.');
      }
    });
  }

  deleteColor(id: string) {
    if (confirm('Deactivate this paint color?')) {
      this.colorService.deleteColor(id).subscribe({
        next: () => {
          this.colors = this.colors.filter(c => c._id !== id);
          this.filterColors();
        }
      });
    }
  }
}
