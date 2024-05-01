import User from './User';
import connectDB from './db';

const seedData = [
    new User({ name: 'dude1', email: 'dude1@dude.com'}),
    new User({ name: 'dude2', email: 'dude2@dude.com'}),
    new User({ name: 'dude3', email: 'dude3@dude.com'}),
    new User({ name: 'dude4', email: 'dude4@dude.com'}),
    new User({ name: 'dude5', email: 'dude5@dude.com'}),
    new User({ name: 'dude6', email: 'dude6@dude.com'}),
    new User({ name: 'dude7', email: 'dude7@dude.com'}),
    new User({ name: 'dude8', email: 'dude8@dude.com'}),
    new User({ name: 'dude9', email: 'dude9@dude.com'}),
    new User({ name: 'dude10', email: 'dude10@dude.com'}),
]

async function seedDb() {
    try {
        console.log('Seeding db')

        connectDB();
        // inserts as a batch, failure will roll back changes automatically
        await User.insertMany(seedData);
    } catch (err) {
        console.log('Error while seeding db:', err.message)
        process.exit(1);
    }

    console.log('Seeding db completed successfully');
    process.exit(0);
}

seedDb();