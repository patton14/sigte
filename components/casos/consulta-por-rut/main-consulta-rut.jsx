import { Card } from 'primereact/card'
import React from 'react'
import BuscadorRut from './buscador-consulta/buscador-rut'
import { Divider } from 'primereact/divider'
import TablaRut from './tabla-rut-buscado/tabla-rut'

function MainConsultaRut() {
    return (
        <>
            <Card title="Bandeja Consulta RUN">
                <BuscadorRut/>
                <Divider/>
                <TablaRut/>
            </Card>
        </>
    )
}

export default MainConsultaRut
