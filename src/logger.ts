import fs from "fs"

export const saveLog = (error: string, type: string) => {
	if (!fs.existsSync(`./src/logs/log-${type}.txt`)) {
		fs.writeFile(`./src/logs/log-${type}.txt`, "", function (err) {
			if (err) console.error(err)
		})
	}

	fs.appendFile(`./src/logs/log-${type}.txt`, `${error}\n`, function (err) {
		if (err) console.error(err)
	})
}
