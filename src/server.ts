import Express from "express"

const app = Express()

app.all("/", (req: Express.Request, res: Express.Response) => {
	res.send("LOG: Bot is running")
})

export function KeepAlive() {
	app.listen(3000, () => console.log("LOG: Server is Ready"))
}
