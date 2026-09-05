import { ICity, ICountry, IState as LibIState } from '@/types/interface-lib';
import { AlertCircle, LucideIcon, MapPin } from 'lucide-react';
import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import { FormInput } from '../../Forms/FormElements';
import { SearchableSelect } from '../../Forms/SearchableSelect';
import { AddressData, FieldErrors } from '../hooks/useRegisterForm';

export interface IState extends LibIState {
    iso2?: string;
}

interface AddressFormProps {
    title?: string;
    data: AddressData;
    countries: ICountry[];
    loadingCountries: boolean;
    icon?: LucideIcon;
    iconColor?: string;
    iconBgColor?: string;
    fieldErrors?: FieldErrors;
    errorPrefix?: string;

    onInputChange: (e: ChangeEvent<HTMLInputElement>, field: keyof AddressData) => void;
    onFieldChange: (field: keyof AddressData, value: string) => void;
    onCountrySearch: (query: string) => void;
}

export const AddressForm: React.FC<AddressFormProps> = ({
    title,
    data,
    countries,
    loadingCountries,
    icon: Icon = MapPin,
    iconColor = "text-purple-600",
    iconBgColor = "from-purple-500 to-purple-600",
    fieldErrors = {},
    errorPrefix = 'address',
    onInputChange,
    onFieldChange,
    onCountrySearch
}) => {
    const getError = (field: string) => fieldErrors[`${errorPrefix}.${field}`];

    const [states, setStates] = useState<IState[]>([]);
    const [allStates, setAllStates] = useState<IState[]>([]);
    const [loadingStates, setLoadingStates] = useState(false);

    const [cities, setCities] = useState<ICity[]>([]);
    const [allCities, setAllCities] = useState<ICity[]>([]);
    const [loadingCities, setLoadingCities] = useState(false);

    const prevCountryRef = useRef<string | undefined>(undefined);
    const prevStateRef = useRef<string | undefined>(undefined);

    const fetchStates = async (countryId: number, search: string = '') => {
        try {
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const res = await fetch(`/api/location?type=states&country_id=${countryId}${searchParam}`);
            if (!res.ok) throw new Error('Failed to fetch states');
            return await res.json();
        } catch (err) {
            console.error('Error fetching states:', err);
            return [];
        }
    };

    const fetchCities = async (stateId: number, search: string = '') => {
        try {
            const searchParam = search ? `&search=${encodeURIComponent(search)}` : '';
            const res = await fetch(`/api/location?type=cities&state_id=${stateId}${searchParam}`);
            if (!res.ok) throw new Error('Failed to fetch cities');
            return await res.json();
        } catch (err) {
            console.error('Error fetching cities:', err);
            return [];
        }
    };

    useEffect(() => {
        const loadStates = async () => {
            if (!data.country) {
                setStates([]);
                setAllStates([]);
                return;
            }
            const country = countries.find(c => c.iso2 === data.country || c.name === data.country);
            if (country) {
                setLoadingStates(true);
                const results = await fetchStates(country.id);
                setStates(results);
                setAllStates(results);
                setLoadingStates(false);
            }
        };

        if (data.country !== prevCountryRef.current) {
            prevCountryRef.current = data.country;
            loadStates();
        } else if (data.country && states.length === 0 && !loadingStates) {
            loadStates();
        }
    }, [data.country, countries]);

    useEffect(() => {
        const loadCities = async () => {
            if (!data.state) {
                setCities([]);
                setAllCities([]);
                return;
            }
            const state = allStates.find(s => s.name === data.state);
            if (state) {
                setLoadingCities(true);
                const results = await fetchCities(state.id);
                setCities(results);
                setAllCities(results);
                setLoadingCities(false);
            }
        };

        if (data.state !== prevStateRef.current) {
            prevStateRef.current = data.state;
            loadCities();
        } else if (data.state && cities.length === 0 && !loadingCities && allStates.length > 0) {
            loadCities();
        }
    }, [data.state, allStates]);

    const handleCountryChange = (id: string | number) => {
        const selected = countries.find(c => c.id.toString() === id.toString());
        if (!selected) return;
        onFieldChange('country', selected.iso2 || selected.name);
        onFieldChange('state', '');
        onFieldChange('city', '');
    };

    const handleStateChange = (id: string | number) => {
        const selected = states.find(s => s.id.toString() === id.toString());
        if (!selected) return;
        onFieldChange('state', selected.name);
        onFieldChange('city', '');
    };

    const handleCityChange = (id: string | number) => {
        const selected = cities.find(c => c.id.toString() === id.toString());
        if (!selected) return;
        onFieldChange('city', selected.name);
    };

    const onStateSearch = async (query: string) => {
        const country = countries.find(c => c.iso2 === data.country || c.name === data.country);
        if (!country) return;
        if (!query) {
            setStates(allStates);
            return;
        }
        setLoadingStates(true);
        const results = await fetchStates(country.id, query);
        setStates(results);
        setLoadingStates(false);
    };

    const onCitySearch = async (query: string) => {
        const state = allStates.find(s => s.name === data.state);
        if (!state) return;
        if (!query) {
            setCities(allCities);
            return;
        }
        setLoadingCities(true);
        const results = await fetchCities(state.id, query);
        setCities(results);
        setLoadingCities(false);
    };

    return (
        <div className={title ? "bg-gray-50/70 rounded-xl p-3 sm:p-3.5 border border-gray-200" : ""}>
            {title && (
                <div className="flex items-center gap-2 mb-2.5 pb-2 border-b border-gray-200">
                    <Icon className="w-3.5 h-3.5 text-gray-500" />
                    <div>
                        <h3 className="text-xs sm:text-sm font-semibold text-gray-900">{title}</h3>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-2.5">
                <div className="sm:col-span-2">
                    <FormInput
                        label="Street Address"
                        value={data.street}
                        onChange={(e) => onInputChange(e, 'street')}
                        required
                        className={getError('street') ? '!border-rose-400 !ring-rose-500/10 focus:!border-rose-500' : ''}
                    />
                    {getError('street') && (
                        <p className="mt-0.5 text-[11px] text-rose-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {getError('street')}
                        </p>
                    )}
                </div>

                <div>
                    <SearchableSelect
                        label="Country"
                        value={countries.find(c => c.iso2 === data.country || c.name === data.country)?.id || ''}
                        options={countries.map(c => ({ id: c.id, name: c.name }))}
                        onChange={handleCountryChange}
                        onSearch={onCountrySearch}
                        loading={loadingCountries}
                        required
                    />
                    {getError('country') && (
                        <p className="mt-0.5 text-[11px] text-rose-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {getError('country')}
                        </p>
                    )}
                </div>

                <div>
                    <SearchableSelect
                        label="State / Province"
                        value={states.find(s => s.name === data.state)?.id || ''}
                        options={states.map(s => ({ id: s.id, name: s.name }))}
                        onChange={handleStateChange}
                        onSearch={onStateSearch}
                        loading={loadingStates}
                        disabled={!data.country}
                        required
                        placeholder={!data.country ? 'Select country first' : 'Select...'}
                    />
                    {getError('state') && (
                        <p className="mt-0.5 text-[11px] text-rose-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {getError('state')}
                        </p>
                    )}
                </div>

                <div>
                    <SearchableSelect
                        label="City"
                        value={cities.find(c => c.name === data.city)?.id || ''}
                        options={cities.map(c => ({ id: c.id, name: c.name }))}
                        onChange={handleCityChange}
                        onSearch={onCitySearch}
                        loading={loadingCities}
                        disabled={!data.state}
                        placeholder={!data.state ? 'Select state first' : 'Select...'}
                    />
                </div>

                <div>
                    <FormInput
                        label="Postal / ZIP Code"
                        value={data.postalCode}
                        onChange={(e) => onInputChange(e, 'postalCode')}
                        required
                        className={getError('postalCode') ? '!border-rose-400 !ring-rose-500/10 focus:!border-rose-500' : ''}
                    />
                    {getError('postalCode') && (
                        <p className="mt-0.5 text-[11px] text-rose-500 font-medium flex items-center gap-1">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {getError('postalCode')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
