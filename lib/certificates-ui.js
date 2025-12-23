import React from 'react';
import { BadgeCheck, Cpu, Globe, Layers, Terminal } from 'lucide-react';

export function formatMonthYear(dateIso, language) {
  if (!dateIso) return '';
  const d = new Date(dateIso);
  if (Number.isNaN(d.getTime())) return '';
  const locale = language === 'es' ? 'es' : language === 'fr' ? 'fr' : 'en';
  return new Intl.DateTimeFormat(locale, {
    month: 'short',
    year: 'numeric',
  }).format(d);
}

export function deriveTopics(cert) {
  const title = (cert.title ?? '').toLowerCase();
  const skills = (cert.skills ?? []).join(' ').toLowerCase();
  const blob = `${title} ${skills}`;

  const topics = new Set();
  if (
    blob.match(
      /ai|artificial|generative|prompt|copilot|computer vision|opencv|yolo/
    )
  ) {
    topics.add('AI');
  }
  if (
    blob.match(/aws|cloud|serverless|lambda|docker|devops|ci\/cd|terraform/)
  ) {
    topics.add('Cloud');
  }
  if (blob.match(/react|next\.js|frontend|dom|webpack|web design|tailwind/)) {
    topics.add('Frontend');
  }
  if (blob.match(/node|express|api|backend|passport|jwt|auth/)) {
    topics.add('Backend');
  }
  if (
    blob.match(
      /postgres|mongo|database|bases de datos|data structures|estructuras de datos/
    )
  ) {
    topics.add('Data');
  }
  if (blob.match(/scrum|user stories|historias de usuario|remote|teletrabajo/)) {
    topics.add('Professional');
  }
  if (blob.match(/email|communication|etiquette/)) {
    topics.add('Communication');
  }
  if (blob.match(/english|language|proficiency/)) {
    topics.add('Language');
  }
  if (blob.match(/academic|qualifications|education/)) {
    topics.add('Academic');
  }

  if (topics.size === 0) topics.add('General');
  return Array.from(topics);
}

export function issuerMeta(issuer) {
  const normalized = issuer ?? 'Unknown';
  const map = {
    Udemy: {
      label: 'Udemy',
      initials: 'U',
      icon: <BadgeCheck className='h-4 w-4' />,
      light: 'bg-purple-100 text-purple-700',
      dark: 'bg-purple-900/30 text-purple-300',
    },
    Platzi: {
      label: 'Platzi',
      initials: 'P',
      icon: <Terminal className='h-4 w-4' />,
      light: 'bg-green-100 text-green-700',
      dark: 'bg-green-900/30 text-green-300',
    },
    Coursera: {
      label: 'Coursera',
      initials: 'C',
      icon: <Layers className='h-4 w-4' />,
      light: 'bg-indigo-100 text-indigo-700',
      dark: 'bg-indigo-900/30 text-indigo-300',
    },
    MathWorks: {
      label: 'MathWorks',
      initials: 'MW',
      icon: <Cpu className='h-4 w-4' />,
      light: 'bg-red-100 text-red-700',
      dark: 'bg-red-900/30 text-red-300',
    },
    'World Education Services': {
      label: 'World Education Services',
      initials: 'WES',
      icon: <Globe className='h-4 w-4' />,
      light: 'bg-slate-200 text-slate-700',
      dark: 'bg-slate-800 text-slate-200',
    },
    'Duolingo English Test': {
      label: 'Duolingo English Test',
      initials: 'DET',
      icon: <BadgeCheck className='h-4 w-4' />,
      light: 'bg-amber-100 text-amber-700',
      dark: 'bg-amber-900/30 text-amber-300',
    },
  };

  return (
    map[normalized] ?? {
      label: normalized,
      initials: normalized
        .split(' ')
        .slice(0, 2)
        .map((s) => s[0])
        .join('')
        .toUpperCase(),
      icon: <BadgeCheck className='h-4 w-4' />,
      light: 'bg-slate-200 text-slate-700',
      dark: 'bg-slate-800 text-slate-200',
    }
  );
}
