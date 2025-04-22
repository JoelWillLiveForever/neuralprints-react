import { useEffect, useRef, useState } from 'react';
import { ImperativePanelHandle, Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';
import { LazyLog, ScrollFollow } from '@melloware/react-logviewer';

import './page_training.scss';

const DEFAULT_WIDTH_PX = 700;
const MIN_WIDTH_PX = 600;
const MAX_WIDTH_PX = 800;

const PageTraining = () => {
    const containerRef = useRef<HTMLDivElement>(null);
    const chartPanelRef = useRef<ImperativePanelHandle>(null);

    const getContainerWidth = () => containerRef.current?.getBoundingClientRect().width || window.innerWidth;

    const [chartDefaultSize, setChartDefaultSize] = useState((DEFAULT_WIDTH_PX / getContainerWidth()) * 100);
    const [chartMinSize, setChartMinSize] = useState((MIN_WIDTH_PX / getContainerWidth()) * 100);
    const [chartMaxSize, setChartMaxSize] = useState((MAX_WIDTH_PX / getContainerWidth()) * 100);

    useEffect(() => {
        const handleResize = () => {
            const width = getContainerWidth();
            setChartDefaultSize((DEFAULT_WIDTH_PX / width) * 100);
            setChartMinSize((MIN_WIDTH_PX / width) * 100);
            setChartMaxSize((MAX_WIDTH_PX / width) * 100);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return (
        <div className="page-training-container" ref={containerRef}>
            <PanelGroup autoSaveId="persistence" direction="horizontal">
                <Panel defaultSize={100 - (chartPanelRef.current?.getSize() || chartMaxSize)}>
                    <div className="log-view-wrapper">
                        <ScrollFollow
                            startFollowing={true}
                            render={({ follow, onScroll }) => (
                                <LazyLog url="http://example.log" stream follow={follow} onScroll={onScroll} />
                            )}
                        />
                    </div>
                </Panel>

                <PanelResizeHandle className="my-custom-resize-handle my-custom-resize-handle--training" />

                <Panel defaultSize={chartDefaultSize} minSize={chartMinSize} maxSize={chartMaxSize} ref={chartPanelRef}>
                    {/* chart view panel content here */}
                </Panel>
            </PanelGroup>
        </div>
    );
};

export default PageTraining;
