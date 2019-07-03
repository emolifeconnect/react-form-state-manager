# Ract form state manager

React hook for managing (nested) form states. This package aims to be unopinionated and contains no components, fetch wrappers, error handling, etc., just functionality that makes managing form state easier.

Tests coming soon.

# Example

Extended example form in which a product can be edited. 

See https://github.com/emolifeconnect/react-form-state-manager/blob/master/examples/src/App.tsx.

```jsx
// Custom input handler that converts euros to cents internally, and nicely formats the amount externally.
const moneyInput = (rules: any = {}) => {
    return {
        inputHandler: {
            ...floatHandler,
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
    // Possible product categories
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
    
    // The product we want to edit
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

    // Form manager hook
    const form = useForm({
        values: product
    });

    return <form>
        <p>
            <label>Title</label>
            <input {...form.text('title')} required />
        </p>

        <p>
            <label>Description</label>
            <textarea {...form.textarea('description')} required></textarea>
        </p>

        <p>
            <label>Amount</label>
            <input {...form.text('amount', moneyInput(0))} required />
        </p>

        <p>
            <label>Manufacturer</label>
            <input {...form.text('manufacturer.name')} required />
        </p>

        <p>
            <label>Category</label>
            <select {...form.select('category', categories, { key: 'id' })}>
                {categories.map((category: any, index: number) => (
                    <option {...form.option(index)}>{category.title}</option>
                ))}
            </select>
        </p>

        <p>
            <label>Tags</label>
            {form.values.tags.map((tag: string, index: number) => <div key={index}>
                <input {...form.text(`tags.${index}`)} required />
                <button type="button" onClick={() => form.delete('tags', index)}>Delete</button>
                <button type="button" onClick={() => form.moveUp('tags', index)} disabled={index == 0}>Move up</button>
                <button type="button" onClick={() => form.moveDown('tags', index)} disabled={index == form.values.tags.length - 1}>Move down</button>
            </div>)}

            <button type="button" onClick={() => form.append('tags', '')}>Add</button>
        </p>

        <button type="button" onClick={() => form.reset()}>Reset all</button>

        <button type="submit">Edit product</button>
    </form>
};
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
  "manufacturer": {
    "name": "TypeScript"
  },
  "tags": [
    "react"
  ]
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
  "amount": false,
  "category": true,
  "manufacturer": {
    "name": true
  },
  "tags": [
    true
  ]
}

```
