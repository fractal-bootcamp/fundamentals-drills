function countElements(nums: number[]) {

    let numsLen = nums.length

    if (numsLen == 0 || numsLen == 1) {
        return 0
    }

    let sortedNums = nums.sort((a, b) => a - b)
    console.log(sortedNums)

    let minimum = nums[0]
    let maximum: number = nums.at(numsLen - 1)!
    let output = 0

    for (let i = 0; i < numsLen; i++) {

        let current = nums[i]

        if (current > minimum && current < maximum) {
            output += 1
        }
    }

    return output
}

let nums = [1, 2, 3, 4, 5]
console.log(countElements(nums))