import React from 'react';
import {Card} from "primereact/card";
import TablaUsuarios from "@/components/admin/usuarios-components/tabla-usuarios/tabla-usuarios";

const MyComponent = () => {
    return (
        <>
            <Card title="Usuarios">
                <TablaUsuarios/>
            </Card>
        </>
    );
};

export default MyComponent;
