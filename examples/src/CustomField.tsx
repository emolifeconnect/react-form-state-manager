import React from 'react';

const CustomField = ({ onChange }: { onChange: (value: any) => any }) => {
    return <input type="text" onChange={event => onChange(event.target.value)} />;
};

export default CustomField;
