## --- Day 3: Mull It Over ---

"Our computers are having issues, so I have no idea if we have any Chief Historians **in stock**! You're welcome to check the warehouse, though," says the mildly flustered shopkeeper at the _North Pole Toboggan Rental Shop_. The Historians head out to take a look.

The shopkeeper turns to you. "Any chance you can see why our computers are having issues again?"

The computer appears to be trying to run a program, but its memory (your puzzle input) is _corrupted_. All of the instructions have been jumbled up!

It seems like the goal of the program is just to _multiply some numbers_. It does that with instructions like `mul(X,Y)`, where `X` and `Y` are each 1-3 digit numbers. For instance, `mul(44,46)` multiplies `44` by `46` to get a result of `2024`. Similarly, `mul(123,4)` would multiply `123` by `4`.

However, because the program's memory has been corrupted, there are also many invalid characters that should be _ignored_, even if they look like part of a `mul` instruction. Sequences like `mul(4*`, `mul(6,9!`, `?(12,34)`, or `mul ( 2 , 4 )` do _nothing_.

For example, consider the following section of corrupted memory:

```
x_mul(2,4)_%&mul[3,7]!@^do_not__mul(5,5)_+mul(32,64]then(_mul(11,8)mul(8,5)_)
```

Only the four highlighted sections are real `mul` instructions. Adding up the result of each instruction produces `_161_` (`2*4 + 5*5 + 11*8 + 8*5`).

Scan the corrupted memory for uncorrupted `mul` instructions. _What do you get if you add up all of the results of the multiplications?_

## --- Part Two ---

As you scan through the corrupted memory, you notice that some of the conditional statements are also still intact. If you handle some of the uncorrupted conditional statements in the program, you might be able to get an even more accurate result.

There are two new instructions you'll need to handle:

- The `do()` instruction _enables_ future `mul` instructions.

- The `don't()` instruction _disables_ future `mul` instructions.

Only the _most recent_ `do()` or `don't()` instruction applies. At the beginning of the program, `mul` instructions are _enabled_.

For example:

```
x_mul(2,4)_&mul[3,7]!^_don't()__mul(5,5)+mul(32,64](mul(11,8)un_do()_?_mul(8,5)_)
```

This corrupted memory is similar to the example from before, but this time the `mul(5,5)` and `mul(11,8)` instructions are _disabled_ because there is a `don't()` instruction before them. The other `mul` instructions function normally, including the one at the end that gets re-_enabled_ by a `do()` instruction.

This time, the sum of the results is `_48_` (`2*4 + 8*5`).

Handle the new instructions; _what do you get if you add up all of the results of just the enabled multiplications?_

# Day 3: Mull It Over - Solution Analysis

## Problem Overview

This puzzle involves parsing and processing instructions from corrupted memory, focusing on multiplication operations and state management.

### Part 1: Basic Instruction Processing

- Find valid `mul(X,Y)` instructions in corrupted text
- Instructions contain 1-3 digit numbers
- Ignore malformed instructions and other characters
- Calculate sum of all multiplication results

### Part 2: State-Based Processing

- Adds state management with `do()` and `don't()` instructions
- Instructions enable/disable future multiplications
- Only most recent state change applies
- Default state is enabled
- Calculate sum of only enabled multiplications

## Solution Approach

### Part 1: Regex-Based Parsing

The solution uses regular expressions to extract valid multiplication instructions:

```javascript
const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
```

Key components of the regex:

- `mul\(` matches literal "mul("
- `(\d{1,3})` captures 1-3 digits
- `,` matches literal comma
- Second group captures second number
- `\)` matches closing parenthesis

```javascript
while ((match = regex.exec(input)) !== null) {
  const x = parseInt(match[1]);
  const y = parseInt(match[2]);
  total += x * y;
}
```

### Part 2: State Machine Implementation

The solution implements a simple state machine that:

1. Finds all operations (multiplications and controls) with their positions
2. Sorts operations by position to maintain order
3. Processes operations sequentially, tracking enabled state

```javascript
// Track all operations with their positions
const allOperations = [];

// Find multiplications and controls
const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
const controlRegex = /(?:do\(\)|don't\(\))/g;

// Sort by position
allOperations.sort((a, b) => a.index - b.index);

// Process in order
for (const op of allOperations) {
  if (op.type === "do()") isEnabled = true;
  else if (op.type === "don't()") isEnabled = false;
  else if (op.type === "mul" && isEnabled) total += op.x * y;
}
```

## Performance Analysis

### Time Complexity

- Part 1: O(n) where n is input length

  - Single pass through input with regex
  - Each match extraction is O(1)

- Part 2: O(n + m log m) where:
  - n = input length
  - m = number of operations
  - Sorting operations adds log m factor

### Space Complexity

- Part 1: O(1)
  - Only stores current match and running total
- Part 2: O(m)
  - Stores all operations in array
  - m is typically much smaller than n

### Regular Expression Performance

1. **Greedy vs Non-Greedy**

   - Current regex is naturally greedy
   - Works well because pattern is specific
   - No backtracking needed for valid inputs

2. **Capturing Groups**
   - Uses minimal capturing (only numbers)
   - Avoids unnecessary group captures
   - Direct access to matched numbers

### Edge Cases and Considerations

1. **Number Range Validation**

   - Regex ensures 1-3 digits
   - No explicit range checking (0-999)
   - Could add validation if needed

2. **State Management**

   - Preserves state between lines
   - Handles nested/sequential controls
   - No stack needed for state history

3. **Malformed Input Handling**
   - Ignores partial matches
   - Skips invalid numbers
   - Resilient to corrupted text

## Optimization Opportunities

1. **Single Pass Processing**

   - Could combine regex patterns
   - Might increase complexity
   - Trade-off: speed vs. readability

2. **Precompiled Regex**

   - Store regex objects once
   - Minimal impact for small inputs
   - Helpful for repeated processing

3. **Early Exit**
   - Could add bounds checking
   - Skip processing disabled sections
   - Complex with interleaved controls

## Memory Considerations

- Current solution processes line by line
- Minimal memory footprint
- State tracking is constant space
- Operation array scales with instruction count

## Trade-offs

1. **Regex vs Manual Parsing**

   - Pros: Clean, maintainable code
   - Cons: Potential performance overhead
   - Choice: Clarity over micro-optimization

2. **State Array vs Immediate Processing**

   - Pros: Simpler logic, easier to debug
   - Cons: Extra memory, sorting overhead
   - Choice: Correctness over memory usage

3. **Line-by-Line vs Full Input**
   - Pros: Memory efficient, handles large files
   - Cons: Must maintain state between lines
   - Choice: Scalability over simplicity
