"use client";

import React, { ChangeEvent } from "react";
import { AlertCircle, Globe, Check } from "lucide-react";
import { FieldErrors, FormData } from "../hooks/useRegisterForm";
import { IndustrySelect } from "./IndustrySelect";

const TEAM_SIZE_PRESETS = [
    { label: "1 - 5", value: 5 },
    { label: "6 - 20", value: 20 },
    { label: "21 - 50", value: 50 },
    { label: "50 - 200", value: 100 },
    { label: "200+", value: 250 },
];

interface StepOrganizationProps {
    formData: FormData;
    handleInputChange: (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    fieldErrors: FieldErrors;
}

export const StepOrganization: React.FC<StepOrganizationProps> = ({
    formData,
    handleInputChange,
    fieldErrors,
}) => {
    const generateSlug = (name: string) => {
        return name
            .toLowerCase()
            .replace(/[^a-z0-9]/g, "-")
            .replace(/-+/g, "-")
            .replace(/^-|-$/g, "");
    };

    const handleLegalNameChange = (e: ChangeEvent<HTMLInputElement>) => {
        // Only allow letters, spaces, and underscores (_) - no numbers or other special characters
        const cleanName = e.target.value.replace(/[^a-zA-Z_\s]/g, "");

        // Update legalName
        handleInputChange({
            ...e,
            target: {
                ...e.target,
                name: "legalName",
                value: cleanName,
            },
        } as unknown as ChangeEvent<HTMLInputElement>);

        // Automatically generate baseSlug for subdomain
        const baseSlug = cleanName
            .trim()
            .toLowerCase()
            .replace(/\b(pvt|private|ltd|limited|inc|corp|co|company|solutions|technology|technologies|group)\b/g, "")
            .replace(/[_]+/g, "-")
            .replace(/\s+/g, " ")
            .trim()
            .replace(/[^a-z0-9]+/g, "-")
            .replace(/^-+|-+$/g, "");

        const syntheticEvent = {
            target: {
                name: "name",
                value: baseSlug,
            },
        } as unknown as ChangeEvent<HTMLInputElement>;

        handleInputChange(syntheticEvent);
    };

    const handleSubdomainChange = (e: ChangeEvent<HTMLInputElement>) => {
        const cleanSubdomain = e.target.value
            .toLowerCase()
            .replace(/[^a-z0-9-]/g, "")
            .replace(/^-+/g, "");

        handleInputChange({
            ...e,
            target: {
                ...e.target,
                name: "name",
                value: cleanSubdomain,
            },
        } as unknown as ChangeEvent<HTMLInputElement>);
    };

    const handleIndustrySelect = (industryName: string) => {
        handleInputChange({
            target: {
                name: "industry",
                value: industryName,
            },
        } as unknown as ChangeEvent<HTMLInputElement>);
    };

    const handleTeamSizeSelect = (val: number) => {
        handleInputChange({
            target: {
                name: "companySize",
                value: val,
            },
        } as unknown as ChangeEvent<HTMLInputElement>);
    };

    const isLegalNameValid =
        formData.legalName.trim().length >= 2 && /^[a-zA-Z_\s]+$/.test(formData.legalName);

    const subdomainError =
        fieldErrors.name || fieldErrors.subdomain || fieldErrors.domain || fieldErrors.adminDomain;
    const legalNameError =
        fieldErrors.legalName || fieldErrors.companyName || fieldErrors.organizationName;

    return (
        <div className="space-y-3">
            {/* Step Header */}
            <div>
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight">
                        Tell us about your organization
                    </h2>
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                        Step 1 of 4
                    </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Enter your registered training institute name and workspace domain.
                </p>
            </div>

            <div className="space-y-2.5">
                {/* Registered Company Name */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-gray-700 tracking-tight">
                            Registered Company / Institute Name <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400">Letters, spaces & _ only</span>
                    </div>
                    <div className="relative">
                        <input
                            type="text"
                            name="legalName"
                            value={formData.legalName}
                            onChange={handleLegalNameChange}
                            placeholder="e.g. Acme_Technologies"
                            className={`w-full px-3 py-1.5 rounded-md border text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none ${legalNameError
                                    ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                    : "border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                }`}
                            required
                        />
                        {isLegalNameValid && (
                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2 text-brand-primary">
                                <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                            </div>
                        )}
                    </div>
                    {legalNameError && (
                        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {legalNameError}
                        </p>
                    )}
                </div>

                {/* Dashboard Subdomain */}
                <div className="space-y-1">
                    <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                        Institute Subdomain <span className="text-rose-500 ml-0.5">*</span>
                    </label>
                    <div className="relative">
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleSubdomainChange}
                            placeholder="acme"
                            className={`w-full pl-3 pr-28 py-1.5 rounded-md border text-[13px] font-mono text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none ${subdomainError
                                    ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                    : "border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                }`}
                            required
                        />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 px-1.5 py-0.5 bg-brand-primary/10 rounded text-[10px] font-mono text-brand-primary font-medium pointer-events-none">
                            .skilldeck.net
                        </div>
                    </div>
                    {formData.name && !subdomainError && (
                        <div className="px-2.5 py-1 bg-brand-primary/5 rounded-md border border-brand-primary/20 flex items-center gap-1.5 text-[11px] text-gray-700">
                            <Globe className="w-3 h-3 text-brand-primary shrink-0" />
                            <span className="truncate">
                                Live Workspace URL: <strong className="text-brand-primary">https://{generateSlug(formData.name)}.skilldeck.net</strong>
                            </span>
                        </div>
                    )}
                    {subdomainError && (
                        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3 h-3 shrink-0" />
                            {subdomainError}
                        </p>
                    )}
                </div>

                {/* Industry Domain & Team Size Side-by-Side */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-start">
                    {/* Modular Industry Select Dropdown */}
                    <IndustrySelect
                        value={formData.industry}
                        onChange={handleIndustrySelect}
                        error={fieldErrors.industry}
                    />

                    {/* Team Size Selector */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                            Team Size <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <div className="grid grid-cols-5 gap-1">
                            {TEAM_SIZE_PRESETS.map((preset) => {
                                const isSelected = Number(formData.companySize) === preset.value;
                                return (
                                    <button
                                        key={preset.label}
                                        type="button"
                                        onClick={() => handleTeamSizeSelect(preset.value)}
                                        className={`py-1.5 px-1 rounded-md text-center transition-colors cursor-pointer border text-xs font-medium ${isSelected
                                                ? "bg-brand-primary text-white border-brand-primary font-medium shadow-xs"
                                                : "bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300"
                                            }`}
                                    >
                                        <span className="block truncate text-[11px]">{preset.label}</span>
                                    </button>
                                );
                            })}
                        </div>
                        {fieldErrors.companySize && (
                            <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                                <AlertCircle className="w-3 h-3 shrink-0" />
                                {fieldErrors.companySize}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};
