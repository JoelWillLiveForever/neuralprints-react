import { useArchitectureStore } from '../store/ArchitectureStore';

import api from './API';
import { ArchitecturePayload } from './Types';
import { build_architecture_data } from '../utils/BuildArchitectureData';

const send_architecture_data = async () => {
    try {
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
        } = useArchitectureStore.getState(); // Получаем всё из стора

        // преобразуем данные графа (React Flow) в данные архитектуры ИИ
        const architecture = build_architecture_data(nodes, edges);

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

        const response = await api.post('/architecture', payload);

        // console.log('Успешно отправлено:', response.data);

        return response.data;
    } catch (error) {
        // console.error('Ошибка при отправке:', error);

        if (error instanceof Error) {
            console.error("Validation error:", error.message);
            throw new Error(`Ошибка архитектуры: ${error.message}`);
        }
        throw error;
    }
};

export default send_architecture_data;
