import { Link } from "react-router-dom";
import { Nav } from "react-bootstrap";

const Menu = () => {
    return (
        <Nav className="d-flex flex-column bg-dark text-white p-3" style={{width: '14rem', height: '100vh'}}>
            <Nav.Link as={Link} to="/" className="text-white py-2 px-3 rounded">📂 Датасет</Nav.Link>
            <Nav.Link as={Link} to="/training" className="text-white py-2 px-3 rounded">📈 Обучение</Nav.Link>
            <Nav.Link as={Link} to="/evaluation" className="text-white py-2 px-3 rounded">📊 Оценка модели</Nav.Link>
            <Nav.Link as={Link} to="/settings" className="text-white py-2 px-3 rounded">⚙️ Настройки</Nav.Link>
            <Nav.Link as={Link} to="/about" className="text-white py-2 px-3 rounded">ℹ️ О программе</Nav.Link>
        </Nav>
    )
}

export default Menu