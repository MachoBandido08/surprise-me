import {useState} from 'react'
import './App.css'

function App() {
    const [query, setQuery] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const appExplication = `Cette application a pour but de vous aider à trouver des cocktails en fonction des ingrédients que vous avez. Vous pouvez entrer un ou plusieurs ingrédients avec des virgules, et l'application vous proposera une liste de cocktails qui les contiennent.`;

    const searchCocktails = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        setResults([])
        try {
            // const res = await fetch(
            //     `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${encodeURIComponent(query)}`
            // )
            const res = await fetch(
                `http://localhost:3000/drinks`
            )
            const data = await res.json()
            setResults(data || [])
            if (!data) setError('No cocktails found.')
        } catch (err) {
            console.log('Error fetching cocktails: ', err)
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
                    placeholder="Enter ingredients..."
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
                    <div className="cocktail-card" key={drink.id}>
                        <img className="cocktail-card-img" src={drink.image_example} alt={drink.name}/>
                        <div><h2>{drink.name}</h2>
                            <p>{drink.instructions}</p></div>
                    </div>
                ))}
            </div>
            <p>{appExplication}</p>
        </>
    )
}

export default App