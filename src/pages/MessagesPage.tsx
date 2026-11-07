import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import {
  MessageSquare,
  Send,
  UserCheck,
  Clock,
  ShieldAlert,
  Search,
  Lock,
  UserPlus,
  CheckCircle2,
  AlertCircle,
  User as UserIcon,
} from 'lucide-react';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Conversation, ChatMessage } from '../types';

export const MessagesPage: React.FC = () => {
  const { user } = useAuth();
  const { showToast } = useToast();
  const location = useLocation();

  // Read ?user= query param if navigated directly from a student/senior card
  const queryParams = new URLSearchParams(location.search);
  const initialTargetUserId = queryParams.get('user');

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(initialTargetUserId);
  const [selectedUserData, setSelectedUserData] = useState<any>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [isPending, setIsPending] = useState<boolean>(false);
  const [connectionNotice, setConnectionNotice] = useState<string | null>(null);

  const [newMessageText, setNewMessageText] = useState('');
  const [loadingConversations, setLoadingConversations] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [sending, setSending] = useState(false);
  const [connecting, setConnecting] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 1. Fetch conversations list
  const fetchConversations = async () => {
    if (!user) return;
    try {
      const res = await api.get('/messages/conversations');
      if (res.data.success) {
        setConversations(res.data.data);
        // If no user selected yet, select the first conversation
        if (!selectedUserId && res.data.data.length > 0) {
          setSelectedUserId(res.data.data[0].user.id);
        }
      }
    } catch {
      // Ignore
    } finally {
      setLoadingConversations(false);
    }
  };

  // 2. Fetch messages for active selected user
  const fetchMessagesForUser = async (targetId: string) => {
    setLoadingMessages(true);
    try {
      const res = await api.get(`/messages/${targetId}`);
      if (res.data.success) {
        setIsConnected(res.data.isConnected);
        setIsPending(res.data.isPending || false);
        setConnectionNotice(res.data.notice || null);
        setSelectedUserData(res.data.targetUser);
        setMessages(res.data.messages || []);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to load conversation', 'error');
    } finally {
      setLoadingMessages(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (selectedUserId) {
      fetchMessagesForUser(selectedUserId);
    }
  }, [selectedUserId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Periodic poll to refresh messages in active chat
  useEffect(() => {
    if (!selectedUserId || !isConnected) return;
    const interval = setInterval(async () => {
      try {
        const res = await api.get(`/messages/${selectedUserId}`);
        if (res.data.success && res.data.isConnected) {
          setMessages(res.data.messages || []);
        }
      } catch {
        // Ignore
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [selectedUserId, isConnected]);

  // Send message
  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessageText.trim() || sending || !selectedUserId) return;

    if (!isConnected) {
      showToast('You can only message after connection request is accepted', 'error');
      return;
    }

    setSending(true);
    try {
      const res = await api.post(`/messages/${selectedUserId}`, {
        content: newMessageText.trim(),
      });
      if (res.data.success) {
        setMessages((prev) => [...prev, res.data.message]);
        setNewMessageText('');
        fetchConversations();
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to send message', 'error');
    } finally {
      setSending(false);
    }
  };

  // Send connection request if not connected
  const handleConnect = async () => {
    if (!selectedUserId) return;
    setConnecting(true);
    try {
      const res = await api.post('/posts/network/connect', { targetUserId: selectedUserId });
      if (res.data.success) {
        setIsPending(true);
        showToast('Connection request sent! Waiting for senior/peer acceptance.', 'success');
        fetchMessagesForUser(selectedUserId);
      }
    } catch (err: any) {
      showToast(err.response?.data?.error || 'Failed to send connection request', 'error');
    } finally {
      setConnecting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Title */}
      <div className="mb-6">
        <h1 className="font-extrabold text-2xl text-slate-900 tracking-tight flex items-center gap-2">
          <MessageSquare className="w-7 h-7 text-brand-600" />
          1-to-1 Junior & Senior Mentorship Messaging
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Direct messaging is unlocked once your peer or senior accepts your connection request.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-[620px]">
        {/* Left Sidebar: Conversations List */}
        <aside className="md:col-span-4 border-r border-slate-200 flex flex-col bg-slate-50/50">
          <div className="p-4 border-b border-slate-200 bg-white">
            <h2 className="font-bold text-sm text-slate-900 flex items-center justify-between">
              <span>Connected Chats</span>
              <span className="text-xs bg-brand-50 text-brand-700 font-bold px-2 py-0.5 rounded-full border border-brand-200">
                {conversations.length}
              </span>
            </h2>
          </div>

          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loadingConversations ? (
              <div className="p-8 text-center text-xs text-slate-400">Loading chats...</div>
            ) : conversations.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <UserCheck className="w-8 h-8 text-slate-300 mx-auto" />
                <p>No active conversations yet.</p>
                <p className="text-[11px] text-slate-500">
                  Go to <a href="/network" className="text-brand-600 font-bold hover:underline">My Network</a> to connect with seniors and peers!
                </p>
              </div>
            ) : (
              conversations.map((conv) => {
                const isSelected = selectedUserId === conv.user.id;
                return (
                  <button
                    key={conv.user.id}
                    onClick={() => setSelectedUserId(conv.user.id)}
                    className={`w-full p-3.5 text-left flex items-start gap-3 transition-colors ${
                      isSelected ? 'bg-brand-50/80 border-l-4 border-brand-600' : 'hover:bg-slate-100/70 bg-white'
                    }`}
                  >
                    <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-brand-700 to-brand-500 text-white font-bold flex items-center justify-center shrink-0 text-sm shadow-xs">
                      {conv.user.fullName?.charAt(0) || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className="font-bold text-xs text-slate-900 truncate">{conv.user.fullName}</h4>
                        {conv.lastMessage && (
                          <span className="text-[10px] text-slate-400">
                            {new Date(conv.lastMessage.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        )}
                      </div>

                      <div className="text-[11px] text-slate-500 truncate mt-0.5">
                        {conv.user.role === 'SENIOR_ALUMNI' ? 'Senior Alum' : `${conv.user.department} Dept`}
                      </div>

                      <div className="text-xs text-slate-600 truncate mt-1">
                        {conv.lastMessage ? (
                          <span>
                            {conv.lastMessage.isSender ? 'You: ' : ''}
                            {conv.lastMessage.content}
                          </span>
                        ) : (
                          <span className="italic text-slate-400 text-[11px]">Connected! Say hello.</span>
                        )}
                      </div>
                    </div>

                    {conv.unreadCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-brand-600 text-white font-bold text-[10px] flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </button>
                );
              })
            )}
          </div>
        </aside>

        {/* Right Pane: 1-to-1 Chat Room */}
        <main className="md:col-span-8 flex flex-col bg-white">
          {selectedUserData ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-slate-200 flex items-center justify-between bg-white">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-navy-900 to-brand-700 text-white font-bold flex items-center justify-center text-sm shadow-xs">
                    {selectedUserData.fullName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-sm text-slate-900">{selectedUserData.fullName}</h3>
                      {selectedUserData.role === 'SENIOR_ALUMNI' && (
                        <span className="text-[10px] font-bold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200">
                          Senior Alum
                        </span>
                      )}
                    </div>
                    <p className="text-[11px] text-slate-500 font-medium">
                      {selectedUserData.headline || `${selectedUserData.department} • BMSCE`}
                    </p>
                  </div>
                </div>

                {isConnected ? (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    Connection Accepted
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-800 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200">
                    <Lock className="w-3.5 h-3.5" />
                    Pending Acceptance
                  </span>
                )}
              </div>

              {/* Message Thread or Lock Notice */}
              <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-3 bg-slate-50/60 max-h-[480px]">
                {loadingMessages ? (
                  <div className="text-center text-xs text-slate-400 py-12">Loading messages...</div>
                ) : !isConnected ? (
                  /* Connection Required Gating Notice */
                  <div className="max-w-md mx-auto my-12 p-6 rounded-2xl bg-white border border-amber-200 text-center space-y-3 shadow-sm">
                    <div className="w-12 h-12 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                      <Lock className="w-6 h-6" />
                    </div>
                    <h4 className="font-bold text-sm text-slate-900">
                      1-to-1 Messaging is Gated by Connection
                    </h4>
                    <p className="text-xs text-slate-600 leading-relaxed">
                      {connectionNotice ||
                        'By college policy, students and juniors can exchange direct messages only after the senior/peer accepts their connection request.'}
                    </p>

                    {isPending ? (
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 text-amber-800 border border-amber-200 rounded-xl text-xs font-semibold">
                        <Clock className="w-4 h-4 text-amber-600" />
                        Connection Request Pending Acceptance
                      </div>
                    ) : (
                      <button
                        onClick={handleConnect}
                        disabled={connecting}
                        className="px-4 py-2 bg-brand-600 hover:bg-brand-500 text-white text-xs font-bold rounded-xl shadow-xs inline-flex items-center gap-1.5 transition-colors"
                      >
                        <UserPlus className="w-4 h-4" />
                        <span>{connecting ? 'Sending Request...' : 'Send Connection Request'}</span>
                      </button>
                    )}
                  </div>
                ) : messages.length === 0 ? (
                  <div className="text-center text-xs text-slate-400 py-16 space-y-1">
                    <CheckCircle2 className="w-8 h-8 text-emerald-500 mx-auto mb-2" />
                    <p className="font-semibold text-slate-700">You are connected!</p>
                    <p className="text-[11px] text-slate-500">Send your first message to begin mentorship or interview discussion.</p>
                  </div>
                ) : (
                  messages.map((m) => (
                    <div
                      key={m.id}
                      className={`flex flex-col ${m.isSender ? 'items-end' : 'items-start'}`}
                    >
                      <div
                        className={`max-w-[75%] p-3 rounded-2xl text-xs leading-relaxed ${
                          m.isSender
                            ? 'bg-brand-600 text-white rounded-br-xs shadow-xs'
                            : 'bg-white text-slate-800 rounded-bl-xs border border-slate-200 shadow-2xs'
                        }`}
                      >
                        {m.content}
                      </div>
                      <span className="text-[10px] text-slate-400 mt-1 px-1">
                        {new Date(m.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input Footer */}
              {isConnected && (
                <form onSubmit={handleSendMessage} className="p-3 border-t border-slate-200 bg-white flex gap-2">
                  <input
                    type="text"
                    placeholder="Type your message to this senior/student..."
                    value={newMessageText}
                    onChange={(e) => setNewMessageText(e.target.value)}
                    className="flex-1 text-xs p-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                  <button
                    type="submit"
                    disabled={!newMessageText.trim() || sending}
                    className="px-4 py-2.5 bg-brand-600 hover:bg-brand-500 disabled:opacity-50 text-white font-bold text-xs rounded-xl shadow-xs transition-colors flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>Send</span>
                  </button>
                </form>
              )}
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-12 text-center text-slate-400 text-xs space-y-2">
              <MessageSquare className="w-12 h-12 text-slate-200" />
              <h3 className="font-bold text-slate-700 text-sm">Select a Conversation</h3>
              <p className="text-slate-500 max-w-sm">
                Choose a connected senior or peer from the left sidebar to start one-to-one mentorship messaging.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
