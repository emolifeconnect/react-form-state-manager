import React from 'react';

import { InputHandler, textHandler } from '../../src/InputHandlers';
import useForm from '../../src/useForm';

const moneyInput = (rules: any = {}) => {
    return {
        type: 'text',
        inputHandler: {
            parse: (value) => {
                return Math.round(parseFloat(value) * 100);
            },
            format: (value) => {
                return value !== null ? (value / 100).toFixed(2) : '';
            },
            validate: (value) => {
                value = parseFloat(value);

                return !isNaN(value) && value * 100 <= rules.max;
            }
        } as InputHandler<number>
    };
};

const App = () => {
    const form = useForm({
        values: {
            amount: null,
            posts: [
                { 'title': 'foo' },
                { 'title': 'bar' }
            ]
        }
    });

    return <form>
        <label>Custom money field</label>
        <input {...form.field({ name: 'amount', ...moneyInput({ max: 100000 }) })} placeholder="Money" />
        <button type="button" onClick={() => form.set('amount', 100)}>1 euro</button>
        <button type="button" onClick={() => form.reset('amount')}>Reset</button>

        <hr />

        <button type="button" onClick={() => form.prepend('posts', {})}>Prepend</button>

        <hr />

        {form.values.posts.map((post: any, index: number) => <div key={index}>
            <input {...form.text(`posts.${index}.title`)} minLength={3} />
            <button type="button" onClick={() => form.reset(`posts.${index}`)} disabled={!form.changed(`posts.${index}`)}>Reset</button>
            <button type="button" onClick={() => form.moveUp('posts', index)} disabled={index == 0}>Move up</button>
            <button type="button" onClick={() => form.moveDown('posts', index)} disabled={index == form.values.posts.length - 1}>Move down</button>
            <button type="button" onClick={() => form.delete('posts', index)}>Delete</button>
        </div>)}

        <hr />

        <button type="button" onClick={() => form.append('posts', {})}>Append</button>

        <hr />

        <button type="button" onClick={() => form.reset()}>Reset all</button>

        <hr />

        <pre>
            {JSON.stringify(form.getState(), null, 2)}
        </pre>
    </form>
}

export default App;
