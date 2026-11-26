import {PLACEHOLDER_IMG} from './placeholder.js'

// One cocktail: photo, name, instructions and ingredients. When the drink comes
// from an ingredient search it also shows what the user is missing.
function DrinkCard({drink}) {
    const missing = drink.missing || []
    const missingSet = new Set(missing)
    return (
        <div className="cocktail-card">
            <img
                className="cocktail-card-img"
                src={drink.image_example || PLACEHOLDER_IMG}
                alt={drink.name}
                loading="lazy"
                onError={(e) => {
                    e.currentTarget.onerror = null // avoid a loop if the fallback fails
                    e.currentTarget.src = PLACEHOLDER_IMG
                }}
            />
            <div>
                <div className="cocktail-card-header">
                    <h2>{drink.name}</h2>
                    {drink.makeable ? (
                        <span className="badge badge-ready">✓ You have everything</span>
                    ) : (
                        missing.length > 0 && (
                            <span className="badge badge-missing">Missing {missing.length}</span>
                        )
                    )}
                </div>
                <p className="cocktail-card-instructions">{drink.instructions}</p>
                <p className="ingredients-title">
                    <strong>Ingredients</strong>
                </p>
                {drink.ingredients && drink.ingredients.length > 0 && (
                    <ul className="cocktail-card-ingredients-list">
                        {drink.ingredients.map((ingredient, index) => (
                            <li
                                key={index}
                                className={
                                    missingSet.has(ingredient.name)
                                        ? 'ingredient-missing'
                                        : undefined
                                }
                            >
                                {ingredient.quantity} {ingredient.name}
                                {missingSet.has(ingredient.name) && (
                                    <span className="need-tag"> — need</span>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default DrinkCard
