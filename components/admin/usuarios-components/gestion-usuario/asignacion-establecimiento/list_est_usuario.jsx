import React, { useEffect, useRef, useState } from 'react';
import { getRolAsignadoByUser, quitarEstablecimiento, quitarSs } from '@/service/sigte-services/roles/roles-service';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { getEstablecimientoById, getEstablecimientoBySs } from '@/service/sigte-services/establecimiento/establecimiento-service';

const ListEstUsuario = ({user, Establecimientos}) => {
    const [listEstablecimientos, setListEstablecimientos] = useState([]);
    const toast = useRef(null);
    const [refresh, setRefresh] = useState(false);
    useEffect(() => {
        const loadData = async () => {
            console.log(Establecimientos);
            const privilegiosUsuaro = await getRolAsignadoByUser(user.user_id);
            console.log(privilegiosUsuaro.Establecimientos);
            // Armar array de establecimientos
            if(privilegiosUsuaro?.Establecimientos){
                const establecimientos = await Promise.all(privilegiosUsuaro.Establecimientos.map(async (item,index) => {
                    const est = await getEstablecimientoById(item)
                    console.log(est);
                    return {
                        id: est.id,
                        index: index+1,
                        name: est.nombre,
                        ss_nombre: est.ss_nombre,
                        vigente: est.vigente,
                    }
                }));
                console.log(establecimientos);
                setListEstablecimientos(establecimientos);
            }else{
                setListEstablecimientos([])
            }
        }
        loadData();
    }, [refresh]);
    const quitarAsignacion = async(rowData) => {
        try {
            const result = await quitarEstablecimiento(user.user_id, rowData.id);
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
            <DataTable value={listEstablecimientos} className="p-datatable-sm"
                       paginator rows={5} emptyMessage="Sin datos"
                       stripedRows rowsPerPageOptions={[5,10,20,50]}>
                <Column field="index" header="ID" />
                <Column field="name" header="Nombre" />
                <Column field="ss_nombre" header="SS" />
                <Column field="actions" header="Acciones" body={actionBodyTemplate}  />
            </DataTable>
        </>
    );
};

export default ListEstUsuario;
