import { create } from 'zustand';

interface DatasetStore {
    dataset: string[][];
    headers: string[];

    setDataset: (data: string[][]) => void;
    setHeaders: (headers: string[]) => void;
}

export const useDatasetStore = create<DatasetStore>((set) => ({
    dataset: [],
    headers: [],
    setDataset: (data) => set({ dataset: data }),
    setHeaders: (headers) => set({ headers }),
}));
