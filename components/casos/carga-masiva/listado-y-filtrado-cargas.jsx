import React, { useEffect, useState } from 'react';
import { Card } from 'primereact/card';
import ListadoCargas from '@/components/casos/carga-masiva/seccion-tabla-listado/listado-cargas';
import { getByServicioSalud, getCargas, getCargasByEstablecimiento } from '@/service/sigte-services/cargas/cargas-service';
import { useSession } from 'next-auth/react';

const ListadoYFiltradoCargas = ({ limitador }) => {
    const { data: session, status } = useSession();
    const [cargas, setCargas] = useState([]);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        const loadCargas = async () => {
            if (session.roles.Authorizations.some(auth => auth.RolID === 1)) {
                const result = await getCargas();
                const transformData = (data) => {
                    return data?.load_files.map(item => {
                        const values = Object.values(item);
                        const fileData = values[0];
                        fileData._id = values[1];
                        return fileData;
                    }) || [];
                };
                setCargas(transformData(result));
            } else if (session.roles.Authorizations.some(auth => auth.RolID === 2 || auth.RolID === 5)) {
                //const result = await getByServicioSalud()
                const listIdServicios = session.roles.ServiciosSalud;
                const cargas = await Promise.all(listIdServicios.map(async (id) => {
                    const listadoCargas = await getByServicioSalud(id);
                    console.log(listadoCargas);
                    return listadoCargas?.load_files.map(item => {
                        const values = Object.values(item);
                        const fileData = values[0];
                        fileData._id = values[1];
                        return fileData;
                    }) || [];
                }));
                setCargas(cargas.flat());
            }else if(session.roles.Authorizations.some(auth => auth.RolID === 3)) {
                const listIdEstablecimientos = session.roles.Establecimientos;
                const cargas = await Promise.all(listIdEstablecimientos.map(async (id) => {
                    const listadoCargas = await getCargasByEstablecimiento(id);
                    console.log(listadoCargas);
                    return listadoCargas?.load_files.map(item => {
                        const values = Object.values(item);
                        const fileData = values[0];
                        fileData._id = values[1];
                        return fileData;
                    }) || [];
                }));
                setCargas(cargas.flat());
            }
        };
        if (status === 'authenticated') {
            loadCargas();
        }
    }, [refresh]);
    return (<>
        <Card>
            <ListadoCargas limitador={limitador} cargas={cargas} setCargas={setCargas} refresh={refresh} setRefresh={setRefresh} />
        </Card>
    </>);
};

export default ListadoYFiltradoCargas;
