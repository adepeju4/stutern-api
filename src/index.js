import express from 'express';
import cors from 'cors';
import client from './database/index.js';
import { getUsers, createUsers, updateUser, getUser, deleteUser } from './queries/index.js';

const app = express();
const port = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

client.connect();

app.get('/', (req, res) => {
    res.json({
        status: 'success',
        message: 'hello world',
    });
});


//create
app.post('/users', createUsers)

//read all users
app.get('/users', getUsers);

//read a specific user
app.get('/users/:id', getUser);

//update
app.patch('/users/:id', updateUser);
//delete
app.delete('/users/:id', deleteUser);

app.listen(port, () => {
    console.log(`Server connected at  http://localhost:${port}`);
});