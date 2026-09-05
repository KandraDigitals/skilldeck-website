"use client";

import React, { useState } from "react";
import {
    Mail,
    Sparkles,
    ExternalLink,
    Copy,
    Globe,
    LifeBuoy,
    Check
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

interface RegistrationSuccessProps {
    email: string;
    subdomain?: string;
    instituteName?: string;
    ownerName?: string;
}

export const RegistrationSuccess: React.FC<RegistrationSuccessProps> = ({
    email,
    subdomain,
    instituteName,
    ownerName,
}) => {
    const [copied, setCopied] = useState(false);

    const cleanSlug = subdomain
        ? subdomain.toLowerCase().replace(/[^a-z0-9-]/g, "")
        : "";
    const workspaceUrl = cleanSlug
        ? `https://${cleanSlug}.skilldeck.net`
        : "https://skilldeck.net/login";

    const handleCopyUrl = () => {
        if (!cleanSlug) return;
        navigator.clipboard.writeText(workspaceUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="w-full max-w-lg mx-auto bg-white rounded-xl sm:rounded-2xl border border-slate-200/80 shadow-sm p-4 sm:p-6 text-left space-y-4"
        >
            {/* Compact Header */}
            <div className="flex items-start justify-between gap-3 pb-3.5 border-b border-gray-100">
                <div>
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/60 text-[10px] font-medium mb-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        <span>Workspace Live & Provisioned</span>
                    </div>
                    <h1 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">
                        {ownerName ? `Welcome aboard, ${ownerName}!` : "Welcome to SkillDeck!"}
                    </h1>
                    <p className="text-[11px] sm:text-xs text-gray-500 mt-0.5">
                        {instituteName ? (
                            <>
                                <strong className="text-gray-800 font-medium">{instituteName}</strong> has been configured with full platform access.
                            </>
                        ) : (
                            "Your institute workspace has been configured with full platform access."
                        )}
                    </p>
                </div>
                <div className="w-8 h-8 rounded-lg bg-brand-primary/10 flex items-center justify-center text-brand-primary shrink-0 mt-1">
                    <Sparkles className="w-4 h-4 text-brand-primary" />
                </div>
            </div>

            {/* Workspace Information Card */}
            <div className="bg-gray-50/80 rounded-lg border border-gray-200/80 p-3 space-y-2.5">
                {/* Domain */}
                {cleanSlug && (
                    <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-md border border-gray-200/70">
                        <div className="flex items-center gap-2 min-w-0">
                            <Globe className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                            <div className="min-w-0">
                                <div className="text-[10px] text-gray-400 font-medium">Workspace Domain</div>
                                <div className="text-[12px] font-mono font-semibold text-gray-900 truncate">
                                    {workspaceUrl}
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                            <button
                                type="button"
                                onClick={handleCopyUrl}
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-gray-600 hover:text-gray-900 bg-gray-100 hover:bg-gray-200/70 transition-colors cursor-pointer"
                                title="Copy URL"
                            >
                                {copied ? (
                                    <>
                                        <Check className="w-3 h-3 text-emerald-600" />
                                        <span className="text-emerald-700">Copied</span>
                                    </>
                                ) : (
                                    <>
                                        <Copy className="w-3 h-3 text-gray-500" />
                                        <span>Copy</span>
                                    </>
                                )}
                            </button>
                            <a
                                href={workspaceUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium text-brand-primary bg-brand-primary/10 hover:bg-brand-primary/20 transition-colors cursor-pointer"
                            >
                                <span>Visit</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                        </div>
                    </div>
                )}

                {/* Admin Credentials Note */}
                <div className="flex items-center justify-between gap-2 p-2 bg-white rounded-md border border-gray-200/70">
                    <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                        <div className="min-w-0">
                            <div className="text-[10px] text-gray-400 font-medium">Administrator Email</div>
                            <div className="text-[12px] font-medium text-gray-900 truncate">
                                {email}
                            </div>
                        </div>
                    </div>
                    <span className="text-[10px] font-medium bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full shrink-0">
                        Credentials Sent
                    </span>
                </div>
            </div>

            {/* Next Steps Checklist */}
            <div className="space-y-1.5">
                <div className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                    Quick-Start Checklist
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="p-2 bg-white rounded-md border border-gray-200/70 flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            1
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-gray-900">Check Email</div>
                            <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                                Access your verification & initial login link.
                            </div>
                        </div>
                    </div>

                    <div className="p-2 bg-white rounded-md border border-gray-200/70 flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            2
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-gray-900">Brand Portal</div>
                            <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                                Configure logo, theme & website pages.
                            </div>
                        </div>
                    </div>

                    <div className="p-2 bg-white rounded-md border border-gray-200/70 flex items-start gap-2">
                        <div className="w-4 h-4 rounded-full bg-brand-primary/10 text-brand-primary text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                            3
                        </div>
                        <div>
                            <div className="text-[11px] font-semibold text-gray-900">Publish Courses</div>
                            <div className="text-[10px] text-gray-500 mt-0.5 leading-snug">
                                Add schedules & start enrolling students.
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Action CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-2 pt-2 border-t border-gray-100">
                <Link
                    href="/"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-3 py-1.5 rounded-md border border-gray-200 hover:border-gray-300 text-[12px] font-medium text-gray-700 hover:text-gray-900 bg-white hover:bg-gray-50 transition-colors cursor-pointer order-2 sm:order-1"
                >
                    <span>Back to Website</span>
                </Link>

                <a
                    href={workspaceUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-md bg-brand-primary hover:bg-brand-primary/90 text-white text-[12px] font-medium shadow-xs transition-colors cursor-pointer order-1 sm:order-2"
                >
                    <span>Launch Admin Workspace</span>
                    <ExternalLink className="w-3 h-3" />
                </a>
            </div>

            {/* Footer Support */}
            <div className="text-center pt-1 text-[10px] text-gray-400 flex items-center justify-center gap-1">
                <LifeBuoy className="w-3 h-3 text-gray-400" />
                <span>Need help? Contact onboarding support at <strong className="text-gray-600 font-medium">support@skilldeck.net</strong></span>
            </div>
        </motion.div>
    );
};
