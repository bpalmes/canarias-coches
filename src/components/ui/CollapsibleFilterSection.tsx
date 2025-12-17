"use client";
import { useState, ReactNode } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

interface CollapsibleFilterSectionProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  defaultOpen?: boolean;
}

export const CollapsibleFilterSection = ({ title, icon, children, defaultOpen = false }: CollapsibleFilterSectionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-gray-200 py-4">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center text-left"
      >
        <div className="flex items-center gap-3">
          {icon}
          <span className="font-semibold text-gray-800">{title}</span>
        </div>
        {isOpen ? <ChevronUp className="h-5 w-5 text-gray-600" /> : <ChevronDown className="h-5 w-5 text-gray-600" />}
      </button>
      {isOpen && (
        <div className="mt-4 pl-8">
          {children}
        </div>
      )}
    </div>
  );
};
