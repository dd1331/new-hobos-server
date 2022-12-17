/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable } from '@nestjs/common';
import { UpdateUploadDto } from './dto/update-upload.dto';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
@Injectable()
export class UploadService {
  BUCEKT = 'hobos';
  REGION = 'ap-northeast-2';

  /**
   * @param path user/profile
   */
  async upload(userId: number, path: string, files: Express.Multer.File[]) {
    const s3Client = new S3Client({
      region: this.REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    try {
      const promises = files.map(async (file: Express.Multer.File) => {
        const Key = this.getKey(userId, path, file);
        const uploadParams: PutObjectCommandInput = {
          Bucket: this.BUCEKT,
          Key,
          Body: file.buffer,
        };
        await s3Client.send(new PutObjectCommand(uploadParams));
        const [filename] = Key.split('/').slice(-1);
        const url = `https://${this.BUCEKT}.s3.${this.REGION}.amazonaws.com/${path}/${filename}`;

        return url;
      });
      return await Promise.all(promises);
    } catch (err) {
      console.log('Error', err);
    }
  }
  getKey(userId: number, path: string, file: Express.Multer.File) {
    return (
      path +
      '/' +
      userId +
      '-' +
      file.originalname.split('.')[0] +
      new Date().getTime() +
      '.' +
      file.originalname.split('.')[1]
    );
  }

  findAll() {
    return `This action returns all upload`;
  }

  findOne(id: number) {
    return `This action returns a #${id} upload`;
  }

  update(id: number, updateUploadDto: UpdateUploadDto) {
    return `This action updates a #${id} upload`;
  }

  remove(id: number) {
    return `This action removes a #${id} upload`;
  }
}
