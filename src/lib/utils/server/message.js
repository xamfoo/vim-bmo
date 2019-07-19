export const safeJsonParse = str => {
  try {
    return JSON.parse(`${str}`);
  } catch (_e) {
    return undefined;
  }
};
