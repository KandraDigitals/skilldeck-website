"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Lock, CheckCircle2 } from "lucide-react";
import logo from "../../../../public/logos/mainlogo.svg";

export const RegisterHeader = () => {
    return (
        <header className="w-full border-b border-slate-200/70 bg-white/80 backdrop-blur-xl sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-12 sm:h-14 flex items-center justify-between">
                {/* Brand Logo & Back to home */}
                <div className="flex items-center gap-6">
                    <Link href="/" data-no-loader="true" className="flex items-center gap-2.5 group">
                        <Image
                            src={logo}
                            alt="SkillDeck Logo"
                            width={120}
                            height={30}
                            priority
                            className="w-24 sm:w-28 h-auto transition-transform group-hover:scale-102"
                        />
                    </Link>
                </div>

                {/* Trust Badges on Desktop */}
                <div className="hidden md:flex items-center gap-4 text-xs text-slate-500 font-medium">
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80">
                        <Lock className="w-3 h-3 text-emerald-500" />
                        <span className="text-[11px]">256-bit SSL Security</span>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80">
                        <CheckCircle2 className="w-3 h-3 text-brand-primary" />
                        <span className="text-[11px]">No Credit Card Required</span>
                    </div>
                </div>

                {/* Return to Home / Login link */}
                <div className="flex items-center gap-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-brand-primary transition-colors"
                    >
                        <ArrowLeft className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Back to website</span>
                        <span className="sm:hidden">Back</span>
                    </Link>
                </div>
            </div>
        </header>
    );
};
