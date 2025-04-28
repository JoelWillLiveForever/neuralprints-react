import { useEffect, useRef, useState } from 'react';
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { LazyLog, ScrollFollow } from '@melloware/react-logviewer';

import {
    Chart as ChartJS,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Tooltip,
    Legend,
    Title,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

import './page_training.scss';
import { Button } from 'react-bootstrap';
import Header4Container from '../../components/header_4_container/Header4Container';
import send_architecture_data from '../../api/SendArchitectureData';

// Регистрация компонентов графика
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

const DEFAULT_WIDTH_PX = 687.5;
const MIN_WIDTH_PX = 575;
const MAX_WIDTH_PX = 800;

const PageTraining = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartPanelRef = useRef<ImperativePanelHandle>(null);

    const getPct = (px: number) => {
        const containerWidth = containerRef.current?.getBoundingClientRect().width ?? window.innerWidth;
        return (px / containerWidth) * 100;
    };

    const [chartDefaultSize, setChartDefaultSize] = useState(getPct(DEFAULT_WIDTH_PX));
    const [chartMinSize, setChartMinSize] = useState(getPct(MIN_WIDTH_PX));
    const [chartMaxSize, setChartMaxSize] = useState(getPct(MAX_WIDTH_PX));

    useEffect(() => {
        // Обновляем размеры панели графика на основе ширины окна
        const updateChartPanelSizes = () => {
            setChartDefaultSize(getPct(DEFAULT_WIDTH_PX));
            setChartMinSize(getPct(MIN_WIDTH_PX));
            setChartMaxSize(getPct(MAX_WIDTH_PX));
        };

        window.addEventListener('resize', updateChartPanelSizes);
        return () => window.removeEventListener('resize', updateChartPanelSizes);
    }, []);

    // Данные для графика
    const data = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
        datasets: [
            {
                label: 'Training Loss',
                data: [0.9, 0.7, 0.5, 0.4, 0.35, 0.3],
                fill: false,
                borderColor: '#4f46e5',
                tension: 0.3,
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        // aspectRatio: 1,
        plugins: {
            legend: {
                display: true,
            },
            title: {
                display: true,
                text: 'Training Progress',
            },
        },
    };

    const sendDatasetWithArchitectureAndStartModelTrain = async () => {
        try {
            await send_architecture_data();
            alert('Архитектура успешно отправлена!');
        } catch (error) {
            let errorMessage = 'Неизвестная ошибка';

            // Вариант 1: Проверка через instanceof
            if (error instanceof Error) {
                errorMessage = error.message;
            }

            // Вариант 2: Проверка типа через type guard
            // if (typeof error === 'object' && error !== null && 'message' in error) {
            //     errorMessage = (error as { message: string }).message;
            // }

            // Вариант 3: Универсальная обработка
            // errorMessage = String(error);

            alert(`Ошибка: ${errorMessage}`);
        }
    };

    return (
        <div className="page-training-container" ref={containerRef}>
            <PanelGroup autoSaveId="training_panels" direction="horizontal">
                <Panel defaultSize={100 - (chartPanelRef.current?.getSize() ?? chartMaxSize)}>
                    <PanelGroup className="left-side-panel" direction="vertical">
                        <Panel defaultSize={50}>
                            <div className="inference-view-wrapper"></div>
                        </Panel>
                        <PanelResizeHandle className="my-custom-resize-handle my-custom-resize-handle--vertical my-custom-resize-handle--training" />
                        <Panel defaultSize={50}>
                            <div className="log-view-wrapper">
                                {/* <ScrollFollow
                                    startFollowing={true}
                                    render={({ follow, onScroll }) => (
                                        <LazyLog url="http://example.log" stream follow={follow} onScroll={onScroll} />
                                    )}
                                /> */}
                            </div>
                        </Panel>
                    </PanelGroup>
                </Panel>

                <PanelResizeHandle className="my-custom-resize-handle my-custom-resize-handle--training" />

                <Panel defaultSize={chartDefaultSize} minSize={chartMinSize} maxSize={chartMaxSize} ref={chartPanelRef}>
                    <div className="right-side-panel">
                        <div className="chart-view">
                            <Header4Container className="chart-view__header" text="Charts" />
                            <div className="chart-view__content">
                                <Line data={data} options={options} />
                            </div>
                            <div className="chart-view__content">
                                <Line data={data} options={options} />
                            </div>
                        </div>

                        <div className="controls-view">
                            <Header4Container className="controls-view__header" text="Controls" />

                            <div className="controls-view__content">
                                <Button onClick={sendDatasetWithArchitectureAndStartModelTrain}>
                                    Start the AI model training process
                                </Button>
                                <Button>Export weights of a trained AI model</Button>
                                <Button>Compile the trained AI model into an executable file</Button>
                            </div>
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default PageTraining;
