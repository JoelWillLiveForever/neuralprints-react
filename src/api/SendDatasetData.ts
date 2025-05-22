import Papa from 'papaparse';
import md5 from 'md5';

import { useDatasetStore } from '../store/DatasetStore';

import api from './API';
// import { requestWithPool } from './API';

// Функция для конвертации данных в CSV и отправки на сервер
const send_dataset_data = async () => {
    const { headers, _original_data, column_types, get_dataset_file } = useDatasetStore.getState();
    const dataset_file = get_dataset_file();

    if (!dataset_file) {
        throw new Error("Файл датасета не выбран.");
    }

    // получаем имя датасета
    const dataset_name = dataset_file.name;

    // Конвертируем данные в CSV
    const csv = Papa.unparse({
        fields: headers, // Заголовки
        data: _original_data, // Данные
    });

    // Формируем полезную нагрузку для отправки
    const payload = {
        dataset_name: dataset_name, // Название датасета
        column_types: column_types, // Информация о типах колонок
        csv_data: csv, // CSV строка
    };

    // Сериализуем для расчёта md5
    const payload_string = JSON.stringify(payload, null, 0); // без пробелов

    // Вычисляем md5 хэш полезной нагрузки
    const payload_md5 = md5(payload_string);

    let success = false;
    let attempts = 0;
    const max_attempts = 5; // Ограничим количество попыток, чтобы избежать вечного цикла

    while (!success && attempts < max_attempts) {
        try {

            const response = await api.post('/api/dataset/upload', {
                md5_client: payload_md5,
                payload,
            });
            // const response = await requestWithPool<{ md5_server: string }>({
            //     url: '/api/dataset/upload',
            //     method: 'POST',
            //     data: {
            //         md5_client: payload_md5,
            //         payload,
            //     },
            // });

            const server_md5 = response.data?.md5_server;

            if (server_md5 === payload_md5) {
                console.log('Успешная отправка датасета. Хэши совпали.');
                success = true;

                return response.data;
            } else {
                console.warn('Хэш датасета не совпал. Повторная попытка отправки...');
                attempts++;
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Ошибка:', error.message);
                throw new Error(`Ошибка отправки датасета: ${error.message}`);
            }
            throw error;
        }
    }

    if (!success) {
        throw new Error('Не удалось отправить датасет: превышено количество попыток отправки.');
    }
};

export default send_dataset_data;
