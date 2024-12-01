import React, {useEffect} from 'react'
import { useForm, Controller, get } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { Card } from "primereact/card";
import { Button } from 'primereact/button';
import { classNames } from 'primereact/utils';
import * as crypto from "crypto-js";
import axios from 'axios';
import { getSession, signOut } from 'next-auth/react';
import Swal from 'sweetalert2';
import {Password} from "primereact/password";
import {Divider} from "primereact/divider";

const Cambioclave = ({ perfil }) => {
    const defaultValues = { rut: "", ClaveTemporal: "", ClaveNueva: "", ConfimarClaveNueva: "" };
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        getValues
    } = useForm({ defaultValues });
    const passwordPattern = /^(?=.*[A-Z])(?=.*[!@#$&*\-]).*$/;
    const passwordHeader = (<h6>Requisitos de la Contraseña:</h6>);
    const passwordFooter = (
        <div>
            <Divider/>
            <p className="p-m-0" style={{fontSize: '0.8rem'}}>La contraseña debe tener:</p>
            <ul style={{fontSize: '0.8rem'}}>
                <li>Al menos 8 caracteres</li>
                <li>Al menos una mayúscula</li>
                <li>Al menos un símbolo (!@#$&*)</li>
            </ul>
        </div>
    );
    const getFormErrorMessage = (name) => {
        return (
            errors[name] && <small className="p-error">{errors[name].message}</small>
        );
    };
    useEffect(() => {
        reset({
            mail: perfil?.user?.mail
        })
    }, []);
    const cambio = async (data) => {
        const updatedSession = await getSession();
            const hashNueva = crypto.MD5(data.pass);
            const hashAntigua = crypto.MD5(data.ClaveTemporal);
            const rutUp = data.mail;

            const datahash = {
                mail: rutUp,
                claveNueva: hashNueva.toString(crypto.enc.Hex),
                claveAntigua: hashAntigua.toString(crypto.enc.Hex)
            };
            const res = await axios.patch(`/api/controllers/sso/cambioPass/${datahash.rut}/${datahash.claveAntigua}/${datahash.claveNueva}`, {}, {
                headers: { Authorization: `Bearer ${updatedSession.jwt}` }
            })
            Swal.fire({
                icon: 'success',
                title: 'Cambio de clave exitoso',
                showConfirmButton: false,
                timer: 1000,
                target: '#a'
            }).then((result) => {
                if (result.dismiss === Swal.DismissReason.timer) {
                    signOut();
                }
            })

    }
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const validatePassword = (value) => {
        return value === getValues('pass') || 'Las contraseñas no coinciden';
    };
    return (
        <Card>
            <div className='z-9' id='a'></div>{/*Soy importante uwu*/}
            <div className='col-12'>
                <form onSubmit={handleSubmit(cambio)} className='p-fluid formgrid grid'>
                    <div className="text-center mb-5">
                        <img src={`${contextPath}/img/logo-minsal.png`} alt="hyper" height={50} className="mb-3" />
                        <div className="text-900 text-3xl font-medium mb-3">Bienvenido</div>
                        <span className="text-600 font-medium line-height-3">Crea una cuenta de usuario</span>
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
                    <div className="field col-12 md:col-12">
                        <Controller
                            name="ClaveTemporal"
                            control={control}
                            rules={{ required: "Campo Obligatorio" }}
                            render={({ field, fieldState }) => {
                                return (
                                    <>
                                        <label htmlFor={field.name}>Clave Actual*</label>
                                        <InputText
                                            id={field.name}
                                            value={field.value}
                                            className={classNames({ 'p-invalid': fieldState.error })}
                                            onChange={(e) => field.onChange(e.target.value)}
                                            type='password'>
                                        </InputText>
                                        {getFormErrorMessage(field.name)}
                                    </>
                                )
                            }}>

                        </Controller>
                    </div>
                    <div className="field col-12 md:col-12">
                        <Controller
                            name="pass"
                            control={control}
                            rules={{ required: "Debe ingresar una contraseña" }}
                            render={({ field, fieldState }) => (
                                <>
                                        <span className="p-inputgroup">
                                                <Password id={field.name} toggleMask placeholder="contraseña" {...field}  inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} feedback={false} />                                                <span className="p-inputgroup-addon">
                                                <i className="pi pi-exclamation-circle"></i>
                                            </span>
                                        </span>

                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-12">
                        <Controller
                            name="pass2"
                            control={control}
                            rules={{ validate: validatePassword }} // Añade la regla de validación aquí
                            render={({ field, fieldState }) => (
                                <>
                                        <span className="p-inputgroup">
                                                <Password id={field.name} toggleMask placeholder="repetir contraseña" {...field} inputRef={field.ref} className={classNames({ 'p-invalid': fieldState.error })} feedback={false} />                                            <span className="p-inputgroup-addon">
                                                <i className="pi pi-exclamation-circle"></i>
                                            </span>
                                        </span>

                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-12">
                        <Button type='submit' label='Confirmar'></Button>
                    </div>
                </form>
            </div>
        </Card>
    )
}

export default Cambioclave

