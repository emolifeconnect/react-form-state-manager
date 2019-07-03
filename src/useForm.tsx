import { cloneDeep, isArray } from 'lodash';
import { useState } from 'react';

import FormManager, { FormState } from './FormManager';

export interface UseFormOptions {
    values?: any[] | object;
}

export interface InitialFormState {
    values?: any;
    initialValues?: any;
    formattedValues?: any;
    touched?: any;
    valid?: any;
}

const useForm = (initialState: InitialFormState = {}) => {
    const emptyValue = () => isArray(initialState.values) ? [] : {};

    const defaultState: FormState = {
        values: cloneDeep(initialState.values) || emptyValue(),
        initialValues: cloneDeep(initialState.initialValues || initialState.values) || emptyValue(),
        formattedValues: emptyValue(),
        touched: emptyValue(),
        valid: emptyValue()
    };

    const [state, setState] = useState(defaultState);

    return new FormManager(state, setState);
};

export default useForm;
