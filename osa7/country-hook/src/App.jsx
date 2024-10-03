import { useState, useEffect } from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'

const useField = (type) => {
  const [value, setValue] = useState('')

  const onChange = (event) => {
    setValue(event.target.value)
  }

  return {
    type,
    value,
    onChange
  }
}

const useCountry = (name) => {
  const [country, setCountry] = useState(null);

  useEffect(() => {
    if (name) {
      axios
        .get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
        .then((response) => {
          if (response.data.length > 0) {
            setCountry({ found: true, data: response.data[0] });
          } else {
            setCountry({ found: false });
          }
        })
        .catch(() => {
          setCountry({ found: false });
        });
    }
  }, [name]);

  return country
}

const Country = ({ country }) => {
  if (!country) {
    return (
    null  )
  }

  if (!country.found) {
    return (
      <div>
       Country not found...
      </div>
    )
  }

  return (
    <div>
      <h3>{country.data.name.common} </h3>
      <div>capital: {country.data.capital} </div>
      <div>population: {country.data.population}</div> 
      <img src={country.data.flags.png} height='100' alt={`flag of ${country.data.name.common}`}/>  
    </div>
  )
}




const App = () => {
  const nameInput = useField('text')
  const [name, setName] = useState('')
  const country = useCountry(name)

  const fetch = (e) => {
    e.preventDefault()
    setName(nameInput.value)
  }

  return (
    <div>
      <form onSubmit={fetch}>
        <input {...nameInput} />
        <button>find</button>
      </form>

      <Country country={country} />
    </div>
  )
}

Country.propTypes = {
  country: PropTypes.shape({
    found: PropTypes.bool,
    data: PropTypes.shape({
      name: PropTypes.shape({
        common: PropTypes.string,
      }),
      capital: PropTypes.arrayOf(PropTypes.string),
      population: PropTypes.number,
      flags: PropTypes.shape({
        png: PropTypes.string,
      }),
    }),
  }),
}

export default App
