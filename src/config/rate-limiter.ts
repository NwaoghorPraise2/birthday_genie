// import { RateLimiterMongo } from 'rate-limiter-flexible';
// import { Connection } from 'mongoose';

// class RateLimiter {
//     private _rateLimiterMongo: null | RateLimiterMongo = null;
//     private POINTS: number = 10;
//     private DURATION: number = 60;

//     public initRatelimiter(mongooseConnection: Connection): void {
//             this._rateLimiterMongo = new RateLimiterMongo({
//                 storeClient: mongooseConnection,
//                 points: this.POINTS,
//                 duration: this.DURATION,
//             });
//     }

//     public get rateLimiterMongo(): null | RateLimiterMongo {
//         return this._rateLimiterMongo;
//     }
// }

// export default new RateLimiter();
