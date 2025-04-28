// filepath: c:\Users\Sefina\OneDrive\Documents\teamtasker\server\server.js
import connectDB from './config/db.js';
import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import authRoutes from './routes/authroutes.js';
import projectRoutes from './routes/projectroutes.js';
import taskRoutes from './routes/taskroutes.js';
import notificationRoutes from './routes/notificationroutes.js';

const PORT = process.env.PORT || 3006;
const app = express();

// CORS Configuration
const allowedOrigins = [
    'http://localhost:3008',
    'https://teamtasker.netlify.app',
];

const corsOptions = {
    origin: (origin, callback) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true, // Allow cookies and credentials
};


// Middleware

app.use(cors(corsOptions));


app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

connectDB();

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

export default app;