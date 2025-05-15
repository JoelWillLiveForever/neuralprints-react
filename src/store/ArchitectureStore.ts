import { create } from 'zustand';
import { Node as RFNode, Edge as RFEdge, applyNodeChanges, applyEdgeChanges } from '@xyflow/react';

const lossFunctionMap: Record<string, string> = {
    binary_crossentropy: 'Binary crossentropy',
    kld: 'KLD (Kullback-Leibler divergence)',
    mae: 'MAE (Mean absolute error)',
    mape: 'MAPE (Mean absolute percentage error)',
    mse: 'MSE (Mean squared error)',
    msle: 'MSLE (Mean squared logarithmic error)',
    binary_focal_cross_entropy: 'Binary focal crossentropy',
    categorical_cross_entropy: 'Categorical crossentropy',
    categorical_focal_cross_entropy: 'Categorical focal crossentropy',
    sparse_categorical_cross_entropy: 'Sparse categorical crossentropy',
    cosine_similarity: 'Cosine similarity',
    ctc: 'CTC (Connectionist temporal classification)',
    dice: 'Dice',
    hinge: 'Hinge',
    squared_hinge: 'Squared hinge',
    categorical_hinge: 'Categorical hinge',
    huber: 'Huber',
    reduction: 'Reduction',
    poisson: 'Poisson',
    tversky: 'Tversky',
};

const qualityMetricDisplayNames: Record<string, string> = {
    accuracy: 'accuracy',
    binary_accuracy: 'binary accuracy',
    categorical_accuracy: 'categorical accuracy',
    sparse_categorical_accuracy: 'sparse categorical accuracy',
    top_k_categorical_accuracy: 'top K categorical accuracy',
    sparse_top_k_categorical_accuracy: 'sparse top K categorical accuracy',
    auc: 'AUC (Area under the curve)',
    average_precision_at_k: 'average precision at K',
    false_negatives: 'false negatives',
    false_negatives_at_thresholds: 'false negatives at thresholds',
    false_positives: 'false positives',
    false_positives_at_thresholds: 'false positives at thresholds',
    mean: 'mean (weighted mean)',
    mean_absolute_error: 'MAE (mean absolute error)',
    mean_absolute_percentage_error: 'MAPE (mean absolute percentage error)',
    mean_cosine_distance: 'mean cosine distance',
    mean_per_class_accuracy: 'mean per class accuracy',
    mean_relative_error: 'mean relative error',
    mean_squared_error: 'MSE (mean squared error)',
    mean_squared_logarithmic_error: 'MSLE (mean squared logarithmic error)',
    mean_tensor: 'mean tensor',
    percentage_below: 'percentage below',
    precision: 'precision',
    precision_at_k: 'precision at K',
    precision_at_thresholds: 'precision at thresholds',
    precision_at_top_k: 'precision at top K',
    recall: 'recall',
    recall_at_k: 'recall at K',
    recall_at_thresholds: 'recall at thresholds',
    recall_at_top_k: 'recall at top K',
    root_mean_squared_error: 'root mean squared error',
    sensitivity_at_specificity: 'sensitivity at specificity',
    sparse_average_precision_at_k: 'sparse average precision at K',
    sparse_precision_at_k: 'sparse precision at K',
    specificity_at_sensitivity: 'specificity at sensitivity',
    true_negatives: 'true negatives',
    true_negatives_at_thresholds: 'true negatives at thresholds',
    true_positives: 'true positives',
    true_positives_at_thresholds: 'true positives at thresholds',
    binary_crossentropy: 'binary crossentropy',
    categorical_crossentropy: 'categorical crossentropy',
    categorical_hinge: 'categorical hinge',
    cosine_similarity: 'cosine similarity',
    f1_score: 'F1 score',
    f_beta_score: 'F beta score',
    hinge: 'hinge',
    iou: 'IoU',
    mean_iou: 'mean IoU',
    kld: 'KLD (Kullback-Leibler divergence)',
    log_cosh_error: 'log-cosh error',
    poisson: 'poisson',
    r2_score: 'R2 score',
    squared_hinge: 'squared hinge',
    sum: 'sum',
};

interface ArchitectureStore {
    architecture_hash: string;

    // layers: string[]; // Хранит список слоев
    nodes: RFNode[];
    edges: RFEdge[];

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

    // setLayers: (layers: string[]) => void;

    // addLayer: (layer: string) => void;
    // removeLayer: (layer: string) => void;

    set_architecture_hash: (architecture_hash: string) => void;
    get_architecture_hash: () => string;

    // Методы для работы с узлами и связями
    setNodes: (nodes: RFNode[]) => void;
    setEdges: (edges: RFEdge[]) => void;

    onNodesChange: (changes: any[]) => void;
    onEdgesChange: (changes: any[]) => void;

    setTrainSplit: (value: number) => void;
    setTestSplit: (value: number) => void;
    setValidationSplit: (value: number) => void;

    setLossFunction: (value: string) => void;
    setOptimizer: (value: string) => void;
    setQualityMetric: (value: string) => void;
    setEpochs: (value: number) => void;
    setBatchSize: (value: number) => void;

    setEnableDatasetNormalization: (value: boolean) => void;

    getLossFunctionDisplayName: () => string;
    getQualityMetricDisplayName: (capitalize: boolean) => string;
}

export const useArchitectureStore = create<ArchitectureStore>((set, get) => ({
    architecture_hash: '',

    // layers: [],
    nodes: [],
    edges: [],

    train_split: 0.7,
    test_split: 0.2,
    validation_split: 0.1,

    loss_function: 'binary_crossentropy',
    optimizer: 'adam',
    quality_metric: 'accuracy',
    epochs: 100,
    batch_size: 32,

    enable_dataset_normalization: false,

    set_architecture_hash: (hash) => set({ architecture_hash: hash }),
    get_architecture_hash: () => get().architecture_hash,

    // setLayers: (layers) => set({ layers }),

    // addLayer: (layer) => set((state) => ({ layers: [...state.layers, layer] })),
    // removeLayer: (layer) => set((state) => ({ layers: state.layers.filter((l) => l !== layer) })),

    setNodes: (nodes) => set({ nodes }),
    setEdges: (edges) => set({ edges }),

    onNodesChange: (changes) => {
        set({
            nodes: applyNodeChanges(changes, get().nodes),
        });
    },

    onEdgesChange: (changes) => {
        set({
            edges: applyEdgeChanges(changes, get().edges),
        });
    },

    setTrainSplit: (value) => set({ train_split: value }),
    setTestSplit: (value) => set({ test_split: value }),
    setValidationSplit: (value) => set({ validation_split: value }),

    setLossFunction: (value) => set({ loss_function: value }),
    setOptimizer: (value) => set({ optimizer: value }),
    setQualityMetric: (value) => set({ quality_metric: value }),
    setEpochs: (value) => set({ epochs: value }),
    setBatchSize: (value) => set({ batch_size: value }),

    setEnableDatasetNormalization: (value) => set({ enable_dataset_normalization: value }),

    getLossFunctionDisplayName: () => {
        const loss = get().loss_function;
        return lossFunctionMap[loss] ?? loss;
    },

    getQualityMetricDisplayName: (capitalize) => {
        const quality_metric = get().quality_metric;
        const name = qualityMetricDisplayNames[quality_metric] ?? quality_metric;

        if (!capitalize) return name;

        // Сделать первую букву заглавной
        return name.charAt(0).toUpperCase() + name.slice(1);
    },
}));
