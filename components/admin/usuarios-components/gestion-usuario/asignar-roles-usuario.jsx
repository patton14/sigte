import React, { useEffect, useRef, useState } from 'react';
import { asignarRol, getRolAsignadoByUser, getRoles, removeRol } from '@/service/sigte-services/roles/roles-service';
import { Divider } from 'primereact/divider';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Toast } from 'primereact/toast';
import { OverlayPanel } from 'primereact/overlaypanel';
import { RiHospitalLine } from 'react-icons/ri';
import { GiHospitalCross } from 'react-icons/gi';

import { useSession } from 'next-auth/react';
import { Dialog } from 'primereact/dialog';
import AsignarSsUsuario from '@/components/admin/usuarios-components/gestion-usuario/asignar_ss_usuario';
import AsignarEstUsuario from '@/components/admin/usuarios-components/gestion-usuario/asignacion-establecimiento/asignar_est_usuario';
import MainAsignacionEst from '@/components/admin/usuarios-components/gestion-usuario/asignacion-establecimiento/main-asignacion-est';

const AsignarRolesUsuario = (props) => {
    const [roles, setRoles] = useState([]);
    const [rolesAsignados, setRolesAsignados] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const toast = useRef(null);
    const op = useRef(null);
    const [rolPermiso, setRolPermiso] = useState([]);
    const [showDialogSs, setShowDialogSs] = useState(false);
    const [showDialogEst, setShowDialogEst] = useState(false);
    const [userId, setUserId] = useState(null);
    const defaultValues = {
        rol: null
    };
    useEffect(() => {
        const loadData = async () => {
            const rolesObtenidos = await getRoles();
            console.log(rolesObtenidos);
            console.log(props.data);
            if (props?.data) {
                const rolesAsignados = await getRolAsignadoByUser(props.data.id);
                console.log(rolesAsignados);
                if(rolesAsignados?.Authorizations){
                    // Crear un nuevo array con información adicional
                    let arrayRoles = rolesAsignados?.Authorizations.map(rol => ({
                        ...rol,
                        name: rolesObtenidos.find(r => r.RolID === rol.RolID)?.NombreRol,
                        user_id: props.data.id
                    }));

                    // Filtrar los roles para excluir los que ya están asignados
                    const rolesFiltrados = rolesObtenidos.filter(rol =>
                        !arrayRoles.some(asignado => asignado.RolID === rol.RolID)
                    );


                    setRolesAsignados(arrayRoles);
                    setRoles(rolesFiltrados);
                }else{
                    setRoles(rolesObtenidos);
                }
            } else {
                setRoles(rolesObtenidos);
            }
        };
        loadData();
    }, [props.data, refresh]);

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        getValues
    } = useForm({ defaultValues });
    const verPrivilegios = (e, data) => {
        console.log(data);
        const permisos = data.Permisos;
        setRolPermiso(permisos);
        op.current.toggle(e);

    };
    const submitBusqueda = async (data) => {
        console.log(data);
        let body = {
            'rol_id': data.rol.RolID,
            'user_id': props.data.id
        };
        const result = await asignarRol(body);
        if (result) {
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Rol asignado correctamente',
                life: 3000
            });
            setRefresh(!refresh);
            reset();
            return;
        }
        return toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al asignar rol', life: 3000 });
    };
    const quitarRol = async (data) => {
        console.log(data);
        const result = await removeRol(data.user_id, data.RolID);
        if (result) {
            toast.current.show({
                severity: 'success',
                summary: 'Éxito',
                detail: 'Rol eliminado correctamente',
                life: 3000
            });
            setRefresh(!refresh);
            return;
        }
        return toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al eliminar rol', life: 3000 });
    };
    const asignacionSS = (rowData) => {
        const body = {
            user_id: rowData.user_id,
            rol_id: rowData.RolID
        };
        setUserId(body);
        setShowDialogSs(true);
    };
    const asignacionEst = (rowData) => {
        const body = {
            user_id: rowData.user_id,
            rol_id: rowData.RolID
        };
        setUserId(body);
        setShowDialogEst(true);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <>
                <div className="flex align-items-center justify-content-center gap-2">
                    <Button icon="pi pi-times" className="p-button-rounded p-button-danger p-mr-2 "
                            onClick={() => quitarRol(rowData)}
                            tooltip="Quitar rol" tooltipOptions={{ position: 'top', mouseTrack: 'true' }} />
                    <Button icon="pi pi-eye" className="p-button-rounded p-button-help p-mr-2 "
                            onClick={(e) => verPrivilegios(e, rowData)}
                            tooltip="Ver Privilegios" tooltipOptions={{ position: 'top', mouseTrack: 'true' }} />
                    {[2,4,5].includes(rowData?.RolID) ? <Button icon={<GiHospitalCross size={25} />} className="p-button-rounded p-button-success p-mr-2 "
                                                                  onClick={(e) => asignacionSS(rowData)}
                                                                  tooltip="Asignar S. Salud" tooltipOptions={{ position: 'top', mouseTrack: 'true' }} />
                        : null}
                    {[3,4,5].includes(rowData?.RolID)? <Button icon={<RiHospitalLine size={25} />} className="p-button-rounded p-button-info p-mr-2 "
                                                    onClick={(e) => asignacionEst(rowData)}
                                                    tooltip="Asignar Establecimiento" tooltipOptions={{ position: 'top', mouseTrack: 'true' }} />
                        : null}
                </div>
            </>
        );
    };
    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> :
            <small className="p-error">&nbsp;</small>;
    };
    return (
        <>
            <div className="flex align-items-center justify-content-center">
                <Toast ref={toast} />
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-12">
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Roles Asignados</div>
                        </div>
                    </div>
                    <div className="field col-12 md:col-12">
                        <DataTable value={rolesAsignados} className="p-datatable-striped p-datatable-gridlines"
                                   emptyMessage="sin roles asignados">
                            <Column field="RolID" header="ID" sortable></Column>
                            <Column field="NombreRol" header="Nombre rol" sortable></Column>
                            <Column header="Acciones" body={actionBodyTemplate} exportable={false} alignHeader="center"
                                    headerStyle={{ width: 'auto' }}></Column>
                        </DataTable>

                    </div>
                </div>
            </div>
            <Divider />
            <form className="flex align-items-center justify-content-center" onSubmit={handleSubmit(submitBusqueda)}>
                <div className="p-fluid formgrid grid">
                    <div className="field col-12 md:col-12">
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Asignar rol</div>
                        </div>
                    </div>
                    <div className="field col-12 md:col-12">
                        <Controller
                            name="rol"
                            control={control}
                            rules={{ required: 'Un rol es requerido.' }}
                            render={({ field, fieldState }) => (
                                <>
                                    <Dropdown
                                        id={field.name}
                                        value={field.value}
                                        optionLabel="NombreRol"
                                        placeholder="Seleccione un rol"
                                        options={roles}
                                        focusInputRef={field.ref}
                                        onChange={(e) => field.onChange(e.value)}
                                        className={classNames({ 'p-invalid': fieldState.error })}
                                    />
                                    {getFormErrorMessage(field.name)}
                                </>
                            )}
                        />
                    </div>
                    <div className="field col-12 md:col-12">
                        <Button type="submit" label="Asignar" className="p-button-info" />
                    </div>
                </div>
            </form>

            <OverlayPanel ref={op} showCloseIcon dismissable={false}>
                <DataTable value={rolPermiso} selectionMode="single" paginator rows={5}>
                    <Column field="PermisoID" header="N°" sortable style={{ minWidth: '12rem' }} />
                    <Column field="Descripcion" header="Detalle" sortable style={{ minWidth: '12rem' }} />
                </DataTable>
            </OverlayPanel>
            <Dialog visible={showDialogSs} blockScroll  className="surface-card p-4 shadow-2 border-round w-full lg:w-6" style={{ minWidth: '15rem', minHeight: '60rem' }} headerStyle={{textAlign:"center"}} header="Asignar Servicio de salud" modal onHide={() => setShowDialogSs(false)}>
                <Divider />
                <AsignarSsUsuario user={userId} />
            </Dialog>
            <Dialog visible={showDialogEst} blockScroll
                    className="surface-card p-4 shadow-2 border-round w-full lg:w-6"
                    style={{ minWidth: '15rem', minHeight: '60rem' }} headerStyle={{textAlign:"center"}}
                    header="Asignar Establecimiento" modal
                    onHide={() => setShowDialogEst(false)}>
                <Divider />
                <MainAsignacionEst user={userId} />
                {/*<AsignarEstUsuario user={userId} />*/}
            </Dialog>

        </>
    );
};

export default AsignarRolesUsuario;
