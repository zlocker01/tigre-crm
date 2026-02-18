import type { Category } from "../landingPages/Category";

export interface GalleryItem {
  id: number;
  user_id?: string;
  landing_page_id?: string;
  title?: string;
  description?: string;
  image: string;
  category: Category;
}
