import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Color } from '../../../core/models/color.model';

@Component({
  selector: 'app-color-swatch',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div 
      class="swatch-card" 
      [class.selected]="isSelected"
      (click)="selectColor()"
      [title]="color.name + ' (' + color.hex + ')'">
      <div class="swatch-circle" [style.background-color]="color.hex">
        @if (isSelected) {
          <i class="bi bi-check2 check-icon"></i>
        }
      </div>
      <div class="swatch-meta">
        <span class="swatch-name">{{ color.name }}</span>
        <span class="swatch-code">{{ color.hex }}</span>
      </div>
    </div>
  `,
  styles: [`
    .swatch-card {
      display: flex;
      flex-direction: column;
      align-items: center;
      padding: 0.5rem;
      border-radius: var(--radius-md);
      background: var(--bg-surface);
      border: 1px solid var(--border-color);
      cursor: pointer;
      transition: var(--transition);
      user-select: none;
    }
    .swatch-card:hover {
      background: var(--bg-card-hover);
      border-color: rgba(255, 255, 255, 0.2);
      transform: translateY(-2px);
    }
    .swatch-card.selected {
      border-color: var(--primary);
      box-shadow: 0 0 12px rgba(var(--primary-rgb), 0.3);
      background: rgba(var(--primary-rgb), 0.08);
    }
    .swatch-circle {
      width: 44px;
      height: 44px;
      border-radius: var(--radius-full);
      box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.25), 0 2px 6px rgba(0, 0, 0, 0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      position: relative;
    }
    .check-icon {
      font-size: 1.25rem;
      color: #fff;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.8);
      font-weight: 800;
    }
    .swatch-meta {
      display: flex;
      flex-direction: column;
      align-items: center;
      margin-top: 0.4rem;
      text-align: center;
      max-width: 100%;
    }
    .swatch-name {
      font-size: 0.725rem;
      font-weight: 600;
      color: var(--text-main);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 75px;
    }
    .swatch-code {
      font-size: 0.65rem;
      color: var(--text-dim);
      font-family: monospace;
      text-transform: uppercase;
    }
  `]
})
export class ColorSwatchComponent {
  @Input({ required: true }) color!: Color;
  @Input() isSelected = false;
  @Output() colorSelected = new EventEmitter<Color>();

  selectColor() {
    this.colorSelected.emit(this.color);
  }
}
