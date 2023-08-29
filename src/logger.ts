import fs from "fs"

export const saveLog = (error: string, type: string) => {
	fs.appendFile(`./src/logs/log-${type}.txt`, `${error}\n`, function (err) {
		if (err) throw err
	})
}
