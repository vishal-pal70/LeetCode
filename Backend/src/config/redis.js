// import { createClient } from 'redis';
const { createClient }  = require('redis');

const redisClient = createClient({
    username: 'default',
    password: process.env.REDIS_PASS,
    socket: {
        host: 'redis-16465.c212.ap-south-1-1.ec2.redns.redis-cloud.com',
        port: 16465
    }
});


module.exports = redisClient;