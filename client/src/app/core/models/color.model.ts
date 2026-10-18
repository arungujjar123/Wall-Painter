export interface Color {
  _id: string;
  name: string;
  hex: string;
  rgb: {
    r: number;
    g: number;
    b: number;
  };
  brand: string;
  finish: 'matte' | 'satin' | 'semi-gloss' | 'gloss' | 'eggshell';
  category: string[];
  description?: string;
  isActive: boolean;
  createdAt?: string;
}

export interface ColorFilter {
  category?: string;
  brand?: string;
  finish?: string;
  search?: string;
}
