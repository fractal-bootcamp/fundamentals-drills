// write a function that takes a string as input and outputs a string 
// sort the input string but keep all spaces in their original positions
// example: "cat dog" -> "acd got"; "the and" -> "ade hnt"

import { arrayMini } from "./tinyarrayops"

// sketch
// turn the string into an array, .sort, turn it back into string
// array method might work on string directly

function weirdSort(word: string): string {
    // record the indices of the spaces
    let spaces = []
    for (let i = 0; i < word.length; i++) {
        if (word[i] == " ") {
            spaces.push(i)
        }
    }

    // .replace the spaces with ""
    let wordsWithoutSpaces = word.replace(" ", "")

    // convert string to array 
    let wordArray = wordsWithoutSpaces.split("")

    // sort the array
    const sortedArray = wordArray.sort()

    // add the spaces back in
    for (let i = 0; i < spaces.length; i++) {
        const spaceIndex = spaces[i]
        sortedArray.splice(spaceIndex, 0, " ")
    }

    // convert array to a string: .join
    const sortedString = sortedArray.join("")
    return sortedString

}

console.log(weirdSort("the and"))