// Common cocktail ingredients used to suggest options while typing.
export const COMMON_INGREDIENTS = [
    'vodka', 'gin', 'rum', 'white rum', 'dark rum', 'tequila', 'whiskey', 'bourbon',
    'scotch', 'brandy', 'cognac', 'triple sec', 'cointreau', 'vermouth',
    'dry vermouth', 'sweet vermouth', 'campari', 'aperol', 'amaretto',
    'kahlua', 'baileys', 'blue curacao', 'grenadine', 'angostura bitters',
    'lime', 'lime juice', 'lemon', 'lemon juice', 'orange', 'orange juice',
    'cranberry juice', 'pineapple juice', 'tomato juice', 'grapefruit juice',
    'coconut cream', 'cream', 'milk', 'egg white', 'sugar', 'sugar syrup',
    'simple syrup', 'honey', 'mint', 'basil', 'ginger', 'ginger beer',
    'ginger ale', 'soda water', 'tonic water', 'cola', 'sprite', 'salt',
    'ice', 'coffee', 'espresso', 'chocolate', 'strawberry', 'raspberry',
    'peach', 'apple juice', 'prosecco', 'champagne', 'red wine', 'white wine',
    'beer', 'coffee liqueur', 'peach schnapps', 'melon liqueur',
]

// Other names people type for an ingredient above. Typing an alias suggests
// the real ingredient, which is the name the backend data actually matches.
export const INGREDIENT_ALIASES = {
    'cola': ['coke', 'coca-cola', 'pepsi'],
    'soda water': ['club soda', 'sparkling water', 'seltzer'],
    'whiskey': ['whisky'],
    'sprite': ['7up', '7-up', 'lemon-lime soda'],
    'egg white': ['egg whites'],
}

// alias -> real ingredient name, e.g. 'coke' -> 'cola'
const ALIAS_TO_INGREDIENT = Object.fromEntries(
    Object.entries(INGREDIENT_ALIASES).flatMap(([name, aliases]) =>
        aliases.map(alias => [alias, name]))
)

// Normalize what the user typed: trim, lowercase, and swap an alias for the
// real ingredient name so the backend can match it.
export const normalizeIngredient = (value) => {
    const cleaned = (value || '').trim().toLowerCase()
    return ALIAS_TO_INGREDIENT[cleaned] || cleaned
}
