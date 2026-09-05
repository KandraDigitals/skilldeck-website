interface FormData {
    firstname?: string;
    email?: string;
    phone?: string;
    company?: string;
    message?: string;
    requirements?: string[];
    [key: string]: any;
}

export const formValidation = (data: FormData): string | null => {
    if (!data.firstname?.trim()) {
        return "Name is required";
    }

    if (!/^[a-zA-Z\s]+$/.test(data.firstname.trim())) {
        return "Name can only contain letters and spaces";
    }

    if (data.firstname.trim().length < 2) {
        return "Name must be at least 2 characters";
    }

    if (data.company && !/^[a-zA-Z_\s]+$/.test(data.company.trim())) {
        return "Company name can only contain letters, spaces, and underscores (_)";
    }

    if (!data.email?.trim()) {
        return "Email is required";
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
        return "Please enter a valid email address";
    }

    if (!data.phone?.trim()) {
        return "Phone number is required";
    }

    if (data.phone.length < 10) {
        return "Please enter a valid phone number";
    }

    return null;
};
