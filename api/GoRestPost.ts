import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { type CreatePostDto } from '../dto/post';

const POSTS_PATH = '/public/v2/posts';

export class GoRestPost {
  constructor(private readonly request: APIRequestContext) {}

  async create(userId: number, post: CreatePostDto): Promise<APIResponse> {
    return this.request.post(`/public/v2/users/${userId}/posts`, {
      data: post,
    });
  }

  async delete(id: number): Promise<APIResponse> {
    return this.request.delete(`${POSTS_PATH}/${id}`);
  }
}
