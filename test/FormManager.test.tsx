import { configure, mount, ReactWrapper, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';

import FormManager from '../src/FormManager';
import useForm from '../src/useForm';

configure({ adapter: new Adapter });

const StringInput = (props: any) => {
    const form = useForm();

    return <input {...form.text('test', props)} />;
};

interface PropsInterface {
    [key: string]: any;
}

const simulateBlur = (input: ReactWrapper<PropsInterface>) => {
    input.simulate('blur');
};

const simulateChange = (input: ReactWrapper<PropsInterface>, value: any) => {
    input.simulate('change', { target: { name: 'test', value, checkValidity: () => true } });
};

it('should test', () => {
    let inputValue = null;

    const onChange = (value: any) => {
        inputValue = value;
    };

    const wrapper = mount(<StringInput onChange={onChange} />);

    simulateChange(wrapper.find('input'), 'hello');

    expect(wrapper.find('input').props().value).toBe('hello');

    simulateBlur(wrapper.find('input'));

    expect(wrapper.find('input').props().value).toBe('hello');
    expect(inputValue).toBe('hello');
})
