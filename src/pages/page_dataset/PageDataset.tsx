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
        column_types,

        sort_params,

        current_page: stored_current_page,
        page_size: stored_page_size,

        set_dataset,
        set_headers,
        set_column_types,

        set_pagination,

        sort_dataset,
        // reset_sorting,

        initialize_data,
        update_data,
        clear_data,

    } = useDatasetStore();

    const DATASET_CSV_FILE_INPUT_REF = useRef<HTMLInputElement | null>(null);

    const [dataset_file, set_dataset_file] = useState<File | null>(null);
    const [current_part_of_dataset, set_current_part_of_dataset] = useState<string[][]>([]);

    const [is_adding_entry, set_is_adding_entry] = useState(false);
    const [new_entry, set_new_entry] = useState<string[]>([]);

    // const [sort_order, set_sort_order] = useState<(null | 'asc' | 'desc')[]>(headers.map(() => null)); // Состояние для порядка сортировки
    // const original_dataset_ref = useRef<string[][]>([]); // хранит оригинальные данные для сортировки (может это кастыль? хз.)

    // useEffect(() => {
    //     // когда dataset меняется (например, новый загружен), обновляем оригинальные данные
    //     original_dataset_ref.current = dataset;
    // }, [dataset]);

    // Обновление текущих данных при изменении страницы или размера страницы
    useEffect(() => {
        const start = stored_current_page * stored_page_size; // начало диапазона
        const end = start + stored_page_size; // конец диапазона

        set_current_part_of_dataset(dataset.slice(start, end));
    }, [dataset, stored_current_page, stored_page_size]);

    // useEffect(() => {
    //     if (headers.length > 0) {
    //         const initial_column_types = new Array(headers.length).fill('feature');

    //         initial_column_types[0] = 'ignore';
    //         initial_column_types[headers.length - 1] = 'target';

    //         set_column_types(initial_column_types);
    //     }
    // }, [headers, set_column_types]);

    // useEffect(() => {
    //     set_sort_order(headers.map(() => null));
    // }, [headers]);

    const action_dataset_upload_handler = () => {
        DATASET_CSV_FILE_INPUT_REF.current?.click();
    };

    const action_dataset_change_handler = (event: React.ChangeEvent<HTMLInputElement>) => {
        const csv_file = event.target.files?.[0];
        if (csv_file) {
            set_dataset_file(csv_file);
            Papa.parse(csv_file, {
                complete: (result) => {
                    // set_headers(result.data[0]);
                    // set_dataset(result.data.slice(1));

                    const parsed_headers = result.data[0] as string[];
                    set_headers(parsed_headers);

                    // Приведение типа данных
                    const parsed_data = result.data.slice(1) as string[][]; // Явное приведение типа
                    initialize_data(parsed_data);

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

        // set_headers([]);

        clear_data();
        // update_data([]);
        // set_dataset([]);

        set_dataset_file(null);

        // set_pagination(0, stored_page_size); // Сброс к начальным настройкам

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
        if (useDatasetStore.getState()._original_data.length === 0) {
            alert('Нет данных для сохранения!');
            return;
        }

        // сбросить сортировку датасета, если есть
        // reset_sorting();

        // Превращаем JavaScript-массив в CSV-строки.
        const csvContent = Papa.unparse({
            fields: headers, // Заголовки
            data: useDatasetStore.getState()._original_data, // Данные
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

        // set_dataset(new_dataset);
        update_data(new_dataset);

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
        update_data(new_dataset);

        // set_dataset(new_dataset);
    };

    const action_dataset_add_entry_handler = () => {
        if (headers.length === 0) return;

        // Генерация нового ID
        const current_ids = dataset.map((row) => {
            const id = parseInt(row[0], 10);
            return isNaN(id) ? 0 : id;
        });

        let new_id = current_ids.length > 0 ? Math.max(...current_ids) + 1 : 1;

        // Проверка уникальности
        while (current_ids.includes(new_id)) {
            new_id++;
        }

        // Создание пустой записи
        const empty_entry = headers.map((_, i) => (i === 0 ? new_id.toString() : ''));

        set_new_entry(empty_entry);
        set_is_adding_entry(true);
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

    const getStartIndex = () => {
        return stored_current_page * stored_page_size;
    };

    const getEndIndex = () => {
        return Math.min(getStartIndex() + stored_page_size, dataset.length);
    };

    const handle_sort_click = (column_index: number) => {
        sort_dataset(column_index);
    };

    const handle_column_type_change = (index: number, new_type: string) => {
        const updated_column_types = [...column_types]; // Копируем текущие данные
        updated_column_types[index] = new_type; // Обновляем конкретный элемент в column_types
        
        set_column_types(updated_column_types); // Обновляем состояние
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
                <Button variant="primary" id="normalize_button" disabled={dataset === null || dataset.length === 0}>
                    Normalize
                </Button>
                <div className="separator"></div>
                <Button
                    variant="outline-primary"
                    id="add_entry_button"
                    onClick={action_dataset_add_entry_handler}
                    disabled={headers.length === 0}
                >
                    Add entry
                </Button>
            </div>

            {dataset.length > 0 ? (
                <div className="table-container">
                    {/* <Header4Container text='Dataset' /> */}
                    <Table className="table-container__dataset-table" bordered hover responsive>
                        {/* <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>{header}</th>
                                ))}
                                <th>Actions</th>
                            </tr>
                        </thead> */}
                        <thead>
                            <tr>
                                {headers.map((header, index) => (
                                    <th key={index}>
                                        <div className="my-custom-thead">
                                            <div className="my-custom-thead__chas">
                                                <span className="my-custom-thead__chas__column-header">{header}</span>
                                                <Button
                                                    onClick={() => handle_sort_click(index)}
                                                    className="my-custom-thead__chas__column-sort"
                                                >
                                                    {/* Если сортировка выключена по данному столбцу */}
                                                    {sort_params.column_index === index && sort_params.order === null && '⇅'}

                                                    {/* Если этот столбец отсортирован по возрастанию */}
                                                    {sort_params.column_index === index && sort_params.order === 'asc' && '↑'}

                                                    {/* Если этот столбец отсортирован по убыванию */}
                                                    {sort_params.column_index === index && sort_params.order === 'desc' && '↓'}

                                                    {/* Если отсортирован другой столбец, но не этот */}
                                                    {sort_params.column_index !== index && (sort_params.order === null || sort_params.order !== null) && '⇅'}
                                                </Button>
                                            </div>
                                            <Form.Select
                                                value={column_types[index]}
                                                onChange={(e) => handle_column_type_change(index, e.target.value)}
                                                className="my-custom-thead__column-type"
                                            >
                                                <option value="feature">Feature</option>
                                                <option value="target">Target</option>
                                                <option value="ignored">Ignored</option>
                                            </Form.Select>
                                        </div>
                                    </th>
                                ))}
                                <th>
                                    <div className="my-custom-thead">Actions</div>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            {is_adding_entry && (
                                <tr className="table-default adding-entry-row">
                                    {headers.map((_header, index) => (
                                        <td key={`new-${index}`}>
                                            <Form.Control
                                                type="text"
                                                value={new_entry[index] || ''}
                                                disabled={index === 0}
                                                onChange={(e) => {
                                                    const updated = [...new_entry];
                                                    updated[index] = e.target.value;
                                                    set_new_entry(updated);
                                                }}
                                            />
                                        </td>
                                    ))}
                                    <td className="table-default actions-buttons-container">
                                        <Button
                                            id="add_entry_save_button"
                                            variant="outline-success"
                                            onClick={() => {
                                                if (new_entry.slice(1).some((field) => !field.trim())) {
                                                    alert('Please fill in all fields below!');
                                                    return;
                                                }

                                                set_dataset([...dataset, new_entry]);
                                                set_is_adding_entry(false);

                                                // Переход на последнюю страницу
                                                const total = Math.ceil((dataset.length + 1) / stored_page_size);
                                                set_pagination(total - 1, stored_page_size);
                                            }}
                                        >
                                            <i className="bi bi-floppy2-fill me-2"></i>
                                            Save
                                        </Button>
                                        <Button
                                            id="add_entry_cancel_button"
                                            variant="outline-danger"
                                            className="ms-2"
                                            onClick={() => set_is_adding_entry(false)}
                                        >
                                            <i className="bi bi-x-circle me-2"></i>
                                            Cancel
                                        </Button>
                                    </td>
                                </tr>
                            )}
                            {current_part_of_dataset.map((row, row_index) => (
                                <tr key={row_index} className="table-default">
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
                                            <i className="bi bi-trash-fill me-2"></i>
                                            Delete
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

                // <div className='info-message-block'>
                //     <strong className="info-message-block__content">Please, upload Your dataset in *.CSV file format!</strong>
                // </div>
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

                {/* <span className='pagination-controls__current-page-range'>
                    {dataset_file !== null ? dataset_file.name : 'Dataset file not uploaded'}
                </span> */}

                <span>
                    {dataset_file !== null
                        ? `Rows ${getStartIndex() + 1}-${getEndIndex()} (out of ${dataset.length})`
                        : 'Rows 0–0 (no data)'}
                </span>

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

                    <Pagination.Item active disabled={dataset.length === 0}>
                        {dataset.length === 0 ? <span>0</span> : <span>{stored_current_page + 1}</span>}
                    </Pagination.Item>

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
