import { create } from 'zustand';

interface ArchitectureStore {
    layers: string[]; // Хранит список слоев

    // Данные разбиения датасета
    train_split: number;
    test_split: number;
    validation_split: number;

    loss_function: string;
    optimizer: string;
    quality_metric: string;
    epochs: number;
    batch_size: number;

    enable_dataset_normalization: boolean;

    addLayer: (layer: string) => void;
    removeLayer: (layer: string) => void;

    setTrainSplit: (value: number) => void;
    setTestSplit: (value: number) => void;
    setValidationSplit: (value: number) => void;

    setLossFunction: (value: string) => void;
    setOptimizer: (value: string) => void;
    setQualityMetric: (value: string) => void;
    setEpochs: (value: number) => void;
    setBatchSize: (value: number) => void;

    setEnableDatasetNormalization: (value: boolean) => void;
}

export const useArchitectureStore = create<ArchitectureStore>((set, get) => ({
    layers: [],
    
    train_split: 0.7,
    test_split: 0.2,
    validation_split: 0.1,

    loss_function: 'binary_cross_entropy',
    optimizer: 'adam',
    quality_metric: 'accuracy',
    epochs: 100,
    batch_size: 32,

    enable_dataset_normalization: false,

    addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
    removeLayer: (layer) => set((state) => ({ layers: state.layers.filter((l) => l !== layer) })),

    setTrainSplit: (value) => set({ train_split: value }),
    setTestSplit: (value) => set({ test_split: value }),
    setValidationSplit: (value) => set({ validation_split: value }),

    setLossFunction: (value) => set({ loss_function: value }),
    setOptimizer: (value) => set({ optimizer: value }),
    setQualityMetric: (value) => set({ quality_metric: value }),
    setEpochs: (value) => set({ epochs: value }),
    setBatchSize: (value) => set({ batch_size: value }),

    setEnableDatasetNormalization: (value) => set({ enable_dataset_normalization: value }),
}));
