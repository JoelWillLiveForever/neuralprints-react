import { create } from 'zustand';

interface DatasetStore {
    dataset: string[][];
    headers: string[];

    current_page: number;
    page_size: number;

    set_dataset: (data: string[][]) => void;
    get_dataset: () => void;

    set_headers: (headers: string[]) => void;
    get_headers: () => void;

    set_pagination: (current_page: number, page_size: number) => void;
}

export const useDatasetStore = create<DatasetStore>((set, get) => ({
    dataset: [],
    headers: [],

    current_page: 0,
    page_size: 5,
    
    set_dataset: (data) => set({ dataset: data }),
    get_dataset: () => get().dataset,

    set_headers: (headers) => set({ headers }),
    get_headers: () => get().headers,

    set_pagination: (current_page, page_size) => set({ current_page, page_size }),
}));