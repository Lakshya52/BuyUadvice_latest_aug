import React, { useState, useMemo, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Briefcase, 
  Headphones, 
  Boxes, 
  Settings, 
  LogOut, 
  Search, 
  SlidersHorizontal, 
  ArrowUpRight, 
  Lock, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  ChevronRight, 
  Menu, 
  X, 
  Download, 
  MessageSquare, 
  AlertCircle,
  FileText,
  DollarSign
} from 'lucide-react';
import data from '../data/data.json';

const categoryLabels = {
  all: 'All Services',
  registrations: 'Registrations & Licenses',
  trademark: 'Trademark',
  gst: 'GST',
  'income-tax': 'Income Tax',
  mca: 'MCA',
  compliance: 'Compliance',
  'foreign-accounting': 'Foreign Accounting',
  startup: 'Startup',
};

const Dashboard = () => {
  const { user, logout, hasPassword, setHasPassword } = useAuth();
  const navigate = useNavigate();

  // Navigation State
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Search & Filtering State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  // Settings / Password State
  const [showSetPassword, setShowSetPassword] = useState(!hasPassword);
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [pwError, setPwError] = useState('');
  const [pwSuccess, setPwSuccess] = useState('');
  const [pwLoading, setPwLoading] = useState(false);

  // Form State for Contact Support
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [supportSubject, setSupportSubject] = useState('');
  const [supportMsg, setSupportMsg] = useState('');

  // Handle Logout
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // Handle Set Password
  const handleSetPassword = async () => {
    if (!password.trim()) {
      setPwError('Please enter a password');
      return;
    }
    if (password.trim().length < 8) {
      setPwError('Password must be at least 8 characters');
      return;
    }
    if (password.trim() !== confirmPassword.trim()) {
      setPwError('Passwords do not match');
      return;
    }
    setPwLoading(true);
    setPwError('');
    setPwSuccess('');
    try {
      const res = await fetch('/backend/auth/set-password.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ password: password.trim() }),
      });
      const data = await res.json();
      if (res.ok) {
        setHasPassword(true);
        setShowSetPassword(false);
        setPassword('');
        setConfirmPassword('');
        setPwSuccess('Password successfully set!');
      } else {
        setPwError(data.error || 'Failed to set password');
      }
    } catch (err) {
      setPwError('Network error. Please try again.');
    } finally {
      setPwLoading(false);
    }
  };

  // Redirect if not logged in
  useEffect(() => {
    if (!user) {
      navigate('/');
    }
  }, [user, navigate]);

  // Flatten all services for search and display
  const allServices = useMemo(() => {
    const list = [];
    if (data && data.services) {
      Object.entries(data.services).forEach(([cat, items]) => {
        items.forEach(item => {
          list.push({ ...item, category: cat });
        });
      });
    }
    return list;
  }, []);

  // Filter services by search query and category
  const filteredServices = useMemo(() => {
    return allServices.filter(service => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q || 
        service.title.toLowerCase().includes(q) || 
        service.shortAbstract.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'all' || service.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [allServices, searchQuery, selectedCategory]);

  // Handle support form submit
  const handleSupportSubmit = (e) => {
    e.preventDefault();
    if (!supportSubject.trim() || !supportMsg.trim()) return;
    setSupportSubmitted(true);
    setSupportSubject('');
    setSupportMsg('');
    setTimeout(() => setSupportSubmitted(false), 5000);
  };

  if (!user) return null;

  // Extract user first name
  const firstName = user.name ? user.name.split(' ')[0] : 'User';

  // Profile Completeness Indicator Calculation (25% base + 40% if password set + 35% if active requests/details populated)
  const completeness = hasPassword ? 65 : 25;

  const sidebarLinks = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'requests', label: 'My Requests', icon: <Briefcase size={20} /> },
    { id: 'payments', label: 'Payments', icon: <span className="font-bold text-[18px] w-5 h-5 flex items-center justify-center select-none">₹</span> },
    { id: 'support', label: 'Customer Support', icon: <Headphones size={20} /> },
    { id: 'services', label: 'Services', icon: <Boxes size={20} /> },
  ];

  return (
    <div className="min-h-screen flex text-(--color-primary) bg-(--color-white)">
      {/* Mobile Sidebar Hamburger Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-white border-b border-gray-100 px-6 flex items-center justify-between z-40">
        <img src="/Logo.png" alt="BuyUadvice Logo" className="h-8 object-contain" />
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 text-(--color-primary) hover:bg-gray-50 rounded-lg cursor-pointer"
        >
          {isMobileSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Overlay for Mobile */}
      {isMobileSidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/30 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={() => setIsMobileSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside 
        className={`fixed lg:sticky top-0 bottom-0 left-0 z-50 w-72 bg-white flex flex-col justify-between py-10 rounded-r-[32px] md:rounded-r-[40px] shadow-[0_4px_32px_rgba(0,0,0,0.03)] border-r border-gray-50 transition-transform duration-300 lg:translate-x-0 h-screen ${
          isMobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex flex-col">
          {/* Logo */}
          <div className="mb-10 px-8">
            <Link to="/" className="outline-none block">
              <img src="/Logo.png" alt="BuyUadvice Logo" className="h-10 object-contain" />
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="flex flex-col gap-2.5">
            {sidebarLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => {
                  setActiveTab(link.id);
                  setIsMobileSidebarOpen(false);
                }}
                className={`flex items-center gap-4 px-8 py-3.5 w-[90%] rounded-r-full text-left transition-all duration-300 font-semibold text-[15px] cursor-pointer ${
                  activeTab === link.id
                    ? 'bg-(--color-accent) text-white shadow-[0_4px_16px_rgba(47,164,169,0.22)]'
                    : 'text-(--color-primary)/65 hover:text-(--color-primary) hover:bg-(--color-accent)/8'
                }`}
              >
                {link.icon}
                <span>{link.label}</span>
              </button>
            ))}
          </nav>
        </div>

        {/* Bottom Menu Items */}
        <div className="flex flex-col gap-6 px-8">
          <div className="flex flex-col gap-3">
            {/* Settings */}
            <button
              onClick={() => {
                setActiveTab('settings');
                setIsMobileSidebarOpen(false);
              }}
              className={`flex items-center gap-4 py-2 font-semibold text-[15px] text-left cursor-pointer transition-colors ${
                activeTab === 'settings' ? 'text-(--color-accent)' : 'text-(--color-primary)/65 hover:text-(--color-primary)'
              }`}
            >
              <Settings size={20} />
              <span>Settings</span>
            </button>

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-4 py-2 font-semibold text-[15px] text-left text-red-500 hover:text-red-600 cursor-pointer transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>

          {/* Profile Completeness progress bar */}
          <div className="pt-4 border-t border-gray-100">
            <div className="flex justify-between items-center mb-2">
              <span className="text-[11px] text-(--color-accent) font-bold tracking-wider uppercase">Profile Completeness</span>
              <span className="text-[11px] text-(--color-accent) font-bold">{completeness}%</span>
            </div>
            <div className="w-full bg-(--color-gray)/50 rounded-full h-1">
              <div 
                className="bg-(--color-primary) h-1 rounded-full transition-all duration-500" 
                style={{ width: `${completeness}%` }}
              />
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main 
        className="flex-1 min-h-screen p-6 md:p-10 lg:p-12 mt-16 lg:mt-0 overflow-y-auto"
        style={{
          background: 'radial-gradient(circle at top right, #c2ebee 0%, #e2f4f5 50%, #f4fafb 100%)'
        }}
      >
        {/* Set password warning alert banner */}
        {!hasPassword && activeTab !== 'settings' && (
          <div className="mb-8 bg-(--color-primary) text-white rounded-2xl p-4 md:p-5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-lg animate-fade-in border border-white/10">
            <div className="flex items-center gap-3">
              <AlertCircle size={20} className="text-(--color-accent) shrink-0" />
              <div>
                <h4 className="font-bold text-[15px]">Secure Your Account</h4>
                <p className="text-white/80 text-[13px] mt-0.5">Please set a password to log in directly next time without OTP verification.</p>
              </div>
            </div>
            <button 
              onClick={() => setActiveTab('settings')}
              className="bg-(--color-accent) hover:bg-(--color-accent-dark) text-(--color-primary) font-bold text-[13px] px-4 py-2 rounded-xl transition-colors cursor-pointer shrink-0"
            >
              Set Password
            </button>
          </div>
        )}

        {/* Tab content rendering */}
        {activeTab === 'dashboard' && (
          <div className="animate-fade-in">
            {/* Header */}
            <div>
              <h1 className="text-[34px] md:text-[40px] font-extrabold text-(--color-primary) tracking-tight leading-tight">
                Welcome {firstName}. !!
              </h1>
              <p className="text-(--color-primary)/70 text-[16px] md:text-[17px] mt-2 font-medium">
                Please select a service to continue
              </p>
            </div>

            {/* Search and Filters bar */}
            <div className="flex gap-4 mt-8 w-full max-w-[700px] relative">
              <div className="relative flex-1">
                <Search size={20} className="absolute left-5 top-1/2 -translate-y-1/2 text-(--color-primary)/50 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search services"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#d7eaed] text-(--color-primary) placeholder-(--color-primary)/50 rounded-full py-3.5 pl-14 pr-6 outline-none border border-transparent focus:border-(--color-accent)/40 focus:bg-white/90 shadow-[0_2px_12px_rgba(24,43,79,0.02)] transition-all text-[15px]"
                />
              </div>

              {/* Filters Button */}
              <div className="relative">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-(--color-accent) hover:bg-(--color-accent-dark) text-(--color-primary) font-extrabold rounded-full px-6 py-3.5 flex items-center gap-2 cursor-pointer shadow-[0_4px_12px_rgba(47,164,169,0.15)] transition-all text-[15px]"
                >
                  <SlidersHorizontal size={18} strokeWidth={2.5} />
                  <span>Filters</span>
                </button>

                {/* Filters Dropdown */}
                {showFilters && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setShowFilters(false)} />
                    <div className="absolute right-0 mt-2 z-20 w-64 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-gray-100 p-2 animate-fade-in">
                      <p className="text-[11px] font-bold tracking-wider text-(--color-primary)/40 uppercase px-3.5 py-2">Filter by Category</p>
                      {Object.keys(categoryLabels).map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSelectedCategory(cat);
                            setShowFilters(false);
                          }}
                          className={`w-full text-left px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-colors cursor-pointer ${
                            selectedCategory === cat
                              ? 'bg-(--color-accent) text-white'
                              : 'text-(--color-primary) hover:bg-(--color-accent)/8'
                          }`}
                        >
                          {categoryLabels[cat]}
                        </button>
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Active filters indicators */}
            {selectedCategory !== 'all' && (
              <div className="flex items-center gap-2 mt-4">
                <span className="text-[12px] bg-white/80 border border-gray-100 rounded-full px-3.5 py-1.5 flex items-center gap-1.5 font-bold shadow-[0_1px_4px_rgba(0,0,0,0.01)] text-(--color-primary)">
                  Category: {categoryLabels[selectedCategory]}
                  <button 
                    onClick={() => setSelectedCategory('all')} 
                    className="hover:text-red-500 cursor-pointer w-4 h-4 flex items-center justify-center rounded-full hover:bg-gray-100"
                  >
                    <X size={12} />
                  </button>
                </span>
              </div>
            )}

            {/* Services Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mt-8">
              {filteredServices.map(service => (
                <Link
                  to={`/services/${service.id}`}
                  key={service.id}
                  className="bg-linear-to-b from-[#c0ebed]/60 to-[#a3dadc]/40 border border-white/50 backdrop-blur-sm rounded-[24px] p-6 hover:-translate-y-1.5 hover:shadow-[0_8px_32px_rgba(47,164,169,0.15)] hover:bg-[#a3dadc]/50 transition-all duration-300 flex flex-col justify-between h-[230px] cursor-pointer group"
                >
                  <div>
                    <h3 className="text-[17px] font-extrabold text-(--color-primary) leading-snug line-clamp-2">
                      {service.title}
                    </h3>
                    <p className="text-(--color-primary)/75 text-[13px] leading-relaxed line-clamp-3 mt-2">
                      {service.shortAbstract}
                    </p>
                  </div>
                  <div className="flex justify-between items-center border-t border-(--color-primary)/10 pt-3 mt-auto">
                    <span className="text-[15px] font-extrabold text-(--color-primary)">
                      ₹{service.price.toLocaleString('en-IN')}
                    </span>
                    <span className="flex items-center gap-1 text-[13px] font-extrabold text-(--color-primary) group-hover:text-(--color-accent) transition-colors">
                      Learn more 
                      <ArrowUpRight size={15} strokeWidth={2.5} className="text-(--color-accent) group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>

            {filteredServices.length === 0 && (
              <div className="bg-white/50 backdrop-blur-sm border border-white/50 rounded-[24px] p-10 text-center mt-8">
                <p className="text-(--color-primary)/60 text-[15px]">No services found matching your criteria.</p>
                <button 
                  onClick={() => { setSearchQuery(''); setSelectedCategory('all'); }} 
                  className="text-(--color-accent) hover:underline font-bold text-[14px] mt-2 cursor-pointer"
                >
                  Clear search filters
                </button>
              </div>
            )}
          </div>
        )}

        {activeTab === 'requests' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-[28px] font-extrabold text-(--color-primary)">My Service Requests</h2>
            <p className="text-(--color-primary)/70 text-[15px] mt-1 font-medium">Track your active applications and compliance filings.</p>
            
            <div className="mt-8 flex flex-col gap-4">
              {/* Request 1 */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] bg-(--color-gray) text-(--color-primary) font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">#BUA-9481</span>
                    <span className="text-[11px] bg-blue-50 text-blue-600 border border-blue-100 font-bold px-2.5 py-1 rounded-full">In Progress</span>
                    <span className="text-[12px] text-gray-400 font-medium ml-auto md:ml-2">Submitted: 24 Aug 2026</span>
                  </div>
                  <h3 className="text-[18px] font-extrabold mt-3">Startup India Registration</h3>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 max-w-md">
                    <div className="bg-(--color-accent) h-1.5 rounded-full" style={{ width: '60%' }} />
                  </div>
                  <p className="text-[12px] text-gray-500 mt-2">Stage 3 of 5: Documents under review by financial expert.</p>
                </div>
                <button 
                  onClick={() => alert('Review details for #BUA-9481')}
                  className="border border-(--color-primary)/20 hover:bg-(--color-primary)/5 text-(--color-primary) font-bold text-[13px] px-5 py-2.5 rounded-xl transition-colors cursor-pointer w-full md:w-auto shrink-0"
                >
                  Upload Documents
                </button>
              </div>

              {/* Request 2 */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] bg-(--color-gray) text-(--color-primary) font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">#BUA-8392</span>
                    <span className="text-[11px] bg-amber-50 text-amber-600 border border-amber-100 font-bold px-2.5 py-1 rounded-full">Action Required</span>
                    <span className="text-[12px] text-gray-400 font-medium ml-auto md:ml-2">Submitted: 18 Aug 2026</span>
                  </div>
                  <h3 className="text-[18px] font-extrabold mt-3">GST Registration</h3>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 max-w-md">
                    <div className="bg-amber-500 h-1.5 rounded-full" style={{ width: '30%' }} />
                  </div>
                  <p className="text-[12px] text-amber-600 font-bold mt-2 flex items-center gap-1">
                    <AlertCircle size={14} /> Additional bank verification details are required to proceed.
                  </p>
                </div>
                <button 
                  onClick={() => alert('Please upload your cancelled cheque copy.')}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl transition-colors cursor-pointer w-full md:w-auto shrink-0 shadow-sm"
                >
                  Submit Details
                </button>
              </div>

              {/* Request 3 */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                <div className="flex-1">
                  <div className="flex flex-wrap gap-2 items-center">
                    <span className="text-[11px] bg-(--color-gray) text-(--color-primary) font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">#BUA-7281</span>
                    <span className="text-[11px] bg-green-50 text-green-600 border border-green-100 font-bold px-2.5 py-1 rounded-full">Completed</span>
                    <span className="text-[12px] text-gray-400 font-medium ml-auto md:ml-2">Completed: 05 Aug 2026</span>
                  </div>
                  <h3 className="text-[18px] font-extrabold mt-3">Trademark Filing</h3>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 mt-4 max-w-md">
                    <div className="bg-green-500 h-1.5 rounded-full" style={{ width: '100%' }} />
                  </div>
                  <p className="text-[12px] text-green-600 font-bold mt-2">Application submitted and approved successfully.</p>
                </div>
                <button 
                  onClick={() => alert('Downloading Certificate...')}
                  className="bg-(--color-primary) hover:bg-(--color-primary-dark) text-white font-bold text-[13px] px-5 py-2.5 rounded-xl transition-colors cursor-pointer w-full md:w-auto shrink-0"
                >
                  Download Certificate
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-[28px] font-extrabold text-(--color-primary)">Payments & Invoices</h2>
            <p className="text-(--color-primary)/70 text-[15px] mt-1 font-medium">Manage your invoices, download receipts, and view payment history.</p>

            <div className="mt-8 bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl overflow-hidden shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-(--color-primary)/5 bg-gray-50/50">
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-(--color-primary)/50">Invoice ID</th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-(--color-primary)/50">Service Details</th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-(--color-primary)/50">Date</th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-(--color-primary)/50">Amount</th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-(--color-primary)/50">Status</th>
                      <th className="px-6 py-4 text-[12px] font-bold uppercase tracking-wider text-(--color-primary)/50">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b border-(--color-primary)/5 hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[13px]">#INV-2026-081</td>
                      <td className="px-6 py-4 text-[14px] font-semibold">GST Registration</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">18 Aug 2026</td>
                      <td className="px-6 py-4 font-bold text-[14px]">₹4,765</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex text-[11px] bg-green-50 text-green-600 border border-green-100 font-bold px-2 py-0.5 rounded-full">Paid</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => alert('Downloading invoice #INV-2026-081...')}
                          className="text-(--color-accent) hover:text-(--color-accent-dark) font-bold text-[13px] flex items-center gap-1 cursor-pointer"
                        >
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-(--color-primary)/5 hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[13px]">#INV-2026-074</td>
                      <td className="px-6 py-4 text-[14px] font-semibold">Trademark Filing</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">05 Aug 2026</td>
                      <td className="px-6 py-4 font-bold text-[14px]">₹5,850</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex text-[11px] bg-green-50 text-green-600 border border-green-100 font-bold px-2 py-0.5 rounded-full">Paid</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => alert('Downloading invoice #INV-2026-074...')}
                          className="text-(--color-accent) hover:text-(--color-accent-dark) font-bold text-[13px] flex items-center gap-1 cursor-pointer"
                        >
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                    <tr className="border-b border-(--color-primary)/5 hover:bg-white/50 transition-colors">
                      <td className="px-6 py-4 font-bold text-[13px]">#INV-2026-068</td>
                      <td className="px-6 py-4 text-[14px] font-semibold">Startup India Registration</td>
                      <td className="px-6 py-4 text-[13px] text-gray-500 font-medium">22 Jul 2026</td>
                      <td className="px-6 py-4 font-bold text-[14px]">₹3,847</td>
                      <td className="px-6 py-4">
                        <span className="inline-flex text-[11px] bg-green-50 text-green-600 border border-green-100 font-bold px-2 py-0.5 rounded-full">Paid</span>
                      </td>
                      <td className="px-6 py-4">
                        <button 
                          onClick={() => alert('Downloading invoice #INV-2026-068...')}
                          className="text-(--color-accent) hover:text-(--color-accent-dark) font-bold text-[13px] flex items-center gap-1 cursor-pointer"
                        >
                          <Download size={14} /> PDF
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="animate-fade-in max-w-4xl">
            <h2 className="text-[28px] font-extrabold text-(--color-primary)">Customer Support</h2>
            <p className="text-(--color-primary)/70 text-[15px] mt-1 font-medium">Our advisory and finance support desk is available to assist you.</p>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mt-8">
              {/* Submit Ticket Form */}
              <div className="md:col-span-7 bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-[18px] font-extrabold mb-4">Create a Support Ticket</h3>
                {supportSubmitted ? (
                  <div className="bg-(--color-gray) text-(--color-primary) rounded-2xl p-5 text-center flex flex-col items-center">
                    <CheckCircle2 size={36} className="text-(--color-accent) mb-2" />
                    <h4 className="font-extrabold text-[16px]">Ticket Submitted!</h4>
                    <p className="text-[13px] mt-1">Our financial experts will review your ticket and reply within 15 minutes.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSupportSubmit} className="flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-(--color-primary)/70">Subject</label>
                      <input 
                        type="text" 
                        required
                        value={supportSubject}
                        onChange={(e) => setSupportSubject(e.target.value)}
                        placeholder="e.g., GST document verification failed"
                        className="w-full bg-[#d7eaed]/30 px-4 py-3 rounded-xl outline-none focus:bg-white border border-transparent focus:border-(--color-accent)/40 font-medium text-[14px]"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-(--color-primary)/70">Message Details</label>
                      <textarea 
                        rows={4} 
                        required
                        value={supportMsg}
                        onChange={(e) => setSupportMsg(e.target.value)}
                        placeholder="Describe your issue or query here..."
                        className="w-full bg-[#d7eaed]/30 px-4 py-3 rounded-xl outline-none focus:bg-white border border-transparent focus:border-(--color-accent)/40 font-medium text-[14px] resize-none"
                      />
                    </div>
                    <button 
                      type="submit"
                      className="bg-(--color-primary) hover:bg-(--color-primary-dark) text-white font-bold text-[14px] py-3.5 rounded-xl transition-colors cursor-pointer text-center"
                    >
                      Submit Ticket
                    </button>
                  </form>
                )}
              </div>

              {/* Support Info & FAQ */}
              <div className="md:col-span-5 flex flex-col gap-6">
                <div className="bg-(--color-primary) text-white rounded-3xl p-6 shadow-sm">
                  <h4 className="text-[16px] font-bold text-(--color-accent)">Direct Helpline</h4>
                  <p className="text-[13px] text-white/80 mt-2">Connect instantly with our support team for urgent requests.</p>
                  
                  <div className="mt-4 flex flex-col gap-3 text-[14px] font-semibold">
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-full text-(--color-accent)">✉</span>
                      <span>support@buyuadvice.com</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-full text-(--color-accent)">📞</span>
                      <span>+91 98765 43210</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="w-5 h-5 flex items-center justify-center bg-white/10 rounded-full text-(--color-accent)">🕒</span>
                      <span>9:30 AM - 6:30 PM (Mon-Sat)</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white/50 backdrop-blur-sm border border-white/50 rounded-3xl p-6">
                  <h4 className="font-extrabold text-[15px] mb-3">Common Questions</h4>
                  <div className="flex flex-col gap-3 text-[13px] font-medium text-(--color-primary)/80">
                    <p className="pb-2.5 border-b border-(--color-primary)/5">
                      <span className="font-bold text-(--color-primary) block">What is the verification turnaround time?</span>
                      Usually, document audits are completed within 4-12 hours of upload.
                    </p>
                    <p>
                      <span className="font-bold text-(--color-primary) block">How do I download my payment receipts?</span>
                      Go to the Payments tab and click the "PDF" link beside the transaction.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'services' && (
          <div className="animate-fade-in">
            <h2 className="text-[28px] font-extrabold text-(--color-primary)">All Services</h2>
            <p className="text-(--color-primary)/70 text-[15px] mt-1 font-medium">Browse our full catalog of company compliance and registration services.</p>
            
            {data && data.services && Object.entries(data.services).map(([cat, items]) => (
              <div key={cat} className="mt-8 bg-white/40 backdrop-blur-sm border border-white/50 rounded-3xl p-6 md:p-8">
                <h3 className="text-[20px] font-extrabold border-b border-(--color-primary)/10 pb-2 mb-6 capitalize text-(--color-primary)">
                  {categoryLabels[cat] || cat}
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {items.map(service => (
                    <Link
                      to={`/services/${service.id}`}
                      key={service.id}
                      className="bg-white hover:bg-(--color-gray)/20 border border-gray-100 hover:border-(--color-accent)/40 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[200px] cursor-pointer group"
                    >
                      <div>
                        <h4 className="text-[15px] font-bold text-(--color-primary) group-hover:text-(--color-accent) transition-colors line-clamp-2">
                          {service.title}
                        </h4>
                        <p className="text-gray-500 text-[12px] mt-2 line-clamp-3 leading-relaxed">
                          {service.shortAbstract}
                        </p>
                      </div>
                      <div className="flex justify-between items-center pt-2 mt-auto">
                        <span className="text-[14px] font-bold">₹{service.price.toLocaleString('en-IN')}</span>
                        <ChevronRight size={16} className="text-(--color-accent) group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="animate-fade-in max-w-2xl">
            <h2 className="text-[28px] font-extrabold text-(--color-primary)">Account Settings</h2>
            <p className="text-(--color-primary)/70 text-[15px] mt-1 font-medium">Update your account details and manage security credentials.</p>

            <div className="mt-8 flex flex-col gap-6">
              {/* Profile Details Form */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 md:p-8 shadow-sm">
                <h3 className="text-[18px] font-extrabold mb-4">Profile Details</h3>
                <div className="flex flex-col gap-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-(--color-primary)/70">Full Name</label>
                      <input 
                        type="text" 
                        disabled 
                        value={user.name || ''}
                        className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 font-semibold text-[14px] text-gray-500 outline-none"
                      />
                    </div>
                    <div className="flex flex-col gap-2">
                      <label className="text-[13px] font-bold text-(--color-primary)/70">Email Address</label>
                      <input 
                        type="email" 
                        disabled 
                        value={user.email || ''}
                        className="w-full bg-gray-50 px-4 py-3 rounded-xl border border-gray-100 font-semibold text-[14px] text-gray-500 outline-none"
                      />
                    </div>
                  </div>
                  <p className="text-[12px] text-gray-400">Account profiles are linked to google auth, basic details cannot be modified directly.</p>
                </div>
              </div>

              {/* Set/Change Password Section */}
              <div className="bg-white/80 backdrop-blur-sm border border-white/50 rounded-3xl p-6 md:p-8 shadow-sm">
                <div className="flex items-center gap-2.5 mb-4">
                  <Lock size={20} className="text-(--color-accent)" />
                  <h3 className="text-[18px] font-extrabold">Account Password</h3>
                </div>
                
                {pwSuccess && (
                  <div className="mb-4 bg-green-50 border border-green-200 text-green-700 rounded-xl p-3.5 text-[14px] font-semibold flex items-center gap-2">
                    <CheckCircle2 size={16} /> {pwSuccess}
                  </div>
                )}

                {showSetPassword ? (
                  <div className="flex flex-col gap-4">
                    <p className="text-[13px] text-gray-500">Create a password so you can login directly with your email next time without waiting for an OTP.</p>

                    <div className="relative">
                      <input
                        type={showPw ? 'text' : 'password'}
                        placeholder="Create a password"
                        value={password}
                        onChange={(e) => { setPassword(e.target.value); setPwError(''); }}
                        className="w-full px-4 pr-12 py-3 bg-[#d7eaed]/30 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-(--color-accent)/40 font-medium text-[14px]"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowPw(!showPw)} 
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="relative">
                      <input
                        type={showConfirm ? 'text' : 'password'}
                        placeholder="Confirm your password"
                        value={confirmPassword}
                        onChange={(e) => { setConfirmPassword(e.target.value); setPwError(''); }}
                        onKeyDown={(e) => { if (e.key === 'Enter') handleSetPassword(); }}
                        className="w-full px-4 pr-12 py-3 bg-[#d7eaed]/30 border border-transparent rounded-xl focus:outline-none focus:bg-white focus:border-(--color-accent)/40 font-medium text-[14px]"
                      />
                      <button 
                        type="button" 
                        onClick={() => setShowConfirm(!showConfirm)} 
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
                      >
                        {showConfirm ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <p className="text-[12px] text-gray-400">Password must be at least 8 characters</p>

                    {pwError && <p className="text-red-500 text-[13px] font-semibold">{pwError}</p>}

                    <div className="flex gap-3">
                      <button
                        onClick={handleSetPassword}
                        disabled={pwLoading || !password.trim() || !confirmPassword.trim()}
                        className="flex-1 bg-(--color-primary) hover:bg-(--color-primary-dark) text-white rounded-xl py-3 font-semibold transition-colors text-[14px] cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        {pwLoading ? 'Saving...' : 'Save Password'}
                      </button>
                      <button
                        onClick={() => setShowSetPassword(false)}
                        className="px-5 py-3 border border-gray-200 hover:bg-gray-50 text-gray-600 rounded-xl text-[14px] cursor-pointer font-semibold transition-colors"
                      >
                        Skip
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    {hasPassword ? (
                      <div className="flex flex-col gap-3">
                        <div className="flex justify-between items-center bg-gray-50 rounded-2xl p-4 border border-gray-100">
                          <div>
                            <span className="text-[14px] font-bold block">Password Set</span>
                            <span className="text-[12px] text-gray-400">Your account is fully secured.</span>
                          </div>
                          <button 
                            onClick={() => { setShowSetPassword(true); setPwSuccess(''); }}
                            className="text-(--color-accent) hover:underline font-bold text-[13px] cursor-pointer"
                          >
                            Change Password
                          </button>
                        </div>
                      </div>
                    ) : (
                      <button
                        onClick={() => { setShowSetPassword(true); setPwSuccess(''); }}
                        className="bg-(--color-primary) hover:bg-(--color-primary-dark) text-white rounded-xl py-3 px-6 font-semibold transition-colors cursor-pointer text-[14px]"
                      >
                        Set Password
                      </button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
