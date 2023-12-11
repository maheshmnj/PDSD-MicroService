// src/routes/requestRoutes.ts
import express from 'express';
import RequestController from '../controllers/requestController';

const requestRoutes = express.Router();

requestRoutes.post('/submit', RequestController.submitRequest);

// Add other routes as needed

export default requestRoutes;