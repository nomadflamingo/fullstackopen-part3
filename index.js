require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const Person = require('./models/person')

const app = express()
app.use(cors())
app.use(express.static('dist'))
app.use(express.json())

morgan.token('body', (req) => req.method === 'POST' ? JSON.stringify(req.body) : '')
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))

app.get('/info', (request, response, next) => {
    const now = new Date()

    Person.find({})
        .then(people => {
            const infoContent = `
            <p>Phonebook has info for ${people.length} people</p>
            <p>${now.toString()}</p>
            `
            response.send(infoContent)
        })
        .catch(e => {
            next(e)
        })
})

app.get('/api/persons', (request, response, next) => {
    Person.find({})
        .then(people => {
            response.json(people)
        })
        .catch(e => {
            next(e)
        })
})

app.get('/api/persons/:id', (request, response, next) => {
    const id = request.params.id

    Person.findById(id)
        .then(person => {
            if (person) {
                response.json(person)
            } else {
                response.status(404).end()
            }
        })
        .catch(e => {
            next(e)
        })
})

app.delete('/api/persons/:id', (request, response, next) => {
    const initID = request.params.id

    Person.findByIdAndDelete(initID)
        .then(result => {
            if (result) {
                response.status(204).end()
            } else {
                response.status(404).end()
            }
        })
        .catch(e => {
            next(e)
        })
})

app.post('/api/persons', (request, response, next) => {
    const body = request.body
    // if (!body.name || !body.number) {
    //     return response.status(400).json({
    //         error: 'name or number missing'
    //     })
    // }

    // if (persons.some(person => person.name === body.name)) {
    //     return response.status(400).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Person({
        name: body.name,
        number: body.number
    })
    person.save()
        .then(savedPerson => {
            response.status(201).json(savedPerson)
        })
        .catch(e => {
            next(e)
        })
})

app.put('/api/persons/:id', (request, response, next) => {
    const { name, number } = request.body
    const id = request.params.id

    // this is kept because mongoose doesn't do required checks on undefined fields
    // and assumes they didn't change
    if (!number) {
        return response.status(400).json({
            error: 'number missing'
        })
    }

    Person.findByIdAndUpdate(id, { name,number }, { new: true, runValidators: true, context: 'query' })
        .then(updatedPerson => {
            if (updatedPerson) {
                response.json(updatedPerson)
            } else {
                response.status(404).end()
            }
        })
        .catch(e => {
            next(e)
        })
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)

const errorHandler = (error, request, response, next) => {
    console.log(error.message)

    if (error.name === 'CastError') {
        return response.status(400).send({ error: 'malformed id' })
    } else if (error.name === 'ValidationError') {
        return response.status(400).json({ error: error.message })
    } else if (error.code === 11000) {
        return response.status(400).send({ error: 'name must be unique' })
    }

    next(error)
}

app.use(errorHandler)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})