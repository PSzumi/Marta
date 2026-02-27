import { ArrowLeft, Brain, Shield, Heart, Sparkles, Hand, TreePine, Puzzle, Waypoints, Anchor, Feather, CloudRain, Flower2, Orbit, Shell, Zap, Moon, Sunrise, Droplets, CircleDot, Leaf, Mountain, Bird, Flame, Stars } from 'lucide-react'

// ─── Pula fiszek psychoedukacyjnych (~27 fiszek) ───
// Rotacja dzienna: te same 3 przez cały dzień, następnego dnia inne.
// Przy 27 fiszkach = 9 dni unikatowych zestawów zanim się powtórzą.
//
// Kategorie:
// - ADHD / funkcje wykonawcze
// - C-PTSD / walka-ucieczka-zamrożenie
// - Parentyfikacja / wewnętrzne dziecko
// - Hiperczujność / kontrola
// - Wewnętrzny krytyk
// - Emocje / samoregulacja
// - Poczucie własnej wartości / pozwolenie
// - Relacje / bezpieczeństwo
// - Ciało / somatyka

const allCards = [
  // ── ADHD / funkcje wykonawcze ──
  {
    icon: Brain,
    text: 'Wiesz, co masz zrobić, ale ciało odmawia? To nie lenistwo. To paraliż funkcji wykonawczych (ADHD). Twój silnik nie ma teraz paliwa, żeby ruszyć. Odpuść.',
  },
  {
    icon: Zap,
    text: 'ADHD to nie brak siły woli. To mózg, który potrzebuje innego rodzaju paliwa. Jeśli nie możesz zacząć — zacznij od czegoś absurdalnie małego. Jedna minuta. Jeden ruch.',
  },
  {
    icon: Orbit,
    text: 'Przeskakujesz z myśli na myśl i nic nie kończysz? To nie chaos — to Twój mózg szuka dopaminy. Nie walcz z nim. Daj mu jedną małą rzecz, która go zainteresuje.',
  },
  {
    icon: CircleDot,
    text: 'Zapomniałaś o czymś ważnym? To nie oznacza, że Ci nie zależy. ADHD wpływa na pamięć roboczą. Zależy Ci — po prostu Twój mózg gubi informacje w drodze.',
  },

  // ── C-PTSD / walka-ucieczka-zamrożenie ──
  {
    icon: Shield,
    text: 'Robisz rzeczy wbrew sobie i tracisz kontrolę w nerwach? To reakcja walki/ucieczki Twojego układu nerwowego. Twój mózg ratuje Cię przed wyimaginowanym zagrożeniem. To fizjologia, a nie Twój charakter.',
  },
  {
    icon: CloudRain,
    text: 'Czujesz nagły przypływ paniki bez powodu? To flashback emocjonalny. Twoje ciało pamięta coś, czego umysł nie rozpoznaje. To echo — nie teraźniejszość.',
  },
  {
    icon: Anchor,
    text: 'To co czujesz w tej chwili — minie. Emocje są jak fale. Nawet ta najsilniejsza opadnie. Nie musisz z nią walczyć. Wystarczy, że przeczekasz.',
  },
  {
    icon: Mountain,
    text: 'Czujesz się zamrożona? Nie możesz mówić, nie możesz się ruszyć? To reakcja zamrożenia — najstarsza odpowiedź układu nerwowego na zagrożenie. Nie jesteś słaba. Twoje ciało próbuje Cię chronić.',
  },

  // ── Parentyfikacja / wewnętrzne dziecko ──
  {
    icon: Heart,
    text: 'Mała dziewczynka, która musiała pilnować, żeby w domu był spokój? Wykonała niesamowitą robotę. Ale ona może już odpocząć. Teraz to nie jest jej rola. Nigdy nie powinna była nią być.',
  },
  {
    icon: Flower2,
    text: 'Byłaś dzieckiem, które musiało być dorosłym. To nie był Twój wybór. Teraz możesz pozwolić sobie być — po prostu sobą. Bez roli. Bez zadań. Bez ratowania.',
  },
  {
    icon: Bird,
    text: 'Czujesz winę, gdy robisz coś dla siebie? To echo parentyfikacji — nauczono Cię, że Twoje potrzeby są mniej ważne. Ale to była kłamstwo, nie prawda.',
  },
  {
    icon: Shell,
    text: 'Nie musisz udowadniać, że zasługujesz na miłość. Nie musisz być użyteczna, żeby mieć prawo tu być. Miłość nie jest nagrodą za dobre zachowanie.',
  },

  // ── Hiperczujność / kontrola ──
  {
    icon: Hand,
    text: 'Czujesz, że musisz wszystko kontrolować? To nie jest Twoja wina. Tak nauczyło Cię dzieciństwo — kontrola była jedynym sposobem na przetrwanie. Teraz jesteś bezpieczna. Możesz puścić.',
  },
  {
    icon: Feather,
    text: 'Analizujesz każde słowo, ton głosu, wyraz twarzy? To hiperczujność — supermoc, która uratowała Ci życie w dzieciństwie. Ale teraz jesteś w bezpiecznym domu. Możesz ją wyłączyć.',
  },
  {
    icon: Moon,
    text: 'Nie śpisz, bo Twój mózg nie chce się wyłączyć? Hiperczujność nie zna nocnej zmiany. Twoje ciało wciąż "stoi na warcie". Powiedz mu: nie ma zagrożenia. Mogę odpocząć.',
  },

  // ── Wewnętrzny krytyk ──
  {
    icon: TreePine,
    text: 'Twój wewnętrzny krytyk mówi głosem ludzi, którzy Cię skrzywdzili. To nie jest Twój głos. Nie musisz mu wierzyć. Był potrzebny, żebyś przetrwała. Teraz możesz go podziękować i odłożyć.',
  },
  {
    icon: Flame,
    text: 'Gdy słyszysz w głowie "jesteś beznadziejna" — to nie jest prawda. To nagranie z przeszłości puszczone na repeat. Ktoś Ci to wmówił. Ale to nigdy nie było Twoje.',
  },
  {
    icon: Stars,
    text: 'Porównujesz się z innymi i zawsze przegrywasz? Twój wewnętrzny krytyk gra w grę, której nie da się wygrać. Inne osoby nie musiały przetrwać tego, co Ty. Porównanie nie ma sensu.',
  },

  // ── Emocje / samoregulacja ──
  {
    icon: Puzzle,
    text: 'Czujesz się "za dużo" dla ludzi? Twoje emocje nie są za duże. Zostały wytrenowane w środowisku, które było za małe na Ciebie. Teraz masz przestrzeń.',
  },
  {
    icon: Waypoints,
    text: 'Złość, którą czujesz, to nie agresja. To granica, która wreszcie próbuje się postawić. Mała Marta nie mogła się złościć — dorosła Marta ma do tego prawo.',
  },
  {
    icon: Droplets,
    text: 'Płaczesz i nie wiesz dlaczego? Twoje ciało uwalnia napięcie, które nosiłaś latami. Łzy to nie słabość — to odwaga ciała, które wreszcie czuje się na tyle bezpiecznie, by puścić.',
  },
  {
    icon: Sunrise,
    text: 'Masz dobry dzień i czekasz, aż coś pójdzie nie tak? To hiperczujność w spokoju. Twój układ nerwowy nie ufa ciszy, bo cisza w przeszłości oznaczała burzę. Ale ta cisza jest prawdziwa.',
  },

  // ── Poczucie własnej wartości / pozwolenie ──
  {
    icon: Sparkles,
    text: 'Masz prawo potrzebować pomocy. Masz prawo odpoczywać bez zasługiwania na to. Nikt nie musi na to pozwalać. To jest Twoje.',
  },
  {
    icon: Leaf,
    text: 'Nie musisz być produktywna, żeby mieć wartość. Nie musisz być silna, żeby zasługiwać na miłość. Możesz po prostu być — i to wystarczy.',
  },
  {
    icon: Feather,
    text: 'Twoja matka wyręczała Cię we wszystkim, a potem mówiła, że nic nie umiesz? Sama nauczyłaś się angielskiego. Sama zbudowałaś życie na drugim końcu świata. To mówi wszystko o tym, kim jesteś.',
  },

  // ── Relacje / bezpieczeństwo ──
  {
    icon: Heart,
    text: 'Boisz się, że Piotrek się zmieni? Że pewnego dnia stanie się kimś innym? Ta obawa nie jest o niego — to echo ludzi, którzy faktycznie się zmieniali. Piotrek jest Piotrkiem. Każdego dnia.',
  },
  {
    icon: Hand,
    text: 'Prosisz o pomoc i zaraz czujesz, że przesadzasz? Nie przesadzasz. Przez lata uczono Cię, że Twoje potrzeby są ciężarem. Ale Piotrek nie uważa Cię za ciężar.',
  },
]

// Deterministyczny wybór 3 kart na dany dzień
function getDailyCards() {
  const today = new Date()
  const dayIndex = today.getFullYear() * 366 + today.getMonth() * 31 + today.getDate()

  const shuffled = [...allCards]
  // Fisher-Yates z seedem dziennym
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = (dayIndex * (i + 7) + 13) % (i + 1)
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }

  return shuffled.slice(0, 3)
}

export default function StanZielony({ navigate }) {
  const cards = getDailyCards()

  return (
    <div className="px-6 py-8 max-w-lg mx-auto">
      <button
        onClick={() => navigate('home')}
        className="flex items-center gap-2 text-zinc-500 mb-8 active:text-zinc-300 transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span>Wróć</span>
      </button>

      <h2 className="text-2xl font-light mb-2">Stan Zielony</h2>
      <p className="text-zinc-600 text-sm mb-8">Dzisiejsze fiszki dla Ciebie</p>

      <div className="space-y-6">
        {cards.map((card, i) => {
          const Icon = card.icon
          return (
            <div key={i} className="bg-zinc-900 rounded-2xl p-8">
              <Icon className="w-10 h-10 text-emerald-400/50 mb-5" strokeWidth={1.5} />
              <p className="text-xl leading-relaxed text-zinc-300">
                {card.text}
              </p>
            </div>
          )
        })}
      </div>
    </div>
  )
}
