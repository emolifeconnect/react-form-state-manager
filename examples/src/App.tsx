import React from 'react';

import { floatHandler, InputHandler } from '../../src/InputHandlers';
import useForm from '../../src/useForm';

const moneyInput = (rules: any = {}) => {
    return {
        inputHandler: {
            ...floatHandler,
            parse: (value) => {
                const floatValue = parseFloat(value);

                return !isNaN(floatValue) ? Math.round(floatValue * 100) : null;
            },
            format: (value) => {
                return (value / 100).toFixed(2);
            },
            validate: (value) => {
                return value <= rules.max;
            }
        } as InputHandler<number>
    };
};

const App = () => {
    const form = useForm({
        values: {
            posts: [
            ],
            fruits: [
            ],
        }
    });

    return <form>
        <label>Custom money field</label>
        <input {...form.text('amount', moneyInput({ max: 100000 }))} placeholder="Money" required />
        <button type="button" onClick={() => form.set('amount', 100)}>1 euro</button>
        <button type="button" onClick={() => form.reset('amount')} disabled={!form.changed('amount')}>Reset</button>

        <hr />

        <input {...form.search('search')} placeholder="Search" />

        <hr />

        <textarea {...form.textarea('content')}></textarea>

        <hr />

        <input {...form.file('file', { onChange: console.log })} multiple />

        <hr />

        <input {...form.month('month', { onChange: console.log })} />

        <hr />

        <button type="button" onClick={() => form.prepend('posts', {})}>Prepend</button>

        <hr />

        {form.values.posts.map((post: any, index: number) => <div key={index}>
            <input {...form.text(`posts.${index}.title`)} minLength={3} />
            <button type="button" onClick={() => form.moveUp('posts', index)} disabled={index == 0}>Move up</button>
            <button type="button" onClick={() => form.moveDown('posts', index)} disabled={index == form.values.posts.length - 1}>Move down</button>
            <button type="button" onClick={() => form.delete('posts', index)}>Delete</button>
        </div>)}

        <hr />

        <button type="button" onClick={() => form.append('posts', {})}>Append</button>

        <hr />

        <button type="button" onClick={() => form.reset()}>Reset all</button>

        <hr />

        <input {...form.checkbox('subscribe')} /> Subscribe

        <hr />

        <input {...form.radio('radio', { title: 'foo' })} /> Foo
        <input {...form.radio('radio', { title: 'bar' })} /> Bar

        <button type="button" onClick={() => form.set('radio', 'foo')}>Foo</button>

        <hr />

        <input {...form.checklist('fruits', { title: 'apple' }, { key: 'title' })} /> Apple
        <input {...form.checklist('fruits', { title: 'banana' }, { key: 'title' })} /> Banana
        <input {...form.checklist('fruits', { title: 'orange' }, { key: 'title' })} /> Orange

        <hr />

        <select {...form.select('device', [null, { type: 'phone' }, { type: 'desktop' }])}>
            <option {...form.option(0)}></option>
            <option {...form.option(1)}>Phone</option>
            <option {...form.option(2)}>Desktop</option>
        </select>

        <hr />

        <pre>
            {JSON.stringify(form.values, null, 2)}
        </pre>

        <pre>
            {JSON.stringify(form.valid, null, 2)}
        </pre>
    </form>
}

export default App;
