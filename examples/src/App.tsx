import React from 'react';

import { InputHandler, numberHandler } from '../../src/InputHandlers';
import useForm from '../../src/useForm';

// Custom input handler that converts euros to cents internally, and nicely formats the amount externally.
const moneyInput = (rules: any = {}) => {
    return {
        inputHandler: {
            ...numberHandler,
            parse: (value) => {
                // Represent euros in cents
                const floatValue = parseFloat(value);

                return !isNaN(floatValue) ? Math.round(floatValue * 100) : null;
            },
            format: (value) => {
                // Divide internal value by 100 to get euros and add 2 decimals
                return (value / 100).toFixed(2);
            },
            validate: (value) => {
                return value >= rules.min;
            }
        } as InputHandler<number>
    };
};

const App = () => {
    const categories = [
        {
            id: 1,
            title: 'State management'
        },
        {
            id: 2,
            title: 'Hooks'
        },
        {
            id: 3,
            title: 'Forms'
        }
    ];

    const product = {
        title: 'React form state manager',
        description: 'Description',
        amount: 1000, // 1000 cents = 10 euros
        category: {
            id: 2
        },
        manufacturer: {
            name: 'TypeScript'
        },
        tags: ['react']
    };

    const form = useForm({
        values: product
    });

    return <form>
        <p>
            <label>Title</label><br />
            <input {...form.text('title')} required />
        </p>

        <p>
            <label>Description</label><br />
            <textarea {...form.textarea('description')} required></textarea>
        </p>

        <p>
            <label>Amount</label><br />
            <input {...form.text('amount', moneyInput(0))} required />
        </p>

        <p>
            <label>Manufacturer</label><br />
            <input {...form.text('manufacturer.name')} required />
        </p>

        <p>
            <label>Category</label><br />
            <select {...form.select('category', categories, { key: 'id' })}>
                {categories.map((category: any, index: number) => (
                    <option {...form.option(index)}>{category.title}</option>
                ))}
            </select>
        </p>

        <p>
            <label>Tags</label><br />
            {form.values.tags.map((tag: string, index: number) => <span key={index}>
                <input {...form.text(`tags.${index}`)} required />
                <button type="button" onClick={() => form.delete('tags', index)}>Delete</button>
                <button type="button" onClick={() => form.moveUp('tags', index)} disabled={index == 0}>Move up</button>
                <button type="button" onClick={() => form.moveDown('tags', index)} disabled={index == form.values.tags.length - 1}>Move down</button>
                <br />
            </span>)}

            <button type="button" onClick={() => form.append('tags', '')}>Add</button>
        </p>

        <button type="button" onClick={() => form.reset()}>Reset all</button>

        <button type="submit">Edit product</button>

        <hr />

        <pre>
            {JSON.stringify(form.values, null ,2)}
            <br /><br />
            {JSON.stringify(form.formattedValues, null ,2)}
            <br /><br />
            {JSON.stringify(form.valid, null ,2)}
        </pre>
    </form>
};

export default App;
