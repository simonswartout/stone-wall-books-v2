import React from 'react';

const getColorClasses = (color) => {
    const map = {
        emerald: "border-emerald-200 bg-emerald-50 text-emerald-800",
        amber: "border-amber-200 bg-amber-50 text-amber-800",
    };
    return map[color] || map.emerald;
}

const Pill = ({ children, color = "emerald" }) => (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-medium tracking-wide uppercase border ${getColorClasses(color)}`}>
        {children}
    </span>
);

export default Pill;
