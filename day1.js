// Day 1: JavaScript Basics

// Variables & Types
let name = "Harshil";      // string
let age = 20;              // number
let isStudent = true;      // boolean
let marks = [85, 90, 78];  // array
let address = { city: "Bhopal", state: "MP" }; // object

// Operators
let totalMarks = marks[0] + marks[1] + marks[2];
let average = totalMarks / marks.length;

// Print outputs
console.log("Name:", name);
console.log("Age:", age);
console.log("Is Student?", isStudent);
console.log("Marks:", marks);
console.log("Total Marks:", totalMarks);
console.log("Average Marks:", average);
console.log("Lives in:", address.city + ", " + address.state);

// Mini Task: Print student details from an object
let student = {
  id: 101,
  name: "Harshil Kumar",
  course: "B.Tech AIML",
  year: "2nd Year",
  email: "harshil@example.com"
};

console.log("\n--- Student Details ---");
console.log("ID:", student.id);
console.log("Name:", student.name);
console.log("Course:", student.course);
console.log("Year:", student.year);
console.log("Email:", student.email);
