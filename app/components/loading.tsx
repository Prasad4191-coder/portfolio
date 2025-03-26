"use client"
import { motion, AnimatePresence } from "framer-motion"
import { useEffect, useState } from "react"

const codeSnippets = [
  "> npm install",
  "added 156 packages, and audited 234 packages in 3s",
  "> npm run dev",
  "ready - started server on 0.0.0.0:3000",
  "event - compiled client and server successfully",
  "wait compiling...",
  "> Building portfolio...",
  "> Optimizing images...",
  "> Generating static pages...",
  "> Loading assets...",
  "> Initializing animations...",
  "// Loading complete",
]

export default function Loading() {
  const [progress, setProgress] = useState(0)
  const [loadingPhase, setLoadingPhase] = useState("initializing")
  const [isComplete, setIsComplete] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [visibleSnippets, setVisibleSnippets] = useState<number[]>([])
  const [typedTexts, setTypedTexts] = useState<{ [key: number]: string }>({})
  const [currentLine, setCurrentLine] = useState(0)

  useEffect(() => {
    const phases = [
      { name: "installing dependencies", duration: 1500 },     // 1.5s
      { name: "starting development server", duration: 1200 },  // 1.2s
      { name: "building portfolio", duration: 1500 },          // 1.5s
      { name: "optimizing assets", duration: 1200 },           // 1.2s
      { name: "initializing animations", duration: 1000 },     // 1s
      { name: "finalizing", duration: 1000 }                   // 1s
    ]

    let currentPhase = 0
    let phaseStartTime = Date.now()
    let isMounted = true

    // Typewriter effect function with variable speed
    const typeText = (index: number, text: string) => {
      let currentText = ""
      let currentChar = 0
      const typeInterval = setInterval(() => {
        if (!isMounted) {
          clearInterval(typeInterval)
          return
        }
        if (currentChar < text.length) {
          // Faster typing for special characters
          const isSpecialChar = text[currentChar] === ">" || text[currentChar] === "/"
          const charDelay = isSpecialChar ? 10 : 20 // Faster for special chars
          
          currentText += text[currentChar]
          currentChar++
          
          setTypedTexts(prev => ({
            ...prev,
            [index]: currentText
          }))
        } else {
          clearInterval(typeInterval)
          // Move to next line after a short delay
          setTimeout(() => {
            if (isMounted && index < codeSnippets.length - 1) {
              setCurrentLine(index + 1)
              setVisibleSnippets(prev => [...prev, index + 1])
              typeText(index + 1, codeSnippets[index + 1])
            }
          }, 200) // Increased delay between lines
        }
      }, 20) // Base typing speed
    }

    // Start typing the first line
    setCurrentLine(0)
    setVisibleSnippets([0])
    typeText(0, codeSnippets[0])

    const timer = setInterval(() => {
      if (!isMounted) return

      const now = Date.now()
      const elapsed = now - phaseStartTime

      // Update progress more smoothly
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(timer)
          setIsComplete(true)
          // Add a delay before hiding the loading screen
          setTimeout(() => {
            if (isMounted) {
              setIsVisible(false)
            }
          }, 1500) // Increased delay before hiding
          return 100
        }
        return Math.min(prev + 0.5, 100) // Slower progress
      })

      // Update loading phase
      if (currentPhase < phases.length) {
        if (elapsed >= phases[currentPhase].duration) {
          currentPhase++
          phaseStartTime = now
          if (currentPhase < phases.length) {
            setLoadingPhase(phases[currentPhase].name)
          } else {
            setLoadingPhase("complete")
          }
        }
      }
    }, 50)

    return () => {
      isMounted = false
      clearInterval(timer)
    }
  }, [])

  if (!isVisible) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed inset-0 flex flex-col items-center justify-center bg-background p-1 xs:p-2 sm:p-4 z-50 overflow-hidden"
      >
        <div className="relative w-[95%] xs:w-[98%] sm:max-w-md md:max-w-lg lg:max-w-xl">
          {/* Code Editor Style Loading */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-muted/50 p-1.5 xs:p-2 sm:p-4 md:p-6 rounded-lg border shadow-lg backdrop-blur-sm overflow-hidden"
          >
            {/* Editor Header */}
            <div className="flex items-center justify-between mb-1 xs:mb-1.5 sm:mb-2 md:mb-4">
              <div className="flex gap-0.5 xs:gap-1 sm:gap-2">
                <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-red-500" />
                <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-yellow-500" />
                <div className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 md:w-3 md:h-3 rounded-full bg-green-500" />
              </div>
              <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2 text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-muted-foreground">
                <span className="capitalize truncate max-w-[100px] xs:max-w-[120px] sm:max-w-[150px]">{loadingPhase}</span>
                <span className="animate-pulse">●</span>
              </div>
            </div>

            {/* Code Lines */}
            <div className="space-y-0.5 xs:space-y-1 sm:space-y-1.5 md:space-y-2 max-h-[40vh] sm:max-h-[50vh] md:max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
              {codeSnippets.map((line, index) => (
                visibleSnippets.includes(index) && (
                  <motion.div
                    key={index}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: 20, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    className={`flex items-center gap-0.5 xs:gap-1 sm:gap-2 ${
                      index === currentLine ? "bg-muted/30" : ""
                    }`}
                  >
                    <span className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-muted-foreground w-2 xs:w-2.5 sm:w-3 md:w-4 lg:w-6">{index + 1}</span>
                    <motion.div
                      className="flex-1 min-w-0"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <span className={`text-[9px] xs:text-[10px] sm:text-xs md:text-sm font-mono truncate ${
                        line.startsWith(">") ? "text-primary" : 
                        line.startsWith("added") ? "text-green-500" :
                        line.startsWith("ready") ? "text-blue-500" :
                        line.startsWith("event") ? "text-purple-500" :
                        line.startsWith("wait") ? "text-yellow-500" :
                        "text-foreground"
                      }`}>
                        {typedTexts[index] || ""}
                        {index === currentLine && typedTexts[index]?.length < line.length && (
                          <span className="animate-pulse">▋</span>
                        )}
                      </span>
                    </motion.div>
                  </motion.div>
                )
              ))}
            </div>

            {/* Syntax Highlighting */}
            <div className="absolute top-0 right-0 p-0.5 xs:p-1 sm:p-2">
              <div className="flex gap-0.5 xs:gap-1">
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-blue-500" />
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-purple-500" />
                <span className="w-1.5 h-1.5 xs:w-2 xs:h-2 sm:w-2.5 sm:h-2.5 rounded-full bg-green-500" />
              </div>
            </div>
          </motion.div>

          {/* Loading Text */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -20, opacity: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="mt-1 xs:mt-1.5 sm:mt-2 md:mt-4 lg:mt-6 text-center"
          >
            <p className="text-[9px] xs:text-[10px] sm:text-xs md:text-sm text-muted-foreground font-mono">
              Loading
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                ...
              </motion.span>
            </p>
          </motion.div>

          {/* Progress Bar */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: `${progress}%`, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="absolute bottom-0 left-0 h-0.5 bg-primary/20 rounded-full"
          />
        </div>

        {/* Responsive Grid Background */}
        <div className="fixed inset-0 -z-10">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-background/50 to-background" />
        </div>

        {/* Loading Phase Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-1 xs:mt-1.5 sm:mt-2 md:mt-4 text-[9px] xs:text-[10px] sm:text-xs text-muted-foreground font-mono"
        >
          <div className="flex items-center gap-0.5 xs:gap-1 sm:gap-2">
            <span>Phase:</span>
            <span className="capitalize truncate max-w-[80px] xs:max-w-[100px] sm:max-w-[120px]">{loadingPhase}</span>
            <span className={`${isComplete ? 'text-green-500' : 'text-primary'}`}>
              ({Math.round(progress)}%)
            </span>
            {isComplete && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-500"
              >
                ✓
              </motion.span>
            )}
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  )
} 