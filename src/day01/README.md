## --- Day 1: Historian Hysteria ---

The _Chief Historian_ is always present for the big Christmas sleigh launch, but nobody has seen him in months! Last anyone heard, he was visiting locations that are historically significant to the North Pole; a group of Senior Historians has asked you to accompany them as they check the places they think he was most likely to visit.

As each location is checked, they will mark it on their list with a **star**. They figure the Chief Historian _must_ be in one of the first fifty places they'll look, so in order to save Christmas, you need to help them get **fifty stars** on their list before Santa takes off on December 25th.

Collect stars by solving puzzles. Two puzzles will be made available on each day in the Advent calendar; the second puzzle is unlocked when you complete the first. Each puzzle grants **one star**. Good luck!

You haven't even left yet and the group of Elvish Senior Historians has already hit a problem: their list of locations to check is currently _empty_. Eventually, someone decides that the best place to check first would be the Chief Historian's office.

Upon pouring into the office, everyone confirms that the Chief Historian is indeed nowhere to be found. Instead, the Elves discover an assortment of notes and lists of historically significant locations! This seems to be the planning the Chief Historian was doing before he left. Perhaps these notes can be used to determine which locations to search?

Throughout the Chief's office, the historically significant locations are listed not by name but by a unique number called the _location ID_. To make sure they don't miss anything, The Historians split into two groups, each searching the office and trying to create their own complete list of location IDs.

There's just one problem: by holding the two lists up _side by side_ (your puzzle input), it quickly becomes clear that the lists aren't very similar. Maybe you can help The Historians reconcile their lists?

For example:

```
3   4
4   3
2   5
1   3
3   9
3   3
```

Maybe the lists are only off by a small amount! To find out, pair up the numbers and measure how far apart they are. Pair up the _smallest number in the left list_ with the _smallest number in the right list_, then the _second-smallest left number_ with the _second-smallest right number_, and so on.

Within each pair, figure out _how far apart_ the two numbers are; you'll need to _add up all of those distances_. For example, if you pair up a `3` from the left list with a `7` from the right list, the distance apart is `4`; if you pair up a `9` with a `3`, the distance apart is `6`.

In the example list above, the pairs and distances would be as follows:

- The smallest number in the left list is `1`, and the smallest number in the right list is `3`. The distance between them is `_2_`.

- The second-smallest number in the left list is `2`, and the second-smallest number in the right list is another `3`. The distance between them is `_1_`.

- The third-smallest number in both lists is `3`, so the distance between them is `_0_`.

- The next numbers to pair up are `3` and `4`, a distance of `_1_`.

- The fifth-smallest numbers in each list are `3` and `5`, a distance of `_2_`.

- Finally, the largest number in the left list is `4`, while the largest number in the right list is `9`; these are a distance `_5_` apart.

To find the _total distance_ between the left list and the right list, add up the distances between all of the pairs you found. In the example above, this is `2 + 1 + 0 + 1 + 2 + 5`, a total distance of `_11_`!

Your actual left and right lists contain many location IDs. _What is the total distance between your lists?_

## --- Part Two ---

Your analysis only confirmed what everyone feared: the two lists of location IDs are indeed very different.

Or are they?

The Historians can't agree on which group made the mistakes _or_ how to read most of the Chief's handwriting, but in the commotion you notice an interesting detail: _a lot_ of location IDs appear in both lists! Maybe the other numbers aren't location IDs at all but rather misinterpreted handwriting.

This time, you'll need to figure out exactly how often each number from the left list appears in the right list. Calculate a total _similarity score_ by adding up each number in the left list after multiplying it by the number of times that number appears in the right list.

Here are the same example lists again:

```
3   4
4   3
2   5
1   3
3   9
3   3
```

For these example lists, here is the process of finding the similarity score:

- The first number in the left list is `3`. It appears in the right list three times, so the similarity score increases by `3 * 3 = _9_`.

- The second number in the left list is `4`. It appears in the right list once, so the similarity score increases by `4 * 1 = _4_`.

- The third number in the left list is `2`. It does not appear in the right list, so the similarity score does not increase (`2 * 0 = 0`).

- The fourth number, `1`, also does not appear in the right list.

- The fifth number, `3`, appears in the right list three times; the similarity score increases by `_9_`.

- The last number, `3`, appears in the right list three times; the similarity score again increases by `_9_`.

So, for these example lists, the similarity score at the end of this process is `_31_` (`9 + 4 + 0 + 0 + 9 + 9`).

Once again consider your left and right lists. _What is their similarity score?_

# Day 1: Historian Hysteria - Solution Analysis

## Problem Overview
The puzzle involves comparing two lists of location IDs and performing different analyses in two parts:

### Part 1: Distance Calculation
- Compare two lists of numbers by pairing them after sorting
- Calculate the absolute difference between each pair
- Sum all differences to get the total distance

### Part 2: Similarity Score
- For each number in the left list, count its occurrences in the right list
- Multiply the number by its occurrence count
- Sum all these products to get the total similarity score

## Solution Approach

### Part 1: List Distance
The solution uses a straightforward approach:
1. Parse input into two separate arrays
2. Sort both arrays in ascending order
3. Iterate through both arrays simultaneously, calculating absolute differences
4. Sum the differences

```javascript
left.sort();
right.sort();
let totalDistance = 0;
for (let i = 0; i < left.length; i++) {
  totalDistance += Math.abs(left[i] - right[i]);
}
```

### Part 2: Similarity Score
The solution employs memoization to optimize repeated calculations:
1. Create a memoization map to store previously calculated similarities
2. For each number in the left list:
   - Check if similarity is already calculated (memoized)
   - If not, count occurrences in right list and multiply
   - Add to total similarity score

```javascript
const memoized = new Map();
function getSimilarity(list, number) {
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] > number) break; // Early exit optimization
    if (list[i] === number) count++;
  }
  return count * number;
}
```

## Performance Analysis

### Time Complexity
- Part 1: O(n log n)
  - Dominated by the initial sorting of both arrays
  - The subsequent iteration is O(n)

- Part 2: O(n * m)
  - n = length of left array
  - m = average search length in right array
  - Memoization improves performance for repeated numbers
  - Early exit when searching (break on first larger number) provides optimization

### Space Complexity
- Part 1: O(1) additional space (sorting is typically in-place)
- Part 2: O(k) where k is the number of unique values in the left array (memoization map)

### Optimizations Used
1. **Early Exit**: In Part 2, the search stops when we find a larger number (since array is sorted)
2. **Memoization**: Caching similarity results for repeated numbers
3. **Array Sorting**: Enables binary search potential and early exit optimization

### Potential Improvements
1. **Binary Search**: Could implement binary search for finding occurrences in Part 2
2. **Parallel Processing**: For very large datasets, could parallelize the similarity calculations
3. **Streaming**: Could process input line-by-line instead of loading entire file
4. **Pre-counting**: Could create a frequency map of right list numbers once

## Memory Considerations
- Current implementation keeps both full arrays in memory
- For very large inputs, could implement streaming approach
- Memoization map trades memory for speed - could be removed if memory is constrained

## Trade-offs
1. **Sorting vs No Sorting**
   - Pros: Enables optimizations like early exit
   - Cons: O(n log n) overhead, modifies input arrays

2. **Memoization**
   - Pros: Speeds up repeated calculations
   - Cons: Additional memory usage
   - Best when input has many repeated values

3. **Early Exit**
   - Pros: Reduces average case time complexity
   - Cons: Requires sorted array
   - Most beneficial when numbers are well-distributed
