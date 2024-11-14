import dotenv from 'dotenv';
import { Injectable } from '@nestjs/common';
import { QueryDBAdapter } from './query-db.adapter';
import {
  Connection,
  createConnection,
  createPool,
  Pool,
  RowDataPacket,
} from 'mysql2/promise';

dotenv.config();

@Injectable()
export class SingleMySQLAdapter implements QueryDBAdapter {
  private adminConnection: Pool;
  private userConnectionList: Record<string, Connection> = {};

  constructor() {
    this.createAdminConnection();
  }

  getConnection(identify: string): Connection {
    return this.userConnectionList[identify];
  }

  private createAdminConnection() {
    this.adminConnection = createPool({
      host: process.env.QUERY_DB_HOST,
      user: process.env.QUERY_DB_USER,
      password: process.env.QUERY_DB_PASSWORD,
      port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
      connectionLimit: 10,
    });
  }

  public async createConnection(identify: string) {
    const connectInfo = {
      name: identify.substring(0, 10),
      password: identify,
      host: '%',
      database: identify,
    };

    await this.adminConnection.query(
      `create database ${connectInfo.database};`,
    );
    await this.adminConnection.query(
      `create user '${connectInfo.name}'@'${connectInfo.host}' identified by '${connectInfo.password}';`,
    );
    await this.adminConnection.query(
      `grant all privileges on ${connectInfo.database}.* to '${connectInfo.name}'@'${connectInfo.host}';`,
    );

    this.userConnectionList[identify] = await createConnection({
      host: process.env.QUERY_DB_HOST,
      user: connectInfo.name,
      password: connectInfo.password,
      port: parseInt(process.env.QUERY_DB_PORT || '3306', 10),
      database: connectInfo.database,
    });
  }

  public async closeConnection(identify: string) {
    await this.userConnectionList[identify].end();
    delete this.userConnectionList[identify];
    await this.removeDatabaseInfo(identify);
  }

  public async run(identify: string, query: string): Promise<RowDataPacket[]> {
    const connection = this.userConnectionList[identify];
    const [rows] = await connection.execute<RowDataPacket[]>(query);
    return rows;
  }

  private async removeDatabaseInfo(identify: string) {
    try {
      const dropDatabase = `drop database ${identify};`;
      await this.adminConnection.execute(dropDatabase);

      const dropUser = `drop user '${identify.substring(0, 10)}';`;
      await this.adminConnection.execute(dropUser);
    } catch (e) {
      // console.error(e);
    }
  }
}
