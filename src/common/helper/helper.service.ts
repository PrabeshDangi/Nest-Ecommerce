import { Injectable } from '@nestjs/common';

@Injectable()
export class HelperService {
  async extractPublicId(url: string): Promise<string> {
    if (!url.startsWith(process.env.IMAGE_INITIAL)) {
      return null;
    }

    const parts = url.split('/');

    const secondPublicIndex = parts.indexOf(
      'public',
      parts.indexOf('public') + 1,
    );

    const extractedPart = parts.slice(secondPublicIndex).join('/');

    const finalPart = extractedPart.replace('/nest-ecommerce', '');

    return finalPart;
  }

  async generateOtp() {
    const digits = '0123456789';
    let OTP = '';
    const length = digits.length;
    for (let i = 0; i < 4; i++) {
      OTP += digits[Math.floor(Math.random() * length)];
    }
    return OTP;
  }
}
