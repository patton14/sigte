import React, { useEffect, useRef, useState } from 'react';
import { getServiciosSalud } from '@/service/sigte-services/servicio-salud/servicio-salud-service';
import { PickList } from 'primereact/picklist';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { asignarSs } from '@/service/sigte-services/roles/roles-service';
import { TabPanel, TabView } from 'primereact/tabview';
import { MdAssignmentAdd } from 'react-icons/md';
import ListSsUsuario from '@/components/admin/usuarios-components/gestion-usuario/list_ss_usuario';

const AsignarSsUsuario = ({ user }) => {
    const [source, setSource] = useState([]);
    const [target, setTarget] = useState([]);
    const toast = useRef(null);
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const loadData = async () => {
            console.log(user);
            const servicios = await getServiciosSalud();
            console.log(servicios);
            setSource(servicios.servicios_salud);
        };
        loadData();
        return () => {
            setTarget([]);
        };
    }, [user, refresh]);

    const onChange = (event) => {
        setSource(event.source);
        setTarget(event.target);
    };

    const submitAsignaciones = async () => {
        setLoading(true);
        if (target.length === 0) {
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Debe seleccionar al menos un servicio de salud' });
            return setLoading(false);
        }
        try {
            // Aquí puedes manejar la lógica para enviar los datos seleccionados
            const body = {
                user_id: user.user_id,
                rol_id: user.rol_id,
                servicios_salud: target.map((item) => item.id)
            };
            await asignarSs(body);
            toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Servicios de salud asignados correctamente' });
            setRefresh(!refresh);
            return setLoading(false);
        } catch (e) {
            console.log(e);
            toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al asignar los servicios de salud' });
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
            <TabView >
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
                                sourceStyle={{ height: '24rem' }}
                                targetStyle={{ height: '24rem' }}
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
                    <ListSsUsuario user={user} SS={source} />
                </TabPanel>
            </TabView>

        </>
    );
};

export default AsignarSsUsuario;
