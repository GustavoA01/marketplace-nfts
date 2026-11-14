export const queryKeys = {
  auth: {
    all: ["auth"] as const,
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
    session: ["auth", "session"] as const,
    logout: ["auth", "logout"] as const,
  },
} as const;
