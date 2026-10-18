import { User } from './user.model';
import { Color } from './color.model';
import { Pattern } from './pattern.model';

export interface Point {
  x: number;
  y: number;
}

export interface WallSelection {
  _id?: string;
  points: Point[];
  colorId?: string | Color;
  colorHex?: string;
  patternId?: string | Pattern;
  opacity: number;
  finish?: string;
  name?: string;
}

export interface Project {
  _id: string;
  user: string | User;
  name: string;
  originalImage: string;
  wallSelections: WallSelection[];
  paintedImage?: string;
  thumbnail?: string;
  isPublic: boolean;
  createdAt?: string;
  updatedAt?: string;
}
