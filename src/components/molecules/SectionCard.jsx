import React from 'react';

const SectionCard = ({ title, subtitle, children, right, icon: Icon }) => (
    <div className="overflow-hidden rounded-lg border border-emerald-900/10 bg-[#fdfcf8] shadow-sm transition-shadow hover:shadow-md">
        <div className="flex items-center justify-between border-b border-emerald-900/5 bg-emerald-50/30 px-6 py-4">
            <div className="flex items-center gap-3">
                {Icon && <Icon className="h-5 w-5 text-emerald-800" />}
                <div>
                    <h3 className="font-serif text-lg font-bold text-emerald-950 uppercase tracking-tight">{title}</h3>
                    {subtitle && <p className="font-serif italic text-sm text-emerald-800/60">{subtitle}</p>}
                </div>
            </div>
            {right && <div>{right}</div>}
        </div>
        <div className="px-6 py-5">{children}</div>
    </div>
);

export default SectionCard;
