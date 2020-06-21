const { MongoClient, ObjectID } = require("mongodb");

function statesCollection() {
	const url = "mongodb://localhost:27017";
	const dbName = "covid";

	function getStates(query, sort, limit) {
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
				console.log(limit);
				let items = db.collection("states").find(query).sort(sort);

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

	function getStateByFips(fips) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const item = await db.collection("state").findOne({ fips: fips });
				resolve(item);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	function getStatesByFips(fips) {
		return new Promise(async (resolve, reject) => {
			const client = new MongoClient(url);
			try {
				await client.connect();
				const db = client.db(dbName);
				const items = await db
					.collection("states")
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
				const item = await db.collection("states").findOne({ fips: fips });
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
				const item = await db.collection("states").findOne({ fips: fips });
				resolve(item);
				client.close();
			} catch (error) {
				reject(error);
			}
		});
	}

	// function addFavorite(item) {
	// 	return new Promise(async (resolve, reject) => {
	// 		const client = new MongoClient(url);
	// 		try {
	// 			await client.connect();
	// 			const db = client.db(dbName);
	// 			const addedItem = await db.collection("users").insertOne(item);
	// 			console.log(addedItem);
	// 			resolve(addedItem.ops[0]);
	// 			client.close();
	// 		} catch (error) {
	// 			reject(error);
	// 		}
	// 	});
	// }

	// function getFavorites(query) {
	// 	return new Promise(async (resolve, reject) => {
	// 		const client = new MongoClient(url);
	// 		try {
	// 			await client.connect();
	// 			const db = client.db(dbName);

	// 			let items = db.collection("favorites").find(query);

	// 			resolve(await items.toArray());
	// 			client.close();
	// 		} catch (error) {
	// 			reject(error);
	// 		}
	// 	});
	//	}

	// function update(id, newItem) {
	// 	return new Promise(async (resolve, reject) => {
	// 		const client = new MongoClient(url);
	// 		try {
	// 			await client.connect();
	// 			const db = client.db(dbName);
	// 			const updatedItem = await db
	// 				.collection("state")
	// 				.findOneAndReplace({ _id: ObjectID(id) }, newItem, {
	// 					returnOriginal: false,
	// 				});
	// 			resolve(updatedItem.value);
	// 			client.close();
	// 		} catch (error) {
	// 			reject(error);
	// 		}
	// 	});
	// }

	// function removeFavorite(id) {
	// 	return new Promise(async (resolve, reject) => {
	// 		const client = new MongoClient(url);
	// 		try {
	// 			await client.connect();
	// 			const db = client.db(dbName);
	// 			const removed = await db
	// 				.collection("favorites")
	// 				.deleteOne({ _id: ObjectID(id) });
	// 			resolve(removed.deletedCount);
	// 			client.close();
	// 		} catch (error) {
	// 			reject(error);
	// 		}
	// 	});
	// }

	// function updateFavorites(user, favorites) {
	// 	console.log(user);
	// 	console.log(favorites);
	// }

	return {
		getStates,
		getStatesById,
		searchStates,
		getStateByFips,
		getStatesByFips,
		getDeathsByFips,
		getCasesByFips,
	};
}

module.exports = statesCollection();
