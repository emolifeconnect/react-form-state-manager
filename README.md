# React form state manager

React hook for managing (nested) form states. This package aims to be unopinionated and contains no components, fetch wrappers, error handling, etc., just functionality that makes form state management easier.

## Features 🔥

- No components, just a hook: `useForm()`.
- Conveniently edit nested objects/arrays using dot notation: ``<input {...form.text(`products.${index}.title`)} />``.
- Powerful input pipeline allows you to separate formatting and internal state representation. For example, input value '10' can be displayed to the user as '€ 10.00' and be represented as `1000` cents in the state.
- Comes with utility methods that cover many common use cases, like `set`, `append`, `prepend`, `moveUp`, `moveDown`, `delete`, `reset` and more.

## Installation

```
npm i react-form-state-manager
```

## Basic example

```jsx
import { useForm } from 'react-form-state-manager';

const ProductForm = () => {
    const form = useForm({
        values: {
            title: 'React'
        }
    });

    return <form>
        <input {...form.text('title')} required />
        <div>You entered: {form.values.title}</div>
        <div>The value you entered is {form.valid.title ? 'valid' : 'invalid'}</div>
    </form>
};
```

## Field types

### Basic inputs

Support for HTML5 input types.

```tsx
<input {...form.text('name')} />
<input {...form.password('name')} />
<input {...form.number('name')} />
<input {...form.email('name')} />
<input {...form.url('name')} />
<input {...form.color('name')} />
<input {...form.date('name')} />
<input {...form.month('name')} />
<input {...form.search('name')} />
<input {...form.tel('name')} />
<input {...form.time('name')} />
<input {...form.week('name')} />
<input {...form.file('name')} />
```

### Textarea

```tsx
<textarea {...form.textarea('content')}></textarea>
```

### Select

Optionally supply a `key` to perform efficient object comparison.

```tsx
<select {...form.select('category', categories, { key: 'id' })}>
    {categories.map((category: any, index: number) => (
        <option {...form.option(index)}>{category.title}</option>
    ))}
</select>

{form.values.category && <div>
    You selected: {form.values.category.title}
</div>}
```

### Radio button

Optionally supply a `key` to perform efficient object comparison.

```tsx
{categories.map((category) => (
    <span key={category.id}>
        <input {...form.radio('category', category, { key: 'id' })} />
        <label>{category.title}</label>
        {' '}
    </span>
))}

{form.values.category && <div>
    You selected: {form.values.category.title}
</div>}
```

### Checkbox

Simple boolean flag.

```tsx
<input {...form.checkbox('subscribe')} />
```

### Checklist

Allow the user to select multiple checkboxes. The values are stored in an array. Optionally supply a `key` to perform efficient object comparison.

```tsx
{categories.map((category) => (
    <span key={category.id}>
        <input {...form.checklist('categories', category, { key: 'id' })} />
        <label>{category.title}</label>
        {' '}
    </span>
))}

{form.values.category && <div>
    You selected {form.values.categories.length} categories
</div>}
```

## Custom fields

The input handler contains a pipeline that applies filters, formatting, parsing and validation. The pipeline is triggered by typing into the input and ends when the field is blurred. It looks as follows:

1. `onChange` event occurs.
2. Received input string is filtered.
3. Filtered string is parsed and stored in the state.
4. State value is validated.
5. `onBlur` event occurs.
6. Displayed input value is formatted.

Create a custom input handler to accomodate your needs:

```tsx
const moneyInput = (rules: any = {}) => {
    return {
        inputHandler: {
            filter: (value) => {
                // Strip everything that is not a digit, period or dash
                return value.match("[0-9\.-]*")[0];
            },
            parse: (value) => {
                // Represent the money amount in cents in the state.
                const floatValue = parseFloat(value);

                return !isNaN(floatValue) ? Math.round(floatValue * 100) : null;
            },
            format: (value) => {
                // Divide internal value by 100 to get euros and add 2 decimals
                return (value / 100).toFixed(2);
            },
            validate: (value) => {
                // Add your custom validation
                return value >= rules.min;
            }
        },
        onChange: (value) => {
            console.log(`Look, the state value (${value}) is represented in cents!`);
        }
    };
};
```

... and use it as follows:

```tsx
<input {...form.text('amount', moneyInput({ min: 0 }))} required />
```

Similar input handlers can be defined for date, time and other inputs when needed.

## Extended example

Extended example form in which a product with nested properties can be edited.

See https://github.com/emolifeconnect/react-form-state-manager/blob/master/examples/src/App.tsx.

![Form example](https://www.onecommunity.nl/uploads/form-state-2.png)

```tsx
import React from 'react';
import { useForm, numberHandler, InputHandler } from 'react-form-state-manager';

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
