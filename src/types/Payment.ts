export interface Payment {
  id: string;
  name: string;
  number: string;
  month: string;
  year: string;
  is_default: boolean;
}

export interface CardData {
  name: string;
  number: string;
  month: string;
  year: string;
  is_default?: boolean;
}

// types/ApiResponse.ts
export interface ApiResponseWithData<T> {
  msg: string;
  data: T;
}

export interface ApiResponseWithoutData {
  msg: string;
}
