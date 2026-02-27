import { useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Home from './screens/Home'
import StanCzerwony from './screens/StanCzerwony'
import NiszczarkaMysli from './screens/NiszczarkaMysli'
import SloikSukcesow from './screens/SloikSukcesow'
import StanZolty from './screens/StanZolty'
import StanZielony from './screens/StanZielony'
import ZdejmijZbroje from './screens/ZdejmijZbroje'

const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: { duration: 0.4, ease: 'easeInOut' },
}

function App() {
  const [screen, setScreen] = useState('home')

  const navigate = useCallback((target) => {
    setScreen(target)
    window.scrollTo(0, 0)
  }, [])

  const renderScreen = () => {
    switch (screen) {
      case 'stan-czerwony':
        return <StanCzerwony navigate={navigate} />
      case 'niszczarka':
        return <NiszczarkaMysli navigate={navigate} />
      case 'sloik':
        return <SloikSukcesow navigate={navigate} />
      case 'stan-zolty':
        return <StanZolty navigate={navigate} />
      case 'stan-zielony':
        return <StanZielony navigate={navigate} />
      case 'zdejmij-zbroje':
        return <ZdejmijZbroje navigate={navigate} />
      default:
        return <Home navigate={navigate} />
    }
  }

  return (
    <div className="min-h-dvh bg-black text-zinc-200">
      <AnimatePresence mode="wait">
        <motion.div
          key={screen}
          {...pageTransition}
          className="min-h-dvh"
        >
          {renderScreen()}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default App
