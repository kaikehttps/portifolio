import { sections } from '@/content'
import { Cursor, Intro, Nav } from '@/layout'

/* Página de teste da moldura: seções falsas com os ids reais + alvos para o cursor. */
export default function LayoutLab() {
  return (
    <>
      <Intro />
      <Nav />
      <main id="conteudo">
        <section id="inicio" style={{ minHeight: '100svh', display: 'grid', placeItems: 'center' }}>
          <h1 className="t-display" style={{ fontSize: 'var(--fs-mega)' }}>
            Lab
          </h1>
        </section>
        {sections.map((s, i) => (
          <section
            key={s.id}
            id={s.id}
            className="wrap"
            style={{ minHeight: '120svh', paddingBlock: 120, borderTop: '1px solid var(--line)' }}
          >
            <p className="t-label">{s.index} — {s.label}</p>
            <h2 className="t-display" style={{ fontSize: 'var(--fs-giant)', marginBlock: 40 }}>
              {s.label}
            </h2>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'center' }}>
              <a href="#inicio" className="t-label">
                Link comum
              </a>
              <button type="button" className="t-label" style={{ border: '1px solid var(--line-strong)', padding: 12 }}>
                Botão
              </button>
              <div
                data-cursor="view"
                data-cursor-label={i % 2 ? 'Ver case' : 'Abrir'}
                style={{ width: 360, height: 220, background: 'var(--ink-2)' }}
              />
              <div data-cursor="drag" style={{ width: 240, height: 220, background: 'var(--ink-1)' }} />
              <div data-cursor="hide" style={{ width: 120, height: 220, background: 'var(--ink-3)' }} />
            </div>
          </section>
        ))}
      </main>
      <Cursor />
    </>
  )
}
