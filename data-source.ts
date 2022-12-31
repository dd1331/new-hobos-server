import { DataSource, DataSourceOptions } from 'typeorm';

const IS_TEST = process.env.NODE_ENV === 'test';

export const dataSourceOptions = (): DataSourceOptions => ({
  type: 'mysql',
  host: process.env.HOST,
  port: Number(process.env.PORT),
  username: process.env.USERNAME,
  password: process.env.PASSWORD,
  database: IS_TEST ? 'hobos_test' : process.env.DATABASE,
  synchronize: !!process.env.SYNCRONIZE,
  dropSchema: IS_TEST,
  logging: ['error'],
});

export const dataSource: DataSource = new DataSource({
  ...dataSourceOptions(),
});
