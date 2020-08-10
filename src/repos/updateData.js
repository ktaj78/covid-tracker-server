const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const dataHelpers = require("./dataHelpers");
const countiesCollection = require("./countiesCollection");
const countiesData = require("./us-counties.json");
const statesData = require("./us-states.json");

const url = "mongodb://localhost:27017";
const dbName = "covid";

async function main() {
	const client = new MongoClient(url);
	await client.connect();

	try {
		//		await countiesRepo.initDB();

		const counties = await dataHelpers.loadData("counties", countiesData);
		assert.equal(countiesData.length, counties.insertedCount);

		const states = await dataHelpers.loadData("states", statesData);
		assert.equal(statesData.length, states.insertedCount);

		// Tests
		const getData = await countiesCollection.getCounties();
		assert.equal(getData.length, counties.insertedCount);

		const filterData = await countiesCollection.getCounties({
			county: getData[4].county,
		});
		assert.deepEqual(filterData[0], getData[4]);

		const limitData = await countiesCollection.getCounties({}, 3);
		assert.equal(limitData.length, 3);

		const id = getData[4]._id.toString();
		const byId = await countiesCollection.getCountyById(id);
		assert.deepEqual(byId, getData[4]);
	} catch (error) {
		console.log(error);
	} finally {
		const admin = client.db(dbName).admin();
		console.log(await admin.listDatabases());
		client.close();
	}
}

main();
