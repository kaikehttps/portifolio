import { useEffect } from 'react'
import { Hero } from '@/sections/Hero/Hero'
import { WorkSection } from '@/sections/Work/WorkSection'
import { SkillsSection } from '@/sections/Skills/SkillsSection'
import { ResumeSection } from '@/sections/Resume/ResumeSection'
import { AboutSection } from '@/sections/About/AboutSection'
import { ContactSection } from '@/sections/Contact/ContactSection'
import { usePageScroll } from '@/lib/smooth-scroll'
import { profile } from '@/content'

export function HomePage() {
  usePageScroll()
  useEffect(() => {
    document.title = `${profile.name} — Portfólio`
  }, [])

  return (
    <main id="conteudo">
      <Hero />
      <WorkSection />
      <SkillsSection />
      <ResumeSection />
      <AboutSection />
      <ContactSection />
    </main>
  )
}
