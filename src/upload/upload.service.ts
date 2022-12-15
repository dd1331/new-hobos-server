import { Injectable } from '@nestjs/common';
import { CreateUploadDto } from './dto/create-upload.dto';
import { UpdateUploadDto } from './dto/update-upload.dto';
import {
  PutObjectCommand,
  PutObjectCommandInput,
  S3Client,
} from '@aws-sdk/client-s3';
import * as path from 'path';
import * as fs from 'fs';
@Injectable()
export class UploadService {
  // async create(createUploadDto: CreateUploadDto) {
  async create() {
    const REGION = 'ap-northeast-2';
    const s3Client = new S3Client({
      region: REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });
    const file = './package.json'; // Path to and name of object. For example '../myFiles/index.js'.
    const fileStream = fs.createReadStream(file);
    const uploadParams: PutObjectCommandInput = {
      Bucket: 'hobos',
      Key: 'user/' + path.basename(file),
      Body: fileStream,
    };
    try {
      const data = await s3Client.send(new PutObjectCommand(uploadParams));
      console.log('Success', data);
      return data; // For unit tests.
    } catch (err) {
      console.log('Error', err);
    }
    return 'This action adds a new upload';
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
