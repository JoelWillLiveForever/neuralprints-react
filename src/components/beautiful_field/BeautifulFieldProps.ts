export interface BeautifulFieldBaseProps {
    root?: 'node' | 'sidebar';
    className?: string;
    
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;

    color?: string;
    label?: string;
}

export interface BeautifulFieldTextProps extends BeautifulFieldBaseProps {
    type: 'text';

    value: string;
    placeholder?: string;
}

export interface BeautifulFieldNumericProps extends BeautifulFieldBaseProps {
    type: 'numeric';

    value: number;

    min?: number;
    max?: number;
    step?: number;

    onWheel: (e: React.WheelEvent) => void;
}

export type BeautifulFieldProps = BeautifulFieldTextProps | BeautifulFieldNumericProps;