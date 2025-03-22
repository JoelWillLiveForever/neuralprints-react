import { Node } from '@xyflow/react';

// Для пустого объекта лучше использовать {} или Record<string, never>
export type FlattenNodeData = Record<string, never>;

// Теперь тип будет удовлетворять constraint'ам
export type FlattenNodeType = Node<FlattenNodeData, 'TF_FLATTEN_LAYER_NODE'>;
