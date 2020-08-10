const { MongoClient, ObjectID } = require("mongodb");
const config = require("../../config/config.json");

function dataHelpers() {
	const url = config.databaseConfig.dbUrl;
	const dbName = config.databaseConfig.dbName;

	function initDB() {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				let db = client.db(dbName);
				db.dropDatabase();
				db = client.db(dbName);

				// Create collections
				await db.createCollection("counties");
				await db.collection("counties").createIndex("fips");
				await db.createCollection("states");
				await db.collection("states").createIndex("fips");
				await db.createCollection("favorites");
				await db.collection("favorites").createIndex("userId");

				resolve();
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}
	function loadData(collection, data) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();

				const db = client.db(dbName);
				await db.collection(collection).drop();
				results = await db.collection(collection).insertMany(data);
				count = await db.collection(collection).countDocuments({});
				resolve(results);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	return {
		loadData,
		initDB,
	};
}

module.exports = dataHelpers();
