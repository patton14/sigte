import React, { useEffect, useRef, useState } from 'react';
import { getRolAsignadoByUser, quitarSs } from '@/service/sigte-services/roles/roles-service';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';

const ListSsUsuario = ({user, SS}) => {
    const [listServicios, setListServicios] = useState([]);
    const toast = useRef(null);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            const privilegiosUsuaro = await getRolAsignadoByUser(user.user_id);
            console.log(privilegiosUsuaro.ServiciosSalud);
            // armar array de servicios de salud
            if(privilegiosUsuaro?.ServiciosSalud){
                const servicios = privilegiosUsuaro.ServiciosSalud.map((item) => {
                    const ss = SS.find((ss) => ss.id === item);
                    console.log(ss);
                    return {
                        id: ss.id,
                        name: ss.nombre,
                    };
                });
                console.log(servicios);
                setListServicios(servicios);
            }else{
                setListServicios([])
            }
        }
        loadData();
    }, [refresh]);
    const quitarAsignacion = async(rowData) => {
        try {
            const result = await quitarSs(user.user_id, rowData.id);
            console.log(result);
            if (result) {
                toast.current.show({ severity: 'success', summary: 'Éxito', detail: 'Asignación eliminada correctamente' });
                return setRefresh(!refresh)
            }
            toast.current.show({ severity: 'success', summary: 'Error', detail: 'Ocurrió un error al eliminar la asignación' });
            return setRefresh(!refresh)
        }catch (e) {
            console.log(e);
            return toast.current.show({ severity: 'error', summary: 'Error', detail: 'Ocurrió un error al eliminar la asignación' });
        }
    }
    const actionBodyTemplate = (rowData) => {
        return (
            <div className="flex justify-center gap-2">
                <Button icon="pi pi-times" tooltip="Quitar Asignación"
                        tooltipOptions={{position:"top", mouseTrack:"true"}}
                        className="p-button-rounded p-button-danger p-mr-2"
                        onClick={() => quitarAsignacion(rowData)}
                />
            </div>
        );
    };
    return (
        <>
            <Toast ref={toast} />
            <DataTable value={listServicios} className="p-datatable-sm"
                       paginator rows={5} emptyMessage="Sin datos"
                       stripedRows rowsPerPageOptions={[5,10,20,50]}>
                <Column field="id" header="ID" />
                <Column field="name" header="Nombre" />
                <Column field="actions" header="Acciones" body={actionBodyTemplate}  />
            </DataTable>
        </>
    );
};

export default ListSsUsuario;
