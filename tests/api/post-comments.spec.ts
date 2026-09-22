import { randomUUID } from 'node:crypto';
import { type CreateUserDto, type UserDto } from '../../dto/user';
import { type PostDto } from '../../dto/post';
import { type CommentDto } from '../../dto/comment';
import { expect, test } from '../../fixtures/api';

function buildUserPayload(): CreateUserDto {
  return {
    name: 'Test User',
    email: `test-user-${randomUUID()}@example.com`,
    gender: 'female',
    status: 'active',
  };
}

test.describe('GoRest post deletion cascades to comments', () => {
  let comment: CommentDto;

  test.beforeEach(
    async ({ goRestUser, goRestPost, goRestComment, createdUserIds }) => {
      const authorResponse = await goRestUser.create(buildUserPayload());
      const author: UserDto = await authorResponse.json();
      createdUserIds.push(author.id);

      const commenterResponse = await goRestUser.create(buildUserPayload());
      const commenter: UserDto = await commenterResponse.json();
      createdUserIds.push(commenter.id);

      const postResponse = await goRestPost.create(author.id, {
        title: 'Ship test post',
        body: 'Post created for cascade-delete coverage',
      });
      const post: PostDto = await postResponse.json();

      const commentResponse = await goRestComment.create(post.id, {
        name: commenter.name,
        email: commenter.email,
        body: 'Great post!',
      });
      comment = await commentResponse.json();

      const deleteResponse = await goRestPost.delete(post.id);
      expect(deleteResponse.status()).toBe(204);
    },
  );

  test("should remove the post's comment when the post is deleted", async ({
    goRestComment,
  }) => {
    const response = await goRestComment.getById(comment.id);

    expect(response.status()).toBe(404);
  });
});
