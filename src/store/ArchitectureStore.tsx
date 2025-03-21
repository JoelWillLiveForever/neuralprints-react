import { create } from 'zustand';

interface ArchitectureStore {
    layers: string[]; // Хранит список слоев

    // Данные разбиения датасета
    train_split: number;
    test_split: number;
    validation_split: number;

    addLayer: (layer: string) => void;
    removeLayer: (layer: string) => void;

    setTrainSplit: (value: number) => void;
    setTestSplit: (value: number) => void;
    setValidationSplit: (value: number) => void;
}

export const useArchitectureStore = create<ArchitectureStore>((set, get) => ({
    layers: [],
    
    train_split: 0.7,
    test_split: 0.2,
    validation_split: 0.1,

    addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
    removeLayer: (layer) => set((state) => ({ layers: state.layers.filter((l) => l !== layer) })),

    setTrainSplit: (value) => set({ train_split: value }),
    setTestSplit: (value) => set({ test_split: value }),
    setValidationSplit: (value) => set({ validation_split: value }),
}));
