/**
 Do not return anything, modify nums1 in-place instead.
 */
function merge(nums1: number[], m: number, nums2: number[], n: number): number[] {

    // Input: nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3
    // Output: [0, 1, 2, 2, 3, 5, 6]

    // intermediate step:
    // num1 = [1, 2, 3, 0, 0, 0]  nums2 = [2,5,6]
    // THEN:
    // num1 = [1, 2, 2, 3, 0, 0]

    // how did I do that?
    // just go back and forth looking at the lowest number and putting it in the new array in the right place
    // what i would do is construct a new array, because thats what i do in my head

    const mergedArray = []

    let leftIdx = 0
    let rightIdx = 0
    // REMEMBER: that leftIdx will go ONE location PAST the final element, because of the line `leftIdx++`
    // so for instance in the case nums1 = [1, 2, 3, 0, 0, 0], num2 = [2, 5, 6]
    // the final loop will run, and leftIdx == 3, and rightIdx == 3, because both of them had to go through: 0, 1, 2 THEN increment to 3
    // which will never run again, and indicates that we have "finished"
    const finalIndexCount = m + n

    // 3, 2
    // 6 <= 4
    while (leftIdx + rightIdx < finalIndexCount) {
        const left = nums1[leftIdx] // number OR undefined
        const right = nums2[rightIdx] // numbed OR undefined

        // `leftIdx < m` means that i still have elements on the LEFT remaining to merge
        // i already know i have SOME elements remaining, due to the while loop, so if I don't have any on the left, they must be on the right.
        // `left < right` means that the left value is less than the right value and should be merged in first, therefore.
        console.log('-------- next step ------')
        console.log(left, right, mergedArray)
        // if rightIdx >=n, we want to push LEFT as well, because right is DONE.
        if (rightIdx >= n || (leftIdx < m && left < right)) {
            mergedArray.push(left)
            leftIdx++
        } else {
            mergedArray.push(right)
            rightIdx++
        }
        console.log(mergedArray)
    }

    return mergedArray
};

const merge1 = merge([1, 2, 3, 0, 0, 0], 3, [2, 5, 6], 3)
const merge2 = merge([0, 8, 96, 100, 0, 0, 0], 4, [0, 1, 2, 77, 78], 5)
console.log(merge1, merge2)