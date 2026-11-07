import React from 'react';
import { Check, X, Clock } from 'lucide-react';
import { api } from '../../services/api';
import { useToast } from '../../context/ToastContext';

interface ConnectionRequest {
  connectionId: string;
  user: {
    id: string;
    fullName: string;
    headline?: string;
    department?: string;
    role: string;
  };
  requestedAt: string;
}

interface Props {
  requests: ConnectionRequest[];
  onActionComplete: () => void;
}

export const ConnectionRequests: React.FC<Props> = ({ requests, onActionComplete }) => {
  const { showToast } = useToast();

  const handleRespond = async (connectionId: string, action: 'ACCEPT' | 'REJECT', name: string) => {
    try {
      const res = await api.post(`/posts/network/respond/${connectionId}`, { action });
      if (res.data.success) {
        showToast(action === 'ACCEPT' ? `Connected with ${name}` : 'Request ignored', 'info');
        onActionComplete();
      }
    } catch {
      showToast('Action failed', 'error');
    }
  };

  if (!requests || requests.length === 0) return null;

  return (
    <div className="bg-white rounded-xl border border-brand-200/90 shadow-sm p-4 mb-6 bg-gradient-to-r from-blue-50/40 to-white">
      <div className="flex items-center justify-between mb-3">
        <h3 className="font-bold text-sm text-slate-900 flex items-center gap-2">
          <Clock className="w-4 h-4 text-brand-600" />
          Pending Connection Requests ({requests.length})
        </h3>
      </div>

      <div className="space-y-2">
        {requests.map((r) => (
          <div
            key={r.connectionId}
            className="flex items-center justify-between gap-3 p-3 bg-white rounded-lg border border-slate-200 shadow-xs"
          >
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-700 text-white font-bold text-xs flex items-center justify-center">
                {r.user.fullName?.charAt(0) || 'U'}
              </div>
              <div>
                <div className="font-bold text-xs text-slate-900">{r.user.fullName}</div>
                <div className="text-[11px] text-slate-500 line-clamp-1">{r.user.headline || r.user.department}</div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => handleRespond(r.connectionId, 'ACCEPT', r.user.fullName)}
                className="px-3 py-1 bg-brand-600 hover:bg-brand-500 text-white text-xs font-semibold rounded-lg flex items-center gap-1 shadow-xs transition-colors"
              >
                <Check className="w-3.5 h-3.5" /> Accept
              </button>
              <button
                onClick={() => handleRespond(r.connectionId, 'REJECT', r.user.fullName)}
                className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
                title="Ignore request"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
