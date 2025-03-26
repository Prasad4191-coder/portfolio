"use client"
import type React from "react"
import { useEffect, useRef, useState, useMemo, useCallback } from "react"
import { TypeAnimation } from "react-type-animation"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import { ChevronDown, Code, ExternalLink, Github, Mail, Moon, Sun, User, Menu, X, Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import Image from "next/image"
import { useTheme } from "next-themes"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import dynamic from "next/dynamic"
import Loading from "./components/loading"
import { Suspense } from "react"

// Lazy load components
const ProjectCard = dynamic(() => import("./components/project-card"), {
  loading: () => <Loading />,
  ssr: false,
})

const SkillCard = dynamic(() => import("./components/skill-card"), {
  loading: () => <Loading />,
  ssr: false,
})

export default function Portfolio() {
  const [activeSection, setActiveSection] = useState("home")
  const { setTheme, theme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [imagesLoaded, setImagesLoaded] = useState(0)
  const totalImages = 6 // Update this based on your actual image count

  const homeRef = useRef<HTMLDivElement>(null)
  const aboutRef = useRef<HTMLDivElement>(null)
  const skillsRef = useRef<HTMLDivElement>(null)
  const projectsRef = useRef<HTMLDivElement>(null)
  const educationRef = useRef<HTMLDivElement>(null)
  const contactRef = useRef<HTMLDivElement>(null)
  const timelineRef = useRef<HTMLDivElement>(null)
  const heroTextRef = useRef<HTMLDivElement>(null)
  const skillsContainerRef = useRef<HTMLDivElement>(null)

  const { scrollYProgress } = useScroll()
  const opacity = useTransform(scrollYProgress, [0, 0.2], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.9])

  // Add click outside handler for mobile menu
  const mobileMenuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMobileMenuOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Initialize GSAP
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger)
    setMounted(true)

    // Batch GSAP animations for better performance
    const animations: (gsap.core.Timeline | gsap.core.Tween)[] = []

    // Hero section animation
    if (heroTextRef.current) {
      animations.push(
        gsap.from(heroTextRef.current.children, {
          opacity: 0,
          y: 50,
          stagger: 0.2,
          duration: 1,
          ease: "power3.out",
        })
      )
    }

    // Timeline animation with enhanced effects
    if (timelineRef.current) {
      const timelineItems = timelineRef.current.querySelectorAll(".timeline-item")
      const timelineLine = timelineRef.current.querySelector(".timeline-line")

      // Animate the timeline line
      animations.push(
        gsap.from(timelineLine, {
          scrollTrigger: {
            trigger: timelineRef.current,
            start: "top center",
            end: "bottom center",
            scrub: 1,
          },
          scaleY: 0,
          transformOrigin: "top",
        })
      )

      timelineItems.forEach((item, index) => {
        const direction = index % 2 === 0 ? -50 : 50
        const delay = index * 0.2

        animations.push(
          gsap.from(item, {
            scrollTrigger: {
              trigger: item,
              start: "top 80%",
              toggleActions: "play none none none",
            },
            opacity: 0,
            x: direction,
            scale: 0.8,
            duration: 0.8,
            delay: delay,
            ease: "power2.out",
          })
        )

        // Animate the timeline dots
        const dot = item.querySelector(".timeline-dot")
        if (dot) {
          animations.push(
            gsap.from(dot, {
              scrollTrigger: {
                trigger: item,
                start: "top 80%",
                toggleActions: "play none none none",
              },
              scale: 0,
              duration: 0.5,
              delay: delay,
              ease: "back.out(1.7)",
            })
          )
        }
      })
    }

    // Skills animation with enhanced effects
    if (skillsContainerRef.current) {
      const cards = skillsContainerRef.current.querySelectorAll(".skill-card")

      animations.push(
        gsap.from(cards, {
          scrollTrigger: {
            trigger: skillsContainerRef.current,
            start: "top 70%",
          },
          opacity: 0,
          y: 50,
          stagger: 0.1,
          duration: 0.6,
          ease: "back.out(1.7)",
        })
      )
    }

    // Projects section animation
    const projectCards = document.querySelectorAll(".project-card")
    projectCards.forEach((card, index) => {
      animations.push(
        gsap.from(card, {
          scrollTrigger: {
            trigger: card,
            start: "top 80%",
            toggleActions: "play none none none",
          },
          opacity: 0,
          y: 30,
          duration: 0.6,
          delay: index * 0.1,
          ease: "power2.out",
        })
      )
    })

    // Cleanup animations on unmount
    return () => {
      animations.forEach(animation => animation.kill())
    }
  }, [])

  // Memoize sections array
  const sections = useMemo(() => [
    { id: "home", ref: homeRef },
    { id: "about", ref: aboutRef },
    { id: "skills", ref: skillsRef },
    { id: "projects", ref: projectsRef },
    { id: "education", ref: educationRef },
    { id: "contact", ref: contactRef },
  ], [])

  // Memoize scroll handler
  const handleScroll = useCallback(() => {
    const scrollPosition = window.scrollY + 100

    for (const section of sections) {
      if (section.ref.current) {
        const offsetTop = section.ref.current.offsetTop
        const offsetHeight = section.ref.current.offsetHeight

        if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
          setActiveSection(section.id)
          break
        }
      }
    }
  }, [sections])

  useEffect(() => {
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [handleScroll])

  // Memoize scroll function
  const scrollToSection = useCallback((ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      window.scrollTo({
        top: ref.current.offsetTop,
        behavior: "smooth",
      })
    }
  }, [])

  // Memoize navigation items
  const navigationItems = useMemo(() => [
    { id: "home", label: "Home", ref: homeRef },
    { id: "about", label: "About", ref: aboutRef },
    { id: "skills", label: "Skills", ref: skillsRef },
    { id: "projects", label: "Projects", ref: projectsRef },
    { id: "education", label: "Education", ref: educationRef },
    { id: "contact", label: "Contact", ref: contactRef },
  ], [])

  // Add timeout to ensure loading state is cleared
  useEffect(() => {
    const timeout = setTimeout(() => {
      setIsLoading(false)
    }, 8000) // Increased timeout to 8 seconds to match loading component duration

    return () => clearTimeout(timeout)
  }, [])

  // Handle image loading
  const handleImageLoad = useCallback(() => {
    setImagesLoaded(prev => {
      const newCount = prev + 1
      if (newCount === totalImages) {
        // Add a small delay after all images are loaded
        setTimeout(() => {
          setIsLoading(false)
        }, 1000)
      }
      return newCount
    })
  }, [totalImages])

  // Add this function inside the Portfolio component, after the other state declarations
  const handleDownloadResume = () => {
    const link = document.createElement('a')
    link.href = '/resume.pdf' // Make sure to add your resume file as resume.pdf in the public directory
    link.download = 'resume.pdf'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Avoid hydration mismatch
  if (!mounted) {
    return <Loading />
  }

  return (
    <div className="font-mono overflow-x-hidden">
      {/* Loading Overlay */}
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background"
        >
          <Loading />
          <p className="mt-4 text-muted-foreground">
            Loading... {Math.round((imagesLoaded / totalImages) * 100)}%
          </p>
        </motion.div>
      )}

      {/* Navigation */}
      <motion.nav
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isLoading ? 0 : 1, y: isLoading ? -20 : 0 }}
        transition={{ duration: 0.3 }}
        className="fixed top-0 left-0 right-0 z-40 bg-background/80 backdrop-blur-md border-b"
      >
        <div className="container mx-auto px-4 sm:px-6 py-3">
          <div className="flex justify-between items-center">
            <div className="text-xl font-bold">
              <span className="text-primary">&lt;</span>
              PC
              <span className="text-primary">/&gt;</span>
            </div>
            <ul className="hidden md:flex space-x-8">
              {navigationItems.map((item) => (
                <li key={item.id}>
                  <button
                    onClick={() => scrollToSection(item.ref as React.RefObject<HTMLDivElement>)}
                    className={`hover:text-primary transition-colors ${activeSection === item.id ? "text-primary font-bold" : ""}`}
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                aria-label="Toggle theme"
                className="rounded-full"
              >
                {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              </Button>
              <Button 
                variant="outline" 
                size="icon"
                className="md:hidden"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed inset-y-0 right-0 w-64 bg-background border-l z-50 md:hidden"
            ref={mobileMenuRef}
          >
            <div className="flex flex-col h-full">
              <div className="p-4 border-b">
                <div className="text-xl font-bold">
                  <span className="text-primary">&lt;</span>
                  DevName
                  <span className="text-primary">/&gt;</span>
                </div>
              </div>
              <nav className="flex-1 p-4 overflow-y-auto">
                <ul className="space-y-4">
                  {navigationItems.map((item) => (
                    <li key={item.id}>
                      <button
                        onClick={() => {
                          scrollToSection(item.ref as React.RefObject<HTMLDivElement>)
                          setIsMobileMenuOpen(false)
                        }}
                        className={`w-full text-left px-4 py-2 rounded-md transition-colors ${
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        }`}
                      >
                        {item.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </nav>
              <div className="p-4 border-t">
                <div className="flex justify-center gap-4">
                  {["github", "twitter", "linkedin", "dribbble"].map((social, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="bg-muted p-2 rounded-full hover:bg-primary/10 transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <Github className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Overlay for mobile menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-background/80 backdrop-blur-sm z-40 md:hidden"
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={homeRef} className="min-h-screen flex items-center justify-center relative overflow-hidden pt-16">
        <motion.div style={{ opacity, scale }} className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-grid-pattern opacity-[0.03]"></div>
        </motion.div>

        <div className="container mx-auto px-4 sm:px-6 py-20 text-center">
          <div ref={heroTextRef} className="max-w-3xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="mb-6"
            >
              <Badge variant="outline" className="mb-4 text-sm py-1 px-3">
                Frontend Developer
              </Badge>
              <h1 className="text-3xl md:text-5xl font-bold mb-4">
                Hi, I'm <span className="text-primary">Prasad Chattar</span>
              </h1>
              <div className="text-xl md:text-2xl text-muted-foreground h-12">
                <TypeAnimation
                  sequence={[
                    "I build web experiences",
                    1000,
                    "I create responsive designs",
                    1000,
                    "I develop Angular/React applications",
                    1000,
                    "I craft user interfaces",
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Number.POSITIVE_INFINITY}
                />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="flex flex-col sm:flex-row gap-4 justify-center mt-8"
            >
              <Button
                onClick={() => contactRef.current?.scrollIntoView({ behavior: "smooth" })}
                className="bg-primary hover:bg-primary/90"
              >
                Contact Me
              </Button>
              <Button
                onClick={handleDownloadResume}
                variant="outline"
                className="flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download Resume
              </Button>
            </motion.div>
          </div>
        </div>

        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-8 left-1/2 -translate-x-1/2 cursor-pointer"
          onClick={() => scrollToSection(aboutRef)}
        >
          <ChevronDown className="w-8 h-8 text-primary" />
        </motion.div>
      </section>

      {/* About Section */}
      <section ref={aboutRef} className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-2">
              About Me
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Who I Am</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto space-y-6"
          >
            <h3 className="text-2xl font-bold text-center">Frontend Developer based in Pune</h3>
            <p className="text-muted-foreground indent-16">
              I'm a passionate frontend developer with a keen eye for design and a love for creating seamless user
              experiences. With expertise in modern JavaScript frameworks and a strong foundation in HTML, CSS, and
              responsive design, I transform ideas into elegant, functional websites.
            </p>
            <p className="text-muted-foreground indent-16">
              My approach combines technical precision with creative problem-solving, ensuring that every project I
              undertake not only meets but exceeds expectations. I'm constantly learning and adapting to new
              technologies to stay at the forefront of web development.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
              <div className="text-center sm:text-left">
                <p className="font-bold mb-1">Name:</p>
                <p className="text-muted-foreground">Prasad Chattar</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="font-bold mb-1">Email:</p>
                <p className="text-muted-foreground">prasadchattar4191@gmail.com</p>
              </div>
              <div className="text-center sm:text-left">
                <p className="font-bold mb-1">Location:</p>
                <p className="text-muted-foreground">Pune,Maharashtra,India</p>
              </div>
              <div className="text-center sm:text-right">
                <p className="font-bold mb-1">Availability:</p>
                <p className="text-muted-foreground">Freelance / Full-time</p>
              </div>
            </div>
            <div className="flex justify-center mt-8">
              <Button onClick={() => scrollToSection(contactRef)}>Let's Talk</Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Skills Section */}
      <section ref={skillsRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-2">
              My Skills
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">What I Do</h2>
          </motion.div>

          <div ref={skillsContainerRef} className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Code className="w-10 h-10 text-primary" />,
                title: "Web Development",
                description: "Building responsive and performant websites using modern frameworks and best practices.",
              },
              {
                icon: <User className="w-10 h-10 text-primary" />,
                title: "UI/UX Design",
                description: "Creating intuitive and engaging user interfaces with a focus on user experience.",
              },
              {
                icon: <Github className="w-10 h-10 text-primary" />,
                title: "Version Control",
                description: "Managing code with Git, ensuring collaborative and organized development.",
              },
              {
                icon: <Code className="w-10 h-10 text-primary" />,
                title: "Frontend Frameworks",
                description: "Expertise in Angular,React,and other modern JavaScript frameworks.",
              },
              {
                icon: <Code className="w-10 h-10 text-primary" />,
                title: "Responsive Design",
                description: "Crafting websites that work flawlessly across all devices and screen sizes.",
              },
              {
                icon: <Code className="w-10 h-10 text-primary" />,
                title: "Performance Optimization",
                description: "Enhancing website speed and efficiency for better user experience.",
              },
            ].map((skill, index) => (
              <Suspense key={index} fallback={<Loading />}>
                <SkillCard skill={skill} />
              </Suspense>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.6 }}
            viewport={{ once: true }}
            className="mt-16"
          >
            <h3 className="text-2xl font-bold mb-6 text-center">Technical Skills</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { name: "HTML/CSS", level: 85 },
                { name: "JavaScript", level: 80 },
                { name: "Angular", level: 85 },
                { name: "React", level: 80 },
                { name: "TypeScript", level: 80 },
                { name: "Tailwind CSS", level: 75 },
                { name: "Bootstrap", level: 80 },
                { name: "Angular Material", level: 75 },
                { name: "PrimeNG", level: 80 },
                { name: "Photoshop", level: 70 },
                { name: "Font Awesome", level: 75 },
                { name: "GitHub", level: 75 },
              ].map((skill, index) => (
                <div key={index} className="mb-4">
                  <div className="flex justify-between mb-1">
                    <span className="font-medium">{skill.name}</span>
                    <span>{skill.level}%</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${skill.level}%` }}
                      transition={{ duration: 1, delay: index * 0.1 }}
                      viewport={{ once: true }}
                      className="h-full bg-primary"
                    ></motion.div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Projects Section */}
      <section ref={projectsRef} className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-2">
              Portfolio
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">My Recent Work</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Portfolio Website",
                category: "Next.js Development",
                image: "/portfolio-preview.mp4",
                description: "A modern, responsive portfolio website built with Next.js, Tailwind CSS, and Framer Motion. Features include dark mode, smooth animations, and interactive project cards.",
                link: "#",
                badge: "Currently Watching",
                mediaType: "video" as const
              },
              {
                title: "AR Infra Mobile Application",
                category: "Angular Development",
                image: "/ar-infra-preview.png",
                description: "A property management application built with Angular and TypeScript, featuring offline data storage with IndexedDB and dynamic form components.",
                link: "#",
                mediaType: "image" as const
              },
              {
                title: "GVPL Technologies Animation Studio",
                category: "Web Development",
                image: "/gvpl-preview.png",
                description: "A dynamic, responsive animation studio website with admin control panel, blog integration, and Firebase real-time data storage.",
                link: "#",
                mediaType: "image" as const
              },
            ].map((project, index) => (
              <Suspense key={index} fallback={<Loading />}>
                <ProjectCard
                  project={project}
                  onLoad={handleImageLoad}
                />
              </Suspense>
            ))}
          </div>
        </div>
      </section>

      {/* Education Roadmap Section */}
      <section ref={educationRef} className="py-20">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-2">
              My Journey
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Education & Experience</h2>
          </motion.div>

          <div ref={timelineRef} className="relative">
            {/* Timeline Line */}
            <div className="timeline-line absolute left-0 md:left-1/2 transform md:-translate-x-1/2 h-full w-1 bg-muted/30">
              <motion.div
                className="absolute top-0 left-0 w-full bg-primary"
                initial={{ scaleY: 0 }}
                whileInView={{ scaleY: 1 }}
                transition={{ duration: 2, ease: "easeInOut" }}
                viewport={{ once: true }}
              />
            </div>

            {/* Timeline Items */}
            <div className="relative">
              {[
                {
                  year: "2022 - 2023",
                  title: "M.Sc. Computer Science",
                  organization: "Pune University",
                  description: "Completed Master's in Computer Science with 61.25%, gaining advanced knowledge in computer science and software development.",
                },
                {
                  year: "2020 - 2021",
                  title: "B.Sc. Computer Science",
                  organization: "Pune University",
                  description: "Completed Bachelor's in Computer Science with 65.36%, building a strong foundation in programming and web technologies.",
                },
                {
                  year: "2015 - 2016",
                  title: "HSC (Higher Secondary)",
                  organization: "Maharashtra State Board",
                  description: "Completed Higher Secondary Education with 47.23%.",
                },
                {
                  year: "2013 - 2014",
                  title: "SSC (Secondary School)",
                  organization: "Maharashtra State Board",
                  description: "Completed Secondary School Education with 73.40%.",
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                  viewport={{ once: true }}
                  className={`mb-12 md:flex items-center timeline-item ${index % 2 === 0 ? "md:flex-row-reverse" : ""}`}
                >
                  <motion.div
                    className={`md:w-1/2 ${index % 2 === 0 ? "md:pl-8" : "md:pr-8 md:text-right"} pl-8 md:pl-0`}
                    whileHover={{ scale: 1.02 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="bg-background p-6 rounded-lg shadow-md border hover:shadow-lg transition-shadow">
                      <motion.span
                        className="text-primary font-bold"
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: index * 0.2 + 0.3 }}
                      >
                        {item.year}
                      </motion.span>
                      <motion.h3
                        className="text-xl font-bold mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.4 }}
                      >
                        {item.title}
                      </motion.h3>
                      <motion.p
                        className="text-muted-foreground font-medium"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.5 }}
                      >
                        {item.organization}
                      </motion.p>
                      <motion.p
                        className="mt-2"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 + 0.6 }}
                      >
                        {item.description}
                      </motion.p>
                    </div>
                  </motion.div>

                  <motion.div
                    className="absolute left-0 md:left-1/2 transform md:-translate-x-1/2 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 300, delay: index * 0.2 }}
                  >
                    <div className="timeline-dot relative">
                      <div className="w-5 h-5 rounded-full bg-primary border-4 border-background"></div>
                      <div className="absolute inset-0 w-5 h-5 rounded-full bg-primary/20 animate-ping"></div>
                    </div>
                  </motion.div>

                  <div className="md:w-1/2"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section ref={contactRef} className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <Badge variant="outline" className="mb-2">
              Get In Touch
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold">Contact Me</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-10">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <h3 className="text-2xl font-bold mb-4">Let's Talk About Your Project</h3>
              <p className="text-muted-foreground mb-6">
                I'm interested in freelance opportunities – especially ambitious or large projects. However, if you have
                other requests or questions, don't hesitate to contact me.
              </p>

              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <Mail className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="text-muted-foreground">prasadchattar4191@gmail.com</p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="bg-primary/10 p-3 rounded-full">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium">Location</p>
                    <p className="text-muted-foreground">Pune,Maharashtra,India</p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h4 className="font-bold mb-4">Social Profiles</h4>
                <div className="flex gap-4">
                  {["github", "twitter", "linkedin", "dribbble"].map((social, index) => (
                    <Link
                      key={index}
                      href="#"
                      className="bg-background p-3 rounded-full border hover:bg-primary/10 transition-colors"
                    >
                      <span className="sr-only">{social}</span>
                      <Github className="w-5 h-5" />
                    </Link>
                  ))}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <form className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium">
                      Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="w-full p-3 rounded-md border bg-background"
                      placeholder="Your name"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium">
                      Email
                    </label>
                    <input
                      id="email"
                      type="email"
                      className="w-full p-3 rounded-md border bg-background"
                      placeholder="Your email"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium">
                    Subject
                  </label>
                  <input
                    id="subject"
                    type="text"
                    className="w-full p-3 rounded-md border bg-background"
                    placeholder="Subject"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium">
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    className="w-full p-3 rounded-md border bg-background resize-none"
                    placeholder="Your message"
                  ></textarea>
                </div>

                <Button type="submit" className="w-full">
                  Send Message
                </Button>
              </form>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Fixed Dark Mode Toggle for Mobile */}
      <div className="fixed bottom-6 right-6 md:hidden z-50">
        <Button
          variant="default"
          size="icon"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          aria-label="Toggle theme"
          className="rounded-full shadow-lg"
        >
          {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
        </Button>
      </div>

      {/* Footer */}
      <footer className="py-6 border-t">
        <div className="container mx-auto px-4 sm:px-6 text-center">
          <p className="text-muted-foreground">© {new Date().getFullYear()} Prasad Chattar. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}

