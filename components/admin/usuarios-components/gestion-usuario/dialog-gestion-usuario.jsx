import React, {useEffect, useState} from 'react';
import {useSession} from "next-auth/react";
import {TabPanel, TabView} from "primereact/tabview";
import EditarUsuario from "@/components/admin/usuarios-components/gestion-usuario/editar-usuario";
import AsignarRolesUsuario from "@/components/admin/usuarios-components/gestion-usuario/asignar-roles-usuario";


const DialogGestionUsuario = (props) => {
    const {data:session} = useSession();
    const [usrData, setUsrData] = useState(null);
    useEffect(() => {
        setUsrData(props.data)
    }, [props.data]);

    return (
        <>
            <TabView>
                <TabPanel header="Editar usuario">
                    <EditarUsuario data = {usrData} setRefresh={props.setRefresh} refresh={props.refresh} />
                </TabPanel>
                <TabPanel header="Asignación de roles">
                    <AsignarRolesUsuario data = {usrData}/>
                </TabPanel>
            </TabView>

        </>
    );
};

export default DialogGestionUsuario;
