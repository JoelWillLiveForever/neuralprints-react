import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

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

const App = () => {
    return (
        <Router>
            <div className="app-container">
                <Menu />
                <div className="page-container">
                    <Routes>
                        <Route path="/" element={<PageDataset />} />
                        <Route path="/training" element={<PageTraining />} />
                        <Route path="/evaluation" element={<PageEvaluation />} />
                        <Route path="/settings" element={<PageSettings />} />
                        <Route path="/about" element={<PageAbout />} />
                    </Routes>
                </div>
            </div>
        </Router>
    );
};

export default App;
