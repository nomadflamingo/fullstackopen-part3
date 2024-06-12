import { useState, useEffect } from 'react'
import Filter from './components/Filter'
import Form from './components/Form'
import Numbers from './components/Numbers'
import Notification from './components/Notification'
import personsService from './services/persons'

const App = () => {
  const [persons, setPersons] = useState([])
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [search, setNewSearch] = useState('')
  const [notification, setNotification] = useState({message: ""})

  useEffect(() => {
    console.log('effect')
    personsService
      .getAll()
      .then(data => {
        console.log('promise fulfilled');
        setPersons(data)
      })
  }, [])

  const handleNameChange = (event) => {
    setNewName(event.target.value)
  }

  const handleNumberChange = (event) => {
    setNewNumber(event.target.value)
  }

  const handleSearchChange = (event) => {
    setNewSearch(event.target.value)
  }

  const handleAddPerson = (event) => {
    event.preventDefault()
    if (newName !== '') {
      if (persons.some(p => p.name === newName)) {
        if (window.confirm(
          `${newName} is already added to the phonebook, replace the old number with a new one?`)) {
            const existingPerson = persons.find(person => person.name == newName)
            const updatedPerson = { ...existingPerson, number: newNumber}
            
            personsService
              .update(existingPerson.id, updatedPerson)
              .then(returnedPerson => {
                console.log(returnedPerson);
                setPersons(persons.map(p => p.id !== returnedPerson.id ? p : returnedPerson))
                setNotification({
                  message: `Updated ${newName}`,
                  isError: false
                })
    
                setTimeout(() => {
                  setNotification({message: ""})
                }, 2000)
              })
              .catch(e => {
                console.log(e.response.data.error)
                setNotification({
                  message: e.response.data.error,
                  isError: true
                })

                setTimeout(() => {
                  setNotification({message: ""})
                }, 2000)
              })
          }
      }
      else {
        const personObject = {
          name: newName,
          number: newNumber,
        }
        personsService
          .create(personObject)
          .then(returnedPerson => {
            console.log('person received');
            setPersons(persons.concat(returnedPerson))

            setNotification({
              message: `Added ${newName}`,
              isError: false
            })

            setTimeout(() => {
              setNotification({message: ""})
            }, 2000)
          })
          .catch(e => {
            console.log(e.response.data.error)
            setNotification({
              message: e.response.data.error,
              isError: true
            })

            setTimeout(() => {
              setNotification({message: ""})
            }, 2000)
          })
      }
      setNewName('')
      setNewNumber('')
    }
  }

  const handleDeletePerson = (id) => () => {
    const person = persons.find(p => p.id === id)
    
    if (!window.confirm(`Delete ${person.name}?`)) {
      return
    }

    personsService
      .remove(id)
      .then(() => 
        setPersons(persons.filter(p => p.id !== id)))
      .catch(() => {
        alert(
          `failed to delete ${person.name} from the server`
        )
      })
  }

  const filteredPersons = persons.filter(p =>
    p.name.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter 
        onChange={handleSearchChange} 
        value={search}
      />
      <Notification
        notification={notification}
      />
      <Form
        onSubmit={handleAddPerson}
        onChangeName={handleNameChange}
        valueName={newName}
        onChangeNumber={handleNumberChange}
        valueNumber={newNumber}
      />

      <Numbers
        persons={filteredPersons}
        onDelete={handleDeletePerson}
      />
    </div>
    
  )
}

export default App