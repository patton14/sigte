/* eslint-disable react/display-name */
import { signOut, useSession } from 'next-auth/react';
import getConfig from 'next/config';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import { classNames } from 'primereact/utils';
import React, { forwardRef, useContext, useEffect, useImperativeHandle, useRef, useState } from 'react';
import { LayoutContext } from './context/layoutcontext';
import { Toast } from 'primereact/toast';
import { Menu } from 'primereact/menu';
import { Card } from 'primereact/card';
import { filterMenuItemsByRoles } from '@/layout/layout-function/filter-menu';
import { Button } from 'primereact/button';
import { Menubar } from 'primereact/menubar';

const AppTopbar = forwardRef((props, ref) => {
    const { data: session } = useSession();
    const { layoutConfig, layoutState, onMenuToggle, showProfileSidebar } = useContext(LayoutContext);
    const [filteredItems, setFilteredItems] = useState([]);
    const [filteredItemAdmin, setFilteredItemAdmin] = useState([]);
    const menubuttonRef = useRef(null);
    const topbarmenuRef = useRef(null);
    const topbarmenubuttonRef = useRef(null);
    const contextPath = getConfig().publicRuntimeConfig.contextPath;

    useImperativeHandle(ref, () => ({
        menubutton: menubuttonRef.current,
        topbarmenu: topbarmenuRef.current,
        topbarmenubutton: topbarmenubuttonRef.current
    }));
    const menuUsuario = useRef(null);
    const router = useRouter();
    const toast = useRef(null);

    useEffect(() => {
        if (session && session.roles && session.roles.Authorizations) {
            const items = [
                {
                    items: [
                        {
                            label: 'Bandeja',
                            icon: 'pi pi-inbox',  // Icono agregado
                            roles: [1, 2, 4, 5],
                            command: () => {
                                router.push('/casos/bandeja');
                            }
                        },
                        {
                            label: 'Carga Masiva',
                            icon: 'pi pi-upload',  // Icono agregado
                            roles: [1, 2, 3, 4],
                            command: () => {
                                router.push('/casos/cargas');
                            }
                        },
                        {
                            label: 'Historial Caso',
                            icon: 'pi pi-history',  // Icono agregado
                            roles: [1, 2, 3, 4],
                            command: () => {
                                router.push('/casos/historial');
                            }
                        }
                    ]
                }
            ];

            const itemAdmin = [
                {
                    items: [
                        {
                            label: 'Usuarios',
                            icon: 'pi pi-users',  // Icono agregado
                            roles: [1],
                            command: () => {
                                router.push('/admin/usuarios');
                            }
                        }
                    ]
                }
            ];

            setFilteredItems(filterMenuItemsByRoles(items, session.roles.Authorizations));
            setFilteredItemAdmin(filterMenuItemsByRoles(itemAdmin, session.roles.Authorizations));
        }
    }, [session]);

    const itemUsuario = [
        {
            items: [
                {
                    label: 'Cambiar contraseña',
                    icon: 'pi pi-key',  // Icono agregado
                    command: () => {
                        router.push('/admin/cambio-pass');
                    }
                }
            ]
        }
    ];
    const footer = (
        <>
            <img alt="Card" src={`${contextPath}/img/footerMinsal.png`} style={{width:'100%'}}/>
        </>
    );

    const headerSection = (
        <div
            className="relative bg-primary-100 border-round  font-bold text-gray-800"
            style={{
                backgroundImage: `url('${contextPath}/img/fondoTest2.png')`,
                backgroundSize: 'cover',
                backgroundRepeat: 'no-repeat',
                backgroundPosition: 'center',
                borderRadius: 0,
                width: '100%',
                height: '20vh',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1
            }}
        >
            <div className="flex justify-content-around flex-wrap"
                 style={{
                     backgroundImage: `url('${contextPath}/img/fondoTest2.png')`, // Reemplaza con la ruta a tu imagen
                     backgroundSize: 'cover',
                     backgroundRepeat: 'no-repeat',
                     backgroundPosition: 'center',
                     borderRadius: 0,
                     width: '100%',
                     height: '20vh', // Asegúrate de que este valor es suficiente para cubrir el área deseada
                     position: 'absolute',
                     top: 0,
                     left: 0,
                     zIndex: 1 // Esto asegura que la imagen se quede detrás de los demás elementos
                 }}
            >
                <Card
                    className="relative flex align-items-center justify-content-center font-bold"
                    onClick={() => window.location.href = 'https://www.minsal.cl/'}
                    style={{
                        backgroundImage: `url('${contextPath}/img/logo-minsal.png')`,
                        backgroundSize: 'contain',
                        backgroundRepeat: 'no-repeat',
                        backgroundPosition: 'center center',
                        backgroundColor: 'transparent',
                        width: '10vw',
                        height: '18vh',
                        borderRadius: 0
                    }}
                />
                <Card
                    className="relative flex align-items-center justify-content-center font-bold"
                    style={{
                        height: '12vh',
                        borderRadius: 0,
                        overflow: 'hidden'
                    }}
                >
                    <div className="flex justify-content-end">
                        <h3>SIGTE</h3>
                    </div>
                    <div className="flex justify-content-start">
                        <h5>Gestión de tiempos de espera</h5>
                    </div>
                    <footer className="absolute" style={{ bottom: -5, left: 0, right: 0 }}>{footer}</footer>
                </Card>
            </div>
        </div>
    );

    return (
        <>
            <div className="layout-topbar-container">
                <div className="layout-header">
                    {headerSection}
                </div>


                <Toast ref={toast}></Toast>
                <Menubar
                    model={[
                        {
                            label: 'Casos',
                            icon: 'pi pi-inbox',
                            items: filteredItems[0]?.items || []
                        },
                        ...(filteredItemAdmin.length > 0 ? [{
                            label: 'Administración',
                            icon: 'pi pi-cog',
                            items: filteredItemAdmin[0]?.items || []
                        }] : [])
                    ]}
                    start={
                        <div className="mr-2 ml-2">
                            <Link legacyBehavior href="">
                                <a className="layout-topbar-logo">
                                    <div className="flex justify-content-around align-items-center">
                                        <span className="text-xl font-italic font-bold">SIGTE</span>
                                    </div>
                                </a>
                            </Link>
                        </div>
                    }
                    end={
                        <div>
                            <Menu
                                model={[
                                    {
                                        label: session?.nombre,
                                        icon: 'pi pi-user',
                                        items: [
                                            {
                                                label: 'Cambiar contraseña',
                                                icon: 'pi pi-key',
                                                command: () => router.push('/admin/cambio-pass')
                                            },
                                            {
                                                label: 'Cerrar Sesión',
                                                icon: 'pi pi-sign-out',
                                                command: () => signOut({ baseUrl: '/login' }),
                                                className: 'p-button-text p-button-danger'
                                            }
                                        ]
                                    }
                                ]}
                                popup
                                ref={menuUsuario}
                            />
                            <Button
                                icon="pi pi-user"
                                className="p-button-text"
                                onClick={(event) => menuUsuario.current.toggle(event)}
                            />
                        </div>
                    }
                />


            </div>
        </>
    );
});

export default AppTopbar;
