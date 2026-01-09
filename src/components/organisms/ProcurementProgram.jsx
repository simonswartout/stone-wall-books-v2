import React from 'react';
import { Info, Book } from "lucide-react";
import SectionCard from '../molecules/SectionCard';
import Pill from '../atoms/Pill';
import { useStore } from '../../contexts/StoreContext';

export default function ProcurementProgram() {
    const { data } = useStore();
    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <SectionCard
                title={data.procurementProgram.title}
                subtitle={data.procurementProgram.summary}
                icon={Info}
                right={<Pill color="amber">Split: 65% / 35%</Pill>}
            >
                <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {data.procurementProgram.steps.map((step, i) => (
                        <div key={i} className="p-5 rounded border border-emerald-900/5 bg-white shadow-sm">
                            <h4 className="font-serif font-bold text-emerald-950 mb-2">{step.title}</h4>
                            <p className="text-sm text-emerald-800/80 leading-relaxed">{step.body}</p>
                        </div>
                    ))}
                </div>

                <div className="mt-8 p-6 rounded-lg bg-emerald-900 text-amber-50">
                    <h4 className="font-serif text-lg font-bold mb-4 flex items-center gap-2">
                        <Book className="h-5 w-5" /> Policies & Terms
                    </h4>
                    <div className="grid gap-4 md:grid-cols-2">
                        {data.procurementProgram.policies.map((p, i) => (
                            <div key={i} className="border-l-2 border-amber-400 pl-4 py-1">
                                <p className="text-lg font-bold text-amber-100">{p.title}</p>
                                <p className="text-base text-emerald-100/80 mt-1 leading-relaxed">{p.body}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-6 text-sm italic text-emerald-400/60 uppercase tracking-widest">{data.procurementProgram.disclaimer}</p>
                </div>
            </SectionCard>
        </div>
    )
}
