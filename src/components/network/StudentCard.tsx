import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { UserCheck, UserPlus, Github, Linkedin, ExternalLink, Clock, MessageSquare } from 'lucide-react';
import { StudentProfile } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Props {
  student: StudentProfile;
  onViewProfile?: (student: StudentProfile) => void;
}

export const StudentCard: React.FC<Props> = ({ student, onViewProfile }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [connectionStatus, setConnectionStatus] = useState<string | null>(student.connectionStatus || null);
  const [connecting, setConnecting] = useState(false);

  const isMe = user?.id === student.id;

  const handleConnect = async () => {
    if (!user) {
      showToast('Please sign in to connect with peers', 'error');
      return;
    }

    setConnecting(true);
    try {
      const res = await api.post('/posts/network/connect', { targetUserId: student.id });
      if (res.data.success) {
        setConnectionStatus('PENDING');
        showToast(`Connection request sent to ${student.fullName}`, 'success');
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to send connection request', 'error');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200/90 shadow-sm p-4 flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all">
      <div>
        {/* Top Header & Avatar */}
        <div className="flex items-start gap-3 mb-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-navy-800 to-brand-600 text-white font-bold text-base flex items-center justify-center shrink-0 shadow-sm">
            {student.fullName?.charAt(0) || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-slate-900 truncate hover:text-brand-600 transition-colors">
              {student.fullName}
            </h4>
            <div className="text-[11px] text-slate-500 font-medium">
              {student.department} • Sem {student.currentSemester} (Batch {student.graduationYear})
            </div>
            {student.role === 'SENIOR_ALUMNI' && (
              <span className="inline-block mt-1 text-[10px] font-semibold bg-indigo-50 text-indigo-700 px-1.5 py-0.5 rounded border border-indigo-200">
                Senior Alumni
              </span>
            )}
          </div>
        </div>

        {/* Headline */}
        <p className="text-xs text-slate-600 line-clamp-2 min-h-[32px] mb-3 leading-relaxed">
          {student.headline || 'BMSCE Student & Tech Enthusiast'}
        </p>

        {/* Skills Chips */}
        {student.skills && student.skills.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {student.skills.slice(0, 4).map((skill, idx) => (
              <span
                key={idx}
                className="text-[10px] font-medium bg-slate-100 text-slate-700 px-2 py-0.5 rounded-md border border-slate-200/60"
              >
                {skill}
              </span>
            ))}
            {student.skills.length > 4 && (
              <span className="text-[10px] text-slate-400 font-medium px-1 py-0.5">
                +{student.skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 text-slate-400">
          {student.githubUrl && (
            <a
              href={student.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors"
              title="GitHub Profile"
            >
              <Github className="w-3.5 h-3.5" />
            </a>
          )}
          {student.linkedinUrl && (
            <a
              href={student.linkedinUrl}
              target="_blank"
              rel="noreferrer"
              className="p-1 hover:text-brand-600 hover:bg-brand-50 rounded transition-colors"
              title="LinkedIn Profile"
            >
              <Linkedin className="w-3.5 h-3.5" />
            </a>
          )}
        </div>

        <div className="flex items-center gap-1.5">
          {onViewProfile && (
            <button
              onClick={() => onViewProfile(student)}
              className="px-2.5 py-1 text-xs font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors flex items-center gap-1"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Profile</span>
            </button>
          )}

          {!isMe && (
            connectionStatus === 'ACCEPTED' ? (
              <div className="flex items-center gap-1.5">
                <span className="px-2 py-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 rounded-lg border border-emerald-200 flex items-center gap-1">
                  <UserCheck className="w-3 h-3" /> Connected
                </span>
                <Link
                  to={`/messages?user=${student.id}`}
                  className="px-2.5 py-1 text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 rounded-lg border border-brand-200 flex items-center gap-1 transition-colors shadow-2xs"
                  title="Open 1-to-1 chat"
                >
                  <MessageSquare className="w-3 h-3" />
                  <span>Message</span>
                </Link>
              </div>
            ) : connectionStatus === 'PENDING' ? (
              <span className="px-2.5 py-1 text-xs font-semibold text-amber-700 bg-amber-50 rounded-lg border border-amber-200 flex items-center gap-1">
                <Clock className="w-3 h-3" /> Pending
              </span>
            ) : (
              <button
                onClick={handleConnect}
                disabled={connecting}
                className="px-3 py-1 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white text-xs font-semibold rounded-lg flex items-center gap-1 transition-colors shadow-sm"
              >
                <UserPlus className="w-3 h-3" />
                <span>{connecting ? '...' : 'Connect'}</span>
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
