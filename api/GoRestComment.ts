import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { type CreateCommentDto } from '../dto/comment';

const COMMENTS_PATH = '/public/v2/comments';

export class GoRestComment {
  constructor(private readonly request: APIRequestContext) {}

  async create(
    postId: number,
    comment: CreateCommentDto,
  ): Promise<APIResponse> {
    return this.request.post(`/public/v2/posts/${postId}/comments`, {
      data: comment,
    });
  }

  async getById(id: number): Promise<APIResponse> {
    return this.request.get(`${COMMENTS_PATH}/${id}`);
  }
}
