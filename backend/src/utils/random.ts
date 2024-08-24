const generateRandomCharacters = (length: number = 3): string => {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let result = "";

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters.charAt(randomIndex);
  }

  return result;
};

export const generateRandomId = (): string => {
  const encodedNow = Date.now().toString(36);
  const prefix = encodedNow.substring(encodedNow.length - 4, encodedNow.length);
  const suffix = generateRandomCharacters();
  return `UI${prefix}${suffix}`;
};
