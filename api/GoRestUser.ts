import { type APIRequestContext, type APIResponse } from '@playwright/test';
import { type CreateUserDto, type UpdateUserDto } from '../dto/user';

const USERS_PATH = '/public/v2/users';

export class GoRestUser {
  constructor(private readonly request: APIRequestContext) {}

  async list(): Promise<APIResponse> {
    return this.request.get(USERS_PATH);
  }

  async getById(id: number): Promise<APIResponse> {
    return this.request.get(`${USERS_PATH}/${id}`);
  }

  async create(user: CreateUserDto): Promise<APIResponse> {
    return this.request.post(USERS_PATH, { data: user });
  }

  async update(id: number, user: UpdateUserDto): Promise<APIResponse> {
    return this.request.patch(`${USERS_PATH}/${id}`, { data: user });
  }

  async delete(id: number): Promise<APIResponse> {
    return this.request.delete(`${USERS_PATH}/${id}`);
  }
}
