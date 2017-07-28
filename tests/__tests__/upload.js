
import upload from '../../server/lib/upload';
import fs from 'fs';

describe('S3 Upload', () => {
  it('should be a function', () => {
    expect(typeof upload).toBe('function');
  });

  it('should fail if fileKey is null', () => {
	  upload().catch((err) => {
    	expect(err).toBe('fileKey must be set');
	  });
  });

  it('should fail if data is null', () => {
	  upload('test').catch((err) => {
    	expect(err).toBe('data must be set');
	  });
  });

  it('should upload only original size', () => {
	  upload('test/test_[size].png', fs.readFileSync(`${__dirname}/fixtures/image.png`), []).then((response) => {
    expect(response.length).toBe(1);
    expect(response[0].Key).toBe('test/test_original.png');
  });
  });

  it('should upload original and 100 size', () => {
	  upload('test/test_[size].png', fs.readFileSync(`${__dirname}/fixtures/image.png`), [100]).then((response) => {
    expect(response.length).toBe(2);
    expect(response[0].Key).toBe('test/test_original.png');
    expect(response[1].Key).toBe('test/test_100.png');
  });
  });

  it('should upload default size set (original, 400, 200, 100)', () => {
	  upload('test/test_[size].png', fs.readFileSync(`${__dirname}/fixtures/image.png`)).then((response) => {
    expect(response.length).toBe(4);
    expect(response[0].Key).toBe('test/test_original.png');
    expect(response[1].Key).toBe('test/test_400.png');
    expect(response[2].Key).toBe('test/test_200.png');
    expect(response[3].Key).toBe('test/test_100.png');
  });
  });

  it('should fail if size is invalid', () => {
	  upload('test/test_[size].png', fs.readFileSync(`${__dirname}/fixtures/image.png`), ['asd']).catch((err) => {
    expect(err).toBe('sizes should be numeric');
  });
  });

  it('should fail if sizes is not an array', () => {
	  upload('test/test_[size].png', fs.readFileSync(`${__dirname}/fixtures/image.png`), 'asd').catch((err) => {
    expect(err).toBe('sizes must be an array');
  });
  });
});
