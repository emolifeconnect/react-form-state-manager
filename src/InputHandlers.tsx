export interface InputHandler<T=any> {
    parse?: (value: any) => T;
    format?: (value: T) => any;
    validate?: (value: any) => boolean;
}

export const textHandler: InputHandler<string> = {
    parse: value => {
        return value + '';
    },
    format: value => {
        return value + '';
    },
    validate: (value) => {
        return true;
    }
};

export const floatHandler: InputHandler<number> = {
    parse: value => {
        return parseFloat(value);
    },
    format: value => {
        return value + '';
    },
    validate: (value) => {
        return !isNaN(parseFloat(value));
    }
};
