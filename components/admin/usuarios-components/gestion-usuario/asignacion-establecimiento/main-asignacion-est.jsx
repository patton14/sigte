import React, { useEffect, useState } from 'react';
import AsignarEstUsuario from '@/components/admin/usuarios-components/gestion-usuario/asignacion-establecimiento/asignar_est_usuario';
import { getServiciosSalud } from '@/service/sigte-services/servicio-salud/servicio-salud-service';
import { Button } from 'primereact/button';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { getEstablecimientoBySs } from '@/service/sigte-services/establecimiento/establecimiento-service';

const MainAsignacionEst = ({ user }) => {
    const [cargaPickEst, setCargaPickEst] = useState(false);
    const [servicios, setServicios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [establecimientos, setEstablecimientos] = useState([]);
    useEffect(() => {
        const loadData = async () => {
            const servicios = await getServiciosSalud();
            console.log(servicios);
            setServicios(servicios.servicios_salud);
        };
        loadData();
    }, []);
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({});
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
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> :
            <small className="p-error">&nbsp;</small>;
    };
    const submitSs = (data) => {
        console.log(data);
        //setCargaPickEst(true);
    };

    const cargarEstablecimientos = async(data) => {
        setLoading(true);
        try{
            const est = await getEstablecimientoBySs(data.id);
            console.log(est);
            setEstablecimientos(est)
            setCargaPickEst(true);
            setLoading(false);
        }catch (e) {
            setLoading(false);

        }
    };
    return (
        <>
            <form onSubmit={handleSubmit(submitSs)} className="flex justify-content-center flex-wrap">
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-12">
                        <Controller
                            name="servicio_salud"
                            control={control}
                            rules={{ required: 'Servicio de salud es requerido' }}
                            render={({ field, fieldState }) => (<Dropdown
                                id={field.name}
                                value={field.value}
                                filter
                                filterBy={'nombre,id'}
                                placeholder="Servicio salud"
                                optionLabel="nombre"
                                options={servicios}
                                focusInputRef={field.ref}
                                itemTemplate={serviceTemplate}
                                onChange={(e) => {
                                    field.onChange(e.value);
                                    cargarEstablecimientos(e.value);

                                }}
                                className={'p-inputtext-m' + classNames({ 'p-invalid': fieldState.error })}
                            />)}
                        />
                        {getFormErrorMessage('servicio_salud')}
                    </div>
                </div>
            </form>


            {cargaPickEst && (
                <>
                    {
                        loading ? (
                            <div className="flex justify-content-center">
                                <span>
                                    <i className="pi pi-spin pi-spinner" style={{ fontSize: '5rem' }}></i>
                                </span>
                            </div>
                        ) : (
                            <div className="fadein animation-duration-1000">
                                <AsignarEstUsuario establecimientos={establecimientos} user={user} />
                            </div>
                        )
                    }
                </>

            )}
        </>
    );
};

export default MainAsignacionEst;
