export interface UserInfo {
  name: string,
  nickname: string,
  password: string,
  email: string,
  phone: string,
  image: string | null;
}

export const defaultUrl = 'https://capstone-project-pachungking.s3.ap-northeast-2.amazonaws.com/images/defaults/defaultUserImage.png'
