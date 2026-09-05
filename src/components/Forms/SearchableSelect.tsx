"use client";
import { Check, ChevronDown, Loader2 } from 'lucide-react';
import React, { useCallback, useEffect, useRef, useState } from 'react';

interface Option {
    id: number | string;
    name: string;
}

interface SearchableSelectProps {
    label: string;
    value: string | number;
    options: Option[];
    onChange: (value: string | number) => void;
    onSearch: (query: string) => void;
    placeholder?: string;
    loading?: boolean;
    disabled?: boolean;
    required?: boolean;
    className?: string;
    containerClassName?: string;
}

export const SearchableSelect: React.FC<SearchableSelectProps> = ({
    label,
    value,
    options,
    onChange,
    onSearch,
    placeholder = "Select...",
    loading = false,
    disabled = false,
    required = false,
    className = "",
    containerClassName = ""
}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [highlightedIndex, setHighlightedIndex] = useState(-1);
    const containerRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);
    const triggerRef = useRef<HTMLDivElement>(null);

    const selectedOption = options.find(opt => opt.id.toString() === value.toString());

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
                setHighlightedIndex(-1);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    // Reset highlight when options change
    useEffect(() => {
        setHighlightedIndex(-1);
    }, [options]);

    // Focus search input when dropdown opens
    useEffect(() => {
        if (isOpen && inputRef.current) {
            // Small delay to ensure the dropdown is rendered
            requestAnimationFrame(() => {
                inputRef.current?.focus();
            });
        }
    }, [isOpen]);

    // Scroll highlighted item into view
    useEffect(() => {
        if (highlightedIndex >= 0 && listRef.current) {
            const items = listRef.current.querySelectorAll('li');
            const item = items[highlightedIndex];
            if (item) {
                item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            }
        }
    }, [highlightedIndex]);

    const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);

    // Debounce Search Logic
    useEffect(() => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(() => {
            if (isOpen) {
                onSearch(searchQuery);
            }
        }, 500);

        return () => {
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, [searchQuery, isOpen]);

    const handleSelect = useCallback((option: Option) => {
        onChange(option.id);
        setIsOpen(false);
        setSearchQuery('');
        setHighlightedIndex(-1);
        // Return focus to the trigger button
        triggerRef.current?.focus();
    }, [onChange]);

    const openDropdown = useCallback(() => {
        if (!disabled) {
            setIsOpen(true);
            setHighlightedIndex(-1);
            setSearchQuery('');
        }
    }, [disabled]);

    const closeDropdown = useCallback(() => {
        setIsOpen(false);
        setHighlightedIndex(-1);
        setSearchQuery('');
    }, []);

    // Keyboard handler for the trigger button
    const handleTriggerKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'Enter':
            case ' ':
            case 'ArrowDown':
                e.preventDefault();
                openDropdown();
                break;
            case 'ArrowUp':
                e.preventDefault();
                openDropdown();
                break;
        }
    };

    // Keyboard handler for the search input inside the dropdown
    const handleSearchKeyDown = (e: React.KeyboardEvent) => {
        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIndex(prev => {
                    const next = prev + 1;
                    return next >= options.length ? 0 : next;
                });
                break;

            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIndex(prev => {
                    const next = prev - 1;
                    return next < 0 ? options.length - 1 : next;
                });
                break;

            case 'Enter':
                e.preventDefault();
                if (highlightedIndex >= 0 && highlightedIndex < options.length) {
                    handleSelect(options[highlightedIndex]);
                } else if (options.length === 1) {
                    // Auto-select if only one option
                    handleSelect(options[0]);
                }
                break;

            case 'Escape':
                e.preventDefault();
                closeDropdown();
                triggerRef.current?.focus();
                break;

            case 'Tab':
                closeDropdown();
                break;

            case 'Home':
                e.preventDefault();
                if (options.length > 0) {
                    setHighlightedIndex(0);
                }
                break;

            case 'End':
                e.preventDefault();
                if (options.length > 0) {
                    setHighlightedIndex(options.length - 1);
                }
                break;
        }
    };

    // Generate unique IDs for accessibility
    const listboxId = `listbox-${label.replace(/\s+/g, '-').toLowerCase()}`;
    const getOptionId = (index: number) => `${listboxId}-option-${index}`;

    return (
        <div className={`relative ${containerClassName}`} ref={containerRef}>
            <label className="block text-[11px] font-medium text-gray-700 mb-1 tracking-tight">
                {label} {required && <span className="text-rose-500 ml-0.5">*</span>}
            </label>

            {/* Trigger Button */}
            <div
                ref={triggerRef}
                role="combobox"
                aria-expanded={isOpen}
                aria-haspopup="listbox"
                aria-controls={isOpen ? listboxId : undefined}
                aria-activedescendant={highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
                tabIndex={disabled ? -1 : 0}
                    className={`
                    w-full px-3 py-1.5 rounded-md border bg-white 
                    transition-colors outline-none text-[13px] flex items-center justify-between cursor-pointer
                    ${isOpen ? 'border-brand-primary ring-1 ring-brand-primary' : 'border-gray-200 hover:border-gray-300'}
                    ${disabled ? 'opacity-50 cursor-not-allowed bg-gray-50' : ''}
                    ${className}
                `}
                onClick={() => {
                    if (!disabled) {
                        if (isOpen) {
                            closeDropdown();
                        } else {
                            openDropdown();
                        }
                    }
                }}
                onKeyDown={handleTriggerKeyDown}
            >
                <span className={!selectedOption ? 'text-gray-400 text-[13px]' : 'text-gray-900 font-medium text-[13px] truncate'}>
                    {selectedOption?.name || placeholder}
                </span>
                <ChevronDown className={`w-3.5 h-3.5 text-gray-400 shrink-0 transition-transform duration-150 ${isOpen ? 'rotate-180 text-brand-primary' : ''}`} />
            </div>

            {/* Dropdown */}
            {isOpen && !disabled && (
                <div
                    className="absolute z-50 mt-1 w-full bg-white rounded-lg border border-gray-200 shadow-md overflow-hidden animate-in fade-in zoom-in-95 duration-100"
                    role="presentation"
                >
                    {/* Search Input */}
                    <div className="p-1 border-b border-gray-100 bg-white">
                        <input
                            ref={inputRef}
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={handleSearchKeyDown}
                            className="w-full px-2.5 py-1 text-xs bg-gray-50 border border-gray-200 rounded-md focus:outline-none focus:border-brand-primary focus:bg-white text-gray-800 placeholder:text-gray-400 transition-colors"
                            placeholder="Type to search..."
                            role="searchbox"
                            aria-label={`Search ${label}`}
                            aria-autocomplete="list"
                            aria-controls={listboxId}
                            aria-activedescendant={highlightedIndex >= 0 ? getOptionId(highlightedIndex) : undefined}
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>

                    {/* Options List */}
                    <div className="max-h-48 overflow-y-auto scroll-smooth p-1 custom-scrollbar">
                        {loading ? (
                            <div className="flex items-center justify-center py-3 text-gray-400 text-xs gap-2">
                                <Loader2 className="w-3.5 h-3.5 animate-spin text-brand-primary" />
                                <span>Loading...</span>
                            </div>
                        ) : options.length > 0 ? (
                            <ul ref={listRef} role="listbox" id={listboxId} aria-label={label} className="space-y-0.5">
                                {options.map((option, index) => {
                                    const isSelected = option.id.toString() === value.toString();
                                    const isHighlighted = index === highlightedIndex;

                                    return (
                                        <li
                                            key={option.id}
                                            id={getOptionId(index)}
                                            role="option"
                                            aria-selected={isSelected}
                                            onClick={() => handleSelect(option)}
                                            onMouseEnter={() => setHighlightedIndex(index)}
                                            className={`
                                                px-2.5 py-1.5 rounded-md text-[13px] cursor-pointer transition-colors flex items-center justify-between
                                                ${isHighlighted
                                                    ? 'bg-gray-50 text-gray-900'
                                                    : isSelected
                                                        ? 'bg-brand-primary/10 text-brand-primary font-medium'
                                                        : 'text-gray-700 hover:bg-gray-50'
                                                }
                                            `}
                                        >
                                            <span className="truncate">{option.name}</span>
                                            {isSelected && (
                                                <Check className="w-3.5 h-3.5 text-brand-primary shrink-0 ml-1.5" />
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        ) : (
                            <div className="py-3 text-center text-gray-400 text-xs">
                                No results found
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};
