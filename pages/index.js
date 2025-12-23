import Head from 'next/head';
import React, { useEffect, useRef, useState } from 'react';
import {
  ChevronDown,
  Cloud,
  Code2,
  Cpu,
  ExternalLink,
  Github,
  Globe,
  Layers,
  Linkedin,
  Mail,
  Moon,
  Sun,
  Terminal,
} from 'lucide-react';

/**
 * TEXT CONTENT DICTIONARY
 * Supports EN, ES, FR.
 */
const content = {
  en: {
    role: 'Tech Lead & Full Stack Developer',
    heroHeadline: 'Scalable Solutions. Cloud Native. AI Integrated.',
    heroSub:
      'Translating complex business requirements into high-quality, scalable technical architectures.',
    aboutTitle: 'About Me',
    aboutText: [
      'I am a Full Stack Developer with a proven track record in building desktop, mobile, and web applications, as well as APIs. With strong expertise in AWS, I design scalable, cloud-native solutions that meet evolving business needs.',
      'I also have hands-on experience developing AI-powered systems, including computer vision applications, real-time image analysis, and data-driven solutions for security and monitoring use cases.',
      'I thrive in collaborative environments, translating requirements into practical, high-quality solutions with a solution-oriented mindset and clear communication.',
    ],
    skillsTitle: 'Technical Expertise',
    projectsTitle: 'Selected Work',
    projects: [
      {
        title: 'Autonomous Mobile Robot Navigation',
        desc: 'Vision-only navigation system on AGILEX LIMO using a single monocular camera. Features YOLOv8 traffic sign recognition, PD line following, and FSM-based obstacle avoidance without LiDAR.',
        tags: ['Python', 'ROS2', 'YOLOv8', 'OpenCV'],
        link: 'https://github.com/walter-amador/limo_robot_autonomous_navigation',
      },
      {
        title: 'AI-Driven Security Monitoring System',
        desc: 'Architected a real-time computer vision pipeline using Python and OpenCV deployed on AWS Edge devices for automated security analysis.',
        tags: ['Python', 'OpenCV', 'AWS IoT', 'Edge Computing'],
        link: 'https://github.com/walter-amador',
      },
      {
        title: 'Cloud-Native Microservices Migration',
        desc: 'Led the migration of a legacy monolithic application to a serverless architecture using Node.js and AWS Lambda, optimizing scalability and reducing costs.',
        tags: ['AWS Lambda', 'Node.js', 'Terraform', 'Serverless'],
        link: 'https://github.com/walter-amador',
      },
    ],
    contactTitle: 'Get in Touch',
    contactText: 'Open to discussing scalable architecture, cloud strategy, and AI integration.',
    rights: 'All rights reserved.',
  },
  es: {
    role: 'Líder Técnico y Desarrollador Full Stack',
    heroHeadline: 'Soluciones Escalables. Nativo de la Nube. Integración de IA.',
    heroSub:
      'Traduciendo requisitos comerciales complejos en arquitecturas técnicas escalables y de alta calidad.',
    aboutTitle: 'Sobre Mí',
    aboutText: [
      'Soy un Desarrollador Full Stack con un historial comprobado en la creación de aplicaciones de escritorio, móviles y web, así como APIs. Con una sólida experiencia en AWS, diseño soluciones escalables y nativas de la nube que satisfacen las necesidades empresariales en evolución.',
      'También tengo experiencia práctica en el desarrollo de sistemas impulsados por IA, incluidas aplicaciones de visión por computadora, análisis de imágenes en tiempo real y soluciones basadas en datos para casos de uso de seguridad y monitoreo.',
      'Prospero en entornos colaborativos, traduciendo requisitos en soluciones prácticas y de alta calidad con una mentalidad orientada a la solución y una comunicación clara.',
    ],
    skillsTitle: 'Experiencia Técnica',
    projectsTitle: 'Proyectos Destacados',
    projects: [
      {
        title: 'Navegación Autónoma de Robot Móvil',
        desc: 'Sistema de navegación basado en visión en AGILEX LIMO usando una sola cámara monocular. Incluye reconocimiento de señales con YOLOv8, seguimiento de línea PD y evasión de obstáculos FSM sin LiDAR.',
        tags: ['Python', 'ROS2', 'YOLOv8', 'OpenCV'],
        link: 'https://github.com/walter-amador/limo_robot_autonomous_navigation',
      },
      {
        title: 'Sistema de Monitoreo de Seguridad con IA',
        desc: 'Arquitecto de un pipeline de visión por computadora en tiempo real usando Python y OpenCV implementado en dispositivos AWS Edge para análisis de seguridad automatizado.',
        tags: ['Python', 'OpenCV', 'AWS IoT', 'Edge Computing'],
        link: 'https://github.com/walter-amador',
      },
      {
        title: 'Migración a Microservicios Cloud-Native',
        desc: 'Lideré la migración de una aplicación monolítica heredada a una arquitectura serverless usando Node.js y AWS Lambda, optimizando la escalabilidad y reduciendo costos.',
        tags: ['AWS Lambda', 'Node.js', 'Terraform', 'Serverless'],
        link: 'https://github.com/walter-amador',
      },
    ],
    contactTitle: 'Contacto',
    contactText: 'Abierto a discutir arquitectura escalable, estrategia en la nube e integración de IA.',
    rights: 'Todos los derechos reservados.',
  },
  fr: {
    role: 'Tech Lead & Développeur Full Stack',
    heroHeadline: 'Solutions Évolutives. Cloud Native. Intégration IA.',
    heroSub:
      "Traduire des exigences commerciales complexes en architectures techniques évolutives et de haute qualité.",
    aboutTitle: 'À Propos',
    aboutText: [
      "Je suis un développeur Full Stack avec une expérience éprouvée dans la création d'applications de bureau, mobiles et web, ainsi que d'API. Avec une solide expertise en AWS, je conçois des solutions évolutives et cloud-native qui répondent aux besoins commerciaux en constante évolution.",
      "J'ai également une expérience pratique dans le développement de systèmes alimentés par l'IA, y compris des applications de vision par ordinateur, l'analyse d'images en temps réel et des solutions basées sur les données pour des cas d'utilisation de sécurité et de surveillance.",
      "Je m'épanouis dans des environnements collaboratifs, traduisant les exigences en solutions pratiques et de haute qualité avec un esprit orienté vers les solutions et une communication claire.",
    ],
    skillsTitle: 'Expertise Technique',
    projectsTitle: 'Projets Sélectionnés',
    projects: [
      {
        title: 'Navigation Autonome de Robot Mobile',
        desc: "Système de navigation basé sur la vision sur AGILEX LIMO utilisant une seule caméra monoculaire. Intègre la reconnaissance de panneaux YOLOv8, le suivi de ligne PD et l'évitement d'obstacles FSM sans LiDAR.",
        tags: ['Python', 'ROS2', 'YOLOv8', 'OpenCV'],
        link: 'https://github.com/walter-amador/limo_robot_autonomous_navigation',
      },
      {
        title: 'Système de Surveillance de Sécurité IA',
        desc: "Conception d'un pipeline de vision par ordinateur en temps réel utilisant Python et OpenCV déployé sur des dispositifs AWS Edge pour une analyse de sécurité automatisée.",
        tags: ['Python', 'OpenCV', 'AWS IoT', 'Edge Computing'],
        link: 'https://github.com/walter-amador',
      },
      {
        title: 'Migration de Microservices Cloud-Native',
        desc: "Direction de la migration d'une application monolithique héritée vers une architecture serverless utilisant Node.js et AWS Lambda, optimisant l'évolutivité et réduisant les coûts.",
        tags: ['AWS Lambda', 'Node.js', 'Terraform', 'Serverless'],
        link: 'https://github.com/walter-amador',
      },
    ],
    contactTitle: 'Contactez-moi',
    contactText: "Ouvert à discuter d'architecture évolutive, de stratégie cloud et d'intégration IA.",
    rights: 'Tous droits réservés.',
  },
};

function SkillsSection() {
  const categories = [
    {
      title: 'Frontend & Mobile',
      icon: <Layers className="h-6 w-6 text-blue-500" />,
      skills: ['React', 'React Native', 'Next.js', 'Electron.js', 'Tailwind CSS', 'TypeScript'],
    },
    {
      title: 'Backend & Core',
      icon: <Terminal className="h-6 w-6 text-green-500" />,
      skills: ['Node.js', 'Python', 'Serverless Framework', 'Express.js'],
    },
    {
      title: 'Cloud & DevOps',
      icon: <Cloud className="h-6 w-6 text-orange-500" />,
      skills: ['AWS (Expert)', 'Docker', 'CI/CD', 'Git/GitHub Actions', 'Infrastructure as Code'],
    },
    {
      title: 'AI & Data',
      icon: <Cpu className="h-6 w-6 text-purple-500" />,
      skills: [
        'TensorFlow',
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
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {categories.map((cat) => (
        <div
          key={cat.title}
          className="rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md dark:border-slate-700 dark:bg-slate-800"
        >
          <div className="mb-4 flex items-center gap-3">
            {cat.icon}
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">{cat.title}</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            {cat.skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full bg-slate-100 px-3 py-1 text-sm font-medium text-slate-700 dark:bg-slate-700 dark:text-slate-300"
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
  const [darkMode, setDarkMode] = useState(true);
  const [language, setLanguage] = useState('en');
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  const langMenuRef = useRef(null);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (langMenuRef.current && !langMenuRef.current.contains(event.target)) {
        setIsLangMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const t = content[language] ?? content.en;

  return (
    <>
      <Head>
        <title>Walter Amador | Portfolio</title>
        <meta
          name="description"
          content="Walter Amador — Tech Lead & Full Stack Developer. Scalable architecture, cloud strategy, and AI integration."
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div
        className={`min-h-screen font-sans transition-colors duration-300 ${
          darkMode ? 'dark bg-slate-950 text-slate-200' : 'bg-slate-50 text-slate-900'
        }`}
      >
        <nav
          className={`fixed top-0 z-50 w-full border-b transition-all duration-300 ${
            isScrolled
              ? 'border-slate-200 bg-white/80 py-3 backdrop-blur-md dark:border-slate-800 dark:bg-slate-950/80'
              : 'border-transparent bg-transparent py-5'
          }`}
        >
          <div className="mx-auto flex max-w-6xl items-center justify-between px-6">
            <div className="flex items-center gap-2 text-xl font-bold tracking-tight">
              <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 font-bold text-white">
                W
              </span>
              <span className="hidden text-slate-800 dark:text-white sm:block">Walter Amador</span>
            </div>

            <div className="flex items-center gap-4">
              <div className="relative" ref={langMenuRef}>
                <button
                  type="button"
                  onClick={() => setIsLangMenuOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-md px-2 py-1 text-sm font-medium transition-colors hover:text-blue-500"
                >
                  <Globe className="h-4 w-4" />
                  <span className="uppercase">{language}</span>
                  <ChevronDown
                    className={`h-3 w-3 transition-transform ${isLangMenuOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isLangMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-32 overflow-hidden rounded-lg border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-800">
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('en');
                        setIsLangMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        language === 'en' ? 'font-bold text-blue-600' : ''
                      }`}
                    >
                      English
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('es');
                        setIsLangMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        language === 'es' ? 'font-bold text-blue-600' : ''
                      }`}
                    >
                      Español
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setLanguage('fr');
                        setIsLangMenuOpen(false);
                      }}
                      className={`block w-full px-4 py-2 text-left text-sm hover:bg-slate-100 dark:hover:bg-slate-700 ${
                        language === 'fr' ? 'font-bold text-blue-600' : ''
                      }`}
                    >
                      Français
                    </button>
                  </div>
                )}
              </div>

              <button
                type="button"
                onClick={() => setDarkMode((v) => !v)}
                className="rounded-full p-2 transition-colors hover:bg-slate-200 dark:hover:bg-slate-800"
                aria-label="Toggle theme"
              >
                {darkMode ? (
                  <Sun className="h-5 w-5 text-amber-400" />
                ) : (
                  <Moon className="h-5 w-5 text-slate-600" />
                )}
              </button>
            </div>
          </div>
        </nav>

        <main className="px-6 pb-12 pt-24">
          <div className="mx-auto max-w-4xl">
            <section className="py-20 md:py-32">
              <div className="space-y-6">
                <div className="inline-flex items-center gap-2 rounded-full bg-blue-100 px-3 py-1 text-sm font-medium text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  <Code2 className="h-4 w-4" />
                  {t.role}
                </div>
                <h1 className="text-5xl font-extrabold leading-tight tracking-tight text-slate-900 dark:text-white md:text-7xl">
                  {t.heroHeadline}
                </h1>
                <p className="max-w-2xl text-xl leading-relaxed text-slate-600 dark:text-slate-400">
                  {t.heroSub}
                </p>

                <div className="flex flex-wrap gap-4 pt-4">
                  <a
                    href="https://linkedin.com/in/walter-amador"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg bg-blue-600 px-6 py-3 font-medium text-white shadow-lg shadow-blue-500/25 transition-colors hover:bg-blue-700"
                  >
                    <Linkedin className="h-5 w-5" />
                    LinkedIn
                  </a>
                  <a
                    href="https://github.com/walter-amador"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-6 py-3 font-medium text-slate-900 transition-colors hover:border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-white dark:hover:border-slate-600"
                  >
                    <Github className="h-5 w-5" />
                    GitHub
                  </a>
                </div>
              </div>
            </section>

            <section className="border-t border-slate-200 py-16 dark:border-slate-800">
              <h2 className="mb-8 flex items-center gap-3 text-3xl font-bold text-slate-900 dark:text-white">
                {t.aboutTitle}
              </h2>
              <div className="space-y-4 text-lg leading-loose text-slate-600 dark:text-slate-300">
                {t.aboutText.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </section>

            <section className="border-t border-slate-200 py-16 dark:border-slate-800">
              <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">{t.skillsTitle}</h2>
              <SkillsSection />
            </section>

            <section className="border-t border-slate-200 py-16 dark:border-slate-800">
              <h2 className="mb-8 text-3xl font-bold text-slate-900 dark:text-white">{t.projectsTitle}</h2>
              <div className="grid gap-8">
                {t.projects.map((project, index) => (
                  <article
                    key={project.title}
                    className="group relative rounded-2xl border border-slate-200 bg-slate-50 p-6 transition-colors hover:border-blue-500/50 dark:border-slate-800 dark:bg-slate-900"
                  >
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-xl font-bold text-slate-900 transition-colors group-hover:text-blue-500 dark:text-white">
                            {project.title}
                          </h3>
                          {index === 0 && (
                            <span className="rounded-full bg-green-100 px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-green-600 dark:bg-green-900/30 dark:text-green-400">
                              Latest
                            </span>
                          )}
                        </div>
                        <p className="mt-2 text-slate-500 dark:text-slate-400">{project.desc}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {project.tags.map((tag) => (
                            <span
                              key={tag}
                              className="rounded bg-slate-200 px-2 py-1 font-mono text-xs text-slate-700 dark:bg-slate-800 dark:text-slate-300"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      <div className="shrink-0">
                        <a
                          href={project.link}
                          target="_blank"
                          rel="noreferrer"
                          className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-200 transition-colors hover:bg-blue-100 hover:text-blue-600 dark:bg-slate-800 dark:hover:bg-blue-900/50"
                          aria-label={`Open ${project.title}`}
                        >
                          <ExternalLink className="h-5 w-5 text-slate-500 transition-colors group-hover:text-blue-500" />
                        </a>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            </section>

            <section className="py-20 text-center">
              <h2 className="mb-6 text-3xl font-bold text-slate-900 dark:text-white">{t.contactTitle}</h2>
              <p className="mx-auto mb-8 max-w-xl text-xl text-slate-600 dark:text-slate-400">{t.contactText}</p>
              <a
                href="mailto:contact@walteramador.com"
                className="inline-flex items-center gap-2 rounded-full bg-slate-900 px-8 py-4 text-lg font-bold text-white transition-transform hover:scale-105 dark:bg-white dark:text-slate-900"
              >
                <Mail className="h-5 w-5" />
                Email Me
              </a>
            </section>

            <footer className="border-t border-slate-200 py-8 text-center text-slate-500 dark:border-slate-800 dark:text-slate-400">
              <p>
                &copy; {new Date().getFullYear()} Walter Amador. {t.rights}
              </p>
            </footer>
          </div>
        </main>
      </div>
    </>
  );
}