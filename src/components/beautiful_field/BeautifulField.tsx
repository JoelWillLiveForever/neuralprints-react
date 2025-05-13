import React from 'react';

/* import interface */
import {
    BeautifulFieldProps,
    BeautifulFieldTextProps,
    BeautifulFieldNumericProps,
    BeautifulFieldTextDoubleProps,
    BeautifulFieldNumericDoubleProps,
} from './BeautifulFieldProps';

/* import styles */
import './beautiful_field.scss';

const BeautifulField: React.FC<BeautifulFieldProps> = ({
    variant = 'variant-1',
    className = '',

    type = 'text',

    color = '#616161',
    label = 'beauty',

    readOnly = false,

    ...props
}) => {
    // Common defaults
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

    // Defaults for different types
    const textDefaults =
        type === 'text'
            ? {
                  placeholder: (props as BeautifulFieldTextProps).placeholder ?? 'placeholder',
              }
            : {};

    const numericDefaults =
        type === 'numeric'
            ? {
                  min: (props as BeautifulFieldNumericProps).min ?? 0,
                  max: (props as BeautifulFieldNumericProps).max ?? 100,
                  step: (props as BeautifulFieldNumericProps).step ?? 1,
              }
            : {};

    const textDoubleDefaults_1 =
        type === 'text-double'
            ? {
                  placeholder: (props as BeautifulFieldTextDoubleProps).placeholder_1 ?? 'placeholder 1',
              }
            : {};

    const textDoubleDefaults_2 =
        type === 'text-double'
            ? {
                  placeholder: (props as BeautifulFieldTextDoubleProps).placeholder_2 ?? 'placeholder 2',
              }
            : {};

    const numericDoubleDefaults_1 =
        type === 'numeric-double'
            ? {
                  min: (props as BeautifulFieldNumericDoubleProps).min_1 ?? 0,
                  max: (props as BeautifulFieldNumericDoubleProps).max_1 ?? 100,
                  step: (props as BeautifulFieldNumericDoubleProps).step_1 ?? 1,
              }
            : {};

    const numericDoubleDefaults_2 =
        type === 'numeric-double'
            ? {
                  min: (props as BeautifulFieldNumericDoubleProps).min_2 ?? 0,
                  max: (props as BeautifulFieldNumericDoubleProps).max_2 ?? 100,
                  step: (props as BeautifulFieldNumericDoubleProps).step_2 ?? 1,
              }
            : {};

    // Extract values for different types
    let value, value_1, value_2, onChange, onChange_1, onChange_2, onWheel, onWheel_1, onWheel_2;

    switch (type) {
        case 'text':
            ({ value, onChange } = props as BeautifulFieldTextProps);
            break;
        case 'numeric':
            ({ value, onChange, onWheel } = props as BeautifulFieldNumericProps);
            break;
        case 'text-double':
            ({ value_1, value_2, onChange_1, onChange_2 } = props as BeautifulFieldTextDoubleProps);
            break;
        case 'numeric-double':
            ({ value_1, value_2, onChange_1, onChange_2, onWheel_1, onWheel_2 } =
                props as BeautifulFieldNumericDoubleProps);
            break;
    }

    // const sharedInputProps = (
    //     value: string | number | undefined,
    //     onChange: ((e: React.ChangeEvent<HTMLInputElement>) => void) | undefined,
    //     onWheel: ((e: React.WheelEvent) => void) | undefined,
    //     readOnly: boolean
    // ) => ({
    //     value,
    //     onChange: readOnly ? undefined : onChange,
    //     onWheel: readOnly ? undefined : onWheel,
    //     readOnly: readOnly,
    // });

    return (
        <div
            className={`beautiful-field-container ${className}`}
            style={{ '--field-color': hexToRgb(color) } as React.CSSProperties}
        >
            {variant === 'variant-1' ? (
                <div className="field-variant-1">
                    <label className="field-variant-1__label">{label}</label>

                    {type === 'text' || type === 'numeric' ? (
                        <input
                            className="nopan nodrag nowheel field-variant-1__input"
                            type={type === 'numeric' ? 'number' : 'text'}
                            value={value}
                            onChange={readOnly ? undefined : onChange}
                            onWheel={readOnly ? undefined : type === 'numeric' ? onWheel : undefined}
                            {...(type === 'numeric' ? numericDefaults : textDefaults)}
                            readOnly={readOnly}
                        />
                    ) : (
                        <div className="field-variant-1__input-container">
                            <input
                                className="nopan nodrag nowheel field-variant-1__input"
                                type={type === 'numeric-double' ? 'number' : 'text'}
                                value={value_1}
                                onChange={readOnly ? undefined : onChange_1}
                                onWheel={readOnly ? undefined : type === 'numeric-double' ? onWheel_1 : undefined}
                                {...(type === 'numeric-double' ? numericDoubleDefaults_1 : textDoubleDefaults_1)}
                                readOnly={readOnly}
                            />
                            <input
                                className="nopan nodrag nowheel field-variant-1__input"
                                type={type === 'numeric-double' ? 'number' : 'text'}
                                value={value_2}
                                onChange={readOnly ? undefined : onChange_2}
                                onWheel={readOnly ? undefined : type === 'numeric-double' ? onWheel_2 : undefined}
                                {...(type === 'numeric-double' ? numericDoubleDefaults_2 : textDoubleDefaults_2)}
                                readOnly={readOnly}
                            />
                        </div>
                    )}
                </div>
            ) : (
                <div className="field-variant-2">
                    <label className="field-variant-2__label">{label}</label>

                    {/* <input
                        className="field-variant-2__input"
                        type={type === 'numeric' ? 'number' : 'text'}
                        value={value}
                        onChange={onChange}
                        onWheel={type === 'numeric' ? (props as BeautifulFieldNumericProps).onWheel : undefined}
                        {...(type === 'numeric' ? numericDefaults : textDefaults)}
                    /> */}

                    {type === 'text' || type === 'numeric' ? (
                        <input
                            className="nopan nodrag nowheel field-variant-2__input"
                            type={type === 'numeric' ? 'number' : 'text'}
                            value={value}
                            onChange={readOnly ? undefined : onChange}
                            onWheel={readOnly ? undefined : type === 'numeric' ? onWheel : undefined}
                            {...(type === 'numeric' ? numericDefaults : textDefaults)}
                            readOnly={readOnly}
                        />
                    ) : (
                        <div className="field-variant-2__input-container">
                            <input
                                className="nopan nodrag nowheel field-variant-2__input"
                                type={type === 'numeric-double' ? 'number' : 'text'}
                                value={value_1}
                                onChange={readOnly ? undefined : onChange_1}
                                onWheel={readOnly ? undefined : type === 'numeric-double' ? onWheel_1 : undefined}
                                {...(type === 'numeric-double' ? numericDoubleDefaults_1 : textDoubleDefaults_1)}
                                readOnly={readOnly}
                            />
                            <input
                                className="nopan nodrag nowheel field-variant-2__input"
                                type={type === 'numeric-double' ? 'number' : 'text'}
                                value={value_2}
                                onChange={readOnly ? undefined : onChange_2}
                                onWheel={readOnly ? undefined : type === 'numeric-double' ? onWheel_2 : undefined}
                                {...(type === 'numeric-double' ? numericDoubleDefaults_2 : textDoubleDefaults_2)}
                                readOnly={readOnly}
                            />
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default BeautifulField;
