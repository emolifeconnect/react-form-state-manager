import { cloneDeep, get, has, isArray, isEqual, isFunction, isObject, merge, omit, set, unset } from 'lodash';
import { ChangeEvent, ChangeEventHandler, FocusEvent, FocusEventHandler, Key, KeyboardEventHandler, KeyboardEvent } from 'react';

import { basicHandler, fileHandler, InputHandler, numberHandler } from './InputHandlers';

type SetState<T> = React.SetStateAction<T>;
type StateSetter<T> = React.Dispatch<SetState<T>>;

export default class FormManager<T extends object = any> {
    public values = {} as T;
    public initialValues = {} as T;
    public formattedValues: any = {};
    public touched: any = {};
    public valid: any = {};

    constructor(protected state: FormState<T>, protected stateSetter: StateSetter<FormState<T>>) {
        this.copyState(state);
    }

    protected setState(value: SetState<FormState<T>>) {
        const state = isFunction(value) ? value(this.state) : value;

        this.stateSetter(state);

        this.copyState(state);
    }

    protected copyState(state: FormState<T>) {
        this.values = state.values;
        this.formattedValues = state.formattedValues;
        this.initialValues = state.initialValues;
        this.valid = state.valid;
        this.touched = state.touched;
    }

    public text(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'text';

        return this.input(options);
    }

    public password(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'password';

        return this.input(options);
    }

    public number(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'number';
        options.inputHandler = merge({}, numberHandler, options.inputHandler);

        return this.input(options);
    }

    public email(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'email';

        return this.input(options);
    }

    public url(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'url';

        return this.input(options);
    }

    public color(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'color';

        return this.input(options);
    }

    public date(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'date';

        return this.input(options);
    }

    public datetimeLocal(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'datetime-local';

        return this.input(options);
    }

    public month(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'month';

        return this.input(options);
    }

    public search(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'search';

        return this.input(options);
    }

    public tel(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'tel';

        return this.input(options);
    }

    public time(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'time';

        return this.input(options);
    }

    public week(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'week';

        return this.input(options);
    }

    protected input(options: InputOptions ): InputProps {
        options.inputHandler = merge({}, basicHandler, options.inputHandler);

        return {
            type: options.type,
            name: options.name,
            value: this.getInputValue(options.name, options.inputHandler),
            onChange: this.inputChangeHandler(options),
            onFocus: this.basicFocusHandler(options),
            onBlur: this.inputBlurHandler(options),
            onKeyDown: this.inputKeyDownHandler(options),
        };
    }

    public textarea(name: string, options: TextareaOptions = {}): TextareaProps {
        options.name = name;
        options.inputHandler = merge({}, basicHandler, options.inputHandler);

        return {
            name,
            value: this.getInputValue(name, options.inputHandler),
            onChange: this.inputChangeHandler(options),
            onFocus: this.basicFocusHandler(options),
            onBlur: this.inputBlurHandler(options)
        };
    }

    protected getInputValue(name: string, inputHandler: InputHandler): string {
        let value = null;

        if (this.hasFormattedValue(name)) {
            value = this.getFormattedValue(name);
        } else if (this.hasParsedValue(name)) {
            value = inputHandler.format(this.getParsedValue(name))
        }

        if (this.isEmpty(value)) {
            value = '';
        }


        return value;
    }

    public file(name: string, options: InputOptions = {}): InputProps {
        options.name = name;
        options.type = 'file';
        options.inputHandler = merge({}, fileHandler, options.inputHandler);

        return {
            type: 'file',
            name,
            onChange: this.fileChangeHandler(options),
            onFocus: this.basicFocusHandler(options),
            onBlur: this.basicBlurHandler(options)
        };
    }

    protected inputChangeHandler({ inputHandler, onChange }: InputOptions | TextareaOptions): ChangeEventHandler {
        return (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
            let { name, value, required } = event.target;

            value = inputHandler.filter(value);

            const parsedValue = inputHandler.parse(value);
            const valueIsEmpty = this.isEmpty(value);
            const valid = event.target.checkValidity() && ((valueIsEmpty && !required) || (!valueIsEmpty && inputHandler.validate(parsedValue)));

            if (onChange) {
                onChange(parsedValue, event);
            }

            this.setParsedValue(name, parsedValue);
            this.setFormattedValue(name, value);
            this.setValidity(name, valid);
        };
    }

    protected basicFocusHandler({ onFocus }: InputOptions | TextareaOptions): FocusEventHandler {
        return (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name } = event.target;

            const parsedValue = this.getParsedValue(name);

            if (onFocus) {
                onFocus(parsedValue, event);
            }
        };
    }

    protected basicBlurHandler({ onBlur }: InputOptions): FocusEventHandler {
        return (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name } = event.target;

            this.setTouched(name, true);

            if (onBlur) {
                onBlur(this.getParsedValue(name), event);
            }
        };
    }

    protected inputBlurHandler({ inputHandler, onBlur }: InputOptions | TextareaOptions): FocusEventHandler {
        return (event: FocusEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
            const { name } = event.target;

            const parsedValue = this.getParsedValue(name);
            const formattedValue = !this.isEmpty(parsedValue) ? inputHandler.format(parsedValue) : null;

            this.setFormattedValue(name, formattedValue);
            this.setTouched(name, true);

            if (onBlur) {
                onBlur(parsedValue, event);
            }
        };
    }

    protected inputKeyDownHandler({ name }: InputOptions): KeyboardEventHandler {
        return ({ key }: KeyboardEvent<HTMLInputElement>) => {
            if (key === 'Enter'){
                this.setTouched(name, true);
            }
        };
    }

    protected fileChangeHandler({ inputHandler, onChange }: InputOptions): ChangeEventHandler {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const { name, files } = event.target;

            const valueIsEmpty = files.length == 0;
            const valid = event.target.checkValidity() && (valueIsEmpty || inputHandler.validate(files));
            const file = !valueIsEmpty && valid ? inputHandler.parse(files) : null;

            this.setParsedValue(name, file);
            this.setValidity(name, valid);

            if (onChange) {
                onChange(file, event);
            }
        };
    }

    public checkbox(name: string, { onChange, onFocus, onBlur }: CheckboxOptions = {}): CheckboxProps {
        const checked = !!this.getParsedValue(name);

        return {
            type: 'checkbox',
            name,
            checked,
            onChange: this.checkboxChangeHandler({ onChange }),
            onFocus: this.basicFocusHandler({ onFocus }),
            onBlur: this.basicBlurHandler({ onBlur })
        };
    }

    protected checkboxChangeHandler({ onChange }: CheckboxOptions = {}): ChangeEventHandler {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const { name } = event.target;

            const checked = !this.getParsedValue(name);

            this.setParsedValue(name, checked);
            this.setTouched(name, true);
            this.setValidity(name, true);

            if (onChange) {
                onChange(checked, event);
            }
        };
    }

    public radio(name: string, value: any, { key, onChange, onFocus, onBlur }: RadioOptions = {}): RadioProps {
        return {
            type: 'radio',
            name,
            checked: this.isEqual(this.getParsedValue(name), value, key),
            onChange: this.radioChangeHandler({ value, onChange }),
            onFocus: this.basicFocusHandler({ onFocus }),
            onBlur: this.basicBlurHandler({ onBlur })
        };
    }

    protected radioChangeHandler({ value, onChange }: RadioOptions = {}): ChangeEventHandler {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const { name } = event.target;

            this.setParsedValue(name, value);
            this.setTouched(name, true);
            this.setValidity(name, true);

            if (onChange) {
                onChange(value, event);
            }
        };
    }

    public checklist(name: string, value: any, { key, onChange, onFocus, onBlur }: ChecklistOptions = {}): CheckboxProps {
        return {
            type: 'checkbox',
            name,
            checked: this.contains(this.getParsedValue(name) || [], value, key),
            onChange: this.checklistChangeHandler({ value, key, onChange }),
            onFocus: this.basicFocusHandler({ onFocus }),
            onBlur: this.basicBlurHandler({ onBlur })
        };
    }

    protected checklistChangeHandler({ value, key, onChange }: ChecklistOptions = {}): ChangeEventHandler {
        return (event: ChangeEvent<HTMLInputElement>) => {
            const { name } = event.target;

            const list = cloneDeep(this.getParsedValue(name)) || [];
            const index = this.findIndex(list, value, key);

            if (index > -1) {
                this.delete(name, index);
                list.splice(index, 1);
            } else {
                this.append(name, value);
                list.push(value);
            }

            this.setTouched(name, true);
            this.setValidity(name, true);

            if (onChange) {
                onChange(list, event);
            }
        };
    }

    public select(name: string, options?: any[], { key, onChange, onFocus, onBlur }: SelectOptions = {}): SelectProps {
        const value = this.getParsedValue(name);

        return {
            name,
            value: options ? this.findIndex(options, value, key) : value,
            onChange: this.selectChangeHandler({ options, onChange }),
            onFocus: this.basicFocusHandler({ onFocus }),
            onBlur: this.basicBlurHandler({ onBlur })
        };
    }

    protected selectChangeHandler({ options, onChange }: SelectOptions = {}): ChangeEventHandler {
        return (event: ChangeEvent<HTMLSelectElement>) => {
            const { name, value } = event.target;

            const parsedValue = options ? options[parseInt(value) || 0] : value;

            this.setParsedValue(name, parsedValue);
            this.setValidity(name, true);

            if (onChange) {
                onChange(parsedValue, event);
            }
        };
    }

    public option(value: string | string[] | number): OptionProps {
        return {
            value,
            key: value + ''
        };
    }

    public get(name?: string | null): any {
        return this.getParsedValue(name);
    }

    public set(name?: string | SetState<T> | null, value?: SetState<any>): void {
        this.setState((state) => {
            if (isObject(name) || isFunction(name)) {
                return {
                    ...state,
                    values: isFunction(name) ? name(state.values) : name,
                    formattedValues: {},
                    valid: {},
                };
            } else if (name) {
                return {
                    ...state,
                    values: set(
                        { ...state.values },
                        name,
                        isFunction(value) ? value(get(state.values, name)) : value
                    ),
                    formattedValues: omit(state.formattedValues, name),
                    valid: omit(state.valid, name),
                };
            }

            return {
                ...state,
                values: isFunction(value) ? value(state.values) : value,
                formattedValues: {},
                valid: {},
            };
        });
    }

    public getParsedValue(name?: string | null): any {
        if (name) {
            return get(this.values, name, null);
        }

        return this.values;
    }

    public hasParsedValue(name: string): boolean {
        return this.getParsedValue(name) !== null;
    }

    public setParsedValue(name: string, value: SetState<any>): void {
        this.setState((state) => {
            return {
                ...state,
                values: set(
                    state.values,
                    name,
                    isFunction(value) ? value(get(state.values, name)) : value,
                )
            };
        });
    }

    public setParsedValues(values: SetState<T>): void {
        this.setState((state) => {
            return {
                ...state,
                values: isFunction(values) ? values(state.values) : values
            };
        });
    }

    public getInitialValue(name: string): any {
        return get(this.initialValues, name, null);
    }

    public hasInitialValue(name: string): boolean {
        return this.getInitialValue(name) !== null;
    }

    public setInitialValue(name: string, value: SetState<any>): void {
        this.setState((state) => {
            return {
                ...state,
                initialValues: set(
                    state.initialValues,
                    name,
                    isFunction(value) ? value(get(state.initialValues, name)) : value
                )
            };
        });
    }

    public setInitialValues(values: SetState<T>): void {
        this.setState((state) => {
            return {
                ...state,
                initialValues: isFunction(values) ? values(state.initialValues) : values
            };
        });
    }

    public getFormattedValue(name: string): string {
        return get(this.formattedValues, name, null);
    }

    public hasFormattedValue(name: string): boolean {
        return this.getFormattedValue(name) !== null;
    }

    public setFormattedValue(name: string, value: SetState<any>): void {
        this.setState((state) => {
            return {
                ...state,
                formattedValues: set(
                    state.formattedValues,
                    name,
                    isFunction(value) ? value(get(state.formattedValues, name)) : value,
                )
            };
        });
    }

    public setFormattedValues(values: SetState<T>): void {
        this.setState((state) => {
            return {
                ...state,
                formattedValues: isFunction(values) ? values(state.formattedValues) : values
            };
        });
    }

    public isValid(name?: string): boolean {
        if (typeof name != 'undefined') {
            return get(this.valid, name) || !has(this.valid, name);
        }

        return this.everythingIsValid();
    }

    protected everythingIsValid(value: any = this.valid) {
        let valid = true;

        if (isObject(value)) {
            Object.keys(value).map(key => {
                if (valid) {
                    valid = this.everythingIsValid((value as any)[key]);
                }
            });
        } else if (value !== true) {
            valid = false;
        }

        return valid;
    }

    public setValidity(name: string, valid: SetState<boolean>): void {
        this.setState((state) => {
            return {
                ...state,
                valid: set(
                    state.valid,
                    name,
                    isFunction(valid) ? valid(get(state.valid, name)) : valid,
                )
            };
        });
    }

    public getTouched(name: string): boolean {
        return get(this.touched, name, false);
    }

    public setTouched(name: string, touched: SetState<boolean>): void {
        this.setState((state) => {
            return {
                ...state,
                touched: set(
                    state.touched,
                    name,
                    isFunction(touched) ? touched(get(state.touched, name)) : touched,
                )
            };
        });
    }

    public changed(name?: string): boolean {
        if (typeof name != 'undefined') {
            return !this.isEqual(this.getParsedValue(name), this.getInitialValue(name));
        }

        return !this.isEqual(this.initialValues || {}, this.values || {});
    }

    public prepend(name: string, value: any): void {
        this.setState((state) => {
            return {
                ...state,
                values: set(state.values, name, [value, ...get(state.values, name, [])]),
                formattedValues: set(state.formattedValues, name, [null, ...get(state.formattedValues, name, [])]),
                touched: set(state.touched, name, [null, ...get(state.touched, name, [])]),
                valid: set(state.valid, name, [null, ...get(state.valid, name, [])])
            };
        });
    }

    public append(name: string, value: any): void {
        this.setState((state) => {
            return {
                ...state,
                values: set(state.values, name, [...get(state.values, name, []), value]),
            };
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

    public swap(first: string, second: string): void {
        this.setState((state) => {
            const value = get(state.values, first);
            const formattedValue = get(state.formattedValues, first);
            const touched = get(state.touched, first);
            const valid = get(state.valid, first);

            set(state.values, first, get(state.values, second));
            set(state.formattedValues, first, get(state.formattedValues, second));
            set(state.touched, first, get(state.touched, second));
            set(state.valid, first, get(state.valid, second));

            set(state.values, second, value);
            set(state.formattedValues, second, formattedValue);
            set(state.touched, second, touched);
            set(state.valid, second, valid);

            return { ...state };
        });
    }

    public splice(name: string, index: number, count: number): void {
        this.setState((state) => {
            const lists = [
                get(state.values, name),
                get(state.formattedValues, name),
                get(state.touched, name),
                get(state.valid, name)
            ];

            lists.map((list: any) => {
                if (isArray(list)) {
                    list.splice(index, count);
                }
            });

            return { ...state };
        });
    }

    public delete(name: string, index?: number): void {
        if (typeof index != 'undefined') {
            this.splice(name, index, 1);
        } else {
            this.setState((state) => {
                unset(state.values, name);
                unset(state.formattedValues, name);
                unset(state.touched, name);
                unset(state.valid, name);

                return { ...state };
            });
        }
    }

    public reset(name?: string): void {
        this.setState((state) => {
            if (typeof name == 'undefined') {
                // Reset entire state
                return {
                    ...state,
                    values: cloneDeep(this.initialValues),
                    formattedValues: {},
                    touched: {},
                    valid: {}
                };
            }

            // Reset single value
            set(state.values, name, cloneDeep(get(state.initialValues, name, null)));
            unset(state.formattedValues, name);
            unset(state.touched, name);
            unset(state.valid, name);

            return { ...state };
        });
    }

    public isEqual(a: any, b: any, key?: string | number): boolean {
        if (typeof key != 'undefined' && a !== null && b !== null) {
            return isEqual(a[key], b[key]);
        }

        return isEqual(a, b);
    }

    public findIndex(list: any[], value: any, key?: string | number): number {
        let index = -1;

        list.map((item: any, i: number) => {
            if (this.isEqual(item, value, key)) {
                index = i;
            }
        });

        return index;
    }

    public contains(list: any[], value: any, key?: string | number): boolean {
        return this.findIndex(list, value, key) > -1;
    }

    public isEmpty(value: any): boolean {
        return typeof value == 'undefined' || value === '' || value === null;
    }
}

export interface FormState<T=any> {
    values: T;
    initialValues: T;
    formattedValues: any;
    touched: any;
    valid: any;
}

export interface InputOptions<T=any> {
    type?: string;
    name?: string;
    inputHandler?: InputHandler<T>;
    onChange?: (value: T | null, event: ChangeEvent) => any;
    onFocus?: (value: T | null, event: FocusEvent) => any;
    onBlur?: (value: T | null, event: FocusEvent) => any;
}

export interface CheckboxOptions<T=any> {
    onChange?: (value: T | null, event: ChangeEvent) => any;
    onFocus?: (value: T | null, event: FocusEvent) => any;
    onBlur?: (value: T | null, event: FocusEvent) => any;
}

export interface RadioOptions<T=any> extends CheckboxOptions {
    value?: T;
    key?: string | number;
}

export interface ChecklistOptions<T=any> extends CheckboxOptions {
    value?: T;
    key?: string | number;
}

export interface TextareaOptions {
    name?: string;
    inputHandler?: InputHandler<string>;
    onChange?: (value: string, event: ChangeEvent) => any;
    onFocus?: (value: string, event: FocusEvent) => any;
    onBlur?: (value: string, event: FocusEvent) => any;
}

export interface SelectOptions<T=any> {
    options?: T[];
    key?: string | number;
    onChange?: (value: T | null, event: ChangeEvent) => any;
    onFocus?: (value: T | null, event: FocusEvent) => any;
    onBlur?: (value: T | null, event: FocusEvent) => any;
}

export interface InputProps {
    type: string;
    name: string;
    value?: string | string[] | number;
    onChange: ChangeEventHandler<HTMLInputElement>;
    onFocus: FocusEventHandler<HTMLInputElement>;
    onBlur: FocusEventHandler<HTMLInputElement>;
    onKeyDown?: KeyboardEventHandler<HTMLInputElement>;
}

export interface CheckboxProps extends InputProps {
    type: 'checkbox';
    checked: boolean;
}

export interface RadioProps extends InputProps {
    type: 'radio';
    checked: boolean;
}

export interface ChecklistProps extends InputProps {
    type: 'checkbox';
    checked: boolean;
}

export interface TextareaProps {
    name: string;
    value: string | string[] | number;
    onChange: ChangeEventHandler<HTMLTextAreaElement>;
    onFocus: FocusEventHandler<HTMLTextAreaElement>;
    onBlur: FocusEventHandler<HTMLTextAreaElement>;
}

export interface SelectProps {
    name: string;
    value: string | string[] | number;
    onChange: ChangeEventHandler<HTMLSelectElement>;
    onFocus: FocusEventHandler<HTMLSelectElement>;
    onBlur: FocusEventHandler<HTMLSelectElement>;
}

export interface OptionProps {
    value: string | string[] | number;
    key: Key;
}
