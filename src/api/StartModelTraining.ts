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
    
    // получаем имя датасета без расширения (окончания) .csv
    const dataset_name = dataset_file.name.slice(0, -4);

    // Формируем полезную нагрузку для отправки
    const payload = {
        dataset_name: dataset_name, // Название датасета
        architecture_hash: architecture_hash, // Название архитектуры 
    };

    try {
        const response = await api.post('/api/tensorflow/train', payload);

        return response.data;
    } catch (error) {
        if (error instanceof Error) {
            console.error('Ошибка:', error.message);
            throw new Error(`Ошибка при запуске обучения модели: ${error.message}`);
        }

        throw error;
    }
};

export default start_model_training;