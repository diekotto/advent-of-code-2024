const day = process.argv[2];
if (!day) {
  console.error('Please provide a day number: npm run solve day01');
  process.exit(1);
}

require(`../src/${day}/solution.js`);
