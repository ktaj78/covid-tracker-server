import express from "express";
import bodyParser from "body-parser";
import favoritesCollection from "./repos/favoritesCollection";
import countiesCollection from "./repos/countiesCollection";
import statesCollection from "./repos/statesCollection";
import dotenv from "dotenv";
import jwt from "express-jwt";
import jwksRsa from "jwks-rsa";

dotenv.config();
const checkJwt = jwt({
	// Dynamically provide a signing key based on the kid in the header
	// and the signing keys provided by the JWKS endpoint.
	secret: jwksRsa.expressJwtSecret({
		cache: true, // cache the signing key
		rateLimit: true,
		jwksRequestsPerMinute: 5, // prevent attackers from requesting more than 5 per minute
		jwksUri: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/.well-known/jwks.json`,
	}),

	// Validate the audience and the issuer.
	audience: process.env.REACT_APP_AUTH0_AUDIENCE,
	issuer: `https://${process.env.REACT_APP_AUTH0_DOMAIN}/`,

	// This must match the algorithm selected in the Auth0 dashboard under your app's advanced settings under the OAuth tab
	algorithms: ["RS256"],
});

const app = express();
app.use(bodyParser.json());

// Counties
app.post("/api/counties/search", checkJwt, async (req, res) => {
	const { nameQuery } = req.body;
	const counties = await countiesCollection.searchCounties(nameQuery, 10);
	res.status(200).send(counties);
});

app.post("/api/counties", async (req, res) => {
	const query = req.body.query;
	const sort = req.body.sort;
	const limit = req.body.limit;
	const counties = await countiesCollection.getCounties(query, sort, limit);
	res.status(200).send(counties);
});

app.post("/api/counties/summary", async (req, res) => {
	const query = req.body.query;
	const sort = req.body.sort;
	const limit = req.body.limit;
	const counties = await countiesCollection.getCountiesSummary(
		query,
		sort,
		limit
	);
	res.status(200).send(counties);
});

app.post("/api/states", async (req, res) => {
	const query = req.body.query;
	const sort = req.body.sort;
	const limit = req.body.limit;
	const states = await statesCollection.getStates(query, sort, limit);
	res.status(200).send(states);
});

app.post("/api/states/summary", async (req, res) => {
	const query = req.body.query;
	const sort = req.body.sort;
	const limit = req.body.limit;
	const states = await statesCollection.getStatesSummary(query, sort, limit);
	res.status(200).send(states);
});

app.post("/api/states/search", checkJwt, async (req, res) => {
	const { nameQuery } = req.body;
	const counties = await statesCollection.searchStates(nameQuery, 10);
	res.status(200).send(counties);
});

// get/set user counties
app.get("/api/user/counties", checkJwt, async (req, res) => {
	const counties = await favoritesCollection.getCounties(req.user);
	res.status(200).send(counties || {});
});

app.post("/api/user/counties", checkJwt, async (req, res) => {
	const { counties } = req.body;
	const updated = await favoritesCollection.updateCounties(req.user, counties);
	res.status(200).send(updated);
});

// get/set user states
app.get("/api/user/states", checkJwt, async (req, res) => {
	const states = await favoritesCollection.getStates(req.user);
	res.status(200).send(states || {});
});

app.post("/api/user/states", checkJwt, async (req, res) => {
	const { states } = req.body;
	const updated = await favoritesCollection.updateStates(req.user, states);
	console.log(updated);
	res.status(200).send(updated);
});

app.listen(8000, () =>
	console.log("App is listening hard on " + process.env.REACT_APP_AUTH0_URL)
);
