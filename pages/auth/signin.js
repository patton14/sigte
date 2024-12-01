import React, {useEffect} from 'react';
import 'primeflex/primeflex.css';
import AppConfig from '../../layout/AppConfig';
import LoginTopBar from '@/components/login/login-topbar-component';
import NoticiasComponent from '@/components/login/noticias-component';
import LoginForm from '@/components/login/login-form-component';


export async function getServerSideProps(context) {
    return {
        props: {
            recaptchaKey: process.env.RECAPTCHA_SITE_KEY
        },
    };
}
export default function HomePage({recaptchaKey}) {

    return (
        <div className="p-grid">
            <LoginTopBar />
            <div className="formgrid grid justify-content-center m-5">
                {/* Sección de noticias */}
                <div className="field col-12 md:col-6">
                    <NoticiasComponent />
                </div>
                {/* Sección de inicio de sesión */}
                <div className="field col-12 md:col-3">
                    <LoginForm recaptchaKey={recaptchaKey} />
                </div>
            </div>
        </div>
    );
}



HomePage.getLayout = function getLayout(page) {
    return (
        <React.Fragment>
            {page}
            <AppConfig />
        </React.Fragment>
    );
};
