import { Test, TestingModule } from '@nestjs/testing';
import { UploadController } from './upload.controller';
import { UploadService } from './upload.service';
import { ConfigModule } from '@nestjs/config';
describe('UploadController', () => {
  let controller: UploadController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule.forRoot()],
      controllers: [UploadController],
      providers: [UploadService],
    }).compile();
    controller = module.get<UploadController>(UploadController);
  });

  it('should be defined', async () => {
    // expect.assertions(1);
    // const res = await controller.upload();
    // expect(res).toBeTruthy();
  });
});
