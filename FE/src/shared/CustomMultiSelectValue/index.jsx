import React, { useState } from "react";
import { MultiSelect } from 'primereact/multiselect';

export default function CustomMultiSelectValue() {
    const [selectedCountries, setSelectedCountries] = useState(null);
    const countries = [
        { name: 'Australia', code: 'AU' },
        { name: 'Brazil', code: 'BR' },
        { name: 'China', code: 'CN' },
        { name: 'Egypt', code: 'EG' },
        { name: 'France', code: 'FR' },
        { name: 'Germany', code: 'DE' },
        { name: 'India', code: 'IN' },
        { name: 'Japan', code: 'JP' },
        { name: 'Spain', code: 'ES' },
        { name: 'United States', code: 'US' }
    ];

    const countryTemplate = (option) => (
        <div className="flex align-items-center">
            <img
                alt={option.name}
                src={`https://primefaces.org/cdn/primereact/images/flag/flag_placeholder.png`}
                className={`mr-2 flag flag-${option.code.toLowerCase()}`}
                style={{ width: '18px' }}
            />
            <div>{option.name}</div>
        </div>
    );

    const panelFooterTemplate = () => {
        const length = selectedCountries ? selectedCountries.length : 0;
        return (
            <div className="py-2 px-3">
                <b>{length}</b> item{length !== 1 ? 's' : ''} selected.
            </div>
        );
    };

    return (
        <div className="card flex justify-content-center">
            <MultiSelect
                value={selectedCountries}
                options={countries}
                onChange={(e) => setSelectedCountries(e.value)}
                optionLabel="name"
                placeholder="Select Countries"
                itemTemplate={countryTemplate}
                panelFooterTemplate={panelFooterTemplate}
                className="w-full md:w-20rem"
                display="chip"
                filter // Enable filtering/search
            />
        </div>
    );
}
