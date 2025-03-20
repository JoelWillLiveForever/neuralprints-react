export interface BeautifulSliderProps {
    type?: 'inside | outside';
    className?: string;

    value: number;
    
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onWheel: (e: React.WheelEvent) => void;
}