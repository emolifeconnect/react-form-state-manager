# React form state manager

React hook for managing (nested) form states. This package aims to be unopinionated and contains no components, fetch wrappers, error handling, etc., just functionality that makes managing form state easier.

## Features

🔥 Edit nested objects/arrays using dot notation: `<input {...form.text('product.title')} />`

🔥 Utility methods like `append`, `prepend`, `moveUp`, `moveDown`, `delete`, `reset` and more

🔥 Customizable formatting and internal representation (format input value '10' to '€ 10.00' and represent it as `1000` internally)

## Installation

```
npm i react-form-state-manager
```

## Usage

```jsx
import { useForm } from 'react-form-state-manager';

const ProductForm = () => {
    const form = useForm();

    return <form>
        <input {...form.text('title')} />
    </form>
};
```

## Extended example

Extended example form in which a product with nested properties can be edited.

See https://github.com/emolifeconnect/react-form-state-manager/blob/master/examples/src/App.tsx.

```tsx
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
        categories: [] as any,
        manufacturer: {
            name: 'TypeScript'
        },
        tags: ['react'],
        subscribe: true
    };

    const form = useForm({
        values: product
    });

    return <div className="container">
        <form onSubmit={event => event.preventDefault()}>
            <div className="input-group">
                <label className="input-label">Title</label>
                <input {...form.text('title')} required />
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
            <pre>{JSON.stringify(form.valid, null ,2)}</pre>
        </div>
    </div>;
};

export default App;
```

The form state looks as follows

### `form.values`

```json
{
  "title": "React form state manager",
  "description": "Description",
  "amount": 1000,
  "category": {
    "id": 2,
    "title": "Hooks"
  },
  "categories": [],
  "manufacturer": {
    "name": "TypeScript"
  },
  "tags": [
    "react"
  ],
  "subscribe": true
}
```

### `form.formattedValues`

```json
{
  "title": "React form state manager",
  "description": "Description",
  "amount": "10.00",
  "manufacturer": {
    "name": "TypeScript"
  },
  "tags": [
    "react"
  ]
}
```

### `form.valid`

```json
{
  "title": true,
  "description": true,
  "amount": true,
  "manufacturer": {
    "name": true
  },
  "category": true,
  "categories": true,
  "tags": [
    true
  ],
  "subscribe": true
}
```
