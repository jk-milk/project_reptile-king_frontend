import { Category } from "./Category";

export interface Post {
  id: number;
  user_id: number;
  title: string;
  content: string;
  category_id: number;
  category_name: string;
  img_urls: { [key: string]: string };
  views: number;
  likes: number;
  created_at: string;
  updated_at: string;
}

// 서버에서 가져온 카테고리에서 Post 관련 부분만 사용하기 편하게 타입 변경
export interface PostCategory {
  id: number;
  name: string;
  division: string;
  parent_id: null;
  img_url: null;
  subPosts: Category[];
}

export interface Comment {
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

export interface SelectedCategory {
  id: number | null;
  name: string;
}
