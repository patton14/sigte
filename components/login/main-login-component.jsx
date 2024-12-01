import React from 'react';
import 'primeflex/primeflex.css';
import AppConfig from '../../layout/AppConfig';
import getConfig from 'next/config';
import LoginTopBar from '@/components/login/login-topbar-component';
import NoticiasComponent from '@/components/login/noticias-component';
import LoginForm from '@/components/login/login-form-component';
function MainLoginComponent() {

    return (
        <>
            <div className="p-grid">
                <LoginTopBar />
                <div className="formgrid grid justify-content-center m-5">
                    {/* Sección de noticias */}
                    <div className="field col-12 md:col-6">
                        <NoticiasComponent />
                    </div>
                    {/* Sección de inicio de sesión */}
                    <div className="field col-12 md:col-3">
                        <LoginForm />
                    </div>
                </div>
            </div>
        </>
    );
}

export default MainLoginComponent;
