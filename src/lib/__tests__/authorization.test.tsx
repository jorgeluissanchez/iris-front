import { Comment, User } from '@/types/api';

import {
  canCreateDiscussion,
  canDeleteDiscussion,
  canUpdateDiscussion,
  canViewUsers,
  canDeleteComment,
} from '../authorization';

describe('Discussion Authorization', () => {
  const adminUser: User = {
    id: '1',
    role: 'ADMIN',
  } as User;

  const studentUser: User = {
    id: '2',
    role: 'STUDENT',
  } as User;

  const juryUser: User = {
    id: '3',
    role: 'JURY',
  } as User;

  test('should allow admin to create discussions', () => {
    expect(canCreateDiscussion(adminUser)).toBe(true);
    expect(canCreateDiscussion(studentUser)).toBe(false);
    expect(canCreateDiscussion(juryUser)).toBe(false);
    expect(canCreateDiscussion(null)).toBe(false);
    expect(canCreateDiscussion(undefined)).toBe(false);
  });

  test('should allow admin to delete discussions', () => {
    expect(canDeleteDiscussion(adminUser)).toBe(true);
    expect(canDeleteDiscussion(studentUser)).toBe(false);
    expect(canDeleteDiscussion(juryUser)).toBe(false);
    expect(canDeleteDiscussion(null)).toBe(false);
    expect(canDeleteDiscussion(undefined)).toBe(false);
  });

  test('should allow admin to update discussions', () => {
    expect(canUpdateDiscussion(adminUser)).toBe(true);
    expect(canUpdateDiscussion(studentUser)).toBe(false);
    expect(canUpdateDiscussion(juryUser)).toBe(false);
    expect(canUpdateDiscussion(null)).toBe(false);
    expect(canUpdateDiscussion(undefined)).toBe(false);
  });

  test('should allow admin to view users', () => {
    expect(canViewUsers(adminUser)).toBe(true);
    expect(canViewUsers(studentUser)).toBe(false);
    expect(canViewUsers(juryUser)).toBe(false);
    expect(canViewUsers(null)).toBe(false);
    expect(canViewUsers(undefined)).toBe(false);
  });
});

describe('Comment Authorization', () => {
  const adminUser: User = {
    id: '1',
    role: 'ADMIN',
  } as User;

  const studentUser: User = {
    id: '2',
    role: 'STUDENT',
  } as User;

  const anotherStudent: User = {
    id: '3',
    role: 'STUDENT',
  } as User;

  test('should allow admin to delete any comment', () => {
    const comment: Comment = {
      id: '1',
      author: anotherStudent,
    } as Comment;

    expect(canDeleteComment(adminUser, comment)).toBe(true);
  });

  test('should allow students to delete their own comments', () => {
    const comment: Comment = {
      id: '1',
      author: studentUser,
    } as Comment;

    expect(canDeleteComment(studentUser, comment)).toBe(true);
  });

  test('should not allow students to delete others comments', () => {
    const comment: Comment = {
      id: '1',
      author: anotherStudent,
    } as Comment;

    expect(canDeleteComment(studentUser, comment)).toBe(false);
  });

  test('should not allow unauthorized users to delete comments', () => {
    const comment: Comment = {
      id: '1',
      author: studentUser,
    } as Comment;

    expect(canDeleteComment(null, comment)).toBe(false);
    expect(canDeleteComment(undefined, comment)).toBe(false);
  });
});
