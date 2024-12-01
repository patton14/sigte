import React, {useEffect, useState} from 'react';
import {Controller, useForm} from "react-hook-form";
import {Toast} from "primereact/toast";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Button} from "primereact/button";
import {useSession} from "next-auth/react";
import {SelectButton} from "primereact/selectbutton";
import {updateUser} from "@/service/sigte-services/usuarios/usuarios-service";

const EditarUsuario = (props) => {
    const {data:session} = useSession();
    const options = ['Si', 'No'];
    const [loading, setLoading] = useState(false);
    const defaultValues = {
        rut: '',
        nombre: '',
        mail: '',
        pass: '',
        pass2: ''
    };
    const toast = React.useRef(null);
    useEffect(() => {
        let usrData = props.data;
        if(usrData){
            if(usrData?.state === 1){
                usrData.estado = 'Si';
            }else{
                usrData.estado = 'No';
            }
            reset({
                rut: usrData.rut,
                nombre: usrData.nombre,
                mail: usrData.mail,
                estado: usrData.estado
            })
        }
        return () => {

        };
    }, [props.data]);

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        getValues
    } = useForm({ defaultValues });
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const formatRUT = (rut) => {
        if(!rut) {
            return '';
        }
        const actual = rut.replace(/^0+/, "");
        let rutPuntos = "";
        if (actual !== '' && actual.length > 1) {
            const sinPuntos = actual.replace(/\./g, "");
            const actualLimpio = sinPuntos.replace(/-/g, "");
            let inicio = actualLimpio.substring(0, actualLimpio.length - 1);
            let i = 0;
            let j = 1;
            for (i = inicio.length - 1; i >= 0; i--) {
                let letra = inicio.charAt(i);
                rutPuntos = letra + rutPuntos;
                if (j % 3 === 0 && j <= inicio.length - 1) {
                    rutPuntos = "." + rutPuntos;
                }
                j++;
            }
            const dv = actualLimpio.substring(actualLimpio.length - 1);
            rutPuntos = rutPuntos + "-" + dv;
        } else {
            rutPuntos = actual;
        }
        return rutPuntos;
    };
    const validateRUT = (rut) => {
        // Elimina puntos y convierte a mayúsculas
        const rutLimpio = rut.replace(/\./g, '').toUpperCase();

        // Valida el formato del RUT (sin puntos)
        if (!/^[0-9]+-[0-9K]{1}$/.test(rutLimpio)) {
            return 'Formato de RUT inválido';
        }

        const [cuerpo, dv] = rutLimpio.split('-');
        let suma = 0;
        let multiplo = 2;

        // Recorre el cuerpo de derecha a izquierda
        for (let i = cuerpo.length - 1; i >= 0; i--) {
            suma += multiplo * parseInt(cuerpo.charAt(i), 10);
            multiplo = multiplo < 7 ? multiplo + 1 : 2;
        }

        // Calcula el dígito verificador
        const dvr = String(11 - (suma % 11));
        if (dvr === '11') return dv === '0';
        if (dvr === '10') return dv === 'K';
        if(!(dvr === dv)) {
            return 'RUT inválido';
        }
        return dvr === dv;
    };


    const validatePassword = (value) => {
        return value === getValues('pass') || 'Las contraseñas no coinciden';
    };
    const submitBusqueda = async(data) => {
        setLoading(true)
        const userId = props.data.id;
        console.log(data)
        const body = {
            "rut": data.rut.replace(/\./g, ""),
            "nombre": data.nombre,
            "mail": data.mail,
            "username": data.mail,
            "state": data.estado === 'Si' ? 1 : 0
        }
        const result = await updateUser(body, userId);
        if (result){
            toast.current.show({severity: 'success', summary: 'Usuario actualizado', detail: 'El usuario se ha actualizado correctamente'});
            reset({
                rut: result.rut,
                nombre: result.nombre,
                mail: result.mail,
                estado: result.state === 1 ? 'Si' : 'No'});
            setLoading(false)
            props.setRefresh(!props.refresh)
            return;
        }
        toast.current.show({severity: 'error', summary: 'Error', detail: 'Ha ocurrido un error al actualizar el usuario'});
        setLoading(false)
        return;
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> : <small className="p-error">&nbsp;</small>;
    };
    return (
        <>
            <form className="flex align-items-center justify-content-center" onSubmit={handleSubmit(submitBusqueda)}>
                <Toast ref={toast} />
                <div className="">
                    <div className="text-center mb-5">
                        <div className="text-900 text-3xl font-medium mb-3">Edición</div>
                        <span className="text-600 font-medium line-height-3">Edita los datos del usuario</span>
                    </div>
                    <div className="p-fluid formgrid grid">
                        <div className="field col-12 md:col-12">
                            <Controller
                                name="rut"
                                control={control}
                                rules={{ required: "Debe ingresar un RUT", validate: validateRUT}}
                                render={({ field, fieldState }) => (
                                    <>
                                        <span className="p-inputgroup">
                                            <InputText id={field.name}  value={formatRUT(field.value)} placeholder="RUT"
                                                       className={'p-inputtext-sm' + classNames({ 'p-invalid': fieldState.error })}
                                                       onChange={(e) => {
                                                           const formatted = formatRUT(e.target.value);
                                                           field.onChange(formatted);
                                                       }} />
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-id-card"></i>
                                            </span>
                                        </span>

                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-12">
                            <Controller
                                name="nombre"
                                control={control}
                                rules={{ required: "Debe ingresar un nombre" }}
                                render={({ field, fieldState }) => (
                                    <>
                                            <span className="p-inputgroup">
                                                <InputText id={field.name} value={field.value} placeholder="Nombre Completo" className={'p-inputtext-sm' + classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                                <span className="p-inputgroup-addon">
                                                    <i className="pi pi-user"></i>
                                                </span>
                                            </span>

                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-12">
                            <Controller
                                name="mail"
                                control={control}
                                rules={{ required: "Debe ingresar un correo electrónico",
                                    pattern: {
                                        value: emailPattern,
                                        message: 'Ingresa un correo electrónico válido'
                                    }
                                }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <span className="p-inputgroup">
                                            <InputText id={field.name} value={field.value} placeholder="E-mail" className={'p-inputtext-sm' + classNames({ 'p-invalid': fieldState.error })} onChange={(e) => field.onChange(e.target.value)} />
                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-envelope"></i>
                                            </span>
                                        </span>

                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-3">
                            <Controller
                                name="estado"
                                control={control}
                                rules={{ required: 'Seleccione un estado.' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor={field.name} className={classNames('flex justify-content-center', { 'p-error': errors.value })}>
                                            Activo?
                                        </label>
                                        <SelectButton id={field.name} options={options} {...field} className={classNames('flex justify-content-center', { 'p-invalid': fieldState.error })} />
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )}
                            />
                        </div>
                        <div className="field col-12 md:col-12">
                            <Button type="submit" label="Actualizar" className="p-button-info" loading={loading} />
                        </div>
                    </div>
                </div>
            </form>
        </>
    );
};

export default EditarUsuario;
