import React, { useEffect, useState } from 'react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import CargaMasivaBuscar from '@/components/casos/carga-masiva/seccion-selector/carga-masiva-buscar';
import { getTipoCargas } from '@/service/sigte-services/tipo-cargas/tipo-cargas-service';
import { getServiciosSalud } from '@/service/sigte-services/servicio-salud/servicio-salud-service';
import { getEstadoCargas } from '@/service/sigte-services/estado-cargas/estado-cargas-service';
import { Tag } from 'primereact/tag';
import { Tooltip } from 'primereact/tooltip';
import { FilterMatchMode } from 'primereact/api';
import { cancelarCarga, downLoadErrorCarga, downLoadOriginalFile, sendToQueue } from '@/service/sigte-services/cargas/cargas-service';
import { getAllUsuarios } from '@/service/sigte-services/usuarios/usuarios-service';
import { Button } from 'primereact/button';
import { SplitButton } from 'primereact/splitbutton';
import Swal from 'sweetalert2';
import { useSession } from 'next-auth/react';


const ListadoCargas = (props) => {
    const { data: session } = useSession();
    const [tipos, setTipos] = useState([]);
    const [servicioSalud, setServicioSalud] = useState([]);
    const [estadoCargas, setEstadoCargas] = useState([]);
    const [cargaList, setCargaList] = useState([]);
    const [filters, setFilters] = useState(null);
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            const result = await getTipoCargas();
            const servSalud = await getServiciosSalud();
            const estadoCarga = await getEstadoCargas();
            const usuarios = await getAllUsuarios();

            const cargasFormateadas = await Promise.all(
                props.cargas.map(async (carga) => {
                    const nombreArchivoOriginal = carga?.nombre_archivo.replace(/_[^_]+_[^_]+\.[^.]+$/, '');
                    const tipoCargas = result?.tipo_cargas.find(item => item.id === carga.tipo_carga_id) || {};
                    const servicioSaluds = servSalud?.servicios_salud.find(item => item.id === carga.servicio_salud_id) || {};
                    const estadoCargas = estadoCarga?.estado_cargas.find(item => item.id === carga.estado_carga) || {};
                    const usuario = usuarios?.find(item => item.id === carga.cod_usuario) || {};


                    return {
                        ...carga,
                        servicio_salud_nombre: servicioSaluds.nombre,
                        estado_carga_nombre: estadoCargas.nombre,
                        usuario_nombre: usuario.nombre,
                        nombre_archivo: nombreArchivoOriginal
                    };
                })
            );

            // Ordenar las cargas formateadas por el nuevo campo fecha_ordenacion de más reciente a más antigua
            cargasFormateadas.sort((a, b) => b.id - a.id);
            console.log(cargasFormateadas);

            setCargaList(cargasFormateadas);
            setTipos(result?.tipo_cargas || []);
            setServicioSalud(servSalud?.servicios_salud || []);
            setEstadoCargas(estadoCarga?.estado_cargas || []);
            setLoading(false);
        };

        loadData();
        initFilters();
        return () => {
        };
    }, [props.cargas]);


    const clearFilter = () => {
        initFilters();
    };
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            servicio_salud_id: { value: null, matchMode: FilterMatchMode.CONTAINS }
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
    const customDateFilter = (value, filter) => {
        if (!filter || !filter.value || !filter.value.length) return true;

        let [fechaInicio, fechaFin] = filter.value;
        // Establecer la hora al inicio del día para fechaInicio
        fechaInicio = new Date(fechaInicio);
        fechaInicio.setHours(0, 0, 0, 0);
        // Establecer la hora al final del día para fechaFin
        fechaFin = new Date(fechaFin);
        fechaFin.setHours(23, 59, 59, 999);

        let fechaRegistro = new Date(value.split(' ')[0].split('-').reverse().join('-')).getTime();

        return fechaRegistro >= fechaInicio.getTime() && fechaRegistro <= fechaFin.getTime();
    };
    const handleFilterChange = (newFilters) => {
        let updatedFilters = { ...filters };

        if (newFilters.servicioSalud) {
            updatedFilters.servicio_salud_id = { value: newFilters.servicioSalud.id, matchMode: FilterMatchMode.CONTAINS };
        }

        if (newFilters.tipoCarga) {
            updatedFilters.tipo_carga_id = { value: newFilters.tipoCarga.id, matchMode: FilterMatchMode.CONTAINS };
        }

        if (newFilters.estadoCarga) {
            updatedFilters.estado_carga = { value: newFilters.estadoCarga.id, matchMode: FilterMatchMode.CONTAINS };
        }

        // Filtro por rango de fechas (asumiendo que la fecha se almacena en formato 'dd/mm/yyyy')
        if (newFilters.fechaRango && newFilters.fechaRango.length === 2 && newFilters.fechaRango[0] && newFilters.fechaRango[1]) {
            console.log(newFilters.fechaRango);
            const [fechaInicio, fechaFin] = newFilters.fechaRango;
            updatedFilters.fecha_creacion = {
                value: [fechaInicio, fechaFin],
                matchMode: 'custom' // Aunque no se usa en el filtro personalizado, se mantiene por consistencia
            };
        }

        setFilters(updatedFilters);
    };
    const header = (
        <CargaMasivaBuscar limitador={props.limitador} clearFilter={clearFilter} onFilterChange={handleFilterChange} globalFilterValue={globalFilterValue} onGlobalFilterChange={onGlobalFilterChange} tipos={tipos} servicioSalud={servicioSalud} estadoCargas={estadoCargas} refresh={props.refresh}
                           setRefresh={props.setRefresh} />
    );
    const servicioSaludTemplate = (rowData) => {
        const servSalud = servicioSalud.find(item => item.id === rowData.servicio_salud_id)?.id || 'Desconocido';
        return (
            <>
                <Tooltip target={`.serv-salud-${rowData.servicio_salud_id}`} content={servSalud} position="top" />
                <div className={`serv-salud-${rowData.servicio_salud_id}`}>
                    {rowData.servicio_salud_nombre}
                </div>
            </>
        );
    };
    const enviarCarga = async (rowData) => {
        //sendToQueue
        console.log(rowData);
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas enviar la carga a la cola de procesamiento?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await sendToQueue(rowData._id);
                if (response) {
                    Swal.fire(
                        '¡Carga enviada!',
                        'La carga ha sido enviada a la cola de procesamiento',
                        'success'
                    );
                    props.setRefresh(!props.refresh);
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Ha ocurrido un error al enviar la carga a la cola de procesamiento',
                        'error'
                    );
                }
            }
        });
    };

    const cancelarLaCarga = async (rowData) => {
        //cancelarCarga
        console.log(rowData);
        Swal.fire({
            title: '¿Estás seguro?',
            text: '¿Deseas cancelar la carga?',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sí',
            cancelButtonText: 'No'
        }).then(async (result) => {
            if (result.isConfirmed) {
                const response = await cancelarCarga(rowData._id);
                if (response) {
                    Swal.fire(
                        '¡Carga cancelada!',
                        'La carga ha sido cancelada',
                        'success'
                    );
                    props.setRefresh(!props.refresh);
                } else {
                    Swal.fire(
                        '¡Error!',
                        'Ha ocurrido un error al cancelar la carga',
                        'error'
                    );
                }
            }
        });
    };

    const getTipoCargaSeverity = (tipoCargaId) => {
        // Asigna una clase de estilo basada en el tipo_carga_id
        const severities = {
            1: 'info',    // Ingreso
            3: 'success', // Ereso
            5: 'warning', // Edicion Ingreso
            7: 'danger',  // Edicion Egreso
            9: 'help'    // Edición Egreso reabrir
        };
        return severities[tipoCargaId] || 'info'; // 'info' como valor predeterminado si no se encuentra el tipo
    };

    const getEstadoCargaSeverity = (estadoCargaId) => {
        // Asigna una clase de estilo basada en el estado_carga_id
        const severities = {
            1: 'info',    // Borrador
            2: 'danger', // Cancelado
            3: 'help', // En proceso
            5: 'success',   // Procesado
            6: 'warning'     // Procesado con errores
        };
        return severities[estadoCargaId] || 'info'; // 'info' como valor predeterminado si no se encuentra el estado
    };

    const tipoCargaTemplate = (rowData) => {
        const severityLoad = getTipoCargaSeverity(rowData.tipo_carga_id);
        const servSalud = tipos.find(item => item.id === rowData.tipo_carga_id)?.nombre || 'Desconocido';
        return <Tag value={servSalud} severity={severityLoad} />;
    };

    const estadoCargaTemplate = (rowData) => {
        const estadoCarga = estadoCargas.find(item => item.id === rowData.estado_carga) || 'Desconocido';
        return (
            <>
                <Tooltip target={`.estado-carga-${rowData.id}`} content={estadoCarga.descripcion} position="top" />
                <Tag severity={getEstadoCargaSeverity(estadoCarga.id)} className={`estado-carga-${rowData.id}`} value={estadoCarga.nombre} />
            </>

        );
    };

    const mensajeBodyTemplate = (rowData) => {
        const mensaje = rowData?.mensaje || null;

        // Función para verificar si el usuario tiene ciertos roles
        const userHasRoles = (roles) => {
            return session.roles.Authorizations.some(auth => roles.includes(auth.RolID));
        };

        // Función para descargar el archivo original
        const downloadOriginalFile = (rowData) => {
            // Implementar lógica para descargar el archivo original
            downLoadOriginalFile(rowData);
        };

        // Función para descargar el archivo procesado
        const downloadProcessedFile = (rowData) => {
            downLoadErrorCarga(rowData);
        };

        // Función para descargar el archivo procesado parcial
        const downloadPartialProcessedFile = (rowData) => {
            // Implementar lógica para descargar el archivo procesado parcial
            downLoadErrorCarga(rowData);
        };

        // Renderizar botones de acción dependiendo del estado de la carga y el rol del usuario
        const renderActionButtons = () => {
            return (

                <div className="flex justify-center gap-2">
                    <Tooltip target={`.play-${rowData.id}`} content="Iniciar Procesado" position="top" />
                    <Tooltip target={`.stop-${rowData.id}`} content="Cancelar Carga" position="top" />
                    <Tooltip target={`.mensaje-${rowData.id}`} content="Descargar Archivo Original" position="top" />

                    {userHasRoles([1, 2]) && (
                        <>
                            <Button
                                icon="pi pi-play"
                                rounded
                                aria-label="Filter"
                                className={`play-${rowData.id} cursor-pointer`}
                                value={mensaje}
                                severity="success"
                                onClick={() => enviarCarga(rowData)}
                            />
                        </>
                    )}
                    {userHasRoles([1, 2]) && (
                        <>
                            <Button
                                icon="pi pi-stop"
                                rounded
                                aria-label="Filter"
                                className={`stop-${rowData.id} cursor-pointer`}
                                value={mensaje}
                                severity="danger"
                                onClick={() => cancelarLaCarga(rowData)}
                            />
                            <Button
                                icon="pi pi-download"
                                onClick={() => downloadOriginalFile(rowData)}
                                className={`mensaje-${rowData.id} cursor-pointer p-button-rounded p-button-warning custom-splitbutton`}
                            />
                        </>
                    )}


                </div>
            );
        };

        const renderCancelOption = () => {
            return (
                <>
                    <Tooltip target={`.mensaje-${rowData.id}`} content="Descargar Archivo Original" position="top" />
                    <Button
                        icon="pi pi-download"
                        onClick={() => downloadOriginalFile(rowData)}
                        className={`mensaje-${rowData.id} cursor-pointer p-button-rounded p-button-warning custom-splitbutton`}
                    />
                </>
            );
        };

        // Renderizar botón de descarga dependiendo del estado de la carga
        const renderDownloadButton = () => {
            const items = [];

            if (rowData.estado_carga === 3 && mensaje) {
                items.push({
                    label: 'Descargar Archivo Procesado Parcial',
                    icon: 'pi pi-download',
                    command: () => downloadPartialProcessedFile(rowData)
                });
            } else if (rowData.estado_carga !== 3) {
                items.push({
                    label: 'Descargar Archivo Procesado',
                    icon: 'pi pi-download',
                    command: () => downloadProcessedFile(rowData)
                });
            } else {
                items.push({
                    label: 'Archivo no disponible',
                    icon: 'pi pi-times'
                });
            }

            return (
                <>
                    <Tooltip target={`.principal-${rowData.id}`} content="Descargar Archivo Original" position="top" />
                    <Tooltip target={`.menu-${rowData.id}`} content="Descargar Archivo Procesado" position="top" />
                    <SplitButton
                        icon="pi pi-download"
                        model={items.length > 0 ? items : null}
                        buttonClassName={`principal-${rowData.id} cursor-pointer p-button-warning`}
                        onClick={() => downloadOriginalFile(rowData)}
                        menuButtonClassName={`menu-${rowData.id} cursor-pointer p-button-warning `}
                        className={`cursor-pointer p-button-rounded p-button-warning custom-splitbutton`}
                    />
                </>
            );
        };

        // Condiciones para mostrar las acciones
        if (rowData.estado_carga === 2) {
            return renderCancelOption();
        }

        if (!mensaje && rowData.estado_carga !== 5 && rowData.estado_carga !== 6 && rowData.estado_carga !== 3) {
            return renderActionButtons();
        }

        return renderDownloadButton();
    };

    return (
        <>

            <DataTable loading={loading} header={header} value={cargaList} filters={filters}
                       globalFilterFields={['id', 'tipo_carga_id', 'servicio_salud_id', 'fecha_creacion', 'nombre_archivo',
                           'cod_usuario', 'estado_carga', 'Mensaje', 'usuario_nombre', 'servicio_salud_nombre', 'estado_carga_nombre']}
                       editMode="row" dataKey="id" tableStyle={{ minWidth: '50rem' }}
                       rows={10} rowsPerPageOptions={[10, 20, 50]} paginator
            >
                <Column field="id" header="ID"></Column>
                <Column field="tipo_carga_id" header="Tipo" body={tipoCargaTemplate}></Column>
                <Column field="servicio_salud_nombre" filterField="servicio_salud_nombre" header="Servicio Salud" body={servicioSaludTemplate} style={{ textAlign: 'center' }}></Column>
                <Column field="fecha_creacion" header="Fecha Creación"
                        filter filterMatchMode="custom" filterFunction={customDateFilter}></Column>
                <Column field="nombre_archivo" header="Nombre archivo"></Column>
                <Column field="usuario_nombre" header="Usuario"></Column>
                <Column field="estado_carga_nombre" header="Estado" body={estadoCargaTemplate}></Column>
                <Column field="mensaje" header="Acciones" body={mensajeBodyTemplate}></Column>
            </DataTable>

        </>

    );
};

export default ListadoCargas;
