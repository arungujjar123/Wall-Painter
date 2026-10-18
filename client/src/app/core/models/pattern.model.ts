export interface Pattern {
  _id: string;
  name: string;
  description?: string;
  category: string;
  imageUrl: string;
  style?: string;
  scale?: number;
  isActive: boolean;
  createdAt?: string;
}
