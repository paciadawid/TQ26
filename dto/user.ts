export type Gender = 'female' | 'male';

export type UserStatus = 'active' | 'inactive';

export interface UserDto {
  id: number;
  name: string;
  email: string;
  gender: Gender;
  status: UserStatus;
}

export type CreateUserDto = Omit<UserDto, 'id'>;

export type UpdateUserDto = Partial<CreateUserDto>;

export interface ValidationErrorDto {
  field: string;
  message: string;
}
