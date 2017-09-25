
/**
 *
 * @param functionName
 * @param data
 * @returns {*}
 * @constructor
 */
export default function javaParent(functionName, data) {
  if (!window.JavaParent) {
    // Will log in development a lot
    console.log('window.JavaParent does not exist');
    return null;
  }

  // Now make sure the JavaParent function exists
  const javaParentFunction = window.JavaParent[functionName];
  if (!javaParentFunction) {
    // .error cause its more important to know than above
    console.error('Calling a JavaParent function that does not exist');
    return null;
  }

  return javaParentFunction(data);
}
