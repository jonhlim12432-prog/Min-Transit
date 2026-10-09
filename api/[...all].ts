import { Request, Response } from 'express';
import app from './index';

export default function handler(req: Request, res: Response) {
  return app(req, res);
}

export { app };
