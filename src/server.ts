// import express from 'express';
import express, { Router } from 'express';

const app = express()
const route = Router();

route.get('/api/ola/:info', () => { console.log('ola') });

route.get('/', (request, response) => {
    return response.json({ message: 'Hello World' });
});

app.use(express.json());
app.use(route);

app.listen(3333, () => {
    console.log('Server started on port 3333!');
});

console.log("oi, denovo")
