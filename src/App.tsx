import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// import Menu
import Menu from "./components/menu/Menu";

// import pages
import DatasetPage from "./pages/DatasetPage";
import TrainingPage from "./pages/TrainingPage";
import EvaluationPage from "./pages/EvaluationPage";
import SettingsPage from "./pages/SettingsPage";
import AboutPage from "./pages/AboutPage";

const App = () => {
    return (
        <Router>
            <Menu />
            <div className="d-flex vh-100">
                <div className="flex-grow-1 p-4" style={{width: '93vw', height: '100vh'}}>
                    <Routes>
                        <Route path="/" element={<DatasetPage />} />
                        <Route path="/training" element={<TrainingPage />} />
                        <Route path="/evaluation" element={<EvaluationPage />} />
                        <Route path="/settings" element={<SettingsPage />} />
                        <Route path="/about" element={<AboutPage />} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App