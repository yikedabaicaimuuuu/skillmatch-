import { createClient } from 'redis';
import crypto from 'crypto';

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PASSWORD || null,
});

redisClient.on("error", (error) => console.error("Redis connection error:", error));

(async () => {
    try {
        await redisClient.connect();
        console.log("Connected to Redis successfully!");
    } catch (error) {
        console.error("Error connecting to Redis:", error);
    }
})();

class OTPService {
    async storeOTP(userId) {
        const otp = crypto.randomInt(100000, 999999).toString();
        
        await redisClient.setEx(`otp:${userId}`, 300, otp);
        
        return otp; 
    }

    async findOTP(userId) {
        const otp = await redisClient.get(`otp:${userId}`);
        return otp;
    }

    async deleteOTP(userId) {
        await redisClient.del(`otp:${userId}`);
    }
}

export default new OTPService();
