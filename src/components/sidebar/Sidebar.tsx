import React from 'react';
import { useDnD } from '../../context/DnDContext';

import './sidebar.scss';

const Sidebar: React.FC = () => {
    const [, setType] = useDnD();

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';

        setType(nodeType);
    };

    return (
        <aside className="sidebar">
            <div className="description">Drag and drop nodes to the right panel.</div>

            <div className="tf-nodes-container">
                <div className="tf-node tf-node__input" draggable onDragStart={(event) => onDragStart(event, 'Input')}>
                    Input
                </div>

                <div className="tf-node tf-node__dense" draggable onDragStart={(event) => onDragStart(event, 'Dense')}>
                    Dense
                </div>

                <div className="tf-node tf-node__dropout" draggable onDragStart={(event) => onDragStart(event, 'Dropout')}>
                    Dropout
                </div>

                <div className="tf-node tf-node__gaussian-noise" draggable onDragStart={(event) => onDragStart(event, 'Gaussian Noise')}>
                    Gaussian Noise
                </div>

                <div className="tf-node tf-node__gaussian-dropout" draggable onDragStart={(event) => onDragStart(event, 'Gaussian Dropout')}>
                    Gaussian Dropout
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
