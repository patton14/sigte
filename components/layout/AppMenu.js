import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import AppMenuitem from './AppMenuitem';
import { MenuProvider } from './context/menucontext';

const AppMenu = () => {
    const { data: session, status } = useSession();
    const roles = session?.roles || [];
    useEffect(() => {
        return () => { };
    }, []);

    const model = [
        {
            label: 'Gestion',
            icon: 'pi pi-fw pi-sitemap',
            rol: [1000, 1005],
            items: [

                { label: 'Registro de Biopsias', icon: 'pi pi-fw pi-id-card', to: '/Biopsia' },
                { label: 'Estadisticas', icon: 'pi pi-fw pi-check-square', to: '/Estadisticas' },
                { label: "Valorización Fonasa", icon: "pi pi-fw pi-bookmark", to: "/FonasaVal" },
                { label: "Reportes", icon: "pi pi-fw pi-paperclip", to: "/Reportes" },
            ]
        },
        {
            label: 'Informes de biopsia',
            icon: 'pi pi-fw pi-sitemap',
            rol: [1000, 1003],
            items: [
                { label: "Visor", icon: "pi pi-fw pi-eye", to: "/Visor" },
            ]
        },

    ];
    //para prod
    const filteredModel = model.filter((item) => item.rol.some((r) => roles.includes(r))) || [];

    //para dev
    // const filteredModel = model
    if (status === 'authenticated') {
        return (
            <MenuProvider>
                <ul className="layout-menu flex flex-wrap p-5">
                    {filteredModel.map((item, i) => {
                        return !item.seperator ? <AppMenuitem item={item} root={true} index={i} key={item.label} /> : <li className="menu-separator"></li>;
                    })}
                </ul>
            </MenuProvider>
        );
    }
};

export default AppMenu;
