import React from 'react'
import { Card } from 'primereact/card';
import getConfig from 'next/config';


function LoginTopBar() {
    const contextPath = getConfig().publicRuntimeConfig.contextPath;
    const footer = (
        <>
              <img alt="Card" src={`${contextPath}/img/footerMinsal.png`} style={{width:'100%'}}/>
        </>
    );
    return (
        <>
  <div
                className="relative bg-primary-100 border-round  font-bold text-gray-800"
                style={{
                    backgroundImage: `url('${contextPath}/img/fondoTest2.png')`, // Reemplaza con la ruta a tu imagen
                    backgroundSize: 'cover',
                    backgroundRepeat: 'no-repeat',
                    backgroundPosition: 'center',
                    borderRadius:0,
                    width: '100%',
                    height: '20vh', // Asegúrate de que este valor es suficiente para cubrir el área deseada
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    zIndex: 1 // Esto asegura que la imagen se quede detrás de los demás elementos
                }}
            >
                <div className="flex justify-content-around flex-wrap" >
                    <Card
                        className="relative flex align-items-center justify-content-center font-bold"
                        onClick={() => window.location.href = 'https://www.minsal.cl/'}
                        style={{
                            backgroundImage: `url('${contextPath}/img/logo-minsal.png')`, // Reemplaza con la ruta a tu imagen
                            backgroundSize: 'contain',
                            backgroundRepeat: 'no-repeat',
                            backgroundPosition: 'center center',
                            backgroundColor: 'transparent',
                            width: '10vw',
                            height: '18vh',
                            borderRadius:0
                        }}
                    >
                    </Card>
                    <Card
                        className="relative flex align-items-center justify-content-center font-bold"
                        style={{
                            height: '12vh',
                            borderRadius:0,
                            overflow: 'hidden'
                        }}

                    >
                        <div className="flex justify-content-end">
                            <h3>SIGTE</h3>
                        </div>
                        <div className="flex justify-content-start">
                            <h5>Gestión de tiempos de espera</h5>
                        </div>
                        <footer className='absolute' style={{bottom: -5, left: 0, right: 0}}>{footer}</footer>
                    </Card>
                </div>
            </div>
        </>
    )
}

export default LoginTopBar
