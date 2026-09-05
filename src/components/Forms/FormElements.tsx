import { ChevronDown } from 'lucide-react';
import React from 'react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
    containerClassName?: string;
    error?: string;
    icon?: React.ElementType;
}

export const FormInput: React.FC<FormInputProps> = ({
    label,
    containerClassName = "",
    className = "",
    error,
    icon: Icon,
    ...props
}) => (
    <div className={containerClassName}>
        <label className="block text-[11px] font-medium text-gray-700 mb-1 tracking-tight">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <div className="relative">
            {Icon && (
                <div className="absolute inset-y-0 left-0 pl-2.5 flex items-center pointer-events-none">
                    <Icon className="h-3.5 w-3.5 text-gray-400" />
                </div>
            )}
            <input
                className={`w-full ${Icon ? 'pl-8' : 'px-3'} py-1.5 rounded-md border text-[13px] text-gray-900 bg-white hover:border-gray-300 transition-colors focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
                    ${error
                        ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                        : 'border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                    } ${className}`}
                {...props}
            />
        </div>
        {error && (
            <p className="mt-0.5 text-[11px] text-rose-500 font-medium">{error}</p>
        )}
    </div>
);

interface FormTextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label: string;
    containerClassName?: string;
    error?: string;
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({
    label,
    containerClassName = "",
    className = "",
    error,
    ...props
}) => (
    <div className={containerClassName}>
        <label className="block text-[11px] font-medium text-gray-700 mb-1 tracking-tight">
            {label}
            {props.required && <span className="text-rose-500 ml-0.5">*</span>}
        </label>
        <textarea
            className={`w-full px-3 py-1.5 rounded-md border text-[13px] text-gray-900 bg-white hover:border-gray-300 transition-colors focus:outline-none disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed
                ${error
                    ? 'border-rose-400 focus:border-rose-500 focus:ring-1 focus:ring-rose-500'
                    : 'border-gray-200 focus:border-brand-primary focus:ring-1 focus:ring-brand-primary'
                } ${className}`}
            rows={3}
            {...props}
        />
        {error && (
            <p className="mt-0.5 text-[11px] text-rose-500 font-medium">{error}</p>
        )}
    </div>
);

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    label: string;
    containerClassName?: string;
}

export const FormSelect: React.FC<FormSelectProps> = ({
    label,
    children,
    containerClassName = "",
    className = "",
    ...props
}) => (
    <div className={containerClassName}>
        <label className="block text-[11px] font-medium text-gray-700 mb-1 tracking-tight">
            {label}
        </label>
        <div className="relative">
            <select
                className={`w-full px-3 py-1.5 rounded-md border border-gray-200 focus:outline-none focus:border-brand-primary focus:ring-1 focus:ring-brand-primary transition-colors text-[13px] text-gray-900 appearance-none bg-white hover:border-gray-300 disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed ${className}`}
                {...props}
            >
                {children}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400 pointer-events-none" />
        </div>
    </div>
);