import { configure, mount, ReactWrapper, shallow, ShallowWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';

import FormManager from '../src/FormManager';
import useForm from '../src/useForm';

configure({ adapter: new Adapter });

const Input = ({ type, onChange }: any) => {
    const form: any = useForm();

    return <input {...form[type]('test', { onChange })} />;
};

const Textarea = ({ onChange }: any) => {
    const form = useForm();

    return <textarea {...form.textarea('test', { onChange })}></textarea>;
};

interface PropsInterface {
    [key: string]: any;
}

const simulateBlur = (input: ShallowWrapper<PropsInterface>) => {
    input.prop('onBlur')({ target: { name: 'test' } });
};

const simulateChange = (input: ShallowWrapper<PropsInterface>, value: any) => {
    input.prop('onChange')({ target: { name: 'test', value, checkValidity: () => true } });
};

describe('text inputs', () => {
    it('should handle change and blur events', () => {
        const test = ({ type, newValue, formattedValue, parsedValue}: any) => {
            let inputValue = null;

            const onChange = (value: any) => {
                inputValue = value;
            };

            const wrapper = shallow(<Input type={type} onChange={onChange} />);

            act(() => simulateChange(wrapper.find('input'), newValue));

            expect(inputValue).toBe(parsedValue);

            wrapper.update();

            expect(wrapper.find('input').props().value).toBe(newValue);

            act(() => simulateBlur(wrapper.find('input')));

            wrapper.update();

            expect(wrapper.find('input').props().value).toBe(formattedValue);
        };

        test({ type: 'text', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'password', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'number', newValue: '3200.50', formattedValue: '3200.5', parsedValue: 3200.5 });
        test({ type: 'email', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'url', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'color', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'date', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'datetimeLocal', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'month', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'search', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'tel', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'time', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'week', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
    });
});

describe('textarea', () => {
    it('should handle change and blur events', () => {
        let inputValue = null;

        const onChange = (value: any) => {
            inputValue = value;
        };

        const wrapper = shallow(<Textarea onChange={onChange} />);

        act(() => simulateChange(wrapper.find('textarea'), 'foo'));

        expect(inputValue).toBe('foo');

        wrapper.update();

        expect(wrapper.find('textarea').props().value).toBe('foo');

        act(() => simulateBlur(wrapper.find('textarea')));

        wrapper.update();

        expect(wrapper.find('textarea').props().value).toBe('foo');
    });
});
