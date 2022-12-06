import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { EntityNotFoundError } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { UserRepository } from '../../user/user.repository';
import { userRepositoryMock } from '../../user/user.repository.mock';
import { AuthServiceImpl } from '../auth.serviceimpl';
import { LoginLocalDto } from '../dto/login-local.dto';
// jest.mock('../../user/entities/user.entity');
const moduleMocker = new ModuleMocker(global);

describe('AuthServiceImpl', () => {
  let service: AuthServiceImpl;

  const accessToken = 'accessToken';
  const refreshToken = 'refreshToken';
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthServiceImpl],
    })
      .useMocker((token) => {
        if (token === UserRepository) {
          return userRepositoryMock;
        }
        if (token === JwtService) {
          return {
            sign: jest
              .fn()
              .mockReturnValueOnce(accessToken)
              .mockReturnValueOnce(refreshToken),
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

    service = module.get<AuthServiceImpl>(AuthServiceImpl);
  });
  describe('', () => {
    const dto: LoginLocalDto = {
      email: 'test@test.com',
      password: 'test',
    };

    it('succeed', async () => {
      jest.spyOn(User.prototype, 'login');
      expect.assertions(3);
      const res = await service.loginLocal(dto);
      expect(res.user.login).toBeCalledWith(expect.any(String));
      expect(res.user.refreshToken).toBeTruthy();
      expect(res.tokens).toEqual(
        expect.objectContaining({
          accessToken: accessToken,
          refreshToken: refreshToken,
        }),
      );
    });
    it('not found', async () => {
      expect.assertions(1);
      userRepositoryMock.findOneOrFail.mockRejectedValueOnce(
        EntityNotFoundError,
      );
      await expect(service.loginLocal(dto)).rejects.toThrow();
    });
    it('password not matching', async () => {
      expect.assertions(1);
      jest
        .spyOn(User.prototype, 'comparePassword')
        .mockImplementationOnce(() => {
          throw new BadRequestException();
        });
      await expect(service.loginLocal(dto)).rejects.toThrow();
    });
  });
});
