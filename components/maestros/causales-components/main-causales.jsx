import React from 'react';
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import BuscadorCausales from "@/components/maestros/causales-components/buscador-causales/buscador-causales";
import TablaCausales from "@/components/maestros/causales-components/tabla-causales/tabla-causales";


const MainCausales = () => {
    return (
        <>
            <Card title="Causal">
               {/* <Button icon="pi pi-plus" label="Crear" severity="success" />
                <Divider/>
                <BuscadorCausales/>*/}
                <TablaCausales/>
            </Card>
        </>
    );
};

export default MainCausales;
