import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useState } from "react"
import { Skeleton } from "@/components/ui/skeleton"
import { ExternalLink, Github } from "lucide-react"

export interface ProjectCardProps {
  project: {
    title: string
    category: string
    image: string
    description: string
    link: string
    badge?: string
    mediaType?: "image" | "video"
  }
  onLoad: () => void
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project, onLoad }) => {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
    onLoad()
  }

  const handleImageError = () => {
    setIsLoading(false)
    setError(true)
    onLoad()
  }

  const toggleFlip = () => {
    setIsFlipped(!isFlipped)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      viewport={{ once: true }}
      className="project-card group [perspective:1000px] sm:hover:cursor-pointer"
      onClick={toggleFlip}
    >
      <div 
        className={`
          relative transition-all duration-500 [transform-style:preserve-3d] 
          h-[300px] sm:h-[400px]
          ${isFlipped ? '[transform:rotateY(180deg)]' : ''}
          sm:group-hover:[transform:rotateY(180deg)]
        `}
      >
        {/* Front of the card */}
        <div className="absolute inset-0 [backface-visibility:hidden]">
          <Card className="h-full">
            <CardContent className="p-0 h-full relative">
              {project.badge && (
                <div className="absolute -top-2 -right-5 z-20 rotate-12 transform hover:rotate-0 transition-transform duration-200">
                  <Badge 
                    variant="default" 
                    className="bg-primary text-primary-foreground font-semibold px-3 py-1.5 shadow-lg"
                  >
                    {project.badge}
                  </Badge>
                </div>
              )}
              <div className="absolute inset-0">
                {isLoading && (
                  <Skeleton className="absolute inset-0" />
                )}
                {error ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <span className="text-muted-foreground">Failed to load media</span>
                  </div>
                ) : project.mediaType === "video" ? (
                  <video
                    src={project.image}
                    className="absolute inset-0 w-full h-full object-cover"
                    autoPlay
                    loop
                    muted
                    playsInline
                    onLoadedData={handleImageLoad}
                    onError={handleImageError}
                  />
                ) : (
                  <Image
                    src={project.image}
                    alt={`${project.title} project preview`}
                    fill
                    className="object-cover"
                    onLoad={handleImageLoad}
                    onError={handleImageError}
                    priority={false}
                  />
                )}
              </div>
              <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-center bg-gradient-to-t from-black/60 to-transparent text-white">
                <h3 className="text-lg sm:text-xl font-bold mb-2">{project.title}</h3>
                <p className="text-sm sm:text-base opacity-90">{project.category}</p>
                <p className="text-sm opacity-90 mt-2 sm:hidden">Tap to view details</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Back of the card */}
        <div className="absolute inset-0 h-full w-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
          <Card className="h-full">
            <CardContent className="p-4 sm:p-6 h-full flex flex-col bg-card">
              <h3 className="text-lg sm:text-xl font-bold mb-2 sm:mb-4 text-center">{project.title}</h3>
              <p className="text-sm sm:text-base text-muted-foreground flex-grow">
                {project.description}
              </p>
              <div className="mt-4 sm:mt-6 flex justify-center gap-4">
                <Link
                  href={project.link}
                  className="inline-flex items-center gap-2 text-primary hover:underline text-sm sm:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <ExternalLink className="w-4 h-4" />
                  Live Demo
                </Link>
                <Link
                  href="#"
                  className="inline-flex items-center gap-2 text-primary hover:underline text-sm sm:text-base"
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={(e) => e.stopPropagation()}
                >
                  <Github className="w-4 h-4" />
                  Source Code
                </Link>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center sm:hidden">Tap to flip back</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </motion.div>
  )
}

export default ProjectCard