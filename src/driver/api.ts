import express from "express";
import { AccountDAODatabase } from "../resource/AccountDAO";
import { Signup } from "../application/Signup";
import { GetAccount } from "../application/GetAccount";
import { MailerGatewayMemory } from "../resource/MailerGateway";
import cors from "cors";
import morgan from "morgan";

const app = express();
app.use(express.json());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(
  cors({
    credentials: true,
    origin: "http://localhost:3000", // Defina a origem permitida correta
  })
);

app.use(
  morgan(":method :status :url :response-time ms - :res[content-length]")
);

app.post("/signup", async function (req, res) {
	try {
		const accountDAO = new AccountDAODatabase();
		const mailerGateway = new MailerGatewayMemory();
		const signup = new Signup(accountDAO, mailerGateway);
		const output = await signup.execute(req.body);
		res.json(output);
	} catch (error: any) {
		res.status(422).json({
			message: error.message
		});
	}
});

app.get("/accounts/:accountId", async function (req, res) {
	const accountDAO = new AccountDAODatabase();
	const getAccount = new GetAccount(accountDAO);
	const input = {
		accountId: req.params.accountId
	};
	const account = await getAccount.execute(input);
	res.json(account);
});

export default app;