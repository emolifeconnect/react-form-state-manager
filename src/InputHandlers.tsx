export interface InputHandler<T=any> {
    filter?: (value: string) => string;
    parse?: (value: any) => T;
    format?: (value: T) => string;
    validate?: (value: T) => boolean;
}

export const basicHandler: InputHandler = {
    filter: value => {
        return value;
    },
    parse: value => {
        return value;
    },
    format: value => {
        return value;
    },
    validate: value => {
        return true;
    }
};

export const floatHandler: InputHandler<number> = {
    filter: value => {
        return value.match("[0-9\.-]*")[0];
    },
    parse: value => {
        const floatValue = parseFloat(value);

        return !isNaN(floatValue) ? floatValue : null;
    },
    format: value => {
        return value + '';
    },
    validate: value => {
        return !isNaN(value);
    }
};

export const fileHandler: InputHandler<File | FileList> = {
    ...basicHandler,
    parse: (files: FileList) => {
        return files.length == 1 ? files[0] : files;
    }
};
