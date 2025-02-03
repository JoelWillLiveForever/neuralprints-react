import React, { useState, useEffect } from 'react';
import { useDatasetStore } from '../../store/DatasetStore';
import Papa from 'papaparse';

const PageDataset: React.FC = () => {
    const {
        dataset,
        headers,
        page: storedPage,
        pageSize: storedPageSize,
        setDataset,
        setHeaders,
        setPagination,
    } = useDatasetStore();

    const [file, setFile] = useState<File | null>(null);
    const [currentData, setCurrentData] = useState<string[][]>([]);

    // Получаем значения из хранилища
    const page = storedPage;
    const pageSize = storedPageSize;

    // Обновление текущих данных при изменении страницы или размера страницы
    useEffect(() => {
        const start = page * pageSize;
        const end = start + pageSize;
        setCurrentData(dataset.slice(start, end));
    }, [dataset, page, pageSize]);

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files[0]) {
            setFile(files[0]);
            Papa.parse(files[0], {
                complete: (result) => {
                    setHeaders(result.data[0]);
                    setDataset(result.data.slice(1));
                    setPagination(0, 5); // Сброс к начальным настройкам
                },
                header: false,
            });
        }
    };

    const handleCellChange = (rowIndex: number, cellIndex: number, value: string) => {
        const newDataset = [...dataset];
        const actualIndex = page * pageSize + rowIndex;
        newDataset[actualIndex][cellIndex] = value;
        setDataset(newDataset);
    };

    const handleRowDelete = (rowIndex: number) => {
        const actualIndex = page * pageSize + rowIndex;
        const newDataset = dataset.filter((_, index) => index !== actualIndex);
        setDataset(newDataset);

        // Автоматический переход на предыдущую страницу если текущая пустая
        if (currentData.length === 1 && page > 0) {
            setPage((prev) => prev - 1);
        }
    };

    const handleClearTable = () => {
        setDataset([]);
        setHeaders([]);
        setFile(null);
        setPage(0);
    };

    const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newSize = parseInt(e.target.value, 10);
        const newPage = Math.floor((page * pageSize) / newSize);
        setPagination(newPage, newSize);
    };

    const handlePreviousPage = () => {
        // setPage((prev) => Math.max(prev - 1, 0));
        setPagination(Math.max(page - 1, 0), pageSize);
    };

    const handleNextPage = () => {
        // setPage((prev) => {
        //     const maxPage = Math.ceil(dataset.length / pageSize) - 1;
        //     return Math.min(prev + 1, maxPage);
        // });

        setPagination(page + 1, pageSize);
    };

    const shandleFirstPage = () => setPagination(0, pageSize);
    const handleLastPage = () => {
        const lastPage = Math.ceil(dataset.length / pageSize) - 1;
        setPagination(lastPage, pageSize);
    };

    return (
        <div>
            <input type="file" accept=".csv" onChange={handleFileUpload} />
            <button onClick={handleClearTable} disabled={!dataset.length}>
                Clear Table
            </button>

            {dataset.length > 0 && (
                <>
                    <table>
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentData.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                    {row.map((cell, cellIndex) => (
                                        <td key={cellIndex}>
                                            <input
                                                type="text"
                                                value={cell}
                                                onChange={(e) => handleCellChange(rowIndex, cellIndex, e.target.value)}
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <button onClick={() => handleRowDelete(rowIndex)}>Delete</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination-controls">
                        <div>
                            <span>Rows per page: </span>
                            <select value={pageSize} onChange={handlePageSizeChange}>
                                {[5, 10, 30].map((option) => (
                                    <option key={option} value={option}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <span>
                                {Math.min(page * pageSize + 1, dataset.length)}-
                                {Math.min((page + 1) * pageSize, dataset.length)} of {dataset.length}
                            </span>
                            <button onClick={handleFirstPage} disabled={page === 0}>
                                First
                            </button>
                            <button onClick={handlePreviousPage} disabled={page === 0}>
                                Previous
                            </button>
                            <button onClick={handleNextPage} disabled={(page + 1) * pageSize >= dataset.length}>
                                Next
                            </button>
                            <button onClick={handleLastPage} disabled={(page + 1) * pageSize >= dataset.length}>
                                Last
                            </button>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default PageDataset;