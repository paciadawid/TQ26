import { type UserDto } from '../../dto/user';
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
});
