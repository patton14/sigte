import React from 'react';
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import FiltroConfNotificacion
    from "@/components/maestros/conf-notificacion-components/filtro-busqueda-conf-notificacion/filtro-conf-notificacion";
import TablaConfNotificacion
    from "@/components/maestros/conf-notificacion-components/tabla-conf-notificacion/tabla-conf-notificaciones";

const MainConfNotificacion = () => {
    return (
        <>
            <Card title="Configuración Notificación" subTitle="Filtros y búsqueda">
                <Button icon="pi pi-plus" label="Crear" severity="success" />
                <Divider/>
                <FiltroConfNotificacion/>
                <TablaConfNotificacion/>
            </Card>
        </>
    );
};

export default MainConfNotificacion;
