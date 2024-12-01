import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import React, {useEffect, useState} from 'react';
import {FilterMatchMode, FilterOperator} from "primereact/api";
import {getAllUsuarios} from "@/service/sigte-services/usuarios/usuarios-service";
import {InputText} from "primereact/inputtext";
import {Toolbar} from "primereact/toolbar";
import {Button} from "primereact/button";
import {Dialog} from "primereact/dialog";
import DialogNuevoUsuario from "@/components/admin/usuarios-components/nuevo-usuario/dialog-nuevo-usuario";
import DialogGestionUsuario from "@/components/admin/usuarios-components/gestion-usuario/dialog-gestion-usuario";
const TablaUsuarios = () => {
    const [globalFilterValue, setGlobalFilterValue] = useState('');
    const [filters, setFilters] = useState(null);
    const [usuarios, setUsuarios] = useState([]);
    const [showDialogUsuario, setShowDialogUsuario] = useState(false);
    const [showDialogAdmin, setShowDialogAdmin] = useState(false);
    const [refresh, setRefresh] = useState(false)
    const [dataUser, setDataUser] = useState(null);
    useEffect(() => {
        const loadData = async () => {
            const users = await getAllUsuarios();
            console.log(users);
            let arrayUsers = users.map(user => ({
                ...user,
                estado: user.state === 1 ? 'Activo' : 'Inactivo'
            } ));
            setUsuarios(arrayUsers)
        }
        initFilters();
        loadData();
        return () => {

        };
    }, [refresh]);

    const rightToolbarTemplate = () => {
        return (
            <>
                <div className="flex justify-content-between">
                    <span className="p-input-icon-left">
                        <i className="pi pi-search" />
                        <InputText  value={globalFilterValue} onChange={onGlobalFilterChange} placeholder="Buscar..." />
                    </span>
                </div>
            </>
        );
    }
    const leftToolbarTemplate = () => {
        return (
            <>
                <div className="flex justify-content-between gap-2">
                    <Button icon="pi pi-plus" label="Crear" severity="success" onClick={() => setShowDialogUsuario(true)} />
                    <Button icon="pi pi-refresh" label="Recargar" severity="warning" onClick={() => setRefresh(!refresh)} />
                </div>
            </>
        );
    }
    const renderHeader = () => {
        return (
            <>
                <Toolbar start={leftToolbarTemplate} end={rightToolbarTemplate}/>
            </>
        );
    };

    const header = renderHeader();

    const onGlobalFilterChange = (e) => {
        const value = e.target.value;
        let _filters = { ...filters };

        _filters['global'].value = value;

        setFilters(_filters);
        setGlobalFilterValue(value);
    };
    const clearFilter = () => {
        initFilters();
    };
    const initFilters = () => {
        setFilters({
            global: { value: null, matchMode: FilterMatchMode.CONTAINS },
            rut: { value: null, matchMode: FilterMatchMode.CONTAINS },
            nombre: { operator: FilterOperator.AND, constraints: [{ value: null, matchMode: FilterMatchMode.STARTS_WITH }] },
            mail: { value: null, matchMode: FilterMatchMode.BETWEEN },
        });
        setGlobalFilterValue('');
    };
    const administrarUsuario = (rowData) => {
        console.log(rowData)
        setDataUser(rowData)
        setShowDialogAdmin(true)
    }
    const actionBodyTemplate = (rowData) => {
        return (
                    <>
                        <div className="flex align-items-center justify-content-center gap-2">
                            <Button icon="pi pi-pencil" className="p-button-rounded p-button-success" onClick={()=> administrarUsuario(rowData)} tooltip="Administrar" tooltipOptions={{position:"top"}}/>
                        </div>
                    </>
                );

    }

    return (
        <>
            <DataTable className='scalein animation-duration-1000 animation-iteration-1' size='small' value={usuarios} paginator rows={10} tableStyle={{ minWidth: '50rem' }}
                       filters={filters} globalFilterFields={['rut', 'nombre', 'mail', 'Telefono']} showGridlines header={header}
                       emptyMessage="No se encontraron usuarios">
                <Column field="id" header="ID"  headerStyle={{ width: '5vw' }}></Column>
                <Column field="mail" header="Identificador / E-mail"  headerStyle={{ width: 'auto' }}></Column>
                <Column field="nombre" header="Nombre Completo"  headerStyle={{ width: 'auto' }}></Column>
                <Column field="rut" header="Rut"  headerStyle={{ width: 'auto' }}></Column>
                <Column field="estado" header="estado"  headerStyle={{ width: 'auto' }}></Column>
                <Column header="Acciones" body={actionBodyTemplate}  exportable={false} alignHeader='center' headerStyle={{ width: 'auto' }}></Column>

            </DataTable>

            <Dialog blockScroll className="surface-card p-4 shadow-2 border-round w-full lg:w-3"  visible={showDialogUsuario}  onHide={() => setShowDialogUsuario(false)}>
                    <DialogNuevoUsuario setRefresh={setRefresh} refresh={refresh}/>
            </Dialog>

            <Dialog blockScroll header="Administración del usuario" className="surface-card p-4 shadow-2 border-round w-full lg:w-6" style={{height:"80vh"}}  visible={showDialogAdmin}  onHide={() => setShowDialogAdmin(false)}>
                <DialogGestionUsuario data={dataUser} setRefresh={setRefresh} refresh={refresh}/>
            </Dialog>
        </>
    );
};

export default TablaUsuarios;
