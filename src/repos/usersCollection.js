const { MongoClient, ObjectID } = require("mongodb");

function usersCollection() {
	const url = "mongodb://localhost:27017";
	const dbName = "covid";

	const updateCounties = (user, counties) => {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const updateCounties = await db
					.collection("favorites")
					.findOneAndUpdate(
						{ userId: user.sub },
						{ $set: { counties: counties } },
						{
							upsert: 1,
							returnNewDocument: 1,
						}
					);
				resolve(updateCounties);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	};

	const getCounties = (user) => {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const counties = await db
					.collection("favorites")
					.findOne({ userId: user.sub }, { counties: 1 });
				resolve(counties);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	};

	const updateStates = (user, states) => {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const updateCounties = await db
					.collection("favorites")
					.findOneAndUpdate(
						{ userId: user.sub },
						{ $set: { states: states } },
						{
							upsert: 1,
							returnNewDocument: 1,
						}
					);
				resolve(updateCounties);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	};

	const getStates = (user) => {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const states = await db
					.collection("favorites")
					.findOne({ userId: user.sub }, { states: 1 });
				resolve(states);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	};

	return {
		updateCounties,
		getCounties,
		updateStates,
		getStates,
	};
}

module.exports = usersCollection();
