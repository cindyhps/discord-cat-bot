import express from 'express';

const app = express();

app.all('/', (req, res) => {
  res.send('+ Bot is running');
});

export function KeepAlive() {
  app.listen(3000, () => console.log('Server is Ready!'));
}
