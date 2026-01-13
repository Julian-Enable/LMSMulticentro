import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

import authRoutes from './routes/auth.routes';
import categoryRoutes from './routes/category.routes';
import videoRoutes from './routes/video.routes';
import topicRoutes from './routes/topic.routes';
import tagRoutes from './routes/tag.routes';
import quizRoutes from './routes/quiz.routes';
import searchRoutes from './routes/search.routes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Trust proxy for Railway
app.set('trust proxy', 1);

// Middleware de seguridad
app.use(helmet());

// CORS
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100 // límite de 100 peticiones por ventana
});
app.use('/api/', limiter);

// Logging
app.use(morgan('dev'));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/videos', videoRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/tags', tagRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/search', searchRoutes);

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📝 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🔗 API URL: http://localhost:${PORT}`);
});

export default app;
