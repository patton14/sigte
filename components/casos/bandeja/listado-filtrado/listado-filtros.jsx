import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, { useEffect, useState } from 'react';
import { FilterMatchMode } from 'primereact/api';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { getAllCasos, getAllCasosByEstablecimiento, getAllCasosByServicioSalud, getCasosFiltrados, getTotalCasos, getTotalCasosBySS } from '@/service/sigte-services/casos/casos-services';
import { getTipoCargas } from '@/service/sigte-services/tipo-cargas/tipo-cargas-service';
import { getAllTipoPrestaciones } from '@/service/sigte-services/tipo-prestacion/tipo-prestacion-service';
import { Toolbar } from 'primereact/toolbar';
import { Tooltip } from 'primereact/tooltip';
import { MultiSelect } from 'primereact/multiselect';
import { getAllEstablecimientos, getEstablecimientoById, getEstablecimientoBySs } from '@/service/sigte-services/establecimiento/establecimiento-service';
import { useSession } from 'next-auth/react';
import { exportToExcel } from '@/utils/funciones/ExportExcel';

function ListadoFiltros({ setEstablecimientosList, casosList, setCasosList, limit, page, setPage, filtros, setFiltros, pageFilter, setPageFilter }) {
    const { data: session, status } = useSession();
    const [listadoTable, setListadoTable] = useState([]);
    const [listTipoCargas, setListTipoCargas] = useState([]);
    const [listEstablecimientos, setListEstablecimientos] = useState([]);
    const [listTipoPrestaciones, setListTipoPrestaciones] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);

    const [totalRecords, setTotalRecords] = useState(0);  // Número total de registros
    const [filters, setFilters] = useState({
        global: { value: null, matchMode: FilterMatchMode.CONTAINS },
        TIPO_ARCHIVO: { value: null, matchMode: FilterMatchMode.IN },
        TIPO_PREST: { value: null, matchMode: FilterMatchMode.IN },
        ESTAB_ORIG: { value: null, matchMode: FilterMatchMode.IN },
        ESTAB_DEST: { value: null, matchMode: FilterMatchMode.IN }
    });
    const [globalFilterList, setGlobalFilterList] = useState(['SIGTE_ID', 'SERV_SALUD', 'NOMBRES', 'ID_LOCAL', 'TIPO_ARCHIVO', 'TIPO_PREST', 'F_ENTRADA', 'F_SALIDA', 'PRESTA_MIN', 'ESTAB_ORIG', 'ESTAB_DEST', 'PRIMER_APELLIDO', 'SEGUNDO_APELLIDO']);
    const [globalFilterValue, setGlobalFilterValue] = useState('');

    const convertirFecha = (fechaStr) => {
        let partes = fechaStr.split('-');
        let dia = parseInt(partes[0], 10);
        let mes = parseInt(partes[1], 10) - 1; // Los meses en JavaScript son 0-indexados
        let anio = parseInt(partes[2], 10);
        return new Date(anio, mes, dia);
    };

    const funcDiasEspera = (f_entrada, f_salida) => {
        // Primer comprobamos que ambas fechas sean válidas, de lo contrario retornamos un string "Falta Fecha"
        if (!f_entrada || !f_salida) return 'Falta Fecha';

        // Convertimos las fechas a objetos Date utilizando la función convertirFecha
        const fechaEntrada = convertirFecha(f_entrada);
        const fechaSalida = convertirFecha(f_salida);

        // Comprobamos que las fechas convertidas sean válidas
        if (isNaN(fechaEntrada) || isNaN(fechaSalida)) return 'No calculable';

        // Calculamos la diferencia en milisegundos
        const diferencia = fechaSalida - fechaEntrada;

        // Convertimos la diferencia a días
        // Retornamos el resultado redondeado
        return Math.floor(diferencia / (1000 * 60 * 60 * 24));
    };
    useEffect(() => {
        const cargarListado = async () => {
            setLoading(true);
            if (session.roles.Authorizations.some(auth => auth.RolID === 1)) {
                // Obtener el número total de casos
                const RestotalCasos = await getTotalCasos();
                const totalCasos = RestotalCasos?.count;
                setTotalRecords(totalCasos);  // Guardar el total de registros en estado
                console.log(totalCasos);

                const result = await getAllCasos({ page, limit }) || [];
                console.log(result);
                if (result.length > 0) {
                    // Añadir index a cada objeto y otros campos calculados
                    result.forEach((item, index) => {
                        item.index = index + 1 + (page - 1) * limit;  // Mantener el index acumulado
                        item.diasEspera = funcDiasEspera(item.F_ENTRADA, item.F_SALIDA);
                        item.TIPO_PREST = parseInt(item.TIPO_PREST, 10);
                        item.ESTAB_ORIG = parseInt(item.ESTAB_ORIG, 10);
                        item.ESTAB_DEST = parseInt(item.ESTAB_DEST, 10);
                    });
                    setListadoTable(prevState => [...prevState, ...result]);  // Acumular los nuevos registros
                    setLoading(false);
                    return;
                } else {
                    setLoading(false);
                    return;
                }
            }
            if (session.roles.Authorizations.some(auth => auth.RolID === 2)) {
                // Obtener el número total de casos
                // Guardar el total de registros en estado
                const listIdServicios = session.roles.ServiciosSalud;
                // convertri listIdServicios a [1,2,3]


                const RestotalCasos = await getTotalCasosBySS(listIdServicios);
                const totalCasos = RestotalCasos?.count;
                setTotalRecords(totalCasos);
                const body = {
                    page: page, limit: limit, listIdServicios: listIdServicios
                };
                const casosPorServicio = await getAllCasosByServicioSalud(body);

                // Filtra los casos que no sean null
                //const casosFiltered = casosBandeja.filter(caso => caso !== null);

                if (casosPorServicio.data.length === 0) {
                    setLoading(false);
                    return;
                }

                console.log(casosPorServicio);

                if (casosPorServicio.data.length > 0) {
                    // Añadir index a cada objeto y otros campos calculados
                    casosPorServicio.data.forEach((item, index) => {
                        item.index = index + 1 + (page - 1) * limit;  // Mantener el index acumulado
                        item.diasEspera = funcDiasEspera(item.F_ENTRADA, item.F_SALIDA);
                        item.TIPO_PREST = parseInt(item.TIPO_PREST, 10);
                        item.ESTAB_ORIG = parseInt(item.ESTAB_ORIG, 10);
                        item.ESTAB_DEST = parseInt(item.ESTAB_DEST, 10);
                    });
                    setListadoTable(prevState => [...prevState, ...casosPorServicio.data]);  // Acumular los nuevos registros
                    setLoading(false);
                    return;
                } else {
                    setLoading(false);
                    return;
                }

            }
            if (session.roles.Authorizations.some(auth => auth.RolID === 4 || auth.RolID === 5)) {
                console.log(session.roles);
                // Comprobamos si tiene asignado Servicios de salud
                if (session.roles.ServiciosSalud) {
                    // Obtener el número total de casos
                    // Guardar el total de registros en estado
                    const listIdServicios = session.roles.ServiciosSalud;
                    // convertri listIdServicios a [1,2,3]


                    const RestotalCasos = await getTotalCasosBySS(listIdServicios);
                    const totalCasos = RestotalCasos?.count;
                    setTotalRecords(totalCasos);
                    const body = {
                        page: page, limit: limit, listIdServicios: listIdServicios
                    };
                    const casosPorServicio = await getAllCasosByServicioSalud(body);

                    // Filtra los casos que no sean null
                    //const casosFiltered = casosBandeja.filter(caso => caso !== null);

                    if (casosPorServicio.data.length === 0) {
                        setLoading(false);
                        return;
                    }

                    console.log(casosPorServicio);

                    if (casosPorServicio.data.length > 0) {
                        // Añadir index a cada objeto y otros campos calculados
                        casosPorServicio.data.forEach((item, index) => {
                            item.index = index + 1 + (page - 1) * limit;  // Mantener el index acumulado
                            item.diasEspera = funcDiasEspera(item.F_ENTRADA, item.F_SALIDA);
                            item.TIPO_PREST = parseInt(item.TIPO_PREST, 10);
                            item.ESTAB_ORIG = parseInt(item.ESTAB_ORIG, 10);
                            item.ESTAB_DEST = parseInt(item.ESTAB_DEST, 10);
                        });
                        setListadoTable(prevState => [...prevState, ...casosPorServicio.data]);  // Acumular los nuevos registros
                        setLoading(false);
                        return;
                    } else {
                        setLoading(false);
                        return;
                    }
                }
                else if (session.roles.Establecimientos) {

                    // Obtener los ss_codigo segun los establecimientos
                    const listIdEstablecimientos = session.roles.Establecimientos;
                    const listIdServicios = await Promise.all(listIdEstablecimientos.map(async (id) => {
                        const servicio = await getEstablecimientoById(id);
                        return servicio.ss_codigo; // Asegúrate de devolver la lista de establecimientos
                    }));

                    //const RestotalCasos = await getTotalCasosBySS(listIdServicios);

                    const body = {
                        page: page, limit: limit, listIdServicios: listIdServicios
                    };
                    const casosPorServicio = await getAllCasosByServicioSalud(body);
                    console.log(casosPorServicio);
                    // filtrar los casos que el ESTAB_ORIG o el ESTAB_DEST esten en la lista de listIdEstablecimientos
                    // convertir listIdEstablecimientos a strings
                    const listIdEstablecimientosStr = listIdEstablecimientos.map(String);
                    const casosFiltrados = casosPorServicio.data.filter(caso =>
                        listIdEstablecimientosStr.includes(caso.ESTAB_ORIG) || listIdEstablecimientos.includes(caso.ESTAB_DEST));

                    if (casosFiltrados.length === 0) {
                        setLoading(false);
                        return;
                    }

                    console.log(casosFiltrados);

                    if (casosFiltrados.length > 0) {
                        const totalCasos = casosFiltrados.length;
                        setTotalRecords(totalCasos);
                        // Añadir index a cada objeto y otros campos calculados
                        casosFiltrados.forEach((item, index) => {
                            item.index = index + 1 + (page - 1) * limit;  // Mantener el index acumulado
                            item.diasEspera = funcDiasEspera(item.F_ENTRADA, item.F_SALIDA);
                            item.TIPO_PREST = parseInt(item.TIPO_PREST, 10);
                            item.ESTAB_ORIG = parseInt(item.ESTAB_ORIG, 10);
                            item.ESTAB_DEST = parseInt(item.ESTAB_DEST, 10);
                        });
                        setListadoTable(prevState => [...prevState, ...casosFiltrados]);  // Acumular los nuevos registros
                        setLoading(false);
                        return;
                    } else {
                        setLoading(false);
                        return;
                    }
                }
            }
        };
        cargarListado();
        initFilters();
    }, [refresh, page]);
    useEffect(() => {
        console.log('casosList', casosList);

        const cargarListadoFiltrado = async () => {
            setLoading(true);
            if (casosList) {
                setTotalRecords(casosList.count);
                if (session.roles.Authorizations.some(auth => auth.RolID === 1)) {
                    //Añadir index a cada objeto
                    casosList.casos.forEach((item, index) => {
                        item.index = index + 1 + (page - 1) * limit;
                        console.log(item.F_SALIDA);
                        item.diasEspera = funcDiasEspera(item.F_ENTRADA, item.F_SALIDA);
                        item.TIPO_PREST = parseInt(item.TIPO_PREST, 10);
                        item.ESTAB_ORIG = parseInt(item.ESTAB_ORIG, 10);
                        item.ESTAB_DEST = parseInt(item.ESTAB_DEST, 10);

                    });
                    setListadoTable(casosList.casos);
                    setLoading(false);
                    return;
                }
                if (session.roles.Authorizations.some(auth => auth.RolID === 2)) {

                    // Aqui aplicamos la logica de carga pero al listado ya filtrado
                    const casosBySs = casosList.casos;
                    casosBySs.forEach((item, index) => {
                        item.index = index + 1 + (page - 1) * limit;
                        item.diasEspera = funcDiasEspera(item.F_ENTRADA, item.F_SALIDA);
                        item.TIPO_PREST = parseInt(item.TIPO_PREST, 10);
                        item.ESTAB_ORIG = parseInt(item.ESTAB_ORIG, 10);
                        item.ESTAB_DEST = parseInt(item.ESTAB_DEST, 10);
                    });

                    console.log(casosBySs);
                    setListadoTable(casosBySs);
                    setLoading(false);
                    return;
                }
                if (session.roles.Authorizations.some(auth => auth.RolID === 4 || auth.RolID === 5)) {
                    if (session.roles.ServiciosSalud) {
                        //const listIdServicios = session.roles.ServiciosSalud;
                        console.log(casosList.casos);
                        // Aqui aplicamos la logica de carga pero al listado ya filtrado
                        const casosBySs = casosList.casos;

                        casosBySs.forEach((item, index) => {
                            item.index = index + 1 + (page - 1) * limit;
                            item.diasEspera = funcDiasEspera(item.F_ENTRADA, item.F_SALIDA);
                            item.TIPO_PREST = parseInt(item.TIPO_PREST, 10);
                            item.ESTAB_ORIG = parseInt(item.ESTAB_ORIG, 10);
                            item.ESTAB_DEST = parseInt(item.ESTAB_DEST, 10);
                        });

                        console.log(casosBySs);
                        setListadoTable(casosBySs);
                        setLoading(false);
                    }else if(session.roles.Establecimientos){
                        const casosBySs = casosList.casos;
                        const listIdEstablecimientos = session.roles.Establecimientos;
                        const listIdEstablecimientosStr = listIdEstablecimientos.map(String);
                        const casosFiltrados = casosBySs.filter(caso =>
                            listIdEstablecimientosStr.includes(caso.ESTAB_ORIG) || listIdEstablecimientos.includes(caso.ESTAB_DEST));
                        setTotalRecords(casosFiltrados.length);
                        casosFiltrados.forEach((item, index) => {
                            item.index = index + 1 + (page - 1) * limit;
                            item.diasEspera = funcDiasEspera(item.F_ENTRADA, item.F_SALIDA);
                            item.TIPO_PREST = parseInt(item.TIPO_PREST, 10);
                            item.ESTAB_ORIG = parseInt(item.ESTAB_ORIG, 10);
                            item.ESTAB_DEST = parseInt(item.ESTAB_DEST, 10);
                        });

                        console.log(casosBySs);
                        setListadoTable(casosFiltrados);
                        setLoading(false);
                    }
                }
            } else {
                setLoading(false);
            }
        };
        if (casosList?.casos?.length > 0 && filtros) {
            cargarListadoFiltrado();
        }
        initFilters();
    }, [casosList]);

    useEffect(() => {
        const cargarMasListadoFiltrado = async () => {
            setLoading(true);
            const resultados = await getCasosFiltrados(filtros, pageFilter, limit);
            console.log(resultados);
            let respaldoCasos = casosList.casos;
            if (resultados.status === 201) {
                respaldoCasos = [...respaldoCasos, ...resultados.data.casos];
                console.log('respaldoCasos', respaldoCasos);
                setCasosList({ count: resultados.data.count, casos: respaldoCasos });
                setLoading(false);
            } else {
                setLoading(false);
            }
        };
        if (pageFilter > 1) {
            cargarMasListadoFiltrado();
        }
    }, [pageFilter]);


    useEffect(() => {
        const cargaTipoCargas = async () => {

            if (session.roles.Authorizations.some(auth => auth.RolID === 1)) {
                let establecimientos;
                const tipoCargas = await getTipoCargas();
                const tipoprestaciones = await getAllTipoPrestaciones();
                establecimientos = await getAllEstablecimientos();
                if (!tipoCargas || !tipoprestaciones || !establecimientos) return;
                setListTipoCargas(tipoCargas?.tipo_cargas);
                setListTipoPrestaciones(tipoprestaciones?.tipo_prestaciones);
                setListEstablecimientos(establecimientos?.establecimientos);
                setEstablecimientosList(establecimientos?.establecimientos);
                return;
            }
            if (session.roles.Authorizations.some(auth => auth.RolID === 2)) {
                let establecimientos;
                const tipoCargas = await getTipoCargas();
                const tipoprestaciones = await getAllTipoPrestaciones();
                const listIdServicios = session.roles.ServiciosSalud;
                const estab = await Promise.all(listIdServicios.map(async (id) => {
                    const establecimiento = await getEstablecimientoBySs(id);
                    return establecimiento.establecimientos; // Asegúrate de devolver la lista de establecimientos
                }));

                // Aplana el array de arrays en un solo array
                establecimientos = estab.flat();
                if (!tipoCargas || !tipoprestaciones || !establecimientos) return;
                setListTipoCargas(tipoCargas?.tipo_cargas);
                setListTipoPrestaciones(tipoprestaciones?.tipo_prestaciones);
                setListEstablecimientos(establecimientos);
                setEstablecimientosList(establecimientos);

                return;
            }
            if (session.roles.Authorizations.some(auth => auth.RolID === 4 || auth.RolID === 5)) {
                if (session.roles.ServiciosSalud) {
                    let establecimientos;
                    const tipoCargas = await getTipoCargas();
                    const tipoprestaciones = await getAllTipoPrestaciones();
                    const listIdServicios = session.roles.ServiciosSalud;
                    const estab = await Promise.all(listIdServicios.map(async (id) => {
                        const establecimiento = await getEstablecimientoBySs(id);
                        return establecimiento.establecimientos; // Asegúrate de devolver la lista de establecimientos
                    }));

                    // Aplana el array de arrays en un solo array
                    establecimientos = estab.flat();
                    if (!tipoCargas || !tipoprestaciones || !establecimientos) return;
                    setListTipoCargas(tipoCargas?.tipo_cargas);
                    setListTipoPrestaciones(tipoprestaciones?.tipo_prestaciones);
                    setListEstablecimientos(establecimientos);
                    setEstablecimientosList(establecimientos);

                    return;
                }else if(session.roles.Establecimientos){
                    let establecimientos;
                    const tipoCargas = await getTipoCargas();
                    const tipoprestaciones = await getAllTipoPrestaciones();
                    const listIdEstablecimientos = session.roles.Establecimientos;
                    const estab = await Promise.all(listIdEstablecimientos.map(async (id) => {
                        const establecimiento = await getEstablecimientoById(id);
                        console.log(establecimiento);
                        return establecimiento; // Asegúrate de devolver la lista de establecimientos
                    }));
                    console.log(estab);
                    // Aplana el array de arrays en un solo array
                    establecimientos = estab.flat();
                    console.log(establecimientos);
                    if (!tipoCargas || !tipoprestaciones || !establecimientos) return;
                    setListTipoCargas(tipoCargas?.tipo_cargas);
                    setListTipoPrestaciones(tipoprestaciones?.tipo_prestaciones);
                    setListEstablecimientos(establecimientos);
                    setEstablecimientosList(establecimientos);

                    return;
                }

            }


        };
        cargaTipoCargas();
    }, []);


    const loadMore = () => {
        if (listadoTable.length < totalRecords) {
            if (filtros) {
                setPageFilter(prevPage => prevPage + 1);  // Incrementar la página para obtener más datos
            } else {
                setPage(prevPage => prevPage + 1);  // Incrementar la página para obtener más datos
            }
        }
    };

    const clearFilter = () => {
        initFilters();
    };

    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            TIPO_ARCHIVO: { value: null, matchMode: FilterMatchMode.IN },
            TIPO_PREST: { value: null, matchMode: FilterMatchMode.IN },
            ESTAB_ORIG: { value: null, matchMode: FilterMatchMode.IN },
            ESTAB_DEST: { value: null, matchMode: FilterMatchMode.IN }
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
    const columnMappings = [{ field: 'index', header: 'Correlativo' }, { field: 'SIGTE_ID', header: 'Sigte ID' }, { field: 'ID_LOCAL', header: 'ID local' }, { field: 'TIPO_ARCHIVO', header: 'Tipo caso' }, { field: 'TIPO_PREST', header: 'Tipo prestacion' }, {
        field: 'F_ENTRADA',
        header: 'Fecha de Ingreso'
    }, { field: 'F_SALIDA', header: 'Fecha de Salida' }, { field: 'diasEspera', header: 'Tiempo de espera (días)' }, { field: 'PRESTA_MIN', header: 'PRESTAMIN' }, { field: 'NOMBRES', header: 'Nombre Paciente' }, { field: 'ESTAB_ORIG', header: 'Establecimiento de Origen' }, {
        field: 'ESTAB_DEST',
        header: 'Establecimiento de Destino'
    }];
    const limpiarCarga = () => {
        if (page > 1) {
            setListadoTable([]);
            setPage(1);
        } else if (pageFilter > 1) {
            setListadoTable([]);
            setFiltros(null);
            setPageFilter(1);
            setRefresh(!refresh);
        }
    };
    const ExportarExcel = () => {
        /* const exportData = listadoTable.map(row => {
             let newRow = {};

             const establecimiento = listEstablecimientos.find(
                 (establecimiento) => establecimiento.id === parseInt(row.ESTAB_ORIG)
             ) || { name: '' }; // Si no lo encuentra, devuelvo un objeto vacío con un campo `name`
             const establecimientoDest = listEstablecimientos.find(
                 (establecimiento) => establecimiento.id === parseInt(row.ESTAB_DEST)
             ) || { name: '' };

             const tipoCarga = listTipoCargas.find(
                 (tipoCarga) => tipoCarga.id === row.TIPO_ARCHIVO
             ) || { name: '' };

             const tipoPrestacion = listTipoPrestaciones.find(
                 (tipoPrestacion) => tipoPrestacion.id === parseInt(row.TIPO_PREST)
             ) || { name: '' };

             const nombreCompletoPaciente = `${row.NOMBRES} ${row.PRIMER_APELLIDO} ${row.SEGUNDO_APELLIDO ? row.SEGUNDO_APELLIDO : ''}`.trim();

             // Ahora aplicamos el columnMapping y las transformaciones
             columnMappings.forEach(col => {
                 switch (col.field) {
                     case 'ESTAB_ORIG':
                         newRow[col.header] = establecimiento.nombre;
                         break;
                     case 'ESTAB_DEST':
                         newRow[col.header] = establecimientoDest.nombre;
                         break;
                     case 'TIPO_ARCHIVO':
                         newRow[col.header] = tipoCarga.nombre;
                         break;
                     case 'TIPO_PREST':
                         newRow[col.header] = tipoPrestacion.nombre;
                         break;
                     case 'NOMBRES':
                         newRow[col.header] = nombreCompletoPaciente;
                         break;
                     default:
                         newRow[col.header] = row[col.field]; // El resto de campos no necesitan transformación
                         break;
                 }
             });

             return newRow;
         });
         console.log(exportData);*/

        const exportData = listadoTable.map(row => {
            // Eliminar las columnas no deseadas del objeto
            const { index, _id, TIPO_ARCHIVO, ARCHIVO_ID, ...filteredRow } = row;

            // Retornar el nuevo objeto sin las propiedades eliminadas
            return filteredRow;
        });

        console.log(exportData);
        exportToExcel(exportData, 'listado_casos');
    };

    const startToolbarContent = () => {
        return (<React.Fragment>
            <Button label="Recargar" icon="pi pi-refresh" disabled={page === 1 && pageFilter === 1} className="p-button-help mr-1" onClick={() => {
                limpiarCarga();
            }} loading={loading} />
            <Button label="Exportar" icon="pi pi-file-excel" className="p-button-success" onClick={() => ExportarExcel()} loading={loading} disabled={listadoTable.length === 0} />
            <Button icon="pi pi-plus" tooltip={'Carga mas registros'} className="p-button-info ml-2" onClick={loadMore} loading={loading} />
        </React.Fragment>);
    };

    const endToolbarContent = () => {
        return (<React.Fragment>
                <span className="p-input-icon-left">
                    <i className="pi pi-search" />
                    <InputText value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Búsqueda global" />
                </span>
        </React.Fragment>);
    };

    const renderHeader = () => {
        return (<Toolbar className="p-mb-4" start={startToolbarContent} end={endToolbarContent} />);
    };
    const pacienteBody = (rowData) => {
        return (<div>
            <span>{rowData.NOMBRES + ' ' + rowData.PRIMER_APELLIDO + ' ' + (rowData.SEGUNDO_APELLIDO ? rowData.SEGUNDO_APELLIDO : '')}</span>
        </div>);
    };

    const tipoCargasBody = (rowData) => {
        const tipoCarga = listTipoCargas.find((tipoCarga) => tipoCarga.id === rowData.TIPO_ARCHIVO) || '';
        return (<div>
            <Tooltip target={`.tipo-carga-${rowData._id}`} position="top" content={'Código Tipo Caso: ' + tipoCarga.id} />
            <span className={`tipo-carga-${rowData._id}`}>{tipoCarga.nombre}</span>
        </div>);
    };

    const tipoPrestacionBody = (rowData) => {
        //console.log("Tipo Prestacion", rowData.TIPO_PREST);
        const tipoPrestacion = listTipoPrestaciones.find((tipoPrestacion) => tipoPrestacion.id === parseInt(rowData.TIPO_PREST)) || '';
        //console.log("Tipo Prestacion", tipoPrestacion);
        return (<div>
            <Tooltip target={`.tipo-prest-${rowData._id}`} position="top" content={'Código Tipo Prestación: ' + tipoPrestacion.id} />
            <span className={`tipo-prest-${rowData._id}`}>{tipoPrestacion.nombre}</span>
        </div>);
    };

    const casosTotalesTemplate = () => {
        return (<div>
            <span><strong>Casos Totales: {totalRecords}</strong></span>
        </div>);
    };

    const estabOrigenBody = (rowData) => {
        const establecimiento = listEstablecimientos.find((establecimiento) => establecimiento.id === parseInt(rowData.ESTAB_ORIG)) || '';
        return (<div>
            <Tooltip target={`.estab-orig-${rowData._id}`} position="top" content={'Código Establecimiento: ' + establecimiento.id} />
            <span className={`estab-orig-${rowData._id}`}>{establecimiento.nombre} - {establecimiento.id}</span>
        </div>);
    };

    const estabDestinoBody = (rowData) => {
        const establecimiento = listEstablecimientos.find((establecimiento) => establecimiento.id === parseInt(rowData.ESTAB_DEST)) || '';
        return (<div>
            <Tooltip target={`.estab-dest-${rowData._id}`} position="top" content={'Código Establecimiento: ' + establecimiento.id} />
            <span className={`estab-dest-${rowData._id}`}>{establecimiento.nombre} - {establecimiento.id}</span>
        </div>);
    };

    const listTipoCargaRowFilterTemplate = (options) => {
        return (<MultiSelect
            value={options.value}
            options={listTipoCargas}
            filter
            itemTemplate={(item) => <span>{item.nombre}</span>}
            onChange={(e) => {
                options.filterApplyCallback(e.value);
            }}
            display={'chip'}
            optionLabel="nombre"
            optionValue="id"
            placeholder="Seleccione"
            className="w-full md:w-20rem"
            maxSelectedLabels={2}
            style={{ minWidth: '14rem' }}
        />);
    };
    const listTipoPrestRowFilterTemplate = (options) => {
        console.log('options', options);
        return (<MultiSelect
            value={options.value}
            options={listTipoPrestaciones}
            filter
            itemTemplate={(item) => <span>{item.nombre}</span>}
            onChange={(e) => {
                options.filterApplyCallback(e.value);
            }}
            display={'chip'}
            optionLabel="nombre"
            optionValue="id"
            placeholder="Seleccione"
            className="w-full md:w-20rem"
            maxSelectedLabels={2}
            style={{ minWidth: '14rem' }}
        />);
    };
    const listEstablecimientosRowFilterTemplate = (options) => {
        return (<MultiSelect
            value={options.value}
            options={listEstablecimientos}
            virtualScrollerOptions={{ itemSize: 26 }}
            filter
            itemTemplate={(item) => <span>{item.nombre}</span>}
            onChange={(e) => {
                options.filterApplyCallback(e.value);
            }}
            display={'chip'}
            optionLabel="nombre"
            optionValue="id"
            placeholder="Seleccione"
            className="w-full md:w-20rem"
            maxSelectedLabels={2}
            style={{ minWidth: '14rem' }}
        />);
    };

    const header = renderHeader();
    return (<>
        <DataTable value={listadoTable} size="small" tableStyle={{ minWidth: '50rem' }} filters={filters}
                   globalFilterFields={globalFilterList} showGridlines
                   header={header} emptyMessage="Ningún dato disponible en esta tabla."
                   resizableColumns columnResizeMode="expand"
                   paginator rows={10} rowsPerPageOptions={[10, 20, 50]}
                   loading={loading}
                   dataKey={'_id'} filterDisplay={'row'}
                   pageLinkSize={10}
                   paginatorLeft={casosTotalesTemplate}
                   currentPageReportTemplate={'Mostrando {first} a {last} de {totalRecords} registros'}
                   paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
        >
            <Column field="index" header="Correlativo"></Column>
            <Column field="SIGTE_ID" header="Sigte ID"></Column>
            <Column field="ID_LOCAL" header="ID local"></Column>
            <Column field="TIPO_ARCHIVO" header="Tipo caso" body={tipoCargasBody}
                    filterField="TIPO_ARCHIVO" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }}
                    filter style={{ minWidth: '14rem' }} filterElement={listTipoCargaRowFilterTemplate}
            ></Column>
            <Column field="TIPO_PREST" header="Tipo prestacion" body={tipoPrestacionBody}
                    filterField="TIPO_PREST" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }}
                    filter style={{ minWidth: '14rem' }} filterElement={listTipoPrestRowFilterTemplate}
            ></Column>
            <Column field="F_ENTRADA" header="Fecha de Ingreso"></Column>
            <Column field="F_SALIDA" header="Fecha de Salida"></Column>
            <Column field="diasEspera" header="Tiempo de espera (días)"></Column>
            <Column field="PRESTA_MIN" header="PRESTAMIN"></Column>
            <Column field="NOMBRES" header="Nombre Paciente" body={pacienteBody}></Column>
            <Column field="ESTAB_ORIG" header="Establecimiento de Origen" body={estabOrigenBody}
                    filterField="ESTAB_ORIG" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }}
                    filter style={{ minWidth: '14rem' }} filterElement={listEstablecimientosRowFilterTemplate}
            ></Column>
            <Column field="ESTAB_DEST" header="Establecimiento de Destino" body={estabDestinoBody}
                    filterField="ESTAB_DEST" showFilterMenu={false} filterMenuStyle={{ width: '14rem' }}
                    filter style={{ minWidth: '14rem' }} filterElement={listEstablecimientosRowFilterTemplate}
            ></Column>
        </DataTable>

    </>);
}

export default ListadoFiltros;
