import React from 'react';

const TabButton = ({ active, onClick, children, icon: Icon }) => (
    <button
        onClick={onClick}
        className={`flex items-center gap-2 px-4 py-2 font-serif text-sm transition-all duration-200 border-b-2 ${active
                ? "border-emerald-800 text-emerald-900 font-bold"
                : "border-transparent text-emerald-700/60 hover:text-emerald-800 hover:border-emerald-800/20"
            }`}
    >
        {Icon && <Icon className="h-4 w-4" />}
        {children}
    </button>
);

export default TabButton;
