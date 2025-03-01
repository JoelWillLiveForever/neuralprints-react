import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';

// import Menu
import Menu from './components/menu/Menu';

// import pages
import PageAbout from './pages/page_about/PageAbout';
import PageSettings from './pages/page_settings/PageSettings';
import PageEvaluation from './pages/page_evaluation/PageEvaluation';
import PageTraining from './pages/page_training/PageTraining';
import PageDataset from './pages/page_dataset/PageDataset';

import './app.scss';
import './pages/pages.scss';
import { useEffect, useState, useRef, useMemo } from 'react';

const App = () => {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

    const menuWrapper = useRef<ImperativePanelHandle>(null);

    const MENU_DEFAULT_SIZE_IN_PX = 225;
    const [menuDefaultSize, setMenuDefaultSize] = useState((MENU_DEFAULT_SIZE_IN_PX / window.innerWidth) * 100);

    const MENU_MIN_SIZE_IN_PX = 175;
    const [menuMinSize, setMenuMinSize] = useState((MENU_MIN_SIZE_IN_PX / window.innerWidth) * 100);

    const MENU_MAX_SIZE_IN_PX = 300;
    const [menuMaxSize, setMenuMaxSize] = useState((MENU_MAX_SIZE_IN_PX / window.innerWidth) * 100);

    const MENU_COLLAPSED_SIZE_IN_PX = 100;
    const [menuCollapsedSize, setMenuCollapsedSize] = useState((MENU_COLLAPSED_SIZE_IN_PX / window.innerWidth) * 100);

    // Обновляем размер меню при изменении окна
    useEffect(() => {
        const handleResize = () => {
            setMenuDefaultSize((MENU_DEFAULT_SIZE_IN_PX / window.innerWidth) * 100);

            setMenuMinSize((MENU_MIN_SIZE_IN_PX / window.innerWidth) * 100);
            setMenuMaxSize((MENU_MAX_SIZE_IN_PX / window.innerWidth) * 100);

            setMenuCollapsedSize((MENU_COLLAPSED_SIZE_IN_PX / window.innerWidth) * 100);
        };

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Используем useMemo для кеширования текущего размера меню
    const currentMenuSize = useMemo(() => menuWrapper.current?.getSize() || menuDefaultSize, [menuDefaultSize]);

    const menu_collapse_handle = () => {
        setIsMenuCollapsed(true);
    };

    const menu_expand_handle = () => {
        setIsMenuCollapsed(false);
    };

    return (
        <Router>
            <div className="app-container">
                <PanelGroup autoSaveId="persistence" direction="horizontal">
                    <Panel
                        collapsible={true}
                        collapsedSize={menuCollapsedSize}
                        minSize={menuMinSize}
                        maxSize={menuMaxSize}
                        defaultSize={menuDefaultSize}
                        onCollapse={menu_collapse_handle}
                        onExpand={menu_expand_handle}
                        ref={menuWrapper}
                    >
                        <Menu isCollapsed={isMenuCollapsed} />
                    </Panel>
                    <PanelResizeHandle />
                    <Panel defaultSize={100 - (menuWrapper.current?.getSize() || menuMaxSize)}>
                        <div className="page-container">
                            <Routes>
                                <Route path="/" element={<PageDataset />} />
                                <Route path="/training" element={<PageTraining />} />
                                <Route path="/evaluation" element={<PageEvaluation />} />
                                <Route path="/settings" element={<PageSettings />} />
                                <Route path="/about" element={<PageAbout />} />
                            </Routes>
                        </div>
                    </Panel>
                </PanelGroup>
            </div>
        </Router>
    );
};

export default App;
