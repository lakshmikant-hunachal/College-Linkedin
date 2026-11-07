import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Users, Filter, Search, UserCheck, GraduationCap, X, ExternalLink, Github, Linkedin, MessageSquare } from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { StudentProfile } from '../types';
import { StudentCard } from '../components/network/StudentCard';
import { ConnectionRequests } from '../components/network/ConnectionRequests';

export const NetworkPage: React.FC = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'ALL' | 'SENIORS' | 'CONNECTIONS'>('ALL');
  const [students, setStudents] = useState<StudentProfile[]>([]);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedStudent, setSelectedStudent] = useState<StudentProfile | null>(null);

  // Filters
  const [search, setSearch] = useState('');
  const [department, setDepartment] = useState('ALL');
  const [semester, setSemester] = useState('ALL');

  const fetchNetworkData = async () => {
    setLoading(true);
    try {
      // 1. Fetch pending requests if authenticated
      if (user) {
        const connRes = await api.get('/posts/network/connections');
        if (connRes.data.success) {
          setPendingRequests(connRes.data.data.pendingReceived || []);
        }
      }

      // 2. Fetch students directory
      const params: any = {};
      if (activeTab === 'SENIORS') {
        params.role = 'SENIOR_ALUMNI';
      }
      if (department !== 'ALL') {
        params.department = department;
      }
      if (semester !== 'ALL') {
        params.semester = semester;
      }
      if (search.trim()) {
        params.search = search.trim();
      }

      const res = await api.get('/students', { params });
      if (res.data.success) {
        setStudents(res.data.data);
      }
    } catch {
      // Ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkData();
  }, [activeTab, department, semester]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchNetworkData();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title & Stats */}
      <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
            <Users className="w-7 h-7 text-brand-600" />
            BMSCE Student & Alumni Network
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Connect exclusively with classmates, departmental peers, and alumni working in top engineering roles.
          </p>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1.5 bg-slate-200/70 p-1 rounded-xl text-xs font-semibold">
          <button
            onClick={() => setActiveTab('ALL')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'ALL' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            All Students
          </button>
          <button
            onClick={() => setActiveTab('SENIORS')}
            className={`px-3 py-1.5 rounded-lg transition-all ${
              activeTab === 'SENIORS' ? 'bg-white text-indigo-700 shadow-xs' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            Seniors & Alumni
          </button>
        </div>
      </div>

      {/* Pending Connection Requests Widget */}
      <ConnectionRequests
        requests={pendingRequests}
        onActionComplete={fetchNetworkData}
      />

      {/* Filters Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm mb-6 space-y-3">
        <div className="flex flex-col md:flex-row items-center gap-3">
          <form onSubmit={handleSearchSubmit} className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3 pointer-events-none" />
            <input
              type="text"
              placeholder="Search by student name, headline, or technical skill..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500 bg-slate-50"
            />
          </form>

          {/* Department Filter */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <select
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
              className="w-full md:w-48 text-xs p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500 bg-slate-50 font-medium"
            >
              <option value="ALL">All Departments</option>
              <option value="CSE">Computer Science (CSE)</option>
              <option value="ISE">Information Science (ISE)</option>
              <option value="ECE">Electronics & Comm (ECE)</option>
              <option value="EEE">Electrical & Electronics (EEE)</option>
              <option value="AI_ML">AI & Machine Learning</option>
              <option value="DATA_SCIENCE">Data Science</option>
              <option value="MECH">Mechanical Engg</option>
              <option value="CIVIL">Civil Engg</option>
            </select>

            {/* Semester Filter */}
            <select
              value={semester}
              onChange={(e) => setSemester(e.target.value)}
              className="w-full md:w-36 text-xs p-2 rounded-xl border border-slate-200 focus:ring-1 focus:ring-brand-500 bg-slate-50 font-medium"
            >
              <option value="ALL">All Semesters</option>
              {[1, 2, 3, 4, 5, 6, 7, 8].map((s) => (
                <option key={s} value={s}>
                  Semester {s}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Directory Grid */}
      {loading ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center text-xs text-slate-400">
          Loading BMSCE network directory...
        </div>
      ) : students.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-2">
          <GraduationCap className="w-10 h-10 text-slate-300 mx-auto" />
          <h3 className="font-bold text-sm text-slate-800">No students found matching your filters</h3>
          <p className="text-xs text-slate-500">Try clearing the search query or department dropdown.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {students.map((student) => (
            <StudentCard
              key={student.id}
              student={student}
              onViewProfile={(st) => setSelectedStudent(st)}
            />
          ))}
        </div>
      )}

      {/* Student Profile Quick View Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-navy-950/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 animate-scale-up max-h-[90vh] overflow-y-auto text-xs space-y-4">
            <div className="flex items-start justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 text-white font-extrabold text-lg flex items-center justify-center">
                  {selectedStudent.fullName.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">{selectedStudent.fullName}</h3>
                  <p className="text-slate-500 font-medium">
                    {selectedStudent.department} • Semester {selectedStudent.currentSemester} (Batch {selectedStudent.graduationYear})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedStudent(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-lg hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {selectedStudent.headline && (
              <p className="font-medium text-slate-800 bg-slate-50 p-2.5 rounded-lg border border-slate-200">
                {selectedStudent.headline}
              </p>
            )}

            {selectedStudent.bio && (
              <div>
                <span className="font-bold text-slate-700 block mb-1">Introduction</span>
                <p className="text-slate-600 leading-relaxed">{selectedStudent.bio}</p>
              </div>
            )}

            {selectedStudent.skills && selectedStudent.skills.length > 0 && (
              <div>
                <span className="font-bold text-slate-700 block mb-1.5">Technical Skills</span>
                <div className="flex flex-wrap gap-1">
                  {selectedStudent.skills.map((skill, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-800 font-semibold border border-blue-200">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {selectedStudent.areasOfInterest && selectedStudent.areasOfInterest.length > 0 && (
              <div>
                <span className="font-bold text-slate-700 block mb-1.5">Areas of Interest</span>
                <div className="flex flex-wrap gap-1">
                  {selectedStudent.areasOfInterest.map((interest, idx) => (
                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 font-medium border border-slate-200">
                      {interest}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                {selectedStudent.githubUrl && (
                  <a
                    href={selectedStudent.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-slate-700 font-semibold hover:text-black"
                  >
                    <Github className="w-4 h-4" /> GitHub
                  </a>
                )}
                {selectedStudent.linkedinUrl && (
                  <a
                    href={selectedStudent.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-brand-600 font-semibold hover:text-brand-700"
                  >
                    <Linkedin className="w-4 h-4" /> LinkedIn
                  </a>
                )}
              </div>

              <div className="flex items-center gap-2">
                {selectedStudent.connectionStatus === 'ACCEPTED' && (
                  <Link
                    to={`/messages?user=${selectedStudent.id}`}
                    className="px-3 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-semibold rounded-lg text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </Link>
                )}
                <button
                  onClick={() => setSelectedStudent(null)}
                  className="px-4 py-1.5 bg-slate-900 text-white font-semibold rounded-lg hover:bg-slate-800"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
