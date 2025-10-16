export function removeElement(nums: number[], val: number): number {
    for (let i = 0; i < nums.length; i++) {
        const num = nums[i]
        if (num == val) { nums.splice(i, 1, 0); }
    }
    console.log("nums=", nums)
    nums = nums.sort((a, b) => b - a)
    console.log("sortednums=", nums)
    const nonValValues = nums.filter((num) => num != 0)
    console.log("nonValValues=", nonValValues)
    const k = nonValValues.length
    console.log("k=", k)
    return k
};

// sketch
// how am i doing it? looking at each letter in nums to check if it is val, dropping val, then count what's left

//pseudo
// nums = [3,2,2,3]
// val = 3

// loop over the array
// for (let i = 0; i < nums.length; i++) {
//  const num = nums[i]
//  if (num == val){nums = nums.pop(num)}
// }
// k = nums.length
// return k

// wait, can i just filter the array?
// function removeElement(nums: number[], val: number): number {
//     const result = nums.filter((num)=> num != val)
//     const k = result.length
//     return k
// };

// okay, that did not work. idk why so i guess i need to finish the loop
// function removeElement(nums: number[], val: number): number {
//     for (let i = 0; i < nums.length; i++) {
//         const num = nums[i]
//         if (num == val) { nums = nums.splice(num[i]) }
//     }
//     const k = nums.length
//     return k
// };
// okay, forgot pop only removes the end element and also returns the damned thing.
// 
// so now we're going to try splicing the array and replacing val with underscores. but wait, how to count? man im just
// gonna ask paris why filter didnt work this is a waste of time

// okay i'm a dummy and didn't read closely, it's not working because i'm not removing val in place
// function removeElement(nums: number[], val: number): number {
//     const indexes = forEach((num)=> indexOf(num))
//     const replaced = forEach((idx)=> index.splice(num, 1, "_"))
//     const k = replaced.length
//     return k
// };

// also does not work because my syntax is shit
// function removeElement(nums: number[], val: number): number {
//     const indexes = nums.forEach((num)=> nums.indexOf(num))
//     const replaced = indexes.forEach((idx)=> nums.splice(num, 1, "_"))
//     const k = replaced.length
//     return k
// };

// also does not work because my syntax is still messed up and also did not actually remove val. let's just loop
// function removeElement(nums: number[], val: number): number {
//     const indexes = nums.forEach((num)=> nums.indexOf(num))
//     const replaced = indexes.forEach((idx)=> nums.splice(num, 1, "_"))
//     const k = replaced.length
//     return k
// };