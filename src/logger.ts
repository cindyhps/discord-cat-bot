import fs from "fs"

const logPath = "./src/logs.txt"

export const saveLog = (error: string, type: string, write = false) => {
	if (!write) {
		console.warn(`${type}: ${error}`)
		return
	}

	if (!fs.existsSync(logPath)) {
		fs.writeFile(logPath, `${type}::\n${error}\n`, function (err) {
			if (err) console.error(err)
		})

		fs.appendFile(logPath, `${type}::\n${error}\n`, function (err) {
			if (err) console.error(err)
		})
	}
}
