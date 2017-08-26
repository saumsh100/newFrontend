/**
 * Created by sharp on 2017-03-22.
 */

import {
  readFile,
  replaceJavascriptFile,
} from '../../../server/util/file';

const getPath = (fileName) => `${__dirname}/../../statics/${fileName}`;

describe('util/file', () => {
  describe('#readFile', () => {
    test('should be a function', () => {
      expect(typeof readFile).toBe('function');
    });

    test('should return Hello World! text', async () => {
      const text = await readFile(getPath('test.file'));
      expect(text.trim()).toBe('Hello World!');
    });
  });

  describe('#replaceJavascriptFile', () => {
    test('should be a function', () => {
      expect(typeof replaceJavascriptFile).toBe('function');
    });

    test('should return the same text as readFile', async () => {
      const path = getPath('testFileEmpty.js');
      const contents = await readFile(path);
      const replacedJsContents = await replaceJavascriptFile(path);
      expect(contents).toBe(replacedJsContents);
    });

    test('should return the replaced text', async () => {
      const path = getPath('testFileVariables.js');
      const replaced = await replaceJavascriptFile(path, {
        __REPLACE_THIS_VARIABLE__: 'foo',
      });

      expect(replaced.trim()).toBe('(function () { const __REPLACE_THIS_VARIABLE__ = \'foo\'; })();');
    });
  });
});

