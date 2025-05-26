import './App.css'
import { useMovies } from './hooks/useMovies'
import { Movies } from './components/Movies'
import { useState, useEffect, useRef, useCallback } from 'react'
import debounce from 'just-debounce-it'

function useSearch() {
  const [search, updateSearch] = useState('')
  const [error, setError] = useState(null)
  const isFirstInput = useRef(true)

  useEffect(() => {
    if (isFirstInput.current) {
      isFirstInput.current = search === ''
      return
    }

    if (search === '') {
      setError("No se puede buscar una pelicula vacia")
      return
    }

    if (search.match(/^\d+$/)) {
      setError("No se pueden buscar peliculas con un numero")
      return
    }

    if (search.length < 3) {
      setError("La busqueda debe tener al menos 3 caracteres")
      return
    }

    setError(null)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search])
  return { search, updateSearch, error }
}

function App() {
  const [sort, setSort] = useState(false)

  const { search, updateSearch, error } = useSearch()
  const { movies, loading, getMovies } = useMovies({ search, sort })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce(search => {
      console.log('search', search)
      getMovies({ search })
    }, 300), [getMovies]
  )

  const handleSubmit = (event) => {
    event.preventDefault()
    getMovies({ search })
  }

  const handleSort = () => {
    setSort(!sort)
  }

  const handleChange = (event) => {
    const newSearch = event.target.value
    updateSearch(newSearch)
    debouncedSearch(newSearch)
  }

  return (
    <div className='page'>

      <header>
        <h1>Buscador de películas</h1>
        <p style={{maxWidth: 600, margin: '0 auto 1.5em', color: '#555', fontSize: '1.1em'}}>
          Encuentra información sobre tus películas favoritas usando la API de OMDB. Escribe el nombre de una película en el buscador y obtén una lista con su título, año y póster. Puedes ordenar los resultados alfabéticamente y la búsqueda se realiza automáticamente mientras escribes.
        </p>
        <form className='form' onSubmit={handleSubmit}>
          <input
            style={{
              border: '1px solid transparent',
              borderColor: error ? 'red' : 'transparent'
            }} onChange={handleChange} value={search} name='query' placeholder='Avengers, Star Wars, The Matrix...'
          />
          <input type='checkbox' onChange={handleSort} checked={sort} />
          <button type='submit'>Buscar</button>
        </form>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </header>

      <main>
        {
          loading ? <p>Cargando...</p> : <Movies movies={movies} />
        }
      </main>
    </div>
  )
}

export default App




