export const userRepositoryMock = {
  findOneBy: jest.fn().mockResolvedValue({}),
  save: jest.fn().mockResolvedValue({}),
};
