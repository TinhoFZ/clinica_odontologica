import { Link } from "react-router-dom";

type BaseProps = {
    text: string;
    className?: string;
}

type RegularButtonProps = {
    link?: false;
    route?: never;
    onClick?: React.MouseEventHandler<HTMLButtonElement>;
    disabled?: boolean;
}

type LinkButtonProps = {
    link: true;
    route: string;
}

type ButtonProps = BaseProps & (LinkButtonProps | RegularButtonProps);

export default function Button(props: ButtonProps) {

    const baseClasses = 'inline-block py-2 px-4 rounded-xl bg-accent text-snow font-semibold hover:brightness-110 active:brightness-90 transition';    

    if(props.link) {
        return(
            <Link 
                to={props.route} 
                className={`${baseClasses} ${props.className ?? ''}`}
            >
                {props.text}
            </Link>
            )
    } else {
        return(
            <button 
                onClick={props.onClick}
                disabled={props.disabled}
                className={`disabled:cursor-not-allowed ${baseClasses} ${props.className ?? ''}`}
            >
                {props.text}
            </button>
        )
    }
}