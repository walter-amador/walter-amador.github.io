import React from 'react';
import Script from 'next/script';
import { GraduationCap } from 'lucide-react';

export function EducationSection({ darkMode, t }) {
  const items = t.education ?? [];
  const hasWesBadge = items.some((edu) => Boolean(edu.wesCredlyBadgeId));

  return (
    <div>
      {hasWesBadge && (
        <Script
          src='https://cdn.credly.com/assets/utilities/embed.js'
          strategy='afterInteractive'
        />
      )}

      <div className='mb-8 flex items-center gap-3'>
        <GraduationCap
          className={`h-7 w-7 ${darkMode ? 'text-blue-300' : 'text-blue-600'}`}
        />
        <h2
          className={`text-3xl font-bold ${
            darkMode ? 'text-white' : 'text-slate-900'
          }`}
        >
          {t.educationTitle}
        </h2>
      </div>

      {t.educationSubtitle && (
        <p className={`mb-8 ${darkMode ? 'text-slate-400' : 'text-slate-600'}`}>
          {t.educationSubtitle}
        </p>
      )}

      <div className='grid gap-6'>
        {items.map((edu) => (
          <article
            key={`${edu.school}-${edu.degree}`}
            className={`rounded-2xl border p-6 ${
              darkMode
                ? 'border-slate-800 bg-slate-900'
                : 'border-slate-200 bg-slate-50'
            }`}
          >
            <div className='flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between'>
              <div>
                <div
                  className={`text-sm font-semibold ${
                    darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {edu.school}
                </div>
                <h3
                  className={`mt-1 text-xl font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {edu.degree}
                </h3>
              </div>
              <div className='flex items-center gap-3'>
                {edu.countryFlag && (
                  <span
                    className={`rounded-full px-2 py-1 text-sm ${
                      darkMode
                        ? 'bg-slate-800 text-slate-200'
                        : 'bg-white text-slate-700'
                    }`}
                    aria-label={edu.countryFlag}
                    title={edu.countryFlag}
                  >
                    {edu.countryFlag}
                  </span>
                )}
                <div
                  className={`text-sm ${
                    darkMode ? 'text-slate-400' : 'text-slate-600'
                  }`}
                >
                  {edu.dates}
                </div>
              </div>
            </div>

            {edu.description && (
              <p
                className={`mt-4 text-base leading-relaxed ${
                  darkMode ? 'text-slate-300' : 'text-slate-600'
                }`}
              >
                {edu.description}
              </p>
            )}

            {edu.wesCredlyBadgeId && (
              <div className='mt-5'>
                <div
                  className={`rounded-xl border border-slate-200 bg-white w-max`}
                >
                  <div
                    className='w-full max-w-45 overflow-hidden rounded-lg bg-white'
                    data-iframe-width='180'
                    data-iframe-height='240'
                    data-share-badge-id={edu.wesCredlyBadgeId}
                    data-share-badge-host='https://www.credly.com'
                  />
                </div>
              </div>
            )}

            {(edu.highlights?.length ?? 0) > 0 && (
              <div className='mt-5'>
                <div
                  className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.educationLabels?.highlights ?? 'Highlights'}
                </div>
                <ul
                  className={`mt-2 list-disc space-y-1 pl-5 text-sm ${
                    darkMode ? 'text-slate-300' : 'text-slate-600'
                  }`}
                >
                  {edu.highlights.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </div>
            )}

            {(edu.skills?.length ?? 0) > 0 && (
              <div className='mt-5'>
                <div
                  className={`text-sm font-bold ${
                    darkMode ? 'text-white' : 'text-slate-900'
                  }`}
                >
                  {t.educationLabels?.skills ?? 'Skills'}
                </div>
                <div className='mt-2 flex flex-wrap gap-2'>
                  {edu.skills.map((skill) => (
                    <span
                      key={skill}
                      className={`rounded-full px-3 py-1 text-sm font-medium ${
                        darkMode
                          ? 'bg-slate-800 text-slate-300'
                          : 'bg-white text-slate-700'
                      }`}
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
}
