import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

export interface SkillCardProps {
  skill: {
    icon: React.ReactNode
    title: string
    description: string
  }
}

const SkillCard: React.FC<SkillCardProps> = ({ skill }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Simulate loading state for dynamic content
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleIconError = () => {
    setIsLoading(false)
    setError(true)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="skill-card"
    >
      <Card className="h-full hover:shadow-lg transition-shadow">
        <CardContent className="pt-6">
          <div className="mb-4">
            {isLoading ? (
              <Skeleton className="w-8 h-8" />
            ) : error ? (
              <div className="w-8 h-8 flex items-center justify-center bg-muted rounded-full">
                <span className="text-muted-foreground">!</span>
              </div>
            ) : (
              <div onError={handleIconError}>
                {skill.icon}
              </div>
            )}
          </div>
          {isLoading ? (
            <>
              <Skeleton className="h-6 w-3/4 mb-2" />
              <Skeleton className="h-4 w-full" />
            </>
          ) : (
            <>
              <h3 className="text-xl font-bold mb-2">{skill.title}</h3>
              <p className="text-muted-foreground">{skill.description}</p>
            </>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default SkillCard 