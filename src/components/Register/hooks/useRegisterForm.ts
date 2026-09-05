import { useState, ChangeEvent, useCallback } from 'react';

export interface AddressData {
    street: string;
    city: string;
    state: string; // Storing Name
    postalCode: string;
    country: string; // Storing ISO2
}

export interface FormData {
    name: string;
    ownerEmail: string;
    legalName: string;
    ownerName: string;
    phoneNumber: string;
    billingEmail: string;
    address: AddressData;
    billingAddress: AddressData;
    locale: string;
    timezone: string;
    companySize: number | '';
    industry: string;
    platformProfile: {
        description: string;
        shortDescription: string;
        website: string;
        email: string;
        phoneNumber: string;
        linkedin: string;
        twitter: string;
        instagram: string;
        youtube: string;
        trainingAreas: string[];
    };
}

export type FieldErrors = Record<string, string>;

export const useRegisterForm = () => {
    // Form State
    const [formData, setFormData] = useState<FormData>({
        name: '',
        ownerEmail: '',
        legalName: '',
        ownerName: '',
        phoneNumber: '',
        billingEmail: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        },
        billingAddress: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        },
        locale: 'en',
        timezone: '',
        companySize: '',
        industry: '',
        platformProfile: {
            description: '',
            shortDescription: '',
            website: '',
            email: '',
            phoneNumber: '',
            linkedin: '',
            twitter: '',
            instagram: '',
            youtube: '',
            trainingAreas: [],
        },
    });

    const [sameAsAddress, setSameAsAddress] = useState(true);
    const [sameAsWorkEmail, setSameAsWorkEmail] = useState(true);
    const [useRegistrationContact, setUseRegistrationContact] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

    // Field error helpers
    const setFieldError = useCallback((field: string, message: string) => {
        setFieldErrors(prev => ({ ...prev, [field]: message }));
    }, []);

    const clearFieldError = useCallback((field: string) => {
        setFieldErrors(prev => {
            const next = { ...prev };
            delete next[field];
            return next;
        });
    }, []);

    const clearAllErrors = useCallback(() => {
        setFieldErrors({});
    }, []);

    // Handlers
    const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setFormData(prev => {
            const updated = { ...prev, [name]: value };
            if (name === 'ownerEmail' && sameAsWorkEmail) {
                updated.billingEmail = value;
            }
            return updated;
        });
        // Clear error for this field when user types
        if (fieldErrors[name]) {
            clearFieldError(name);
        }
        if (name === 'ownerEmail' && sameAsWorkEmail && fieldErrors.billingEmail) {
            clearFieldError('billingEmail');
        }
    };

    const toggleSameAsWorkEmail = (isChecked: boolean) => {
        setSameAsWorkEmail(isChecked);
        if (isChecked) {
            setFormData(prev => ({ ...prev, billingEmail: prev.ownerEmail }));
            clearFieldError('billingEmail');
        }
    };

    const handleAddressInputChange = (e: ChangeEvent<HTMLInputElement>, field: keyof AddressData, isBilling: boolean = false) => {
        const { value } = e.target;
        const errorKey = isBilling ? `billingAddress.${field}` : `address.${field}`;
        if (fieldErrors[errorKey]) {
            clearFieldError(errorKey);
        }

        if (isBilling) {
            setFormData(prev => ({ ...prev, billingAddress: { ...prev.billingAddress, [field]: value } }));
        } else {
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [field]: value },
                billingAddress: sameAsAddress ? { ...prev.billingAddress, [field]: value } : prev.billingAddress
            }));
        }
    };

    const toggleSameAsAddress = (isChecked: boolean) => {
        setSameAsAddress(isChecked);
        if (isChecked) {
            setFormData(prev => ({ ...prev, billingAddress: { ...prev.address } }));
            // Clear billing errors
            setFieldErrors(prev => {
                const next = { ...prev };
                Object.keys(next).forEach(key => {
                    if (key.startsWith('billingAddress.')) delete next[key];
                });
                return next;
            });
        }
    };

    const toggleUseRegistrationContact = (isChecked: boolean) => {
        setUseRegistrationContact(isChecked);
        if (isChecked) {
            setFormData(prev => ({
                ...prev,
                platformProfile: {
                    ...prev.platformProfile,
                    email: prev.ownerEmail,
                    phoneNumber: prev.phoneNumber
                }
            }));
            // Clear platform profile contact errors
            setFieldErrors(prev => {
                const next = { ...prev };
                delete next['platformProfile.email'];
                delete next['platformProfile.phoneNumber'];
                return next;
            });
        }
    };

    // Direct setters for complex logic (Location Selectors)
    const updateAddressField = (field: keyof AddressData, value: string) => {
        const errorKey = `address.${field}`;
        if (fieldErrors[errorKey]) {
            clearFieldError(errorKey);
        }
        setFormData(prev => ({
            ...prev,
            address: { ...prev.address, [field]: value },
            billingAddress: sameAsAddress ? { ...prev.billingAddress, [field]: value } : prev.billingAddress
        }));
    };

    const updateBillingField = (field: keyof AddressData, value: string) => {
        const errorKey = `billingAddress.${field}`;
        if (fieldErrors[errorKey]) {
            clearFieldError(errorKey);
        }
        setFormData(prev => ({
            ...prev,
            billingAddress: { ...prev.billingAddress, [field]: value }
        }));
    };

    const handlePlatformProfileChange = (field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            platformProfile: { ...prev.platformProfile, [field]: value }
        }));
        if (fieldErrors[`platformProfile.${field}`]) {
            clearFieldError(`platformProfile.${field}`);
        }
    };

    // Helper to update timezone
    const setTimezone = (zone: string) => {
        setFormData(prev => ({ ...prev, timezone: zone }));
    };

    return {
        formData,
        setFormData, // Exposed for flexibility if needed, but prefer specific updaters
        sameAsAddress,
        sameAsWorkEmail,
        useRegistrationContact,
        isSubmitting,
        setIsSubmitting,
        fieldErrors,
        setFieldError,
        clearFieldError,
        clearAllErrors,
        handleInputChange,
        handleAddressInputChange,
        toggleSameAsAddress,
        toggleSameAsWorkEmail,
        toggleUseRegistrationContact,
        updateAddressField,
        updateBillingField,
        handlePlatformProfileChange,
        setTimezone
    };
};
