import React, { useState } from 'react';
import { Button, Table } from 'react-bootstrap';
import Papa from 'papaparse';

const Dataset = () => {
    const [data, setData] = useState([]);
    const [columns, setColumns] = useState([]);

    // Обработчик загрузки файла
    const handleFileUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            Papa.parse(file, {
                complete: (result) => {
                    const csvData = result.data;
                    if (csvData.length > 0) {
                        setColumns(Object.keys(csvData[0])); // Сохраняем заголовки
                        setData(csvData); // Сохраняем данные
                    } else {
                        console.log('Файл пуст');
                    }
                },
                header: true, // Предполагаем, что в CSV есть заголовки
            });
        }
    };

    // Обработчик очистки данных
    const handleClearData = () => {
        setData([]);
        setColumns([]);
    };

    return (
        <div className="container mt-4">
            <h2>Dataset</h2>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <Button variant="danger" className="ms-2" onClick={handleClearData}>
                Очистить
            </Button>
            {data.length > 0 && (
                <Table striped bordered hover className="mt-3">
                    <thead>
                        <tr>
                            {columns.map((col, index) => (
                                <th key={index}>{col}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((row, rowIndex) => (
                            <tr key={rowIndex}>
                                {columns.map((col, colIndex) => (
                                    <td key={colIndex}>{row[col]}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </Table>
            )}
        </div>
    );
};

export default Dataset;
