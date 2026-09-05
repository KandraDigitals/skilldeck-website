"use client";

import React from "react";
import {
    Globe,
    Users,
    Mail,
    Phone,
    AlertCircle,
    Check,
} from "lucide-react";
import { FieldErrors } from "../hooks/useRegisterForm";

interface StepPlatformProfileProps {
    platformProfile: {
        description: string;
        shortDescription: string;
        website: string;
        email: string;
        phoneNumber: string;
    };
    useRegistrationContact: boolean;
    fieldErrors: FieldErrors;
    onChange: (field: string, value: any) => void;
    onToggleUseRegistrationContact: (checked: boolean) => void;
}

export const StepPlatformProfile: React.FC<StepPlatformProfileProps> = ({
    platformProfile,
    useRegistrationContact,
    fieldErrors,
    onChange,
    onToggleUseRegistrationContact,
}) => {
    return (
        <div className="space-y-3">
            {/* Step Header */}
            <div>
                <div className="flex items-center justify-between gap-2">
                    <h2 className="text-sm sm:text-base font-semibold text-gray-900 tracking-tight capitalize">
                        Marketplace & public profile
                    </h2>
                    <span className="text-[10px] sm:text-[11px] font-medium text-gray-500 bg-gray-100 px-1.5 sm:px-2 py-0.5 rounded shrink-0">
                        Step 3 of 4
                    </span>
                </div>
                <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                    Information displayed on your public website and marketplace listing.
                </p>
            </div>

            <div className="space-y-2.5">
                {/* Institute Description */}
                <div className="space-y-1">
                    <div className="flex items-center justify-between">
                        <label className="text-[11px] font-medium text-gray-700 tracking-tight">
                            Institute Description <span className="text-rose-500 ml-0.5">*</span>
                        </label>
                        <span className="text-[10px] text-gray-400">
                            {platformProfile.description?.length || 0} chars
                        </span>
                    </div>
                    <textarea
                        name="description"
                        value={platformProfile.description}
                        onChange={(e) => onChange("description", e.target.value)}
                        rows={2}
                        placeholder="Tell learners and partners about your courses, curriculum, and placement track record..."
                        className={`w-full p-2.5 rounded-md border text-[13px] text-gray-900 bg-white placeholder:text-gray-400 resize-none transition-colors focus:outline-none ${fieldErrors["platformProfile.description"]
                                ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                : "border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                            }`}
                        required
                    />
                    {fieldErrors["platformProfile.description"] && (
                        <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                            <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                            {fieldErrors["platformProfile.description"]}
                        </p>
                    )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {/* Short Description */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                            Short Tagline
                        </label>
                        <input
                            type="text"
                            name="shortDescription"
                            value={platformProfile.shortDescription}
                            onChange={(e) => onChange("shortDescription", e.target.value)}
                            placeholder="e.g. Leading Semiconductor Academy"
                            className="w-full px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none"
                        />
                    </div>

                    {/* Website */}
                    <div className="space-y-1">
                        <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                            Website <span className="text-gray-400 font-normal">(Optional)</span>
                        </label>
                        <div className="relative">
                            <input
                                type="url"
                                name="website"
                                value={platformProfile.website}
                                onChange={(e) => onChange("website", e.target.value)}
                                placeholder="https://your-institute.com"
                                className={`w-full pl-8 pr-3 py-1.5 rounded-md border text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none ${fieldErrors["platformProfile.website"]
                                        ? "border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500"
                                        : "border-gray-200 hover:border-gray-300 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary"
                                    }`}
                            />
                            <Globe className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                        </div>
                        {fieldErrors["platformProfile.website"] && (
                            <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                                <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                                {fieldErrors["platformProfile.website"]}
                            </p>
                        )}
                    </div>
                </div>

                {/* Public Contact Sync Switch */}
                <div className="pt-1 border-t border-gray-100 space-y-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-[11px] font-medium text-gray-800 tracking-tight">
                                Public Support Contact
                            </p>
                        </div>
                        <label className="flex items-center gap-1.5 cursor-pointer select-none text-[11px] text-gray-700 font-medium">
                            <input
                                type="checkbox"
                                checked={useRegistrationContact}
                                onChange={(e) => onToggleUseRegistrationContact(e.target.checked)}
                                className="w-3.5 h-3.5 rounded border-gray-300 text-brand-primary focus:ring-brand-primary cursor-pointer"
                            />
                            <span>Same as Administrator</span>
                        </label>
                    </div>

                    {useRegistrationContact ? (
                        <div className="flex items-center gap-1.5 text-xs text-gray-600 bg-gray-50 border border-gray-200 rounded-md px-3 py-1.5">
                            <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                            <span>Public support contact will automatically match your administrator details.</span>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0.5">
                            <div className="space-y-1">
                                <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                                    Support Email <span className="text-rose-500 ml-0.5">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="email"
                                        value={platformProfile.email}
                                        onChange={(e) => onChange("email", e.target.value)}
                                        placeholder="support@institute.com"
                                        className="w-full pl-8 pr-3 py-1.5 rounded-md border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none"
                                        required
                                    />
                                    <Mail className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                                    Support Phone <span className="text-rose-500 ml-0.5">*</span>
                                </label>
                                <div className="relative">
                                    <input
                                        type="tel"
                                        value={platformProfile.phoneNumber}
                                        onChange={(e) => onChange("phoneNumber", e.target.value)}
                                        placeholder="+1 800 123 4567"
                                        className="w-full pl-8 pr-3 py-1.5 rounded-md border border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary text-[13px] text-gray-900 bg-white placeholder:text-gray-400 transition-colors focus:outline-none"
                                        required
                                    />
                                    <Phone className="w-3.5 h-3.5 text-gray-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
