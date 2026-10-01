/** Short two-tone chime generated with the Web Audio API (no audio file needed). */
export function playNotificationSound() {
  try {
    const context = new AudioContext()
    const notes = [880, 1320]
    notes.forEach((frequency, index) => {
      const start = context.currentTime + index * 0.15
      const oscillator = context.createOscillator()
      const gain = context.createGain()
      oscillator.frequency.value = frequency
      gain.gain.setValueAtTime(0.15, start)
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.14)
      oscillator.connect(gain).connect(context.destination)
      oscillator.start(start)
      oscillator.stop(start + 0.15)
    })
  } catch {
    // Audio not supported — fail silently.
  }
}
