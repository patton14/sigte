import React, {useRef, useState} from 'react';
import AppConfig from "../../layout/AppConfig";
import {Card} from "primereact/card";
import getConfig from "next/config";
import {Controller, useForm} from "react-hook-form";
import {InputText} from "primereact/inputtext";
import {classNames} from "primereact/utils";
import {Button} from "primereact/button";
import {resetPass} from "@/service/sigte-services/usuarios/usuarios-service";
import {Messages} from 'primereact/messages';
import ReCAPTCHA from "react-google-recaptcha"
import {useRouter} from "next/router";

const ResetPassIndex = ({captcha_key}) => {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const defaultValues = {mail: ""};
    const router = useRouter();
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    const msgs = useRef(null)
    const [showMessage, setShowMessage] = useState(false);
    const recaptchaRef = useRef(null)
    const {
        control,
        formState: {errors},
        handleSubmit,
        reset,
        getValues
    } = useForm({defaultValues});

    const resetPassSubmit = async (data) => {
        console.log(data.mail)
        const body = {
            mail: data.mail,
            captcha: data.captcha
        }
        const result = await resetPass(body);
        if (result !== 400) {
            setShowMessage(true)
            msgs.current.show([
                {sticky: true, severity: 'info', summary: '', detail: result?.message, closable: true}
            ])
            return setTimeout(() => {
                router.push('/auth/signin')
            }, 3000)

        }
        setShowMessage(true)
        return msgs.current.show([
            {sticky: true, severity: 'warn', summary: '', detail: "Intente denuevo mas tarde", closable: true}
        ])
    }
    const getFormErrorMessage = (name) => {
        return (
            errors[name] && <small className="p-error">{errors[name].message}</small>
        );
    };
    return (
        <>
            <div className='flex justify-content-center flex-wrap'>
                <div className='flex align-items-center justify-content-center border-round-xl'
                     style={{height: '41vw', width: '41vw'}}>
                    <Card>
                        <div className="text-center mb-5">
                            <img src={`${contextPath}/img/logo-minsal.png`} alt="hyper" height={50} className="mb-3"/>
                            <div className="text-900 text-3xl font-medium mb-3">¿Olvidó su contraseña?</div>
                            <span
                                className="text-600 font-medium line-height-3">¿Conoce el correo de su cuenta?</span>
                        </div>
                        <div className='z-9' id='a'></div>
                        {/*Soy importante uwu*/}
                        <div className='col-12'>
                            <form onSubmit={handleSubmit(resetPassSubmit)} className='p-fluid formgrid grid'>
                                <div className="field col-12 md:col-12">
                                    <Controller
                                        name="mail"
                                        control={control}
                                        rules={{
                                            required: "Debe ingresar un correo electrónico",
                                            pattern: {
                                                value: emailPattern,
                                                message: 'Ingresa un correo electrónico válido'
                                            }
                                        }}
                                        render={({field, fieldState}) => (
                                            <>
                                        <span className="p-inputgroup">
                                            <InputText id={field.name} value={field.value} placeholder="E-mail"
                                                       autoComplete={'off'}
                                                       className={'p-inputtext-sm' + classNames({'p-invalid': fieldState.error})}
                                                       onChange={(e) => field.onChange(e.target.value)}/>
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
                                    <div className="flex justify-content-center flex-wrap">
                                        <Controller
                                            name="captcha"
                                            control={control}
                                            rules={{
                                                required: 'Se requiere completar el captcha'
                                            }}
                                            render={({field, fieldState}) => (
                                                <>

                                                    <ReCAPTCHA
                                                        ref={recaptchaRef}
                                                        sitekey={captcha_key}
                                                        onChange={(value) => field.onChange(value)}
                                                    />

                                                </>
                                            )}
                                        />
                                        {errors.captcha && <small className="p-error">{errors.captcha.message}</small>}
                                    </div>
                                </div>
                                <div className="field col-12 md:col-12">
                                    <Button type='submit' label='Enviar'></Button>
                                </div>
                                <div className="field col-12 md:col-12">
                                    <Messages ref={msgs} onClick={() => setShowMessage(false)}/>
                                </div>
                            </form>
                        </div>
                    </Card>
                </div>
            </div>
        </>
    );
};

export const getServerSideProps = async (context) => {
    const captcha_key = process.env.RECAPTCHA_SITE_KEY;
    return {
        props: {
            captcha_key
        }
    }
}
export default ResetPassIndex;
ResetPassIndex.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig/>
        </React.Fragment>
    );
};
