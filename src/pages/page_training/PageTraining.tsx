import { useCallback, useEffect, useRef, useState } from 'react';
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
    ChartOptions,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import { WebSocket } from 'websocket';

import './page_training.scss';
import { Button } from 'react-bootstrap';
import Header4Container from '../../components/header_4_container/Header4Container';
import send_architecture_data from '../../api/SendArchitectureData';
import send_dataset_data from '../../api/SendDatasetData';
import start_model_training from '../../api/StartModelTraining';
import { useDatasetStore } from '../../store/DatasetStore';
import { useArchitectureStore } from '../../store/ArchitectureStore';

// Регистрация компонентов графика
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

const DEFAULT_WIDTH_PX = 687.5;
const MIN_WIDTH_PX = 575;
const MAX_WIDTH_PX = 800;

interface ChartData {
    loss: { x: number; y: number }[];
    valLoss: { x: number; y: number }[];
    metric: { x: number; y: number }[];
    valMetric: { x: number; y: number }[];
}

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

    const [chartData, setChartData] = useState<ChartData>({
        loss: [],
        valLoss: [],
        metric: [],
        valMetric: [],
    });

    const [socket, setSocket] = useState<WebSocket | null>(null);
    const [isTraining, setIsTraining] = useState(false);

    const [metricName, setMetricName] = useState('Metric');

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

    // useEffect(() => {
    //     const ws = new WebSocket('ws://localhost:8000/ws/train');

    //     ws.onmessage = (event) => {
    //         const data = JSON.parse(event.data);

    //         // Добавляем логирование для отладки
    //         console.log('WebSocket message:', data);

    //         if (data.type === 'training_update') {
    //             setChartData((prev) => ({
    //                 loss: [...prev.loss, { x: data.epoch, y: data.loss }],
    //                 valLoss: [...prev.valLoss, { x: data.epoch, y: data.val_loss }],
    //                 metric: [...prev.metric, { x: data.epoch, y: data.metric }],
    //                 valMetric: [...prev.valMetric, { x: data.epoch, y: data.val_metric }],
    //             }));

    //             if (data.metric !== undefined && !metricName) {
    //                 setMetricName(data.metric_name || 'Metric');
    //             }
    //         }

    //         if (data.type === 'error') {
    //             console.error('Training error: ', data.message);
    //         }
    //     };

    //     setSocket(ws);
    //     return () => ws.close();
    // }, [metricName]);

    // Изменяем способ создания данных для графиков
    const getChartData = useCallback(
        () => ({
            loss: chartData.loss,
            valLoss: chartData.valLoss,
            metric: chartData.metric,
            valMetric: chartData.valMetric,
        }),
        [chartData]
    );

    // // Данные для графика
    // const data = {
    //     labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    //     datasets: [
    //         {
    //             label: 'Training Loss',
    //             data: [0.9, 0.7, 0.5, 0.4, 0.35, 0.3],
    //             fill: false,
    //             borderColor: '#4f46e5',
    //             tension: 0.3,
    //         },
    //     ],
    // };

    // Настроки графиков
    const options: ChartOptions<'line'> = {
        responsive: true,
        // aspectRatio: 1,
        maintainAspectRatio: false,
        animation: {
            duration: 0, // Убираем анимацию для мгновенного обновления
        },
        scales: {
            x: {
                type: 'linear',
                title: { display: true, text: 'Epoch' },
            },
            y: {
                title: { display: true, text: 'Value' },
            },
        },
        // plugins: {
        //     legend: {
        //         display: true,
        //     },
        //     title: {
        //         display: true,
        //         text: 'Training Progress',
        //     },
        // },
    } as const;

    const sendDatasetWithArchitectureAndStartModelTrain = async () => {
        try {
            // Отправка данных
            await send_dataset_data();
            await send_architecture_data();

            // Открытие WebSocket соединения
            const newSocket = new WebSocket('ws://localhost:8000/ws/train');

            newSocket.onopen = () => {
                console.log('WebSocket connected');
                setSocket(newSocket);
                setIsTraining(true);

                // Подготовка данных для обучения
                const dataset_file = useDatasetStore.getState().get_dataset_file();
                const architecture_hash = useArchitectureStore.getState().get_architecture_hash();

                if (!dataset_file) {
                    console.error('Файл датасета не выбран.');
                    return;
                }

                if (!architecture_hash) {
                    console.error('Архитектура не выбрана.');
                    return;
                }

                const dataset_name = dataset_file.name.replace(/\.csv$/i, '');

                const payload = {
                    type: 'start_training',
                    dataset_name: dataset_name,
                    architecture_hash: architecture_hash,
                };

                // Отправка данных для старта обучения
                newSocket.send(JSON.stringify(payload));
            };

            // Обработка сообщений от сервера
            newSocket.onmessage = (event) => {
                const data = JSON.parse(event.data);
                console.log('WebSocket message:', data);

                if (data.type === 'training_update') {
                    setChartData((prev) => ({
                        loss: [...prev.loss, { x: data.epoch, y: data.loss }],
                        valLoss: [...prev.valLoss, { x: data.epoch, y: data.val_loss }],
                        metric: [...prev.metric, { x: data.epoch, y: data.metric }],
                        valMetric: [...prev.valMetric, { x: data.epoch, y: data.val_metric }],
                    }));

                    if (!metricName && data.metric_name) {
                        setMetricName(data.metric_name);
                    }
                }

                if (data.type === 'training_complete') {
                    console.log('Training complete!');
                    setIsTraining(false); // Завершаем обучение на клиенте
                }

                if (data.type === 'error') {
                    console.error('Training error:', data.message);
                    setIsTraining(false); // Завершаем обучение на клиенте
                }
            };

            // Обработка ошибок WebSocket
            newSocket.onerror = (error) => {
                console.error('WebSocket error:', error);
                setIsTraining(false);
            };

            // Закрытие соединения
            newSocket.onclose = () => {
                console.log('WebSocket closed');
                setIsTraining(false);
                setSocket(null);
            };
        } catch (error) {
            // Обработка ошибок
            console.error('Ошибка:', error instanceof Error ? error.message : String(error));
            if (socket) {
                socket.close();
            }
            setIsTraining(false);
        }
    };

    // Закрываем сокет при уходе со страницы
    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, [socket]);

    return (
        <div className="page-training-container" ref={containerRef}>
            <PanelGroup autoSaveId="training_panels" direction="horizontal">
                <Panel defaultSize={100 - (chartPanelRef.current?.getSize() ?? chartMaxSize)}>
                    {/* <PanelGroup className="left-side-panel" direction="vertical">
                        <Panel defaultSize={50}>
                            <div className="inference-view-wrapper"></div>
                        </Panel>
                        <PanelResizeHandle className="my-custom-resize-handle my-custom-resize-handle--vertical my-custom-resize-handle--training" />
                        <Panel defaultSize={50}>
                            <div className="log-view-wrapper">
                                <ScrollFollow
                                    startFollowing={true}
                                    render={({ follow, onScroll }) => (
                                        <LazyLog url="http://example.log" stream follow={follow} onScroll={onScroll} />
                                    )}
                                />
                            </div>
                        </Panel>
                    </PanelGroup> */}

                    <Header4Container text='Logs' />
                    <div>

                    </div>

                    <Header4Container text='Performance metrics' />
                    <div>

                    </div>

                    <Header4Container text='Controls' />
                    <div>

                    </div>

                </Panel>

                <PanelResizeHandle className="my-custom-resize-handle my-custom-resize-handle--training" />

                <Panel defaultSize={chartDefaultSize} minSize={chartMinSize} maxSize={chartMaxSize} ref={chartPanelRef}>
                    <div className="right-side-panel">
                        <div className="chart-view">
                            <Header4Container className="chart-view__header" text="Charts" />
                            <div className="chart-view__content">
                                <Line
                                    key="loss-chart"
                                    data={{
                                        datasets: [
                                            {
                                                label: 'Training Loss',
                                                data: getChartData().loss,
                                                borderColor: 'rgb(255, 99, 132)',
                                                tension: 0.1,
                                            },
                                            {
                                                label: 'Validation Loss',
                                                data: getChartData().valLoss,
                                                borderColor: 'rgb(54, 162, 235)',
                                                tension: 0.1,
                                            },
                                        ],
                                    }}
                                    options={options}
                                />
                            </div>
                            <div className="chart-view__content">
                                <Line
                                    key="metric-chart"
                                    data={{
                                        datasets: [
                                            {
                                                label: `Training ${metricName}`,
                                                data: getChartData().metric,
                                                borderColor: 'rgb(75, 192, 192)',
                                                tension: 0.1,
                                            },
                                            {
                                                label: `Validation ${metricName}`,
                                                data: getChartData().valMetric,
                                                borderColor: 'rgb(153, 102, 255)',
                                                tension: 0.1,
                                            },
                                        ],
                                    }}
                                    options={options}
                                />
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
