import { basicHandler, fileHandler, numberHandler } from '../src/InputHandlers';

describe('basicHandler', () => {
    it('should filter', () => {
        expect(basicHandler.filter('foo')).toBe('foo');
    });

    it('should parse', () => {
        expect(basicHandler.parse('foo')).toBe('foo');
    });

    it('should format', () => {
        expect(basicHandler.format('foo')).toBe('foo');
    });

    it('should validate', () => {
        expect(basicHandler.validate('foo')).toBe(true);
    });
});

describe('numberHandler', () => {
    it('should filter', () => {
        expect(numberHandler.filter('-1.2foo')).toBe("-1.2");
    });

    it('should parse', () => {
        expect(numberHandler.parse('-1.2')).toBe(-1.2);
    });

    it('should parse', () => {
        expect(numberHandler.parse('foo')).toBe(null);
    });

    it('should format', () => {
        expect(numberHandler.format(-1.2)).toBe('-1.2');
    });

    it('should validate', () => {
        expect(numberHandler.validate(-1.2)).toBe(true);
    });
});

describe('fileHandler', () => {
    const file: File = {
        ...new Blob([''], { type: 'text/html' }),
        lastModified: 123,
        name: 'foo'
    };

    const singleFileList = {
        0: file,
        length: 1,
        item: (index: number) => file
    };

    const multiFileList = {
        0: file,
        1: file,
        length: 2,
        item: (index: number) => file
    };

    it('should parse', () => {
        expect(fileHandler.parse(singleFileList)).toBe(file);
        expect(fileHandler.parse(multiFileList)).toBe(multiFileList);
    });
});
