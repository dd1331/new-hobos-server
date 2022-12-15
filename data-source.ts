import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'charlie',
  password: '1331',
  database: process.env.NODE_ENV === 'test' ? 'hobos_test' : 'hobos',
  synchronize: true,
  dropSchema: process.env.NODE_ENV === 'test',
  logging: ['error'],
};

export const dataSource: DataSource = new DataSource({
  ...dataSourceOptions,
});
