import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import User from '../src/model/User';

export async function connectTestDb(): Promise<MongoMemoryServer> {
    await mongoose.disconnect();

    const testDbServer = await MongoMemoryServer.create();
    const testDbUri = testDbServer.getUri();

    try {
        mongoose.connect(testDbUri);
    } catch (err) {
        console.log(err.message);
    }

    console.log('Connected to in memory test db');

    return testDbServer;
}

export async function closeTestDb(mongoMemoryServer: MongoMemoryServer): Promise<void> {
    await mongoose.disconnect();
    await mongoMemoryServer.stop();

    console.log('Closed connection to and stopped in memory test db server');
}

export async function clearDb(): Promise<void> {
    const collections = mongoose.connection.collections;

    for (const key in collections) {
        await collections[key].deleteMany();
    }

    console.log('Cleared all data in memory test db');
}

export async function createUsers(users: InstanceType<typeof User>[]) {
    try {
        await User.insertMany(users);
    } catch (err) {
        console.log('creating users for test db failed');
    }
}
