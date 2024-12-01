import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
const TablaConfNotificacion = () => {
    const [listadoTable, setListadoTable] = useState([]);
    return (
        <>
            <DataTable value={listadoTable} size="small" tableStyle={{ minWidth: '50rem' }} emptyMessage="Ningún dato disponible en esta tabla.">
                <Column field="establecimiento" header="Establecimiento"></Column>
                <Column field="url" header="Url"></Column>
                <Column field="priorizacion" header="Acciones"></Column>
            </DataTable>
        </>
    );
};

export default TablaConfNotificacion;
