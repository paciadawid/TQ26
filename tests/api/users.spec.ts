import { randomUUID } from 'node:crypto';
import { type CreateUserDto, type UserDto } from '../../dto/user';
import { expect, test } from '../../fixtures/api';

const EMAIL_FORMAT = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

test.describe('GoRest users', () => {
  test('should return a default list of users with valid fields', async ({
    goRestUser,
  }) => {
    const response = await goRestUser.list();

    expect(response.status()).toBe(200);

    const users: UserDto[] = await response.json();
    expect(users.length).toBeGreaterThan(0);

    for (const user of users) {
      expect(typeof user.id).toBe('number');
      expect(typeof user.name).toBe('string');
      expect(typeof user.email).toBe('string');
      expect(user.email).toMatch(EMAIL_FORMAT);
      expect(['male', 'female']).toContain(user.gender);
      expect(['active', 'inactive']).toContain(user.status);
    }
  });

  test('should create a user that is readable with a token and hidden without one', async ({
    goRestUser,
    unauthenticatedGoRestUser,
    createdUserIds,
  }) => {
    const payload: CreateUserDto = {
      name: 'Ada Lovelace',
      email: `ada.lovelace.${randomUUID()}@example.com`,
      gender: 'female',
      status: 'active',
    };

    const createResponse = await goRestUser.create(payload);
    expect(createResponse.status()).toBe(201);

    const created: UserDto = await createResponse.json();
    createdUserIds.push(created.id);
    expect(created).toMatchObject(payload);
    expect(typeof created.id).toBe('number');

    const getResponse = await goRestUser.getById(created.id);
    expect(getResponse.status()).toBe(200);
    expect(await getResponse.json()).toEqual(created);

    const unauthenticatedResponse = await unauthenticatedGoRestUser.getById(
      created.id,
    );
    expect(unauthenticatedResponse.status()).toBe(404);
  });
});
