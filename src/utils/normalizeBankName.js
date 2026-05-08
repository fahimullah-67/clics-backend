export const normalizeBankName = (name) => {
  return name
    .toLowerCase()
    .replace(/limited|ltd\.?|bank/g, "")
    .replace(/\s+/g, " ")
    .trim();
};