import React from 'react';

const Button = ({ children, onClick, variant = "primary", className = "", type = "button", disabled = false }) => {
    const base = "inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-serif font-bold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer";
    const variants = {
        primary: "bg-emerald-900 text-amber-50 hover:bg-emerald-800 shadow-sm",
        secondary: "border border-emerald-900/20 bg-white text-emerald-900 hover:bg-emerald-50",
        outline: "border border-emerald-900/10 text-emerald-800 hover:bg-emerald-50/50",
        danger: "bg-rose-900 text-amber-50 hover:bg-rose-800 shadow-sm",
    };
    return (
        <button type={type} onClick={onClick} className={`${base} ${variants[variant]} ${className}`} disabled={disabled}>
            {children}
        </button>
    );
};

export default Button;
