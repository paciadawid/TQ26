export interface CommentDto {
  id: number;
  post_id: number;
  name: string;
  email: string;
  body: string;
}

export type CreateCommentDto = Omit<CommentDto, 'id' | 'post_id'>;
