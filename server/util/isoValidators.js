
export function validateJsonString(string, allowedKeys) {
  try {
    const object = JSON.parse(string);
    const keys = Object.keys(object);
    return keys.every(k => allowedKeys.includes(k));
  } catch (err) {
    console.error(err);
    return false;
  }
}
