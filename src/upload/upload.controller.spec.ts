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
    // const app = module.createNestApplication();
    controller = module.get<UploadController>(UploadController);
    // app.init();
  });

  it('should be defined', async () => {
    expect(controller).toBeDefined();
    await controller.create();
  });
});
