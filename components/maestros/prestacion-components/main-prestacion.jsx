import React, {useEffect, useState} from 'react';
import TablaPrestacion from "@/components/maestros/prestacion-components/tabla-prestacion/tabla-prestacion";
import {Card} from "primereact/card";


const MainPrestacion = () => {


    return (
        <>
            <Card title="Prestaciones">
                <TablaPrestacion/>
            </Card>
        </>
    );
};

export default MainPrestacion;
