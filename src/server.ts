import Express from "express"

const app = Express()

app.all("/", (_: Express.Request, res: Express.Response) => {
	res.send("LOG: Bot is running")
})

export function KeepAlive() {
	app.listen(3000, () => console.debug("LOG: Server is Ready"))
}
