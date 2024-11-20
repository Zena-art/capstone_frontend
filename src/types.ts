export interface Book {
  _id: string;
  title: string;
  author: string;
  description: string;
  isbn: string;
  price: number;
  stockQuantity: number;
  coverImage?: string;
}