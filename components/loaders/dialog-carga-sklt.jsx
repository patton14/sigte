import React from 'react';
import { Skeleton } from 'primereact/skeleton';

const DialogCargaSklt = () => {
    return (
        <div className="col-12">
            <div className="formgrid grid p-fluid">
                <div className="field col-3 md:col-6">
                    <Skeleton width="100%" height="2.5rem" />
                    <Skeleton width="100%" height="1.5rem" className="mt-2" />
                </div>
                <div className="field col-3 md:col-6">
                    <Skeleton width="100%" height="2.5rem" />
                    <Skeleton width="100%" height="1.5rem" className="mt-2" />
                </div>
                <div className="col-12 md:col-12 mb-4">
                    <Skeleton width="100%" height="2.5rem" />
                    <Skeleton width="100%" height="1.5rem" className="mt-2" />
                </div>
                <div className="field col-12 md:col-12">
                    <Skeleton width="100%" height="2.5rem" />
                </div>
            </div>
        </div>
    );
};

export default DialogCargaSklt;
