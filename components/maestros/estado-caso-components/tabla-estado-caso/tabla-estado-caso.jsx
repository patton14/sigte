import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
const TablaEstadoCaso = () => {
    const [listadoTable, setListadoTable] = useState([]);
    return (
        <>
            <DataTable value={listadoTable} size="small" tableStyle={{ minWidth: '50rem' }} emptyMessage="Ningún dato disponible en esta tabla.">
                <Column field="id" header="ID"></Column>
                <Column field="nombre" header="Nombre"></Column>
                <Column field="tipo_prestacion" header="Tipo Prestación"></Column>
                <Column field="egreso" header="Egreso Masivo"></Column>
                <Column field="Descripcion" header="Descripción"></Column>
                <Column field="priorizacion" header="Acciones"></Column>
            </DataTable>
        </>
    );
};

export default TablaEstadoCaso;
