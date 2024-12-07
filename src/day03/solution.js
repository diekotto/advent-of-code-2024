const fs = require("fs");
const path = require("path");

function solvePuzzle(input) {
  const regex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  let total = 0;

  let match;
  while ((match = regex.exec(input)) !== null) {
    const x = parseInt(match[1]);
    const y = parseInt(match[2]);
    total += x * y;
  }

  return total;
}

function solvePuzzle2(input, isEnabled = true) {
  let total = 0;
  let lastControlIndex = -1;

  // First find all control and mul operations in order
  const allOperations = [];

  // Find all multiplications
  const mulRegex = /mul\((\d{1,3}),(\d{1,3})\)/g;
  let mulMatch;
  while ((mulMatch = mulRegex.exec(input)) !== null) {
    allOperations.push({
      type: "mul",
      index: mulMatch.index,
      x: parseInt(mulMatch[1]),
      y: parseInt(mulMatch[2]),
    });
  }

  // Find all controls
  const controlRegex = /(?:do\(\)|don't\(\))/g;
  let controlMatch;
  while ((controlMatch = controlRegex.exec(input)) !== null) {
    allOperations.push({
      type: controlMatch[0],
      index: controlMatch.index,
    });
  }

  // Sort operations by their position in the string
  allOperations.sort((a, b) => a.index - b.index);

  // Process operations in order
  for (const op of allOperations) {
    if (op.type === "do()") {
      isEnabled = true;
      lastControlIndex = op.index;
    } else if (op.type === "don't()") {
      isEnabled = false;
      lastControlIndex = op.index;
    } else if (op.type === "mul" && isEnabled) {
      // Only process multiplication if it's enabled
      total += op.x * op.y;
    }
  }

  return { total, isEnabled };
}

function main() {
  const inputFile = path.join(__dirname, "input.txt");
  const input = fs.readFileSync(inputFile, "utf8");
  const lines = input.split("\n");

  let total = 0;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    total += solvePuzzle(lines[i].trim());
  }

  console.log("Day 03, Part 1:", total);

  total = 0;
  let isEnabled = true;
  for (let i = 0; i < lines.length; i++) {
    if (!lines[i]) continue;
    const result = solvePuzzle2(lines[i].trim(), isEnabled);
    total += result.total;
    isEnabled = result.isEnabled;
  }

  console.log("Day 03, Part 2:", total);

  // Test case
  const test = "mul(2,4)don't()mul(5,5)mul(11,8)do()mul(8,5)";
  console.log("Test case result:", solvePuzzle2(test)); // Should be 48
}

main();
