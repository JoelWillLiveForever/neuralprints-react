import React from 'react';

/* import interface */
import { BeautifulFieldNumericProps, BeautifulFieldProps, BeautifulFieldTextProps } from './BeautifulFieldProps';

/* import styles */
import './beautiful_field.scss';

const BeautifulField: React.FC<BeautifulFieldProps> = ({
    root = 'node',
    className = '',

    type = 'text',
    value,

    onChange,

    color = '#616161',
    label = 'beauty',

    ...props
}) => {
    const textDefaults = type === 'text' ? {
        placeholder: (props as BeautifulFieldTextProps).placeholder ?? 'placeholder',
    } : {};

    const numericDefaults = type === 'numeric' ? {
        min: (props as BeautifulFieldNumericProps).min ?? 0,
        max: (props as BeautifulFieldNumericProps).max?? 100,
        step: (props as BeautifulFieldNumericProps).step ?? 1,
    } : {};


    const hexToRgb = (hex: string): string => {
        hex = hex.replace(/^#/, '');
        if (hex.length === 3) {
            hex = hex
                .split('')
                .map((char) => char + char)
                .join('');
        }
        const num = parseInt(hex, 16);
        return `${(num >> 16) & 255}, ${(num >> 8) & 255}, ${num & 255}`;
    };

    return (
        <div
            className={`beautiful-field-container ${className}`}
            style={{ '--field-color': hexToRgb(color) } as React.CSSProperties}
        >
            {root === 'node' ? (
                <div className="field-node">
                    <label className="field-node__label">{label}</label>

                    <input
                        className="nopan nodrag nowheel field-node__input"
                        type={type === 'numeric' ? 'number' : 'text'}
                        value={value}
                        onChange={onChange}
                        onWheel={type === 'numeric' ? (props as BeautifulFieldNumericProps).onWheel : undefined}
                        {...(type === 'numeric' ? numericDefaults : textDefaults)}
                    />
                </div>
            ) : (
                <div className="field-sidebar">
                    <label className="field-sidebar__label">{label}</label>

                    <input
                        className="field-sidebar__input"
                        type={type === 'numeric' ? 'number' : 'text'}
                        value={value}
                        onChange={onChange}
                        onWheel={type === 'numeric' ? (props as BeautifulFieldNumericProps).onWheel : undefined}
                        {...(type === 'numeric' ? numericDefaults : textDefaults)}
                    />
                </div>
            )}
        </div>
    );
};

export default BeautifulField;
