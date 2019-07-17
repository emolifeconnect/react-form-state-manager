import { configure, mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import { basicHandler, numberHandler } from '../src/InputHandlers';
import useForm from '../src/useForm';

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

    it('should format', () => {
        expect(numberHandler.format(-1.2)).toBe('-1.2');
    });

    it('should validate', () => {
        expect(numberHandler.validate(-1.2)).toBe(true);
    });
});
