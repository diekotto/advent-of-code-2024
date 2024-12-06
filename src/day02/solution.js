const fs = require("fs");
const path = require("path");

function isStrictlySafe(sequence) {
  if (sequence.length < 2) return true;

  const firstDiff = sequence[1] - sequence[0];
  const isIncreasing = firstDiff > 0;

  if (Math.abs(firstDiff) < 1 || Math.abs(firstDiff) > 3) return false;

  for (let i = 1; i < sequence.length - 1; i++) {
    const diff = sequence[i + 1] - sequence[i];
    if ((isIncreasing && diff <= 0) || (!isIncreasing && diff >= 0))
      return false;
    if (Math.abs(diff) < 1 || Math.abs(diff) > 3) return false;
  }

  return true;
}

function isSafe2(sequence) {
  // First try: sequence is safe without removing any number
  if (isStrictlySafe(sequence)) return true;

  // Try removing each number once and check if resulting sequence is safe
  for (let i = 0; i < sequence.length; i++) {
    const newSequence = [...sequence.slice(0, i), ...sequence.slice(i + 1)];
    if (isStrictlySafe(newSequence)) return true;
  }

  return false;
}

function main() {
  const inputFile = path.join(__dirname, "input.txt");
  const input = fs.readFileSync(inputFile, "utf8");
  const lines = input.split("\n");

  let safeCount = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    const numbers = line.trim().split(/\s+/).map(Number);
    if (isStrictlySafe(numbers)) {
      safeCount++;
    }
  }
  console.log("Day 01, Part 1:", safeCount);

  safeCount = 0;
  for (const line of lines) {
    if (!line.trim()) continue;
    const numbers = line.trim().split(/\s+/).map(Number);
    if (isSafe2(numbers)) {
      safeCount++;
    }
  }

  console.log("Day 02, Part 2:", safeCount);
}

main();
