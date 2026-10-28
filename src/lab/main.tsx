import { lazy, StrictMode, Suspense, type ComponentType, type LazyExoticComponent } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter, Route, Routes } from 'react-router'
import { LazyMotion, MotionConfig } from 'motion/react'
import '@/styles/fonts'
import '@/styles/tokens.css'
import '@/styles/global.css'
import { SmoothScroll } from '@/lib/smooth-scroll'
import { loadMotionFeatures } from '@/lib/motion'
import { markIntroDone } from '@/lib/intro'
import { Grain } from '@/components/Grain'

/*
  Laboratório de desenvolvimento: /lab.html?s=<nome>
  Cada seção carrega isolada — um erro em outro arquivo não derruba esta.
  Nomes: hero, projects, skills, resume, about, contact, layout, project (&slug=<slug>)
*/

const named = <T extends Record<string, unknown>>(load: () => Promise<T>, key: keyof T) =>
  lazy(async () => ({ default: (await load())[key] as ComponentType }))

const SECTIONS: Record<string, LazyExoticComponent<ComponentType>> = {
  hero: named(() => import('@/sections/Hero/Hero'), 'Hero'),
  projects: named(() => import('@/sections/Work/WorkSection'), 'WorkSection'),
  skills: named(() => import('@/sections/Skills/SkillsSection'), 'SkillsSection'),
  resume: named(() => import('@/sections/Resume/ResumeSection'), 'ResumeSection'),
  about: named(() => import('@/sections/About/AboutSection'), 'AboutSection'),
  contact: named(() => import('@/sections/Contact/ContactSection'), 'ContactSection'),
  layout: lazy(() => import('./LayoutLab')),
  project: lazy(() => import('./ProjectLab')),
}

const params = new URLSearchParams(location.search)
const name = params.get('s') ?? 'hero'
const Section = SECTIONS[name]
if (params.get('intro') !== '1') markIntroDone()

function Lab() {
  if (!Section) {
    return (
      <p className="t-label" style={{ padding: 24 }}>
        Seção desconhecida. Use: {Object.keys(SECTIONS).join(', ')}
      </p>
    )
  }
  return (
    <Suspense fallback={null}>
      <Section />
    </Suspense>
  )
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <SmoothScroll>
            <Routes>
              <Route path="*" element={<Lab />} />
            </Routes>
            <Grain />
          </SmoothScroll>
        </MotionConfig>
      </LazyMotion>
    </BrowserRouter>
  </StrictMode>,
)
