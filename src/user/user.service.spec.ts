import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { UserRepository } from './user.repository';
import { userRepositoryMock } from './user.repository.mock';
import { UserService } from './user.service';

const moduleMocker = new ModuleMocker(global);

describe('UserService', () => {
  let service: UserService;
  const userRepoMock: Partial<UserRepository> = userRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return userRepositoryMock;
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

    service = module.get<UserService>(UserService);
  });

  it('이메일 중복 에러', async () => {});
  it('유저 생성 실패', async () => {});
  it('비밀번호 해싱', async () => {});
});
