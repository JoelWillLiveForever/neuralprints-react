// import { useState } from 'react';

import { useArchitectureStore } from '../store/ArchitectureStore'; // Путь к хранилищу архитектуры
import { useDatasetStore } from '../store/DatasetStore'; // Путь к хранилищу датасета
import api from './API';

// Функция для конвертации данных в CSV и отправки на сервер
const start_model_training = async () => {
    const dataset_file = useDatasetStore.getState().get_dataset_file();
    const architecture_hash = useArchitectureStore.getState().get_architecture_hash();

    if (!dataset_file) {
        throw new Error("Файл датасета не выбран.");
    }

    if (!architecture_hash || architecture_hash === '') {
        throw new Error("Файл архитектуры не выбран.");
    }

    // получаем имя датасета
    // const dataset_name = dataset_file.name;
    
    // получаем имя датасета без расширения (окончания) .csv
    const dataset_name = dataset_file.name.slice(0, -4);

    // Формируем полезную нагрузку для отправки
    const payload = {
        dataset_name: dataset_name, // Название датасета
        architecture_hash: architecture_hash, // Название архитектуры 
    };

    // // Сериализуем для расчёта md5
    // const payload_string = JSON.stringify(payload, null, 0); // без пробелов

    try {
        // console.log(`JSON обучения:\n${payload_string}`);
        console.log(`JSON обучения:\n${JSON.stringify(payload)}`);

        const response = await api.post('/api/tensorflow/train', payload);

        // const server_md5 = response.data?.md5_server;

        // if (server_md5 === payload_md5) {
        //     console.log('Успешная отправка датасета. Хэши совпали.');
        //     success = true;

        //     return response.data;
        // } else {
        //     console.warn('Хэш датасета не совпал. Повторная попытка отправки...');
        //     attempts++;
        // }

        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Ошибка:', error.message);
            throw new Error(`Ошибка при запуске обучения модели: ${error.message}`);
        }

        throw error;
    }

    // // Сериализуем для расчёта md5
    // const payload_string = JSON.stringify(payload, null, 0); // без пробелов

    // // Вычисляем md5 хэш полезной нагрузки
    // const payload_md5 = md5(payload_string);

    // let success = false;
    // let attempts = 0;
    // const max_attempts = 5; // Ограничим количество попыток, чтобы избежать вечного цикла

    // while (!success && attempts < max_attempts) {
    //     try {
    //         const response = await api.post('/api/dataset/upload', {
    //             md5_client: payload_md5,
    //             payload,
    //         });

    //         const server_md5 = response.data?.md5_server;

    //         if (server_md5 === payload_md5) {
    //             console.log('Успешная отправка датасета. Хэши совпали.');
    //             success = true;

    //             return response.data;
    //         } else {
    //             console.warn('Хэш датасета не совпал. Повторная попытка отправки...');
    //             attempts++;
    //         }
    //     } catch (error) {
    //         if (error instanceof Error) {
    //             console.error('Ошибка:', error.message);
    //             throw new Error(`Ошибка отправки датасета: ${error.message}`);
    //         }
    //         throw error;
    //     }
    // }

    // if (!success) {
    //     throw new Error('Не удалось отправить датасет: превышено количество попыток отправки.');
    // }
};

export default start_model_training;