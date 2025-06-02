import { useTranslation } from 'react-i18next';

import { useEffect, useRef, useState } from 'react';
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { LazyLog } from '@melloware/react-logviewer';
import ProgressBar from 'react-bootstrap/ProgressBar';
import { saveAs } from 'file-saver'; // Установи через npm install file-saver

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
import { getModelHash } from '../../utils/GetModelHash';
import api from '../../api/API';
import { useTrainingStore } from '../../store/TrainingStore';

// Регистрация компонентов графика
ChartJS.register(LineElement, PointElement, LinearScale, CategoryScale, Tooltip, Legend, Title);

const DEFAULT_WIDTH_PX = 920;
const MIN_WIDTH_PX = 860;
const MAX_WIDTH_PX = 1400;

const PAGE_COLOR = '#689f38';

const PageTraining = () => {
    const { t, i18n } = useTranslation();

    const containerRef = useRef<HTMLDivElement>(null);
    const mainPanelRef = useRef<ImperativePanelHandle>(null);

    const getPct = (px: number) => {
        const containerWidth = containerRef.current?.getBoundingClientRect().width ?? window.innerWidth;
        return (px / containerWidth) * 100;
    };

    const [mainPanelDefaultSize, setMainPanelDefaultSize] = useState(getPct(DEFAULT_WIDTH_PX));
    const [mainPanelMinSize, setMainPanelMinSize] = useState(getPct(MIN_WIDTH_PX));
    const [mainPanelMaxSize, setMainPanelMaxSize] = useState(getPct(MAX_WIDTH_PX));

    // const [socket, setSocket] = useState<WebSocket | null>(null);

    // const [isTraining, setIsTraining] = useState(false);
    // const [isTrainingCompleted, setIsTrainingCompleted] = useState(false);

    const {
        // socket,
        isTrainingCompleted,

        // setSocket,
        // closeSocket,

        // setIsTrainingCompleted,
    } = useTrainingStore();

    const {
        epochs,

        // loss_function,
        getLossFunctionDisplayName,

        // quality_metric,
        getQualityMetricDisplayName,
    } = useArchitectureStore();

    const {
        // logs,

        setCurrentEpoch,
        getCurrentEpoch,

        // setLogs,
        getLogs,
        // getLogsAsString,

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

    // const myLogText = useMemo(() => logs.join('\n'), [logs]);

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
    // useEffect(() => {
    //     return () => {
    //         socket?.close();

    //         // setIsTraining(false);
    //         setIsTrainingCompleted(false);
    //     };
    // }, [socket]);

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
                    // max: 1,
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

    // где‑то в начале модуля, рядом с константами
    const host = window.location.hostname; // 'localhost' или '192.168.3.3' или 'myapp.com'
    const WS_PORT = 8000; // порт вашего FastAPI
    const WS_PATH = '/ws/train'; // путь вебсокета

    // собрали URL
    const socketUrl = `ws://${host}:${WS_PORT}${WS_PATH}`;

    const sendDatasetWithArchitectureAndStartModelTrain = async () => {
        const trainingStore = useTrainingStore.getState(); // единоразовое обращение
        const { setSocket, closeSocket, setIsTrainingCompleted } = trainingStore;

        try {
            // Очистить старые данные, если они есть
            resetAllValues();

            // setIsTraining(true);
            setIsTrainingCompleted(false);

            // Проверка датасета перед отправкой
            const dataset_file = useDatasetStore.getState().get_dataset_file();
            if (!dataset_file) {
                alert('Ошибка: файл датасета не выбран!');
                // setIsTraining(false);
                return;
            }

            // Отправка датасета
            try {
                await send_dataset_data();
            } catch (e) {
                alert('Ошибка при отправке данных датасета на сервер.');
                console.error(e);
                // setIsTraining(false);
                return;
            }

            // Безопасная отправка архитектуры
            try {
                await send_architecture_data();
            } catch (e) {
                if (e instanceof Error) {
                    alert(`Ошибка при отправке архитектуры: ${e.message}`);
                    console.error(e.message);
                } else {
                    alert('Неизвестная ошибка при отправке архитектуры!');
                    console.error(e);
                }
                // setIsTraining(false);
                return;
            }

            // Закрыть предыдущий сокет, если вдруг не закрыт
            closeSocket();

            // Открытие WebSocket соединения
            // const newSocket = new WebSocket('ws://localhost:8000/ws/train');
            const newSocket = new WebSocket(socketUrl);

            newSocket.onopen = () => {
                console.log('WebSocket connected');
                setSocket(newSocket);

                // Подготовка данных для обучения
                const architecture_hash = useArchitectureStore.getState().get_architecture_hash();
                if (!architecture_hash) {
                    addLog('Не удалось получить архитектурный хэш!');
                    console.error('Архитектура не выбрана.');
                    newSocket.close();
                    return;
                }

                // const dataset_name = dataset_file.name.replace(/\.csv$/i, '');
                const dataset_name = dataset_file.name;

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

                switch (data.type) {
                    case 'training_started':
                        // clearLogs();
                        addLog('Training started...');
                        break;

                    case 'log':
                        addLog(data.log_message);
                        break;

                    case 'training_update':
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

                        break;

                    case 'training_complete':
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

                        // setIsTraining(false);
                        setIsTrainingCompleted(true);
                        break;

                    case 'error':
                        // console.error('Training error:', data.message);

                        addLog(`SERVER_ERROR: ${data.message}`);
                        console.error('Ошибка сервера:', data.message);

                        // setIsTraining(false);
                        setIsTrainingCompleted(false);

                        break;

                    default:
                        console.warn('Неизвестный тип сообщения:', data);
                        addLog(`UNKNOWN_ERROR: ${data.message}`);
                        break;
                }
            };

            // Обработка ошибок WebSocket
            newSocket.onerror = (error) => {
                const errorMessage = error instanceof Error ? error.message : String(error);

                addLog(`ERROR: ${errorMessage}`);
                console.error('Ошибка:', errorMessage);

                // setIsTraining(false);
                setIsTrainingCompleted(false);
            };

            // Закрытие соединения
            newSocket.onclose = () => {
                console.log('WebSocket closed');

                // setSocket(null);
                useTrainingStore.getState().setSocket(null);
            };
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);

            addLog(`SOCKET_CLOSE_ERROR: ${errorMessage}`);
            console.error('Ошибка сокета:', errorMessage);

            // setIsTraining(false);
            setIsTrainingCompleted(false);

            const socket = trainingStore.socket;
            if (socket) {
                socket.close();
            }
        }
    };

    const getH5ModelFile = async () => {
        const modelHash = getModelHash();
        console.log(`[getH5ModelFile()] --- Хэш модели: ${modelHash}`);

        if (!modelHash) {
            alert('Не удалось вычислить хэш модели');
            return;
        }

        try {
            const response = await api.get(`/api/models/${modelHash}/download/h5`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const fileName = `${modelHash}.h5`;

            // Сохраняем файл у пользователя
            saveAs(blob, fileName);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Ошибка при загрузке модели:', error);
                alert('Ошибка при загрузке модели: ' + error.message);
            } else {
                alert('Произошла неизвестная ошибка!');
            }
        }
    };

    const getKerasModelFile = async () => {
        const modelHash = getModelHash();
        console.log(`[getH5ModelFile()] --- Хэш модели: ${modelHash}`);

        if (!modelHash) {
            alert('Не удалось вычислить хэш модели');
            return;
        }

        try {
            const response = await api.get(`/api/models/${modelHash}/download/keras`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/octet-stream' });
            const fileName = `${modelHash}.keras`;

            // Сохраняем файл у пользователя
            saveAs(blob, fileName);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Ошибка при загрузке модели:', error);
                alert('Ошибка при загрузке модели: ' + error.message);
            } else {
                alert('Произошла неизвестная ошибка!');
            }
        }
    };

    const getSavedModelArchive = async () => {
        const modelHash = getModelHash();
        console.log(`[getSavedModelArchive()] --- Хэш модели: ${modelHash}`);

        if (!modelHash) {
            alert('Не удалось вычислить хэш модели');
            return;
        }

        try {
            const response = await api.get(`/api/models/${modelHash}/download/savedmodel`, {
                responseType: 'blob',
            });

            const blob = new Blob([response.data], { type: 'application/zip' });
            const fileName = `${modelHash}_savedmodel.zip`;

            // Сохраняем файл у пользователя
            saveAs(blob, fileName);
        } catch (error) {
            if (error instanceof Error) {
                console.error('Ошибка при загрузке архива SavedModel:', error);
                alert('Ошибка при загрузке архива SavedModel: ' + error.message);
            } else {
                alert('Произошла неизвестная ошибка!');
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
                        <Header4Container text={t('training.status.title')} className="status__header" />
                        <div className="status__content">
                            <ProgressBar
                                now={(getCurrentEpoch() * 100.0) / epochs}
                                label={`${t('training.status.epoch')} ${getCurrentEpoch()} / ${epochs}`}
                                className="my-custom-progress-bar"
                            />
                        </div>
                    </div>

                    {/* // TODO: если логов нет, обозначить текст юзеру, что тут будут логи */}
                    <div className="logs">
                        <Header4Container text={t('training.logs')} className="logs__header" />
                        <div className="logs__content">
                            {/* <ScrollFollow
                                startFollowing={true}
                                render={({ follow, onScroll }) => (
                                    <LazyLog
                                        text={myLogText}
                                        follow={follow}
                                        onScroll={onScroll}
                                        extraLines={1}
                                        enableSearch
                                        caseInsensitive
                                        enableHotKeys
                                        selectableLines
                                        stream={false}
                                        theme="light" // если используешь кастомную тему — можно удалить
                                        containerStyle={{
                                            height: '100%', // Чтобы занять всю высоту контейнера
                                            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
                                            borderRadius: '6px',
                                            fontFamily: 'monospace',
                                            fontSize: '13px',
                                            backgroundColor: '#fff',
                                            color: '#333',
                                        }}
                                    />
                                )}
                            /> */}
                            <LazyLog
                                key={getLogs().length === 0 ? 'empty' : 'filled'}
                                text={getLogs().join('\n')}
                                follow={true}
                                extraLines={1}
                                enableSearch
                                caseInsensitive
                                enableHotKeys
                                selectableLines
                                stream={false}
                            />
                        </div>
                    </div>

                    <div className="performance-metrics">
                        <Header4Container
                            text={t('training.performance-metrics')}
                            className="performance-metrics__header"
                        />
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
                        <Header4Container text={t('training.controls')} className="controls__header" />
                        <div className="controls__content">
                            <Button onClick={sendDatasetWithArchitectureAndStartModelTrain} id="button-start-training">
                                {t('training.buttons.start-training.part-1')}
                                <br />
                                {t('training.buttons.start-training.part-2')}
                            </Button>

                            <div className="separator"></div>

                            <div className="buttons-block buttons-block--vertical" id="export-functions">
                                <Button disabled={!isTrainingCompleted} onClick={getH5ModelFile}>
                                    {t('training.buttons.get-h5')}
                                </Button>
                                <Button disabled={!isTrainingCompleted} onClick={getKerasModelFile}>
                                    {t('training.buttons.get-keras')}
                                </Button>
                                <Button disabled={!isTrainingCompleted} onClick={getSavedModelArchive}>
                                    {t('training.buttons.get-savedmodel')}
                                </Button>
                            </div>

                            <div className="separator"></div>

                            <div className="buttons-block buttons-block--vertical" id="compile-functions">
                                <Button disabled={!isTrainingCompleted}>{t('training.buttons.get-py')}</Button>
                                <Button disabled>{t('training.buttons.get-exe')}</Button>
                            </div>
                        </div>
                    </div>
                </Panel>

                <PanelResizeHandle className="my-custom-resize-handle my-custom-resize-handle--training" />

                <Panel defaultSize={100 - (mainPanelRef.current?.getSize() ?? mainPanelMaxSize)} className="charts-bar">
                    <Header4Container className="charts-bar__header" text={t('training.charts')} />
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
