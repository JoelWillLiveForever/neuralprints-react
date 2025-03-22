import { Node } from '@xyflow/react';

// Определяем ТОЛЬКО данные узла с использованием type
export type Conv2DNodeData = {
    tf_layer_name: string;

    // Number of filters (kernels) applied in the convolution. Determines the number of output channels
    tf_layer_filters_count: number;

    // Size of the kernel (filter) as a 2D array [width, height]
    tf_layer_kernel_size: [number, number];
    
    // tf_layer_kernel_width: number;
    // tf_layer_kernel_height: number;

    tf_layer_activation_function: string;
    tf_layer_use_bias: boolean;

    // tf_layer_kernel_initializer: string;
    // tf_layer_bias_initializer: string;
}

// Создаем полный тип узла с указанием типа узла
export type Conv2DNodeType = Node<Conv2DNodeData, 'TF_CONV_2D_LAYER_NODE'>;