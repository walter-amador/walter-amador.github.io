import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Cloud,
  Code2,
  Cpu,
  Database,
  ExternalLink,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  Moon,
  Search,
  Sun,
  Terminal,
} from 'lucide-react';

import { certificates as certificatesData } from '../data/certificates';
import { content } from '../data/content';
import {
  deriveTopics,
  formatMonthYear,
  issuerMeta,
} from '../lib/certificates-ui';
import { EducationSection } from '../components/EducationSection';

/**
 * ANIMATED BACKGROUND COMPONENT
 * Creates moving blurred orbs for a dynamic background effect.
 */
const AnimatedBackground = () => (
  <div className='pointer-events-none fixed inset-0 z-0 overflow-hidden'>
    <div className='absolute left-[-10%] top-[-10%] h-[50vw] w-[50vw] rounded-full bg-blue-500/20 blur-[80px] mix-blend-multiply animate-blob md:blur-[120px] dark:bg-blue-600/10 dark:mix-blend-screen' />
    <div className='animation-delay-2000 absolute right-[-10%] top-[20%] h-[40vw] w-[40vw] rounded-full bg-purple-500/20 blur-[80px] mix-blend-multiply animate-blob md:blur-[120px] dark:bg-purple-600/10 dark:mix-blend-screen' />
    <div className='animation-delay-4000 absolute bottom-[-20%] left-[20%] h-[60vw] w-[60vw] rounded-full bg-indigo-500/20 blur-[80px] mix-blend-multiply animate-blob md:blur-[120px] dark:bg-indigo-600/10 dark:mix-blend-screen' />
  </div>
);

/**
 * 3D TECH CONSTELLATION COMPONENT
 * A 3D interactive element that rotates based on mouse position.
 * Replaces the static icon/mascot.
 */
const TechConstellation = ({ mouseX, mouseY }) => {
  const rotateY = (mouseX - 0.5) * 30;
  const rotateX = (0.5 - mouseY) * 30;

  const containerStyle = {
    transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
    transformStyle: 'preserve-3d',
  };

  return (
    <div
      className='relative flex h-64 w-64 items-center justify-center md:h-80 md:w-80'
      style={containerStyle}
      aria-hidden='true'
    >
      <div
        className='absolute flex h-32 w-32 items-center justify-center rounded-2xl border border-blue-400/30 bg-gradient-to-br from-blue-600 to-indigo-700 text-white shadow-2xl backdrop-blur-sm'
        style={{ transform: 'translateZ(40px)' }}
      >
        <Terminal className='h-16 w-16' />
      </div>

      <div
        className='absolute -right-4 -top-4 flex h-16 w-16 items-center justify-center rounded-xl border border-slate-600 bg-slate-800 text-orange-400 shadow-xl dark:bg-slate-700'
        style={{ transform: 'translateZ(80px)' }}
      >
        <Cloud className='h-8 w-8' />
      </div>

      <div
        className='absolute -bottom-8 -left-2 flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white text-purple-500 shadow-xl dark:border-slate-600 dark:bg-slate-800'
        style={{ transform: 'translateZ(60px)' }}
      >
        <Cpu className='h-10 w-10' />
      </div>

      <div
        className='absolute -right-12 top-1/2 flex h-14 w-14 -translate-y-1/2 items-center justify-center rounded-lg border border-slate-300 bg-slate-100 text-green-500 shadow-lg dark:border-slate-700 dark:bg-slate-900'
        style={{ transform: 'translateZ(20px)' }}
      >
        <Database className='h-7 w-7' />
      </div>

      <div
        className='pointer-events-none absolute inset-0 animate-spin-slow rounded-full border-2 border-dashed border-blue-500/20'
        style={{ transform: 'translateZ(-20px) scale(1.4)' }}
      />
    </div>
  );
};

function CertificatesSection({ darkMode, language, title, subtitle }) {
  const PAGE_SIZE = 6;

  const locale = content[language] ?? content.en;

  const allCertificates = React.useMemo(() => {
    return (certificatesData ?? [])
      .map((c) => ({
        ...c,
        topics: deriveTopics(c),
        issuedTs: new Date(c.issuedOn).getTime(),
      }))
      .filter((c) => !Number.isNaN(c.issuedTs));
  }, []);

  const allIssuers = React.useMemo(() => {
    return Array.from(new Set(allCertificates.map((c) => c.issuer))).sort(
      (a, b) => (a ?? '').localeCompare(b ?? '')
    );
  }, [allCertificates]);

  const allTopics = React.useMemo(() => {
    const set = new Set();
    for (const c of allCertificates) {
      for (const t of c.topics ?? []) set.add(t);
    }
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  }, [allCertificates]);

  const [query, setQuery] = useState('');
  const [selectedIssuers, setSelectedIssuers] = useState(() => new Set());
  const [selectedTopics, setSelectedTopics] = useState(() => new Set());
  const [sort, setSort] = useState('latest'); // latest | oldest
  const [page, setPage] = useState(0);

  const filtered = React.useMemo(() => {
    const q = query.trim().toLowerCase();
    const issuersActive = selectedIssuers.size > 0;
    const topicsActive = selectedTopics.size > 0;

    const result = allCertificates.filter((c) => {
      if (issuersActive && !selectedIssuers.has(c.issuer)) return false;
      if (topicsActive) {
        const hasTopic = (c.topics ?? []).some((t) => selectedTopics.has(t));
        if (!hasTopic) return false;
      }

      if (!q) return true;
      const haystack = [
        c.title,
        c.issuer,
        c.credentialId,
        ...(c.skills ?? []),
        ...(c.topics ?? []),
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return haystack.includes(q);
    });

    result.sort((a, b) => {
      if (sort === 'oldest') return a.issuedTs - b.issuedTs;
      return b.issuedTs - a.issuedTs;
    });

    return result;
  }, [allCertificates, query, selectedIssuers, selectedTopics, sort]);

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const clampedPage = Math.min(page, pageCount - 1);
  const pageItems = filtered.slice(
    clampedPage * PAGE_SIZE,
    clampedPage * PAGE_SIZE + PAGE_SIZE
  );

  useEffect(() => {
    setPage(0);
  }, [query, selectedIssuers, selectedTopics, sort]);

  useEffect(() => {
    if (page !== clampedPage) setPage(clampedPage);
  }, [page, clampedPage]);

  const chipBase =
    'cursor-pointer select-none rounded-full px-3 py-1 text-sm font-medium transition-colors';

  const chipOn = darkMode
    ? 'bg-blue-900/30 text-blue-300'
    : 'bg-blue-100 text-blue-700';
  const chipOff = darkMode
    ? 'bg-slate-800 text-slate-300 hover:bg-slate-700'
    : 'bg-slate-100 text-slate-700 hover:bg-slate-200';

  const toggleChip = (set, value) => {
    set((prev) => {
      const next = new Set(prev);
      if (next.has(value)) next.delete(value);
      else next.add(value);
      return next;
    });
  };

  return (
    <div>
      <div className='mb-6 flex flex-col gap-3 md:flex-row md:items-end md:justify-between'>
        <div>
          <h2
            className={`text-3xl font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {title}
          </h2>
          <p
            className={`mt-2 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}
          >
            {subtitle}
          </p>
        </div>

        <div
          className={`rounded-full px-4 py-2 text-sm font-medium ${
            darkMode
              ? 'bg-slate-800 text-slate-300'
              : 'bg-slate-100 text-slate-700'
          }`}
        >
          {filtered.length} {locale.shownWord} · {allCertificates.length}{' '}
          {locale.totalWord}
        </div>
      </div>

      <div className='mb-6 grid gap-4 lg:grid-cols-3'>
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 ${
            darkMode
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white'
          }`}
        >
          <Search
            className={`h-4 w-4 ${
              darkMode ? 'text-slate-400' : 'text-slate-500'
            }`}
          />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={locale.searchPlaceholder}
            className={`w-full bg-transparent text-sm outline-none ${
              darkMode
                ? 'text-slate-200 placeholder:text-slate-500'
                : 'text-slate-900 placeholder:text-slate-400'
            }`}
            aria-label={locale.searchAria}
          />
        </div>

        <div
          className={`flex items-center justify-between gap-3 rounded-xl border px-4 py-3 ${
            darkMode
              ? 'border-slate-700 bg-slate-900'
              : 'border-slate-200 bg-white'
          }`}
        >
          <span
            className={`text-sm font-semibold ${
              darkMode ? 'text-slate-200' : 'text-slate-800'
            }`}
          >
            {locale.sortLabel}
          </span>
          <select
            value={sort}
            onChange={(e) => setSort(e.target.value)}
            className={`rounded-lg border px-3 py-2 text-sm outline-none ${
              darkMode
                ? 'border-slate-700 bg-slate-950 text-slate-200'
                : 'border-slate-200 bg-white text-slate-900'
            }`}
            aria-label={locale.sortAria}
          >
            <option value='latest'>{locale.sortLatest}</option>
            <option value='oldest'>{locale.sortOldest}</option>
          </select>
        </div>
      </div>

      <div className='mb-6 grid gap-4 lg:grid-cols-2'>
        <div
          className={`rounded-2xl border p-4 ${
            darkMode
              ? 'border-slate-800 bg-slate-900'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div
            className={`mb-3 text-sm font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {locale.certsIssuers}
          </div>
          <div className='flex flex-wrap gap-2'>
            {allIssuers.map((issuer) => {
              const active = selectedIssuers.has(issuer);
              return (
                <button
                  key={issuer}
                  type='button'
                  onClick={() => toggleChip(setSelectedIssuers, issuer)}
                  className={`${chipBase} ${active ? chipOn : chipOff}`}
                >
                  {issuer}
                </button>
              );
            })}
          </div>
        </div>

        <div
          className={`rounded-2xl border p-4 ${
            darkMode
              ? 'border-slate-800 bg-slate-900'
              : 'border-slate-200 bg-slate-50'
          }`}
        >
          <div
            className={`mb-3 text-sm font-bold ${
              darkMode ? 'text-white' : 'text-slate-900'
            }`}
          >
            {locale.certsTopics}
          </div>
          <div className='flex flex-wrap gap-2'>
            {allTopics.map((topic) => {
              const active = selectedTopics.has(topic);
              const label = locale.topicLabels?.[topic] ?? topic;
              return (
                <button
                  key={topic}
                  type='button'
                  onClick={() => toggleChip(setSelectedTopics, topic)}
                  className={`${chipBase} ${active ? chipOn : chipOff}`}
                >
                  {label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
        {pageItems.map((c) => {
          const meta = issuerMeta(c.issuer);
          return (
            <article
              key={c.id}
              className={`rounded-2xl border p-5 transition-colors ${
                darkMode
                  ? 'border-slate-800 bg-slate-900 hover:border-blue-500/40'
                  : 'border-slate-200 bg-white hover:border-blue-500/40'
              }`}
            >
              <div className='mb-4 flex items-start justify-between gap-3'>
                <div className='flex items-center gap-3'>
                  <div
                    className={`flex h-10 w-10 items-center justify-center rounded-xl text-sm font-bold ${
                      darkMode ? meta.dark : meta.light
                    }`}
                    aria-label={`${meta.label} issuer`}
                    title={meta.label}
                  >
                    <span className='sr-only'>{meta.label}</span>
                    <span className='hidden sm:inline'>{meta.initials}</span>
                    <span className='sm:hidden'>{meta.icon}</span>
                  </div>
                  <div>
                    <div
                      className={`text-xs font-semibold ${
                        darkMode ? 'text-slate-300' : 'text-slate-600'
                      }`}
                    >
                      {meta.label}
                    </div>
                    <div
                      className={`text-xs ${
                        darkMode ? 'text-slate-300' : 'text-slate-400'
                      }`}
                    >
                      {locale.issuedPrefix}{' '}
                      {formatMonthYear(c.issuedOn, language)}
                    </div>
                  </div>
                </div>

                {c.expiresOn && (
                  <span
                    className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                      darkMode
                        ? 'bg-amber-900/30 text-amber-300'
                        : 'bg-amber-100 text-amber-700'
                    }`}
                    title={`${locale.expiresLabel} ${formatMonthYear(
                      c.expiresOn,
                      language
                    )}`}
                  >
                    {locale.expiresLabel}
                  </span>
                )}
              </div>

              <h3
                className={`text-base font-bold leading-snug ${
                  darkMode ? 'text-white' : 'text-slate-900'
                }`}
              >
                {c.title}
              </h3>

              {(c.credentialId ?? '').trim() && (
                <div
                  className={`mt-3 rounded-lg px-3 py-2 text-xs ${
                    darkMode
                      ? 'bg-slate-950 text-slate-300'
                      : 'bg-slate-100 text-slate-700'
                  }`}
                >
                  <span
                    className={`font-semibold ${
                      darkMode ? 'text-slate-200' : 'text-slate-800'
                    }`}
                  >
                    {locale.credentialIdLabel}
                  </span>{' '}
                  <span className='break-all'>{c.credentialId}</span>
                </div>
              )}

              {(c.skills?.length ?? 0) > 0 && (
                <div className='mt-4 flex flex-wrap gap-2'>
                  {c.skills.map((s) => (
                    <span
                      key={s}
                      className={`rounded px-2 py-1 font-mono text-xs ${
                        darkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-slate-200 text-slate-700'
                      }`}
                    >
                      {s}
                    </span>
                  ))}
                </div>
              )}

              <div className='mt-4 flex flex-wrap gap-2'>
                {(c.topics ?? []).slice(0, 3).map((topic) => (
                  <span
                    key={topic}
                    className={`rounded-full px-2 py-1 text-[11px] font-semibold ${
                      darkMode
                        ? 'bg-slate-800 text-slate-300'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {locale.topicLabels?.[topic] ?? topic}
                  </span>
                ))}
              </div>
            </article>
          );
        })}
      </div>

      <div className='mt-6 flex flex-col items-center justify-between gap-4 sm:flex-row'>
        <div
          className={`text-sm ${
            darkMode ? 'text-slate-400' : 'text-slate-600'
          }`}
        >
          {locale.pageLabel} {clampedPage + 1} {locale.ofLabel} {pageCount} ·{' '}
          {locale.showingLabel} {pageItems.length} {locale.ofLabel}{' '}
          {filtered.length}
        </div>

        <div className='flex items-center gap-2'>
          <button
            type='button'
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={clampedPage === 0}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              darkMode
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
            }`}
          >
            <ChevronLeft className='h-4 w-4' />
            {locale.prev}
          </button>

          <button
            type='button'
            onClick={() => setPage((p) => Math.min(pageCount - 1, p + 1))}
            disabled={clampedPage >= pageCount - 1}
            className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 ${
              darkMode
                ? 'border-slate-700 bg-slate-800 text-slate-200 hover:bg-slate-700'
                : 'border-slate-200 bg-white text-slate-900 hover:bg-slate-50'
            }`}
          >
            {locale.next}
            <ChevronRight className='h-4 w-4' />
          </button>
        </div>
      </div>
    </div>
  );
}

function SkillsSection({ darkMode }) {
  const categories = [
    {
      title: 'Frontend & Mobile',
      icon: <Layers className='h-6 w-6 text-blue-500' />,
      skills: [
        'React',
        'React Native',
        'Next.js',
        'Electron.js',
        'Tailwind CSS',
        'TypeScript',
        'JavaScript',
      ],
    },
    {
      title: 'Backend & Core',
      icon: <Terminal className='h-6 w-6 text-green-500' />,
      skills: ['Node.js', 'Python', 'Serverless Framework', 'Express.js'],
    },
    {
      title: 'Cloud & DevOps',
      icon: <Cloud className='h-6 w-6 text-orange-500' />,
      skills: [
        'AWS (Expert)',
        'Docker',
        'CI/CD',
        'Git/GitHub Actions',
        'Infrastructure as Code',
      ],
    },
    {
      title: 'AI & Data',
      icon: <Cpu className='h-6 w-6 text-purple-500' />,
      skills: [
        'Ultralytics YOLO',
        'PyTorch',
        'OpenCV',
        'Computer Vision',
        'Model Deployment',
        'DynamoDB',
        'PostgreSQL',
        'MongoDB',
      ],
    },
  ];

  return (
    <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
      {categories.map((cat) => (
        <div
          key={cat.title}
          className={`rounded-xl border p-6 shadow-sm transition-shadow hover:shadow-md ${
            darkMode
              ? 'border-slate-700 bg-slate-800'
              : 'border-slate-100 bg-white'
          }`}
        >
          <div className='mb-4 flex items-center gap-3'>
            {cat.icon}
            <h3
              className={`text-lg font-bold ${
                darkMode ? 'text-white' : 'text-slate-900'
              }`}
            >
              {cat.title}
            </h3>
          </div>
          <div className='flex flex-wrap gap-2'>
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className={`rounded-full px-3 py-1 text-sm font-medium ${
                  darkMode
                    ? 'bg-slate-700 text-slate-300'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default function Portfolio() {
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const langMenuRef = useRef(null);

  // Initialize theme from localStorage or system preference on mount
  useEffect(() => {
    const saved = window.localStorage.getItem('theme');
    if (saved === 'light') {
      setDarkMode(false);
    } else if (saved === 'dark') {
      setDarkMode(true);
    } else {
      const prefersDark =
        window.matchMedia?.('(prefers-color-scheme: dark)')?.matches ?? false;
      setDarkMode(prefersDark);
    }
  }, []);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    window.localStorage.setItem('theme', darkMode ? 'dark' : 'light');
  }, [darkMode]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (typeof document === 'undefined') return;
    document.documentElement.lang = language;
  }, [language]);

  const t = content[language] ?? content.en;

  return (
    <>
      <Head>
        <title>Walter Amador | Portfolio</title>
        <meta
          name='description'
          content='Walter Amador — Tech Lead & Full Stack Developer. Scalable architecture, cloud strategy, and AI integration.'
        />
        <link rel='icon' href='/favicon.ico' />
      </Head>

      <div
        className={`min-h-screen font-sans transition-colors duration-300 ${
          darkMode
            ? 'bg-slate-950 text-slate-200'
            : 'bg-slate-50 text-slate-900'
        }`}
      >
        <AnimatedBackground />

        <style jsx global>{`
          @keyframes blob {
            0% {
              transform: translate(0px, 0px) scale(1);
            }
            33% {
              transform: translate(30px, -50px) scale(1.1);
            }
            66% {
              transform: translate(-20px, 20px) scale(0.9);
            }
            100% {
              transform: translate(0px, 0px) scale(1);
            }
          }

          .animate-blob {
            animation: blob 12s infinite;
          }

          .animation-delay-2000 {
            animation-delay: 2s;
          }

          .animation-delay-4000 {
            animation-delay: 4s;
          }

          @keyframes spin-slow {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }

          .animate-spin-slow {
            animation: spin-slow 18s linear infinite;
          }
        `}</style>

        <div className='relative z-10'>
          <nav
            className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
              isScrolled
                ? darkMode
                  ? 'border-slate-800 bg-slate-950/80 py-3 backdrop-blur-md'
                  : 'border-slate-200 bg-white/80 py-3 backdrop-blur-md'
                : 'border-transparent bg-transparent py-5'
            }`}
          >
            <div className='mx-auto flex max-w-7xl items-center justify-between px-6'>
              <div className='flex items-center gap-3 text-xl font-bold tracking-tight'>
                <span className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white'>
                  W
                </span>
                <span
                  className={`hidden sm:block ${
                    darkMode ? 'text-white' : 'text-slate-800'
                  }`}
                >
                  Walter Amador
                </span>
              </div>

              <div className='flex items-center gap-4'>
                <div className='relative' ref={langMenuRef}>
                  <button
                    type='button'
                    onClick={() => setIsLangMenuOpen((v) => !v)}
                    className={`flex cursor-pointer items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:text-blue-500 ${
                      darkMode ? 'text-slate-200' : 'text-slate-700'
                    }`}
                  >
                    <Globe className='h-4 w-4' />
                    <span className='uppercase'>{language}</span>
                    <ChevronDown
                      className={`h-3 w-3 transition-transform ${
                        isLangMenuOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  {isLangMenuOpen && (
                    <div
                      className={`absolute right-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-lg border shadow-lg ${
                        darkMode
                          ? 'border-slate-700 bg-slate-800'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <button
                        type='button'
                        onClick={() => {
                          setLanguage('en');
                          setIsLangMenuOpen(false);
                        }}
                        className={`block w-full cursor-pointer px-4 py-2 text-left text-sm ${
                          darkMode
                            ? 'text-slate-100 hover:bg-slate-700'
                            : 'text-slate-800 hover:bg-slate-100'
                        } ${
                          language === 'en' ? 'font-bold text-blue-600' : ''
                        }`}
                      >
                        English
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          setLanguage('es');
                          setIsLangMenuOpen(false);
                        }}
                        className={`block w-full cursor-pointer px-4 py-2 text-left text-sm ${
                          darkMode
                            ? 'text-slate-100 hover:bg-slate-700'
                            : 'text-slate-800 hover:bg-slate-100'
                        } ${
                          language === 'es' ? 'font-bold text-blue-600' : ''
                        }`}
                      >
                        Español
                      </button>
                      <button
                        type='button'
                        onClick={() => {
                          setLanguage('fr');
                          setIsLangMenuOpen(false);
                        }}
                        className={`block w-full cursor-pointer px-4 py-2 text-left text-sm ${
                          darkMode
                            ? 'text-slate-100 hover:bg-slate-700'
                            : 'text-slate-800 hover:bg-slate-100'
                        } ${
                          language === 'fr' ? 'font-bold text-blue-600' : ''
                        }`}
                      >
                        Français
                      </button>
                    </div>
                  )}
                </div>

                <button
                  type='button'
                  onClick={() => setDarkMode((v) => !v)}
                  className={`cursor-pointer rounded-full p-2 transition-colors ${
                    darkMode ? 'hover:bg-slate-800' : 'hover:bg-slate-200'
                  }`}
                  aria-label={t.toggleThemeAria}
                >
                  {darkMode ? (
                    <Sun className='h-5 w-5 text-amber-400' />
                  ) : (
                    <Moon className='h-5 w-5 text-slate-600' />
                  )}
                </button>
              </div>
            </div>
          </nav>

          <main className='px-6 pb-12 pt-24'>
            <div className='mx-auto max-w-4xl'>
              <section className='py-10 md:py-16'>
                <div
                  className='grid items-center gap-10 lg:grid-cols-2'
                  onMouseMove={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = (e.clientX - rect.left) / rect.width;
                    const y = (e.clientY - rect.top) / rect.height;
                    const clampedX = Math.max(0, Math.min(1, x));
                    const clampedY = Math.max(0, Math.min(1, y));
                    setMousePos({ x: clampedX, y: clampedY });
                  }}
                  onMouseLeave={() => setMousePos({ x: 0.5, y: 0.5 })}
                >
                  <div className='space-y-6'>
                    <div
                      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${
                        darkMode
                          ? 'bg-blue-900/30 text-blue-300'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      <Code2 className='h-4 w-4' />
                      {t.role}
                    </div>
                    <h1
                      className={`text-5xl font-extrabold leading-tight tracking-tight md:text-6xl ${
                        darkMode ? 'text-white' : 'text-slate-900'
                      }`}
                    >
                      {t.heroHeadline}
                    </h1>
                    <p
                      className={`max-w-2xl text-xl leading-relaxed ${
                        darkMode ? 'text-slate-400' : 'text-slate-600'
                      }`}
                    >
                      {t.heroSub}
                    </p>

                    <div className='flex flex-wrap gap-4 pt-4'>
                      <a
                        href='https://linkedin.com/in/walter-amador'
                        target='_blank'
                        rel='noreferrer'
                        className='inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-colors hover:bg-blue-700'
                      >
                        <Linkedin className='h-5 w-5' />
                        LinkedIn
                      </a>
                      <a
                        href='https://github.com/walter-amador'
                        target='_blank'
                        rel='noreferrer'
                        className={`inline-flex items-center gap-2 rounded-lg border px-6 py-3 font-medium transition-colors ${
                          darkMode
                            ? 'border-slate-700 bg-slate-800 text-white hover:border-slate-600'
                            : 'border-slate-200 bg-white text-slate-900 hover:border-slate-300'
                        }`}
                      >
                        <Github className='h-5 w-5' />
                        GitHub
                      </a>
                      <a
                        href='https://www.credly.com/badges/586c3a24-f1e1-4aa1-a155-0f68fb893af6/public_url'
                        target='_blank'
                        rel='noreferrer'
                        className='group relative ml-2 hidden md:block'
                        title='AWS Certified AI Practitioner'
                      >
                        <div className='relative h-12 w-12 transition-transform hover:scale-110'>
                          <img
                            src='/aws-certified-ai-practitioner.png'
                            alt='AWS Certified AI Practitioner'
                            className='h-full w-full object-contain drop-shadow-md'
                          />
                          <div className='pointer-events-none absolute left-1/2 top-0 h-3 w-3 -translate-x-1/2'>
                            <div
                              className='animate-shine h-full w-full rounded-full bg-gradient-radial from-white via-blue-200 to-transparent opacity-0 blur-sm'
                              style={{ transformOrigin: '50% 24px' }}
                            />
                          </div>
                        </div>
                      </a>
                    </div>
                  </div>

                  <div className='flex justify-center lg:justify-end'>
                    <TechConstellation
                      mouseX={mousePos.x}
                      mouseY={mousePos.y}
                    />
                  </div>
                </div>
              </section>

              <section
                className={`border-t py-16 ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <h2
                  className={`mb-8 flex items-center gap-3 text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.aboutTitle}
                </h2>
                <div
                  className={`space-y-4 text-lg leading-loose ${
                    darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {t.aboutText.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                  ))}
                </div>
              </section>

              <section
                className={`border-t py-16 ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <h2
                  className={`mb-8 text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.skillsTitle}
                </h2>
                <SkillsSection darkMode={darkMode} />
              </section>

              {/* Work Experience */}
              <section
                className={`border-t py-16 ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <h2
                  className={`mb-3 text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.experienceTitle}
                </h2>
                <p
                  className={`mb-8 ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {t.experienceSubtitle}
                </p>

                <div className='space-y-8'>
                  {t.experience.map((exp, index) => (
                    <article
                      key={`${exp.company}-${index}`}
                      className={`rounded-2xl border p-6 ${
                        darkMode
                          ? 'border-slate-700 bg-slate-800/50'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className='mb-4 flex flex-col gap-2 md:flex-row md:items-start md:justify-between'>
                        <div>
                          <h3
                            className={`text-xl font-bold ${
                              darkMode ? 'text-white' : 'text-slate-900'
                            }`}
                          >
                            {exp.role}
                          </h3>
                          <p
                            className={`mt-1 font-semibold ${
                              darkMode ? 'text-blue-400' : 'text-blue-600'
                            }`}
                          >
                            {exp.company}
                          </p>
                        </div>
                        <div className='text-right'>
                          <div
                            className={`text-sm font-medium ${
                              darkMode ? 'text-slate-300' : 'text-slate-700'
                            }`}
                          >
                            {exp.period}
                          </div>
                          <div
                            className={`text-xs ${
                              darkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {exp.location}
                          </div>
                        </div>
                      </div>

                      <ul className='space-y-2'>
                        {exp.highlights.map((highlight, i) => (
                          <li
                            key={i}
                            className={`flex gap-3 text-sm leading-relaxed ${
                              darkMode ? 'text-slate-300' : 'text-slate-600'
                            }`}
                          >
                            <span
                              className={`mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full ${
                                darkMode ? 'bg-blue-400' : 'bg-blue-600'
                              }`}
                            />
                            <span>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </article>
                  ))}
                </div>
              </section>

              <section
                className={`border-t py-16 ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <h2
                  className={`mb-8 text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.projectsTitle}
                </h2>

                {t.projectsNote && (
                  <div
                    className={`mb-8 rounded-xl border-l-4 p-4 ${
                      darkMode
                        ? 'border-blue-500 bg-blue-950/30 text-slate-300'
                        : 'border-blue-500 bg-blue-50 text-slate-700'
                    }`}
                  >
                    <p className='text-sm leading-relaxed'>
                      💼 <strong>{t.projectsNoteLabel}</strong> {t.projectsNote}
                    </p>
                  </div>
                )}

                <div className='grid gap-8'>
                  {t.projects.map((project, index) => (
                    <article
                      key={project.title}
                      className={`group relative rounded-2xl border p-6 transition-colors hover:border-blue-500/50 ${
                        darkMode
                          ? 'border-slate-800 bg-slate-900'
                          : 'border-slate-200 bg-slate-50'
                      }`}
                    >
                      <div className='flex flex-col gap-4 md:flex-row md:items-start md:justify-between'>
                        <div>
                          <div className='flex items-center gap-2'>
                            <h3
                              className={`text-xl font-bold transition-colors group-hover:text-blue-500 ${
                                darkMode ? 'text-white' : 'text-slate-900'
                              }`}
                            >
                              {project.title}
                            </h3>
                            {index === 0 && (
                              <span
                                className={`rounded-full px-2 py-1 text-[10px] font-bold uppercase tracking-wider ${
                                  darkMode
                                    ? 'bg-green-900/30 text-green-400'
                                    : 'bg-green-100 text-green-600'
                                }`}
                              >
                                {t.latestBadge}
                              </span>
                            )}
                          </div>
                          <p
                            className={`mt-2 ${
                              darkMode ? 'text-slate-400' : 'text-slate-500'
                            }`}
                          >
                            {project.desc}
                          </p>
                          <div className='mt-4 flex flex-wrap gap-2'>
                            {project.tags.map((tag) => (
                              <span
                                key={tag}
                                className={`rounded px-2 py-1 font-mono text-xs ${
                                  darkMode
                                    ? 'bg-slate-800 text-slate-300'
                                    : 'bg-slate-200 text-slate-700'
                                }`}
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className='shrink-0'>
                          {(() => {
                            const links = Array.isArray(project.links)
                              ? project.links
                              : project.link
                              ? [project.link]
                              : [];

                            return (
                              <div className='flex items-center gap-2'>
                                {links.map((href, i) => (
                                  <a
                                    key={href}
                                    href={href}
                                    target='_blank'
                                    rel='noreferrer'
                                    className={`flex h-12 w-12 items-center justify-center rounded-full transition-colors hover:text-blue-600 ${
                                      darkMode
                                        ? 'bg-slate-800 hover:bg-blue-900/50'
                                        : 'bg-slate-200 hover:bg-blue-100'
                                    }`}
                                    aria-label={`${t.openLabel} ${
                                      project.title
                                    } (${i + 1})`}
                                  >
                                    <ExternalLink
                                      className={`h-5 w-5 transition-colors group-hover:text-blue-500 ${
                                        darkMode
                                          ? 'text-slate-300'
                                          : 'text-slate-500'
                                      }`}
                                    />
                                  </a>
                                ))}
                              </div>
                            );
                          })()}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section
                className={`border-t py-16 ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <EducationSection darkMode={darkMode} t={t} />
              </section>

              <section
                className={`border-t py-16 ${
                  darkMode ? 'border-slate-800' : 'border-slate-200'
                }`}
              >
                <CertificatesSection
                  darkMode={darkMode}
                  language={language}
                  title={t.certsTitle}
                  subtitle={t.certsSubtitle}
                />
              </section>

              <section className='py-20 text-center'>
                <h2
                  className={`mb-6 text-3xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.contactTitle}
                </h2>
                <p
                  className={`mx-auto mb-8 max-w-xl text-xl ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {t.contactText}
                </p>
                <a
                  href='mailto:amadorwalter3418@gmail.com'
                  className={`inline-flex items-center gap-2 rounded-full px-8 py-4 text-lg font-bold transition-transform hover:scale-105 ${
                    darkMode
                      ? 'bg-white text-slate-900'
                      : 'bg-slate-900 text-white'
                  }`}
                >
                  <Mail className='h-5 w-5' />
                  {t.emailMe}
                </a>
              </section>

              <footer
                className={`border-t py-8 text-center ${
                  darkMode
                    ? 'border-slate-800 text-slate-400'
                    : 'border-slate-200 text-slate-500'
                }`}
              >
                <p>
                  &copy;{' '}
                  <span suppressHydrationWarning>
                    {new Date().getFullYear()}
                  </span>{' '}
                  Walter Amador. {t.rights}
                </p>
              </footer>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
