type FormProps = {
    children?: React.ReactNode;
    onSubmit?: (e: React.FormEvent<HTMLFormElement>) => void;
}

export default function Form({ children, onSubmit }: FormProps) {

    return(
        <form className="w-full max-w-sm" onSubmit={onSubmit}>
            {children}
        </form>
    )
}