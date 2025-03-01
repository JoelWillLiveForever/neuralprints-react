import React from 'react';

import { ReactFlowProvider } from '@xyflow/react';

import { DnDProvider } from '../../context/DnDContext';
import DnDFlow from '../../components/dndflow/DnDFlow';

import './page_design.scss'

const PageDesign: React.FC = () => {
    return (
        <ReactFlowProvider>
            <DnDProvider>
                <DnDFlow />
            </DnDProvider>
        </ReactFlowProvider>
    );
};

export default PageDesign;
