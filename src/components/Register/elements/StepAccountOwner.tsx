"use client";

import React, { ChangeEvent } from "react";
import {
    AlertCircle,
    User,
    Mail,
    Phone,
    Check,
} from "lucide-react";
import { FieldErrors, FormData } from "../hooks/useRegisterForm";

interface StepAccountOwnerProps {
    formData: FormData;
    handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
    fieldErrors: FieldErrors;
    sameAsWorkEmail: boolean;
    toggleSameAsWorkEmail: (checked: boolean) => void;
}

export const StepAccountOwner: React.FC<StepAccountOwnerProps> = ({
    formData,
    handleInputChange,
    fieldErrors,
    sameAsWorkEmail,
    toggleSameAsWorkEmail,
}) => {
    const handleOwnerNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Only allow letters and spaces
        const cleanOwnerName = e.target.value.replace(/[^a-zA-Z\s]/g, "");
        handleInputChange({
            ...e,
            target: {
                ...e.target,
                name: "ownerName",
                value: cleanOwnerName,
            },
        } as unknown as ChangeEvent<HTMLInputElement>);
    };

    const isOwnerNameValid =
        formData.ownerName.trim().length >= 2 && /^[a-zA-Z\s]+$/.test(formData.ownerName);
    const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.ownerEmail);

    const ownerEmailError = fieldErrors.ownerEmail || fieldErrors.email || fieldErrors.workEmail;
    const ownerNameError = fieldErrors.ownerName || fieldErrors.fullName;
    const phoneError = fieldErrors.phoneNumber || fieldErrors.phone || fieldErrors.mobile;

    return (
        <div className="space-y-3">
            {/* Step Header */}
            <div>
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">
                        Set up your administrator account
                    </h2>
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                        Step 2 of 4
                    </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Your credentials to manage courses, tutors, learners, and invoices.
                </p>
            </div>

            <div className="space-y-2.5">
                {/* Account Owner Full Name */}
                <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                        Administrator Full Name <span className="text-rose-500 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="ownerName"
                            value={formData.ownerName}
                            onChange={handleOwnerNameChange}
                            placeholder="Sarah Jenkins"
                            className={`w-full pl-8 pr-8 py-1.5 rounded-md border text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none ${
                                ownerNameError
                                    ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                    : "border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            }`}
                            required
                        />
                        <User className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        {isOwnerNameValid && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-primary">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                        )}
                    </div>
                    {ownerNameError && (
                        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {ownerNameError}
                        </p>
                    )}
                </div>

                {/* 2-Column: Work Email & Phone Number */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Work Email */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                            Work Email <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="email"
                                name="ownerEmail"
                                value={formData.ownerEmail}
                                onChange={handleInputChange}
                                placeholder="sarah@institute.com"
                                className={`w-full pl-8 pr-8 py-1.5 rounded-md border text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none ${
                                    ownerEmailError
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                        : "border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                }`}
                                required
                            />
                            <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                            {isEmailValid && !ownerEmailError && (
                                <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-primary">
                                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                                </div>
                            )}
                        </div>
                        {ownerEmailError && (
                            <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {ownerEmailError}
                            </p>
                        )}
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                            Contact Phone <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <div className="relative">
                            <input
                                type="tel"
                                name="phoneNumber"
                                value={formData.phoneNumber}
                                onChange={handleInputChange}
                                placeholder="+1 (555) 000-0000"
                                className={`w-full pl-8 pr-3 py-1.5 rounded-md border text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none ${
                                    phoneError
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                        : "border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                }`}
                                required
                            />
                            <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {phoneError && (
                            <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {phoneError}
                            </p>
                        )}
                    </div>
                </div>

                {/* Billing Email with Sync Toggle */}
                <div className="space-y-1 pt-0.5">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-gray-700 tracking-tight">
                            Billing Email <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <label className="flex items-center gap-1.5 text-[11px] text-gray-700 font-medium cursor-pointer select-none">
                            <input
                                type="checkbox"
                                checked={sameAsWorkEmail}
                                onChange={(e) => toggleSameAsWorkEmail(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                            />
                            <span>Same as work email</span>
                        </label>
                    </div>

                    {!sameAsWorkEmail ? (
                        <div className="relative">
                            <input
                                type="email"
                                name="billingEmail"
                                value={formData.billingEmail}
                                onChange={handleInputChange}
                                placeholder="billing@institute.com"
                                className={`w-full pl-8 pr-3 py-1.5 rounded-md border text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none ${
                                    fieldErrors.billingEmail
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                        : "border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                }`}
                                required
                            />
                            <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                    ) : (
                        <div className="px-3 py-1.5 rounded-md bg-brand-primary/5 border border-brand-primary/15 text-xs text-gray-700 flex items-center justify-between">
                            <span className="truncate">{formData.ownerEmail || "Will match your work email"}</span>
                            <span className="text-[10px] font-medium text-brand-primary bg-brand-primary/10 px-1.5 py-0.5 rounded">
                                Synced
                            </span>
                        </div>
                    )}

                    {fieldErrors.billingEmail && (
                        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {fieldErrors.billingEmail}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );
};
