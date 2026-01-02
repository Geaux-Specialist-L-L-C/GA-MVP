import cors from 'cors';
import express from 'express';
import assessmentRouter from './routes/assessment.js';

const app = express();

app.use(cors());
app.use(express.json({ limit: '1mb' }));

export const healthHandler = (_req: unknown, res: express.Response) => {
  res.status(200).json({ ok: true });
};

app.get('/healthz', healthHandler);

app.use('/api', assessmentRouter);

export default app;
