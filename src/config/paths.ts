// Route paths with optional role metadata for authorization-aware navigation
// Roles are defined in src/types/api.ts as: "ADMIN" | "STUDENT" | "JURY"

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
      roles: ["ADMIN", "JURY", "STUDENT"],
    },
    dashboard: {
      getHref: () => "/app",
      roles: ["ADMIN", "JURY", "STUDENT"],
    },
    discussions: {
      getHref: () => "/app/discussions",
      roles: ["ADMIN"],
    },
    discussion: {
      getHref: (id: string) => `/app/discussions/${id}`,
      roles: ["ADMIN"],
    },
    users: {
      getHref: () => "/app/users",
      roles: ["ADMIN"],
    },
    profile: {
      getHref: () => "/app/profile",
      roles: ["ADMIN"],
    },
    events: {
      getHref: () => "/app/events",
      roles: ["ADMIN"],
    },
    event: {
      getHref: (id: string) => `/app/events/${id}`,
      roles: ["ADMIN"],
    },
    projects: {
      getHref: () => "/app/projects",
      roles: ["ADMIN"],
    },
    juries: {
      getHref: () => "/app/juries",
    },
    administrators: {
      getHref: () => "/app/administrators",
    },
    courses: {
      getHref: () => "/app/courses",
      roles: ["ADMIN"],
    },
    project_jury: {
      getHref: (id: string) => `/app/events/${id}`,
      roles: ["JURY"],
    },
    evaluations: {
      getHref: (id: string) => `/app/evaluations/${id}`,
      roles: ["JURY"],
    },
    criteria: {
      getHref: () => "/app/criteria",
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
