"use client";

import { ICountry } from "@/types/interface-lib";
import { AnimatePresence, motion } from "framer-motion";
import { Building2, User, Globe, MapPin, ShieldAlert } from "lucide-react";
import { useSearchParams } from "next/navigation";
import React, { useEffect, useState } from "react";
import { FormNavigation } from "./elements/FormNavigation";
import { FormStepper } from "./elements/FormStepper";
import { RegistrationSuccess } from "./elements/RegistrationSuccess";
import { StepAccountOwner } from "./elements/StepAccountOwner";
import { StepAddressSecurity } from "./elements/StepAddressSecurity";
import { StepOrganization } from "./elements/StepOrganization";
import { StepPlatformProfile } from "./elements/StepPlatformProfile";
import { useFormValidation } from "./hooks/useFormValidation";
import { useLocationData } from "./hooks/useLocationData";
import { AddressData, useRegisterForm } from "./hooks/useRegisterForm";

interface RegisterFormProps {
    countries: ICountry[];
}

const STEPS = [
    { number: 1, title: "Organization", icon: Building2 },
    { number: 2, title: "Administrator", icon: User },
    { number: 3, title: "Profile", icon: Globe },
    { number: 4, title: "Address", icon: MapPin },
];

const STEP_ANIMATION = {
    enter: {
        opacity: 0,
    },
    center: {
        opacity: 1,
    },
    exit: {
        opacity: 0,
    },
};

const RegisterForm: React.FC<RegisterFormProps> = ({ countries: initialCountries }) => {
    const [currentStep, setCurrentStep] = useState(1);
    const [serverError, setServerError] = useState<string | null>(null);
    const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
    const [isSuccess, setIsSuccess] = useState(false);

    const searchParams = useSearchParams();
    const [referralCode, setReferralCode] = useState("");

    useEffect(() => {
        if (searchParams) {
            const ref = searchParams.get("ref");
            if (ref) {
                setReferralCode(ref);
            }
        }
    }, [searchParams]);

    const {
        formData,
        sameAsAddress,
        sameAsWorkEmail,
        useRegistrationContact,
        isSubmitting,
        setIsSubmitting,
        fieldErrors,
        setFieldError,
        clearAllErrors,
        handleInputChange,
        handleAddressInputChange,
        handlePlatformProfileChange,
        toggleSameAsAddress,
        toggleSameAsWorkEmail,
        toggleUseRegistrationContact,
        updateAddressField,
        updateBillingField,
        setTimezone,
    } = useRegisterForm();

    const { countries, loadingCountries, searchCountries } = useLocationData(initialCountries);

    const { validateStep, stepErrorCount } = useFormValidation({
        formData,
        sameAsAddress,
        turnstileToken,
        useRegistrationContact,
        setFieldError,
        setServerError,
        clearAllErrors,
    });

    const handleAddressFieldUpdate = (field: keyof AddressData, value: string) => {
        updateAddressField(field, value);
        if (field === "country") {
            const country = countries.find((c) => c.iso2 === value || c.name === value);
            if (country?.timezones?.[0]?.zone) {
                setTimezone(country.timezones[0].zone);
            }
        }
    };

    // ── Navigation ──

    const syncContactData = () => {
        if (useRegistrationContact) {
            handlePlatformProfileChange("email", formData.ownerEmail);
            handlePlatformProfileChange("phoneNumber", formData.phoneNumber);
        }
    };

    const nextStep = () => {
        syncContactData();
        if (validateStep(currentStep)) {
            setCurrentStep((prev) => Math.min(prev + 1, STEPS.length));
        }
    };

    const prevStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const handleStepClick = (stepNumber: number) => {
        if (stepNumber < currentStep) {
            setCurrentStep(stepNumber);
        }
    };

    // ── Submit ──

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // If on earlier steps, pressing Enter advances to next step instead of submitting
        if (currentStep < STEPS.length) {
            nextStep();
            return;
        }

        syncContactData();

        if (!validateStep(STEPS.length)) {
            return;
        }

        setIsSubmitting(true);
        setServerError(null);

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    ...formData,
                    turnstileToken,
                    referralCode: referralCode || undefined,
                }),
            });

            let result: any;
            const contentType = response.headers.get("content-type");
            if (contentType && contentType.includes("application/json")) {
                result = await response.json();
            } else {
                const text = await response.text();
                result = { message: text || `Request failed with status ${response.status}` };
            }

            if (!response.ok) {
                const errorMsg =
                    result.message ||
                    (typeof result.error === "string" ? result.error : null) ||
                    (Array.isArray(result.errors) ? result.errors.join(", ") : null) ||
                    "Registration failed. Please check your information.";

                const lowerMsg = errorMsg.toLowerCase();
                let targetStep: number | undefined;

                // 1. Process structured object errors: { errors: { email: "...", name: "..." } }
                if (result.errors && typeof result.errors === "object" && !Array.isArray(result.errors)) {
                    Object.entries(result.errors).forEach(([field, msg]) => {
                        const errString = String(msg);
                        setFieldError(field, errString);
                        if (field.toLowerCase().includes("email") || field === "ownerEmail") {
                            setFieldError("ownerEmail", errString);
                            targetStep = 2;
                        } else if (field === "name" || field === "subdomain" || field === "legalName") {
                            setFieldError(field === "subdomain" ? "name" : field, errString);
                            if (!targetStep) targetStep = 1;
                        } else if (field === "phoneNumber") {
                            setFieldError("phoneNumber", errString);
                            if (!targetStep) targetStep = 2;
                        } else if (field.includes("address") || field === "postalCode") {
                            setFieldError(field, errString);
                            if (!targetStep) targetStep = 4;
                        }
                    });
                }

                // 2. Process structured array errors: { errors: [{ field: "ownerEmail", message: "..." }] }
                if (Array.isArray(result.errors)) {
                    result.errors.forEach((errItem: any) => {
                        if (typeof errItem === "object" && errItem.field && errItem.message) {
                            setFieldError(errItem.field, errItem.message);
                            if (errItem.field.toLowerCase().includes("email")) {
                                setFieldError("ownerEmail", errItem.message);
                                targetStep = 2;
                            } else if (errItem.field === "name" || errItem.field === "subdomain" || errItem.field === "legalName") {
                                setFieldError(errItem.field === "subdomain" ? "name" : errItem.field, errItem.message);
                                if (!targetStep) targetStep = 1;
                            }
                        }
                    });
                }

                // 3. Process string error message keywords
                if (lowerMsg.includes("email")) {
                    setFieldError("ownerEmail", errorMsg);
                    if (!targetStep) targetStep = 2; // Jump to Administrator step
                } else if (
                    lowerMsg.includes("domain") ||
                    lowerMsg.includes("subdomain") ||
                    lowerMsg.includes("slug") ||
                    lowerMsg.includes("workspace")
                ) {
                    setFieldError("name", errorMsg);
                    setFieldError("subdomain", errorMsg);
                    setFieldError("domain", errorMsg);
                    if (!targetStep) targetStep = 1; // Jump to Organization step
                } else if (
                    lowerMsg.includes("legal name") ||
                    lowerMsg.includes("company") ||
                    lowerMsg.includes("organization") ||
                    lowerMsg.includes("institute")
                ) {
                    setFieldError("legalName", errorMsg);
                    if (!targetStep) targetStep = 1; // Jump to Organization step
                } else if (lowerMsg.includes("phone") || lowerMsg.includes("mobile")) {
                    setFieldError("phoneNumber", errorMsg);
                    if (!targetStep) targetStep = 2;
                } else if (lowerMsg.includes("industry")) {
                    setFieldError("industry", errorMsg);
                    if (!targetStep) targetStep = 1;
                } else if (lowerMsg.includes("turnstile") || lowerMsg.includes("captcha") || lowerMsg.includes("security")) {
                    if (!targetStep) targetStep = 4;
                }

                if (targetStep) {
                    setCurrentStep(targetStep);
                }

                throw new Error(errorMsg);
            }

            setIsSuccess(true);
            window.scrollTo({ top: 0, behavior: "smooth" });
        } catch (error) {
            console.error("Registration Error:", error);
            setServerError(error instanceof Error ? error.message : "Something went wrong during registration.");
            window.scrollTo({ top: 0, behavior: "smooth" });
        } finally {
            setIsSubmitting(false);
        }
    };

    // ── Render Success View ──
    if (isSuccess) {
        return (
            <RegistrationSuccess
                email={formData.ownerEmail}
                subdomain={formData.name}
                instituteName={formData.legalName}
                ownerName={formData.ownerName}
            />
        );
    }

    return (
        <div className="w-full max-w-2xl mx-auto flex flex-col">
            {/* Header Section */}
            <div className="text-center mb-2 sm:mb-3 px-3 sm:px-0">
                <h1 className="text-base sm:text-xl font-bold text-gray-900 tracking-tight">
                    Create Your Free Account
                </h1>
                <p className="text-[11px] sm:text-[12px] text-gray-500 mt-0.5">
                    Launch your training institute platform in minutes • No credit card required
                </p>
            </div>

            {/* Clean Mobile Card / Centered Desktop Card */}
            <div className="bg-white rounded-xl sm:rounded-2xl p-3.5 sm:p-5 border border-slate-200/80 shadow-xs sm:shadow-sm flex flex-col">
                {/* Stepper */}
                <FormStepper
                    steps={STEPS}
                    currentStep={currentStep}
                    fieldErrors={fieldErrors}
                    stepErrorCount={stepErrorCount}
                    onStepClick={handleStepClick}
                />

                <form onSubmit={handleSubmit} className="flex flex-col space-y-3 sm:space-y-4">
                    {/* Server Error Alert */}
                    {serverError && (
                        <motion.div
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="p-2 bg-rose-50 border border-rose-200 rounded-lg text-rose-700 text-xs sm:text-sm font-medium flex items-center gap-2"
                        >
                            <ShieldAlert className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500 shrink-0" />
                            <span>{serverError}</span>
                        </motion.div>
                    )}

                    {/* Step Panes with Stable Container to prevent layout shift */}
                    <div className="min-h-0 sm:min-h-[285px]">
                        <AnimatePresence mode="wait" initial={false}>
                            <motion.div
                                key={currentStep}
                                variants={STEP_ANIMATION}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={{ duration: 0.12, ease: "easeOut" }}
                            >
                                {currentStep === 1 && (
                                    <StepOrganization
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        fieldErrors={fieldErrors}
                                    />
                                )}

                                {currentStep === 2 && (
                                    <StepAccountOwner
                                        formData={formData}
                                        handleInputChange={handleInputChange}
                                        fieldErrors={fieldErrors}
                                        sameAsWorkEmail={sameAsWorkEmail}
                                        toggleSameAsWorkEmail={toggleSameAsWorkEmail}
                                    />
                                )}

                                {currentStep === 3 && (
                                    <StepPlatformProfile
                                        platformProfile={formData.platformProfile}
                                        useRegistrationContact={useRegistrationContact}
                                        fieldErrors={fieldErrors}
                                        onChange={handlePlatformProfileChange}
                                        onToggleUseRegistrationContact={toggleUseRegistrationContact}
                                    />
                                )}

                                {currentStep === 4 && (
                                    <StepAddressSecurity
                                        formData={formData}
                                        sameAsAddress={sameAsAddress}
                                        fieldErrors={fieldErrors}
                                        countries={countries}
                                        loadingCountries={loadingCountries}
                                        onAddressInputChange={(e, field) =>
                                            handleAddressInputChange(e, field, false)
                                        }
                                        onBillingInputChange={(e, field) =>
                                            handleAddressInputChange(e, field, true)
                                        }
                                        updateAddressField={handleAddressFieldUpdate}
                                        updateBillingField={updateBillingField}
                                        onCountrySearch={searchCountries}
                                        onToggleSameAsAddress={toggleSameAsAddress}
                                        handleInputChange={handleInputChange}
                                        onTurnstileVerify={(token) => setTurnstileToken(token)}
                                        onTurnstileError={() => setTurnstileToken(null)}
                                        onTurnstileExpire={() => setTurnstileToken(null)}
                                        referralCode={referralCode}
                                        setReferralCode={setReferralCode}
                                    />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* Step Navigation */}
                    <FormNavigation
                        currentStep={currentStep}
                        totalSteps={STEPS.length}
                        isSubmitting={isSubmitting}
                        onNext={nextStep}
                        onPrev={prevStep}
                    />
                </form>
            </div>
        </div>
    );
};

export default RegisterForm;
