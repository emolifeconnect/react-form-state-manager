import React from 'react';

import { InputHandler } from '../../src/InputHandlers';
import useForm from '../../src/useForm';
import CustomField from './CustomField';

// Custom input handler that converts euros to cents internally, and nicely formats the amount externally.
const moneyInput = (rules: any = {}) => {
    return {
        inputHandler: {
            filter: (value) => {
                // Strip everything that is not a digit, period or dash
                return value.match("[0-9\.-]*")[0];
            },
            parse: (value) => {
                // Store the money amount in cents in the state
                const floatValue = parseFloat(value);

                return !isNaN(floatValue) ? Math.round(floatValue * 100) : null;
            },
            format: (value) => {
                // Divide state value by 100 to get euros and add 2 decimals
                return (value / 100).toFixed(2);
            },
            validate: (value) => {
                // Apply our custom validation
                return value >= rules.min;
            }
        } as InputHandler<number>,
        onChange: (value: Number) => {
            console.log(`Look, the state value (${value}) is represented in cents!`);
        }
    };
};

interface Form {
    title: string;
    description: string;
    amount: number;
    category: {
        id: number;
    };
    categories: any[];
    manufacturer: {
        name: string;
    };
    tags: string[];
    subscribe: boolean;
}

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
        categories: [] as any,
        manufacturer: {
            name: 'TypeScript'
        },
        tags: ['react'],
        subscribe: true
    };

    const form = useForm<Form>({
        values: product
    });

    return <div className="container">
        <form onSubmit={event => event.preventDefault()}>
        <div className="input-group">
                <label className="input-label">Title</label>
                <input {...form.text('title')} required />
            </div>

            <div className="input-group">
                <label className="input-label">Custom</label>
                <CustomField onChange={(value) => form.set('title', value)} />
            </div>

            <div className="input-group">
                <label className="input-label">Description</label>
                <textarea {...form.textarea('description')} rows={5} required></textarea>
            </div>

            <div className="input-group">
                <label className="input-label">Amount (min. 0)</label>
                <input {...form.text('amount', moneyInput({ min: 0 }))} required />
            </div>

            <div className="input-group">
                <label className="input-label">Manufacturer</label>
                <input {...form.text('manufacturer.name')} required />
            </div>

            <div className="input-group">
                <label className="input-label">Category</label>
                <select {...form.select('category', categories, { key: 'id' })}>
                    {categories.map((category: any, index: number) => (
                        <option {...form.option(index)}>{category.title}</option>
                    ))}
                </select>
            </div>

            <div className="input-group">
                <label className="input-label">Category</label>
                {categories.map((category: any) => (
                    <span key={category.id}>
                        <input {...form.radio('category', category, { key: 'id' })} id={`category-${category.id}`} />
                        <label htmlFor={`category-${category.id}`}>{category.title}</label>
                        {' '}
                    </span>
                ))}
            </div>

            <div className="input-group">
                <label className="input-label">Categories</label>
                {categories.map((category: any) => (
                    <span key={category.id}>
                        <input {...form.checklist('categories', category, { key: 'id' })} id={`categories-${category.id}`} />
                        <label htmlFor={`categories-${category.id}`}>{category.title}</label>
                        {' '}
                    </span>
                ))}
            </div>

            <div className="input-group">
                <label className="input-label">Tags</label>

                {form.values.tags.map((tag: string, index: number) => <div style={{ marginBottom: '5px' }} key={index}>
                    <input {...form.text(`tags.${index}`)} required />
                    {' '}
                    <button type="button" onClick={() => form.delete('tags', index)}>Delete</button>
                    {' '}
                    <button type="button" onClick={() => form.moveUp('tags', index)} disabled={index == 0}>Move up</button>
                    {' '}
                    <button type="button" onClick={() => form.moveDown('tags', index)} disabled={index == form.values.tags.length - 1}>Move down</button>
                    <br />
                </div>)}
            </div>

            <div className="input-group">
                <button type="button" onClick={() => form.append('tags', '')}>Add tag</button>
            </div>

            <div className="input-group">
                <input {...form.checkbox('subscribe')} id="subscribe" />
                {' '}
                <label htmlFor="subscribe">Newsletter</label>
            </div>

            <button type="button" onClick={() => form.reset()} disabled={!form.changed()}>Reset all</button>
            {' '}
            <button type="submit" disabled={!form.changed()}>Save</button>
        </form>

        <div className="form-state">
            <h3>Internal values</h3>
            <pre>{JSON.stringify(form.values, null, 2)}</pre>

            <h3>Formatted values</h3>
            <pre>{JSON.stringify(form.formattedValues, null, 2)}</pre>

            <h3>Validity</h3>
            <pre>{JSON.stringify(form.valid, null, 2)}</pre>

            <h3>Touched</h3>
            <pre>{JSON.stringify(form.touched, null, 2)}</pre>
        </div>
    </div>;
};

export default App;
