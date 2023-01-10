import { BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { MockFunctionMetadata, ModuleMocker } from 'jest-mock';
import { EntityNotFoundError } from 'typeorm';
import { Password } from '../../user/entities/password.entity';
import { AuthProvider, User } from '../../user/entities/user.entity';
import { UserRepository } from '../../user/user.repository';
import { userRepositoryMock } from '../../user/user.repository.mock';
import { AuthServiceImpl } from '../auth.serviceimpl';
import { LoginLocalDto } from '../dto/login-local.dto';
import { SignupSSODTO } from '../dto/signup-sso.dto';
// jest.mock('../../user/entities/user.entity');
const moduleMocker = new ModuleMocker(global);

describe('AuthServiceImpl', () => {
  let service: AuthServiceImpl;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthServiceImpl, JwtService],
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
  describe('로컬로그인', () => {
    const dto: LoginLocalDto = {
      email: 'test@test.com',
      password: 'test',
    };

    it('succeed', async () => {
      jest.spyOn(User.prototype, 'login');
      jest
        .spyOn(Password.prototype, 'comparePassword')
        .mockResolvedValueOnce(true);

      expect.assertions(3);
      const res = await service.loginLocal(dto);

      expect(res.user.login).toBeCalledWith(expect.any(Object));
      expect(res.user.refreshToken).toBeTruthy();
      expect(res.tokens).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
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
        .spyOn(Password.prototype, 'comparePassword')
        .mockImplementationOnce(() => {
          throw new BadRequestException();
        });
      await expect(service.loginLocal(dto)).rejects.toThrow();
    });
  });
  describe('SSO 로그인', () => {
    it('성공', async () => {
      const dto: SignupSSODTO = {
        email: 'test@test.com',
        ssoId: 'fadsfs',
        provider: AuthProvider.NAVER,
      };
      userRepositoryMock.findOneBy.mockResolvedValueOnce(undefined);
      const res = await service.signupSSO(dto);
      expect(res.user.refreshToken).toBeTruthy();
      expect(res.tokens).toEqual(
        expect.objectContaining({
          accessToken: expect.any(String),
          refreshToken: expect.any(String),
        }),
      );
    });
  });
});
