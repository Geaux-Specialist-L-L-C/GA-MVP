import cors from 'cors';
import express from 'express';
import assessmentRouter from './routes/assessment.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

app.get('/healthz', (_req, res) => {
  res.status(200).json({ ok: true });
});

app.use('/api', assessmentRouter);

export default app;
