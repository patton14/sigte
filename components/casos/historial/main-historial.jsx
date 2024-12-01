import { Card } from 'primereact/card';
import React, { useEffect, useState } from 'react';
import TablaHistorial from './tabla-historial/tabla-historial';
import { Divider } from 'primereact/divider';
import {
    getAllCasosHistorico,
    getCountCasosHistorico,
    getAllCasosHistoricoByEstablecimiento,
    getAllCasosHistoricoByServicioSalud,
    getAllCasosHistoricoBySigteId,
    getCountCasosHistoricoByServicioSalud,
    getCountCasosHistoricoByEstablecimiento
} from '@/service/sigte-services/casos-historico/historicos-services';
import { useSession } from 'next-auth/react';

function MainHistorial() {
    const { data: session, status } = useSession();
    const [listCasosHisto, setListCasosHisto] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [loading, setLoading] = useState(false);
    // Estado para paginación
    const [page, setPage] = useState(1);
    const [size, setSize] = useState(50);
    const [totalRecords, setTotalRecords] = useState(0);
    useEffect(() => {
        const loadInitialData = async () => {
            setLoading(true);
            let totalCountResponse = 0;
            if (session.roles.Authorizations.some(auth => auth.RolID === 1)) {
                totalCountResponse = await getCountCasosHistorico();
            }else if(session.roles.Authorizations.some(auth => auth.RolID === 2)){
                if(session.roles.ServiciosSalud){
                    const serviciosSalud = { ss:session.roles.ServiciosSalud.map((e)=>e.toString()) };
                    const totalCount = await getCountCasosHistoricoByServicioSalud(serviciosSalud);
                    console.log(totalCount);
                    totalCountResponse = totalCount;
                }else{
                    return
                }

            }else if(session.roles.Authorizations.some(auth => auth.RolID === 3)){
                const establecimientos = { establecimientos:session.roles.Establecimientos.map((e)=>e.toString()) };
                const totalCount = await getCountCasosHistoricoByEstablecimiento(establecimientos);
                console.log(totalCount);
                totalCountResponse = totalCount;

            }
            console.log(totalCountResponse);
            if (totalCountResponse.status === 201 && totalCountResponse.data) {
                setTotalRecords(totalCountResponse.data.total_casos);
            }
            await loadMoreData();
            setLoading(false);

        };

        loadInitialData();
    }, []);

    const loadMoreData = async () => {
        setLoading(true);
        if (session.roles.Authorizations.some(auth => auth.RolID === 1)) {
            const newCasosHistoricos = await getAllCasosHistorico(page, size);
            if (newCasosHistoricos) {
                setListCasosHisto((prevList) => [...prevList, ...newCasosHistoricos]);
                setPage((prevPage) => prevPage + 1);  // Incrementar la página para la siguiente carga
            }
        }
        if (session.roles.Authorizations.some(auth => auth.RolID === 2)) {

            const listIdServicios = { ss: session.roles.ServiciosSalud.map((e)=>e.toString()) };
            const casosHistoricos = await getAllCasosHistoricoByServicioSalud(listIdServicios, page,size);
            if(casosHistoricos.status === 201){
                setListCasosHisto((prevList) => [...prevList, ...casosHistoricos.data]);
                setPage((prevPage) => prevPage + 1);  // Incrementar la página para la siguiente carga
            }
        }
        if (session.roles.Authorizations.some(auth => auth.RolID === 3)) {
            const listIdEstablecimientos = { establecimientos: session.roles.Establecimientos.map((e)=>e.toString()) };
            const caso = await getAllCasosHistoricoByEstablecimiento(listIdEstablecimientos, page, size);
            if(caso.status === 201){
                setListCasosHisto((prevList) => [...prevList, ...caso.data]);
                setPage((prevPage) => prevPage + 1);  // Incrementar la página para la siguiente carga
            }

        }
        setLoading(false);
    };

    return (
        <>
            <Card title={'Historial de Caso'}>
                <Divider />
                <TablaHistorial
                    loading={loading}
                    casosHistoricos={listCasosHisto}
                    loadMoreData={loadMoreData}
                    hasMore={listCasosHisto.length < totalRecords} // Verificar si quedan registros por cargar
                    refresh={refresh}
                    setRefresh={setRefresh}
                    totalRecords={totalRecords}
                />
            </Card>
        </>
    );
}

export default MainHistorial;
