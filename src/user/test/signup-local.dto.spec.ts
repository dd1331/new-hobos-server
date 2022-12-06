import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';
import { SignupLocalDTO } from '../dto/signup-local.dto';

describe('signup-local.dto', () => {
  describe('invalid', () => {
    it('invalid email', async () => {
      const plain: SignupLocalDTO = {
        email: 'test',
        password: 'fadfdasfdafsds',
      };
      const dto = plainToClass(SignupLocalDTO, plain);
      const res = await validate(dto);
      expect.assertions(2);
      expect(res.length).toBe(1);
      expect(res[0].property).toBe('email');
    });

    it('invalid password', async () => {
      const plain: SignupLocalDTO = {
        email: 'test@test.com',
        password: '1',
      };
      const dto = plainToClass(SignupLocalDTO, plain);
      const res = await validate(dto);
      expect.assertions(2);
      expect(res.length).toBe(1);
      expect(res[0].property).toBe('password');
    });
  });
  describe('valid', () => {
    it('valid', async () => {
      const plain: SignupLocalDTO = {
        email: 'test@test.com',
        password: 'fadfdasfdafsds',
      };
      const dto = plainToClass(SignupLocalDTO, plain);
      const res = await validate(dto);
      expect.assertions(1);
      expect(res.length).toBe(0);
    });
  });
});
