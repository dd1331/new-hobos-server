import { ConflictException } from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { AuthService } from '../../auth/auth.service';
import { AuthServiceImpl } from '../../auth/auth.serviceImpl';
import { SignupLocalDTO } from '../dto/signup-local.dto';
import { User } from '../entities/user.entity';
import { UserRepository } from '../user.repository';
import { userRepositoryMock } from '../user.repository.mock';
import { UserService } from '../user.service';

const moduleMocker = new ModuleMocker(global);
const authServiceMock: AuthService = {
  loginLocal: jest.fn().mockResolvedValueOnce({
    token: { accessToken: 'string', refreshToekn: 'string' },
    user: { id: 1, nickname: 'dfa' } as User,
  }),
  validateUser: jest.fn().mockResolvedValueOnce({}),
};

describe('UserService', () => {
  let service: UserService;
  // const userRepoMock: Partial<UserRepository> = userRepositoryMock;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return userRepositoryMock;
        }
        if (token === AuthServiceImpl) {
          return authServiceMock;
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

  describe('signupLocal', () => {
    it('이메일 중복', async () => {
      expect.assertions(1);
      const dto: SignupLocalDTO = { email: 'test@test.com', password: 'tests' };
      await expect(service.signupLocal(dto)).rejects.toThrow(ConflictException);
    });
    it('이메일 중복 없음', async () => {
      expect.assertions(1);
      const dto: SignupLocalDTO = { email: 'test@test.com', password: 'tests' };
      userRepositoryMock.findOneBy.mockResolvedValueOnce(undefined);
      await expect(service.signupLocal(dto)).resolves.toBeTruthy();
    });
    it('유저 생성 실패', async () => {});
    it('비밀번호 해싱', async () => {});
  });
});
