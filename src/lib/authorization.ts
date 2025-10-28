import { Comment, User } from '@/types/api';

export const canCreateDiscussion = (user: User | null | undefined) => {
  return user?.role === 'ADMIN';
};
export const canDeleteDiscussion = (user: User | null | undefined) => {
  return user?.role === 'ADMIN';
};
export const canUpdateDiscussion = (user: User | null | undefined) => {
  return user?.role === 'ADMIN';
};

export const canViewUsers = (user: User | null | undefined) => {
  return user?.role === 'ADMIN';
};

export const canDeleteComment = (
  user: User | null | undefined,
  comment: Comment,
) => {
  if (user?.role === 'ADMIN') {
    return true;
  }

  // STUDENT y JURY pueden eliminar sus propios comentarios
  if ((user?.role === 'STUDENT' || user?.role === 'JURY') && comment.author?.id === user.id) {
    return true;
  }

  return false;
};
