import { create } from 'zustand';

export type TrainingLossPoint = {
    epoch: number;
    training_loss: number;
};

export type ValidationLossPoint = {
    epoch: number;
    validation_loss: number;
};

export type TrainingUserMetricPoint = {
    epoch: number;
    training_user_metric: number;
};

export type ValidationUserMetricPoint = {
    epoch: number;
    validation_user_metric: number;
};

interface MetricStore {
    current_epoch: number;

    train_accuracy: number;
    test_accuracy: number;
    validation_accuracy: number;

    train_loss: number;
    test_loss: number;
    validation_loss: number;

    precision: number;
    recall: number;
    f1_score: number;
    auc_roc: number;

    chart_data_training_loss: TrainingLossPoint[];
    chart_data_validation_loss: ValidationLossPoint[];

    chart_data_training_user_metric: TrainingUserMetricPoint[];
    chart_data_validation_user_metric: ValidationUserMetricPoint[];

    setCurrentEpoch: (newCurrentEpoch: number) => void;
    getCurrentEpoch: () => number;

    setTrainAccuracy: (newTrainAccuracy: number) => void;
    getTrainAccuracy: () => number;

    setTestAccuracy: (newTestAccuracy: number) => void;
    getTestAccuracy: () => number;

    setValidationAccuracy: (newValidationAccuracy: number) => void;
    getValidationAccuracy: () => number;

    setTrainLoss: (newTrainLoss: number) => void;
    getTrainLoss: () => number;

    setTestLoss: (newTestLoss: number) => void;
    getTestLoss: () => number;

    setValidationLoss: (newValidationLoss: number) => void;
    getValidationLoss: () => number;

    setPrecision: (newPrecision: number) => void;
    getPrecision: () => number;

    setRecall: (newRecall: number) => void;
    getRecall: () => number;

    setF1Score: (newF1Score: number) => void;
    getF1Score: () => number;

    setAucRoc: (newAucRoc: number) => void;
    getAucRoc: () => number;

    // Сеттеры для замены всего массива
    setChartDataTrainingLoss: (newChartDataLoss: TrainingLossPoint[]) => void;
    setChartDataValidationLoss: (newChartDataValidationLoss: ValidationLossPoint[]) => void;
    setChartDataTrainingUserMetric: (newChartDataUserMetric: TrainingUserMetricPoint[]) => void;
    setChartDataValidationUserMetric: (newChartDataValidationUserMetric: ValidationUserMetricPoint[]) => void;

    // Геттеры для получения всего массива
    getChartDataTrainingLoss: () => TrainingLossPoint[];
    getChartDataValidationLoss: () => ValidationLossPoint[];
    getChartDataTrainingUserMetric: () => TrainingUserMetricPoint[];
    getChartDataValidationUserMetric: () => ValidationUserMetricPoint[];

    // Методы для добавления одной точки
    addPointToTrainingLoss: (point: TrainingLossPoint) => void;
    addPointToValidationLoss: (point: ValidationLossPoint) => void;
    addPointToTrainingUserMetric: (point: TrainingUserMetricPoint) => void;
    addPointToValidationUserMetric: (point: ValidationUserMetricPoint) => void;

    // Методы для удаления точки по epoch (или другому ключу)
    removePointFromTrainingLoss: (epoch: number) => void;
    removePointFromValidationLoss: (epoch: number) => void;
    removePointFromTrainingUserMetric: (epoch: number) => void;
    removePointFromValidationUserMetric: (epoch: number) => void;

    // Методы для очистки массива
    clearTrainingLoss: () => void;
    clearValidationLoss: () => void;
    clearTrainingUserMetric: () => void;
    clearValidationUserMetric: () => void;

    resetAllValues: () => void;
}

export const useMetricStore = create<MetricStore>((set, get) => ({
    current_epoch: 0,

    train_accuracy: -1,
    test_accuracy: -1,
    validation_accuracy: -1,

    train_loss: -1,
    test_loss: -1,
    validation_loss: -1,

    precision: -1,
    recall: -1,
    f1_score: -1,
    auc_roc: -1,

    chart_data_training_loss: [],
    chart_data_validation_loss: [],

    chart_data_training_user_metric: [],
    chart_data_validation_user_metric: [],

    setCurrentEpoch: (newCurrentEpoch) => set({ current_epoch: newCurrentEpoch }),
    getCurrentEpoch: () => get().current_epoch,

    setTrainAccuracy: (newTrainAccuracy) => set({ train_accuracy: newTrainAccuracy }),
    getTrainAccuracy: () => get().train_accuracy,

    setTestAccuracy: (newTestAccuracy) => set({ test_accuracy: newTestAccuracy }),
    getTestAccuracy: () => get().test_accuracy,

    setValidationAccuracy: (newValidationAccuracy) => set({ validation_accuracy: newValidationAccuracy }),
    getValidationAccuracy: () => get().validation_accuracy,

    setTrainLoss: (newTrainLoss) => set({ train_loss: newTrainLoss }),
    getTrainLoss: () => get().train_loss,

    setTestLoss: (newTestLoss) => set({ test_loss: newTestLoss }),
    getTestLoss: () => get().test_loss,

    setValidationLoss: (newValidationLoss) => set({ validation_loss: newValidationLoss }),
    getValidationLoss: () => get().validation_loss,

    setPrecision: (newPrecision) => set({ precision: newPrecision }),
    getPrecision: () => get().precision,

    setRecall: (newRecall) => set({ recall: newRecall }),
    getRecall: () => get().recall,

    setF1Score: (newF1Score) => set({ f1_score: newF1Score }),
    getF1Score: () => get().f1_score,

    setAucRoc: (newAucRoc) => set({ auc_roc: newAucRoc }),
    getAucRoc: () => get().auc_roc,

    setChartDataTrainingLoss: (newChartDataTrainingLoss) => set({ chart_data_training_loss: newChartDataTrainingLoss }),
    setChartDataValidationLoss: (newChartDataValidationLoss) =>
        set({ chart_data_validation_loss: newChartDataValidationLoss }),
    setChartDataTrainingUserMetric: (newChartDataTrainingUserMetric) =>
        set({ chart_data_training_user_metric: newChartDataTrainingUserMetric }),
    setChartDataValidationUserMetric: (newChartDataValidationUserMetric) =>
        set({ chart_data_validation_user_metric: newChartDataValidationUserMetric }),

    getChartDataTrainingLoss: () => get().chart_data_training_loss,
    getChartDataValidationLoss: () => get().chart_data_validation_loss,
    getChartDataTrainingUserMetric: () => get().chart_data_training_user_metric,
    getChartDataValidationUserMetric: () => get().chart_data_validation_user_metric,

    addPointToTrainingLoss: (point: TrainingLossPoint) =>
        set((state) => ({
            chart_data_training_loss: [...state.chart_data_training_loss, point],
        })),

    addPointToValidationLoss: (point: ValidationLossPoint) =>
        set((state) => ({
            chart_data_validation_loss: [...state.chart_data_validation_loss, point],
        })),

    // Аналогично для метрик пользователя
    addPointToTrainingUserMetric: (point: TrainingUserMetricPoint) =>
        set((state) => ({
            chart_data_training_user_metric: [...state.chart_data_training_user_metric, point],
        })),

    addPointToValidationUserMetric: (point: ValidationUserMetricPoint) =>
        set((state) => ({
            chart_data_validation_user_metric: [...state.chart_data_validation_user_metric, point],
        })),

    removePointFromTrainingLoss: (epoch) =>
        set((state) => ({
            chart_data_training_loss: state.chart_data_training_loss.filter((p) => p.epoch !== epoch),
        })),
    removePointFromValidationLoss: (epoch) =>
        set((state) => ({
            chart_data_validation_loss: state.chart_data_validation_loss.filter((p) => p.epoch !== epoch),
        })),
    removePointFromTrainingUserMetric: (epoch) =>
        set((state) => ({
            chart_data_training_user_metric: state.chart_data_training_user_metric.filter((p) => p.epoch !== epoch),
        })),
    removePointFromValidationUserMetric: (epoch) =>
        set((state) => ({
            chart_data_validation_user_metric: state.chart_data_validation_user_metric.filter((p) => p.epoch !== epoch),
        })),

    clearTrainingLoss: () => set({ chart_data_training_loss: [] }),
    clearValidationLoss: () => set({ chart_data_validation_loss: [] }),
    clearTrainingUserMetric: () => set({ chart_data_training_user_metric: [] }),
    clearValidationUserMetric: () => set({ chart_data_validation_user_metric: [] }),

    resetAllValues: () => {
        set({
            current_epoch: 0,

            train_accuracy: -1,
            test_accuracy: -1,
            validation_accuracy: -1,

            train_loss: -1,
            test_loss: -1,
            validation_loss: -1,
            
            precision: -1,
            recall: -1,
            f1_score: -1,
            auc_roc: -1,
        });

        const state = get();
        state.clearTrainingLoss();
        state.clearValidationLoss();
        state.clearTrainingUserMetric();
        state.clearValidationUserMetric();
    },
}));
