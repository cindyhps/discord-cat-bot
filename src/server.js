import Express from "express"

const app = Express()

app.all("/", (req, res) => {
	res.send("+ Bot is running")
})

export function KeepAlive() {
	app.listen(3000, () => console.log("+ Server is Ready"))
}
