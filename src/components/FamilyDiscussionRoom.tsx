/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  Send,
  Sparkles,
  Share2,
  CheckCircle2,
  Clock,
  Heart,
  Plus,
  HelpCircle,
} from 'lucide-react';

export interface FamilyNote {
  id: string;
  authorName: string;
  authorRole: 'Primary Buyer' | 'Spouse' | 'Parent' | 'Child' | 'Financial Advisor';
  avatarInitials: string;
  comment: string;
  vote: 'POSITIVE' | 'NEUTRAL' | 'CONCERN';
  timestamp: string;
  likes: number;
}

interface FamilyDiscussionRoomProps {
  assetId: string;
  assetTitle: string;
  theme?: 'dark' | 'light';
}

export const FamilyDiscussionRoom: React.FC<FamilyDiscussionRoomProps> = ({
  assetId,
  assetTitle,
  theme = 'dark',
}) => {
  const isDark = theme === 'dark';

  const [notes, setNotes] = useState<FamilyNote[]>([
    {
      id: 'fn-1',
      authorName: 'Rajesh Sharma',
      authorRole: 'Primary Buyer',
      avatarInitials: 'RS',
      comment: 'The 32nd floor living room balcony gets uninterrupted morning sunlight and direct view of Hinjewadi skyline. Massive plus for morning coffee.',
      vote: 'POSITIVE',
      timestamp: '2 hours ago',
      likes: 3,
    },
    {
      id: 'fn-2',
      authorName: 'Ananya Sharma',
      authorRole: 'Spouse',
      avatarInitials: 'AS',
      comment: 'The cantilevered sky pool and private elevator lobby make this feel truly private. Let us check the distance to Vibgyor High for kids.',
      vote: 'POSITIVE',
      timestamp: '1 hour ago',
      likes: 2,
    },
    {
      id: 'fn-3',
      authorName: 'Surendra Sharma',
      authorRole: 'Parent',
      avatarInitials: 'SS',
      comment: 'North-East master bedroom is 100% Vaastu compliant as verified by the report. The wheelchair accessible ground level promenade is very thoughtful.',
      vote: 'POSITIVE',
      timestamp: '35 mins ago',
      likes: 4,
    },
  ]);

  const [newComment, setNewComment] = useState('');
  const [newAuthor, setNewAuthor] = useState('Rajesh Sharma');
  const [newRole, setNewRole] = useState<'Primary Buyer' | 'Spouse' | 'Parent' | 'Child' | 'Financial Advisor'>('Primary Buyer');
  const [newVote, setNewVote] = useState<'POSITIVE' | 'NEUTRAL' | 'CONCERN'>('POSITIVE');
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteSent, setInviteSent] = useState(false);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const note: FamilyNote = {
      id: `fn-${Date.now()}`,
      authorName: newAuthor,
      authorRole: newRole,
      avatarInitials: newAuthor.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2),
      comment: newComment.trim(),
      vote: newVote,
      timestamp: 'Just now',
      likes: 1,
    };

    setNotes([note, ...notes]);
    setNewComment('');
  };

  const handleLike = (id: string) => {
    setNotes(notes.map((n) => (n.id === id ? { ...n, likes: n.likes + 1 } : n)));
  };

  const positiveVotes = (notes || []).filter((n) => n.vote === 'POSITIVE').length;
  const concernVotes = (notes || []).filter((n) => n.vote === 'CONCERN').length;
  const totalVotes = (notes || []).length;
  const approvalPercent = totalVotes > 0 ? Math.round((positiveVotes / totalVotes) * 100) : 100;

  return (
    <div
      className={`rounded-3xl border transition-all duration-300 ${
        isDark
          ? 'bg-[#0B101B]/80 border-white/10 text-white'
          : 'bg-white/90 border-slate-200 text-slate-900 shadow-xl'
      } p-6 sm:p-8 space-y-6`}
    >
      {/* Header & Family Alignment Score */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-6 border-current/10">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-xl bg-amber-500/10 text-amber-400 border border-amber-500/20">
              <Users className="w-4 h-4" />
            </span>
            <span className="text-xs uppercase font-bold tracking-widest text-amber-500">
              Family & Co-Buyer Collaboration Room
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-serif font-bold">
            Private Decision Hub: {assetTitle}
          </h3>
          <p className={`text-xs ${isDark ? 'text-white/60' : 'text-slate-600'}`}>
            Invite family members, vote on features, record private pros & cons, and align on your next family home.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Family Consensus Pill */}
          <div
            className={`px-4 py-2 rounded-2xl border text-center ${
              isDark ? 'bg-white/5 border-white/10' : 'bg-slate-50 border-slate-200'
            }`}
          >
            <div className="text-[10px] uppercase font-bold tracking-wider text-amber-500">
              Family Consensus
            </div>
            <div className="text-xl font-bold font-mono text-emerald-500 flex items-center justify-center gap-1">
              <Heart className="w-4 h-4 fill-emerald-500 text-emerald-500" />
              <span>{approvalPercent}% Positive</span>
            </div>
          </div>

          <button
            onClick={() => setShowInviteModal(true)}
            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-black font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/20 transition-all cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>Invite Co-Buyer</span>
          </button>
        </div>
      </div>

      {/* Invite Modal */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-md p-4">
          <div
            className={`w-full max-w-md rounded-3xl p-6 border space-y-4 ${
              isDark ? 'bg-[#0E1626] border-white/20 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
            }`}
          >
            <div className="flex items-center justify-between">
              <h4 className="font-serif font-bold text-lg">Invite Family Co-Buyer</h4>
              <button
                onClick={() => {
                  setShowInviteModal(false);
                  setInviteSent(false);
                }}
                className="text-current/60 hover:text-current text-sm font-bold"
              >
                ✕
              </button>
            </div>

            <p className={`text-xs ${isDark ? 'text-white/70' : 'text-slate-600'}`}>
              Send a secure private link for this asset so your spouse, parents, or legal advisor can add notes and review compliance.
            </p>

            {inviteSent ? (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>Invite link dispatched to {inviteEmail} via WhatsApp & Email!</span>
              </div>
            ) : (
              <div className="space-y-3">
                <input
                  type="email"
                  placeholder="family.member@gmail.com or WhatsApp number"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className={`w-full px-4 py-2.5 rounded-xl text-xs border focus:outline-none focus:border-amber-400 ${
                    isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
                <button
                  onClick={() => {
                    if (inviteEmail) setInviteSent(true);
                  }}
                  className="w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs transition-all cursor-pointer"
                >
                  Send Private Access Link
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add New Note / Feedback Form */}
      <form onSubmit={handleAddNote} className="space-y-3">
        <div className="flex flex-wrap items-center gap-3">
          <select
            value={newRole}
            onChange={(e) => setNewRole(e.target.value as any)}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold border ${
              isDark ? 'bg-white/5 border-white/10 text-white' : 'bg-slate-50 border-slate-200 text-slate-800'
            }`}
          >
            <option value="Primary Buyer">Rajesh (Primary Buyer)</option>
            <option value="Spouse">Ananya (Spouse)</option>
            <option value="Parent">Surendra (Parent)</option>
            <option value="Child">Aarav (Child)</option>
            <option value="Financial Advisor">CA Mehta (Financial Advisor)</option>
          </select>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setNewVote('POSITIVE')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                newVote === 'POSITIVE'
                  ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'
                  : 'opacity-50 hover:opacity-100 border-transparent'
              }`}
            >
              <ThumbsUp className="w-3 h-3" />
              <span>Like / Pro</span>
            </button>
            <button
              type="button"
              onClick={() => setNewVote('CONCERN')}
              className={`px-3 py-1 rounded-xl text-xs font-semibold flex items-center gap-1 border transition-all cursor-pointer ${
                newVote === 'CONCERN'
                  ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                  : 'opacity-50 hover:opacity-100 border-transparent'
              }`}
            >
              <ThumbsDown className="w-3 h-3" />
              <span>Question / Note</span>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Share your thought (e.g., 'Do we prefer the East or West facing master bedroom?')..."
            className={`flex-1 px-4 py-2.5 rounded-2xl text-xs border focus:outline-none focus:border-amber-400 transition-all ${
              isDark ? 'bg-white/5 border-white/10 text-white placeholder-white/40' : 'bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400'
            }`}
          />
          <button
            type="submit"
            className="px-5 py-2.5 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs flex items-center gap-1.5 transition-all shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
            <span>Post Note</span>
          </button>
        </div>
      </form>

      {/* Notes Stream */}
      <div className="space-y-3">
        {notes.map((n) => (
          <div
            key={n.id}
            className={`p-4 rounded-2xl border transition-all ${
              isDark ? 'bg-white/[0.02] border-white/5 hover:border-white/15' : 'bg-slate-50/80 border-slate-200 hover:border-slate-300'
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center font-bold text-black text-xs flex-shrink-0">
                  {n.avatarInitials}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-xs">{n.authorName}</span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full uppercase tracking-wider font-semibold ${
                        isDark ? 'bg-white/10 text-white/70' : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {n.authorRole}
                    </span>
                    <span className="text-[10px] opacity-40">• {n.timestamp}</span>
                  </div>
                  <p className={`text-xs mt-1.5 leading-relaxed ${isDark ? 'text-white/80' : 'text-slate-700'}`}>
                    {n.comment}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-shrink-0">
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-bold flex items-center gap-1 ${
                    n.vote === 'POSITIVE'
                      ? 'bg-emerald-500/15 text-emerald-400'
                      : 'bg-amber-500/15 text-amber-400'
                  }`}
                >
                  {n.vote === 'POSITIVE' ? <ThumbsUp className="w-2.5 h-2.5" /> : <HelpCircle className="w-2.5 h-2.5" />}
                  <span>{n.vote === 'POSITIVE' ? 'Endorsement' : 'Discussion Item'}</span>
                </span>

                <button
                  onClick={() => handleLike(n.id)}
                  className={`p-1.5 rounded-xl border flex items-center gap-1 text-[11px] font-semibold transition-all cursor-pointer ${
                    isDark ? 'border-white/10 hover:bg-white/10 text-white/70' : 'border-slate-200 hover:bg-slate-200 text-slate-700'
                  }`}
                >
                  <Heart className="w-3 h-3 text-red-400 fill-red-400/50" />
                  <span>{n.likes}</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
