import type { OtpRequest, OtpVerification, Session, User } from "@/features/auth/types";

const demoUser: User = {
  id: "usr-arjun-rao",
  name: "Arjun Rao",
  mobile: "9845012345",
  email: "arjun.rao@example.com",
  gstin: null,
  createdAt: "2025-11-04T18:32:00+05:30",
};

const WRONG_DEMO_OTP = "000000";

// Profile changes, by user id. Demo data lives in memory, so they last until the server restarts.
const savedUsers = new Map<string, User>([[demoUser.id, demoUser]]);

// The demo "token" just carries the user's id and sign-up details. Never do this with real auth.
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

  // Demo: any 6-digit code except 000000 is accepted, so the wrong-code message can be shown.
  // New numbers need a name, which creates the account.
  async verifyOtp(
    mobile: string,
    otp: string,
    name: string | null,
  ): Promise<OtpVerification | null> {
    if (otp === WRONG_DEMO_OTP) return null;
    if (mobile === demoUser.mobile) return { token: encode(demoUser), user: demoUser };
    if (!name) return null;
    const user: User = {
      id: `usr-${mobile}`,
      name,
      mobile,
      email: null,
      gstin: null,
      createdAt: new Date().toISOString(),
    };
    return { token: encode(user), user };
  },

  async getSession(token: string): Promise<Session | null> {
    const user = decode(token);
    return user ? { user: savedUsers.get(user.id) ?? user } : null;
  },

  async updateUser(user: User): Promise<User> {
    savedUsers.set(user.id, user);
    return user;
  },
};
