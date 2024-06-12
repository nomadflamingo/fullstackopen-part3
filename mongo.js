// define schema
// create a model (a constructor) (a Note model)
// use the constructor and store the note in a new var
// save the note to the database using save() method
// close the connection in the promise handler
// you can also use the constructor to .find() something

const mongoose = require('mongoose')

if (process.argv.length<3) {
    console.log('give password as argument')
    process.exit(1)
}

const password = process.argv[2]

const url =
    `mongodb+srv://provisionnement_finit:${password}@cluster0.pya2gm4.mongodb.net/phonebookApp?retryWrites=true&w=majority&appName=Cluster0`

mongoose.set('strictQuery',false)

mongoose.connect(url)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length < 5) {
    // fetch all notes
    Person.find({}).then(result => {
        result.forEach(person => {
            console.log(person.name, person.number)
        })
        mongoose.connection.close()
    })

} else {
    // add new note
    const name = process.argv[3]
    const number = process.argv[4]

    const person = new Person({
        name: name,
        number: number,
    })

    person.save().then(result => {
        console.log('person saved!', result)
        mongoose.connection.close()
    })
}



