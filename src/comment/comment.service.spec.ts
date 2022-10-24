import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { DataSource, EntityNotFoundError } from 'typeorm';
import { Post } from '../post/entities/post.entity';
import { CommentService } from './comment.service';

const moduleMocker = new ModuleMocker(global);

describe('CommentService', () => {
  let service: CommentService;

  const repository = {
    create: jest.fn().mockReturnValue({}),
    save: jest.fn().mockResolvedValue({}),
    findOneByOrFail: jest.fn().mockResolvedValue({}),
  };
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommentService],
    })
      .useMocker((token) => {
        if (token === DataSource) {
          return {
            // transaction: (callback) => callback(manager),
            // manager,
            getRepository: () => {
              return repository;
            },
          };
        }
        if (typeof token === 'function') {
          const mockMetadata = moduleMocker.getMetadata(
            token,
          ) as MockFunctionMetadata<any, any>;
          const Mock = moduleMocker.generateFromMetadata(mockMetadata);
          return new Mock();
        }
      })

      .compile();

    service = module.get<CommentService>(CommentService);
  });

  it('should be defined', async () => {
    repository.findOneByOrFail.mockRejectedValueOnce(
      new EntityNotFoundError(Post, 1),
    );
    await expect(
      service.create({
        content: 'test',
        postId: 1,
        userId: 1,
      }),
    ).rejects.toThrow(EntityNotFoundError);
  });
});
