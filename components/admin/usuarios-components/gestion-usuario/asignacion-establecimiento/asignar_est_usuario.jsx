import React, { useEffect, useRef, useState } from 'react';
import { asignarEstablecimiento, asignarSs } from '@/service/sigte-services/roles/roles-service';
import { TabPanel, TabView } from 'primereact/tabview';
import { Toast } from 'primereact/toast';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import ListEstUsuario from '@/components/admin/usuarios-components/gestion-usuario/asignacion-establecimiento/list_est_usuario';

const AsignarEstUsuario = ({ user, establecimientos }) => {
    const [allEstablecimientos, setAllEstablecimientos] = useState([]);
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);
    const [page, setPage] = useState(0);
    const rowsPerPage = 100; // Número de elementos a mostrar por página

    useEffect(() => {
        setSource(establecimientos?.establecimientos);
        return  () =>{
            setTarget([]);
        }
    }, [user, establecimientos]);

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };


    const submitAsignaciones = async () => {
        setLoading(true);
        if (target.length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar al menos un establecimiento' });
            return setLoading(false);
        }
        try {
            const body = {
                user_id: user.user_id,
                rol_id: user.rol_id,
                establecimientos: target.map((item) => item.id)
            };
            const result = await asignarEstablecimiento(body);
            if(result){
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Establecimientos asignados correctamente' });
                setRefresh(!refresh);
                setTarget([]);
                return setLoading(false);
            }
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al asignar los establecimientos' });
            return setLoading(false);

        } catch (e) {
            console.log(e);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al asignar los establecimientos' });
            return setLoading(false);
        }
    };

    const itemTemplate = (item) => {
        return (
            <div className="flex flex-wrap p-2 align-items-center gap-3">
                <div className="flex-1 flex flex-column gap-2">
                    <span className="font-bold">{item.nombre}</span>
                </div>
            </div>
        );
    };

    return (
        <>
            <TabView>
                <TabPanel header="Asignar" leftIcon="pi pi-fa pi-plus">
                    <div className="p-fluid formgrid grid">
                        <Toast ref={toast} />
                        <div className="field col-12 md:col-12">
                            <PickList
                                dataKey="id"
                                source={source}
                                target={target}
                                onChange={onChange}
                                itemTemplate={itemTemplate}
                                filter
                                filterBy="nombre,id"
                                breakpoint="1280px"
                                sourceHeader="Disponibles"
                                targetHeader="Seleccionados"
                                sourceStyle={{ height: '24rem', overflow: 'auto' }}
                                targetStyle={{ height: '24rem', overflow: 'auto' }}
                                sourceFilterPlaceholder="Buscar por nombre/codigo"
                                targetFilterPlaceholder="Buscar por nombre/codigo"
                            />
                        </div>
                    </div>
                    <div className="flex justify-content-center flex-wrap">
                        <Button label="Asignar" className="p-button-info w-20rem" loading={loading} onClick={submitAsignaciones} />
                    </div>
                </TabPanel>
                <TabPanel header="Asignados" leftIcon="pi pi-fw pi-list">
                    <ListEstUsuario user={user} Establecimientos={source} />
                </TabPanel>
            </TabView>
        </>
    );
};

export default AsignarEstUsuario;
