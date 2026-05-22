const calculateAge = function (birthDateString) {
  const dateRegex = /^\d{4}-\d{2}-\d{2}$/;

  if (!dateRegex.test(birthDateString)) {
    return "Error: Invalid date format";
  }

  const [year, month, day] = birthDateString.split("-").map(Number);
  const birthDate = new Date(`${birthDateString}T00:00:00`);

  if (
    Number.isNaN(birthDate.getTime()) ||
    birthDate.getFullYear() !== year ||
    birthDate.getMonth() + 1 !== month ||
    birthDate.getDate() !== day
  ) {
    return "Error: Invalid date format";
  }

  const today = new Date("2026-05-18T00:00:00");

  if (birthDate > today) {
    return "Error: You cannot be less than zero years old.";
  }

  let age = today.getFullYear() - birthDate.getFullYear();
  const hasNotHadBirthdayThisYear =
    today.getMonth() < birthDate.getMonth() ||
    (today.getMonth() === birthDate.getMonth() &&
      today.getDate() < birthDate.getDate());

  if (hasNotHadBirthdayThisYear) age--;

  if (age > 100) {
    return "Are you sure you are more than 100 years old?";
  }

  return `You are ${age} years old`;
};

console.log(calculateAge("2000-07-01"));
// You are 25 years old
console.log(calculateAge("1988-05-18"));
// You are 38 years old
console.log(calculateAge("2190-01-01"));
// Error: You cannot be less than zero years old.
console.log(calculateAge("1800-01-01"));
// Are you sure you are more than 100 years old?
const someday = undefined;
console.log(calculateAge(someday));
// Error: Invalid date format
