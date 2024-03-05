export type Post = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category: string;
  img_urls: { [key: string]: string };
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
};

export type PostCategory = {
  id: number;
  category: string;
  subCategories: {
    title: string;
    link: string;
  }[];
}
