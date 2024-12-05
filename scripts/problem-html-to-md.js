// Save this as convertToMd.js
async function convertAoCToMd(htmlContent) {
  // Remove HTML tags but preserve code blocks
  const converted = htmlContent
    .replace(/<pre><code>([\s\S]*?)<\/code><\/pre>/g, "```\n$1```\n") // Convert code blocks
    .replace(/<em class="star">(.*?)<\/em>/g, "**$1**") // Convert emphasis gold stars
    .replace(/<em>(.*?)<\/em>/g, "_$1_") // Convert emphasis
    .replace(/<span>(.*?)<\/span>/g, "_$1_") // Convert emphasis
    .replace(/<code>(.*?)<\/code>/g, "`$1`") // Convert inline code
    .replace(/<h2>(.*?)<\/h2>/g, "## $1\n\n") // Convert headers
    .replace(/<p>(.*?)<\/p>/g, "$1\n\n") // Convert paragraphs
    .replace(/<ul>([\s\S]*?)<\/ul>/g, "$1\n") // Handle lists
    .replace(/<li>(.*?)<\/li>/g, "- $1\n") // Convert list items
    .replace(/&gt;/g, ">") // Convert HTML entities
    .replace(/&lt;/g, "<")
    .replace(/&amp;/g, "&")
    .trim();

  return converted;
}

// Usage:
// 1. Copy the HTML content from the page source
// 2. Save it to a file called 'problem.html'
// 3. Run this script
const fs = require("fs");
const html = fs.readFileSync("problem.html", "utf8");
convertAoCToMd(html).then((md) => {
  fs.writeFileSync("problem.md", md);
  console.log("Conversion complete!");
});
