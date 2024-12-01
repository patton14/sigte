import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import {Dropdown} from "primereact/dropdown";

const FiltroConfNotificacion = () => {
    const defaultValues = {};
    const [ServiciosDeSalud, setServiciosDeSalud] = useState([]);
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({ defaultValues });
    const submitBusqueda = (data) => {
        console.log(data);
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };
    return (
        <>
            <form className="col-12" onSubmit={handleSubmit(submitBusqueda)}>
                <div className="p-fluid formgrid grid">

                    <div className="field col-12 md:col-5">
                        <Controller
                            name="buscar"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nombre"
                                        placeholder="Region"
                                        options={ServiciosDeSalud}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />

                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="field  col-12 md:col-5">
                        <Controller
                            name="buscar"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nombre"
                                        placeholder="Servicio de salud"
                                        options={ServiciosDeSalud}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />

                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-2">
                        <Button size="small" type="button" label="Borrar" severity="secondary" text raised />
                    </div>
                    <div className="field col-12 md:col-5">
                        <Controller
                            name="buscar"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="nombre"
                                        placeholder="Comuna"
                                        options={ServiciosDeSalud}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-5">
                        <Controller
                            name="buscar"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-inputgroup">
                                        <InputText id={field.name} value={field.value} placeholder="Buscar..." className={'p-inputtext' + classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                        <span className="p-inputgroup-addon">
                                             <i className="pi pi-search" />
                                        </span>
                                    </span>

                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-2">
                        <Button size="small" type="button" label="Buscar" severity="info" raised />
                    </div>
                </div>

            </form>
        </>
    );
};

export default FiltroConfNotificacion;
