import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';
import { Calendar } from 'primereact/calendar';
import { addLocale, locale } from 'primereact/api';
import { Dialog } from 'primereact/dialog';
import DialogCargaNueva from '../seccion-dialog-carga-nueva/dialog-carga-nueva';
import { useSession } from 'next-auth/react';
import { getEstablecimientoById } from '@/service/sigte-services/establecimiento/establecimiento-service';


//#region  fecha español
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

const CargaMasivaBuscar = (props) => {
    const { data: session, status } = useSession();
    const [showDialogCargaMasiva, setShowDialogCargaMasiva] = useState(false);
    const [selectedServicioSalud, setSelectedServicioSalud] = useState('');
    const [selectedTipoCarga, setSelectedTipoCarga] = useState('');
    const [selectedEstadoCarga, setSelectedEstadoCarga] = useState('');
    const [selectedFechaRango, setSelectedFechaRango] = useState(null);
    const defaultValues = {};
    const [ServiciosDeSalud, setServiciosDeSalud] = useState([]);
    const [TipoCargas, setTipoCargas] = useState([]);
    const [EstadoCargas, setEstadoCargas] = useState([]);


    // En CargaMasivaBuscar
    useEffect(() => {
        if (props.onFilterChange) {
            props.onFilterChange({
                servicioSalud: selectedServicioSalud,
                tipoCarga: selectedTipoCarga,
                estadoCarga: selectedEstadoCarga,
                fechaRango: selectedFechaRango
            });
        }
    }, [selectedServicioSalud, selectedTipoCarga, selectedEstadoCarga, selectedFechaRango]);

    useEffect(() => {
        const dataLoad = async () => {
            let listIdServicios;
            if (!session.roles.Authorizations.some(auth => auth.RolID === 1)) {
                if (session.roles.Authorizations.some(auth => auth.RolID === 2)) {
                    listIdServicios = session.roles.ServiciosSalud;
                } else if (session.roles.Authorizations.some(auth => auth.RolID === 3)) {
                    const listIdEstablecimientos = session.roles.Establecimientos;
                    listIdServicios = await Promise.all(listIdEstablecimientos.map(async (id) => {
                        const result = await getEstablecimientoById(id);
                        return result?.ss_codigo;
                    })) || [];
                }
            }

            // filtrar props.servicioSalud por los servicios de salud que tiene el usuario
            if (!listIdServicios) {
                setServiciosDeSalud(props.servicioSalud);
            } else {
                const servicioSalud = props.servicioSalud.filter(servicio => listIdServicios.includes(servicio.id));
                setServiciosDeSalud(servicioSalud);
            }
            setTipoCargas(props.tipos);
            setEstadoCargas(props.estadoCargas);
        };
        dataLoad();
    }, [props.tipos, props.estadoCargas, props.servicioSalud]);

    const serviceTemplate = (option) => {
        return (
            <div className="p-d-flex p-ai-center">
                <div className="p-mr-2">
                    <div>{option.nombre}</div>
                    <div className="p-text-light">código: {option.id}</div>
                </div>
            </div>
        );
    };
    return (<>
        <Card>
            <div className="flex flex-row flex-wrap">
                <div
                    className="text-xl flex align-items-center justify-content-center  font-bold border-round m-2">Cargas
                    Masivas
                </div>
                <div
                    className="flex align-items-center justify-content-center w-15rem h-4rem  font-bold border-round m-2">
                    <Button icon="pi pi-plus" label="Nueva carga" severity="success"
                            onClick={() => {
                                setShowDialogCargaMasiva(true);
                            }} />
                </div>
                <div className="flex align-items-center justify-content-center w-15rem h-4rem  font-bold border-round m-2">
                    <Button type="button" icon="pi pi-filter-slash" label="Limpiar Filtro" outlined
                            onClick={() => {
                                props.clearFilter();
                                setSelectedServicioSalud('');
                                setSelectedTipoCarga('');
                                setSelectedEstadoCarga('');
                                setSelectedFechaRango(null);
                            }} />
                </div>
            </div>

            <div className="p-fluid formgrid grid">
                <div className="field col-12 md:col-6">
                    <Dropdown
                        optionLabel="nombre"
                        placeholder="Servicio salud"
                        itemTemplate={serviceTemplate}
                        filter
                        filterBy={'id,nombre'}
                        value={selectedServicioSalud}
                        onChange={(e) => setSelectedServicioSalud(e.value)}
                        options={ServiciosDeSalud}
                        className={'p-inputtext-sm'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <Dropdown
                        optionLabel="nombre"
                        placeholder="Filtrar por tipo de carga"
                        value={selectedTipoCarga}
                        onChange={(e) => setSelectedTipoCarga(e.value)}
                        options={TipoCargas}
                        className={'p-inputtext-sm'}
                    />
                </div>
                <div className="field col-12 md:col-6">
                    <Dropdown
                        optionLabel="nombre"
                        placeholder="Filtrar por estado de carga"
                        value={selectedEstadoCarga}
                        onChange={(e) => setSelectedEstadoCarga(e.value)}
                        options={EstadoCargas}
                        className={'p-inputtext-sm'}
                    />

                </div>
                <div className="field col-12 md:col-6">

                    <>
                        <Calendar showIcon selectionMode="range" placeholder="Rango Fechas"
                                  value={selectedFechaRango}
                                  showButtonBar
                                  onChange={(e) => setSelectedFechaRango(e.value)}
                                  dateFormat="dd/mm/yy"
                                  className={'p-inputtext-sm'} />

                    </>
                </div>
                <div className="field col-12 md:col-6">

                </div>
                <div className="field col-12 md:col-6">
                    <>
                                        <span className="p-input-icon-left">
                                            <i className="pi pi-search" />
                                            <InputText placeholder="Búsqueda" className={'p-inputtext-sm'} value={props.globalFilterValue} onChange={props.onGlobalFilterChange} />
                                        </span>
                    </>
                </div>

            </div>
        </Card>

        <Dialog header="Carga Nueva" blockScroll position="top" visible={showDialogCargaMasiva}
                onHide={() => setShowDialogCargaMasiva(false)}
                style={{ width: '50vw' }} breakpoints={{ '960px': '75vw', '641px': '100vw' }}>
            <DialogCargaNueva limitador={props.limitador} ServiciosDeSalud={ServiciosDeSalud} TipoCargas={TipoCargas} refresh={props.refresh}
                              setRefresh={props.setRefresh} setShowDialogCargaMasiva={setShowDialogCargaMasiva} />
        </Dialog>

    </>);
};

export default CargaMasivaBuscar;
