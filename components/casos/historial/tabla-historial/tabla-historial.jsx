import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toolbar } from 'primereact/toolbar';
import LineaTiempoComp from '@/components/casos/historial/linea-tiempo/linea-tiempo-comp';
import 'primeflex/primeflex.css';
import { FilterMatchMode } from 'primereact/api';

function TablaHistorial({ casosHistoricos, refresh, setRefresh, loading, loadMoreData, hasMore, totalRecords }) {
    const [listadoTable, setListadoTable] = useState([]);
    const [selectedHistorial, setSelectedHistorial] = useState(null);
    const [dialogVisible, setDialogVisible] = useState(false);
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS }
    });
    const [globalFilterList, setGlobalFilterList] = useState([
        'SIGTE_ID', 'RUN', 'DV', 'NOMBRES', 'PRIMER_APELLIDO',
        'SEGUNDO_APELLIDO', 'FECHA_NAC', 'SEXO', 'PREVISION', 'TIPO_PRESTACION_NOMBRE', 'FECHA_HISTORIAL',
        'ESTAB_ORIG_NOMBRE', 'ESTAB_DEST_NOMBRE', 'PRESTA_MIN', 'PLANO_NOMBRE', 'EXTREMIDAD_NOMBRE', 'PRESTA_MIN_NOMBRE'
    ]);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    useEffect(() => {
        const processedData = casosHistoricos?.map(caso => {
            const firstHistorial = caso?.historial[0];
            return {
                ...firstHistorial,
                _id: caso?._id,
                SIGTE_ID: caso?.SIGTE_ID,
                historial: caso?.historial
            };
        });
        setListadoTable(processedData);
    }, [casosHistoricos]);

    const clearFilter = () => {
        initFilters();
    };
    const casosTotalesTemplate = () => {
        return (<div>
            <span><strong>Casos Totales: {totalRecords}</strong></span>
        </div>);
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS }
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

    const showHistorial = (historial) => {
        setSelectedHistorial(historial);
        setDialogVisible(true);
    };

    const actionTemplate = (rowData) => {
        return (
            <Button type="button" label="Ver Historial" icon="pi pi-eye" className="p-button-rounded p-button-outlined p-button-primary p-button-sm" onClick={() => showHistorial(rowData.historial)} />
        );
    };

    const renderHeader = () => (
        <Toolbar
            className="p-mb-4 p-py-2"
            start={() => (
                <>
                    {/*<Button label="Recargar" icon="pi pi-refresh" className="p-button-rounded p-button-outlined p-button-help p-mr-2" onClick={() => setRefresh(!refresh)} loading={loading} />*/}
                    {hasMore && (
                        <Button
                            label="Cargar más"
                            icon="pi pi-plus"
                            className="p-button-rounded p-button-outlined p-button-help"
                            onClick={loadMoreData}
                            loading={loading}
                        />
                    )}
                </>
            )}
            end={() => (
                <>
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda global" className="p-mr-2 p-inputtext-sm p-rounded" />
                    </span>
                    <Button label="Limpiar" icon="pi pi-times" className="p-button-rounded p-button-outlined p-button-secondary" onClick={clearFilter} />
                </>
            )}
        />
    );

    const header = renderHeader();

    return (
        <div className="datatable-expand-demo p-py-4">
            <DataTable value={listadoTable} size="small" tableStyle={{ minWidth: '80rem' }} filters={filters}
                       globalFilterFields={globalFilterList} showGridlines
                       header={header} emptyMessage="Ningún dato disponible en esta tabla."
                       resizableColumns columnResizeMode="expand"
                       loading={loading}
                       paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                       dataKey={'_id'} filterDisplay={'row'}
                       scrollable  scrollDirection="horizontal"
                       pageLinkSize={10} scrollHeight={'calc(100vh - 300px)'}
                       paginatorLeft={casosTotalesTemplate}
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                       currentPageReportTemplate={'Mostrando {first} a {last} de {totalRecords} registros'}
                       >
                <Column field="SIGTE_ID" header="SIGTE_ID" sortable className="p-text-center" />
                <Column field="NOMBRES" header="Nombres" sortable />
                <Column field="PRIMER_APELLIDO" header="Primer Apellido" sortable />
                <Column field="SEGUNDO_APELLIDO" header="Segundo Apellido" sortable />
                <Column field="TIPO_PRESTACION_NOMBRE" header="Tipo Prestación" sortable className="p-text-center" />
                <Column field="PRESTA_MIN_NOMBRE" header="PRESTA_MIN" sortable className="p-text-center" />
                <Column field="PLANO_NOMBRE" header="Plano" sortable className="p-text-center" />
                <Column field="EXTREMIDAD_NOMBRE" header="Extremidad" sortable className="p-text-center" />
                <Column field="ESTAB_ORIG_NOMBRE" header="Establecimiento de origen" sortable className="p-text-center" />
                <Column field="ESTAB_DEST_NOMBRE" header="Establecimiento de destino" sortable className="p-text-center" />
                <Column field="F_ENTRADA" header="Fecha Entrada" sortable className="p-text-center" />
                <Column body={actionTemplate} header="Acción" className="p-text-center" frozen frozenWidth="10rem" />
            </DataTable>

            <Dialog header="Historial Completo" maximizable blockScroll visible={dialogVisible} style={{ width: '80vw' }} onHide={() => setDialogVisible(false)}>
                <LineaTiempoComp selectedHistorial={selectedHistorial} />
            </Dialog>
        </div>
    );
}

export default TablaHistorial;
