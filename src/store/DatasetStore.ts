import { create } from 'zustand';

interface DatasetStore {
    _original_data: string[][];
    dataset: string[][];

    headers: string[];
    column_types: ('feature' | 'target' | 'ignored')[];

    sort_params: { column_index: number; order: 'asc' | 'desc' | null };

    current_page: number;
    page_size: number;

    set_dataset: (data: string[][]) => void;
    get_dataset: () => void;

    set_headers: (headers: string[]) => void;
    get_headers: () => void;

    set_column_types: (column_types: ('feature' | 'target' | 'ignored')[]) => void; // Метод для обновления типов столбцов
    get_column_types: () => ('feature' | 'target' | 'ignored')[]; // Метод для получения типов столбцов

    set_pagination: (current_page: number, page_size: number) => void;

    sort_dataset: (column_index: number) => void;
    reset_sorting: () => void;

    initialize_data: (data: string[][]) => void;
    update_data: (new_data: string[][]) => void;
    clear_data: () => void;
}

export const useDatasetStore = create<DatasetStore>((set, get) => ({
    _original_data: [],
    dataset: [],

    headers: [],
    column_types: [],

    sort_params: { column_index: 0, order: null },

    current_page: 0,
    page_size: 5,

    set_dataset: (data) => set({ dataset: data }),
    get_dataset: () => get().dataset,

    set_headers: (headers) => set({ headers }),
    get_headers: () => get().headers,

    set_column_types: (column_types) => set({ column_types }), // Обновление типов столбцов
    get_column_types: () => get().column_types, // Получение типов столбцов

    set_pagination: (current_page, page_size) => set({ current_page, page_size }),

    sort_dataset: (column_index) => {
        const { _original_data, sort_params } = get();

        // определяем новый порядок сортировки
        let next_sort_order: 'asc' | 'desc' | null;

        if (sort_params.order === null) {
            next_sort_order = 'asc';
        } else if (sort_params.order === 'asc') {
            next_sort_order = 'desc';
        } else {
            next_sort_order = null;
        }

        let new_dataset: string[][];

        if (next_sort_order === null) {
            // если сброс
            new_dataset = [..._original_data];
        } else {
            new_dataset = [..._original_data];

            new_dataset.sort((a, b) => {
                const valueA = a[column_index];
                const valueB = b[column_index];

                if (valueA < valueB) return next_sort_order === 'asc' ? -1 : 1;
                if (valueA > valueB) return next_sort_order === 'asc' ? 1 : -1;

                return 0;
            });
        }

        set({
            dataset: new_dataset,
            sort_params: { column_index, order: next_sort_order },
        });
    },

    reset_sorting: () => {
        const { _original_data } = get();

        set({
            dataset: [..._original_data],
            sort_params: { column_index: 0, order: null },
        });
    },

    // initialize_data: (data) => set({ dataset: data, _original_data: data }),
    initialize_data: (data) => {
        // Создаем массив column_types, где первая колонка - ignored, последняя - target, а остальные - feature
        let column_types;

        if (data.length >= 3) column_types = ['ignored', ...Array(data[0].length - 2).fill('feature'), 'target'];
        else column_types = [...Array(data[0].length).fill('feature')];

        set({
            dataset: data,
            _original_data: data,
            column_types: column_types, // Устанавливаем значения для column_types
        });
    },

    // Обновление данных (включает и _original_data, и dataset)
    update_data: (new_data: string[][]) => {
        set({
            dataset: new_data,
            _original_data: new_data, // Обновляем _original_data
        });
    },

    clear_data: () => {
        set({
            _original_data: [], // Обновляем _original_data
            dataset: [],
            headers: [],

            sort_params: { column_index: 0, order: null }, // Сбрасываем сортировку

            current_page: 0,
        });
    },
}));
