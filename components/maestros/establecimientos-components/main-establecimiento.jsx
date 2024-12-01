import React from 'react';
import {Card} from "primereact/card";
import TablaEstablecimiento
    from "@/components/maestros/establecimientos-components/tabla-establecimientos/tabla-establecimiento";

const MainEstablecimiento = () => {
    return (
        <>
            <Card   title="Establecimientos">
                <TablaEstablecimiento/>
            </Card>
        </>
    );
};

export default MainEstablecimiento;
