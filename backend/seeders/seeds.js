const mongoose = require("mongoose");
const { mongoURI: db } = require("../config/keys.js");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { faker } = require("@faker-js/faker");

const NUM_SEED_USERS = 10;

// Create users
const users = [];

users.push(
	new User({
		username: "demo-user",
		email: "demo-user@appacademy.io",
		hashedPassword: bcrypt.hashSync("starwars", 10),
	})
);

for (let i = 1; i < NUM_SEED_USERS; i++) {
	const firstName = faker.name.firstName();
	const lastName = faker.name.lastName();
	users.push(
		new User({
			username: faker.internet.userName(firstName, lastName),
			email: faker.internet.email(firstName, lastName),
			hashedPassword: bcrypt.hashSync(faker.internet.password(), 10),
		})
	);
}

// Connect to database
mongoose.set('strictQuery', true)
mongoose
  .connect(db, { useNewUrlParser: true })
  .then(() => {
    console.log('> Connected to MongoDB successfully');
    insertSeeds();
  })
  .catch(err => {
    console.error(err.stack);
    process.exit(1);
  });


const insertSeeds = () => {
	console.log("> Resetting db and seeding users...");

	User.collection
		.drop()
		.then(() => User.insertMany(users))
		.then(() => {
			console.log("> Done!");
			mongoose.disconnect();
		})
		.catch((err) => {
			console.error(err.stack);
			process.exit(1);
		});
};
