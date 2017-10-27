
const THE_MAGIC_WORD = 'C';

/**
 * getIndicesOf will return the indices in the text
 * of all the magicWord
 *
 * @param text
 * @param magicWord
 * @returns {Array}
 */
export function getIndicesOf(text, magicWord) {
  const magicWordLen = magicWord.length;
  if (magicWordLen === 0) {
    return [];
  }

  const indices = [];
  const regexp = new RegExp(magicWord, 'g');

  let match;
  while (match = regexp.exec(text))  {
    indices.push(match.index);
  }

  return indices;
}

/**
 *
 * @param char
 */
export function isWordy(char) {
  return /[a-zA-Z0-9]/.test(char);
}

/**
 *
 * @param text
 * @param magicWord
 */
export function isNotInWord(text, magicWord) {
  // If exactly equal to magicWord then don't go any further
  if (text === magicWord) {
    return true;
  }

  // Get all indicies of the magicWord in the text
  const indices = getIndicesOf(text, magicWord);

  // Loop through every occurance and see if any of the before character or
  // after character is alpha-numeric. If so, then return false
  for (const index of indices) {
    const beforeCharacter = text[index - 1];
    const afterCharacter = text[index + 1];
    if (!beforeCharacter && !isWordy(afterCharacter)) {
      return true;
    }

    if (!afterCharacter && !isWordy(beforeCharacter)) {
      return true;
    }

    if (beforeCharacter && !isWordy(beforeCharacter) && afterCharacter && !isWordy(afterCharacter)) {
      return true;
    }
  }

  return false;
}

/**
 * isSmsConfirmationResponse determines if a certain string of text is
 * a valid confirmation response
 *
 * @param text
 * @param magicWord
 * @returns {*}
 */
export function isSmsConfirmationResponse(text, magicWord = THE_MAGIC_WORD) {
  // If exactly equal to magicWord then don't go any further
  if (text === magicWord) {
    return true;
  }

  // If the text doesn't have the magic word at all, don't bother continuing!
  const hasMagicWord = text.includes(magicWord);

  // If the magicWord is part of another word, it doesn't count
  // ex.// magicWord='C'  text='Can't make it'
  const magicWordIsNotInWord = isNotInWord(text, magicWord);

  // This function plays nicer with checking AND for all booleans
  return hasMagicWord && magicWordIsNotInWord;
}
