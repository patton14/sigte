import React, { useRef, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toolbar } from 'primereact/toolbar';
import { InputText } from 'primereact/inputtext';
import { exportToExcel } from '@/utils/funciones/ExportExcel';

const severities = {
    1: 'Ingreso',
    3: 'Egreso',
    5: 'Edición Ingreso',
    7: 'Edición Egreso',
    9: 'Edición Egreso reabrir',
};

const LineaTiempoComp = ({ selectedHistorial }) => {
    const dt = useRef(null);
    const [globalFilter, setGlobalFilter] = useState('');

    const exportData = () => {
        exportToExcel(selectedHistorial, 'Historial');
    };

    const tipoCargaBodyTemplate = (rowData) => {
        return (
            <span className={`badge badge-${severities[rowData.TIPO_ARCHIVO] === 'Ingreso' ? 'info' : severities[rowData.TIPO_ARCHIVO] === 'Egreso' ? 'success' : 'warning'}`}>
                {severities[rowData.TIPO_ARCHIVO]}
            </span>
        );
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Exportar a Excel" icon="pi pi-file-excel" className="p-button-success" onClick={exportData} />
            </React.Fragment>
        );
    };

    const rightToolbarTemplate = () => {
        return (
            <span className="p-input-icon-left">
                <i className="pi pi-search" />
                <InputText
                    type="search"
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    placeholder="Buscar..."
                />
            </span>
        );
    };

    return (
        <div>
            <Toolbar start={leftToolbarTemplate} end={rightToolbarTemplate} />

            <DataTable ref={dt} value={selectedHistorial}
                       resizableColumns
                       emptyMessage="Ningún dato disponible en esta tabla."
                       columnResizeMode="expand"
                       paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                       dataKey={'_id'} filterDisplay="menu"
                       scrollable scrollDirection="horizontal"
                       pageLinkSize={10} scrollHeight={'calc(100vh - 300px)'}
                       paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                       currentPageReportTemplate={'Mostrando {first} a {last} de {totalRecords} registros'}
                       globalFilter={globalFilter}
            >
                <Column field="FECHA_HISTORIAL" header="Fecha de Actualización" />
                <Column field="USUARIO_CARGA" header="Usuario" />
                <Column field="SERV_SALUD_NOMBRE" header="Nombre servicio salud" />
                <Column field="ARCHIVO_ID" header="Id Carga" />
                <Column field="TIPO_ARCHIVO" header="Tipo Carga" body={tipoCargaBodyTemplate} />

                {/* Información Personal */}
                <Column field="RUN" header="RUN" />
                <Column field="DV" header="DV" />
                <Column field="NOMBRES" header="Nombres" />
                <Column field="PRIMER_APELLIDO" header="Primer Apellido" />
                <Column field="SEGUNDO_APELLIDO" header="Segundo Apellido" />
                <Column field="FECHA_NAC" header="Fecha de Nacimiento" />
                <Column field="FONO_FIJO" header="Teléfono Fijo" body={(rowData) => rowData.FONO_FIJO || "No Informado"} />
                <Column field="FONO_MOVIL" header="Teléfono Móvil" body={(rowData) => rowData.FONO_MOVIL || "No Informado"} />
                <Column field="EMAIL" header="Email" body={(rowData) => rowData.EMAIL || "No Informado"} />

                {/* Información del Establecimiento */}
                <Column field="ESTAB_ORIG_NOMBRE" header="Establecimiento de Origen" />
                <Column field="ESTAB_DEST_NOMBRE" header="Establecimiento de Destino" />
                <Column field="F_ENTRADA" header="Fecha de Entrada" />
                <Column field="F_SALIDA" header="Fecha de Salida" body={(rowData) => rowData.F_SALIDA || "No Informado"} />
                <Column field="C_SALIDA" header="Código de Salida" body={(rowData) => rowData.C_SALIDA || "No Informado"} />

                {/* Detalles Adicionales */}
                <Column field="SOSPECHA_DIAG" header="Sospecha Diagnóstico" />
                <Column field="CONFIR_DIAG" header="Confirmación Diagnóstico" />
                <Column field="COND_RURALIDAD" header="Condición de Ruralidad" />
                <Column field="VIA_DIRECCION" header="Vía Dirección" />
                <Column field="NOM_CALLE" header="Nombre de Calle" />
                <Column field="NUM_DIRECCION" header="Número de Dirección" body={(rowData) => rowData.NUM_DIRECCION || "No Informado"} />
                <Column field="RESTO_DIRECCION" header="Resto de Dirección" body={(rowData) => rowData.RESTO_DIRECCION || "No Informado"} />
                <Column field="CIUDAD" header="Ciudad" />

                {/* Información de la Prestación */}
                <Column field="TIPO_PRESTACION_NOMBRE" header="Tipo de Prestación" />
                <Column field="PRESTA_MIN_NOMBRE" header="Prestación Mínima" />
                <Column field="PRESTA_EST" header="Prestación Estimada" />
                <Column field="PLANO_NOMBRE" header="Plano" />
                <Column field="EXTREMIDAD_NOMBRE" header="Extremidad" />
            </DataTable>
        </div>
    );
};

export default LineaTiempoComp;
