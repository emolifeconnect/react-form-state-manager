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
    const defaultState: FormState = {
        values: cloneDeep(initialState.values),
        initialValues: cloneDeep(initialState.values) || {},
        formattedValues: isArray(initialState.values) ? [] : {},
        touched: isArray(initialState.values) ? [] : {},
        valid: isArray(initialState.values) ? [] : {}
    };

    const [state, setState] = useState(defaultState);

    return new FormManager(state, setState);
};

export default useForm;
