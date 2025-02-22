import React, { useState, useEffect } from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import ReactFlow from 'react-flow-renderer';

const ResizablePanel = ({ children }) => {
    const [panelWidth, setPanelWidth] = useState(300); // начальная ширина панели
    const [isDragging, setIsDragging] = useState(false);

    const handleMouseDown = (e) => {
        setIsDragging(true);
        document.body.style.userSelect = 'none'; // блокируем выделение текста при перетаскивании
    };

    const handleMouseMove = (e) => {
        if (isDragging) {
            const newWidth = e.clientX; // получаем текущую позицию мыши
            setPanelWidth(newWidth); // устанавливаем новую ширину панели
        }
    };

    const handleMouseUp = () => {
        setIsDragging(false);
        document.body.style.userSelect = 'auto'; // восстанавливаем выделение текста
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        }
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isDragging]);

    return (
        <Container fluid>
            <Row>
                <Col
                    style={{
                        width: `${panelWidth}px`,
                        backgroundColor: '#f4f4f4',
                        padding: '10px',
                        transition: 'width 0.2s',
                    }}
                >
                    {/* Панель свойств */}
                    <div>
                        <h4>Гиперпараметры нейронки</h4>
                        {/* Ваши гиперпараметры здесь */}
                    </div>
                </Col>
                <Col style={{ flex: 1 }}>
                    {/* Центральная область с React Flow */}
                    <div style={{ height: '100vh', backgroundColor: '#e0e0e0' }}>{children}</div>
                </Col>
                <div
                    style={{
                        position: 'absolute',
                        left: `${panelWidth - 5}px`,
                        top: 0,
                        bottom: 0,
                        width: '10px',
                        cursor: 'ew-resize',
                        backgroundColor: '#888',
                    }}
                    onMouseDown={handleMouseDown}
                />
            </Row>
        </Container>
    );
};

export default ResizablePanel;
