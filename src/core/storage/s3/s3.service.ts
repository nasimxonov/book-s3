import { Global, HttpException, Injectable } from '@nestjs/common';
import {
  GetObjectAclCommand,
  GetObjectCommand,
  PutObjectCommand,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { v4 as generateUuid } from 'uuid';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Global()
@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly bucketName: string;
  constructor(private configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.get<string>('AWS_S3_REGION'),
      credentials: {
        accessKeyId: this.configService.get<string>(
          'AWS_S3_ACCESS_KEY_ID',
        ) as string,
        secretAccessKey: this.configService.get<string>(
          'AWS_S3_SECRET_KEY',
        ) as string,
      },
    });
    this.bucketName = this.configService.get<string>(
      'AWS_S3_BUCKET_NAME',
    ) as string;
  }
  async uploadFile(file: Express.Multer.File, prefix: string) {
    try {
      const fileName = `${prefix}/${generateUuid()}`;
      const command = new PutObjectCommand({
        Bucket: this.bucketName,
        Body: file.buffer,
        Key: fileName,
        ContentType: file.mimetype,
      });
      const response = await this.s3Client.send(command);
      if (response.$metadata.httpStatusCode === 200) {
        const getUrlCommand = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: fileName,
          ResponseContentDisposition: 'attachment',
        });
        const url = await getSignedUrl(this.s3Client, getUrlCommand);
        return url;
      }
    } catch (error) {
      throw new HttpException(error, error.$metadata.httpStatusCode);
    }
  }
}
