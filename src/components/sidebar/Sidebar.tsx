import { useTranslation } from 'react-i18next';

import React from 'react';
import { useDnD } from '../../context/DnDContext';
import { useArchitectureStore } from '../../store/ArchitectureStore';

import Header4Container from '../header_4_container/Header4Container';

import BeautifulSlider from '../beautiful_slider/BeautifulSlider';
import BeautifulComboBox from '../beautiful_combo_box/BeautifulComboBox';
import BeautifulField from '../beautiful_field/BeautifulField';

import { Button } from 'react-bootstrap';
import { Node as RFNode, Edge as RFEdge } from '@xyflow/react';

import './sidebar.scss';
import { build_architecture_data, TypedNode } from '../../utils/BuildArchitectureData';

const PAGE_COLOR = '#E64A19';

const Sidebar: React.FC = () => {
    const { t, i18n } = useTranslation();

    const [, setType] = useDnD();

    // Забираем данные из Zustand
    const { train_split, setTrainSplit } = useArchitectureStore();
    const { test_split, setTestSplit } = useArchitectureStore();
    const { validation_split, setValidationSplit } = useArchitectureStore();

    const { loss_function, setLossFunction } = useArchitectureStore();
    const { optimizer, setOptimizer } = useArchitectureStore();
    const { quality_metric, setQualityMetric } = useArchitectureStore();
    const { epochs, setEpochs } = useArchitectureStore();
    const { batch_size, setBatchSize } = useArchitectureStore();

    // const { shuffle, setShuffle } = useArchitectureStore();
    // const { validation_data, setValidationData } = useArchitectureStore();
    // const { class_weight, setClassWeight } = useArchitectureStore();
    // const { sample_weight, setSampleWeight } = useArchitectureStore();
    // const { initial_epoch, setInitialEpoch } = useArchitectureStore();
    // const { callbacks, setCallbacks } = useArchitectureStore();
    // const { use_multiprocessing, setUseMultiprocessing } = useArchitectureStore();
    // const { workers, setWorkers } = useArchitectureStore();
    // const { max_queue_size, setMaxQueueSize } = useArchitectureStore();
    // const { use_gpu, setUseGPU } = useArchitectureStore();
    // const { device, setDevice } = useArchitectureStore();
    // const { learning_rate, setLearningRate } = useArchitectureStore();

    // const { dropout, setDropout } = useArchitectureStore();
    // const { early_stopping, setEarlyStopping } = useArchitectureStore();
    // const { patience, setPatience } = useArchitectureStore();
    // const { min_delta, setMinDelta } = useArchitectureStore();
    // const { max_epochs, setMaxEpochs } = useArchitectureStore();
    // const { metric, setMetric } = useArchitectureStore();
    // const { save_weights_frequency, setSaveWeightsFrequency } = useArchitectureStore();
    // const { save_model_frequency, setSaveModelFrequency } = useArchitectureStore();
    // const { tensorboard_log_frequency, setTensorboardLogFrequency } = useArchitectureStore();
    // const { model_name, setModelName } = useArchitectureStore();
    // const { enable_tensorboard_logging, setEnableTensorboardLogging } = useArchitectureStore();
    // const { enable_early_stopping, setEnableEarlyStopping } = useArchitectureStore();
    // const { enable_save_weights, setEnableSaveWeights } = useArchitectureStore();
    // const { enable_save_model, setEnableSaveModel } = useArchitectureStore();

    const { enable_dataset_normalization, setEnableDatasetNormalization } = useArchitectureStore();

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';

        setType(nodeType);
    };

    // Общая функция для обновления значений при изменении любого слайдера [ПОВЕДЕНИЕ 1]
    // const updateSplits = (newValue: number, type: 'train' | 'test' | 'validation') => {
    //     let newTrain = train_split;
    //     let newTest = test_split;
    //     let newValidation = validation_split;

    //     switch (type) {
    //         case 'train':
    //             newTrain = Math.max(0, Math.min(1, newValue));
    //             break;
    //         case 'test':
    //             newTest = Math.max(0, Math.min(1, newValue));
    //             break;
    //         case 'validation':
    //             newValidation = Math.max(0, Math.min(1, newValue));
    //             break;
    //     }

    //     const remaining = 1 - (newTrain + newTest + newValidation);
    //     if (remaining !== 0) {
    //         // Распределяем остаток пропорционально между другими двумя слайдерами
    //         const others = [];
    //         if (type !== 'train') others.push('train');
    //         if (type !== 'test') others.push('test');
    //         if (type !== 'validation') others.push('validation');

    //         const totalOthers = others.reduce(
    //             (sum, key) => sum + (key === 'train' ? newTrain : key === 'test' ? newTest : newValidation),
    //             0
    //         );

    //         if (totalOthers === 0) {
    //             others.forEach((key) => {
    //                 if (key === 'train') newTrain = remaining / others.length;
    //                 if (key === 'test') newTest = remaining / others.length;
    //                 if (key === 'validation') newValidation = remaining / others.length;
    //             });
    //         } else {
    //             others.forEach((key) => {
    //                 const ratio = (key === 'train' ? newTrain : key === 'test' ? newTest : newValidation) / totalOthers;
    //                 if (key === 'train') newTrain += ratio * remaining;
    //                 if (key === 'test') newTest += ratio * remaining;
    //                 if (key === 'validation') newValidation += ratio * remaining;
    //             });
    //         }
    //     }

    //     // Убедимся, что значения не выходят за пределы [0, 1]
    //     newTrain = Math.max(0, Math.min(1, newTrain));
    //     newTest = Math.max(0, Math.min(1, newTest));
    //     newValidation = Math.max(0, Math.min(1, newValidation));

    //     // Корректируем возможные погрешности округления
    //     const total = newTrain + newTest + newValidation;
    //     if (total !== 1) {
    //         const diff = 1 - total;
    //         if (type === 'train') newTrain += diff;
    //         else if (type === 'test') newTest += diff;
    //         else newValidation += diff;
    //     }

    //     setTrainSplit(Number(newTrain.toFixed(3)));
    //     setTestSplit(Number(newTest.toFixed(3)));
    //     setValidationSplit(Number(newValidation.toFixed(3)));
    // };

    // Общая функция для обновления значений с учётом новых ограничений
    const updateSplits = (newValue: number, type: 'train' | 'test' | 'validation') => {
        let newTrain = train_split;
        let newTest = test_split;
        let newValidation = validation_split;

        // Устанавливаем новое значение в зависимости от типа
        switch (type) {
            case 'train':
                newTrain = Math.max(0, Math.min(1, newValue));
                break;
            case 'test':
                newTest = Math.max(0, Math.min(1, newValue));
                break;
            case 'validation':
                newValidation = Math.max(0, Math.min(1, newValue));
                break;
        }

        // Вычисляем максимально возможную валидационную выборку
        const maxValidation = (1 - newTrain) / 2;

        // Корректируем значения в зависимости от типа
        if (type === 'train') {
            // При изменении обучающей выборки:
            // 1. Ограничиваем валидационную до (1 - train)/2
            newValidation = Math.min(newValidation, maxValidation);
            // 2. Тестовая = остаток
            newTest = 1 - newTrain - newValidation;
        } else if (type === 'validation') {
            // При изменении валидационной:
            // 1. Ограничиваем её до (1 - train)/2
            newValidation = Math.min(newValidation, maxValidation);
            // 2. Тестовая = остаток
            newTest = 1 - newTrain - newValidation;
        } else if (type === 'test') {
            // При изменении тестовой:
            // 1. Валидационная = (1 - train - test), но не больше (1 - train)/2
            newValidation = Math.min(1 - newTrain - newTest, maxValidation);
            // 2. Корректируем тестовую, чтобы сумма не нарушалась
            newTest = 1 - newTrain - newValidation;
        }

        // Гарантируем, что значения не выходят за пределы [0, 1]
        newTrain = Math.max(0, Math.min(1, newTrain));
        newTest = Math.max(0, Math.min(1, newTest));
        newValidation = Math.max(0, Math.min(1, newValidation));

        // Корректируем возможные погрешности округления
        const total = newTrain + newTest + newValidation;
        if (Math.abs(total - 1) > 0.001) {
            newTest += 1 - total;
            newTest = Math.max(0, Math.min(1, newTest));
        }

        setTrainSplit(Number(newTrain.toFixed(3)));
        setTestSplit(Number(newTest.toFixed(3)));
        setValidationSplit(Number(newValidation.toFixed(3)));
    };

    const handleTrainChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) updateSplits(value, 'train');
    };

    const handleTestChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) updateSplits(value, 'test');
    };

    const handleValidationChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = parseFloat(e.target.value);
        if (!isNaN(value)) updateSplits(value, 'validation');
    };

    const handleWheel = (e: React.WheelEvent, type: 'train' | 'test' | 'validation') => {
        e.preventDefault();
        const step = 0.05;
        const delta = e.deltaY < 0 ? step : -step;
        const currentValue = type === 'train' ? train_split : type === 'test' ? test_split : validation_split;
        const newValue = Number((currentValue + delta).toFixed(3));
        updateSplits(newValue, type);
    };

    const handleModelmport = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = 'application/json';

        input.onchange = async (event: any) => {
            const file = event.target.files?.[0];
            if (!file) return;

            try {
                const text = await file.text();
                const json = JSON.parse(text);

                const { architecture, hyper_parameters } = json;

                const nodes: RFNode[] = architecture.map((layer: any, index: number) => ({
                    id: `node-${index}`,
                    type: layer.type,
                    data: layer.data,
                    position: { x: 100 + index * 200, y: 100 }, // временно
                }));

                const edges: RFEdge[] = nodes.slice(0, -1).map((node, i) => ({
                    id: `edge-${i}`,
                    source: node.id,
                    target: nodes[i + 1].id,
                }));

                const store = useArchitectureStore.getState();

                store.setNodes(nodes);
                store.setEdges(edges);

                store.setTrainSplit(hyper_parameters.train_split);
                store.setTestSplit(hyper_parameters.test_split);
                store.setValidationSplit(hyper_parameters.validation_split);
                store.setLossFunction(hyper_parameters.loss_function);
                store.setOptimizer(hyper_parameters.optimizer);
                store.setQualityMetric(hyper_parameters.quality_metric);
                store.setEpochs(hyper_parameters.epochs);
                store.setBatchSize(hyper_parameters.batch_size);
                store.setEnableDatasetNormalization(hyper_parameters.enable_dataset_normalization);
            } catch (err) {
                alert('Ошибка импорта модели: ' + (err as Error).message);
            }
        };

        input.click();
    };

    const handleModelExport = () => {
        const {
            nodes,
            edges,
            // train_split,
            // test_split,
            // validation_split,
            // loss_function,
            // optimizer,
            // quality_metric,
            // epochs,
            // batch_size,
            // enable_dataset_normalization,
        } = useArchitectureStore.getState();

        try {
            const architecture = build_architecture_data(nodes as TypedNode[], edges);
            const json = JSON.stringify(
                {
                    architecture,
                    hyper_parameters: {
                        train_split,
                        test_split,
                        validation_split,
                        loss_function,
                        optimizer,
                        quality_metric,
                        epochs,
                        batch_size,
                        enable_dataset_normalization,
                    },
                },
                null,
                2
            );

            const blob = new Blob([json], { type: 'application/json' });
            const url = URL.createObjectURL(blob);

            const link = document.createElement('a');
            link.href = url;
            link.download = 'model.json';
            link.click();

            URL.revokeObjectURL(url);
        } catch (error) {
            alert('Ошибка экспорта модели: ' + (error as Error).message);
        }
    };

    return (
        <aside className="sidebar">
            <Header4Container className="model-controls-header" text={t('architecture.model-controls.title')} />
            <div className="model-controls">
                <Button onClick={handleModelmport}>{t('architecture.model-controls.buttons.import')}</Button>
                <Button onClick={handleModelExport}>{t('architecture.model-controls.buttons.export')}</Button>
            </div>

            <Header4Container className="tensorflow-layers-header" text={t('architecture.tf-layers')} />
            <div className="tensorflow-layers">
                <div
                    className="tf-layer tf-layer__input"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'TF_INPUT_LAYER_NODE')}
                >
                    Input
                </div>

                <div
                    className="tf-layer tf-layer__dense"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'TF_DENSE_LAYER_NODE')}
                >
                    Dense
                </div>

                <div
                    className="tf-layer tf-layer__dropout"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'TF_DROPOUT_LAYER_NODE')}
                >
                    Dropout
                </div>

                <div
                    className="tf-layer tf-layer__gaussian-dropout"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'TF_GAUSSIAN_DROPOUT_LAYER_NODE')}
                >
                    Gaussian Dropout
                </div>

                <div
                    className="tf-layer tf-layer__gaussian-noise"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'TF_GAUSSIAN_NOISE_LAYER_NODE')}
                >
                    Gaussian Noise
                </div>

                <div
                    className="tf-layer tf-layer__conv-2d"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'TF_CONV_2D_LAYER_NODE')}
                >
                    Conv2D
                </div>

                <div
                    className="tf-layer tf-layer__flatten"
                    draggable
                    onDragStart={(event) => onDragStart(event, 'TF_FLATTEN_LAYER_NODE')}
                >
                    Flatten
                </div>
            </div>

            <Header4Container className="dataset-splitting-options-header" text={t('architecture.dataset-splitting-options.title')} />
            <div className="dataset-splitting-options">
                <BeautifulSlider
                    value={train_split}
                    onChange={handleTrainChange}
                    onWheel={(e) => handleWheel(e, 'train')}
                    min={0}
                    max={1}
                    step={0.001}
                    color={PAGE_COLOR}
                    root="sidebar"
                    label={t('architecture.dataset-splitting-options.sliders.training-sample-size')}
                />

                <BeautifulSlider
                    value={test_split}
                    onChange={handleTestChange}
                    onWheel={(e) => handleWheel(e, 'test')}
                    min={0}
                    max={1}
                    step={0.001}
                    color={PAGE_COLOR}
                    root="sidebar"
                    label={t('architecture.dataset-splitting-options.sliders.test-sample-size')}
                />

                <BeautifulSlider
                    value={validation_split}
                    onChange={handleValidationChange}
                    onWheel={(e) => handleWheel(e, 'validation')}
                    min={0}
                    max={1}
                    step={0.001}
                    color={PAGE_COLOR}
                    root="sidebar"
                    label={t('architecture.dataset-splitting-options.sliders.validation-sample-size')}
                />
            </div>

            <Header4Container className="ai-model-options-header" text={t('architecture.ai-model-options.title')} />
            <div className="ai-model-options">
                <BeautifulComboBox
                    value={loss_function}
                    onChange={(e) => setLossFunction(e.target.value)}
                    root="sidebar"
                    label={t('architecture.ai-model-options.comboboxes.loss-function')}
                    placeholder="Select loss function"
                    color={PAGE_COLOR}
                >
                    <option value="binary_crossentropy">Binary crossentropy</option>
                    <option value="kld">KLD (Kullback-Leibler divergence)</option>
                    <option value="mae">MAE (Mean absolute error)</option>
                    <option value="mape">MAPE (Mean absolute percentage error)</option>
                    <option value="mse">MSE (Mean squared error)</option>
                    <option value="msle">MSLE (Mean squared logarithmic error)</option>
                    <option value="binary_focal_cross_entropy">Binary focal crossentropy</option>
                    <option value="categorical_cross_entropy">Categorical crossentropy</option>
                    <option value="categorical_focal_cross_entropy">Categorical focal crossentropy</option>
                    <option value="sparse_categorical_cross_entropy">Sparse categorical crossentropy</option>
                    <option value="cosine_similarity">Cosine similarity</option>
                    <option value="ctc">CTC (Connectionist temporal classification)</option>
                    <option value="dice">Dice</option>
                    <option value="hinge">Hinge</option>
                    <option value="squared_hinge">Squared hinge</option>
                    <option value="categorical_hinge">Categorical hinge</option>
                    <option value="huber">Huber</option>
                    <option value="reduction">Reduction</option>
                    <option value="poisson">Poisson</option>
                    <option value="tversky">Tversky</option>
                </BeautifulComboBox>

                <BeautifulComboBox
                    value={optimizer}
                    onChange={(e) => setOptimizer(e.target.value)}
                    root="sidebar"
                    label={t('architecture.ai-model-options.comboboxes.optimizer')}
                    placeholder="Select optimizer"
                    color={PAGE_COLOR}
                >
                    <option value="adadelta">Adadelta</option>
                    <option value="adafactor">Adafactor</option>
                    <option value="adagrad">Adagrad</option>
                    <option value="adam">Adam</option>
                    <option value="adamw">AdamW</option>
                    <option value="adamax">Adamax</option>
                    <option value="ftrl">Ftrl</option>
                    <option value="lion">Lion</option>
                    <option value="lso">LSO (Loss scale optimizer)</option>
                    <option value="nadam">Nadam</option>
                    <option value="rmsprop">RMSprop (Root mean squared propagation)</option>
                    <option value="sgd">SGD (Stochastic gradient descent)</option>
                </BeautifulComboBox>

                <BeautifulComboBox
                    value={quality_metric}
                    onChange={(e) => setQualityMetric(e.target.value)}
                    root="sidebar"
                    label={t('architecture.ai-model-options.comboboxes.quality-metric')}
                    placeholder="Select quality metric"
                    color={PAGE_COLOR}
                >
                    <option value="accuracy">Accuracy</option>
                    <option value="binary_accuracy">Binary accuracy</option>
                    <option value="categorical_accuracy">Categorical accuracy</option>
                    <option value="sparse_categorical_accuracy">Sparse categorical accuracy</option>
                    <option value="top_k_categorical_accuracy">Top K categorical accuracy</option>
                    <option value="sparse_top_k_categorical_accuracy">Sparse top K categorical accuracy</option>
                    <option value="auc">AUC (Area under the curve)</option>
                    <option value="average_precision_at_k">Average precision at K</option>
                    <option value="false_negatives">False negatives</option>
                    <option value="false_negatives_at_thresholds">False negatives at thresholds</option>
                    <option value="false_positives">False positives</option>
                    <option value="false_positives_at_thresholds">False positives at thresholds</option>
                    <option value="mean">Mean (Weighted mean)</option>
                    <option value="mean_absolute_error">MAE (Mean absolute error)</option>
                    <option value="mean_absolute_percentage_error">MAPE (Mean absolute percentage error)</option>
                    <option value="mean_cosine_distance">Mean cosine distance</option>
                    <option value="mean_per_class_accuracy">Mean per class accuracy</option>
                    <option value="mean_relative_error">Mean relative error</option>
                    <option value="mean_squared_error">MSE (Mean squared error)</option>
                    <option value="mean_squared_logarithmic_error">MSLE (Mean squared logarithmic error)</option>
                    <option value="mean_tensor">Mean tensor</option>
                    <option value="percentage_below">Percentage below</option>
                    <option value="precision">Precision</option>
                    <option value="precision_at_k">Precision at K</option>
                    <option value="precision_at_thresholds">Precision at thresholds</option>
                    <option value="precision_at_top_k">Precision at top K</option>
                    <option value="recall">Recall</option>
                    <option value="recall_at_k">Recall at K</option>
                    <option value="recall_at_thresholds">Recall at thresholds</option>
                    <option value="recall_at_top_k">Recall at top K</option>
                    <option value="root_mean_squared_error">Root mean squared error</option>
                    <option value="sensitivity_at_specificity">Sensitivity at specificity</option>
                    <option value="sparse_average_precision_at_k">Sparse average precision at K</option>
                    <option value="sparse_precision_at_k">Sparse precision at K</option>
                    <option value="specificity_at_sensitivity">Specificity at sensitivity</option>
                    <option value="true_negatives">True negatives</option>
                    <option value="true_negatives_at_thresholds">True negatives at thresholds</option>
                    <option value="true_positives">True positives</option>
                    <option value="true_positives_at_thresholds">True positives at thresholds</option>
                    <option value="binary_crossentropy">Binary crossentropy</option>
                    <option value="categorical_crossentropy">Categorical crossentropy</option>
                    <option value="categorical_hinge">Categorical hinge</option>
                    <option value="cosine_similarity">Cosine similarity</option>
                    <option value="f1_score">F1 Score</option>
                    <option value="f_beta_score">F beta score</option>
                    <option value="hinge">Hinge</option>
                    <option value="iou">IoU</option>
                    <option value="mean_iou">Mean IoU</option>
                    <option value="kld">KLD (Kullback-Leibler divergence)</option>
                    <option value="log_cosh_error">Log-Cosh error</option>
                    <option value="poisson">Poisson</option>
                    <option value="r2_score">R2 score</option>
                    <option value="squared_hinge">Squared hinge</option>
                    <option value="sum">Sum</option>
                </BeautifulComboBox>

                <BeautifulField
                    variant="variant-2"
                    value={epochs}
                    onChange={(e) => setEpochs(Number(e.target.value))}
                    onWheel={(e) => {
                        e.preventDefault(); // Предотвращаем стандартное поведение прокрутки
                        const step = e.deltaY > 0 ? -1 : 1; // Если прокрутка вниз, уменьшаем значение, если вверх — увеличиваем
                        const newValue = Math.max(1, Math.min(1000, epochs + step));
                        setEpochs(newValue); // Обновляем значение с ограничениями
                    }}
                    min={1}
                    max={1000}
                    step={1}
                    type="numeric"
                    label={t('architecture.ai-model-options.fields.number-of-training-epochs')}
                    color={PAGE_COLOR}
                    // readOnly={true}
                />

                <BeautifulField
                    variant="variant-2"
                    value={batch_size}
                    onChange={(e) => setBatchSize(Number(e.target.value))}
                    onWheel={(e) => {
                        e.preventDefault();
                        const step = e.deltaY > 0 ? -8 : 8;
                        const newValue = Math.max(8, Math.min(256, batch_size + step));
                        setBatchSize(newValue);
                    }}
                    min={8}
                    max={256}
                    step={8}
                    type="numeric"
                    label={t('architecture.ai-model-options.fields.mini-batch-size')}
                    color={PAGE_COLOR}
                />
            </div>

            <Header4Container className="additional-options-header" text={t('architecture.additional-options.title')} />
            <div className="additional-options">
                <BeautifulComboBox
                    value={enable_dataset_normalization ? 'on' : 'off'}
                    onChange={(e) => setEnableDatasetNormalization(e.target.value === 'on' ? true : false)}
                    root="sidebar"
                    label={t('architecture.additional-options.comboboxes.enable-dataset-normalization.title')}
                    color={PAGE_COLOR}
                >
                    <option value="off">{t('architecture.additional-options.comboboxes.enable-dataset-normalization.values.disable')}</option>
                    <option value="on">{t('architecture.additional-options.comboboxes.enable-dataset-normalization.values.enable')}</option>
                </BeautifulComboBox>
            </div>
        </aside>
    );
};

export default Sidebar;
