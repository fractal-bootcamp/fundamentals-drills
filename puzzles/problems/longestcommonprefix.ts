function longestCommonPrefix(strs: string[]): string {
    if ((strs.length <= 1)) throw new Error("Array too short")
    if ((strs.length >= 200)) throw new Error("Array too long")

    for (const str of strs) {
    // length checks for array and strings
        if ((str.length >= 200)) throw new Error("String too long");

    // regex function to check for all lowercase english letters and no empty strings
        function isAllLowercase(str: string) {
            return /^[a-z]+$/.test(str)
        }
        if (isAllLowercase(str) == false) throw new Error("Empty string or invalid characters")
    }
    // function to check if all letters in an array are the same so i can validate the prefix
    function allSame(arr: string[]) {
        return arr.every(val => val == arr[0]);
    }
    // state for second loop
    let prefix = ""
    let possiblyPrefix = []

    for (let i = 0; i < strs[0].length; i++) {
        for (let j = 0; j < strs.length; j++){
            const letter = strs[j][i]
            possiblyPrefix.push(letter)
            if (allSame(possiblyPrefix)) {
                prefix = prefix + possiblyPrefix[0]
            }
            else break;

        }
    }
    return prefix
}
// problem
// Write a function to find the longest common prefix string amongst an array of strings.
// If there is no common prefix, return an empty string "".
// Example 1:
// Input: strs = ["flower","flow","flight"]
// Output: "fl"

// Example 2:
// Input: strs = ["dog","racecar","car"]
// Output: ""
// Explanation: There is no common prefix among the input strings.
 
// Constraints:

// 1 <= strs.length <= 200
// 0 <= strs[i].length <= 200
// strs[i] consists of only lowercase English letters if it is non-empty.

// sketch
// what do we need to do? loop over an array of strings
// how do I do it? check the first letter of each, then the second letter, then the third, and so on until
// i stop seeing any common letters or until i get to the end of the word. i keep the words with letters in common
// and drop the ones that fall out. 
// Need to track: indexes of words that are still in play, so i can stop when i'm down to one word; the prefix itself
// example solution: 
// Input: strs = ["flower","flow","flight"]
// f f f -> prefix = f
// l l l -> prefix = fl
// o o i -> prefix = fl; break
// so the loop needs to look at the letters of each word in order and stop as soon as one of the letters is not the same
// it should add letters to the prefix only if it is present at each point of the word
// if the array is shorter than 1 or longer than 200, it should throw an error("Array too short/long")
// if the string is empty or longer than 200, it should throw an error("String too short/long")
// need to check for lowercase english letters only in the string

// pseudo
// if !(1 <= strs.length <= 200) {throw "Array too short/long"}; break;

// for (str in strs) {
// length checks for array and strings
// if !(strs[i].length <= 200) {throw "String too long"}; break;

// regex function to check for all lowercase english letters and no empty strings
// function isAllLowercase(str) {
// return /^[a-z]+$/.test(str)
// }
// if (isAllLowercase(strs[i]) == false) {throw "Empty string or invalid characters"}; break;
// 
// }
// function to check if all letters are the same
// function allSame(arr) {
//  return arr.every(val ==> val == arr[0]);
// }
// prefix = ""
// possiblyPrefix = []
// for (i = 0; i < strs[0].length; i++) {
//  for (i = 0; j < strs.length; j++){
//      letter = strs[j][i]
//      possiblyPrefix.push(letter)
//     if (allSame(possiblyPrefix)) {
//     prefix = prefix + possiblyPrefix[0]
//      }
//     else break;
//      
//  }
// }