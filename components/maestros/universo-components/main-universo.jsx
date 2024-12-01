import React from 'react';
import {Card} from "primereact/card";
import {Button} from "primereact/button";
import {Divider} from "primereact/divider";
import BuscadorUniverso from "@/components/maestros/universo-components/buscador-universo/buscador-universo";

const MainUniverso = () => {
    return (
        <>
            <Card title="Universo">
                <Button icon="pi pi-plus" label="Crear" severity="success" />
                <Divider/>
                <BuscadorUniverso/>
            </Card>
        </>
    );
};

export default MainUniverso;
