import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  type: 'mysql',
  host: '127.0.0.1',
  port: 3306,
  username: 'charlie',
  password: '1331',
  database: 'hobos',
  synchronize: true,
  dropSchema: false,
  logging: ['error'],
};

export const dataSource: DataSource = new DataSource({
  ...dataSourceOptions,
});
