const text = "JavaScript is the best language. JavaScript is fun.";

// indexOf()
console.log("indexOf:");
console.log(text.indexOf("JavaScript")); // Finds first occurrence

// lastIndexOf()
console.log("\nlastIndexOf:");
console.log(text.lastIndexOf("JavaScript")); // Finds last occurrence

// search()
console.log("\nsearch:");
console.log(text.search("best")); // Works like indexOf but supports regex

// match()
console.log("\nmatch:");
console.log(text.match(/JavaScript/g)); // Returns array of matches or null

// matchAll()
console.log("\nmatchAll:");
const matches = text.matchAll(/JavaScript/g); // Returns iterator of matches
for (const match of matches) {
  console.log(match[0], "found at index", match.index);
}

// includes()
console.log("\nincludes:");
console.log(text.includes("language")); // true
console.log(text.includes("Language")); // false (case-sensitive)

// startsWith()
console.log("\nstartsWith:");
console.log(text.startsWith("JavaScript")); // true

// endsWith()
console.log("\nendsWith:");
console.log(text.endsWith("fun.")); // true
