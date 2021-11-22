import { useEffect } from 'react';
import Head from 'next/head';

//Sections
import About from '../sections/About';
import Contact from '../sections/Contact';
import Experience from '../sections/Experience';
import Main from '../sections/Main';
import Projects from '../sections/Projects';
import Skills from '../sections/Skills';

//Components
import Footer from '../components/Footer';
import Header from '../components/Header';

//Libs
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Home({projects}) {

  useEffect(() =>{
    AOS.init(
      {
        once: true,
      }
    )
  },[]);

  return (
    <div className="bg-gray-50 font-poppins">
      <Head>
        <title>Walter Amador | Portfolio</title>
        <link rel="shortcut icon" href="/favicon.ico" />
      </Head>

      {/* Header */}
      <Header />

      {/* Home */}
      <Main />

      {/* About Me */}
      <About />

      {/* Work experience */}
      <Experience />

      {/* Skills */}
      <Skills />

      {/* Projects */}
      <Projects projects={projects} />

      {/* Contact */}
      <Contact />

      {/* Footer */}
      <Footer />
    </div>
  )
}