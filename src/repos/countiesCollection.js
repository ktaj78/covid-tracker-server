const { MongoClient, ObjectID } = require("mongodb");

const countiesCollection = () => {
	const url = "mongodb://localhost:27017";
	const dbName = "covid";

	function getCounties(query, sort, limit) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				if (sort === undefined) {
					sort = { totalCases: -1 };
				}
				if (query === undefined) {
					query = {};
				}
				if (limit === undefined) {
					limit = 10;
				}
				let items = db.collection("counties").find(query).sort(sort);

				if (limit > 0) {
					items = items.limit(limit);
				}

				resolve(await items.toArray());
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function getCountyById(id) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const item = await db
					.collection("counties")
					.findOne({ _id: ObjectID(id) });
				resolve(item);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	//To do: only return county, state, and fips.
	function searchCounties(searchParam, limit) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				let items = db
					.collection("counties")
					.find({
						$or: [
							{ county: new RegExp("^" + searchParam, "i") },
							{ state: new RegExp("^" + searchParam, "i") },
						],
					})
					.project({ state: 1, county: 1, fips: 1, totalCases: 1 })
					.sort({ totalCases: -1 });

				if (limit > 0) {
					items = items.limit(limit);
				}

				resolve(await items.toArray());
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function getCountyByFips(fips) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const item = await db.collection("counties").findOne({ fips: fips });
				resolve(item);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function getCountiesByFips(fips) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const items = await db
					.collection("counties")
					.find({ fips: { $in: fips } })
					.sort({ healthscore: -1 });

				resolve(await items.toArray());
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function getDeathsByFips(fips) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const item = await db
					.collection("county_deaths")
					.findOne({ fips: fips });
				resolve(item);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function getCasesByFips(fips) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const item = await db
					.collection("county_cases")
					.findOne({ fips: fips });
				resolve(item);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function addFavorite(item) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const addedItem = await db.collection("favorites").insertOne(item);
				resolve(addedItem.ops[0]);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function getFavorites(username, counties) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);

				let items = db.collection("favorites").find(query);

				resolve(await items.toArray());
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function update(id, newItem) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const updatedItem = await db
					.collection("counties")
					.findOneAndReplace({ _id: ObjectID(id) }, newItem, {
						returnOriginal: false,
					});
				resolve(updatedItem.value);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function removeFavorite(id) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const removed = await db
					.collection("favorites")
					.deleteOne({ _id: ObjectID(id) });
				resolve(removed.deletedCount);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	return {
		getCounties,
		getCountyById,
		addFavorite,
		removeFavorite,
		getFavorites,
		searchCounties,
		getCountyByFips,
		getCountiesByFips,
		getDeathsByFips,
		getCasesByFips,
		update,
	};
};

module.exports = countiesCollection();
