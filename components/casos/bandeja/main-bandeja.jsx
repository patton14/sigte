import React, { useState } from 'react';
import { Card } from 'primereact/card';
import FiltrosBandeja from '@/components/casos/bandeja/selector-filtros/filtros-bandeja';
import ListadoFiltros from './listado-filtrado/listado-filtros';

const MainBandeja = () => {
    const [establecimientosList, setEstablecimientosList] = useState([]);
    const [casosList, setCasosList] = useState([]);
    const [page, setPage] = useState(1);  // Página inicial
    const [pageFilter, setPageFilter] = useState(1);
    const limit = 1000;  // Tamaño del lote (batch)
    const [filtros, setFiltros] = useState(null);
    return (
        <Card title="Bandeja de casos" >
            <FiltrosBandeja filtros={filtros} limit={limit} setFiltros={setFiltros} page={pageFilter} setPage={setPageFilter} setCasosList={setCasosList} establecimientosList={establecimientosList} />
            <ListadoFiltros pageFilter={pageFilter} setPageFilter={setPageFilter} filtros={filtros}
                            setFiltros={setFiltros} limit={limit} page={page} setPage={setPage}
                            casosList={casosList}  setCasosList={setCasosList}
                            setEstablecimientosList={setEstablecimientosList} />
        </Card>
    );
};



export default MainBandeja;
