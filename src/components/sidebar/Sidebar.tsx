import React from 'react';
import { useDnD } from '../../context/DnDContext';

import Header4Container from '../header_4_container/Header4Container';

import './sidebar.scss';
import BeautifulSlider from '../beautiful_slider/BeautifulSlider';

import { useArchitectureStore } from '../../store/ArchitectureStore';

const Sidebar: React.FC = () => {
    const [, setType] = useDnD();

    // Забираем данные из Zustand
    const { train_split, setTrainSplit } = useArchitectureStore();
    const { test_split, setTestSplit } = useArchitectureStore();
    const { validation_split, setValidationSplit } = useArchitectureStore();

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

    return (
        <aside className="sidebar">
            <div className="tf-nodes-container">
                <Header4Container className="tf-nodes-container__header" text="TensorFlow layers" />

                <div className="tf-nodes-container__body">
                    <div
                        className="tf-node tf-node__input"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_INPUT_LAYER_NODE')}
                    >
                        Input
                    </div>

                    <div
                        className="tf-node tf-node__dense"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_DENSE_LAYER_NODE')}
                    >
                        Dense
                    </div>

                    <div
                        className="tf-node tf-node__dropout"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_DROPOUT_LAYER_NODE')}
                    >
                        Dropout
                    </div>

                    <div
                        className="tf-node tf-node__gaussian-dropout"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_GAUSSIAN_DROPOUT_LAYER_NODE')}
                    >
                        Gaussian Dropout
                    </div>

                    <div
                        className="tf-node tf-node__gaussian-noise"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_GAUSSIAN_NOISE_LAYER_NODE')}
                    >
                        Gaussian Noise
                    </div>
                </div>
            </div>

            <div className="dataset-division-block">
                <Header4Container className="dataset-division-block__header" text="Dataset splitting options" />

                <div className="dataset-division-block__body">
                    <BeautifulSlider
                        value={train_split}
                        onChange={handleTrainChange}
                        onWheel={(e) => handleWheel(e, 'train')}
                        min={0}
                        max={1}
                        step={0.001}
                        color="#ffa000"
                        type="sidebar"
                        label="Training sample size"
                    />

                    <BeautifulSlider
                        value={test_split}
                        onChange={handleTestChange}
                        onWheel={(e) => handleWheel(e, 'test')}
                        min={0}
                        max={1}
                        step={0.001}
                        color="#ffa000"
                        type="sidebar"
                        label="Test sample size"
                    />

                    <BeautifulSlider
                        value={validation_split}
                        onChange={handleValidationChange}
                        onWheel={(e) => handleWheel(e, 'validation')}
                        min={0}
                        max={1}
                        step={0.001}
                        color="#ffa000"
                        type="sidebar"
                        label="Validation sample size"
                    />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
