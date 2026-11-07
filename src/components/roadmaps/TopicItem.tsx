import React, { useState } from 'react';
import { CheckCircle2, Circle, Clock, ExternalLink, Lightbulb, BookOpen, Code2, Rocket } from 'lucide-react';
import { RoadmapTopic } from '../../types';
import { api } from '../../services/api';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';

interface Props {
  topic: RoadmapTopic;
  onProgressChanged?: () => void;
}

export const TopicItem: React.FC<Props> = ({ topic, onProgressChanged }) => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const [completed, setCompleted] = useState(topic.isCompleted);
  const [updating, setUpdating] = useState(false);

  const toggleComplete = async () => {
    if (!user) {
      showToast('Please sign in to track your personal learning progress', 'error');
      return;
    }

    setUpdating(true);
    const newStatus = !completed;
    try {
      const res = await api.patch('/roadmaps/progress', {
        topicId: topic.id,
        completed: newStatus,
      });

      if (res.data.success) {
        setCompleted(newStatus);
        showToast(newStatus ? 'Marked as completed! Great progress.' : 'Marked as pending', 'info');
        if (onProgressChanged) onProgressChanged();
      }
    } catch {
      showToast('Failed to update progress', 'error');
    } finally {
      setUpdating(false);
    }
  };

  const getCategoryInfo = () => {
    switch (topic.category) {
      case 'ACADEMIC':
        return { label: 'Academic Subject', color: 'bg-blue-50 text-blue-700 border-blue-200', icon: BookOpen };
      case 'PROGRAMMING':
        return { label: 'Programming & DSA', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: Code2 };
      case 'DEVELOPMENT':
        return { label: 'Development & Projects', color: 'bg-purple-50 text-purple-700 border-purple-200', icon: Rocket };
      case 'CAREER_PREP':
        return { label: 'Career & Placement Prep', color: 'bg-amber-50 text-amber-700 border-amber-200', icon: Lightbulb };
      case 'ADVANCED':
        return { label: 'Advanced Topic', color: 'bg-rose-50 text-rose-700 border-rose-200', icon: Rocket };
      default:
        return { label: 'Topic', color: 'bg-slate-100 text-slate-700 border-slate-200', icon: BookOpen };
    }
  };

  const catInfo = getCategoryInfo();
  const CatIcon = catInfo.icon;

  return (
    <div
      className={`p-4 rounded-xl border transition-all ${
        completed
          ? 'bg-emerald-50/30 border-emerald-200 shadow-xs'
          : 'bg-white border-slate-200 hover:border-slate-300 shadow-xs'
      }`}
    >
      <div className="flex items-start gap-3">
        {/* Toggle checkbox */}
        <button
          onClick={toggleComplete}
          disabled={updating}
          className="mt-0.5 text-slate-400 hover:text-emerald-600 transition-colors shrink-0"
          title={completed ? 'Completed (Click to uncheck)' : 'Mark completed'}
        >
          {completed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-600 fill-emerald-50" />
          ) : (
            <Circle className="w-5 h-5 text-slate-300 hover:text-emerald-500" />
          )}
        </button>

        <div className="flex-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1.5">
            <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2 py-0.5 rounded-md border ${catInfo.color}`}>
              <CatIcon className="w-3 h-3" />
              {catInfo.label}
            </span>

            <span className="text-[11px] text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" /> ~{topic.estimatedHours} hrs
            </span>

            {topic.prerequisites && topic.prerequisites.length > 0 && topic.prerequisites[0] !== 'None' && (
              <span className="text-[11px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                Prereq: {topic.prerequisites.join(', ')}
              </span>
            )}
          </div>

          <h4 className={`text-sm font-bold ${completed ? 'text-slate-800 line-through' : 'text-slate-900'} mb-1`}>
            {topic.title}
          </h4>

          <p className="text-xs text-slate-600 leading-relaxed mb-3">{topic.description}</p>

          {/* Resources & Projects Links */}
          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
            {topic.resources && topic.resources.map((res, i) => (
              <a
                key={i}
                href={res.url}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 border border-slate-200 transition-colors font-medium text-[11px]"
              >
                <span>{res.title}</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            ))}

            {topic.projectSuggestions && topic.projectSuggestions.length > 0 && (
              <div className="w-full mt-1.5 p-2 rounded-lg bg-slate-50 border border-slate-200 text-[11px] text-slate-600 flex items-start gap-1.5">
                <Lightbulb className="w-3.5 h-3.5 text-amber-500 shrink-0 mt-0.5" />
                <span>
                  <strong>Suggested Project:</strong> {topic.projectSuggestions.join(' • ')}
                </span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
