import { cloneDeep, isArray } from 'lodash';
import { useState, useRef } from 'react';

import FormManager, { FormState } from './FormManager';

export interface UseFormOptions<T> {
    values?: T;
}

export interface InitialFormState<T> {
    values?: T;
    initialValues?: T;
    formattedValues?: any;
    touched?: any;
    valid?: any;
}

function useForm<T extends object = any>(initialState: InitialFormState<T> = {}) {
    const emptyValue = () => isArray(initialState.values) ? [] : {};

    const defaultState: FormState<T> = {
        values: cloneDeep(initialState.values) || emptyValue() as T,
        initialValues: cloneDeep(initialState.initialValues || initialState.values) || emptyValue() as T,
        formattedValues: initialState.formattedValues || emptyValue(),
        touched: initialState.touched || emptyValue(),
        valid: initialState.valid || emptyValue()
    };

    const [state, setState] = useState(defaultState);

    return new FormManager(state, setState);
}

export default useForm;
