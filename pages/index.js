import Head from 'next/head'
import About from '../components/About'
import Header from '../components/Header'
import Main from '../components/Main'
import Projects from '../components/Projects'
import Skills from '../components/Skills'

export default function Home({projects}) {
  return (
    <div className="bg-gray-50 font-poppins">
      <Head>
        <title>Walter Amador | Portfolio</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header />

      {/* Home */}
      <Main />

      {/* About Me */}
      <About />

      {/* Skills */}
      <Skills />

      {/* Projects */}
      <Projects projects={projects} />

      {/* Contact */}
    </div>
  )
}