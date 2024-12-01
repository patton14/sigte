import React from 'react';
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import BuscadorAlertas from "@/components/maestros/alerta-components/buscador-alerta/buscador-alertas";
import TablaAlertas from "@/components/maestros/alerta-components/tabla-alerta/tabla-alertas";

const MainAlertas = () => {
    return (
        <>
            <Card title="Alerta">
                <Button icon="pi pi-plus" label="Crear" severity="success" />
                <Divider/>
                <BuscadorAlertas/>
                <TablaAlertas/>
            </Card>
        </>
    );
};

export default MainAlertas;
