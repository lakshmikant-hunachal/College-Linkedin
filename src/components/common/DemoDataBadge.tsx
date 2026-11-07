import React from 'react';
import { AlertTriangle, CheckCircle, Clock, Archive } from 'lucide-react';
import { VerificationStatus } from '../../types';

interface Props {
  status: VerificationStatus;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const DemoDataBadge: React.FC<Props> = ({ status, size = 'sm', showIcon = true }) => {
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3 py-1.5',
  };

  if (status === 'DEMO') {
    return (
      <span
        title="Synthetic sample generated for testing. Never represents official BMSCE placement outcomes."
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-amber-100 text-amber-900 border border-amber-300 shadow-sm ${sizeClasses[size]}`}
      >
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-amber-700" />}
        DEMO DATA
      </span>
    );
  }

  if (status === 'VERIFIED') {
    return (
      <span
        title="Officially verified by BMSCE Placement Cell"
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-sm ${sizeClasses[size]}`}
      >
        {showIcon && <CheckCircle className="w-3.5 h-3.5 text-emerald-700" />}
        VERIFIED BMSCE RECORD
      </span>
    );
  }

  if (status === 'PENDING_VERIFICATION') {
    return (
      <span
        title="Submitted / imported; awaiting explicit verification by Placement Coordinator"
        className={`inline-flex items-center gap-1 font-semibold rounded-full bg-blue-100 text-blue-900 border border-blue-300 ${sizeClasses[size]}`}
      >
        {showIcon && <Clock className="w-3.5 h-3.5 text-blue-700" />}
        PENDING VERIFICATION
      </span>
    );
  }

  if (status === 'REJECTED') {
    return (
      <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-rose-100 text-rose-900 border border-rose-300 ${sizeClasses[size]}`}>
        REJECTED
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1 font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-300 ${sizeClasses[size]}`}>
      {showIcon && <Archive className="w-3.5 h-3.5" />}
      ARCHIVED
    </span>
  );
};
