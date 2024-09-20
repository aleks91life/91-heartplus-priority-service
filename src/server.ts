import express from 'express';
import {
    getAllPriorityRules,
    createPriorityRule,
    updatePriorityRule,  
    deactivatePriorityRule,
    getRuleHistory
} from './controllers/priorityController';
import { processTransmission } from './controllers/transmissionController';

const app = express();

app.use(express.json());  // Middleware for parsing JSON

// Routes for managing priority rules
app.get('/priority-rules', getAllPriorityRules);
app.post('/priority-rules', createPriorityRule);
app.put('/priority-rules/:id', updatePriorityRule);
app.delete('/priority-rules/:id', deactivatePriorityRule);
app.get('/priority-rules/:id/history', getRuleHistory);

// Transmission processing route
app.post('/transmissions', processTransmission);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
