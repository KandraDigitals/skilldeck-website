"use client";

import { ICountry } from "@/types/interface-lib";
import { Check, Gift, ShieldCheck, MapPin } from "lucide-react";
import React, { ChangeEvent } from "react";
import TurnstileWidget from "../../Forms/TurnstileWidget";
import { AddressData, FieldErrors } from "../hooks/useRegisterForm";
import { AddressForm } from "./AddressForm";

interface StepAddressSecurityProps {
    formData: {
        address: AddressData;
        billingAddress: AddressData;
        timezone: string;
    };
    sameAsAddress: boolean;
    fieldErrors: FieldErrors;

    countries: ICountry[];
    loadingCountries: boolean;

    onAddressInputChange: (e: ChangeEvent<HTMLInputElement>, field: keyof AddressData) => void;
    onBillingInputChange: (e: ChangeEvent<HTMLInputElement>, field: keyof AddressData) => void;
    updateAddressField: (field: keyof AddressData, value: string) => void;
    updateBillingField: (field: keyof AddressData, value: string) => void;
    onCountrySearch: (query: string) => void;

    onToggleSameAsAddress: (checked: boolean) => void;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;

    onTurnstileVerify: (token: string) => void;
    onTurnstileError: () => void;
    onTurnstileExpire: () => void;

    referralCode: string;
    setReferralCode: (code: string) => void;
}

export const StepAddressSecurity: React.FC<StepAddressSecurityProps> = ({
    formData,
    sameAsAddress,
    fieldErrors,
    countries,
    loadingCountries,
    onAddressInputChange,
    onBillingInputChange,
    updateAddressField,
    updateBillingField,
    onCountrySearch,
    onToggleSameAsAddress,
    onTurnstileVerify,
    onTurnstileError,
    onTurnstileExpire,
    referralCode,
    setReferralCode,
}) => {
    return (
        <div className="space-y-2.5">
            {/* Step Header */}
            <div>
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight capitalize">
                        Address & security verification
                    </h2>
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                        Step 4 of 4
                    </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Your official institute address for taxation, invoices, and anti-spam verification.
                </p>
            </div>

            <div className="space-y-2">
                {/* Headquarters Address Form */}
                <AddressForm
                    title=""
                    data={formData.address}
                    countries={countries}
                    loadingCountries={loadingCountries}
                    fieldErrors={fieldErrors}
                    errorPrefix="address"
                    onInputChange={onAddressInputChange}
                    onFieldChange={updateAddressField}
                    onCountrySearch={onCountrySearch}
                />

                {/* Billing Address Toggle */}
                <div className="pt-1.5 border-t border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer select-none text-[12px] text-gray-700 font-medium tracking-tight">
                        <input
                            type="checkbox"
                            checked={sameAsAddress}
                            onChange={(e) => onToggleSameAsAddress(e.target.checked)}
                            className="w-3.5 h-3.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                        />
                        <span>Invoicing & billing address is same as headquarters</span>
                    </label>

                    {!sameAsAddress && (
                        <div className="pt-2">
                            <AddressForm
                                title="Billing Address"
                                data={formData.billingAddress}
                                countries={countries}
                                loadingCountries={loadingCountries}
                                fieldErrors={fieldErrors}
                                errorPrefix="billingAddress"
                                onInputChange={onBillingInputChange}
                                onFieldChange={updateBillingField}
                                onCountrySearch={onCountrySearch}
                            />
                        </div>
                    )}
                </div>

                {/* Referral Code & Turnstile in compact row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1.5 border-t border-gray-100 items-center">
                    {/* Optional Referral Code */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                            Referral Code <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <input
                            type="text"
                            name="referralCode"
                            value={referralCode}
                            onChange={(e) => setReferralCode(e.target.value.toUpperCase())}
                            placeholder="e.g. PARTNER-CODE"
                            className="w-full px-3 py-1.5 rounded-md border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-[13px] font-mono uppercase text-gray-900 bg-white placeholder:text-gray-400 placeholder:normal-case transition-colors focus:outline-none"
                        />
                    </div>

                    {/* Cloudflare Turnstile Verification */}
                    <div className="flex justify-center sm:justify-end items-center">
                        <TurnstileWidget
                            className="flex justify-center items-center min-h-[65px]"
                            onVerify={onTurnstileVerify}
                            onError={onTurnstileError}
                            onExpire={onTurnstileExpire}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

