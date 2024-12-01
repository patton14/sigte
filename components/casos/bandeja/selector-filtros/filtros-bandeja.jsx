import React, { useEffect, useRef, useState } from 'react';
import { RadioButton } from 'primereact/radiobutton';
import { Dropdown } from 'primereact/dropdown';
import { getServiciosSalud } from '@/service/sigte-services/servicio-salud/servicio-salud-service';
import { InputText } from 'primereact/inputtext';
import { Calendar } from 'primereact/calendar';
import { locale, addLocale } from 'primereact/api';
import { Button } from 'primereact/button';
import { useForm, Controller } from 'react-hook-form';
import { Toast } from 'primereact/toast';
import { getComunas } from '@/service/sigte-services/comunas/comuna-service';
import { format } from '@formkit/tempo';
import { getCasosFiltrados } from '@/service/sigte-services/casos/casos-services';
import { useSession } from 'next-auth/react';
import { Tag } from 'primereact/tag';

//#region fecha español
addLocale('es', {
    firstDayOfWeek: 1,
    dayNames: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    dayNamesShort: ['dom', 'lun', 'mar', 'mié', 'jue', 'vie', 'sáb'],
    dayNamesMin: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    monthNames: ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'],
    monthNamesShort: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    today: 'Hoy',
    clear: 'Limpiar'
});
locale('es');
//#endregion

const FiltrosBandeja = ({ establecimientosList, setCasosList, setFiltros, page, limit }) => {
    const [ServiciosDeSalud, setServiciosDeSalud] = useState([]);
    const { data: session } = useSession();
    const [comunas, setComunas] = useState([]);
    const [disabledAll, setDisabledAll] = useState(false);
    const [isSigteIdActive, setIsSigteIdActive] = useState(false); // Nuevo estado para gestionar el bloqueo
    const { control, handleSubmit, reset, watch } = useForm({
        defaultValues: {
            origenDestino: 'Origen', // Valor por defecto para origen/destino
            pendienteCerrado: 'Pendientes' // Valor por defecto para pendiente/cerrado
        }
    });
    const toast = useRef(null);

    useEffect(() => {
        const loadData = async () => {
            const servSalud = await getServiciosSalud();
            if (session.roles.Authorizations.some(auth => auth.RolID === 1)) {
                setServiciosDeSalud(servSalud.servicios_salud);
                return;
            }
            if (session.roles.Authorizations.some(auth => auth.RolID === 2)) {
                const listIdServicios = session.roles.ServiciosSalud;
                servSalud.servicios_salud = servSalud.servicios_salud.filter(serv => listIdServicios.includes(serv.id));
            }
            if (session.roles.Authorizations.some(auth => auth.RolID === 4 || auth.RolID === 5)) {
                if (session.roles.ServiciosSalud) {
                    const listIdServicios = session.roles.ServiciosSalud;
                    servSalud.servicios_salud = servSalud.servicios_salud.filter(serv => listIdServicios.includes(serv.id));
                    setServiciosDeSalud(servSalud.servicios_salud);
                    return;
                } else if (session.roles.Establecimientos) {
                    console.log(establecimientosList);
                    const listIdEstablecimientos = session.roles.Establecimientos;
                    // filtrar servicios de salud segun su id contenido en establecimientosList como ss_codigo
                    const serviciosSalud = servSalud.servicios_salud.filter(serv => establecimientosList.some(est => est.ss_codigo === serv.id));
                    console.log(serviciosSalud);
                    setServiciosDeSalud(serviciosSalud);
                    return;

                }
                setServiciosDeSalud([]);
                setDisabledAll(true);
                return;
            }
            if (servSalud) {
                if (servSalud?.servicios_salud) {
                    setServiciosDeSalud(servSalud.servicios_salud);
                }
            }
        };
        loadData();
    }, [establecimientosList]);

    const sigteIdValue = watch('idSigte'); // Escuchar el valor del campo sigteId

    useEffect(() => {
        if (sigteIdValue) {
            setIsSigteIdActive(true);  // Si se escribe en sigteId, bloqueamos los demás campos
        } else {
            setIsSigteIdActive(false); // Si sigteId está vacío, desbloqueamos los campos
        }
    }, [sigteIdValue, reset]);

    const submitFiltros = async (data) => {
        console.log('Datos del formulario:', data);
        // Limpiar todos los undefined, '' y null
        Object.keys(data).forEach(key => data[key] === undefined || data[key] === '' || data[key] === null ? delete data[key] : {});
        console.log('Datos del formulario limpios:', data);
        // si data es vacío, levantar toast de avisar que no hay filtros que aplicar
        if (Object.keys(data).length === 0) {
            return toast.current.show({ severity: 'info', summary: 'Info', detail: 'No hay filtros que aplicar' });
        }
        if (data.rangoFechasIngreso) {
            data.rangoFechasIngreso = data.rangoFechasIngreso.map(fecha => format({ date: fecha, format: 'DD-MM-YYYY' }));
        }
        if (data.rangoFechasEgreso) {
            data.rangoFechasEgreso = data.rangoFechasEgreso.map(fecha => format({ date: fecha, format: 'DD-MM-YYYY' }));
        }
        const body = {
            sigte_id: data?.idSigte,
            run: data?.run,
            servicio_salud: data?.servicioSalud?.id.toString(),
            establecimiento: data?.establecimiento?.id.toString(),
            origen_destino: data?.origenDestino,
            pendiente_cerrado: data?.pendienteCerrado,
            rangoFechasIngreso: data?.rangoFechasIngreso,
            rangoFechasEgreso: data?.rangoFechasEgreso,
            session: JSON.stringify(session)
        };
        // Limpiar todos los undefined, '' y null del body
        Object.keys(body).forEach(key => body[key] === undefined || body[key] === '' || body[key] === null ? delete body[key] : {});
        console.log('Datos del body limpios:', body);
        setFiltros(body);
        const resultados = await getCasosFiltrados(body, page, limit);

        console.log('Resultados:', resultados);
        if (resultados.status === 201) {

            setCasosList(resultados.data);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Casos filtrados correctamente' });
        } else if (resultados.status === 404) {
            toast.current.show({ severity: 'info', summary: 'Info', detail: 'No se encontraron casos con los filtros aplicados' });
        } else {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'No se pudo obtener los casos filtrados' });
        }

    };

    const limpiarFiltros = () => {
        reset(); // Restablecer todos los campos del formulario
        setFiltros(null); // Limpiar filtros
    };

    const establecimientosItemsTemplate = (option) => {
        return (
            <div className="p-inputtext-sm">
                <span>{option.nombre} - {option.id.toString()}</span>
            </div>
        );
    };

    return (
        <form onSubmit={handleSubmit(submitFiltros)}>
            <Toast ref={toast} />
            <div className="col-12">
                <div className="p-fluid formgrid grid">
                    {/* primera fila */}
                    <div className="field col-12 md:col-3">
                        <div className="p-inputgroup flex align-items-center">
                            <div className="mr-4">
                                <Controller
                                    name="origenDestino"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <RadioButton inputId="origen" {...field} value="Origen" checked={field.value === 'Origen'} disabled={isSigteIdActive || disabledAll} />
                                            <label htmlFor="origen" className="ml-2">Origen</label>
                                        </>
                                    )}
                                />
                            </div>
                            <div className="mr-4">
                                <Controller
                                    name="origenDestino"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <RadioButton inputId="destino" {...field} value="Destino" checked={field.value === 'Destino'} disabled={isSigteIdActive || disabledAll} />
                                            <label htmlFor="destino" className="ml-2">Destino</label>
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="field col-12 md:col-3">
                        <Controller
                            name="rangoFechasIngreso"
                            control={control}
                            render={({ field }) => (
                                <Calendar {...field} dateFormat="dd/mm/yy" showIcon selectionMode="range" locale="es" readOnlyInput placeholder="Rango de fechas de ingreso" className={'p-inputtext-sm'} disabled={isSigteIdActive || disabledAll} />
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-3">
                        <Controller
                            name="servicioSalud"
                            control={control}
                            render={({ field }) => (
                                <Dropdown {...field} optionLabel="nombre" filter placeholder="Servicio salud" options={ServiciosDeSalud} className={'p-inputtext-sm'} disabled={isSigteIdActive || disabledAll} />
                            )}
                        />
                    </div>

                    <div className="field col-12 md:col-3">
                        <Controller
                            name="establecimiento"
                            control={control}
                            render={({ field }) => (
                                <Controller
                                    name="establecimiento"
                                    control={control}
                                    render={({ field }) => (
                                        <Dropdown
                                            {...field}
                                            optionLabel="nombre"
                                            filter
                                            filterBy="nombre,id"
                                            virtualScrollerOptions={{
                                                itemSize: 48,
                                                autoSize: true,          // Intenta ajustar el tamaño automáticamente
                                                scrollWidth: '100%',      // Ajusta el ancho del menú desplegable automáticamente
                                            }}
                                            placeholder="Establecimiento"
                                            itemTemplate={establecimientosItemsTemplate}
                                            options={establecimientosList}
                                            className="p-inputtext-sm"
                                            disabled={isSigteIdActive || disabledAll}
                                            appendTo="self" // Hace que el dropdown se renderice en el mismo lugar del DOM
                                            scrollHeight="300px" // Ajusta la altura máxima de scroll
                                        />
                                    )}
                                />
                            )}
                        />
                    </div>

                    {/* segunda fila */}
                    <div className="field col-12 md:col-3">
                        <div className="p-inputgroup flex align-items-center">
                            <div className="mr-4">
                                <Controller
                                    name="pendienteCerrado"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <RadioButton inputId="pendientes" {...field} value="Pendientes" checked={field.value === 'Pendientes'} disabled={isSigteIdActive || disabledAll} />
                                            <label htmlFor="pendientes" className="ml-2">Abiertos</label>
                                        </>
                                    )}
                                />
                            </div>
                            <div className="mr-4">
                                <Controller
                                    name="pendienteCerrado"
                                    control={control}
                                    render={({ field }) => (
                                        <>
                                            <RadioButton inputId="cerrados" {...field} value="Cerrados" checked={field.value === 'Cerrados'} disabled={isSigteIdActive || disabledAll} />
                                            <label htmlFor="cerrados" className="ml-2">Cerrados</label>
                                        </>
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="field col-12 md:col-3">
                        <Controller
                            name="rangoFechasEgreso"
                            control={control}
                            render={({ field }) => (
                                <Calendar {...field} dateFormat="dd/mm/yy" showIcon selectionMode="range" locale="es" readOnlyInput placeholder="Rango de fechas de egreso" className={'p-inputtext-sm'} disabled={isSigteIdActive || disabledAll} />
                            )}
                        />
                    </div>

                    <div className="field col-12 md:col-3">
                        <Controller
                            name="idSigte"
                            control={control}
                            render={({ field }) => (
                                <span className="p-float-label p-input-icon-left">
                                    <i className="pi pi-info-circle" />
                                    <InputText id="idSigte" className="p-inputtext-sm" {...field} disabled={disabledAll} />
                                    <label htmlFor="idSigte">Id Sigte</label>
                                </span>
                            )}
                        />
                    </div>

                    <div className="field col-12 md:col-3">
                        <Controller
                            name="run"
                            control={control}
                            render={({ field }) => (
                                <span className="p-float-label p-input-icon-left">
                                    <i className="pi pi-id-card" />
                                    <InputText id="run" className="p-inputtext-sm" {...field} disabled={isSigteIdActive || disabledAll} />
                                    <label htmlFor="run">RUN</label>
                                </span>
                            )}
                        />
                    </div>

                    {/* tercera fila */}
                    <div className="field col-12 md:3">

                    </div>
                    {/* cuarta fila */}
                    <div className="field col-12 md:col-3">

                    </div>

                    <div className="field col-12 md:col-3">

                    </div>

                    {/* botones */}
                    <div className="field col-12 md:col-3">
                        <Button label="Limpiar Filtro" type="reset" severity="warning" onClick={limpiarFiltros} disabled={disabledAll} />
                    </div>
                    <div className="field col-12 md:col-3">
                        <Button label="Aplicar Filtro" severity="success" type="submit" disabled={disabledAll} />
                    </div>
                </div>
            </div>
        </form>
    );
};

export default FiltrosBandeja;
