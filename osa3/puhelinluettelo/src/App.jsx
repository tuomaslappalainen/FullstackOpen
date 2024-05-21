import { useState, useEffect } from 'react'
import dataService from './services/Persons'

const FilterForm = (props) => {
  console.log(props)
  return (
    <div>
      filter shown with: <input onChange={props.handleFilterChange}/>
    </div>
  )
}

const Person = (props) => {
  console.log(props)
  return (
    <div>
      {props.person.name} {props.person.number}
      <input type='button' value='delete' onClick={() => {
        console.log(props.person.id)
        dataService.delete(props.person.id).then(response => {
          console.log(response)
          window.location.reload()
        })
      }}/>
    </div>
  )
}

const People = (props) => {
  console.log(props)
  return (
    <div>
      {props.list.filter(person => person.name.toLowerCase().includes(props.filter.toLowerCase())).map(person =>
        <Person key={person.name} person={person}/>
      )}
    </div>
  )
}

const Notification = ({ message }) => {
  if (message === null) {
    return null
  }

  return (
    <p>{message}</p>
  )
}

const App = () => {
  const [persons, setPersons] = useState([])
  const [filter, setFilter] = useState('')
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [notification, setNotification] = useState(null)

  useEffect(() => {
    console.log('effect')
    dataService.getAll().then(response => {
      console.log('promise fulfilled')
      setPersons(response.data)
      console.log(persons)
    })
  }, [])

  const addPerson = (e) => {
    e.preventDefault()

    const names = persons.map(p => {
      return p.name
    })
    if(names.includes(newName)) {
      document.querySelector('.notification').style = 'color: red'
      setNotification(`${newName} is already added`)
      setTimeout(() => {setNotification(null)}, 5000)
      return
    }

    const person = {
      name: newName,
      number: newNumber
    }

    dataService.create(person)
      .then(response => {
        console.log(response)

        document.querySelector('.notification').style = 'color: green'
        setNotification(`${person.name} was added to the server`)
        setTimeout(() => {setNotification(null)}, 5000)

        setPersons(persons.concat(response.data))
        setNewName('')
        setNewNumber('')
      })
      .catch((error) => {
        console.log('error', error.message)

        document.querySelector('.notification').style = 'color: red'
        setNotification(`${error.response.data.error}`)
        setTimeout(() => {setNotification(null)}, 5000)
      })
  }


  const handleFilterChange = (e) => {
    setFilter(e.target.value)
  }
  const handleNameChange = (e) => {
    setNewName(e.target.value)
  }
  const handleNumChange = (e) => {
    setNewNumber(e.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <div className='notification'>
        <Notification message={notification}/>
      </div>
      <FilterForm handleFilterChange={handleFilterChange}/>
      <h2>Add a new</h2>
      <form onSubmit={addPerson}>
        <div>
          Name: <input value={newName} onChange={handleNameChange}/>
        </div>
        <div>
          Number: <input value={newNumber} onChange={handleNumChange}/>
        </div>
        <div>
          <button type="submit">Add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <People list={persons} filter={filter}/>
    </div>
  )

}

export default App
