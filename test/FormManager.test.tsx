import { configure, shallow, ShallowWrapper } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { act } from 'react-dom/test-utils';

import FormManager, { FormState } from '../src/FormManager';
import useForm from '../src/useForm';

configure({ adapter: new Adapter });

const Input = ({ type, initialValue, onFocus, onChange, onBlur }: any) => {
    const form: any = useForm({
        values: {
            test: initialValue
        }
    });

    return <input {...form[type]('test', { onFocus, onChange, onBlur })} />;
};

const Checkbox = ({ initialValue, onFocus, onChange, onBlur }: any) => {
    const form = useForm({
        values: {
            test: initialValue
        }
    });

    return <input {...form.checkbox('test', { onFocus, onChange, onBlur })} />;
};

const Checklist = ({ initialValue, value, onFocus, onChange, onBlur }: any) => {
    const form = useForm({
        values: {
            test: initialValue
        }
    });

    return <input {...form.checklist('test', value, { onFocus, onChange, onBlur })} />;
};

const Radio = ({ initialValue, value, onFocus, onChange, onBlur }: any) => {
    const form = useForm({
        values: {
            test: initialValue
        }
    });

    return <input {...form.radio('test', value, { onFocus, onChange, onBlur })} />;
};

const Textarea = ({ value, onFocus, onChange, onBlur }: any) => {
    const form = useForm({
        values: {
            test: value
        }
    });

    return <textarea {...form.textarea('test', { onFocus, onChange, onBlur })}></textarea>;
};

const Select = ({ initialValue, values, onFocus, onChange, onBlur }: any) => {
    const form = useForm({
        values: {
            test: initialValue
        }
    });

    return <select {...form.select('test', values, { onFocus, onChange, onBlur })}>
        <option {...form.option(0)}></option>
    </select>;
};

interface PropsInterface {
    [key: string]: any;
}

const simulateFocus = (input: ShallowWrapper<PropsInterface>) => {
    input.prop('onFocus')({ target: { name: 'test' } });
};

const simulateChange = (input: ShallowWrapper<PropsInterface>, { value, files }: { value?: any, files?: any } = {}) => {
    input.prop('onChange')({ target: { name: 'test', value, files, checkValidity: () => true } });
};

const simulateBlur = (input: ShallowWrapper<PropsInterface>) => {
    input.prop('onBlur')({ target: { name: 'test' } });
};


describe('text inputs', () => {
    const test = ({ type, initialValue, newValue, formattedValue, parsedValue}: any) => {
        let focusedValue = null;

        const onFocus = (value: any) => {
            focusedValue = value;
        };

        let changedValue = null;

        const onChange = (value: any) => {
            changedValue = value;
        };

        let blurredValue = null;

        const onBlur = (value: any) => {
            blurredValue = value;
        };

        const wrapper = shallow(<Input type={type} initialValue={initialValue} onFocus={onFocus} onChange={onChange} onBlur={onBlur} />);

        // Focus
        act(() => simulateFocus(wrapper.find('input')));

        expect(focusedValue).toBe(initialValue);

        // Change
        act(() => simulateChange(wrapper.find('input'), { value: newValue }));

        expect(changedValue).toBe(parsedValue);

        wrapper.update();

        expect(wrapper.find('input').props().value).toBe(newValue);

        // Blur
        act(() => simulateBlur(wrapper.find('input')));

        expect(blurredValue).toBe(parsedValue);

        wrapper.update();

        expect(wrapper.find('input').props().value).toBe(formattedValue);
    };

    it('should handle focus, change and blur events', () => {
        test({ type: 'text', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'password', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'number', initialValue: 2500, newValue: '3200.50', formattedValue: '3200.5', parsedValue: 3200.5 });
        test({ type: 'email', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'url', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'color', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'date', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'datetimeLocal', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'month', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'search', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'tel', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'time', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
        test({ type: 'week', initialValue: 'bar', newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
    });

    it('should initialize without a value', () => {
        test({ type: 'text', initialValue: null, newValue: 'foo', formattedValue: 'foo', parsedValue: 'foo' });
    });

});

describe('textarea', () => {
    it('should handle focus, change and blur events', () => {
        let focusedValue = null;

        const onFocus = (value: any) => {
            focusedValue = value;
        };

        let changedValue = null;

        const onChange = (value: any) => {
            changedValue = value;
        };

        let blurredValue = null;

        const onBlur = (value: any) => {
            blurredValue = value;
        };

        const wrapper = shallow(<Textarea value="bar" onFocus={onFocus} onChange={onChange} onBlur={onBlur} />);

        // Focus
        act(() => simulateFocus(wrapper.find('textarea')));

        expect(focusedValue).toBe("bar");

        // Change
        act(() => simulateChange(wrapper.find('textarea'), { value: 'foo' }));

        expect(changedValue).toBe('foo');

        wrapper.update();

        expect(wrapper.find('textarea').props().value).toBe('foo');

        // Blur
        act(() => simulateBlur(wrapper.find('textarea')));

        expect(blurredValue).toBe('foo');

        wrapper.update();

        expect(wrapper.find('textarea').props().value).toBe('foo');
    });
});

describe('file input', () => {
    it('should handle focus, change and blur events', () => {
        let focusedValue = null;

        const onFocus = (value: any) => {
            focusedValue = value;
        };

        let changedValue = null;

        const onChange = (value: any) => {
            changedValue = value;
        };

        let blurredValue = null;

        const onBlur = (value: any) => {
            blurredValue = value;
        };

        const wrapper = shallow(<Input initialValue={null} type="file" onFocus={onFocus} onChange={onChange} onBlur={onBlur} />);

        // Focus
        act(() => simulateFocus(wrapper.find('input')));

        expect(focusedValue).toBe(null);

        const file: File = {
            ...new Blob([''], { type: 'text/html' }),
            lastModified: 123,
            name: 'foo'
        };

        const fileList = {
            0: file,
            length: 1,
            item: (index: number) => file
        };

        // Change
        act(() => simulateChange(wrapper.find('input'), { files: fileList }));

        expect(changedValue).toBe(fileList[0]);

        // Blur
        act(() => simulateBlur(wrapper.find('input')));

        expect(blurredValue).toBe(fileList[0]);
    });
});

describe('checkbox', () => {
    it('should handle focus, change and blur events', () => {
        let focusedValue = null;

        const onFocus = (value: any) => {
            focusedValue = value;
        };

        let changedValue = null;

        const onChange = (value: any) => {
            changedValue = value;
        };

        let blurredValue = null;

        const onBlur = (value: any) => {
            blurredValue = value;
        };

        const wrapper = shallow(<Checkbox initialValue={false} onFocus={onFocus} onChange={onChange} onBlur={onBlur} />);

        // Focus
        act(() => simulateFocus(wrapper.find('input')));

        expect(focusedValue).toStrictEqual(false);

        // Check
        act(() => simulateChange(wrapper.find('input')));

        expect(changedValue).toStrictEqual(true);

        wrapper.update();

        expect(wrapper.find('input').props().checked).toStrictEqual(true);

        // Uncheck
        act(() => simulateChange(wrapper.find('input')));

        expect(changedValue).toStrictEqual(false);

        wrapper.update();

        expect(wrapper.find('input').props().checked).toStrictEqual(false);

        // Blur
        act(() => simulateBlur(wrapper.find('input')));

        expect(blurredValue).toStrictEqual(false);

        wrapper.update();

        expect(wrapper.find('input').props().checked).toStrictEqual(false);
    });
});

describe('radio', () => {
    it('should handle focus, change and blur events', () => {
        let focusedValue = null;

        const onFocus = (value: any) => {
            focusedValue = value;
        };

        let changedValue = null;

        const onChange = (value: any) => {
            changedValue = value;
        };

        let blurredValue = null;

        const onBlur = (value: any) => {
            blurredValue = value;
        };

        const wrapper = shallow(<Radio initialValue="bar" value="foo" onFocus={onFocus} onChange={onChange} onBlur={onBlur} />);

        // Focus
        act(() => simulateFocus(wrapper.find('input')));

        expect(focusedValue).toBe('bar');

        // Check
        act(() => simulateChange(wrapper.find('input'), { value: 'foo' }));

        expect(changedValue).toBe('foo');

        wrapper.update();

        expect(wrapper.find('input').props().checked).toStrictEqual(true);

        // Blur
        act(() => simulateBlur(wrapper.find('input')));

        expect(blurredValue).toBe('foo');

        wrapper.update();

        expect(wrapper.find('input').props().checked).toStrictEqual(true);
    });
});

describe('checklist', () => {
    it('should handle focus, change and blur events', () => {
        let focusedValue = null;

        const onFocus = (value: any) => {
            focusedValue = value;
        };

        let changedValue = null;

        const onChange = (value: any) => {
            changedValue = value;
        };

        let blurredValue = null;

        const onBlur = (value: any) => {
            blurredValue = value;
        };

        const wrapper = shallow(<Checklist initialValue={['bar']} value="foo" onFocus={onFocus} onChange={onChange} onBlur={onBlur} />);

        // Focus
        act(() => simulateFocus(wrapper.find('input')));

        expect(focusedValue).toEqual(['bar']);

        // Check
        act(() => simulateChange(wrapper.find('input'), { value: 'foo' }));

        expect(changedValue).toEqual(['bar', 'foo']);

        wrapper.update();

        expect(wrapper.find('input').props().checked).toStrictEqual(true);

        // Uncheck
        act(() => simulateChange(wrapper.find('input'), { value: 'foo' }));

        expect(changedValue).toEqual(['bar']);

        wrapper.update();

        expect(wrapper.find('input').props().checked).toStrictEqual(false);

        // Blur
        act(() => simulateBlur(wrapper.find('input')));

        expect(blurredValue).toEqual(['bar']);

        wrapper.update();

        expect(wrapper.find('input').props().checked).toStrictEqual(false);
    });
});

describe('select', () => {
    it('should handle focus, change and blur events', () => {
        let focusedValue = null;

        const onFocus = (value: any) => {
            focusedValue = value;
        };

        let changedValue = null;

        const onChange = (value: any) => {
            changedValue = value;
        };

        let blurredValue = null;

        const onBlur = (value: any) => {
            blurredValue = value;
        };

        const wrapper = shallow(<Select values={['foo', 'bar']} initialValue={'foo'} onFocus={onFocus} onChange={onChange} onBlur={onBlur} />);

        // Focus
        act(() => simulateFocus(wrapper.find('select')));

        expect(focusedValue).toEqual('foo');

        // Change
        act(() => simulateChange(wrapper.find('select'), { value: 1 }));

        expect(changedValue).toEqual('bar');

        wrapper.update();

        // Blur
        act(() => simulateBlur(wrapper.find('select')));

        expect(blurredValue).toEqual('bar');
    });
});

describe('helper methods', () => {
    let currentState: FormState;

    const state = () => ({
        values: {},
        initialValues: {},
        formattedValues: {},
        touched: {},
        valid: {}
    } as FormState);

    function setState(set: (state: FormState) => FormState) {
        this.state = set(this.state);
    }

    beforeEach(() => {
        currentState = state();
    });

    it('should set a value', () => {
        const form = new FormManager(currentState, setState);

        form.set('foo', 'bar');

        expect(form.values.foo).toBe('bar');
        expect(form.formattedValues.foo).toBeUndefined();
        expect(form.valid.foo).toBeUndefined();
    });

    it('should set and get a parsed value', () => {
        const form = new FormManager(currentState, setState);

        form.setParsedValue('foo.bar', 'test');

        expect(form.getParsedValue('foo.bar')).toBe('test');
        expect(form.hasParsedValue('foo.bar')).toStrictEqual(true);
        expect(form.hasParsedValue('test')).toStrictEqual(false);

        form.setParsedValues({ bar: 'foo' });

        expect(form.getParsedValue('bar')).toBe('foo');
    });

    it('should get and set an initial value', () => {
        currentState = {
            initialValues: { foo: { bar: 'test' } }
        } as FormState;

        const form = new FormManager(currentState, setState);

        expect(form.getInitialValue('foo.bar')).toBe('test');
        expect(form.hasInitialValue('foo.bar')).toStrictEqual(true);
        expect(form.hasInitialValue('test')).toStrictEqual(false);

        form.setInitialValue('foo.bar', '123');

        expect(form.getInitialValue('foo.bar')).toBe('123');

        form.setInitialValues({ bar: 'foo' });

        expect(form.getInitialValue('bar')).toBe('foo');
    });

    it('should set and get a formatted value', () => {
        const form = new FormManager(currentState, setState);

        form.setFormattedValue('foo.bar', 'test');

        expect(form.getFormattedValue('foo.bar')).toBe('test');
        expect(form.hasFormattedValue('foo.bar')).toStrictEqual(true);
        expect(form.hasFormattedValue('test')).toStrictEqual(false);
    });

    it('should set and get a validity', () => {
        const form = new FormManager(currentState, setState);

        form.setValidity('foo.bar', false);

        expect(form.isValid('foo.bar')).toStrictEqual(false);
        expect(form.isValid('test')).toStrictEqual(true);
    });

    it('should set and get a touched status', () => {
        const form = new FormManager(currentState, setState);

        form.setTouched('foo.bar', false);

        expect(form.getTouched('foo.bar')).toStrictEqual(false);
        expect(form.getTouched('test')).toStrictEqual(false);
    });

    it('should determine if a value has changed', () => {
        currentState = {
            values: { foo: 'test', bar: 'foo' },
            initialValues: { foo: 'bar', bar: 'foo' }
        } as FormState;

        const form = new FormManager(currentState, setState);

        expect(form.changed('foo')).toStrictEqual(true);
        expect(form.changed('bar')).toStrictEqual(false);
        expect(form.changed()).toStrictEqual(true);
    });

    it('should prepend a value', () => {
        currentState = {
            values: { foo: ['bar'] },
            formattedValues: { foo: ['bar'] },
            touched: { foo: [true] },
            valid: { foo: [true] }
        } as FormState;

        const form = new FormManager(currentState, setState);

        form.prepend('foo', 'test');

        expect(form.values.foo).toEqual(['test', 'bar']);
        expect(form.formattedValues.foo).toEqual([null, 'bar']);
        expect(form.touched.foo).toEqual([null, true]);
        expect(form.valid.foo).toEqual([null, true]);
    });

    it('should append a value', () => {
        currentState = {
            values: { foo: ['bar'] },
            formattedValues: { foo: ['bar'] },
            touched: { foo: [true] },
            valid: { foo: [true] }
        } as FormState;

        const form = new FormManager(currentState, setState);

        form.append('foo', 'test');

        expect(form.values.foo).toEqual(['bar', 'test']);
        expect(form.formattedValues.foo).toEqual(['bar']);
        expect(form.touched.foo).toEqual([true]);
        expect(form.valid.foo).toEqual([true]);
    });

    it('should move a value up', () => {
        currentState = {
            values: { foo: ['bar', 'test'] },
            formattedValues: { foo: ['bar', 'test'] },
            touched: { foo: [true, false] },
            valid: { foo: [true, false] }
        } as FormState;

        const form = new FormManager(currentState, setState);

        form.moveUp('foo', 1);

        expect(form.values.foo).toEqual(['test', 'bar']);
        expect(form.formattedValues.foo).toEqual(['test', 'bar']);
        expect(form.touched.foo).toEqual([false, true]);
        expect(form.valid.foo).toEqual([false, true]);
    });

    it('should move a value down', () => {
        currentState = {
            values: { foo: ['bar', 'test'] },
            formattedValues: { foo: ['bar', 'test'] },
            touched: { foo: [true, false] },
            valid: { foo: [true, false] }
        } as FormState;

        const form = new FormManager(currentState, setState);

        form.moveDown('foo', 0);

        expect(form.values.foo).toEqual(['test', 'bar']);
        expect(form.formattedValues.foo).toEqual(['test', 'bar']);
        expect(form.touched.foo).toEqual([false, true]);
        expect(form.valid.foo).toEqual([false, true]);
    });

    it('should delete a value', () => {
        currentState = {
            values: { foo: ['bar'] },
            formattedValues: { foo: ['bar'] },
            touched: { foo: [true] },
            valid: { foo: [true] }
        } as FormState;

        const form = new FormManager(currentState, setState);

        form.delete('foo', 0);

        expect(form.values.foo).toEqual([]);
        expect(form.formattedValues.foo).toEqual([]);
        expect(form.touched.foo).toEqual([]);
        expect(form.valid.foo).toEqual([]);

        form.delete('foo');

        expect(form.values.foo).toBeUndefined();
        expect(form.formattedValues.foo).toBeUndefined();
        expect(form.touched.foo).toBeUndefined();
        expect(form.valid.foo).toBeUndefined();
    });

    it('should reset a value', () => {
        currentState = {
            values: { foo: 'bar' },
            formattedValues: { foo: 'bar' },
            initialValues: { foo: 'test' },
            valid: { foo: true },
            touched: { foo: true }
        } as FormState;

        const form = new FormManager(currentState, setState);

        form.reset('foo');

        expect(form.values.foo).toEqual('test');
        expect(form.formattedValues.foo).toBeUndefined();
        expect(form.touched.foo).toBeUndefined();
        expect(form.valid.foo).toBeUndefined();

        form.reset();

        expect(form.values).toEqual(form.initialValues);
        expect(form.formattedValues).toEqual({});
        expect(form.touched).toEqual({});
        expect(form.valid).toEqual({});
    });

    it('should determine if two objects are equal based on a key', () => {
        const form = new FormManager(currentState, setState);

        expect(form.isEqual({ id: 1 }, { id: 1 }, 'id')).toBe(true);
        expect(form.isEqual({ id: 1 }, { id: 2 }, 'id')).toBe(false);
    });
});
