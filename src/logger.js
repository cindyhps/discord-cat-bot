import fs from "fs"

export const saveLog = (log, type) => {
  fs.appendFile(`./src/logs/log-${type}.txt`, `${log}\n`, function(err) {
    if (err) throw err;
  });
}