import React from 'react';
import { useDnD } from '../../context/DnDContext';

import Header4Container from '../header_4_container/Header4Container';

import './sidebar.scss';
import BeautifulSlider from '../beautiful_slider/BeautifulSLider';

const Sidebar: React.FC = () => {
    const [, setType] = useDnD();

    const onDragStart = (event: React.DragEvent, nodeType: string) => {
        event.dataTransfer.setData('application/reactflow', nodeType);
        event.dataTransfer.effectAllowed = 'move';

        setType(nodeType);
    };

    return (
        <aside className="sidebar">
            <div className="tf-nodes-container">
                <Header4Container className="tf-nodes-container__header" text="TensorFlow layers" />

                <div className="tf-nodes-container__body">
                    <div
                        className="tf-node tf-node__input"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_INPUT_LAYER_NODE')}
                    >
                        Input
                    </div>

                    <div
                        className="tf-node tf-node__dense"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_DENSE_LAYER_NODE')}
                    >
                        Dense
                    </div>

                    <div
                        className="tf-node tf-node__dropout"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_DROPOUT_LAYER_NODE')}
                    >
                        Dropout
                    </div>

                    <div
                        className="tf-node tf-node__gaussian-dropout"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_GAUSSIAN_DROPOUT_LAYER_NODE')}
                    >
                        Gaussian Dropout
                    </div>

                    <div
                        className="tf-node tf-node__gaussian-noise"
                        draggable
                        onDragStart={(event) => onDragStart(event, 'TF_GAUSSIAN_NOISE_LAYER_NODE')}
                    >
                        Gaussian Noise
                    </div>
                </div>
            </div>

            <div className="dataset-division-block">
                <Header4Container className="dataset-division-block__header" text="Dataset splitting options" />

                <div className="dataset-division-block__body">
                    <BeautifulSlider
                        value={0.5}
                        onChange={(e) => {

                        }}
                        onWheel={(e) => {

                        }}
                        min={0}
                        max={1}
                        step={0.001}
                        color="#00FF00"
                    />
                </div>
            </div>
        </aside>
    );
};

export default Sidebar;
