import {
  randCompanyName,
  randUserName,
  randEmail,
  randParagraph,
  randUuid,
  randPassword,
  randCatchPhrase,
} from '@ngneat/falso';

const generateUser = () => ({
  id: randUuid() + Math.random(),
  firstName: randUserName({ withAccents: false }),
  lastName: randUserName({ withAccents: false }),
  email: randEmail(),
  password: randPassword(),
  teamId: randUuid(),
  teamName: randCompanyName(),
  role: 'ADMIN',
  bio: randParagraph(),
  createdAt: Date.now(),
});

export const createUser = <T extends Partial<ReturnType<typeof generateUser>>>(
  overrides?: T,
) => {
  return { ...generateUser(), ...overrides };
};

const generateTeam = () => ({
  id: randUuid(),
  name: randCompanyName(),
  description: randParagraph(),
  createdAt: Date.now(),
});

export const createTeam = <T extends Partial<ReturnType<typeof generateTeam>>>(
  overrides?: T,
) => {
  return { ...generateTeam(), ...overrides };
};

const generateDiscussion = () => ({
  id: randUuid(),
  title: randCatchPhrase(),
  body: randParagraph(),
  createdAt: Date.now(),
  public: true,
});

export const createDiscussion = <
  T extends Partial<ReturnType<typeof generateDiscussion>>,
>(
  overrides?: T & {
    authorId?: string;
    teamId?: string;
  },
) => {
  return { ...generateDiscussion(), ...overrides };
};

const generateComment = () => ({
  id: randUuid(),
  body: randParagraph(),
  createdAt: Date.now(),
});

export const createComment = <
  T extends Partial<ReturnType<typeof generateComment>>,
>(
  overrides?: T & {
    authorId?: string;
    discussionId?: string;
  },
) => {
  return { ...generateComment(), ...overrides };
};

const generateEvent = () => ({
  id: randUuid(),
  title: randCatchPhrase(),
  description: randParagraph(),
  startDate: Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000, // Last 30 days
  endDate: Date.now() + Math.random() * 30 * 24 * 60 * 60 * 1000, // Next 30 days
  accessCode: `EVT${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
  isPublic: Math.random() > 0.5,
  evaluationsStatus: Math.random() > 0.5 ? 'open' : 'closed',
  createdAt: Date.now(),
});

export const createEvent = <
  T extends Partial<ReturnType<typeof generateEvent>>,
>(
  overrides?: T,
) => {
  return { ...generateEvent(), ...overrides };
};