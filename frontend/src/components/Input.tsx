type InputProps = {
    value: string;
    type?: string;
    required?: boolean;
    className?: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function Input({ value, type, required, className, placeholder, onChange }: InputProps) {

    return (
        <input
            className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${className ?? ''}`}
            type={type ?? "text"}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
        />
    );
}