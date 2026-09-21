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

  test.describe('created user', () => {
    let payload: CreateUserDto;
    let created: UserDto;

    test.beforeEach(async ({ goRestUser, createdUserIds }) => {
      payload = {
        name: 'Ada Lovelace',
        email: `ada.lovelace.${randomUUID()}@example.com`,
        gender: 'female',
        status: 'active',
      };

      const createResponse = await goRestUser.create(payload);
      expect(createResponse.status()).toBe(201);

      created = await createResponse.json();
      createdUserIds.push(created.id);
    });

    test('should create a user with the requested fields', () => {
      expect(created).toMatchObject(payload);
      expect(typeof created.id).toBe('number');
    });

    test('should let a token-authenticated request read the created user', async ({
      goRestUser,
    }) => {
      const response = await goRestUser.getById(created.id);

      expect(response.status()).toBe(200);
      expect(await response.json()).toEqual(created);
    });

    test('should hide the created user from unauthenticated requests', async ({
      unauthenticatedGoRestUser,
    }) => {
      const response = await unauthenticatedGoRestUser.getById(created.id);

      expect(response.status()).toBe(404);
    });
  });
});
