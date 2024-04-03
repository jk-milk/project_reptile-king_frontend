export type Post = {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category_id: number;
  img_urls: { [key: string]: string };
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
};

export type PostCategory = {
  id: number;
  title: string;
  link: string | null;
  main_category: number | null;
}

export type Comment = {
  id: number;
  user_id: number;
  post_id: number;
  content: string;
  group_comment_id: number;
  parent_comment_id?: number;
  depth_no: number;
  order_no: number;
  created_at: string;
  updated_at: string;
}
