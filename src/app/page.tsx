'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { 
  Send, 
  RotateCcw, 
  Sparkles,
  Instagram,
  Film,
  LayoutGrid,
  TrendingUp,
  Lightbulb,
  Rocket,
  Heart,
  MessageCircle,
  Bookmark,
  Share2,
  Music,
  Image as ImageIcon,
  Hash
} from 'lucide-react'

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

// Nichos populares como SUGERENCIAS (el usuario puede escribir cualquier otro)
const nichosPopulares = [
  'Fitness y ejercicio',
  'Cocina y recetas',
  'Belleza y maquillaje',
  'Negocios y emprendimiento',
  'Desarrollo personal',
  'Tecnología',
  'Viajes',
  'Moda',
  'Finanzas personales',
  'Relaciones y pareja',
  'Maternidad y crianza',
  'Mascotas',
  'Decoración y hogar',
  'Arte y dibujo',
  'Humor y entretenimiento'
]

export default function Home() {
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const scrollToBottom = useCallback(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Enfocar input al cargar
  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  const generateId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

  // Parsear botones del formato [BUTTONS:opc1|opc2|opc3]
  const parseButtons = (content: string) => {
    const buttonRegex = /\[BUTTONS:([^\]]+)\]/
    const match = content.match(buttonRegex)
    
    if (match) {
      const buttons = match[1].split('|').map(b => b.trim())
      const textWithoutButtons = content.replace(buttonRegex, '').trim()
      return { text: textWithoutButtons, buttons }
    }
    
    return { text: content, buttons: null }
  }

  const sendMessage = async (content: string) => {
    if (!content.trim() || isLoading) return

    const userMessage: Message = {
      id: generateId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsLoading(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(m => ({
            role: m.role,
            content: m.content
          })),
          currentStep
        })
      })

      const data = await response.json()

      if (response.ok && data.success) {
        const assistantMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: data.message,
          timestamp: new Date()
        }
        setMessages(prev => [...prev, assistantMessage])
        
        // Actualizar paso si viene en la respuesta
        if (data.nextStep) {
          setCurrentStep(data.nextStep)
        }
      } else {
        const errorMessage: Message = {
          id: generateId(),
          role: 'assistant',
          content: 'Lo siento, ha ocurrido un error. Por favor, intenta de nuevo.',
          timestamp: new Date()
        }
        setMessages(prev => [...prev, errorMessage])
      }
    } catch {
      const errorMessage: Message = {
        id: generateId(),
        role: 'assistant',
        content: 'Lo siento, no pude procesar tu solicitud. Por favor, verifica tu conexión e intenta de nuevo.',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsLoading(false)
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    sendMessage(inputValue)
  }

  const handleButtonClick = (buttonText: string) => {
    sendMessage(buttonText)
  }

  const handleNichoSuggestion = (nicho: string) => {
    sendMessage(nicho)
  }

  const clearConversation = () => {
    setMessages([])
    setInputValue('')
    setCurrentStep(1)
    inputRef.current?.focus()
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString('es-ES', { 
      hour: '2-digit', 
      minute: '2-digit' 
    })
  }

  // Datos de los pasos
  const steps = [
    { number: 1, title: 'Tu Nicho', icon: Hash },
    { number: 2, title: 'Formato', icon: Film },
    { number: 3, title: 'Tendencias', icon: TrendingUp },
    { number: 4, title: 'Opciones', icon: Lightbulb },
    { number: 5, title: 'Contenido', icon: Rocket }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-violet-800 to-fuchsia-800 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-black/30 border-b border-white/10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          {/* Progress Bar */}
          <div className="mb-3">
            <div className="flex items-center justify-between mb-2">
              {steps.map((step, index) => (
                <div key={step.number} className="flex items-center">
                  <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold transition-all duration-300 ${
                    currentStep >= step.number 
                      ? 'bg-gradient-to-r from-pink-500 to-orange-400 text-white shadow-lg shadow-pink-500/30' 
                      : 'bg-white/10 text-white/40'
                  }`}>
                    {currentStep > step.number ? '✓' : step.number}
                  </div>
                  {index < steps.length - 1 && (
                    <div className={`w-12 sm:w-20 h-1 rounded-full transition-all duration-300 ${
                      currentStep > step.number ? 'bg-gradient-to-r from-pink-500 to-orange-400' : 'bg-white/10'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            <p className="text-center text-white/60 text-sm">
              Paso {currentStep} de 5: <span className="text-white font-medium">{steps[currentStep - 1].title}</span>
            </p>
          </div>
          
          {/* Logo */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shadow-lg shadow-pink-500/30">
                <Instagram className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">Contenido Viral con NTM</h1>
                <p className="text-sm text-white/60">Tu agente de contenido viral</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={clearConversation}
              className="text-white/60 hover:text-white hover:bg-white/10"
              title="Empezar de nuevo"
            >
              <RotateCcw className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col max-w-4xl mx-auto w-full">
        <ScrollArea className="flex-1 px-4 py-6" ref={scrollRef}>
          <div className="space-y-4">
            {/* Welcome Message - Paso 1 */}
            {messages.length === 0 && (
              <div className="flex flex-col items-center justify-center py-8 animate-fade-in">
                <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shadow-2xl shadow-pink-500/30 mb-6">
                  <Sparkles className="w-12 h-12 text-white" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 text-center">
                  ¡Hola! Soy tu agente de contenido viral
                </h2>
                <p className="text-white/70 text-center max-w-lg mb-6 text-lg">
                  Te ayudaré a crear contenido que viralice en Instagram. 
                  <br />
                  <span className="text-white font-medium">Escribe tu nicho</span> para comenzar.
                </p>
                
                {/* Sugerencias de nichos populares */}
                <div className="w-full max-w-2xl">
                  <p className="text-white/50 text-sm text-center mb-3">
                    💡 Sugerencias de nichos populares:
                  </p>
                  <div className="flex flex-wrap justify-center gap-2">
                    {nichosPopulares.slice(0, 8).map((nicho, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        className="bg-white/5 border-white/20 text-white hover:bg-white/10 hover:border-pink-400/50 transition-all"
                        onClick={() => handleNichoSuggestion(nicho)}
                        disabled={isLoading}
                      >
                        {nicho}
                      </Button>
                    ))}
                  </div>
                  <p className="text-white/40 text-xs text-center mt-3">
                    O escribe tu propio nicho en el campo de abajo
                  </p>
                </div>
              </div>
            )}

            {/* Messages */}
            {messages.map((message, index) => {
              const { text, buttons } = parseButtons(message.content)
              
              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${message.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  {message.role === 'assistant' && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shrink-0 shadow-lg">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div className={`max-w-[85%] sm:max-w-[75%] ${message.role === 'user' ? 'order-first' : ''}`}>
                    <div
                      className={`rounded-2xl px-4 py-3 shadow-lg ${
                        message.role === 'user'
                          ? 'bg-gradient-to-br from-pink-500 to-orange-400 text-white rounded-br-md'
                          : 'bg-white/10 backdrop-blur-sm border border-white/10 text-white rounded-bl-md'
                      }`}
                    >
                      <p className="text-sm sm:text-base leading-relaxed whitespace-pre-wrap">{text}</p>
                      <p className={`text-xs mt-2 ${message.role === 'user' ? 'text-white/60' : 'text-white/40'}`}>
                        {formatTime(message.timestamp)}
                      </p>
                    </div>
                    
                    {/* Botones clickeables */}
                    {buttons && buttons.length > 0 && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {buttons.map((buttonText, btnIndex) => (
                          <Button
                            key={btnIndex}
                            variant="outline"
                            size="sm"
                            className="bg-gradient-to-r from-pink-500/20 to-orange-400/20 border-pink-400/50 text-white hover:from-pink-500/40 hover:to-orange-400/40 transition-all shadow-md"
                            onClick={() => handleButtonClick(buttonText)}
                            disabled={isLoading}
                          >
                            {buttonText}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                  {message.role === 'user' && (
                    <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
                      <span className="text-white text-lg">👤</span>
                    </div>
                  )}
                </div>
              )
            })}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex gap-3 justify-start animate-fade-in">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center shrink-0 shadow-lg">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <div className="bg-white/10 backdrop-blur-sm border border-white/10 rounded-2xl rounded-bl-md px-4 py-3 shadow-lg">
                  <div className="flex items-center gap-1">
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-2 h-2 bg-pink-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                    <span className="ml-2 text-sm text-white/70">Creando contenido viral...</span>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input Area */}
        <div className="sticky bottom-0 bg-gradient-to-t from-purple-900/95 via-purple-900/90 to-transparent pt-6 pb-4 px-4">
          <form onSubmit={handleSubmit} className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                ref={inputRef}
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder={currentStep === 1 ? "Escribe tu nicho (ej: fitness, cocina, belleza...)" : "Escribe tu respuesta..."}
                className="w-full h-14 pl-4 pr-4 rounded-xl bg-white/10 border-white/20 text-white placeholder:text-white/40 focus:bg-white/15 focus:border-pink-400/50 transition-all text-base"
                disabled={isLoading}
              />
            </div>
            <Button
              type="submit"
              size="icon"
              className="h-14 w-14 rounded-xl bg-gradient-to-r from-pink-500 to-orange-400 hover:from-pink-600 hover:to-orange-500 shadow-lg shadow-pink-500/30 hover:shadow-xl hover:shadow-pink-500/40 transition-all disabled:opacity-50"
              disabled={!inputValue.trim() || isLoading}
            >
              <Send className="w-5 h-5 text-white" />
            </Button>
          </form>
          
          {/* Stats */}
          <div className="flex justify-center gap-6 mt-4">
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Heart className="w-4 h-4 text-pink-400" />
              <span>More likes</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <MessageCircle className="w-4 h-4 text-orange-400" />
              <span>More comments</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Bookmark className="w-4 h-4 text-yellow-400" />
              <span>More saves</span>
            </div>
            <div className="flex items-center gap-2 text-white/50 text-xs">
              <Share2 className="w-4 h-4 text-green-400" />
              <span>More shares</span>
            </div>
          </div>
          
          <p className="text-center text-xs text-white/30 mt-3">
            Powered by AI • Contenido Viral con NTM
          </p>
        </div>
      </main>
    </div>
  )
}
