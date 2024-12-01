import React from 'react';
import { Card } from 'primereact/card';
import getConfig from 'next/config';

function NoticiasComponent() {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    return (
        <>
            <h1>Noticias SIGTE</h1>
            <div className="flex ">
                <Card className="surface-card p-4 shadow-2 border-round w-full lg:w-12 ">
                    <div style={{ textAlign: 'center', padding: '2rem' }}>
                        <img src={`${contextPath}/img/fondoTest.png`} alt="Imagen de Muestra" style={{ maxWidth: '100%', maxHeight: '100%' }} />
                    </div>
                </Card>
            </div>
        </>
    );
}

export default NoticiasComponent;
