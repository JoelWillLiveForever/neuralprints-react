export interface BeautifulSliderProps {
    type?: 'node' | 'sidebar';
    className?: string;

    value: number;
    
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onWheel: (e: React.WheelEvent) => void;

    color?: string;

    min?: number;
    max?: number;
    step?: number;

    label?: string;
}