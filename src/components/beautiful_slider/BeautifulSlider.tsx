import React from 'react';

/* import interface */
import { BeautifulSliderProps } from './BeautifulSliderProps';

/* import styles */
import './beautiful_slider.scss';

const BeautifulSlider: React.FC<BeautifulSliderProps> = ({
    root = 'node',
    className = '',
    value,
    onChange,
    onWheel,
    color = '#616161',
    min = 0.0,
    max = 1.0,
    step = 0.01,
    label = 'beauty',
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
            {root === 'node' ? (
                <div className="slider-node">
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
                        <span className="slider-label">{label}</span>

                        {/* // TODO: Сделать размерность как у step */}
                        <span className="slider-value">{value.toFixed(3)}</span>
                    </div>
                </div>
            ) : (
                <div className="slider-sidebar-wrapper">
                    <label className="slider-label">{label}</label>

                    <div className="slider-sidebar">
                        <input
                            className="slider-sidebar__input"
                            type="range"
                            min={min}
                            max={max}
                            step={step}
                            value={value}
                            onChange={onChange}
                            onWheel={onWheel}
                        />

                        <div className="slider-sidebar__overlay">
                            <span className="slider-value">{(value * 100).toFixed(0)}%</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default BeautifulSlider;
