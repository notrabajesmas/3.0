# 🚀 Contenido Viral con NTM

Agente de IA para crear contenido viral en Instagram (Reels y Carruseles) en menos de 5 minutos.

## 🎯 Características

- ✅ Flujo guiado de 5 pasos
- ✅ Usuario escribe su nicho (miles de posibilidades)
- ✅ Sugerencias de nichos populares
- ✅ Búsqueda de tendencias actuales
- ✅ 5 opciones de contenido viral con botones clickeables
- ✅ Contenido completo: título, guióṅ, imagen, audio, CTA
- ✅ Invitación natural a NTM en cada respuesta

## 🛠️ Tecnologías

- Next.js 15
- React 19
- TailwindCSS
- z-ai-web-dev-sdk (IA)
- Vercel (deploy)

## 📦 Instalación Local

```bash
# Clonar el repositorio
git clone https://github.com/TU_USUARIO/contenido-viral-con-ntm.git

# Entrar al directorio
cd contenido-viral-con-ntm

# Instalar dependencias
bun install

# Crear archivo .env
echo "GROQ_API_KEY=tu_api_key_aqui" > .env

# Ejecutar
bun run dev
```

## 🔑 Obtener API Key (GRATIS)

1. Ve a [console.groq.com](https://console.groq.com)
2. Crea una cuenta gratuita
3. Genera tu API Key
4. Pégala en el archivo `.env`

## 🚀 Deploy en Vercel

### Opción 1: Desde GitHub

1. Sube este proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Click en "New Project"
4. Importa tu repositorio de GitHub
5. Agrega la variable de entorno:
   - `GROQ_API_KEY` = tu_api_key
6. Click en "Deploy"

### Opción 2: Desde CLI

```bash
# Instalar Vercel CLI
npm i -g vercel

# Deploy
vercel

# Agregar variable de entorno
vercel env add GROQ_API_KEY
```

## 📁 Estructura

```
├── src/
│   ├── app/
│   │   ├── page.tsx          # Frontend
│   │   ├── layout.tsx        # Layout
│   │   ├── globals.css       # Estilos
│   │   └── api/
│   │       └── chat/
│   │           └── route.ts  # Backend API
│   └── components/ui/        # Componentes
├── package.json
├── tailwind.config.ts
└── .env                      # API Key (no subir a GitHub)
```

## 🎨 Flujo de Usuario

1. **Nicho** → Usuario escribe su nicho
2. **Formato** → Elige Reel o Carrusel
3. **Tendencias** → IA busca tendencias del nicho
4. **Opciones** → 5 ideas virales con botones
5. **Contenido** → Todo listo para publicar

## 💡 Estrategia NTM

Cada respuesta incluye una invitación natural a NTM:

> "💡 Si te gusta crear contenido, en el LINK de mi biografía te enseño cómo ganar dinero publicando lo que amas. ¡Dale click!"

## 📄 Licencia

MIT

---

Creado con ❤️ para NTM
