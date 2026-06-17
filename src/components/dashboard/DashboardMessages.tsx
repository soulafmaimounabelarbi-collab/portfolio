import { useState } from 'react';
import { Mail, MailOpen, Trash2, Reply, Send, X, ChevronDown, ChevronUp } from 'lucide-react';
import { usePortfolio } from '../../context/PortfolioContext';
import type { ContactMessage } from '../../hooks/usePortfolioStore';
import { PanelHeader, DashButton, DashCard, EmptyState, Divider } from './DashUI';

function formatDate(iso: string) {
  const d = new Date(iso);
  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

interface MessageCardProps {
  msg: ContactMessage;
  onMarkRead: (id: string) => void;
  onReply: (id: string, reply: string) => void;
  onDelete: (id: string) => void;
}

function MessageCard({ msg, onMarkRead, onReply, onDelete }: MessageCardProps) {
  const [expanded, setExpanded] = useState(!msg.read);
  const [replyMode, setReplyMode] = useState(false);
  const [replyText, setReplyText] = useState(msg.reply ?? '');
  const [copied, setCopied] = useState(false);

  const handleExpand = () => {
    setExpanded((v) => !v);
    if (!msg.read) onMarkRead(msg.id);
  };

  const handleSendReply = () => {
    if (!replyText.trim()) return;
    onReply(msg.id, replyText.trim());
    setReplyMode(false);
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(msg.email).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };

  return (
    <DashCard className={`transition-all ${!msg.read ? 'border-rose/40 bg-rose/[0.02]' : ''}`}>
      {/* Header row */}
      <div className="flex items-start gap-3">
        <div className={`mt-0.5 shrink-0 ${msg.read ? 'text-ash' : 'text-rose'}`}>
          {msg.read ? <MailOpen className="w-4 h-4" /> : <Mail className="w-4 h-4" />}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-medium text-charcoal text-sm">{msg.name}</span>
            {!msg.read && (
              <span className="px-1.5 py-0.5 bg-rose text-white text-2xs rounded-full font-mono">New</span>
            )}
            {msg.reply && (
              <span className="px-1.5 py-0.5 bg-green-100 text-green-700 text-2xs rounded-full font-mono">Replied</span>
            )}
          </div>
          <p className="text-xs text-ash mt-0.5">{msg.email} · {formatDate(msg.receivedAt)}</p>
          <p className="text-sm text-slate mt-1 font-medium">{msg.subject}</p>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={handleExpand}
            className="p-1.5 text-ash hover:text-charcoal rounded-lg hover:bg-blush transition-colors"
            title={expanded ? 'Collapse' : 'Expand'}
          >
            {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Expanded body */}
      {expanded && (
        <div className="mt-4 ml-7">
          <div className="bg-blush rounded-xl p-4 text-sm text-slate leading-relaxed whitespace-pre-wrap">
            {msg.message}
          </div>

          {/* Reply section */}
          {msg.reply && !replyMode && (
            <div className="mt-3 bg-green-50 border border-green-100 rounded-xl p-4">
              <p className="text-2xs font-mono text-green-700 uppercase tracking-widest mb-1">
                Your reply · {msg.repliedAt ? formatDate(msg.repliedAt) : ''}
              </p>
              <p className="text-sm text-slate leading-relaxed whitespace-pre-wrap">{msg.reply}</p>
            </div>
          )}

          {replyMode && (
            <div className="mt-3 space-y-2">
              <textarea
                value={replyText}
                onChange={(e) => setReplyText(e.target.value)}
                rows={4}
                placeholder={`Write your reply to ${msg.name}...`}
                className="w-full px-3 py-2.5 rounded-xl border border-roseMist bg-white text-charcoal text-sm placeholder-mist focus:outline-none focus:ring-2 focus:ring-rose focus:border-rose transition-colors resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <DashButton onClick={handleSendReply} size="sm">
                  <Send className="w-3.5 h-3.5" /> Save reply
                </DashButton>
                <DashButton variant="ghost" size="sm" onClick={() => { setReplyMode(false); setReplyText(msg.reply ?? ''); }}>
                  <X className="w-3.5 h-3.5" /> Cancel
                </DashButton>
              </div>
              <p className="text-2xs text-ash">
                💡 Reply is saved here. To actually send it, use{' '}
                <button onClick={copyEmail} className="text-rose hover:text-roseDeep underline">
                  {copied ? 'Copied!' : `copy ${msg.email}`}
                </button>{' '}
                and email directly.
              </p>
            </div>
          )}

          <Divider />
          <div className="flex items-center gap-2 flex-wrap">
            {!replyMode && (
              <DashButton size="sm" variant="ghost" onClick={() => setReplyMode(true)}>
                <Reply className="w-3.5 h-3.5" /> {msg.reply ? 'Edit reply' : 'Write reply'}
              </DashButton>
            )}
            <DashButton size="sm" variant="ghost" onClick={copyEmail}>
              {copied ? '✓ Copied!' : `Copy email`}
            </DashButton>
            <a
              href={`mailto:${msg.email}?subject=Re: ${encodeURIComponent(msg.subject)}`}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-xl bg-petal text-roseDeep hover:bg-roseMist transition-colors"
            >
              <Mail className="w-3.5 h-3.5" /> Open in email client
            </a>
            <DashButton size="sm" variant="danger" onClick={() => onDelete(msg.id)} className="ml-auto">
              <Trash2 className="w-3.5 h-3.5" /> Delete
            </DashButton>
          </div>
        </div>
      )}
    </DashCard>
  );
}

export function DashboardMessages() {
  const { messages, markMessageRead, replyToMessage, deleteMessage, refreshMessages } = usePortfolio();
  const [filter, setFilter] = useState<'all' | 'unread' | 'replied'>('all');

  const filtered = messages.filter((m) => {
    if (filter === 'unread') return !m.read;
    if (filter === 'replied') return !!m.reply;
    return true;
  });

  const unreadCount = messages.filter((m) => !m.read).length;

  const FILTERS: { id: typeof filter; label: string }[] = [
    { id: 'all', label: `All (${messages.length})` },
    { id: 'unread', label: `Unread (${unreadCount})` },
    { id: 'replied', label: `Replied (${messages.filter((m) => !!m.reply).length})` },
  ];

  return (
    <div>
      <PanelHeader
        title="Messages"
        description="Contact form submissions from your portfolio visitors."
        action={
          <button
            onClick={refreshMessages}
            className="text-xs text-rose hover:text-roseDeep font-mono transition-colors"
          >
            ↻ Refresh
          </button>
        }
      />

      {/* Filter tabs */}
      {messages.length > 0 && (
        <div className="flex gap-2 mb-6">
          {FILTERS.map((f) => (
            <button
              key={f.id}
              onClick={() => setFilter(f.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                filter === f.id
                  ? 'bg-roseDeep text-white'
                  : 'bg-white border border-roseMist text-slate hover:border-rose'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          message={
            filter === 'all'
              ? 'No messages yet. When visitors submit the contact form, their messages appear here.'
              : `No ${filter} messages.`
          }
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((msg) => (
            <MessageCard
              key={msg.id}
              msg={msg}
              onMarkRead={markMessageRead}
              onReply={replyToMessage}
              onDelete={deleteMessage}
            />
          ))}
        </div>
      )}
    </div>
  );
}
