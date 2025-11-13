import { Comment, User } from "@/types/api";

export const canCreateDiscussion = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};
export const canDeleteDiscussion = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};
export const canUpdateDiscussion = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canViewUsers = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canCreateEvent = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canDeleteEvent = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canUpdateEvent = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canCreateProject = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canInviteJury = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canInviteAdministrator = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canDeleteProject = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canUpdateProject = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

// Courses
export const canCreateCourse = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canDeleteCourse = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canUpdateCourse = (user: User | null | undefined) => {
  return user?.role === "ADMIN";
};

export const canViewCourses = (user: User | null | undefined) => {
  // Todos los roles autenticados pueden ver cursos por ahora
  return Boolean(user);
};

export const canDeleteComment = (
  user: User | null | undefined,
  comment: Comment
) => {
  if (user?.role === "ADMIN") {
    return true;
  }

  // Los USER pueden eliminar sus propios comentarios
  if (user?.role === "USER" && comment.author?.id === user.id) {
    return true;
  }

  return false;
};
