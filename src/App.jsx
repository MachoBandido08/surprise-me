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
                `http://localhost:3000/drinks/` + query
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
            <div className="title-area"><h1 className="funky-title">Surprise me</h1>
                <img className="img-title-palm" src="/palm-three-drawn.png"/>
            </div>
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
                        <div>
                            <h2>{drink.name}</h2>
                            <p className="cocktail-card-instructions">{drink.instructions}</p>
                            <p className="ingredients-title"><strong>Ingredients</strong></p>
                            {/*{drink.ingredients && drink.ingredients.length > 0 && (*/}
                            {/*    // drink.ingredients.map((ingredient, index) => ({ingredient.quantity} {ingredient.name}))*/}
                            {/*    // {drink.ingredients.map((ingredient, index) => ())}*/}
                            {drink.ingredients && drink.ingredients.length > 0 && (<ul className="cocktail-card-ingredients-list">
                                {drink.ingredients.map((ingredient, index) => (
                                    <li key={index}>{ingredient.quantity} {ingredient.name}</li>
                                ))}
                            </ul>)}
                            {/*)}*/}
                        </div>
                    </div>
                ))}
            </div>
            <div className="custom-line"></div>
            <p>{appExplication}</p>
        </>
    )
}

export default App