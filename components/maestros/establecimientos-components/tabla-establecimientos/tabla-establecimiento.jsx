import React, {useEffect, useState} from 'react';
import {FilterMatchMode} from "primereact/api";
import {Button} from "primereact/button";
import {InputText} from "primereact/inputtext";
import {DataTable} from "primereact/datatable";
import {Column} from "primereact/column";
import { getAllEstablecimientos } from '@/service/sigte-services/establecimiento/establecimiento-service';

const TablaEstablecimiento = () => {
    const [listadoTable, setListadoTable] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');



    useEffect(() => {
        const loadData = async()=>{
            const establecimiento = await getAllEstablecimientos();
            console.log(establecimiento);
            setListadoTable(establecimiento?.establecimientos)
        }
        loadData()
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
            <DataTable value={listadoTable} filters={filters} size="small" tableStyle={{ minWidth: '50rem' }}
                       globalFilterFields={['id', 'nombre', 'region_nombre', 'nom_comuna', 'ss_nombre','tipo_establecimiento','nivel_de_atencion_DEIS', 'vigente']}
                        header={header}  emptyMessage="Ningún dato disponible en esta tabla."
                        rows={20} paginator
                        >
                <Column field="id" header="ID"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="region_nombre" header="Region"></Column>
                <Column field="nom_comuna" header="Comuna"></Column>
                <Column field="ss_nombre" header="SS nombre"></Column>
                <Column field="tipo_establecimiento" header="Tipo"></Column>
                <Column field="nivel_de_atencion_DEIS" header="Nivel de atencion DEIS"></Column>
                <Column field="vigente" header="Vigente"></Column>
            </DataTable>
        </>
    );
};

export default TablaEstablecimiento;
