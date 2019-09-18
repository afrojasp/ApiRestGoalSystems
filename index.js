const Joi = require('joi');
const express = require('express');
const app = express();


app.use(express.json());

const people = [
    { id: 1, name: 'person1' },
    { id: 2, name: 'person2' },
    { id: 3, name: 'person3' },
    { id: 4, name: 'person4' },
];

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.get('/api/people', (req, res) => {
    res.send(people);
});

app.get('/api/people/:id', (req, res) => {
    let person = people.find(p => p.id === parseInt(req.params.id));
    if (!person) {
       return res.status(404).send('The person with the current Id was not found');
    }
    res.send(person);
});

app.post('/api/people', (req, res) => {
    const result = validatePerson(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }
    let person = {
        id: people.length + 1,
        name: req.body.name
    };
    people.push(person);
    res.send(person);
});

app.put('/api/people/:id', (req, res) => {
    let person = people.find(p => p.id === parseInt(req.params.id));
    if (!person) {
        return res.status(404).send('The person with the current Id was not found');
    }
    const result = validatePerson(req.body);
    if (result.error) {
        return res.status(400).send(result.error.details[0].message);
    }

    person.name = req.body.name;
    res.send(person);
});

app.delete('/api/people/:id', (req, res) => {
    let person = people.find(p => p.id === parseInt(req.params.id));
    if (!person) {
        return res.status(404).send('The person with the current Id was not found');
    }
    const index = people.indexOf(person);
    people.splice(index, 1);
    res.send(person);
});

function validatePerson(person) {
    const schema = {
        name: Joi.string().min(3).required()
    };
    return Joi.validate(person, schema);
}

const port = process.env.PORT || 3000;

app.listen(port, () => console.log(`Listening on port ${port}`));