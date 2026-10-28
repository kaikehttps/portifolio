import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router'

const ProjectPage = lazy(() => import('@/pages/ProjectPage'))

/* /lab.html?s=project&slug=projeto-celeste */
export default function ProjectLab() {
  const slug = new URLSearchParams(location.search).get('slug') ?? 'projeto-celeste'
  return (
    <Routes location={`/projetos/${slug}`}>
      <Route
        path="/projetos/:slug"
        element={
          <Suspense fallback={null}>
            <ProjectPage />
          </Suspense>
        }
      />
    </Routes>
  )
}
