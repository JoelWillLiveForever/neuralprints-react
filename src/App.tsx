import { BrowserRouter as Router, Routes, Route } from "react-router-dom"

// import Menu
import Menu from "./components/menu/Menu";

// import pages
import Dataset from "./pages/Dataset";
import Training from "./pages/Training";
import Evaluation from "./pages/Evaluation";
import Settings from "./pages/Settings";
import About from "./pages/About";

const App = () => {
    return (
        <Router>
            <div className="d-flex vh-100">
                <Menu width="7vw" height="100%" />

                <div className="flex-grow-1 p-4" style={{width: '93vw', height: '100vh'}}>
                    <Routes>
                        <Route path="/" element={<Dataset />} />
                        <Route path="/training" element={<Training />} />
                        <Route path="/evaluation" element={<Evaluation />} />
                        <Route path="/settings" element={<Settings />} />
                        <Route path="/about" element={<About />} />
                    </Routes>
                </div>
            </div>
        </Router>
    )
}

export default App