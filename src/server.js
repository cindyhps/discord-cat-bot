const express = require("express")

const app = express()

app.all("/", (req, res) => {
	res.send("+ Bot is running")
})

function KeepAlive() {
	app.listen(3000, () => console.log("Server is Ready!"))
}

module.exports = KeepAlive
