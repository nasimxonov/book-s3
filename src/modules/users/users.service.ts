import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { S3Service } from 'src/core/storage/s3/s3.service';
import { PrismaService } from 'src/core/database/prisma.service';
@Injectable()
export class UsersService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly s3Service: S3Service,
  ) {}
async create(createUserDto: CreateUserDto, file: Express.Multer.File) {
  const url = await this.s3Service.uploadFile(file, 'images');

  const user = await this.prismaService.user.create({
    data: {
      username: "salom ala",
      password: "samsdmksmwo",
      image_url: url as string,
    },
  });

  return user;
}

}
