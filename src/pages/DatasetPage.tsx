import Papa from 'papaparse';
import { useDatasetStore } from '../store/DatasetStore';
import { FixedSizeList as List } from 'react-window';
import AutoSizer from 'react-virtualized-auto-sizer';
import { Button, Table } from 'react-bootstrap';

const DatasetPage = () => {
    const { dataset, headers, setDataset, setHeaders } = useDatasetStore();

    const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        Papa.parse(file, {
            complete: (result) => {
                if (result.data.length > 0) {
                    setHeaders(result.data[0] as string[]);
                    setDataset(result.data.slice(1) as string[][]);
                }
            },
            skipEmptyLines: true,
        });
    };

    return (
        <div className="d-flex flex-column h-100">
            {/* Панель управления */}
            <div className="mb-3 d-flex gap-2">
                <input type="file" accept=".csv" onChange={handleFileUpload} className="form-control w-auto" />
                <Button variant="primary">Нормализовать</Button>
                <Button variant="danger">Очистить</Button>
            </div>

            {/* Контейнер с таблицей (занимает всю высоту) */}
            <div className="flex-grow-1 border rounded overflow-hidden">
                <AutoSizer>
                    {({ height, width }) => (
                        <div style={{ height, width, overflow: 'auto' }}>
                            <Table striped bordered hover style={{ minWidth: '100%' }}>
                                <thead>
                                    <tr>
                                        {headers.map((header, i) => (
                                            <th key={i}>{header}</th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    <List
                                        height={height - 40} // Учитываем высоту заголовка таблицы
                                        itemCount={dataset.length}
                                        itemSize={35}
                                        width={width}
                                    >
                                        {({ index, style }) => (
                                            <tr style={style}>
                                                {dataset[index].map((cell, j) => (
                                                    <td key={j}>{cell}</td>
                                                ))}
                                            </tr>
                                        )}
                                    </List>
                                </tbody>
                            </Table>
                        </div>
                    )}
                </AutoSizer>
            </div>
        </div>
    );
};

export default DatasetPage;

