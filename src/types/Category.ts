export interface Category {
  id: number;
  name: string;
  division: string;
  parent_id: string | null;
  img_url: string | null;
}