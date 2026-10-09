export type User = {
  id: string;
  name: string;
  /** 10-digit Indian mobile number without the country code. */
  mobile: string;
  email: string | null;
  createdAt: string;
};

export type Session = {
  user: User;
};

export type OtpRequest = {
  /** No account yet for this number: the customer gives their name and an account is created. */
  isNewUser: boolean;
  resendAfterSeconds: number;
};

export type OtpVerification = {
  /** Kept in an http-only cookie and sent back on every request. */
  token: string;
  user: User;
};
