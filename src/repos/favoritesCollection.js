const { MongoClient } = require("mongodb");
const config = require("../../config/config.json");

function favoritesCollection() {
	const url = config.databaseConfig.dbUrl;
	const dbName = config.databaseConfig.dbName;

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
						{ $set: { userId: user.sub, counties: counties } },
						{
							upsert: true,
							returnOriginal: false,
							projection: { counties: 1 },
						}
					);
				resolve(updateCounties);
				client.close();
			} catch (error) {
				console.log(error);
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
				const updateStates = await db.collection("favorites").findOneAndUpdate(
					{ userId: user.sub },
					{ $set: { userId: user.sub, states: states } },
					{
						upsert: true,
						returnOriginal: false,
						projection: { states: 1 },
					}
				);
				resolve(updateStates);
				client.close();
			} catch (error) {
				console.log(error);
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

module.exports = favoritesCollection();
