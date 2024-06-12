const mongoose = require('mongoose')

mongoose.set('strictQuery',false)

const url = process.env.MONGODB_URI

mongoose.connect(url)
    .then(result => 
        console.log('connected to MongoDB'))
    .catch(e => 
        console.log('error connecting to MongoDB:', e.message))

const numberValidator = {
    validator: number => {
        // dash
        if (!number.includes('-')) {
            return false
        }

        // two parts
        const parts = number.split('-')
        if (parts.length !== 2) {
            return false
        }

        // part 1 validation (regex is for digits)
        prefix = parts[0]
        if (prefix.length < 2 || prefix.length > 3 || !prefix.match(/^\d+$/)) {
            return false;
        }

        // part 2 validation
        postfix = parts[1]
        if (!postfix.match(/^\d+$/)) {
            return false
        }

        // valid number
        return true
    }
}

const personSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    number: {
        type: String,
        minLength: 8,
        validate: numberValidator,
        required: true
    }
})

personSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString()
        delete returnedObject._id
        delete returnedObject.__v
    }
})

module.exports = mongoose.model('Person', personSchema)