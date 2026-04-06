import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  GraduationCap, BookOpen, Users, BarChart3, Bell, FileText,
  CheckCircle2, ArrowRight, Star, Shield, Zap, Globe,
  ChevronDown, ChevronUp, Play, Building2, Clock, TrendingUp,
  MessageSquare, Award, Heart, Menu, X, Sparkles, Calculator,
  Calendar, CreditCard, Phone, Mail, MapPin
} from 'lucide-react';

// ─── Data ────────────────────────────────────────────────────────────────────

const FEATURES = [
  {
    icon: GraduationCap,
    title: 'Student Management',
    desc: 'Comprehensive student profiles, academic history, attendance tracking. Everything centralized in one click.',
    color: 'from-amber-500 to-orange-500',
    stats: '150+ custom fields',
  },
  {
    icon: BookOpen,
    title: 'Classes & Schedules',
    desc: 'Create your Quran, Arabic, or Fiqh classes. Manage schedules with drag & drop.',
    color: 'from-blue-500 to-indigo-500',
    stats: 'Up to 10 classes included',
  },
  {
    icon: BarChart3,
    title: 'Analytics & Reports',
    desc: 'Visual dashboards, attendance rates, student progress. Real-time data.',
    color: 'from-emerald-500 to-teal-500',
    stats: '20+ report types',
  },
  {
    icon: CreditCard,
    title: 'Automated Billing',
    desc: 'Generate and send invoices. Payment tracking. Automatic reminders.',
    color: 'from-purple-500 to-pink-500',
    stats: '100% automated',
  },
  {
    icon: Bell,
    title: 'Parent Communication',
    desc: 'Push notifications, SMS, email. Keep families informed in real time.',
    color: 'from-rose-500 to-red-500',
    stats: '3 communication channels',
  },
  {
    icon: Sparkles,
    title: 'Integrated AI Assistant',
    desc: 'An AI copilot to draft reports, analyze trends, and advise you.',
    color: 'from-cyan-500 to-blue-500',
    stats: 'Powered by Ollama',
  },
];

const TESTIMONIALS = [
  {
    name: 'Sheikh Abdallah Benali',
    role: 'Director — Al-Nour Institute, Lyon',
    content: 'Since we started using Madrassa, we\'ve saved 8 hours a week on administration. Parents are thrilled to receive report cards instantly.',
    rating: 5,
    students: '180 students',
  },
  {
    name: 'Fatima Ez-Zahra Ouali',
    role: 'Head of Education — Al-Firdaws, Marseille',
    content: 'The attendance management tool is revolutionary. We see everything in real time and can contact parents directly from the platform.',
    rating: 5,
    students: '95 students',
  },
  {
    name: 'Rachid Hammoudi',
    role: 'Founder — Sabil Quranic School, Paris',
    content: 'Automated billing has changed our daily lives. No more Excel spreadsheets, no more manual reminders. Everything is managed cleanly.',
    rating: 5,
    students: '220 students',
  },
];

const FAQS = [
  {
    q: 'Can we import our existing data?',
    a: 'Yes, we offer CSV/Excel imports for your student and teacher lists. Our team helps you migrate your data for free.',
  },
  {
    q: 'Is my data secure?',
    a: 'Absolutely. Your data is hosted in Europe (GDPR compliant), encrypted in transit and at rest. Each school has its data completely isolated (multitenant architecture).',
  },
  {
    q: 'What happens if I have more than 10 classes?',
    a: 'With the Pro plan, you start with 10 classes included. Each additional class is billed at €15/month. You only pay for what you actually use.',
  },
  {
    q: 'Is this available in Arabic?',
    a: 'The interface is available in English and French, and an Arabic version is under development. Data (names, grades) can be entered in Arabic right now.',
  },
  {
    q: 'Is there a long-term commitment?',
    a: 'No, there is no commitment. The subscription is monthly and can be canceled at any time. You can export your data at any time.',
  },
  {
    q: 'How long is the free trial?',
    a: '30-day full trial, no credit card required. All Pro features are available during the trial period.',
  },
];

const PLANS = [
  {
    id: 'starter',
    name: 'Starter',
    desc: 'To get started risk-free',
    monthly: 0,
    yearly: 0,
    highlight: false,
    badge: null,
    features: [
      'Up to 10 classes',
      '150 students maximum',
      'Attendance management',
      'Basic grades & reports',
      'Email support',
    ],
    missing: ['Automated billing', 'AI Assistant', 'Advanced analytics'],
    cta: 'Start for free',
    ctaStyle: 'border border-white/20 text-white hover:bg-white/5',
    planKey: 'starter',
  },
  {
    id: 'pro',
    name: 'Pro',
    desc: 'Most popular for active schools',
    monthly: 49,
    yearly: 39,
    highlight: true,
    badge: '🔥 Popular',
    billingNote: '+ €8/additional class',
    features: [
      '10 classes included',
      'Unlimited students',
      'Automated billing',
      'Integrated AI Assistant',
      'Comprehensive analytics',
      'Parent notifications',
      'Priority support',
    ],
    missing: [],
    cta: 'Try 30 days for free',
    ctaStyle: 'bg-gradient-to-r from-amber-500 to-orange-500 text-black hover:from-amber-400 hover:to-orange-400',
    planKey: 'pro',
  },
  {
    id: 'institution',
    name: 'Institution',
    desc: 'For multi-campus networks',
    monthly: 199,
    yearly: 159,
    highlight: false,
    badge: '✦ Enterprise',
    features: [
      'Unlimited classes',
      'Multi-campus',
      'Full white label',
      'Custom domain',
      'API & integrations',
      'Dedicated server',
      '24/7 support',
      'Training included',
    ],
    missing: [],
    cta: 'Contact sales',
    ctaStyle: 'border border-purple-500/50 text-purple-300 hover:bg-purple-500/10',
    planKey: 'institution',
  },
];

// ─── ROI Calculator ───────────────────────────────────────────────────────────

function ROICalculator() {
  const [students, setStudents] = useState(80);
  const [classes, setClasses] = useState(6);
  const [adminHours, setAdminHours] = useState(10);

  const hourlyRate = 20; // €/h
  const savedHours = Math.round(adminHours * 0.65);
  const savedMoney = savedHours * hourlyRate * 4; // par mois
  const plan = classes <= 10 ? 49 : 49 + (classes - 10) * 8;
  const roi = Math.round(((savedMoney - plan) / plan) * 100);

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-8 backdrop-blur">
      <div className="grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Number of students: <span className="text-amber-400 font-bold">{students}</span>
            </label>
            <input type="range" min="20" max="500" value={students}
              onChange={e => setStudents(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Number of classes: <span className="text-amber-400 font-bold">{classes}</span>
            </label>
            <input type="range" min="1" max="30" value={classes}
              onChange={e => setClasses(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer" />
          </div>
          <div>
            <label className="text-sm font-medium text-slate-300 block mb-2">
              Admin hours/week: <span className="text-amber-400 font-bold">{adminHours}h</span>
            </label>
            <input type="range" min="2" max="30" value={adminHours}
              onChange={e => setAdminHours(Number(e.target.value))}
              className="w-full accent-amber-500 cursor-pointer" />
          </div>
        </div>

        <div className="space-y-4">
          <div className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 border border-amber-500/30 rounded-2xl p-6 text-center">
            <p className="text-slate-400 text-sm mb-1">Hours saved/week</p>
            <p className="text-4xl font-black text-amber-400">{savedHours}h</p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Savings/month</p>
              <p className="text-xl font-black text-emerald-400">{savedMoney}€</p>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/20 rounded-xl p-4 text-center">
              <p className="text-xs text-slate-400 mb-1">Plan cost</p>
              <p className="text-xl font-black text-purple-300">{plan}€</p>
            </div>
          </div>
          <div className="bg-white/10 border border-white/20 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-300">Return on Investment</p>
            <p className="text-3xl font-black text-white mt-1">
              {roi > 0 ? `+${roi}%` : `${roi}%`}
            </p>
            <p className="text-xs text-slate-500 mt-1">Estimated monthly ROI</p>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Landing Page ────────────────────────────────────────────────────────

export default function LandingPage() {
  const navigate = useNavigate();
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenu(false);
  };

  const handlePlanCTA = (planKey: string) => {
    if (planKey === 'starter') navigate('/register');
    else if (planKey === 'institution') navigate('/contact');
    else navigate(`/checkout?plan=${planKey}`);
  };

  return (
    <div className="min-h-screen bg-[#080c14] text-white font-sans overflow-x-hidden">

      {/* ── Navbar ────────────────────────────────────────────────────── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'bg-black/80 backdrop-blur border-b border-white/10' : 'bg-transparent'
      }`}>
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
              <GraduationCap className="w-5 h-5 text-white" />
            </div>
            <span className="font-black text-lg tracking-tight">Madrassa<span className="text-amber-400">.</span></span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {[['Features', 'features'], ['ROI', 'roi'], ['Pricing', 'pricing'], ['FAQ', 'faq']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="text-sm text-slate-400 hover:text-white transition-colors">
                {label}
              </button>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-3">
            <button onClick={() => navigate('/login')}
              className="text-sm text-slate-400 hover:text-white transition-colors px-4 py-2">
              Login
            </button>
            <button onClick={() => navigate('/register')}
              className="px-5 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl text-sm hover:from-amber-400 hover:to-orange-400 transition-all shadow-lg shadow-amber-500/25">
              Free Trial →
            </button>
          </div>

          <button onClick={() => setMobileMenu(!mobileMenu)} className="md:hidden p-2">
            {mobileMenu ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {mobileMenu && (
          <div className="md:hidden bg-black/95 border-t border-white/10 px-6 py-4 space-y-3">
            {[['Features', 'features'], ['ROI', 'roi'], ['Pricing', 'pricing'], ['FAQ', 'faq']].map(([label, id]) => (
              <button key={id} onClick={() => scrollTo(id)}
                className="block w-full text-left text-slate-300 py-2 text-sm">
                {label}
              </button>
            ))}
            <button onClick={() => navigate('/register')}
              className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-bold rounded-xl text-sm">
              Start 30-Day Free Trial
            </button>
          </div>
        )}
      </nav>

      {/* ── Hero ──────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl animate-pulse delay-1000" />
          <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        </div>

        <div className="relative max-w-7xl mx-auto px-6 py-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-full text-amber-400 text-sm font-medium mb-8">
            <Sparkles className="w-4 h-4" />
            Management Platform for Islamic Schools
          </div>

          <h1 className="text-5xl md:text-7xl font-black tracking-tighter leading-none mb-6">
            Manage your<br />
            <span className="bg-gradient-to-r from-amber-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
              Quranic School
            </span>
            {' '}without stress
          </h1>

          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            From student management to billing, absences, and report cards—
            everything your school needs, built in a platform designed for Islamic education.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <button
              onClick={() => navigate('/register')}
              id="hero-cta-btn"
              className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-2xl text-lg hover:from-amber-400 hover:to-orange-400 transition-all shadow-2xl shadow-amber-500/30 flex items-center gap-2 group"
            >
              Démarrer gratuitement
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => scrollTo('features')}
              className="px-8 py-4 border border-white/20 text-white font-bold rounded-2xl text-lg hover:bg-white/5 transition-all flex items-center gap-2"
            >
              <Play className="w-4 h-4" />
              Voir la démo
            </button>
          </div>

          {/* Stats bar */}
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 text-center">
            {[
              { value: '500+', label: 'Students gérés' },
              { value: '30+', label: 'Établissements' },
              { value: '8h', label: 'Économisées/semaine' },
              { value: '99.9%', label: 'Disponibilité' },
            ].map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl font-black text-white">{value}</p>
                <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Social Proof — Logos ──────────────────────────────────────── */}
      <section className="py-12 border-y border-white/5 bg-white/2">
        <div className="max-w-5xl mx-auto px-6">
          <p className="text-center text-slate-600 text-sm uppercase tracking-widest mb-8">
            Trusted by schools worldwide
          </p>
          <div className="flex flex-wrap items-center justify-center gap-12">
            {['Institut Al-Nour', 'École Al-Firdaws', 'Madrassa Sabil', 'Centre Ibn Rushd', 'Al-Houda Lyon'].map(name => (
              <div key={name} className="flex items-center gap-2 opacity-40 hover:opacity-70 transition-opacity">
                <Building2 className="w-4 h-4 text-amber-400" />
                <span className="text-slate-300 font-medium text-sm">{name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ──────────────────────────────────────────────────── */}
      <section id="features" className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3">Fonctionnalités</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              Tout ce dont votre école<br />a besoin
            </h2>
            <p className="text-slate-400 mt-4 max-w-xl mx-auto">
              Conçu spécifiquement pour les écoles coraniques et d'enseignement islamique.
              Pas un outil générique adapté — une vraie solution métier.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, desc, color, stats }) => (
              <div key={title}
                className="group bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 hover:border-white/20 transition-all duration-300 hover:-translate-y-1">
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 shadow-lg`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-lg font-bold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed mb-4">{desc}</p>
                <div className="flex items-center gap-1 text-xs text-amber-400 font-medium">
                  <Zap className="w-3 h-3" />
                  {stats}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── ROI Calculator ────────────────────────────────────────────── */}
      <section id="roi" className="py-24 px-6 bg-gradient-to-b from-transparent to-white/2">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3">ROI Calculator</p>
            <h2 className="text-4xl font-black tracking-tighter">
              How much will you save?
            </h2>
            <p className="text-slate-400 mt-4">
              School directors save on average 65% of their administrative time.
            </p>
          </div>
          <ROICalculator />
        </div>
      </section>

      {/* ── Testimonials ─────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3">Témoignages</p>
            <h2 className="text-4xl font-black tracking-tighter">Ils en parlent mieux que nous</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ name, role, content, rating, students }) => (
              <div key={name}
                className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/8 transition-all">
                <div className="flex gap-1 mb-4">
                  {Array.from({ length: rating }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-5">"{content}"</p>
                <div className="border-t border-white/10 pt-4 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-white text-sm">{name}</p>
                    <p className="text-slate-500 text-xs mt-0.5">{role}</p>
                  </div>
                  <span className="text-xs bg-amber-500/20 text-amber-400 px-2 py-1 rounded-full font-medium">
                    {students}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Pricing ───────────────────────────────────────────────────── */}
      <section id="pricing" className="py-24 px-6 bg-gradient-to-b from-transparent to-white/2">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3">Tarifs</p>
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter">
              Simple et transparent
            </h2>
            <p className="text-slate-400 mt-4">30 jours d'essai gratuit. Sans carte bancaire.</p>

            {/* Toggle mensuel/annuel */}
            <div className="inline-flex items-center mt-6 bg-white/5 border border-white/10 rounded-2xl p-1">
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all ${
                  billingCycle === 'monthly' ? 'bg-white text-black' : 'text-slate-400'
                }`}
              >
                Mensuel
              </button>
              <button
                onClick={() => setBillingCycle('yearly')}
                className={`px-5 py-2 rounded-xl text-sm font-bold transition-all flex items-center gap-2 ${
                  billingCycle === 'yearly' ? 'bg-white text-black' : 'text-slate-400'
                }`}
              >
                Annuel
                <span className="text-emerald-400 text-xs font-black">-20%</span>
              </button>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6 items-stretch">
            {PLANS.map(plan => {
              const price = billingCycle === 'yearly' ? plan.yearly : plan.monthly;

              return (
                <div key={plan.id}
                  className={`relative rounded-3xl p-8 flex flex-col transition-all duration-300 ${
                    plan.highlight
                      ? 'bg-gradient-to-b from-amber-500/15 to-orange-500/10 border-2 border-amber-500/40 shadow-2xl shadow-amber-500/10'
                      : 'bg-white/5 border border-white/10 hover:bg-white/8'
                  }`}
                >
                  {plan.badge && (
                    <div className={`absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-black ${
                      plan.highlight ? 'bg-amber-500 text-black' : 'bg-purple-500/80 text-white'
                    }`}>
                      {plan.badge}
                    </div>
                  )}

                  <div className="mb-6">
                    <h3 className="text-xl font-black text-white">{plan.name}</h3>
                    <p className="text-slate-400 text-sm mt-1">{plan.desc}</p>
                  </div>

                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      <span className="text-5xl font-black text-white">{price === 0 ? 'Gratuit' : `${price}€`}</span>
                      {price > 0 && <span className="text-slate-400 text-sm">/mois</span>}
                    </div>
                    {plan.billingNote && (
                      <p className="text-amber-400 text-xs mt-1 font-medium">{plan.billingNote}</p>
                    )}
                    {billingCycle === 'yearly' && price > 0 && (
                      <p className="text-emerald-400 text-xs mt-1">
                        Soit {price * 12}€/an · économisez {(plan.monthly - plan.yearly) * 12}€
                      </p>
                    )}
                  </div>

                  <ul className="space-y-3 mb-6 flex-1">
                    {plan.features.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-300">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                        {f}
                      </li>
                    ))}
                    {plan.missing.map(f => (
                      <li key={f} className="flex items-center gap-2 text-sm text-slate-600">
                        <div className="w-4 h-4 rounded-full border border-slate-600 shrink-0" />
                        {f}
                      </li>
                    ))}
                  </ul>

                  {/* Badges de confiance */}
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    {['RGPD', 'EU', 'SSL'].map(b => (
                      <span key={b} className="text-[10px] text-slate-500 border border-slate-700 rounded px-1.5 py-0.5 font-medium">
                        {b}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => handlePlanCTA(plan.planKey)}
                    id={`plan-cta-${plan.id}`}
                    className={`w-full py-3.5 rounded-xl font-black text-sm transition-all ${plan.ctaStyle}`}
                  >
                    {plan.cta}
                  </button>
                </div>
              );
            })}
          </div>

          <p className="text-center text-slate-500 text-xs mt-8">
            Tous les prix sont HT. TVA applicable selon législation en vigueur.
          </p>
        </div>
      </section>

      {/* ── FAQ ───────────────────────────────────────────────────────── */}
      <section id="faq" className="py-24 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="text-amber-400 text-sm font-bold uppercase tracking-widest mb-3">FAQ</p>
            <h2 className="text-4xl font-black tracking-tighter">Questions fréquentes</h2>
          </div>

          <div className="space-y-3">
            {FAQS.map(({ q, a }, i) => (
              <div key={i}
                className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden">
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full flex items-center justify-between px-6 py-5 text-left hover:bg-white/5 transition-colors"
                >
                  <span className="font-bold text-white text-sm pr-4">{q}</span>
                  {openFaq === i
                    ? <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    : <ChevronDown className="w-4 h-4 text-slate-500 shrink-0" />}
                </button>
                {openFaq === i && (
                  <div className="px-6 pb-5 text-slate-400 text-sm leading-relaxed border-t border-white/10 pt-4">
                    {a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Final CTA ─────────────────────────────────────────────────── */}
      <section className="py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <div className="relative bg-gradient-to-br from-amber-500/20 to-orange-500/10 border border-amber-500/20 rounded-3xl p-12 overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-px bg-gradient-to-r from-transparent via-amber-500 to-transparent" />
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl" />

            <div className="relative">
              <div className="inline-flex items-center gap-2 mb-4 text-amber-400 text-sm font-medium">
                <Heart className="w-4 h-4 fill-amber-400" />
                Conçu pour les écoles islamiques
              </div>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-4">
                Prêt à transformer<br />votre école ?
              </h2>
              <p className="text-slate-400 mb-8 max-w-lg mx-auto">
                Rejoignez les dizaines d'écoles qui ont simplifié leur gestion administrative.
                Essai gratuit 30 jours, aucune carte bancaire requise.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <button
                  onClick={() => navigate('/register')}
                  id="final-cta-btn"
                  className="px-8 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-black font-black rounded-2xl hover:from-amber-400 hover:to-orange-400 transition-all shadow-2xl shadow-amber-500/30 flex items-center gap-2 text-lg"
                >
                  Commencer gratuitement
                  <ArrowRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => navigate('/contact')}
                  className="px-8 py-4 border border-white/20 text-white font-bold rounded-2xl hover:bg-white/5 transition-all text-lg flex items-center gap-2"
                >
                  <Phone className="w-4 h-4" />
                  Demander une démo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ────────────────────────────────────────────────────── */}
      <footer className="border-t border-white/5 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                  <GraduationCap className="w-4 h-4 text-white" />
                </div>
                <span className="font-black">Madrassa<span className="text-amber-400">.</span></span>
              </div>
              <p className="text-slate-500 text-sm">
                Plateforme de gestion pour écoles islamiques et coraniques.
              </p>
            </div>
            {[
              { title: 'Produit', links: ['Fonctionnalités', 'Tarifs', 'Documentation', 'Changelog'] },
              { title: 'Entreprise', links: ['À propos', 'Blog', 'Carrières', 'Contact'] },
              { title: 'Légal', links: ['Confidentialité', 'CGU', 'RGPD', 'Cookies'] },
            ].map(({ title, links }) => (
              <div key={title}>
                <p className="font-bold text-sm text-slate-200 mb-3">{title}</p>
                <ul className="space-y-2">
                  {links.map(link => (
                    <li key={link}>
                      <a href="#" className="text-slate-500 text-sm hover:text-slate-300 transition-colors">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="border-t border-white/5 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-slate-600 text-xs">© 2026 Madrassa. Tous droits réservés.</p>
            <div className="flex items-center gap-4 text-xs text-slate-600">
              <span className="flex items-center gap-1"><Shield className="w-3 h-3" /> RGPD</span>
              <span className="flex items-center gap-1"><Globe className="w-3 h-3" /> Hébergé en EU</span>
              <span className="flex items-center gap-1"><Award className="w-3 h-3" /> SSL/TLS</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
