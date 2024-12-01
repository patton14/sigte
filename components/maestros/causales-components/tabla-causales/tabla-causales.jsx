import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, {useEffect, useState} from 'react';
import {FilterMatchMode} from "primereact/api";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
const TablaCausales = () => {
    const [listadoTable, setListadoTable] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        setListadoTable([
            {
                id: 1,
                nombre: 'Causal 1',
                Descripcion: 'Descripción 1',
                tipo: 'Tipo 1'
            },
            {
                id: 2,
                nombre: 'Causal 2',
                Descripcion: 'Descripción 2',
                tipo: 'Tipo 2'
            },
            {
                id: 3,
                nombre: 'Causal 3',
                Descripcion: 'Descripción 3',
                tipo: 'Tipo 3'
            },
            {
                id: 4,
                nombre: 'Causal 4',
                Descripcion: 'Descripción 4',
                tipo: 'Tipo 4'
            },
            {
                id: 5,
                nombre: 'Causal 5',
                Descripcion: 'Descripción 5',
                tipo: 'Tipo 5'
            },
            {
                id: 6,
                nombre: 'Causal 6',
                Descripcion: 'Descripción 6',
                tipo: 'Tipo 6'
            },
            {
                id: 7,
                nombre: 'Causal 7',
                Descripcion: 'Descripción 7',
                tipo: 'Tipo 7'
            },
            {
                id: 8,
                nombre: 'Causal 8',
                Descripcion: 'Descripción 8',
                tipo: 'Tipo 8'
            },
            {
                id: 9,
                nombre: 'Causal 9',
                Descripcion: 'Descripción 9',
                tipo: 'Tipo 9'
            },
            {
                id: 10,
                nombre: 'Causal 10',
                Descripcion: 'Descripción 10',
                tipo: 'Tipo 10'
            },
            {
                id: 11,
                nombre: 'Causal 11',
                Descripcion: 'Descripción 11',
                tipo: 'Tipo 11'
            },
            {
                id: 12,
                nombre: 'Causal 12',
                Descripcion: 'Descripción 12',
                tipo: 'Tipo 12'
            },
            {
                id: 13,
                nombre: 'Causal 13',
                Descripcion: 'Descripción 13',
                tipo: 'Tipo 13'
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
            <DataTable value={listadoTable} size="small" tableStyle={{ minWidth: '50rem' }} filters={filters}
                       header={header} globalFilterFields={['id', 'nombre', 'Descripcion', 'tipo' ]} emptyMessage="Ningún dato disponible en esta tabla.">
                <Column field="id" header="ID"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="Descripcion" header="Descripción"></Column>
                <Column field="tipo" header="Tipo"></Column>
            </DataTable>
        </>
    );
};

export default TablaCausales;
