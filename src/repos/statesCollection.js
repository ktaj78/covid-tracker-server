const { MongoClient, ObjectID } = require("mongodb");
const config = require("../../config/config.json");

function statesCollection() {
	const url = config.databaseConfig.dbUrl;
	const dbName = config.databaseConfig.dbName;

	function getStates(query, sort, limit, projection = {}) {
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
					.collection("states")
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

	function getStatesSummary(query, sort, limit) {
		return getStates(query, sort, limit, { metrics: 0 });
	}
	function getStatesById(id) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const item = await db
					.collection("states")
					.findOne({ _id: ObjectID(id) });
				resolve(item);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	//To do: only return county, state, and fips.
	function searchStates(searchParam, limit) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				let items = db
					.collection("states")
					.find({
						$or: [{ state: new RegExp("^" + searchParam, "i") }],
					})
					.project({ state: 1, fips: 1, totalCases: 1 })
					.sort({ peakCasesDate: -1 });

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
		getStates,
		getStatesSummary,
		getStatesById,
		searchStates,
	};
}

module.exports = statesCollection();
