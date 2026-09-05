"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import { ChevronDown, Search, X, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export const INDUSTRY_OPTIONS = [
    "Technology & Software",
    "Education & EdTech",
    "Healthcare & Medical",
    "Finance & Banking",
    "Engineering & Manufacturing",
    "Business & Management",
    "Media & Creative Arts",
    "Consulting Services",
    "Other",
];

interface IndustrySelectProps {
    value: string;
    onChange: (industry: string) => void;
    error?: string;
}

export const IndustrySelect: React.FC<IndustrySelectProps> = ({
    value,
    onChange,
    error,
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [openUpwards, setOpenUpwards] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const dropdownRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    // Filtered industries
    const filteredIndustries = useMemo(() => {
        if (!searchQuery.trim()) return INDUSTRY_OPTIONS;
        const q = searchQuery.toLowerCase();
        return INDUSTRY_OPTIONS.filter((item) => item.toLowerCase().includes(q));
    }, [searchQuery]);

    // Check positioning on open
    const toggleDropdown = () => {
        if (!isOpen && dropdownRef.current) {
            const rect = dropdownRef.current.getBoundingClientRect();
            const spaceBelow = window.innerHeight - rect.bottom;
            const spaceAbove = rect.top;
            setOpenUpwards(spaceBelow < 240 && spaceAbove > spaceBelow);
        }
        setIsOpen((prev) => !prev);
    };

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen) {
            setHighlightedIndex(-1);
            setTimeout(() => {
                searchInputRef.current?.focus();
            }, 50);
        } else {
            setSearchQuery("");
        }
    }, [isOpen]);

    // Close on outside click
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleSelect = (industryName: string) => {
        onChange(industryName);
        setIsOpen(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (!isOpen) {
            if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
                e.preventDefault();
                toggleDropdown();
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev < filteredIndustries.length - 1 ? prev + 1 : 0
            );
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setHighlightedIndex((prev) =>
                prev > 0 ? prev - 1 : filteredIndustries.length - 1
            );
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (highlightedIndex >= 0 && highlightedIndex < filteredIndustries.length) {
                handleSelect(filteredIndustries[highlightedIndex]);
            } else if (filteredIndustries.length === 1) {
                handleSelect(filteredIndustries[0]);
            }
        } else if (e.key === "Escape") {
            e.preventDefault();
            setIsOpen(false);
        }
    };

    return (
        <div className="space-y-1 relative" ref={dropdownRef}>
            <label className="text-[11px] font-medium text-gray-700 block tracking-tight">
                Industry Domain <span className="text-rose-500 ml-0.5">*</span>
            </label>
            <div className="relative">
                <button
                    type="button"
                    onClick={toggleDropdown}
                    onKeyDown={handleKeyDown}
                    className={`w-full px-3 py-1.5 rounded-md border text-left flex items-center justify-between transition-colors cursor-pointer bg-white ${
                        isOpen
                            ? "border-brand-primary ring-1 ring-brand-primary"
                            : error
                            ? "border-rose-400 focus:border-rose-500 ring-1 ring-rose-500"
                            : "border-gray-200 hover:border-gray-300"
                    }`}
                    aria-haspopup="listbox"
                    aria-expanded={isOpen}
                >
                    <span className={`text-[13px] truncate ${value ? "text-gray-900 font-medium" : "text-gray-400"}`}>
                        {value || "Select Domain..."}
                    </span>
                    <ChevronDown
                        className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-150 ${
                            isOpen ? "rotate-180 text-brand-primary" : ""
                        }`}
                    />
                </button>

                {/* Floating Popover Menu */}
                <AnimatePresence>
                    {isOpen && (
                        <motion.div
                            initial={{ opacity: 0, y: openUpwards ? -3 : 3 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: openUpwards ? -3 : 3 }}
                            transition={{ duration: 0.1 }}
                            className={`absolute left-0 right-0 ${
                                openUpwards ? "bottom-full mb-1" : "top-full mt-1"
                            } bg-white rounded-lg border border-gray-200 shadow-md p-1 z-50 max-h-48 flex flex-col`}
                        >
                            {/* Search Filter Box */}
                            <div className="relative mb-1">
                                <Search className="w-3.5 h-3.5 absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    ref={searchInputRef}
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Search domains..."
                                    className="w-full pl-7 pr-6 py-1 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:bg-white text-gray-800 placeholder:text-gray-400 transition-colors"
                                />
                                {searchQuery && (
                                    <button
                                        type="button"
                                        onClick={() => setSearchQuery("")}
                                        className="absolute right-1.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-0.5"
                                    >
                                        <X className="w-3 h-3" />
                                    </button>
                                )}
                            </div>

                            {/* List of Industry Options */}
                            <div className="overflow-y-auto space-y-0.5 flex-1 pr-1 custom-scrollbar">
                                {filteredIndustries.length > 0 ? (
                                    filteredIndustries.map((item, idx) => {
                                        const isSelected = value === item;
                                        const isHighlighted = idx === highlightedIndex;

                                        return (
                                            <button
                                                key={item}
                                                type="button"
                                                onClick={() => handleSelect(item)}
                                                onMouseEnter={() => setHighlightedIndex(idx)}
                                                className={`w-full px-2.5 py-1.5 rounded-md text-left text-[13px] flex items-center justify-between transition-colors cursor-pointer ${
                                                    isSelected
                                                        ? "bg-brand-primary/10 text-brand-primary font-medium"
                                                        : isHighlighted
                                                        ? "bg-gray-50 text-gray-900"
                                                        : "text-gray-700 hover:bg-gray-50"
                                                }`}
                                            >
                                                <span className="truncate">{item}</span>
                                                {isSelected && (
                                                    <Check className="w-3.5 h-3.5 text-brand-primary shrink-0" />
                                                )}
                                            </button>
                                        );
                                    })
                                ) : (
                                    <div className="py-3 text-center text-xs text-gray-400">
                                        No domain found
                                    </div>
                                )}
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
            {error && (
                <p className="text-[11px] text-rose-500 font-medium flex items-center gap-1 mt-0.5">
                    {error}
                </p>
            )}
        </div>
    );
};
