import React from 'react';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { Divider } from 'primereact/divider';
import { Fieldset } from 'primereact/fieldset';
import { Card } from 'primereact/card';

const DetalleHistorial = ({ visible, onHide, item }) => {
    const renderFooter = () => (
        <div className="p-d-flex p-jc-end">
            <Button label="Cerrar" icon="pi pi-times" onClick={onHide} className="p-button" severity="danger" />
        </div>
    );

    return (
        <Dialog
            header="Detalle del Historial"
            visible={visible}
            style={{ width: '60vw' }}
            onHide={onHide}
            footer={renderFooter()}
        >
            <div className="p-fluid">
                <Card title="Información Personal" className="mb-3">
                    <div className="p-grid p-formgrid">
                        <div className="p-col-12 p-md-6">
                            <p><strong>RUN:</strong> {item.RUN}-{item.DV}</p>
                            <p><strong>Nombres:</strong> {item.NOMBRES}</p>
                            <p><strong>Primer Apellido:</strong> {item.PRIMER_APELLIDO}</p>
                            <p><strong>Segundo Apellido:</strong> {item.SEGUNDO_APELLIDO}</p>
                            <p><strong>Fecha de Nacimiento:</strong> {item.FECHA_NAC}</p>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <p><strong>Teléfono Fijo:</strong> {item.FONO_FIJO ? item.FONO_FIJO : "No Informado"}</p>
                            <p><strong>Teléfono Móvil:</strong> {item.FONO_MOVIL ? item.FONO_MOVIL : "No Informado"}</p>
                            <p><strong>Email:</strong> {item.EMAIL ? item.EMAIL : "No Informado"}</p>
                        </div>
                    </div>
                </Card>

                <Fieldset legend="Información del Establecimiento">
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6">
                            <p><strong>Servicio de Salud:</strong> {item.SERV_SALUD_NOMBRE}</p>
                            <p><strong>Establecimiento de Origen:</strong> {item.ESTAB_ORIG_NOMBRE}</p>
                            <p><strong>Establecimiento de Destino:</strong> {item.ESTAB_DEST_NOMBRE}</p>
                            <p><strong>Fecha de Entrada:</strong> {item.F_ENTRADA}</p>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <p><strong>Fecha de Salida:</strong> {item.F_SALIDA ? item.F_SALIDA : "No Informado"}</p>
                            <p><strong>Código de Salida:</strong> {item.C_SALIDA ? item.C_SALIDA : "No Informado"}</p>
                        </div>
                    </div>
                </Fieldset>

                <Divider />

                <Fieldset legend="Detalles Adicionales">
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6">
                            <p><strong>Sospecha Diagnóstico:</strong> {item.SOSPECHA_DIAG}</p>
                            <p><strong>Confirmación Diagnóstico:</strong> {item.CONFIR_DIAG}</p>
                            <p><strong>Condición de Ruralidad:</strong> {item.COND_RURALIDAD}</p>
                            <p><strong>Vía Dirección:</strong> {item.VIA_DIRECCION}</p>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <p><strong>Nombre de Calle:</strong> {item.NOM_CALLE}</p>
                            <p><strong>Número de Dirección:</strong> {item.NUM_DIRECCION ? item.NUM_DIRECCION : "No Informado"}</p>
                            <p><strong>Resto de Dirección:</strong> {item.RESTO_DIRECCION ? item.RESTO_DIRECCION : "No Informado"}</p>
                            <p><strong>Ciudad:</strong> {item.CIUDAD}</p>
                        </div>
                    </div>
                </Fieldset>

                <Divider />

                <Fieldset legend="Información de la Prestación">
                    <div className="p-grid">
                        <div className="p-col-12 p-md-6">
                            <p><strong>Tipo de Prestación:</strong> {item.TIPO_PRESTACION_NOMBRE}</p>
                            <p><strong>Prestación Mínima:</strong> {item.PRESTA_MIN_NOMBRE}</p>
                            <p><strong>Prestación Estimada:</strong> {item.PRESTA_EST}</p>
                        </div>
                        <div className="p-col-12 p-md-6">
                            <p><strong>Plano:</strong> {item.PLANO_NOMBRE}</p>
                            <p><strong>Extremidad:</strong> {item.EXTREMIDAD_NOMBRE}</p>
                        </div>
                    </div>
                </Fieldset>
            </div>
        </Dialog>
    );
};

export default DetalleHistorial;
