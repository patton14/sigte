import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
function TablaRut() {
    const [listadoTable, setListadoTable] = useState([]);
    return (
        <>
            <DataTable value={listadoTable} size='small' tableStyle={{ minWidth: '50rem' }} emptyMessage="Ningún dato disponible en esta tabla.">
                <Column field="id" header="ID"></Column>
                <Column field="id_local" header="ID Local"></Column>
                <Column field="id_rnle" header="ID RNLE"></Column>
                <Column field="priorizacion" header="Priorización SS"></Column>
                <Column field="priorizacion" header="Registro"></Column>
                <Column field="priorizacion" header="Ingreso"></Column>
                <Column field="priorizacion" header="Salida"></Column>
                <Column field="priorizacion" header="Tiempo espera"></Column>
                <Column field="priorizacion" header="Lista espera"></Column>
                <Column field="priorizacion" header="Prestación ministerial"></Column>
                <Column field="priorizacion" header="Paciente"></Column>
                <Column field="priorizacion" header="Origen"></Column>
                <Column field="priorizacion" header="Destino"></Column>
                <Column field="priorizacion" header="Acciones"></Column>
            </DataTable>
        </>
    );
}

export default TablaRut;
