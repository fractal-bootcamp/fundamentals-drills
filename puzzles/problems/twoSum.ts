function twoSum(nums: number[], target: number): number[] | undefined {
    // [3, 8, 15, 1, 3, 2]
    // target: 14
    // output: N/A

    // target: 11
    // output: [0, 1]

    // target: 4
    // [0, 3]


    // [6, 78, 45, 2, 3, 8]
    // target: 14
    // answer: 


    // map from number -> index
    const numsIHaveSeen: Map<number, number> = new Map()

    // we are going to run a loop to read the numbers so we can compare them
    for (let i = 0; i < nums.length; i++) {
        const thisNum = nums[i]
        // is there another number which, when added to `thisNum` === `target` ???
        const numberToFind = target - thisNum
        // what does numsIHaveSeen.get do?
        // it will try to get us the index of the numberToFind
        const indexINeed = numsIHaveSeen.get(numberToFind)
        if (indexINeed) return [indexINeed, i]

        if (thisNum < target) {
            numsIHaveSeen.set(thisNum, i)
        }
    }

    return undefined
};

const test1 = twoSum([6, 78, 45, 2, 3, 8], 11)
const test2 = twoSum([3, 8, 15, 1, 3, 2], 4)
console.log(test1, test2)



