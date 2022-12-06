import { User } from './entities/user.entity';
// jest.mock('./entities/user.entity');

export const userRepositoryMock = {
  findOneBy: jest.fn().mockResolvedValue({}),
  save: jest.fn().mockImplementation((dto: Partial<User>) => {
    const user = new User();
    user.password = 'test';
    // return dto;
    return user;
  }),
  findOneOrFail: jest
    .fn()
    .mockImplementation(async (dto: Partial<User>): Promise<User> => {
      const user = new User();
      user.password = 'test';
      user.id = 1;
      user.email = 'test@test.com';
      return user;
    }),
};
