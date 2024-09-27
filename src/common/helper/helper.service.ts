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

  async encodeToUUID(input: number): Promise<string> {
    const hexInput = input.toString(16).padStart(8, '0');

    const randomSegment = () => Math.random().toString(16).slice(2, 6);

    const uuid = `${hexInput}-${randomSegment()}-${randomSegment()}-${randomSegment()}-${randomSegment()}`;

    return uuid;
  }

  async decodeFromUUID(uuid: string): Promise<number> {
    const hexInput = uuid.split('-')[0];
    const decodedValue = parseInt(hexInput, 16);

    return decodedValue;
  }
}
