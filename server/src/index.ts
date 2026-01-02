import 'dotenv/config';
import app from './app.js';

const port = process.env.PORT ? Number(process.env.PORT) : 8080;

app.listen(port, () => {
  console.log(`Assessment service listening on port ${port}`);
});
