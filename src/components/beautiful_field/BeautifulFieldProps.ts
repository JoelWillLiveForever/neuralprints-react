export interface BeautifulFieldBaseProps {
    variant?: 'variant-1' | 'variant-2';
    className?: string;

    color?: string;
    label?: string;

    readOnly?: boolean;
}

export interface BeautifulFieldTextProps extends BeautifulFieldBaseProps {
    type: 'text';

    value: string;
    placeholder?: string;

    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface BeautifulFieldNumericProps extends BeautifulFieldBaseProps {
    type: 'numeric';

    value: number;

    min?: number;
    max?: number;
    step?: number;

    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onWheel?: (e: React.WheelEvent) => void;
}

export interface BeautifulFieldTextDoubleProps extends BeautifulFieldBaseProps {
    type: 'text-double';

    value_1: string;
    placeholder_1?: string;

    value_2: string;
    placeholder_2?: string;

    onChange_1?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onChange_2?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export interface BeautifulFieldNumericDoubleProps extends BeautifulFieldBaseProps {
    type: 'numeric-double';

    value_1: number;

    min_1?: number;
    max_1?: number;
    step_1?: number;

    value_2: number;

    min_2?: number;
    max_2?: number;
    step_2?: number;

    onChange_1?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onWheel_1?: (e: React.WheelEvent) => void;

    onChange_2?: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onWheel_2?: (e: React.WheelEvent) => void;
}

export type BeautifulFieldProps =
    | BeautifulFieldTextProps
    | BeautifulFieldNumericProps
    | BeautifulFieldTextDoubleProps
    | BeautifulFieldNumericDoubleProps;
