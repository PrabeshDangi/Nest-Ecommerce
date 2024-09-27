import { CookieOptions } from 'express';

export const accessTokenOption: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'lax',
};

export const refreshTokenOption: CookieOptions = {
  httpOnly: true,
  secure: false,
  sameSite: 'none',
  path: process.env.REFTOKEN_PATH,
};
