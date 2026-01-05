import { DynamicModule, Global, Module } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DATA_SOURCE } from './database.constants';
import { ConfigService } from '@nestjs/config';
// import { Repository } from 'typeorm';

type DbOptions = {
  host: string;
  port: number;
  username: string;
  password: string;
  database: string;
  entities?: any[]; // Add this
};

@Global() // so you don't need to import it everywhere (research why)
@Module({})
export class DatabaseModule {
  static forRootAsync(arg0: {
    inject: ConfigService[];
    useFactory: (configService: ConfigService) => {
      host: string | undefined;
      port: number | undefined;
      username: string | undefined;
      password: string | undefined;
      database: string | undefined;
    };
  }):
    | import('@nestjs/common').Type<any>
    | DynamicModule
    | Promise<DynamicModule>
    | import('@nestjs/common').ForwardReference<any> {
    throw new Error('Method not implemented.');
  }
  static forRoot(options: DbOptions): DynamicModule {
    const dataSourceProvider = {
      provide: DATA_SOURCE,
      useFactory: async () => {
        const ds = new DataSource({
          type: 'postgres',
          host: options.host,
          port: options.port,
          username: options.username,
          password: options.password,
          database: options.database,
          entities: options.entities || [], // Add this

          //Alternative: Use glob pattern
          // entities: [__dirname + '/**/*.entity{.ts,.js}'],

          // TODO: register entities properly
          // entities: [ ... ],
          // TODO: choose ONE approach:
          // 1) synchronize: true (easy, not production)
          // 2) migrations (better)
          synchronize: true,
        });

        return ds.initialize();
      },
    };

    return {
      module: DatabaseModule,
      providers: [dataSourceProvider],
      exports: [dataSourceProvider],
    };
  }
  static forFeature(entities: any[]): DynamicModule {
    const repoProviders = entities.map((entity) => ({
      provide: `${entity.name.toUpperCase()}_REPO`,
      useFactory: (ds: DataSource) => ds.getRepository(entity),
      inject: [DATA_SOURCE],
    }));

    return {
      module: DatabaseModule,
      providers: repoProviders,
      exports: repoProviders,
    };
  }

  // forFeature will be done later (after entities exist)
}
