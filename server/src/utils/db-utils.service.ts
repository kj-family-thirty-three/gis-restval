import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import {
  Model,
  Document,
  MongooseFilterQuery,
  CreateQuery,
  ClientSession,
  Connection,
} from 'mongoose';
import { constructMongoError } from './helpers';

@Injectable()
export class DbUtilsService {
  private readonly _logger = new Logger(DbUtilsService.name);

  constructor(
    @InjectConnection() private readonly _mongoConnection: Connection,
  ) { }

  async deleteDocument<T extends Document>(
    id: string,
    dbModel: Model<T>,
  ): Promise<T> {
    try {
      this._logger.debug('DB:DELETE_DOCUMENT:EE');
      const res = await dbModel.findByIdAndDelete(id).exec();
      this._logger.debug('DB:DELETE_DOCUMENT:LL');
      return res;
    } catch (ex) {
      this._logger.debug(`DB:DELETE_DOCUMENT:ERROR: ${ex}`);
      throw constructMongoError(ex);
    }
  }

  async findAll<T extends Document>(
    dbModel: Model<T>,
    conditions?: MongooseFilterQuery<T>,
  ): Promise<T[]> {
    try {
      this._logger.debug('DB:FIND_ALL:EE');
      const res = await dbModel.find(conditions).exec();
      this._logger.debug('DB:FIND_ALL:LL');
      return res;
    } catch (ex) {
      this._logger.error(`DB:FIND_ALL:ERROR: ${ex}`);
      throw constructMongoError(ex);
    }
  }

  async findById<T extends Document>(
    id: string,
    dbModel: Model<T>,
  ): Promise<T> {
    try {
      this._logger.debug('DB:FIND_BY_ID:EE');
      const res = await dbModel.findById(id).exec();
      this._logger.debug('DB:FIND_BY_ID:LL');
      return res;
    } catch (ex) {
      this._logger.error(`DB:FIND_BY_ID:ERROR: ${ex}`);
      throw constructMongoError(ex);
    }
  }

  async findOne<T extends Document>(
    conditions: MongooseFilterQuery<T>,
    dbModel: Model<T>,
  ): Promise<T> {
    try {
      this._logger.debug('DB:FIND_ONE:EE');
      const res = await dbModel.findOne(conditions).exec();
      this._logger.debug('DB:FIND_ONE:LL');
      return res;
    } catch (ex) {
      this._logger.error(`DB:FIND_ONE:ERROR: ${ex}`);
      throw constructMongoError(ex);
    }
  }

  async createDocument<T extends Document>(
    document: CreateQuery<T>,
    dbModel: Model<T>,
    session?: ClientSession,
  ): Promise<T> {
    try {
      this._logger.debug('DB:CREATE:EE');
      const [res] = await dbModel.create([document], { session });
      this._logger.debug('DB:CREATE:LL');
      return res;
    } catch (ex) {
      this._logger.error(`DB:CREATE:ERROR: ${ex}`);
      throw constructMongoError(ex);
    }
  }

  async runInTransaction<T>(fn: (session: ClientSession) => Promise<T>) {
    try {
      this._logger.debug('DB:RIT:EE');
      const session = await this._mongoConnection.startSession();
      session.startTransaction();
      try {
        await fn(session);
        await session.commitTransaction();
      } catch (ex) {
        this._logger.error('DB:RIT:ABORT_TRANSACTION');
        await session.abortTransaction();
        throw ex;
      } finally {
        session.endSession();
      }
      this._logger.debug('DB:RIT:LL');
    } catch (ex) {
      this._logger.error(`DB:RIT:ERROR: ${ex}`);
      throw ex;
    }
  }
}
