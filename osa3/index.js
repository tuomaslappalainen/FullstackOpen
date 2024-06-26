const express = require('express');
const morgan = require('morgan');

const app = express();


app.use(express.json());
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body', {
  stream: {
    write: message => console.log(message.trim())
  }
}));
morgan.token('body', (req) => JSON.stringify(req.body));


let persons = [
    
        {
            id: 1,
            name: "Arto Hellas",
            number: "040-123456"
        },
        {
            id: 2,
            name: "Ada Lovelace",
            number: "39-44-5323523"
        },
        {
            id: 3,
            name: "Dan Abramov",
            number: "12-43-234345"
        },
        {
            id: 4,
            name: "Mary Poppendick",
            number: "39-23-6423122"
        }
];

app.get('/', (req, res) => {
    res.send('<h1>Hello World!</h1>');
});

app.get('/info', (req, res) => {
    const date = new Date();
    res.send(`<p>Phonebook has info for ${persons.length} people</p>\n${date}`);
});

app.get('/api/persons', (req, res) => {
    res.json(persons);
});

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(p => p.id === id);
    if (person) {
        res.json(person);
    } else {
        res.status(404).end();
    }
});

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(p => p.id !== id);
    res.status(204).end();
});

app.post('/api/persons', (req, res) => {
    const { name, number } = req.body;
    if (!name || !number) {
        return res.status(400).json({ error: 'content missing' });
    }
    if (persons.some(p => p.name === name)) {
        return res.status(400).json({ error: 'name is already in phonebook' });
    }
    const person = {
        id: persons.length > 0 ? Math.max(...persons.map(p => p.id)) + 1 : 1,
        name,
        number
    };
    persons.push(person);
    res.json(person);
});


const PORT = 3001;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
