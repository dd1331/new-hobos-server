import { PutObjectCommandOutput } from '@aws-sdk/client-s3';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReqUser, User } from '../auth/user.decorator';
import { UploadService } from '../upload/upload.service';
import { SignupLocalDTO } from './dto/signup-local.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UserService } from './user.service';

@Controller('user')
export class UserController {
  constructor(
    private readonly userService: UserService,
    private readonly uploadService: UploadService,
  ) {}
  @UseGuards(JwtAuthGuard)
  @Get()
  getUser(@User() { id }: ReqUser) {
    return this.userService.getUser(id);
  }

  @Post('signup/local')
  create(@Body() createUserDto: SignupLocalDTO) {
    return this.userService.signupLocal(createUserDto);
  }

  @Get()
  findAll() {
    return this.userService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOne(+id);
  }

  @Put('profile')
  @UseGuards(JwtAuthGuard)
  update(@User() { id }: ReqUser, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(id, updateUserDto);
  }

  @Post('profile/image')
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async updateProfileImage(
    @User() { id }: ReqUser,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const PATH = process.env.NODE_ENV + '/user/profile';

    const [url] = await this.uploadService.upload(id, PATH, [file]);

    this.userService.updateProfileImage(id, url);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    // return this.userService.remove(+id);
  }
}
