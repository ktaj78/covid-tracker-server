const MongoClient = require("mongodb").MongoClient;
const assert = require("assert");
const countiesRepo = require("./repos/countiesRepo");

const url = "mongodb://localhost:27017";
const dbName = "covid";

async function main() {
	const client = new MongoClient(url);
	await client.connect();

	try {
		await countiesRepo.initDB();
	} catch (error) {
		console.log(error);
	} finally {
		const admin = client.db(dbName).admin();
		console.log(await admin.listDatabases());
		client.close();
	}
}

main();
