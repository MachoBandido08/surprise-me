import {useEffect, useState} from 'react'
import {COMMON_INGREDIENTS} from './ingredients.js'
import PalmIcon from './PalmIcon.jsx'
import './App.css'

const STORAGE_KEY = 'surprise-me-ingredients'

// Load previously saved ingredients so they survive a page reload / revisit.
const loadIngredients = () => {
    try {
        const saved = JSON.parse(localStorage.getItem(STORAGE_KEY))
        return Array.isArray(saved) ? saved : []
    } catch {
        return []
    }
}

function App() {
    const [input, setInput] = useState('')
    const [ingredients, setIngredients] = useState(loadIngredients)
    const [activeIndex, setActiveIndex] = useState(-1)
    const [results, setResults] = useState([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    // Persist ingredients so they're restored when the user comes back later.
    useEffect(() => {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(ingredients))
    }, [ingredients])

    // Keep the keyboard-highlighted suggestion scrolled into view.
    useEffect(() => {
        if (activeIndex >= 0) {
            document
                .getElementById(`suggestion-${activeIndex}`)
                ?.scrollIntoView({block: 'nearest'})
        }
    }, [activeIndex])

    const query = input.trim().toLowerCase()
    const suggestions = query
        ? COMMON_INGREDIENTS
            .filter(item => item.includes(query) && !ingredients.includes(item))
            .slice(0, 6)
        : []

    const appDescription = `This app helps you find cocktails based on the ingredients you already have. Add one or more ingredients, and we'll show you a list of cocktails you can make with them. Your ingredients are saved automatically, so they'll still be here when you close your browser and come back later.`;

    const addIngredient = (value) => {
        const trimmed = value.trim().toLowerCase()
        if (trimmed && !ingredients.includes(trimmed)) {
            setIngredients([...ingredients, trimmed])
        }
        setInput('')
        setActiveIndex(-1)
    }

    const removeIngredient = (value) => {
        setIngredients(ingredients.filter(item => item !== value))
    }

    const handleInputChange = (e) => {
        setInput(e.target.value)
        setActiveIndex(-1)
    }

    const handleInputKeyDown = (e) => {
        if (e.key === 'ArrowDown' && suggestions.length > 0) {
            // Move highlight down (wraps to the top)
            e.preventDefault()
            setActiveIndex(prev => (prev + 1) % suggestions.length)
        } else if (e.key === 'ArrowUp' && suggestions.length > 0) {
            // Move highlight up (wraps to the bottom)
            e.preventDefault()
            setActiveIndex(prev => (prev <= 0 ? suggestions.length - 1 : prev - 1))
        } else if (e.key === 'Escape') {
            setActiveIndex(-1)
        } else if (e.key === 'Enter' || e.key === ',') {
            // Enter/comma confirms: pick the highlighted suggestion, else the typed text
            e.preventDefault()
            addIngredient(activeIndex >= 0 ? suggestions[activeIndex] : input)
        }
    }

    const searchCocktails = async (e) => {
        e.preventDefault()
        // Include anything still typed but not yet added as a chip
        const allIngredients = input.trim()
            ? [...ingredients, input.trim().toLowerCase()]
            : ingredients
        if (allIngredients.length === 0) return
        setInput('')
        setIngredients(allIngredients)
        setLoading(true)
        setError('')
        setResults([])
        try {
            const res = await fetch(
                `https://surprise-me-backend.onrender.com/drinks/` +
                encodeURIComponent(allIngredients.join(','))
            )
            if (!res.ok) throw new Error(`Request failed with status ${res.status}`)
            const data = await res.json()
            const drinks = Array.isArray(data) ? data : []
            setResults(drinks)
            if (drinks.length === 0) setError('No cocktails found.')
        } catch (err) {
            console.error('Error fetching cocktails: ', err)
            setError('Error fetching cocktails.')
        }
        setLoading(false)
    }

    const renderDrink = (drink) => {
        const missing = drink.missing || []
        const missingSet = new Set(missing)
        return (
            <div className="cocktail-card" key={drink.id}>
                <img className="cocktail-card-img" src={drink.image_example} alt={drink.name}/>
                <div>
                    <div className="cocktail-card-header">
                        <h2>{drink.name}</h2>
                        {drink.makeable
                            ? <span className="badge badge-ready">✓ You have everything</span>
                            : missing.length > 0 &&
                            <span className="badge badge-missing">Missing {missing.length}</span>}
                    </div>
                    <p className="cocktail-card-instructions">{drink.instructions}</p>
                    <p className="ingredients-title"><strong>Ingredients</strong></p>
                    {drink.ingredients && drink.ingredients.length > 0 && (
                        <ul className="cocktail-card-ingredients-list">
                            {drink.ingredients.map((ingredient, index) => (
                                <li key={index}
                                    className={missingSet.has(ingredient.name) ? 'ingredient-missing' : undefined}>
                                    {ingredient.quantity} {ingredient.name}
                                    {missingSet.has(ingredient.name) && <span className="need-tag"> — need</span>}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </div>
        )
    }

    const makeableDrinks = results.filter(d => d.makeable)
    const partialDrinks = results.filter(d => !d.makeable)

    return (
        <>
            <div className="title-area"><h1 className="funky-title">Surprise me</h1>
                <PalmIcon className="img-title-palm"/>
            </div>
            <p className="app-description">{appDescription}</p>
            <form className="search-bar" onSubmit={searchCocktails}>
                <div className="input-wrapper">
                    <input
                        type="text"
                        placeholder="Enter an ingredient..."
                        value={input}
                        onChange={handleInputChange}
                        onKeyDown={handleInputKeyDown}
                        role="combobox"
                        aria-expanded={suggestions.length > 0}
                        aria-controls="ingredient-suggestions"
                        aria-activedescendant={
                            activeIndex >= 0 ? `suggestion-${activeIndex}` : undefined
                        }
                    />
                    {suggestions.length > 0 && (
                        <ul className="suggestions" id="ingredient-suggestions" role="listbox">
                            {suggestions.map((suggestion, index) => (
                                <li key={suggestion} role="presentation">
                                    <button
                                        type="button"
                                        id={`suggestion-${index}`}
                                        role="option"
                                        aria-selected={index === activeIndex}
                                        className={
                                            'suggestion-item' +
                                            (index === activeIndex ? ' active' : '')
                                        }
                                        onClick={() => addIngredient(suggestion)}
                                        onMouseEnter={() => setActiveIndex(index)}
                                    >
                                        {suggestion}
                                    </button>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
                <button
                    type="button"
                    className="add-btn"
                    onClick={() => addIngredient(input)}
                    disabled={!input.trim()}
                >
                    Add ingredient
                </button>
                <button
                    type="submit"
                    disabled={loading || (ingredients.length === 0 && !input.trim())}
                >
                    {loading ? 'Searching...' : 'Search'}
                </button>
            </form>
            {ingredients.length > 0 && (
                <div className="ingredient-chips">
                    <span className="inventory-label">Inventory:</span>
                    {ingredients.map(ingredient => (
                        <span className="ingredient-chip" key={ingredient}>
                            {ingredient}
                            <button
                                type="button"
                                className="ingredient-chip-remove"
                                onClick={() => removeIngredient(ingredient)}
                                aria-label={`Remove ${ingredient}`}
                            >
                                ×
                            </button>
                        </span>
                    ))}
                    <button
                        type="button"
                        className="clear-all-btn"
                        onClick={() => setIngredients([])}
                    >
                        Clear all
                    </button>
                </div>
            )}
            {error && <p className="error">{error}</p>}
            <div className="cocktail-list">
                {makeableDrinks.length > 0 && (
                    <h3 className="results-heading">Ready to make ({makeableDrinks.length})</h3>
                )}
                {makeableDrinks.map(renderDrink)}
                {partialDrinks.length > 0 && (
                    <h3 className="results-heading">Almost there — missing a few ingredients</h3>
                )}
                {partialDrinks.map(renderDrink)}
            </div>
        </>
    )
}

export default App