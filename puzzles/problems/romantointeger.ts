type RomanNumeral = 'I' | 'V' | 'X' | 'L' | 'C' | 'D' | 'M'

const s = "MCMXCIV"

function romanToInt(s: string): number {
    const nums = { I: 1, V: 5, X: 10, L: 50, C: 100, D: 500, M: 1000 }
    let translation = 0

    for (let i = 0; i < s.length; i++) {
        const char = s[i] as RomanNumeral
        const nextChar = s[i + 1] as RomanNumeral
        const value = nums[char]
        const nextValue = nums[nextChar]

        // we are in the special case and need to process 2 chars at once.
        if (value < nextValue) {
            const totalValue = nextValue - value
            translation += totalValue
            // then SKIP the next character.
            // process both characters at once
            i++
        }
        else translation = translation + value
        console.log(translation)
        console.log("---STEP---")
    }

    return translation
};

console.log(romanToInt(s))

// sketch
// i need to use the numerals as keys and their
// values as values. the problem with that is the subtraction
// cases. if i have to loop over the numbers one by one, then i
// will need conditionals for all the subtraction cases, eg for
// every M, check whether the previous character was C, if so produce a different value

// pseudo
// dict = [I:1, V:5, X:10, L:50, C:100, D:500, M:1000]
// s = "LVIII"
// translation = 0
// prevCharKey = []

// for (charKey in s) {
//  if charKey in dict, translation = translation + charValue
// if charKey == V && prevCharKey == I, translation = translation + 4
// if charKey == X && prevCharKey == I, translation = translation + 9
// if charKey == L && prevCharKey == X, translation = translation + 40
// if charKey == C && prevCharKey == X, translation = translation + 90
// if charKey == D && prevCharKey == C, translation = translation + 400
// if charKey == M && prevCharKey == C, translation = translation + 900
// }

