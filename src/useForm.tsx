import { cloneDeep } from 'lodash';
import { useState } from 'react';

import FormManager, { FormState } from './FormManager';

export interface UseFormOptions {
    values?: any;
}

export interface Error {
    [rule: string]: any[];
}

const useForm = (options: UseFormOptions = {}) => {
    const defaultState: FormState = {
        values: cloneDeep(options.values),
        initialValues: cloneDeep(options.values) || {},
        formattedValues: {},
        valid: {}
    };

    const [state, setState] = useState({ ...defaultState });

    return new FormManager(state, setState);
};

export default useForm;
