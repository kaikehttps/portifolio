/** Converte segundos em timecode de cinema HH:MM:SS:FF (24 fps). */
export function timecode(seconds: number, fps = 24): string {
  const s = Math.max(0, seconds)
  const h = Math.floor(s / 3600)
  const m = Math.floor((s % 3600) / 60)
  const sec = Math.floor(s % 60)
  const f = Math.floor((s % 1) * fps)
  return [h, m, sec, f].map((n) => String(n).padStart(2, '0')).join(':')
}
