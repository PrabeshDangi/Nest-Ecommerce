import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { supabase } from 'src/common/config/supabase.config';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class ImageUploadService {
  async uploadImage(file: Express.Multer.File): Promise<string> {
    try {
      const { originalname, buffer } = file;
      const fileName = `${uuidv4()}-${originalname}`;

      console.log(file);

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from(process.env.BUCKET_NAME)
        .upload(`public/${fileName}`, file.buffer, {
          cacheControl: '3600',
          upsert: false,
          contentType: file.mimetype,
        });

      console.log(uploadData);

      if (uploadError) {
        throw new HttpException(
          `Image upload failed: ${uploadError.message}`,
          HttpStatus.INTERNAL_SERVER_ERROR,
        );
      }

      // Get the public URL of the uploaded image
      const { data: publicUrlData } = supabase.storage
        .from(process.env.BUCKET_NAME)
        .getPublicUrl(uploadData.path);

      console.log(publicUrlData);

      const publicURL = publicUrlData.publicUrl;

      return publicURL || '';
    } catch (error) {
      console.log(error);
    }
  }
}
