import { getHash } from "next/dist/server/image-optimizer";

export const paths = {
  home: {
    getHref: () => "/",
  },

  auth: {
    register: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/register${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
    login: {
      getHref: (redirectTo?: string | null | undefined) =>
        `/auth/login${redirectTo ? `?redirectTo=${encodeURIComponent(redirectTo)}` : ""}`,
    },
  },

  app: {
    root: {
      getHref: () => "/app",
    },
    dashboard: {
      getHref: () => "/app",
    },
    discussions: {
      getHref: () => "/app/discussions",
    },
    discussion: {
      getHref: (id: string) => `/app/discussions/${id}`,
    },
    users: {
      getHref: () => "/app/users",
    },
    profile: {
      getHref: () => "/app/profile",
    },
    events: {
      getHref: () => "/app/events",
    },
    event: {
      getHref: (id: string) => `/app/events/${id}`,
    },
    projects: {
      getHref: () => "/app/projects",
    },
    courses: {
      getHref: () => "/app/courses",
    },
    project_jury: {
      getHref: (id: string) => `/app/project_jury/${id}`,
    },
    evaluations: {
      getHref: (id: string) => `/app/evaluations/${id}`,
    },
  },
  public: {
    discussion: {
      getHref: (id: string) => `/public/discussions/${id}`,
    },
    project: {
      getHref: (id: string) => `/public/projects/${id}`,
    },
    event: {
      getHref: () => '/public/events',
    }
  },
} as const;
