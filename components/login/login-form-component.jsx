import React, {useEffect, useRef, useState} from 'react';
import {useForm, Controller} from 'react-hook-form';
import {InputText} from 'primereact/inputtext';
import {Password} from 'primereact/password';
import {Button} from 'primereact/button';
import {classNames} from 'primereact/utils';
import {Card} from 'primereact/card';
import {Divider} from 'primereact/divider';
import {signIn} from 'next-auth/react';
import {Toast} from 'primereact/toast';
import {useRouter} from 'next/router';
import {getStateUser} from "@/service/sigte-services/usuarios/usuarios-service";
import Link from "next/link";
import ReCAPTCHA from "react-google-recaptcha"

function LoginForm({recaptchaKey}) {
    const router = useRouter();
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const recaptchaRef = useRef(null)
    const {
        control,
        handleSubmit,
        formState: {errors},
        reset
    } = useForm();

    const onSubmit = async (data) => {
        recaptchaRef.current.reset()
        setLoading(true)
        // Procesa los datos de inicio de sesión con NextAuth
        const checkState = await getStateUser(data.username);
        if (checkState && checkState !== ""){
            if (checkState.state !== 1) {
                setLoading(false)
                return toast.current.show({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Usuario bloqueado o inactivo',
                    life: 3000
                });
            }
        }else{
            setLoading(false)
            return toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Usuario o Contraseña incorrectos',
                life: 3000
            });
        }
        const result = await signIn('credentials', {
            redirect: false,
            username: data.username,
            password: data.password, // Aquí, puedes aplicar MD5 si es necesario antes de enviar
            captcha: data.captcha
        });
        if (result.status === 401) {
            // Manejar errores, por ejemplo mostrar un mensaje al usuario
            const checkTrys = await getStateUser(data.username);
            setLoading(false)
            return toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: `Usuario o contraseña incorrectos ${5 - parseInt( checkTrys?.trys)} intentos restantes` ,
                life: 3000
            });

        } else {
            toast.current.show({severity: 'success', summary: 'Autenticado', detail: 'Redirigiendo', life: 3000});
            setTimeout(() => {
                setLoading(false)
                return router.push('/')
            }, 3000);

        }
    };
    return (
        <>
            <div className="text-900 text-3xl font-medium mb-4">Acceso</div>
            <Toast ref={toast}/>
            <div className="flex align-items-center justify-content-center">
                <div className="surface-card p-4 shadow-2 border-round w-full lg:w-12">
                    <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
                        <div className="p-field col-12 mb-4 mt-2">
                            <span className="p-float-label p-input-icon-left">
                                <i className="pi pi-user"/>
                                <Controller
                                    name="username"
                                    control={control}
                                    rules={{required: 'El usuario es obligatorio.'}}
                                    render={({field, fieldState}) => <InputText {...field}
                                                                                className={classNames({'p-invalid': fieldState.invalid})}/>}
                                />
                                <label className={classNames({'p-error': errors.username})}>Usuario</label>
                            </span>
                            {errors.username && <small className="p-error">{errors.username.message}</small>}
                        </div>
                        <div className="p-field col-12 mt-3">
                            <span className="p-float-label p-input-icon-left">
                                <i className="pi pi-user"/>
                                <Controller
                                    name="password"
                                    control={control}
                                    rules={{
                                        required: 'La contraseña es obligatoria.',

                                    }}
                                    render={({field, fieldState}) => <Password {...field} feedback={false} toggleMask
                                                                               className={classNames({'p-invalid': fieldState.invalid})}/>}
                                />
                                <label className={classNames({'p-error': errors.password})}>Contraseña</label>
                            </span>
                            {errors.password && <small className="p-error">{errors.password.message}</small>}
                        </div>
                        <div className="p-field col-12 mt-3">
                            <Controller
                                name="captcha"
                                control={control}
                                rules={{
                                    required: 'Se requiere completar el captcha'
                                }}
                                render={({field, fieldState}) => (
                                    <>
                                    <span className='col-9 p-0 flex flex-column align-items-center gap-1 my-3'>
                                        <ReCAPTCHA
                                            ref={recaptchaRef}
                                            sitekey={recaptchaKey}
                                            onChange={(value) => field.onChange(value)}
                                        />
                                    </span>
                                    </>
                                )}
                            />
                            {errors.captcha && <small className="p-error">{errors.captcha.message}</small>}
                        </div>


                        <Button label="Ingresar" type="submit" className="p-mb-2 mt-4" style={{width: '100%'}}
                                loading={loading}/>
                        <Link href="/missing-pass" className="p-text-center p-d-block p-mb-2 mt-2">

                            ¿Ha olvidado su contraseña?

                        </Link>

                    </form>
                    <Divider/>
                    <div className="p-text-center">
                        Sistema de Gestión de Tiempos de Espera
                    </div>
                </div>
            </div>
        </>
    );
}

export default LoginForm;
