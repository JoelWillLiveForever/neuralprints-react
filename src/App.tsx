import { Routes, Route, useLocation } from 'react-router-dom';
import { Panel, PanelGroup, PanelResizeHandle, ImperativePanelHandle } from 'react-resizable-panels';

import { useEffect, useState, useRef, useCallback } from 'react';

import Menu from './components/menu/Menu';

import PageAbout from './pages/page_about/PageAbout';
import PagePreferences from './pages/page_preferences/PagePreferences';
import PageInference from './pages/page_inference/PageInference';
import PageTraining from './pages/page_training/PageTraining';
import PageArchitecture from './pages/page_architecture/PageArchitecture';
import PageDataset from './pages/page_dataset/PageDataset';

import './app.scss';
import './pages/pages.scss';

const MENU_DEFAULT_SIZE_PX = 300;
const MENU_MIN_SIZE_PX = 260;
const MENU_MAX_SIZE_PX = 320;
const MENU_COLLAPSED_SIZE_PX = 100;

const App = () => {
    const location = useLocation();
    const menuRef = useRef<ImperativePanelHandle>(null);

    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);
    const [handleClass, setHandleClass] = useState<string>('');

    const getPct = (px: number) => (px / window.innerWidth) * 100;

    const [menuDefaultSize, setMenuDefaultSize] = useState(() => getPct(MENU_DEFAULT_SIZE_PX));
    const [menuMinSize, setMenuMinSize] = useState(() => getPct(MENU_MIN_SIZE_PX));
    const [menuMaxSize, setMenuMaxSize] = useState(() => getPct(MENU_MAX_SIZE_PX));
    const [menuCollapsedSize, setMenuCollapsedSize] = useState(() => getPct(MENU_COLLAPSED_SIZE_PX));

    // // Определяем класс по текущему маршруту --- обрабатывает вложенные маршруты, switch - нет
    // const determineHandleClass = useCallback(() => {
    //     const path = location.pathname;
    //     if (path.startsWith('/dataset')) return 'handle-dataset';
    //     if (path.startsWith('/architecture')) return 'handle-architecture';
    //     if (path.startsWith('/training')) return 'handle-training';
    //     if (path.startsWith('/inference')) return 'handle-inference';
    //     if (path.startsWith('/preferences')) return 'handle-preferences';
    //     if (path.startsWith('/about')) return 'handle-about';
    //     return '';
    // }, [location.pathname]);

    const determineHandleClass = useCallback(() => {
        switch (location.pathname) {
            case '/dataset':
                return 'my-custom-resize-handle--dataset';
            case '/architecture':
                return 'my-custom-resize-handle--architecture';
            case '/training':
                return 'my-custom-resize-handle--training';
            case '/inference':
                return 'my-custom-resize-handle--inference';
            case '/preferences':
                return 'my-custom-resize-handle--preferences';
            case '/about':
                return 'my-custom-resize-handle--about';
            default:
                return '';
        }
    }, [location.pathname]);

    useEffect(() => {
        // Обновляем размеры меню на основе ширины окна
        const updateMenuSizes = () => {
            setMenuDefaultSize(getPct(MENU_DEFAULT_SIZE_PX));
            setMenuMinSize(getPct(MENU_MIN_SIZE_PX));
            setMenuMaxSize(getPct(MENU_MAX_SIZE_PX));
            setMenuCollapsedSize(getPct(MENU_COLLAPSED_SIZE_PX));
        };

        window.addEventListener('resize', updateMenuSizes);
        return () => window.removeEventListener('resize', updateMenuSizes);
    }, []);

    useEffect(() => {
        setHandleClass(determineHandleClass());
    }, [determineHandleClass]);

    return (
        <div className="app-container">
            <PanelGroup autoSaveId="app_menu" direction="horizontal">
                <Panel
                    collapsible
                    ref={menuRef}
                    collapsedSize={menuCollapsedSize}
                    minSize={menuMinSize}
                    maxSize={menuMaxSize}
                    defaultSize={menuDefaultSize}
                    onCollapse={() => setIsMenuCollapsed(true)}
                    onExpand={() => setIsMenuCollapsed(false)}
                >
                    <Menu isCollapsed={isMenuCollapsed} />
                </Panel>

                <PanelResizeHandle className={`my-custom-resize-handle ${handleClass}`} />

                <Panel defaultSize={100 - (menuRef.current?.getSize() ?? menuMaxSize)}>
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
    );
};

export default App;
