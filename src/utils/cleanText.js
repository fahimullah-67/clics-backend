export const extractNumber = (text) => {
  if (text === null || text === undefined) return 0;

  // Convert number → string
  if (typeof text === "number") return text;

  // Convert everything to string safely
  const str = String(text);

  const match = str.match(/\d+(\.\d+)?/);

  return match ? parseFloat(match[0]) : 0;
};

export const detectInterestType = (text) => {
  if (!text) return "fixed";
  if (text.toLowerCase().includes("variable")) return "variable";
  return "fixed";
};

export const extractTenureMin = (text) => {
  if (!text) return 1;
  const match = text.match(/\d+/);
  return match ? parseInt(match[0]) : 1;
};

export const extractTenureMax = (text) => {
  if (!text) return 5;
  const matches = text.match(/\d+/g);
  return matches ? parseInt(matches[matches.length - 1]) : 5;
};

export const detectLoanType = (title) => {
  const t = title.toLowerCase();

  if (t.includes("car")) return "car";
  if (t.includes("home") || t.includes("house")) return "home";
  if (t.includes("bike")) return "bike";
  if (t.includes("solar")) return "solar";

  return "personal";
};

export const detectIslamic = (item) => {
  const text = (item.title + item.benefits).toLowerCase();
  return text.includes("shariah") || text.includes("islamic");
};