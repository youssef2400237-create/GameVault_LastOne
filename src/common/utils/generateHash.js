import bcrypt from "bcrypt";
export const generateHash = async (text) => {
  const hashed = await bcrypt.hash(text, 10);
  return hashed;
};

export const compareHash = async (text, cypherText) => {
  const IsValid = await bcrypt.compare(text, cypherText);
  return IsValid;
};
