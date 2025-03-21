import React from 'react';

/* import interface */
import { BeautifulSliderProps } from './BeautifulSliderProps';

/* import styles */
import './beautiful_slider.scss';

const BeautifulSlider: React.FC<BeautifulSliderProps> = ({
    type = 'node',
    className = '',
    value,
    onChange,
    onWheel,
    color = '#616161',
    min = 0.0,
    max = 1.0,
    step = 0.01,
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
            className={`beautiful-slider-container ${className}`}
            style={{ '--slider-color': hexToRgb(color) } as React.CSSProperties}
        >
            {type === 'node' ? (
                <div className="slider-node">
                    {/* <label className="property__key">Strength</label> */}
                    <input
                        className="nopan nodrag nowheel slider-node__input"
                        type="range"
                        min={min}
                        max={max}
                        step={step}
                        value={value}
                        onChange={onChange}
                        onWheel={onWheel}
                    />
                    <div className="slider-node__overlay">
                        <span className="slider-label">Strength</span>

                        {/* // TODO: Сделать размерность как у step */}
                        <span className="slider-value">{value.toFixed(3)}</span>
                    </div>
                </div>
            ) : (
                <div className="slider-sidebar"></div>
            )}
        </div>
    );
};

export default BeautifulSlider;
