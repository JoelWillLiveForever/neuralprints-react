import React, { useState, useEffect, useRef } from 'react';

import { useDatasetStore } from '../../store/DatasetStore';
import Papa from 'papaparse';

// компоненты и стили
import { Dropdown, DropdownButton, Form, InputGroup, Pagination, Table, Button } from 'react-bootstrap';
import './page_dataset.scss';

const PageDataset: React.FC = () => {
    const {
        dataset,
        headers,

        current_page: stored_current_page,
        page_size: stored_page_size,

        set_dataset,
        set_headers,

        set_pagination,
    } = useDatasetStore();

    const DATASET_CSV_FILE_INPUT_REF = useRef<HTMLInputElement | null>(null);

    const [dataset_file, set_dataset_file] = useState<File | null>(null);
    const [current_part_of_dataset, set_current_part_of_dataset] = useState<string[][]>([]);

    // Обновление текущих данных при изменении страницы или размера страницы
    useEffect(() => {
        const start = stored_current_page * stored_page_size; // начало диапазона
        const end = start + stored_page_size; // конец диапазона

        set_current_part_of_dataset(dataset.slice(start, end));
    }, [dataset, stored_current_page, stored_page_size]);

    const action_dataset_upload_handler = () => {
        DATASET_CSV_FILE_INPUT_REF.current?.click();
    };

    const action_dataset_change_handler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const csv_file = event.target.files?.[0];
        if (csv_file) {
            set_dataset_file(csv_file);
            Papa.parse(csv_file, {
                complete: (result) => {
                    set_headers(result.data[0]);
                    set_dataset(result.data.slice(1));

                    set_pagination(stored_current_page, stored_page_size);
                },
                header: false,
            });
        }
    };

    const action_dataset_clear_handler = () => {
        // Если массив dataset пуст, то выводим alert() и выходим из функции.
        if (dataset.length === 0) {
            alert('Нет данных для удаления!');
            return;
        }

        set_dataset([]);
        set_headers([]);

        set_dataset_file(null);

        set_pagination(0, stored_page_size); // Сброс к начальным настройкам

        // сброс значения value для возможности загружать снова тот же самый файл
        if (DATASET_CSV_FILE_INPUT_REF.current) {
            DATASET_CSV_FILE_INPUT_REF.current.value = '';
        }
    };

    const action_dataset_save_handler = () => {
        // !!! Этот код не нужен, так как деструктуризация уже выполнена выше.
        // Получаем текущее состояние dataset и headers из Zustand.
        // const { dataset, headers } = useDatasetStore.getState();

        // Если массив dataset пуст, то выводим alert() и выходим из функции.
        if (dataset.length === 0) {
            alert('Нет данных для сохранения!');
            return;
        }

        // Превращаем JavaScript-массив в CSV-строки.
        const csvContent = Papa.unparse({
            fields: headers, // Заголовки
            data: dataset, // Данные
        });

        // Blob — это бинарный объект, представляющий файл в памяти.
        // Здесь мы создаём CSV-файл внутри JavaScript.
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });

        // Cоздание временного URL для скачивания файла.
        // Этот URL будет работать, пока приложение не удалит его.
        const url = URL.createObjectURL(blob);

        // Создание ссылки <a>, но без добавления в HTML.
        const a = document.createElement('a');

        // Привязываем к ссылке href, который указывает на временный файл.
        a.href = url;

        // Задаём имя скачиваемого файла.
        a.download = dataset_file !== null ? dataset_file.name : ''; // Имя файла

        // Временно добавляем <a> в body.
        document.body.appendChild(a);

        // Запускаем клик на <a>, чтобы браузер скачал файл.
        a.click();

        // Удаляем <a>, так как он нам больше не нужен.
        document.body.removeChild(a);

        // Удаляем временный URL, чтобы очистить память.
        URL.revokeObjectURL(url);
    };

    const action_dataset_delete_row_handler = (row_index: number) => {
        const actual_index = stored_current_page * stored_page_size + row_index;
        const new_dataset = dataset.filter((_, index) => index !== actual_index);

        set_dataset(new_dataset);

        // Автоматический переход на предыдущую страницу если текущая пустая
        if (current_part_of_dataset.length === 1 && stored_current_page > 0) {
            // setPage((prev) => prev - 1);
            set_pagination(stored_current_page - 1, stored_page_size);
        }
    };

    const action_dataset_cell_value_change_handler = (row_index: number, cell_index: number, value: string) => {
        const new_dataset = [...dataset];
        const actual_index = stored_current_page * stored_page_size + row_index;

        new_dataset[actual_index][cell_index] = value;
        set_dataset(new_dataset);
    };

    const get_total_pages = () => {
        return Math.ceil(dataset.length / stored_page_size);
    };

    const action_pagination_change_page_size_handler = (e: React.ChangeEvent<HTMLSelectElement>) => {
        // новое количество строк, которые будут отображаться на одной странице
        const new_page_size = parseInt(e.target.value);

        // перерасчёт номера текущей страницы, с учётом того, на какой странице пользователь уже находился
        const new_current_page = Math.floor((stored_page_size * stored_current_page) / new_page_size);

        // перезаписываем текущие настройки
        set_pagination(new_current_page, new_page_size);
    };

    const action_pagination_goto_first_page_handler = () => {
        // на первую страницу
        set_pagination(0, stored_page_size);
    };

    const action_pagination_goto_previous_page_handler = () => {
        // на предыдущую страницу
        set_pagination(Math.max(stored_current_page - 1, 0), stored_page_size);
    };

    const action_pagination_goto_next_page_handler = () => {
        // на следующую страницу
        set_pagination(Math.min(stored_current_page + 1, get_total_pages()), stored_page_size);
    };

    const action_pagination_goto_last_page_handler = () => {
        const last_page = get_total_pages() - 1;

        // на последнюю страницу
        set_pagination(last_page, stored_page_size);
    };

    return (
        <div className="page-dataset-container">
            {/* <h2>Dataset Page</h2> */}

            <div className="main-controls">
                <InputGroup>
                    <DropdownButton
                        className="main-controls__dataset-dropdown-button"
                        variant="outline-primary"
                        title="Dataset management"
                    >
                        <Dropdown.Item onClick={action_dataset_upload_handler}>Upload</Dropdown.Item>
                        <Dropdown.Item onClick={action_dataset_save_handler} disabled={!dataset.length}>
                            Save
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item onClick={action_dataset_clear_handler} disabled={!dataset.length}>
                            Clear
                        </Dropdown.Item>
                    </DropdownButton>
                    <Form.Control
                        className="main-controls__dataset-filename-field"
                        type="text"
                        readOnly
                        placeholder="The file name of your dataset will be displayed here."
                        aria-label="The file name of your dataset will be displayed here."
                        value={dataset_file !== null ? dataset_file.name : ''}
                    />
                    <input
                        type="file"
                        accept=".csv"
                        name="dataset_csv_file_input"
                        id="dataset_csv_file_input"
                        ref={DATASET_CSV_FILE_INPUT_REF}
                        className="d-none"
                        onChange={action_dataset_change_handler}
                    />
                </InputGroup>
                <Button variant="primary" id="normalize_button">
                    Normalize
                </Button>
            </div>

            {dataset.length > 0 ? (
                <div className="table-container">
                    <Table className="table-container__dataset-table" striped bordered hover responsive>
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {current_part_of_dataset.map((row, row_index) => (
                                <tr key={row_index}>
                                    {row.map((cell, cell_index) => (
                                        <td key={cell_index}>
                                            <Form.Control
                                                type="text"
                                                value={cell}
                                                onChange={(e) =>
                                                    action_dataset_cell_value_change_handler(
                                                        row_index,
                                                        cell_index,
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        </td>
                                    ))}
                                    <td>
                                        <Button
                                            variant="outline-danger"
                                            className="danger-action-button"
                                            onClick={() => action_dataset_delete_row_handler(row_index)}
                                        >
                                            <i className="bi bi-trash-fill"></i>
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </div>
            ) : (
                // <Alert className="table-block__info-message" variant="primary">
                //     Загрузите датасет в *.CSV формате!
                // </Alert>
                <strong className="info-message-block">Please, upload Your dataset in *.CSV file format!</strong>
            )}

            <div className="pagination-controls">
                <div className="pagination-controls__current-page-size-selector-block">
                    {/* <span>Rows per page: </span> */}
                    <Form.Label htmlFor="current_page_size_selector" className="mine-bootstrap-label">
                        Rows per page:{' '}
                    </Form.Label>
                    <Form.Select
                        id="current_page_size_selector"
                        value={stored_page_size}
                        onChange={action_pagination_change_page_size_handler}
                    >
                        <option value="5">5</option>
                        <option value="10">10</option>
                        <option value="30">30</option>
                        <option value="50">50</option>
                        <option value="100">100</option>
                        <option value="250">250</option>
                        {/* <option value="500">500</option>
                        <option value="1000">1000</option> */}
                        <option value={dataset.length}>All</option>
                    </Form.Select>
                </div>

                <Pagination className="pagination-controls__page-selector-block">
                    <Pagination.First
                        disabled={stored_current_page === 0}
                        onClick={action_pagination_goto_first_page_handler}
                    />
                    <Pagination.Prev
                        disabled={stored_current_page === 0}
                        onClick={action_pagination_goto_previous_page_handler}
                    />

                    {stored_current_page > 2 && (
                        <Pagination.Item onClick={action_pagination_goto_first_page_handler}>{1}</Pagination.Item>
                    )}
                    {stored_current_page > 3 && <Pagination.Ellipsis />}

                    {stored_current_page > 1 && (
                        <Pagination.Item onClick={() => set_pagination(stored_current_page - 2, stored_page_size)}>
                            {stored_current_page - 1}
                        </Pagination.Item>
                    )}
                    {stored_current_page > 0 && (
                        <Pagination.Item onClick={() => set_pagination(stored_current_page - 1, stored_page_size)}>
                            {stored_current_page}
                        </Pagination.Item>
                    )}

                    <Pagination.Item active>{stored_current_page + 1}</Pagination.Item>

                    {stored_current_page < get_total_pages() - 1 && (
                        <Pagination.Item onClick={() => set_pagination(stored_current_page + 1, stored_page_size)}>
                            {stored_current_page + 2}
                        </Pagination.Item>
                    )}
                    {stored_current_page < get_total_pages() - 2 && (
                        <Pagination.Item onClick={() => set_pagination(stored_current_page + 2, stored_page_size)}>
                            {stored_current_page + 3}
                        </Pagination.Item>
                    )}

                    {stored_current_page < get_total_pages() - 4 && <Pagination.Ellipsis />}
                    {stored_current_page < get_total_pages() - 3 && (
                        <Pagination.Item onClick={action_pagination_goto_last_page_handler}>
                            {get_total_pages()}
                        </Pagination.Item>
                    )}

                    <Pagination.Next
                        disabled={(stored_current_page + 1) * stored_page_size >= dataset.length}
                        onClick={action_pagination_goto_next_page_handler}
                    />
                    <Pagination.Last
                        disabled={(stored_current_page + 1) * stored_page_size >= dataset.length}
                        onClick={action_pagination_goto_last_page_handler}
                    />
                </Pagination>
            </div>
        </div>
    );
};

export default PageDataset;
