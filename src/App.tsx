import { lazy, Suspense } from 'react'
import { BrowserRouter, Route, Routes, useLocation } from 'react-router'
import { LazyMotion, MotionConfig } from 'motion/react'
import { SmoothScroll } from '@/lib/smooth-scroll'
import { loadMotionFeatures } from '@/lib/motion'
import { Grain } from '@/components/Grain'
import { Cursor, Intro, Nav, PageTransition } from '@/layout'
import { HomePage } from '@/pages/HomePage'
import { NotFound } from '@/pages/NotFound'

const ProjectPage = lazy(() => import('@/pages/ProjectPage'))

function AppRoutes() {
  const location = useLocation()
  return (
    <PageTransition>
      <Routes location={location}>
        <Route path="/" element={<HomePage />} />
        <Route
          path="/projetos/:slug"
          element={
            <Suspense fallback={null}>
              <ProjectPage />
            </Suspense>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </PageTransition>
  )
}

export function App() {
  return (
    <BrowserRouter>
      <LazyMotion features={loadMotionFeatures} strict>
        <MotionConfig reducedMotion="user">
          <SmoothScroll>
            <a href="#conteudo" className="skip-link">
              Pular para o conteúdo
            </a>
            <Intro />
            <Nav />
            <AppRoutes />
            <Grain />
            <Cursor />
          </SmoothScroll>
        </MotionConfig>
      </LazyMotion>
    </BrowserRouter>
  )
}
