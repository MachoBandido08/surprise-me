import { useState } from 'react'
import './App.css'

function App() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const searchCocktails = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResults([])
        try {
            const res = await fetch(
                `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
            )
            const data = await res.json()
            setResults(data.drinks || [])
            if (!data.drinks) setError('No cocktails found.')
        } catch {
            setError('Error fetching cocktails.')
        }
        setLoading(false)
    }

    return (
        <>
            <h1 className="funky-title">Surprise me</h1>
            <form className="search-bar" onSubmit={searchCocktails}>
                <input
                    type="text"
                    placeholder="Search cocktails..."
                    value={query}
                    onChange={e => setQuery(e.target.value)}
                />
                <button type="submit" disabled={loading || !query.trim()}>
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
            <div className="cocktail-list">
                {results.map(drink => (
                    <div className="cocktail-card" key={drink.idDrink}>
                        <img src={drink.strDrinkThumb} alt={drink.strDrink} />
                        <h2>{drink.strDrink}</h2>
                        <p>{drink.strCategory}</p>
                        <p>{drink.strAlcoholic}</p>
                    </div>
                ))}
            </div>
        </>
    )
}

export default App