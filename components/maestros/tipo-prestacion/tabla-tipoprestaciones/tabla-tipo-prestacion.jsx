import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, {useEffect, useState} from 'react';
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {FilterMatchMode, FilterOperator} from "primereact/api";
import { getAllTipoPrestaciones } from '@/service/sigte-services/tipo-prestacion/tipo-prestacion-service';
function TablaTipoPrestacion() {
    const [listadoTable, setListadoTable] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');



    useEffect(() => {

        const loadData = async() =>{
            const tipoPrestacion = await getAllTipoPrestaciones()
            console.log(tipoPrestacion);
            setListadoTable(tipoPrestacion?.tipo_prestaciones)
        }
        loadData();
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
            </DataTable>
        </>
    );
}

export default TablaTipoPrestacion;
