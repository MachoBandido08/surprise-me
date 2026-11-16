import {describe, expect, test} from 'vitest'
import {
    COMMON_INGREDIENTS,
    INGREDIENT_ALIASES,
    getSuggestions,
    normalizeIngredient,
} from './ingredients.js'

describe('normalizeIngredient', () => {
    test('trims and lowercases', () => {
        expect(normalizeIngredient('  Gin ')).toBe('gin')
    })

    test('swaps an alias for the real ingredient', () => {
        expect(normalizeIngredient('coke')).toBe('cola')
        expect(normalizeIngredient('Coca-Cola')).toBe('cola')
        expect(normalizeIngredient('club soda')).toBe('soda water')
        expect(normalizeIngredient('whisky')).toBe('whiskey')
    })

    test('leaves unknown ingredients as typed (cleaned)', () => {
        expect(normalizeIngredient('Elderflower Liqueur')).toBe('elderflower liqueur')
    })

    test('handles empty and missing input', () => {
        expect(normalizeIngredient('')).toBe('')
        expect(normalizeIngredient('   ')).toBe('')
        expect(normalizeIngredient(undefined)).toBe('')
        expect(normalizeIngredient(null)).toBe('')
    })
})

describe('getSuggestions', () => {
    test('returns nothing for empty input', () => {
        expect(getSuggestions('')).toEqual([])
        expect(getSuggestions('   ')).toEqual([])
    })

    test('matches by partial name, case-insensitively', () => {
        expect(getSuggestions('VOD')).toContain('vodka')
        expect(getSuggestions('rum')).toEqual(expect.arrayContaining(['rum', 'white rum', 'dark rum']))
    })

    test('typing an alias suggests the real ingredient', () => {
        expect(getSuggestions('coke')).toContain('cola')
        expect(getSuggestions('seltz')).toContain('soda water')
    })

    test('leaves out ingredients already added', () => {
        expect(getSuggestions('rum', ['rum'])).not.toContain('rum')
        expect(getSuggestions('rum', ['rum'])).toContain('white rum')
    })

    test('returns at most the limit', () => {
        expect(getSuggestions('e').length).toBe(6)
        expect(getSuggestions('e', [], 3).length).toBe(3)
    })
})

describe('ingredient data', () => {
    test('ingredients are lowercase, trimmed and unique', () => {
        for (const item of COMMON_INGREDIENTS) {
            expect(item).toBe(item.trim().toLowerCase())
        }
        expect(new Set(COMMON_INGREDIENTS).size).toBe(COMMON_INGREDIENTS.length)
    })

    test('every alias points at a known ingredient and is not one itself', () => {
        for (const [name, aliases] of Object.entries(INGREDIENT_ALIASES)) {
            expect(COMMON_INGREDIENTS).toContain(name)
            for (const alias of aliases) {
                expect(COMMON_INGREDIENTS).not.toContain(alias)
            }
        }
    })
})
