import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, {useEffect, useState} from 'react';
import {FilterMatchMode} from "primereact/api";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
const TablaErroresSigte = () => {
    const [listadoTable, setListadoTable] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    useEffect(() => {
        setListadoTable([
            {
                id: 1,
                Descripcion: 'Descripción 1',
            },
            {
                id: 2,
                Descripcion: 'Descripción 2',
            },
            {
                id: 3,
                Descripcion: 'Descripción 3'
            },
            {
                id: 4,
                Descripcion: 'Descripción 4',
            },
            {
                id: 5,
                Descripcion: 'Descripción 5',
            },
            {
                id: 6,
                Descripcion: 'Descripción 6',
            },
            {
                id: 7,
                Descripcion: 'Descripción 7',
            },
            {
                id: 8,
                Descripcion: 'Descripción 8',
            },
            {
                id: 9,
                Descripcion: 'Descripción 9',
            },
            {
                id: 10,
                Descripcion: 'Descripción 10',
            },
            {
                id: 11,
                Descripcion: 'Descripción 11',
            },
            {
                id: 12,
                Descripcion: 'Descripción 12',
            },
            {
                id: 13,
                Descripcion: 'Descripción 13',
            },
            {
                id: 14,
                Descripcion: 'Descripción 14',
            },
            {
                id: 15,
                Descripcion: 'Descripción 15',
            },
            {
                id: 16,
                Descripcion: 'Descripción 16',
            }
        ])
        initFilters();
    }, []);
    const clearFilter = () => {
        initFilters();
    };
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        });
        setGlobalFilterValue('');
    };
    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const renderHeader = () => {
        return (
            <div className="flex justify-content-between">
                <Button type="button" icon="pi pi-filter-slash" label="Limpiar Filtro" outlined onClick={clearFilter} />
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                </span>
            </div>
        );
    };
    const header = renderHeader();
    return (
        <>
            <DataTable value={listadoTable} size="small" tableStyle={{ minWidth: '50rem' }} header={header} filters={filters} globalFilterFields={['id', 'Descripcion']} emptyMessage="Ningún dato disponible en esta tabla.">
                <Column field="id" header="ID"></Column>
                <Column field="Descripcion" header="Descripción"></Column>
            </DataTable>
        </>
    );
};

export default TablaErroresSigte;
