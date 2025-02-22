import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import { Panel, PanelGroup, PanelResizeHandle } from 'react-resizable-panels';

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
import { useState } from 'react';

const App = () => {
    const [isMenuCollapsed, setIsMenuCollapsed] = useState(false);

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
                        collapsedSize={3.5}
                        minSize={7.5}
                        maxSize={10}
                        defaultSize={10}
                        onCollapse={menu_collapse_handle}
                        onExpand={menu_expand_handle}
                    >
                        <Menu isCollapsed={isMenuCollapsed} />
                    </Panel>
                    <PanelResizeHandle />
                    <Panel defaultSize={90}>
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
