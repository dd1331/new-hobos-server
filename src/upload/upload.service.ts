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
  Bucket = 'hobos';
  REGION = 'ap-northeast-2';

  /**
   * @param path user/profile
   */
  async upload(userId: number, path: string, file: Express.Multer.File) {
    const s3Client = new S3Client({
      region: this.REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const Key = this.getKey(userId, path, file);
    const uploadParams: PutObjectCommandInput = {
      Bucket: this.Bucket,
      Key,
      Body: file.buffer,
    };
    try {
      await s3Client.send(new PutObjectCommand(uploadParams));
      const [filename] = Key.split('/').slice(-1);
      return filename;
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
