
/**
 * Capitalize the first letter of a word or of every word of a sentence.
 * Works without trimming the string.
 *
 * @param {string} str
 * @return {string} capitalized string
 */
const cap = str => str.replace(/\b\w/g, l => l.toUpperCase());

export default cap;
