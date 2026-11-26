import {useState} from 'react'
import DrinkCard from './DrinkCard.jsx'

const MAX_NAME_LENGTH = 60

// "Find a recipe": look a cocktail up by (part of) its name.
function RecipeSearch({apiUrl}) {
    const [name, setName] = useState('')
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const search = async (e) => {
        e.preventDefault()
        const query = name.trim()
        if (!query) return
        setLoading(true)
        setError('')
        setResults([])
        try {
            const res = await fetch(`${apiUrl}/recipes?name=` + encodeURIComponent(query))
            if (!res.ok) {
                const body = await res.json().catch(() => null)
                throw new Error(body?.error || `Something went wrong (${res.status}).`)
            }
            const data = await res.json()
            const drinks = Array.isArray(data) ? data : []
            setResults(drinks)
            if (drinks.length === 0) setError(`No recipe found for "${query}".`)
        } catch (err) {
            console.error('Error fetching recipes: ', err)
            setError(
                err.name === 'TypeError'
                    ? 'Could not reach the server. Please try again.'
                    : err.message || 'Error fetching recipes.',
            )
        } finally {
            setLoading(false)
        }
    }

    return (
        <section className="recipe-search" aria-labelledby="recipe-search-title">
            <h2 id="recipe-search-title" className="section-title">
                Find a recipe by name
            </h2>
            <form className="search-bar" onSubmit={search}>
                <div className="input-wrapper">
                    <input
                        type="search"
                        placeholder="Enter a cocktail name (e.g. margarita)..."
                        aria-label="Cocktail name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        maxLength={MAX_NAME_LENGTH}
                    />
                </div>
                <button type="submit" disabled={loading || !name.trim()}>
                    {loading ? 'Searching...' : 'Find recipe'}
                </button>
            </form>
            {error && <p className="error">{error}</p>}
            {results.length > 0 && (
                <div className="cocktail-list">
                    <h3 className="results-heading">Recipes ({results.length})</h3>
                    {results.map((drink) => (
                        <DrinkCard drink={drink} key={drink.id} />
                    ))}
                </div>
            )}
        </section>
    )
}

export default RecipeSearch
