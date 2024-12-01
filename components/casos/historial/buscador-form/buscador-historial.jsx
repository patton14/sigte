import React, { useState, useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { classNames } from 'primereact/utils';

const SearchTypeSelector = ({ selectedValue, onChange }) => (
    <div className="p-inputgroup flex align-items-center">
        <div style={{ marginRight: '10rem' }}>
            <RadioButton inputId="run" name="searchType" value="run" onChange={onChange} checked={selectedValue === 'run'} />
            <label htmlFor="run">RUN / N°Identificación</label>
        </div>
        <div>
            <RadioButton inputId="sigte" name="searchType" value="sigte" onChange={onChange} checked={selectedValue === 'sigte'} />
            <label htmlFor="sigte">SIGTE ID</label>
        </div>
    </div>
);

const SearchInput = ({ control, errors, searchType }) => (
    <Controller
        name="searchQuery"
        control={control}
        render={({ field, fieldState }) => (
            <>
                <span className="p-inputgroup">
                    <InputText
                        id={field.name}
                        value={field.value}
                        placeholder={`Buscar por ${searchType === 'run' ? 'RUN / N°Identificación' : 'SIGTE ID'}...`}
                        className={'p-inputtext-sm' + classNames({ 'p-invalid': fieldState.error })}
                        onChange={(e) => field.onChange(e.target.value)}
                    />
                    <Button icon="pi pi-search" />
                </span>
                {errors[field.name] ? <small className="p-error">{errors[field.name].message}</small> : <small className="p-error">&nbsp;</small>}
            </>
        )}
    />
);

function BuscadorHistorial() {
    const defaultValues = { searchQuery: '' };
    const [searchType, setSearchType] = useState('run');

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        setValue
    } = useForm({ defaultValues });

    const submitBusqueda = (data) => {
        console.log(searchType);

        console.log(data);
    };

    const handleSearchTypeChange = (e) => {
        setSearchType(e.value);
        setValue('searchQuery', ''); // Limpiar el campo de entrada cuando cambia el tipo de búsqueda
    };

    return (
        <>
            <form className="col-12" onSubmit={handleSubmit(submitBusqueda)}>
                <div className="p-fluid formgrid grid">
                    <div className="p-field col-12 md:col-12 pl-5 mb-3">
                        <SearchTypeSelector selectedValue={searchType} onChange={handleSearchTypeChange} />
                    </div>
                    <div className="field col-3 md:col-3">
                        <SearchInput control={control} errors={errors} searchType={searchType} />
                    </div>
                </div>
            </form>
        </>
    );
}

export default BuscadorHistorial;
