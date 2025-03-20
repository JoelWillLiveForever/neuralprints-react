import React from 'react';

/* import interface */
import { BeautifulSliderProps } from './BeautifulSliderProps';

/* import styles */
import './beautiful_slider.scss';

const BeautifulSlider: React.FC<BeautifulSliderProps> = ({
    type = 'inside',
    className = '',
    value,
    onChange,
    onWheel,
}) => {
    return (
        <div className={`beautiful-slider-container ${className}`}>
            {type === 'inside' ? (
                <div className="slider-inside">
                    {/* <label className="property__key">Strength</label> */}
                    <input
                        className="nopan nodrag nowheel slider-inside__input"
                        type="range"
                        min={0}
                        max={1}
                        step={0.001}
                        value={value}
                        onChange={onChange}
                        onWheel={onWheel}
                    />
                    <div className="slider-inside__overlay">
                        <span className="slider-label">Strength</span>
                        <span className="slider-value">{value.toFixed(3)}</span>
                    </div>
                </div>
            ) : (
                <div className="slider-outside">
                    
                </div>
            )}
        </div>
    );
};

export default BeautifulSlider;
