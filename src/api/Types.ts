// Импортируем данные каждого слоя из соответствующих компонентов
import { InputNodeData } from "../components/nodes/input/InputNodeProps";
import { DenseNodeData } from "../components/nodes/dense/DenseNodeProps";
import { DropoutNodeData } from "../components/nodes/dropout/DropoutNodeProps";
import { GaussianDropoutNodeData } from "../components/nodes/gaussian_dropout/GaussianDropoutNodeProps";
import { GaussianNoiseNodeData } from "../components/nodes/gaussian_noise/GaussianNoiseNodeProps";
import { FlattenNodeData } from "../components/nodes/flatten/FlattenNodeProps";
import { Conv2DNodeData } from "../components/nodes/conv_2d/Conv2DNodeProps";


// Основной тип слоя: объединяет все возможные варианты узлов
export type Layer = 
    | { type: 'TF_INPUT_LAYER_NODE'; data: InputNodeData }
    | { type: 'TF_DENSE_LAYER_NODE'; data: DenseNodeData }
    | { type: 'TF_DROPOUT_LAYER_NODE'; data: DropoutNodeData }
    | { type: 'TF_GAUSSIAN_DROPOUT_LAYER_NODE'; data: GaussianDropoutNodeData }
    | { type: 'TF_GAUSSIAN_NOISE_LAYER_NODE'; data: GaussianNoiseNodeData }
    | { type: 'TF_FLATTEN_LAYER_NODE'; data: FlattenNodeData }
    | { type: 'TF_CONV_2D_LAYER_NODE'; data: Conv2DNodeData };


// Payload, который отправляется на бэкенд или используется внутри приложения
export type ArchitecturePayload = {
    layers: Layer[];
    train_split: number;
    test_split: number;
    validation_split: number;
    loss_function: string;
    optimizer: string;
    quality_metric: string;
    epochs: number;
    batch_size: number;
    enable_dataset_normalization: boolean;
}