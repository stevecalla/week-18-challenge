import express from 'express';
import path from 'node:path';
import db from './config/connection.js';
import routes from './routes/index.js';

import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Replicate __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// if we're in production, serve client/build as static assets
if (process.env.NODE_ENV === 'production') {
  // app.use(express.static(path.join(__dirname, '../client/build')));
  // app.use(express.static(path.join(__dirname, '../client/dist')));
  // app.use(express.static('../client/dist/index.html'));

  const clientDistPath = path.resolve(__dirname, '../client/dist');
  app.use(express.static(clientDistPath));

  // Serve the index.html for any unmatched routes
  app.get('*', (req, res) => {
    console.log(req);
    res.sendFile(path.join(clientDistPath, 'index.html'));
  });
} else {
  console.log('Running in development mode');
}

app.use(routes);

db.once('open', () => {
  app.listen(PORT, () => console.log(`🌍 Now listening on localhost:${PORT}`));
});
