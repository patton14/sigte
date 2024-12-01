import React, {useEffect, useState} from 'react';
import {FilterMatchMode} from "primereact/api";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";

const TablaPrestacion = () => {
    const [listadoTable, setListadoTable] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');



    useEffect(() => {
        setListadoTable([
            {
                id: 1,
                nombre: 'Prestación 1',
                Descripcion: 'Descripción 1',
                priorizacion: 'Priorización 1'
            },
            {
                id: 2,
                nombre: 'Prestación 2',
                Descripcion: 'Descripción 2',
                priorizacion: 'Priorización 2'
            },
            {
                id: 3,
                nombre: 'Prestación 3',
                Descripcion: 'Descripción 3',
                priorizacion: 'Priorización 3'
            },
            {
                id: 4,
                nombre: 'Prestación 4',
                Descripcion: 'Descripción 4',
                priorizacion: 'Priorización 4'
            },
            {
                id: 5,
                nombre: 'Prestación 5',
                Descripcion: 'Descripción 5',
                priorizacion: 'Priorización 5'
            },
            {
                id: 6,
                nombre: 'Prestación 6',
                Descripcion: 'Descripción 6',
                priorizacion: 'Priorización 6'
            },
            {
                id: 7,
                nombre: 'Prestación 7',
                Descripcion: 'Descripción 7',
                priorizacion: 'Priorización 7'
            },
            {
                id: 8,
                nombre: 'Prestación 8',
                Descripcion: 'Descripción 8',
                priorizacion: 'Priorización 8'
            },
            {
                id: 9,
                nombre: 'Prestación 9',
                Descripcion: 'Descripción 9',
                priorizacion: 'Priorización 9'
            },
            {
                id: 10,
                nombre: 'Prestación 10',
                Descripcion: 'Descripción 10',
                priorizacion: 'Priorización 10'
            },
            {
                id: 11,
                nombre: 'Prestación 11',
                Descripcion: 'Descripción 11',
                priorizacion: 'Priorización 11'
            },
            {
                id: 12,
                nombre: 'Prestación 12',
                Descripcion: 'Descripción 12',
                priorizacion: 'Priorización 12'
            }]);
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
            <DataTable value={listadoTable} filters={filters} size="small" tableStyle={{ minWidth: '50rem' }} globalFilterFields={['id', 'nombre', 'Descripcion', 'priorizacion']} header={header}  emptyMessage="Ningún dato disponible en esta tabla.">
                <Column field="id" header="ID"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="Descripcion" header="Descripción"></Column>
            </DataTable>
        </>
    );
};

export default TablaPrestacion;
