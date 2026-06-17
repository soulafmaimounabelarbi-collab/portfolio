import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  FolderKanban,
  Route,
  Cpu,
  User,
  Mail,
  BarChart2,
  LogOut,
  Eye,
  Lock,
} from 'lucide-react';
import { DashboardProjects } from './DashboardProjects';
import { DashboardJourney } from './DashboardJourney';
import { DashboardStack } from './DashboardStack';
import { DashboardAbout } from './DashboardAbout';
import { DashboardMessages } from './DashboardMessages';
import { DashboardAnalytics } from './DashboardAnalytics';
import { loadMessages } from '../../hooks/usePortfolioStore';
import { usePortfolio } from '../../context/PortfolioContext';

const DASHBOARD_PASSWORD = 'admin123';

type Tab = 'projects' | 'journey' | 'stack' | 'about' | 'messages' | 'analytics';

export function Dashboard() {
  const [authenticated, setAuthenticated] = useState(() => {
    return sessionStorage.getItem('dash_auth') === '1';
  });
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('projects');
  const [unreadCount, setUnreadCount] = useState(0);

  const { messages } = usePortfolio();

  // Refresh unread count whenever messages change
  useEffect(() => {
    const count = messages.filter((m) => !m.read).length;
    setUnreadCount(count);
  }, [messages]);

  // Also poll messages when authenticated (in case they come in)
  useEffect(() => {
    if (!authenticated) return;
    const interval = setInterval(() => {
      const msgs = loadMessages();
      setUnreadCount(msgs.filter((m) => !m.read).length);
    }, 5000);
    return () => clearInterval(interval);
  }, [authenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === DASHBOARD_PASSWORD) {
      sessionStorage.setItem('dash_auth', '1');
      setAuthenticated(true);
      setError('');
    } else {
      setError('Incorrect password. Try again.');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('dash_auth');
    setAuthenticated(false);
    setPassword('');
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen bg-cream flex items-center justify-center px-6">
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-petal border border-roseMist mb-4">
              <Lock className="w-6 h-6 text-roseDeep" />
            </div>
            <h1 className="font-display text-3xl text-charcoal">Dashboard</h1>
            <p className="text-ash text-sm mt-2">Enter your password to continue</p>
          </div>

          <form onSubmit={handleLogin} className="bg-white rounded-2xl p-8 border border-petal shadow-sm space-y-5">
            <div>
              <label htmlFor="dash-password" className="block text-xs font-mono text-rose uppercase tracking-widest mb-2">
                Password
              </label>
              <input
                id="dash-password"
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setError(''); }}
                placeholder="Enter dashboard password"
                className="w-full px-4 py-3 rounded-xl border border-roseMist bg-cream text-charcoal text-sm placeholder-mist focus:outline-none focus:ring-2 focus:ring-rose focus:border-rose transition-colors"
                autoFocus
              />
              {error && <p className="text-xs text-red-500 mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-roseDeep text-white text-sm font-medium hover:bg-rose transition-colors focus:outline-none focus:ring-2 focus:ring-rose focus:ring-offset-2"
            >
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-ash mt-6">
            <Link to="/" className="text-rose hover:text-roseDeep transition-colors">
              ← Back to portfolio
            </Link>
          </p>
        </div>
      </div>
    );
  }

  const NAV_GROUPS = [
    {
      label: 'Content',
      items: [
        { id: 'projects' as Tab, label: 'Projects', icon: <FolderKanban className="w-4 h-4" /> },
        { id: 'journey' as Tab, label: 'Journey', icon: <Route className="w-4 h-4" /> },
        { id: 'stack' as Tab, label: 'Stack', icon: <Cpu className="w-4 h-4" /> },
        { id: 'about' as Tab, label: 'About & Hero', icon: <User className="w-4 h-4" /> },
      ],
    },
    {
      label: 'Engagement',
      items: [
        {
          id: 'messages' as Tab,
          label: 'Messages',
          icon: <Mail className="w-4 h-4" />,
          badge: unreadCount,
        },
        { id: 'analytics' as Tab, label: 'Analytics', icon: <BarChart2 className="w-4 h-4" /> },
      ],
    },
  ];

  return (
    <div className="min-h-screen bg-cream flex">
      {/* Sidebar */}
      <aside className="w-60 bg-white border-r border-petal flex flex-col fixed inset-y-0 left-0 z-40">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-petal">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-petal border border-roseMist flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-roseDeep" />
            </div>
            <div>
              <p className="font-mono text-xs font-semibold text-roseDeep tracking-wider">BS.</p>
              <p className="text-2xs text-ash">Portfolio CMS</p>
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {NAV_GROUPS.map((group) => (
            <div key={group.label}>
              <p className="px-3 mb-1 text-2xs font-mono text-mist uppercase tracking-widest">{group.label}</p>
              <div className="space-y-0.5">
                {group.items.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 text-left ${
                      activeTab === item.id
                        ? 'bg-petal text-roseDeep'
                        : 'text-slate hover:bg-blush hover:text-charcoal'
                    }`}
                  >
                    {item.icon}
                    <span className="flex-1">{item.label}</span>
                    {'badge' in item && item.badge > 0 && (
                      <span className="min-w-[18px] h-[18px] px-1 rounded-full bg-rose text-white text-2xs flex items-center justify-center font-mono">
                        {item.badge}
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom actions */}
        <div className="px-3 py-4 border-t border-petal space-y-0.5">
          <Link
            to="/"
            target="_blank"
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate hover:bg-blush hover:text-charcoal transition-all duration-200"
          >
            <Eye className="w-4 h-4" />
            View Portfolio
          </Link>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm text-slate hover:bg-blush hover:text-charcoal transition-all duration-200"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-60 p-8 min-h-screen">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'projects' && <DashboardProjects />}
          {activeTab === 'journey' && <DashboardJourney />}
          {activeTab === 'stack' && <DashboardStack />}
          {activeTab === 'about' && <DashboardAbout />}
          {activeTab === 'messages' && <DashboardMessages />}
          {activeTab === 'analytics' && <DashboardAnalytics />}
        </div>
      </main>
    </div>
  );
}
