import { useEffect, useRef, useState } from 'react';
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { LazyLog, ScrollFollow } from '@melloware/react-logviewer';
import ProgressBar from 'react-bootstrap/ProgressBar';

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
    ChartData,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
// import { WebSocket } from 'websocket';

import './page_training.scss';
import { Button } from 'react-bootstrap';
import Header4Container from '../../components/header_4_container/Header4Container';
import send_architecture_data from '../../api/SendArchitectureData';
import send_dataset_data from '../../api/SendDatasetData';
import { useDatasetStore } from '../../store/DatasetStore';
import { useArchitectureStore } from '../../store/ArchitectureStore';
import BeautifulField from '../../components/beautiful_field/BeautifulField';
import {
    TrainingLossPoint,
    TrainingUserMetricPoint,
    useMetricStore,
    ValidationLossPoint,
    ValidationUserMetricPoint,
} from '../../store/MetricStore';

// Регистрация компонентов графика
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

const DEFAULT_WIDTH_PX = 900;
const MIN_WIDTH_PX = 800;
const MAX_WIDTH_PX = 1200;

const PAGE_COLOR = '#689f38';

const PageTraining = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const mainPanelRef = useRef<ImperativePanelHandle>(null);

    const getPct = (px: number) => {
        const containerWidth = containerRef.current?.getBoundingClientRect().width ?? window.innerWidth;
        return (px / containerWidth) * 100;
    };

    const [mainPanelDefaultSize, setMainPanelDefaultSize] = useState(getPct(DEFAULT_WIDTH_PX));
    const [mainPanelMinSize, setMainPanelMinSize] = useState(getPct(MIN_WIDTH_PX));
    const [mainPanelMaxSize, setMainPanelMaxSize] = useState(getPct(MAX_WIDTH_PX));

    const [socket, setSocket] = useState<WebSocket | null>(null);

    const {
        epochs,

        // loss_function,
        getLossFunctionDisplayName,

        // quality_metric,
        getQualityMetricDisplayName,
    } = useArchitectureStore();

    const {
        setCurrentEpoch,
        getCurrentEpoch,

        setLogs,
        getLogs,
        getLogsAsString,

        setTrainAccuracy,
        getTrainAccuracy,
        setTestAccuracy,
        getTestAccuracy,
        setValidationAccuracy,
        getValidationAccuracy,

        setTrainLoss,
        getTrainLoss,
        setTestLoss,
        getTestLoss,
        setValidationLoss,
        getValidationLoss,

        setPrecision,
        getPrecision,
        setRecall,
        getRecall,
        setF1Score,
        getF1Score,
        setAucRoc,
        getAucRoc,

        // setChartDataTrainingLoss,
        // setChartDataValidationLoss,
        // setChartDataTrainingUserMetric,
        // setChartDataValidationUserMetric,

        getChartDataTrainingLoss,
        getChartDataValidationLoss,
        getChartDataTrainingUserMetric,
        getChartDataValidationUserMetric,

        addLog,

        addPointToTrainingLoss,
        addPointToValidationLoss,
        addPointToTrainingUserMetric,
        addPointToValidationUserMetric,

        // clearTrainingLoss,
        // clearValidationLoss,
        // clearTrainingUserMetric,
        // clearValidationUserMetric,

        // clearLogs,

        resetAllValues,
    } = useMetricStore();

    useEffect(() => {
        // Обновляем размеры панели графика на основе ширины окна
        const updateMainPanelSizes = () => {
            setMainPanelDefaultSize(getPct(DEFAULT_WIDTH_PX));
            setMainPanelMinSize(getPct(MIN_WIDTH_PX));
            setMainPanelMaxSize(getPct(MAX_WIDTH_PX));
        };

        window.addEventListener('resize', updateMainPanelSizes);
        return () => window.removeEventListener('resize', updateMainPanelSizes);
    }, []);

    // Закрываем сокет при уходе со страницы
    useEffect(() => {
        return () => {
            socket?.close();
        };
    }, [socket]);

    const lossMetricChart = (): {
        data: ChartData<'line', TrainingLossPoint[] | ValidationLossPoint[]>;
        options: ChartOptions<'line'>;
    } => ({
        data: {
            datasets: [
                {
                    label: 'Training loss',
                    data: getChartDataTrainingLoss(),
                    fill: false,
                    borderColor: 'rgba(25,118,210,1)',
                    backgroundColor: 'rgba(25,118,210,0.38)',
                    pointRadius: 0,
                    tension: 0.35,
                    parsing: {
                        xAxisKey: 'epoch',
                        yAxisKey: 'training_loss',
                    },
                },
                {
                    label: 'Validation loss',
                    data: getChartDataValidationLoss(),
                    fill: false,
                    borderColor: 'rgba(211,47,47,1)',
                    backgroundColor: 'rgba(211,47,47,0.38)',
                    pointRadius: 0,
                    tension: 0.35,
                    parsing: {
                        xAxisKey: 'epoch',
                        yAxisKey: 'validation_loss',
                    },
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0,
            },
            plugins: {
                legend: { display: true, position: 'top' },
                title: { display: true, text: `Training vs Validation Loss — ${getLossFunctionDisplayName()}` },
            },
            scales: {
                x: {
                    type: 'linear',
                    min: 1,
                    max: getCurrentEpoch(),
                    title: { display: true, text: 'Epoch' },
                },
                y: {
                    min: 0,
                    max: 1,
                    title: { display: true, text: 'Loss' },
                },
            },
        },
    });

    const userMetricChart = (): {
        data: ChartData<'line', TrainingUserMetricPoint[] | ValidationUserMetricPoint[]>;
        options: ChartOptions<'line'>;
    } => ({
        data: {
            datasets: [
                {
                    label: `Training ${getQualityMetricDisplayName(false)}`,
                    data: getChartDataTrainingUserMetric(),
                    fill: false,
                    borderColor: 'rgba(0,121,107,1)',
                    backgroundColor: 'rgba(0,121,107,0.38)',
                    pointRadius: 0,
                    tension: 0.35,
                    parsing: {
                        xAxisKey: 'epoch',
                        yAxisKey: 'training_user_metric',
                    },
                },
                {
                    label: `Validation ${getQualityMetricDisplayName(false)}`,
                    data: getChartDataValidationUserMetric(),
                    fill: false,
                    borderColor: 'rgba(123,31,162,1)',
                    backgroundColor: 'rgba(123,31,162,0.38)',
                    pointRadius: 0,
                    tension: 0.35,
                    parsing: {
                        xAxisKey: 'epoch',
                        yAxisKey: 'validation_user_metric',
                    },
                },
            ],
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: {
                duration: 0,
            },
            plugins: {
                legend: { display: true, position: 'top' },
                title: { display: true, text: `Training vs Validation Metric — ${getQualityMetricDisplayName(true)}` },
            },
            scales: {
                x: {
                    type: 'linear',
                    min: 1,
                    max: getCurrentEpoch(),
                    title: { display: true, text: 'Epoch' },
                },
                y: {
                    min: 0,
                    max: 1,
                    title: { display: true, text: `${getQualityMetricDisplayName(true)}` },
                },
            },
        },
    });

    const sendDatasetWithArchitectureAndStartModelTrain = async () => {
        try {
            // Очистить старые данные, если они есть
            resetAllValues();

            // Отправка данных
            await send_dataset_data();
            await send_architecture_data();

            // Открытие WebSocket соединения
            const newSocket = new WebSocket('ws://localhost:8000/ws/train');

            newSocket.onopen = () => {
                console.log('WebSocket connected');
                setSocket(newSocket);

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

                if (data.type === 'training_started') {
                    // clearLogs();
                    addLog('Training started...');
                } else if (data.type === 'log') {
                    addLog(data.log_message);
                } else if (data.type === 'training_update') {
                    setCurrentEpoch(data.current_epoch);

                    addPointToTrainingLoss({ epoch: data.current_epoch, training_loss: data.training_loss });
                    addPointToValidationLoss({ epoch: data.current_epoch, validation_loss: data.validation_loss });
                    addPointToTrainingUserMetric({
                        epoch: data.current_epoch,
                        training_user_metric: data.training_user_metric,
                    });
                    addPointToValidationUserMetric({
                        epoch: data.current_epoch,
                        validation_user_metric: data.validation_user_metric,
                    });
                } else if (data.type === 'training_complete') {
                    console.log('Training complete!');
                    addLog('Training complete!');

                    setTrainAccuracy(data.final_train_accuracy);
                    setTestAccuracy(data.final_test_accuracy);
                    setValidationAccuracy(data.final_validation_accuracy);

                    setTrainLoss(data.final_train_loss);
                    setTestLoss(data.final_test_loss);
                    setValidationLoss(data.final_validation_loss);

                    setPrecision(data.final_precision);
                    setRecall(data.final_recall);
                    setF1Score(data.final_f1_score);
                    setAucRoc(data.final_auc_roc);
                } else if (data.type === 'error') {
                    console.error('Training error:', data.message);
                }
            };

            // Обработка ошибок WebSocket
            newSocket.onerror = (error) => {
                console.error('WebSocket error:', error);
            };

            // Закрытие соединения
            newSocket.onclose = () => {
                console.log('WebSocket closed');
                setSocket(null);
            };
        } catch (error) {
            // Обработка ошибок
            console.error('Ошибка:', error instanceof Error ? error.message : String(error));
            if (socket) {
                socket.close();
            }
        }
    };

    return (
        <div className="page-training-container" ref={containerRef}>
            <PanelGroup autoSaveId="training_panels" direction="horizontal">
                <Panel
                    defaultSize={mainPanelDefaultSize}
                    minSize={mainPanelMinSize}
                    maxSize={mainPanelMaxSize}
                    ref={mainPanelRef}
                    className="main-content"
                >
                    <div className="status">
                        <Header4Container text="Status" className="status__header" />
                        <div className="status__content">
                            <ProgressBar
                                now={getCurrentEpoch()}
                                label={`Epoch ${getCurrentEpoch()} / ${epochs}`}
                                className="my-custom-progress-bar"
                            />
                        </div>
                    </div>

                    {/* // TODO: если логов нет, обозначить текст юзеру, что тут будут логи */}
                    <div className="logs">
                        <Header4Container text="Logs" className="logs__header" />
                        <div className="logs__content">
                            <LazyLog text={getLogs().join('\n')} enableSearch={true} follow={true} selectableLines />
                        </div>
                    </div>

                    <div className="performance-metrics">
                        <Header4Container text="Performance metrics" className="performance-metrics__header" />
                        <div className="performance-metrics__content">
                            <div className="readonly-fields-block">
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="Train accuracy"
                                    readOnly={true}
                                    value={getTrainAccuracy() < 0 ? 'N/A' : getTrainAccuracy().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="Test accuracy"
                                    readOnly={true}
                                    value={getTestAccuracy() < 0 ? 'N/A' : getTestAccuracy().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="Validation accuracy"
                                    readOnly={true}
                                    value={getValidationAccuracy() < 0 ? 'N/A' : getValidationAccuracy().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                            </div>
                            <div className="readonly-fields-block">
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="Train loss"
                                    readOnly={true}
                                    value={getTrainLoss() < 0 ? 'N/A' : getTrainLoss().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="Test loss"
                                    readOnly={true}
                                    value={getTestLoss() < 0 ? 'N/A' : getTestLoss().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="Validation loss"
                                    readOnly={true}
                                    value={getValidationLoss() < 0 ? 'N/A' : getValidationLoss().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                            </div>
                            <div className="readonly-fields-block">
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="Precision"
                                    readOnly={true}
                                    value={getPrecision() < 0 ? 'N/A' : getPrecision().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="Recall"
                                    readOnly={true}
                                    value={getRecall() < 0 ? 'N/A' : getRecall().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="F1-score"
                                    readOnly={true}
                                    value={getF1Score() < 0 ? 'N/A' : getF1Score().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="text"
                                    label="AUC-ROC"
                                    readOnly={true}
                                    value={getAucRoc() < 0 ? 'N/A' : getAucRoc().toFixed(3)}
                                    color={PAGE_COLOR}
                                />
                            </div>
                        </div>
                    </div>

                    {/* <div className="confusion-matrix">
                        <Header4Container text="Confusion matrix" className="confusion-matrix__header" />
                        <div className="confusion-matrix__content">
                            <div className="readonly-fields-block">
                                <BeautifulField
                                    variant="variant-2"
                                    type="numeric"
                                    label="True positive (TP)"
                                    readOnly={true}
                                    value={10}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="numeric"
                                    label="False negative (FN)"
                                    readOnly={true}
                                    value={10}
                                    color={PAGE_COLOR}
                                />
                            </div>
                            <div className="readonly-fields-block">
                                <BeautifulField
                                    variant="variant-2"
                                    type="numeric"
                                    label="False positive (FP)"
                                    readOnly={true}
                                    value={10}
                                    color={PAGE_COLOR}
                                />
                                <BeautifulField
                                    variant="variant-2"
                                    type="numeric"
                                    label="True negative (TN)"
                                    readOnly={true}
                                    value={10}
                                    color={PAGE_COLOR}
                                />
                            </div>
                        </div>
                    </div> */}

                    <div className="controls">
                        <Header4Container text="Controls" className="controls__header" />
                        <div className="controls__content">
                            <Button onClick={sendDatasetWithArchitectureAndStartModelTrain} id="button-start-training">
                                START TRAINING
                            </Button>

                            <div className="separator"></div>

                            <div className="buttons-block buttons-block--vertical">
                                <Button>Get *.H5</Button>
                                <Button>Get *.SavedModel</Button>
                            </div>

                            <div className="separator"></div>

                            <div className="buttons-block buttons-block--vertical">
                                <Button>Get *.PY</Button>
                                <Button>Get *.EXE</Button>
                            </div>
                        </div>
                    </div>
                </Panel>

                <PanelResizeHandle className="my-custom-resize-handle my-custom-resize-handle--training" />

                <Panel defaultSize={100 - (mainPanelRef.current?.getSize() ?? mainPanelMaxSize)} className="charts-bar">
                    <Header4Container className="charts-bar__header" text="Charts" />
                    <div className="charts-bar__content">
                        <div className="chart">
                            <Line key="loss-metric-chart" {...lossMetricChart()} />
                        </div>
                        <div className="chart">
                            <Line key="user-metric-chart" {...userMetricChart()} />
                        </div>
                    </div>
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default PageTraining;

{
    /* <PanelGroup className="left-side-panel" direction="vertical">
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
                    </PanelGroup> */
}
