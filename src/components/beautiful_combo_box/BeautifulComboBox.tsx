import React, { Children } from 'react';

/* import interface */
import { BeautifulComboBoxProps } from './BeautifulComboBoxProps';

/* import styles */
import './beautiful_combo_box.scss';

const BeautifulComboBox: React.FC<BeautifulComboBoxProps> = ({
    type = 'node',
    className = '',

    value,
    placeholder = '',

    onChange,
    // onWheel,

    color = '#616161',
    label = 'beauty',

    children,
}) => {
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
            className={`beautiful-combo-box-container ${className}`}
            style={{ '--combo-box-color': hexToRgb(color) } as React.CSSProperties}
        >
            {type === 'node' ? (
                <div className="combo-box-node">
                    <label className="combo-box-node__label">{label}</label>

                    {placeholder !== '' ? (
                        <select className="nopan nodrag combo-box-node__select" value={value} onChange={onChange}>
                            <option value="" selected disabled hidden>
                                {placeholder}
                            </option>

                            {/* Отображаем переданные опции */}
                            {children}
                        </select>
                    ) : (
                        <select className="nopan nodrag combo-box-node__select" value={value} onChange={onChange}>
                            {/* Отображаем переданные опции */}
                            {children}
                        </select>
                    )}
                </div>
            ) : (
                <div className="combo-box-sidebar">
                    <label className="combo-box-sidebar__label">{label}</label>

                    {placeholder !== '' ? (
                        <select className="combo-box-sidebar__select" value={value} onChange={onChange}>
                            <option value="" selected disabled hidden>
                                {placeholder}
                            </option>

                            {/* Отображаем переданные опции */}
                            {children}
                        </select>
                    ) : (
                        <select className="combo-box-sidebar__select" value={value} onChange={onChange}>
                            {/* Отображаем переданные опции */}
                            {children}
                        </select>
                    )}
                </div>
            )}
        </div>
    );
};

export default BeautifulComboBox;
