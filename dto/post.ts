export interface PostDto {
  id: number;
  user_id: number;
  title: string;
  body: string;
}

export type CreatePostDto = Omit<PostDto, 'id' | 'user_id'>;
