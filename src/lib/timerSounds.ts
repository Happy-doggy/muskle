/**
 * Sons du timer (Web Audio API).
 * Bip court : compte à rebours final.
 * Bip long  : début d'exercice.
 */

let audioContext: AudioContext | null = null

function getAudioContext(): AudioContext {
  if (!audioContext) {
    audioContext = new AudioContext()
  }
  return audioContext
}

export async function unlockTimerSounds(): Promise<void> {
  const ctx = getAudioContext()
  if (ctx.state === 'suspended') {
    await ctx.resume()
  }
}

function playTone(frequency: number, durationSec: number, volume = 0.35) {
  const ctx = getAudioContext()
  const oscillator = ctx.createOscillator()
  const gain = ctx.createGain()

  oscillator.connect(gain)
  gain.connect(ctx.destination)

  oscillator.frequency.value = frequency
  oscillator.type = 'sine'

  const now = ctx.currentTime
  gain.gain.setValueAtTime(volume, now)
  gain.gain.exponentialRampToValueAtTime(0.001, now + durationSec)

  oscillator.start(now)
  oscillator.stop(now + durationSec)
}

export function playShortBeep(): void {
  unlockTimerSounds().then(() => playTone(880, 0.12)).catch(() => {})
}

export function playLongBeep(): void {
  unlockTimerSounds().then(() => playTone(520, 0.75)).catch(() => {})
}
