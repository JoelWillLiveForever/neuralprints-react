export interface BeautifulComboBoxProps {
    root?: 'node' | 'sidebar';
    className?: string;

    value: string;
    placeholder?: string;
    
    onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
    // onWheel: (e: React.WheelEvent) => void;

    color?: string;
    label?: string;
    
    children?: React.ReactNode;
}