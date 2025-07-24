import type { Prisma } from '.prisma/client';

export type UserCreateInputType = Prisma.UserCreateInput & {
  profilePicture?: string | null;
  googleId?: string | null;
  otp?: string | null;
  otpExpiry?: Date | null;
};

export type UserUpdateInputType = Prisma.UserUpdateInput & {
  profilePicture?: string | null;
  googleId?: string | null;
  otp?: string | null;
  otpExpiry?: Date | null;
}; 