import type { OtpRequest, OtpVerification, Session, User } from "@/features/auth/types";

const demoUser: User = {
  id: "usr-arjun-rao",
  name: "Arjun Rao",
  mobile: "9845012345",
  email: "arjun.rao@example.com",
  createdAt: "2025-11-04T18:32:00+05:30",
};

// The demo "token" just carries the user, so no server memory is needed. Never do this with real auth.
const encode = (user: User) => `demo.${Buffer.from(JSON.stringify(user)).toString("base64url")}`;

function decode(token: string): User | null {
  if (!token.startsWith("demo.")) return null;
  try {
    return JSON.parse(Buffer.from(token.slice(5), "base64url").toString()) as User;
  } catch {
    return null;
  }
}

export const mockAuth = {
  async requestOtp(mobile: string): Promise<OtpRequest> {
    return { isNewUser: mobile !== demoUser.mobile, resendAfterSeconds: 30 };
  },

  // Demo: any 6-digit code is accepted. New numbers need a name, which creates the account.
  async verifyOtp(mobile: string, name: string | null): Promise<OtpVerification | null> {
    if (mobile === demoUser.mobile) return { token: encode(demoUser), user: demoUser };
    if (!name) return null;
    const user: User = {
      id: `usr-${mobile}`,
      name,
      mobile,
      email: null,
      createdAt: new Date().toISOString(),
    };
    return { token: encode(user), user };
  },

  async getSession(token: string): Promise<Session | null> {
    const user = decode(token);
    return user ? { user } : null;
  },
};
