const settingsKey = (userId) => `przystan_settings_${userId}`

export const DEFAULTS = {
  onboardingComplete: false,
  spotifyPlaylistId: '',
  calmingSentences: [
    'Oddychaj.',
    'To tylko echo przeszłości.',
    'Jesteś bezpieczna.',
  ],
  affirmations: [
    'Jeśli ktoś bliski ma problem, powie Ci o tym sam. Nie musisz czytać w jego myślach. Możesz odpuścić.',
    'Nie każda cisza oznacza, że coś jest nie tak. Czasem cisza to po prostu cisza. Jesteś bezpieczna.',
    'Nie musisz skanować pokoju. Nikt tutaj nie jest zagrożeniem. Możesz się rozluźnić.',
  ],
  crownSuccess: '',
  contactName: '',
  contactPhone: '',
  messageTemplates: [
    { label: 'Bądź obok', text: 'Potrzebuję, żebyś po prostu był/a obok mnie.' },
    { label: 'Przyjdź do mnie', text: 'Źle się czuję. Czy możesz do mnie przyjść?' },
    { label: 'Nie umiem mówić', text: 'Nie umiem teraz mówić, ale potrzebuję Cię.' },
  ],
}

export function getSettings(userId) {
  if (!userId) return DEFAULTS
  try {
    const raw = localStorage.getItem(settingsKey(userId))
    return raw ? { ...DEFAULTS, ...JSON.parse(raw) } : { ...DEFAULTS }
  } catch {
    return { ...DEFAULTS }
  }
}

export function saveSettings(userId, settings) {
  if (!userId) return
  localStorage.setItem(settingsKey(userId), JSON.stringify(settings))
}

// Wyciąga ID playlisty ze zwykłego linku Spotify
// https://open.spotify.com/playlist/1UkBGhGeJcMRuwQgwvLPNU → 1UkBGhGeJcMRuwQgwvLPNU
export function extractSpotifyId(url) {
  if (!url) return null
  const match = url.match(/playlist\/([a-zA-Z0-9]+)/)
  return match ? match[1] : null
}
