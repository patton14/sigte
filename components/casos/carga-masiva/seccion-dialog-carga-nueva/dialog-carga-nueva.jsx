import React, { useEffect, useRef, useState } from 'react';
import { FileUpload } from 'primereact/fileupload';
import { Button } from 'primereact/button';
import { Toast } from 'primereact/toast';
import { Controller, useForm } from 'react-hook-form';
import { Dropdown } from 'primereact/dropdown';
import { classNames } from 'primereact/utils';
import { Tag } from 'primereact/tag';
import axios from 'axios';
import { getSession, useSession } from 'next-auth/react';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import DialogCargaSklt from '@/components/loaders/dialog-carga-sklt';


function DialogCargaNueva(props) {
    const [activaErrorFileUpload, setActivaErrorFileUpload] = useState(true);
    const { data: session, status } = useSession();
    const [loading, setLoading] = useState(false);
    const toast = useRef(null);
    const [filterColumns, setFilterColumns] = useState([]);
    const [fileToUpload, setFileToUpload] = useState(null);
    const [fileBuffer, setFileBuffer] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const [selectedSs, setSelectedSs] = useState(null);
    const [validationResults, setValidationResults] = useState([]);
    const [viableBtn, setViableBtn] = useState(true);
    const [base64Excel, setBase64Excel] = useState(null);
    const [loader, setLoader] = useState(false);
    const [selectedTipoCarga, setSelectedTipoCarga] = useState(null);


    useEffect(() => {
        console.log(props.ServiciosDeSalud);
        console.log(session);
    }, []);


    const toCapitalize = (s) => {
        return s.charAt(0).toUpperCase() + s.slice(1);
    };

    const columnsMatch = (requiredColumns, importedColumns) => {
        // Convierte las columnas importadas a un Set después de convertirlas a mayúsculas, para permitir búsquedas rápidas y case-insensitive.
        const importedColumnsSet = new Set(importedColumns.map(column => column.toUpperCase()));

        // Verifica en el set de columnas si están almenos las requeridas
        for (let i = 0; i < requiredColumns.length; i++) {
            if (!importedColumnsSet.has(requiredColumns[i].toUpperCase())) {
                return false;
            }
        }
        return true;
    };

    const onSelect = (e) => {
        setValidationResults([]);
        if (!selectedSs?.id && !selectedTipoCarga) {
            // eliminar archivo del FileUpload

            return toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe seleccionar un servicio de salud y un tipo de carga',
                life: 3000
            });
        }
        setLoader(true);
        importExcel(e);
        //setSelectedFiles(prevFiles => [...prevFiles, ...files]);
    };


    const importExcel = async (e) => {
        const file = e.files[0];
        import('xlsx').then((xlsx) => {
            const reader = new FileReader();
            reader.onload = async (e) => {
                const base64File = e.target.result.split(',')[1]; // Obtener solo la parte base64 del archivo
                const { jwt } = await getSession();
                let establecimientos = null;
                if(session.roles.Establecimientos){
                    establecimientos = session.roles.Establecimientos;
                }
                const body = {
                    file: `data:${file.type};base64,${base64File}`,
                    ss_id: selectedSs.id,
                    tipo_carga_id: selectedTipoCarga,
                    filterColumns: filterColumns,
                    establecimientos_autorizados: establecimientos,
                };

                try {
                    const response = await axios.post('/api/controllers/file-upload/validate', body, {
                        headers: {
                            'Authorization': `Bearer ${jwt}`,
                            'Content-Type': 'application/json'
                        }
                    });
                    setLoader(false);
                    if (response.status === 200) {
                        setBase64Excel(`data:${file.type};base64,${base64File}`);
                        setViableBtn(false);
                        toast.current.show({
                            severity: 'success',
                            summary: 'Success',
                            detail: 'Archivo validado correctamente',
                            life: 3000
                        });
                    } else if (response.status === 201) {
                        setViableBtn(true);
                        // Ordenar los resultados por `row`
                        const sortedResults = response.data.sort((a, b) => a.row - b.row);
                        setValidationResults(sortedResults);
                        toast.current.show({
                            severity: 'warn',
                            summary: 'Validación',
                            detail: 'Archivo validado con errores',
                            life: 3000
                        });
                    }
                } catch (error) {
                    setLoader(false);
                    setViableBtn(true);
                    toast.current.show({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Error al validar el archivo: ${error.response ? error.response.data.message : error.message}`,
                        life: 3000
                    });
                }
            };

            setFileToUpload(file);
            reader.readAsDataURL(file); // Leer el archivo como URL de datos (base64)
        });
    };


    const errorColumns = () => {
        toast.current.show({
            severity: 'error',
            summary: 'Error',
            detail: 'Las columnas requeridas No coinciden',
            life: 3000
        });
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset
    } = useForm({});

    function fechaHora(date) {
        const fecha = ('0' + date.getDate()).slice(-2) + '-' +
            ('0' + (date.getMonth() + 1)).slice(-2) + '-' +
            date.getFullYear() + ' ' +  // Espacio en lugar de "T"
            ('0' + date.getHours()).slice(-2) + ':' +
            ('0' + date.getMinutes()).slice(-2) + ':' +
            ('0' + date.getSeconds()).slice(-2);

        return fecha;
    }

    const onSubmit = async (data) => {
        setLoading(true);
        const fecha = fechaHora(new Date());
        if (fileToUpload === null) {
            setActivaErrorFileUpload(false);
            return toast.current.show({
                severity: 'error',
                summary: 'Error',
                detail: 'Debe cargar un archivo válido',
                life: 3000
            });
        }
        const { jwt, user_code } = await getSession();
        const reader = new FileReader();

        reader.onloadend = async () => {
            const base64File = reader.result;

            const body = {
                file: base64File,
                servicio_salud_id: data?.servicio_salud?.id,
                tipo_carga_id: data?.tipo_carga?.id,
                cod_usuario: user_code,
                fecha_creacion: fecha,
                fileName: fileToUpload.name
            };
            console.log(body);

            try {
                const response = await axios.post('/api/controllers/file-upload/carga-upload', body, {
                    headers: {
                        'Authorization': `Bearer ${jwt}`
                    }
                });
                setFileToUpload(null);
                reset();
                toast.current.show({ severity: 'success', summary: 'Success', detail: 'Archivo subido correctamente', life: 3000 });
                setTimeout(() => {
                    props.setRefresh(!props.refresh);
                    props.setShowDialogCargaMasiva(false);
                    setLoading(false);
                }, 1000);
            } catch (error) {
                setLoading(false);
                toast.current.show({ severity: 'error', summary: 'Error', detail: 'Error al subir el archivo', life: 3000 });
            }
        };

        // Iniciar la lectura del archivo
        reader.readAsDataURL(fileToUpload);
    };

    const getFormErrorMessage = (name) => {
        return errors[name] ? <small className="p-error">{errors[name].message}</small> :
            <small className="p-error">&nbsp;</small>;
    };
    const serviceTemplate = (option) => {
        return (
            <div className="p-d-flex p-ai-center">
                <div className="p-mr-2">
                    <div>{option.nombre}</div>
                    <div className="p-text-light">código: {option.id}</div>
                </div>
            </div>
        );
    };
    return (
        <>
            <Toast ref={toast} />
            {loader && (
                <DialogCargaSklt />
            )}

            <form onSubmit={handleSubmit(onSubmit)} hidden={loader} className="col-12">
                <div className="formgrid grid p-fluid">
                    <div className="field col-3 md:col-6">
                        <Controller
                            name="servicio_salud"
                            control={control}
                            rules={{ required: 'Servicio de salud es requerido' }}
                            render={({ field, fieldState }) => (<Dropdown
                                id={field.name}
                                value={field.value}
                                placeholder="Servicio salud"
                                optionLabel="nombre"
                                options={props.ServiciosDeSalud}
                                focusInputRef={field.ref}
                                itemTemplate={serviceTemplate}
                                onChange={(e) => {
                                    field.onChange(e.value);
                                    setSelectedSs(e.value);

                                }}
                                className={'p-inputtext-m' + classNames({ 'p-invalid': fieldState.error })}
                            />)}
                        />
                        {getFormErrorMessage('servicio_salud')}
                    </div>
                    <div className="field col-3 md:col-6">
                        <Controller
                            name="tipo_carga"
                            control={control}
                            rules={{ required: 'Tipo de carga es requerido' }}
                            render={({ field, fieldState }) => (<Dropdown
                                id={field.name}
                                value={field.value}
                                optionLabel="nombre"
                                placeholder="Filtrar por tipo de carga"
                                options={props.TipoCargas}
                                focusInputRef={field.ref}
                                onChange={(e) => {
                                    field.onChange(e.value);
                                    setSelectedTipoCarga(e.value.id);
                                    setFilterColumns(e.value.columnas);
                                }}
                                className={'p-inputtext-m' + classNames({ 'p-invalid': fieldState.error })}
                            />)}
                        />
                        {getFormErrorMessage('tipo_carga')}
                    </div>
                    <div className="col-12 md:col-12 mb-4">
                        <label htmlFor="uploadFile" className="font-bold">Subir documento</label>
                        <FileUpload
                            className={!activaErrorFileUpload ? 'border-1 border-red-500 border-round' : ''}
                            name="documentosRespaldo"
                            mode="advanced"
                            chooseLabel="Buscar"
                            cancelLabel="Quitar"
                            multiple={false}
                            onClear={() => {
                                setViableBtn(true);
                                setValidationResults([])
                            }}
                            cancelOptions={{ className: 'w-4 p-button-danger' }}
                            chooseOptions={{ className: 'w-4 p-button-info' }}
                            uploadOptions={{ className: 'hidden' }}
                            accept="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
                            maxFileSize={5000000}
                            onSelect={(e) => {
                                onSelect(e);
                                //importExcel(e); // Primero ejecuta tu función personalizada
                            }}
                            emptyTemplate={<p className="m-0">Arrastrar y soltar archivos correspondientes.</p>}
                            onRemove={() => {setValidationResults([])}}
                        />
                        <small className={classNames({ 'hidden': activaErrorFileUpload, 'p-error': true })}>es obligatorio subir un documento</small>
                    </div>


                    <div className="field col-12 md:col-12">
                        <Button type="submit" disabled={viableBtn} label="Enviar Archivo" icon="pi pi-cloud-upload" className="p-button-help" loading={loading} />
                    </div>
                </div>
            </form>


            {validationResults.length > 0 && (
                <DataTable value={validationResults}>
                    <Column field="row" header="Fila" />
                    <Column field="columns" header="Columnas" body={(rowData) => rowData.columns.join(', ')} />
                    <Column field="errors" header="Errores" body={(rowData) => rowData.errors.join(', ')} />
                </DataTable>
            )}

        </>
    );
}

export default DialogCargaNueva;
