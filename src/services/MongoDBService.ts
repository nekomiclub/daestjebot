import mongoose from 'mongoose';
import { Logger } from './LoggerService';
import { config } from '../config';



const MAX_RETRY_ATTEMPS = 5;



class MongoDBServ {
  retryAttemps = 0;



  async connect() {
    mongoose.set('strictQuery', false);
    await mongoose.connect(config.mongodbUrl, {
      retryWrites: true,
    }).catch(e => {
      Logger.fail('[System]: MongoDB connection failed. Retrying...', e);

      setTimeout(() => {
        this.retryAttemps += 1;
        if (this.retryAttemps >= MAX_RETRY_ATTEMPS) return Logger.fail(`[System]: Cannot retry mongodb connection. Attemp ${this.retryAttemps}/${MAX_RETRY_ATTEMPS}`);

        Logger.debug(`[System]: MongoDB retry connection. Attemp ${this.retryAttemps}/${MAX_RETRY_ATTEMPS}`);

        this.connect();
      }, 2000);
    });
  }
}



const MongoDBService = new MongoDBServ();
export default MongoDBService;