import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
const BuscadorUniverso = () => {
    const defaultValues = {};

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
                <div className='flex flex-row-reverse'>
                    <div className="field col-3 md:col-3">
                        <Controller
                            name="buscar"
                            control={control}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-inputgroup">
                                        <InputText id={field.name} value={field.value} placeholder="Buscar..." className={'p-inputtext-sm' + classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                        <Button icon="pi pi-search" />
                                    </span>

                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                </div>
            </form>
        </>
    );
};

export default BuscadorUniverso;
