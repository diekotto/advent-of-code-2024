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
  if (isNaN(left[i]) || isNaN(right[i])) {
    console.log(left[i], right[i]);
    throw new Error(`Invalid input at line ${i + 1}`);
  }
  const distance = Math.abs(left[i] - right[i]);
  totalDistance += distance;
}
console.log("Day 01, Part 1:", totalDistance);
