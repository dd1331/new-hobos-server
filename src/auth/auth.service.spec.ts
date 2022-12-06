import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { UserRepository } from '../user/user.repository';
import { userRepositoryMock } from '../user/user.repository.mock';
import { AuthServiceImpl } from './auth.service.impl';

const moduleMocker = new ModuleMocker(global);

describe('AuthServiceImpl', () => {
  let service: AuthServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthServiceImpl],
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

    service = module.get<AuthServiceImpl>(AuthServiceImpl);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
