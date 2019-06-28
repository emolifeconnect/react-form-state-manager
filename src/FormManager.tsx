import { cloneDeep, get, has, isEqual, merge, set, unset } from 'lodash';
import {
    ChangeEvent, ChangeEventHandler, DetailedHTMLProps, FocusEvent, FocusEventHandler, InputHTMLAttributes
} from 'react';

import { floatHandler, InputHandler, textHandler } from './InputHandlers';

type InputProps = DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export default class FormManager {
    public values: any = {};
    public formattedValues: any = {};
    public valid: any = {};

    constructor(protected state: FormState, protected setState: any) {
        this.values = state.values;
        this.formattedValues = state.formattedValues;
        this.valid = state.valid;
    }

    public text(name: string, options: FieldOptions = {}): InputProps {
        options.name = name;
        options.type = 'text';
        options.inputHandler = textHandler;

        return this.field(options);
    }

    public password(name: string, options: FieldOptions = {}): InputProps {
        options.name = name;
        options.type = 'password';
        options.inputHandler = textHandler;

        return this.field(options);
    }

    public number(name: string, options: FieldOptions = {}): InputProps {
        options.name = name;
        options.type = 'number';
        options.inputHandler = floatHandler;

        return this.field(options);
    }

    public email(name: string, options: FieldOptions = {}): InputProps {
        options.name = name;
        options.type = 'email';
        options.inputHandler = textHandler;

        return this.field(options);
    }

    public url(name: string, options: FieldOptions = {}): InputProps {
        options.name = name;
        options.type = 'url';
        options.inputHandler = textHandler;

        return this.field(options);
    }

    public field({ type, name, onChange, onFocus, onBlur, inputHandler }: FieldOptions ): InputProps {
        inputHandler = merge({}, textHandler, inputHandler);

        let formattedValue = null;

        if (this.hasFormattedValue(name)) {
            formattedValue = this.getFormattedValue(name);
        } else if (this.hasParsedValue(name)) {
            formattedValue = inputHandler.format(this.getParsedValue(name))
        }

        if (this.isEmpty(formattedValue)) {
            formattedValue = '';
        }

        return {
            type,
            name,
            value: formattedValue,
            onChange: this.basicChangeHandler(inputHandler, { onChange }),
            onFocus: this.basicFocusHandler(inputHandler, { onFocus }),
            onBlur: this.basicBlurHandler(inputHandler, { onBlur })
        };
    }

    protected basicChangeHandler(inputHandler: InputHandler, { onChange }: FieldOptions) {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const { name, value } = event.target;

            const valueIsEmpty = this.isEmpty(value);
            const valid = event.target.checkValidity() && (valueIsEmpty || inputHandler.validate(value));
            const parsedValue = !valueIsEmpty && valid ? inputHandler.parse(value) : null;

            this.setParsedValue(name, parsedValue);
            this.setFormattedValue(name, value);
            this.setValidity(name, valid);

            if (onChange && parsedValue != this.getParsedValue(name)) {
                onChange(parsedValue);
            }
        }
    }

    protected basicFocusHandler(inputHandler: InputHandler, { onFocus }: FieldOptions) {
        return (event: FocusEvent<HTMLInputElement>) => {
            const { name } = event.target;

            const parsedValue = this.getParsedValue(name);

            if (onFocus) {
                onFocus(parsedValue);
            }
        }
    }

    protected basicBlurHandler(inputHandler: InputHandler, { onBlur }: FieldOptions) {
        return (event: FocusEvent<HTMLInputElement>) => {
            const { name } = event.target;

            const parsedValue = this.getParsedValue(name);
            const formattedValue = !this.isEmpty(parsedValue) ? inputHandler.format(parsedValue) : null;

            this.setFormattedValue(name, formattedValue);

            if (onBlur) {
                onBlur(parsedValue);
            }
        }
    }

    public setValue(name: string, value: any): void {
        this.setParsedValue(name, value);
        this.setFormattedValue(name, null);
    }

    public getParsedValue(name: string) {
        return get(this.state.values, name);
    }

    public hasParsedValue(name: string) {
        return has(this.state.values, name);
    }

    public setParsedValue(name: string, value: any) {
        this.setState((state: FormState) => {
            return {
                ...state,
                values: set(state.values, name, value)
            } as FormState;
        });
    }

    public getInitialValue(name: string) {
        return get(this.state.initialValues, name, null);
    }

    public hasInitialValue(name: string) {
        return has(this.state.initialValues, name);
    }

    public getFormattedValue(name: string) {
        return get(this.state.formattedValues, name);
    }

    public hasFormattedValue(name: string) {
        return has(this.state.formattedValues, name);
    }

    public setFormattedValue(name: string, value: any) {
        this.setState((state: FormState) => {
            return {
                ...state,
                formattedValues: set(state.formattedValues, name, value)
            } as FormState;
        });
    }

    public isValid(name: string) {
        return get(this.state.valid, name);
    }

    public setValidity(name: string, valid: boolean) {
        this.setState((state: FormState) => {
            return {
                ...state,
                valid: set(state.valid, name, valid)
            } as FormState;
        });
    }

    public touched(name: string) {
        return has(this.state.formattedValues, name);
    }

    public changed(name?: string): boolean {
        return !isEqual(this.getParsedValue(name), this.getInitialValue(name));
    }

    public set(name: string, value: any): void {
        this.setState((state: FormState) => {
            set(state.values, name, value);
            unset(state.formattedValues, name);
            set(state.valid, name, true);

            return { ...state };
        });
    }

    public prepend(name: string, value: any): any {
        this.setState((state: FormState) => {
            set(state.values, name, [value, ...get(state.values, name, [])]);
            set(state.formattedValues, name, [null, ...get(state.formattedValues, name, [])]);
            set(state.valid, name, [null, ...get(state.valid, name, [])]);

            return { ...state };
        });
    }

    public append(name: string, value: any): any {
        this.setState((state: FormState) => {
            set(state.values, name, [...get(state.values, name, []), value]);

            return { ...state };
        });
    }

    public moveUp(name: string, index: number): void {
        const prefix = name ? name + '.' : '';

        this.swap(`${prefix}${index}`, `${prefix}${index - 1}`);
    }

    public moveDown(name: string, index: number): void {
        const prefix = name ? name + '.' : '';

        this.swap(`${prefix}${index}`, `${prefix}${index + 1}`);
    }

    public swap(first: string, second: string): any {
        this.setState((state: FormState) => {
            const value = get(state.values, first);
            const formattedValue = get(state.formattedValues, first);
            const valid = get(state.valid, first);

            set(state.values, first, get(state.values, second));
            set(state.formattedValues, first, get(state.formattedValues, second));
            set(state.valid, first, get(state.valid, second));

            set(state.values, second, value);
            set(state.formattedValues, second, formattedValue);
            set(state.valid, second, valid);

            return { ...state };
        });
    }

    public splice(name: string, index: number, count: number): void {
        this.setState((state: FormState) => {
            get(state.values, name, []).splice(index, count);
            get(state.formattedValues, name, []).splice(index, count);
            get(state.valid, name, []).splice(index, count);

            return { ...state };
        });
    }

    public delete(name: string, index?: number): void {
        if (typeof index != 'undefined') {
            this.splice(name, index, 1);
        } else {
            this.setState((state: FormState) => {
                unset(state.values, name);
                unset(state.formattedValues, name);
                unset(state.valid, name);

                return { ...state };
            });
        }
    }

    public reset(name?: string): void {
        this.setState((state: FormState) => {
            if (typeof name == 'undefined') {
                // Reset entire state
                return {
                    ...state,
                    values: cloneDeep(this.state.initialValues),
                    formattedValues: {},
                    valid: {}
                };
            }

            // Reset single value
            set(state.values, name, cloneDeep(get(state.initialValues, name, null)));
            unset(state.formattedValues, name);
            unset(state.valid, name);

            return { ...state };
        })
    }

    public getState(): FormState {
        return this.state;
    }

    protected isEmpty(value: any): boolean {
        return typeof value == 'undefined' || value === '' || value === null;
    }
}

export interface FieldProps extends InputProps {
    type: string;
    name: string;
    value: string;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onFocus: FocusEventHandler<HTMLInputElement>;
    onBlur: FocusEventHandler<HTMLInputElement>;
}

export interface FormState {
    values: any;
    initialValues: any;
    formattedValues: any;
    valid: any;
}

export interface FieldOptions<T=any> {
    type?: string;
    name?: string;
    onChange?: (value: T | null) => any;
    onFocus?: (value: T | null) => any;
    onBlur?: (value: T | null) => any;
    inputHandler?: InputHandler<T>;
}
