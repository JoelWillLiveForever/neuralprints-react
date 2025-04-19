import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';

// import Menu
import Menu from './components/menu/Menu';

// import pages
import PageAbout from './pages/page_about/PageAbout';
import PagePreferences from './pages/page_preferences/PagePreferences';
import PageInference from './pages/page_inference/PageInference';
import PageTraining from './pages/page_training/PageTraining';
import PageArchitecture from './pages/page_architecture/PageArchitecture';
import PageDataset from './pages/page_dataset/PageDataset';

import './app.scss';
import './pages/pages.scss';
import { useEffect, useState, useRef } from 'react';

const App = () => {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

    const menuWrapper = useRef<ImperativePanelHandle>(null);

    const MENU_DEFAULT_SIZE_IN_PX = 300;
    const [menuDefaultSize, setMenuDefaultSize] = useState((MENU_DEFAULT_SIZE_IN_PX / window.innerWidth) * 100);

    const MENU_MIN_SIZE_IN_PX = 260;
    const [menuMinSize, setMenuMinSize] = useState((MENU_MIN_SIZE_IN_PX / window.innerWidth) * 100);

    const MENU_MAX_SIZE_IN_PX = 310;
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
    // const currentMenuSize = useMemo(() => menuWrapper.current?.getSize() || menuDefaultSize, [menuDefaultSize]);

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
                                <Route path="/dataset" element={<PageDataset />} />
                                <Route path="/architecture" element={<PageArchitecture />} />
                                <Route path="/training" element={<PageTraining />} />
                                <Route path="/inference" element={<PageInference />} />
                                <Route path="/preferences" element={<PagePreferences />} />
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
