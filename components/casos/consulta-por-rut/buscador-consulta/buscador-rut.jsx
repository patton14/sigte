import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import React, { useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { classNames } from 'primereact/utils';
import { RadioButton } from 'primereact/radiobutton';
function BuscadorRut() {
    const defaultValues = {};
    const [runSigteId, setRunSigteId] = useState('');

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
                    <div className="field col-3 md:col6">
                        <Controller
                            name="run"
                            control={control}
                            rules={{required: "El RUN es requerido"}}
                            render={({ field, fieldState }) => (
                                <>
                                    <span className="p-inputgroup">
                                        <span className="p-inputgroup-addon">
                                            <i className="pi pi-id-card"></i>
                                        </span>
                                        <InputText id={field.name} value={field.value} placeholder="RUN" className={'p-inputtext-sm' + classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
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
}

export default BuscadorRut;
