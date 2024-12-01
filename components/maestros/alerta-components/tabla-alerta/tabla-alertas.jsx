import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
const TablaAlertas = () => {
    const [listadoTable, setListadoTable] = useState([]);
    return (
        <>
            <DataTable value={listadoTable} size="small" tableStyle={{ minWidth: '50rem' }} emptyMessage="Ningún dato disponible en esta tabla.">
                <Column field="id" header="ID"></Column>
                <Column field="Detalle" header="Detalle"></Column>
                <Column field="tipo" header="Tipo"></Column>
                <Column field="traspaso" header="Para Traspaso"></Column>
                <Column field="priorizacion" header="Acciones"></Column>
            </DataTable>
        </>
    );
};

export default TablaAlertas;
