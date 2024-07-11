const express = require('express');
const Person = require('./model/Persons');
const app = express();
const morgan = require('morgan');
const cors = require('cors');

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

app.use(express.static('dist'));
app.use(express.json());
app.use(cors());
morgan.token('body', (req, res) => {
  if (req.method === 'POST') {
    return JSON.stringify(req.body);
  }
});
app.use(
  morgan((tokens, req, res) => {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, 'content-length'),
      '-',
      tokens['response-time'](req, res),
      'ms',
      tokens.body(req, res),
    ].join(' ');
  })
);

app.get('/info', async (req, res) => {
  let totalPeople = await Person.find({}).then((results) => {
    return results.length;
  });
  const body = `
        <p>Phonebook has info for ${totalPeople} people</p>
        <p>${new Date().toString()}</p>`;
  res.status(200).send(body);
});

/* start of persons endpoint */
app.get('/api/persons', (req, res, next) => {
  Person.find({})
    .then((collection) => {
      res.json(collection);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (req, res, next) => {
  Person.findById(req.params.id)
    .then((personFound) => res.json(personFound))
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then((result) => {
      res.status(204).end();
    })
    .catch((error) => next(error));
});

app.post('/api/persons', (req, res, next) => {
  const newPerson = new Person({
    ...req.body,
  });

  newPerson
    .save()
    .then((result) => {

      res.status(201).json(result);
    })
    .catch((error) => next(error));
});

app.put('/api/persons/:id', (req, res, next) => {
  const updatedPerson = {
    ...req.body,
  };



  Person.findByIdAndUpdate(req.params.id, updatedPerson, { new: true, runValidators:true })
    .then((result) => res.status(201).json(result))
    .catch((error) => next(error));
});

/* end of persons endpoint */

const errorHandler = (error, request, response, next) => {

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  } else if (error.name === 'StrictModeError') {
    return response.status(400).json({ error: error.message });
  }

  next(error);
};

const unknownEndpoints = (req, res) => {
  res.status(404).send({ error: 'Unknown endpoint' });
};
app.use(errorHandler);
app.use(unknownEndpoints);