import md5 from 'md5';

import { useArchitectureStore } from '../store/ArchitectureStore';

import api from './API';
import { ArchitecturePayload } from './Types';
import { build_architecture_data } from '../utils/BuildArchitectureData';

import { Node as RFNode } from '@xyflow/react';
import { Layer } from '../api/Types';

type TypedNode = RFNode<{ [key: string]: unknown }, Layer['type']>;

// Тип для объекта с произвольными ключами и значениями
type AnyObject = { [key: string]: unknown };

// Функция для сортировки ключей в объекте
function sortObjectKeys(obj: unknown): unknown {
    if (Array.isArray(obj)) {
        // Если это массив, рекурсивно сортируем каждый элемент
        return obj.map(sortObjectKeys);
    } else if (obj !== null && typeof obj === 'object') {
        // Если это объект, сортируем ключи
        const sortedObj: AnyObject = {}; // Объект с отсортированными ключами
        Object.keys(obj).sort().forEach(key => {
            sortedObj[key] = sortObjectKeys((obj as AnyObject)[key]); // Рекурсивно сортируем значения
        });
        return sortedObj;
    }
    return obj;  // Примитивы остаются без изменений
}

const send_architecture_data = async () => {
    const {
        nodes,
        edges,
        train_split,
        test_split,
        validation_split,
        loss_function,
        optimizer,
        quality_metric,
        epochs,
        batch_size,
        enable_dataset_normalization,

        set_architecture_hash,
    } = useArchitectureStore.getState(); // Получаем всё из стора

    // преобразуем данные графа (React Flow) в данные архитектуры ИИ
    // const architecture = build_architecture_data(nodes, edges);

    const typedNodes = nodes as TypedNode[];
    const architecture = build_architecture_data(typedNodes, edges);

    const payload: ArchitecturePayload = {
        layers: architecture,
        train_split,
        test_split,
        validation_split,
        loss_function,
        optimizer,
        quality_metric,
        epochs,
        batch_size,
        enable_dataset_normalization,
    };

    // Сортируем объект перед сериализацией
    const sortedPayload = sortObjectKeys(payload);

    // Сериализуем для расчёта md5
    const payload_string = JSON.stringify(sortedPayload, null, 0); // без пробелов

    // Вычисляем md5 хэш полезной нагрузки
    const payload_md5 = md5(payload_string);

    let success = false;
    let attempts = 0;
    const max_attempts = 5; // Ограничим количество попыток, чтобы избежать вечного цикла

    while (!success && attempts < max_attempts) {
        try {
            // console.log(`JSON архитектуры:\n${payload_string}`);

            const response = await api.post('/api/architecture/upload', {
                md5_client: payload_md5,
                payload,
            });

            const server_md5 = response.data?.md5_server;

            if (server_md5 === payload_md5) {
                console.log('Успешная отправка архитектуры. Хэши совпали.');
                success = true;

                set_architecture_hash(payload_md5);

                return response.data;
            } else {
                console.warn('Хэш архитектуры не совпал. Повторная попытка отправки...');
                attempts++;
            }
        } catch (error) {
            if (error instanceof Error) {
                console.error('Ошибка:', error.message);
                throw new Error(`Ошибка отправки архитектуры: ${error.message}`);
            }
            throw error;
        }
    }

    if (!success) {
        throw new Error('Не удалось отправить архитектуру: превышено количество попыток отправки.');
    }
};

export default send_architecture_data;
