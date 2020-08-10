const { MongoClient, ObjectID } = require("mongodb");
const config = require("../../config/config.json");

const countiesCollection = () => {
	const url = config.databaseConfig.dbUrl;
	const dbName = config.databaseConfig.dbName;

	function getCounties(query, sort, limit, projection = {}) {
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
				let items = db
					.collection("counties")
					.find(query)
					.project(projection)
					.sort(sort);

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

	function getCountiesSummary(query, sort, limit) {
		return getCounties(query, sort, limit, { metrics: 0 });
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

	return {
		getCounties,
		getCountiesSummary,
		getCountyById,
		searchCounties,
	};
};

module.exports = countiesCollection();
