import React from 'react';
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import BuscadorHomologacionEspecialidad
    from "@/components/maestros/homologacion-especialidad-components/buscador-homologacion-especialidad/buscador-homologacion-especialidad";
import TablaHomologacionEspecialidad
    from "@/components/maestros/homologacion-especialidad-components/tabla-homologacion-especialidad/tabla-homologacion-especialidad";

const MainHomologacionEspecialidad = () => {
    return (
        <>
            <Card title="Homologación Especialidad/Prestación">
                <Button icon="pi pi-plus" label="Crear" severity="success" />
                <Divider/>
                <BuscadorHomologacionEspecialidad/>
                <TablaHomologacionEspecialidad/>
            </Card>
        </>
    );
};

export default MainHomologacionEspecialidad;
