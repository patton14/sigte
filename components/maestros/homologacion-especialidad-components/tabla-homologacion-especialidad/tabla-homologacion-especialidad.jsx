import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useState } from 'react';
const TablaHomologacionEspecialidad = () => {
    const [listadoTable, setListadoTable] = useState([]);
    return (
        <>
            <DataTable value={listadoTable} size="small" tableStyle={{ minWidth: '50rem' }} emptyMessage="Ningún dato disponible en esta tabla.">
                <Column field="id" header="ID"></Column>
                <Column field="p_homologada" header="Prestación Homologar"></Column>
                <Column field="edad_minima" header="Edad Mínima"></Column>
                <Column field="edad_maxima" header="Edad Máxima"></Column>
                <Column field="prestacion" header="Prestación"></Column>
                <Column field="esp" header="Especialidad Médica"></Column>
                <Column field="esp" header="Especialidad Odontológica"></Column>
                <Column field="priorizacion" header="Acciones"></Column>
            </DataTable>
        </>
    );
};

export default TablaHomologacionEspecialidad;
