const fs = require("fs");
const path = require("path");
const inputFile = path.join(__dirname, "input.txt");
const input = fs.readFileSync(inputFile, "utf8");
const lines = input.split("\n");
let left = [];
let right = [];
for (let i = 0; i < lines.length; i++) {
  if (!lines[i]) {
    continue;
  }
  const [l, r] = lines[i].trim().split(/\s+/);
  left.push(Number(l));
  right.push(Number(r));
}
left.sort();
right.sort();

let totalDistance = 0;
for (let i = 0; i < left.length; i++) {
  const distance = Math.abs(left[i] - right[i]);
  totalDistance += distance;
}
console.log("Day 01, Part 1:", totalDistance);

// Part 2
const memoized = new Map();
function getSimilarity(list, number) {
  let count = 0;
  for (let i = 0; i < list.length; i++) {
    if (list[i] > number) break;
    if (list[i] === number) count++;
  }
  return count * number;
}

let totalSimilarity = 0;
for (let i = 0; i < left.length; i++) {
  let similarity = memoized.get(left[i]);
  if (similarity === undefined) {
    similarity = getSimilarity(right, left[i]);
    memoized.set(left[i], similarity);
  }
  totalSimilarity += similarity;
}

console.log("Day 01, Part 2:", totalSimilarity);
