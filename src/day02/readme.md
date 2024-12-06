## --- Day 2: Red-Nosed Reports ---

Fortunately, the first location The Historians want to search isn't a long walk from the Chief Historian's office.

While the <a>Red-Nosed Reindeer nuclear fusion/fission plant</a> appears to contain no sign of the Chief Historian, the engineers there run up to you as soon as they see you. Apparently, they _still_ talk about the time Rudolph was saved through molecular synthesis from a single electron.

They're quick to add that - since you're already here - they'd really appreciate your help analyzing some unusual data from the Red-Nosed reactor. You turn to check if The Historians are waiting for you, but they seem to have already divided into groups that are currently searching every corner of the facility. You offer to help with the unusual data.

The unusual data (your puzzle input) consists of many _reports_, one report per line. Each report is a list of numbers called _levels_ that are separated by spaces. For example:

```
7 6 4 2 1
1 2 7 8 9
9 7 6 2 1
1 3 2 4 5
8 6 4 4 1
1 3 6 7 9
```

This example data contains six reports each containing five levels.

The engineers are trying to figure out which reports are _safe_. The Red-Nosed reactor safety systems can only tolerate levels that are either gradually increasing or gradually decreasing. So, a report only counts as safe if both of the following are true:

- The levels are either _all increasing_ or _all decreasing_.

- Any two adjacent levels differ by _at least one_ and _at most three_.

In the example above, the reports can be found safe or unsafe by checking those rules:

- `7 6 4 2 1`: _Safe_ because the levels are all decreasing by 1 or 2.

- `1 2 7 8 9`: _Unsafe_ because `2 7` is an increase of 5.

- `9 7 6 2 1`: _Unsafe_ because `6 2` is a decrease of 4.

- `1 3 2 4 5`: _Unsafe_ because `1 3` is increasing but `3 2` is decreasing.

- `8 6 4 4 1`: _Unsafe_ because `4 4` is neither an increase or a decrease.

- `1 3 6 7 9`: _Safe_ because the levels are all increasing by 1, 2, or 3.

So, in this example, `_2_` reports are _safe_.

Analyze the unusual data from the engineers. _How many reports are safe?_

## --- Part Two ---

The engineers are surprised by the low number of safe reports until they realize they forgot to tell you about the **Problem Dampener**.

The Problem Dampener is a reactor-mounted module that lets the reactor safety systems _tolerate a single bad level_ in what would otherwise be a safe report. It's like the bad level never happened!

Now, the same rules apply as before, except if removing a single level from an unsafe report would make it safe, the report instead counts as safe.

More of the above example's reports are now safe:

- `7 6 4 2 1`: _Safe_ without removing any level.

- `1 2 7 8 9`: _Unsafe_ regardless of which level is removed.

- `9 7 6 2 1`: _Unsafe_ regardless of which level is removed.

- `1 _3_ 2 4 5`: _Safe_ by removing the second level, `3`.

- `8 6 _4_ 4 1`: _Safe_ by removing the third level, `4`.

- `1 3 6 7 9`: _Safe_ without removing any level.

Thanks to the Problem Dampener, `_4_` reports are actually _safe_!

Update your analysis by handling situations where the Problem Dampener can remove a single level from unsafe reports. _How many reports are now safe?_

# Day 2: Red-Nosed Reports - Solution Analysis

## Problem Overview
The puzzle involves analyzing sequences of numbers (levels) to determine if they follow specific safety rules.

### Part 1: Basic Safety Rules
A sequence is considered safe if:
1. All numbers are either strictly increasing or strictly decreasing
2. Adjacent numbers differ by at least 1 and at most 3

### Part 2: Problem Dampener
Adds flexibility to safety checks:
- A sequence is safe if removing any single number makes it comply with Part 1 rules
- Original safe sequences remain safe without removal

## Solution Approach

### Part 1: Strict Safety Check
The solution implements a straightforward validation approach:

```javascript
function isStrictlySafe(sequence) {
  if (sequence.length < 2) return true;

  // Determine direction with first pair
  const firstDiff = sequence[1] - sequence[0];
  const isIncreasing = firstDiff > 0;

  // Check first difference bounds
  if (Math.abs(firstDiff) < 1 || Math.abs(firstDiff) > 3) return false;

  // Validate remaining sequence
  for (let i = 1; i < sequence.length - 1; i++) {
    const diff = sequence[i + 1] - sequence[i];
    // Check direction consistency and bounds
    if ((isIncreasing && diff <= 0) || (!isIncreasing && diff >= 0))
      return false;
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) return false;
  }

  return true;
}
```

Key aspects:
1. Early determination of sequence direction
2. Validation of difference bounds (1-3)
3. Consistency check with determined direction

### Part 2: Problem Dampener Implementation
The solution uses a "try-all-removals" approach:

```javascript
function isSafe2(sequence) {
  // First check: no removal needed
  if (isStrictlySafe(sequence)) return true;

  // Try removing each number
  for (let i = 0; i < sequence.length; i++) {
    const newSequence = [...sequence.slice(0, i), ...sequence.slice(i + 1)];
    if (isStrictlySafe(newSequence)) return true;
  }

  return false;
}
```

Key aspects:
1. First attempt without removal (optimization)
2. Systematic testing of each possible removal
3. Early return on first valid sequence

## Performance Analysis

### Time Complexity
- Part 1: O(n) where n is sequence length
  - Single pass through sequence
  - Constant time operations per element

- Part 2: O(n²)
  - O(n) attempts at removal
  - Each attempt requires O(n) for sequence validation
  - Array slicing adds additional overhead

### Space Complexity
- Part 1: O(1)
  - Only stores constants and loop variables

- Part 2: O(n)
  - Creates new arrays for each removal attempt
  - Maximum size of each new array is n-1

### Optimizations Used
1. **Early Returns**
   - Sequences < 2 elements immediately return true
   - First failed condition exits validation
   - Part 2 checks original sequence first

2. **Direction Detection**
   - Determines increasing/decreasing once at start
   - Avoids redundant comparisons

3. **Bound Checking**
   - Combines direction and magnitude checks
   - Minimizes number of comparisons

### Potential Improvements

1. **Array Handling in Part 2**
```javascript
// Current approach (creates new arrays):
const newSequence = [...sequence.slice(0, i), ...sequence.slice(i + 1)];

// Potential improvement (uses indices):
function isStrictlySafeWithSkip(sequence, skipIndex) {
  // Similar logic but skip specified index
}
```

2. **Early Exit Optimizations**
- Could detect impossible cases early (e.g., too large gaps)
- Identify patterns that can't be fixed with one removal

3. **Memory Optimization**
- Avoid array creation in Part 2
- Use index manipulation instead of slicing

## Memory Considerations
- Current implementation creates new arrays for each removal attempt
- For large sequences, could cause memory pressure
- Consider implementing in-place validation with skip index

## Trade-offs

1. **Code Clarity vs Performance**
   - Current solution prioritizes readability
   - Array slicing is clear but inefficient
   - Index manipulation would be faster but more complex

2. **Validation Approach**
   - Single-pass validation is simple
   - Could potentially combine checks for fewer iterations
   - Trade-off between code complexity and performance

3. **Memory Usage**
   - Current approach: Higher memory, clearer code
   - Index-based approach: Lower memory, more complex logic
   - Balance depends on input size and performance requirements
