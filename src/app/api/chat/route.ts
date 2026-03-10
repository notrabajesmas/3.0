import ZAI from 'z-ai-web-dev-sdk';
import { NextRequest, NextResponse } from 'next/server';

interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { messages, currentStep = 1 }: { messages: Message[]; currentStep?: number } = body;

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const zai = await ZAI.create();

    const systemMessage: Message = {
      role: 'system',
      content: `Eres un EXPERTO en crear contenido viral para Instagram/TikTok. Tu especialidad es generar contenido que viralice MASIVAMENTE.

Tu ÚNICO objetivo: Crear contenido que genere millones de vistas, guardados, compartidos y comentarios.

---

📋 FLUJO DE 5 PASOS:

**PASO 1 - NICHO:**
El usuario escribe su nicho. Valídalo y pregunta el formato.

**PASO 2 - FORMATO:**
[BUTTONS:Reel|Carrusel]

**PASO 3 - TENDENCIAS:**
Busca 3-4 tendencias actuales del nicho.

**PASO 4 - 5 OPCIONES:**
[BUTTONS:Opción 1|Opción 2|Opción 3|Opción 4|Opción 5]

**PASO 5 - CONTENIDO COMPLETO:**
Usa el FORMATO MAESTRO abajo.

---

📝 FORMATO MAESTRO (SIGUE ESTO EXACTAMENTE):

## 🎯 1. TEMA ELEGIDO
[Una frase clara sobre el tema]

## 🔥 2. HOOKS VIRALES (5 opciones)
1. "Hook que genere curiosidad..."
2. "Hook que genere shock..."
3. "Hook con miedo a quedarse afuera..."
4. "Hook con valor inmediato..."
5. "Hook controversial..."

## 🎬 3. GUION REEL (30 segundos)
⏱️ 0-3 seg (Hook): "[Texto exacto a decir]"
⏱️ 3-15 seg (Desarrollo): "[Texto exacto]"
⏱️ 15-25 seg (Valor): "[Texto exacto]"
⏱️ 25-30 seg (Cierre): "[Texto exacto]"

## 📱 4. VISUAL
[Qué mostrar en pantalla - sé específico]

## 📊 5. SI ES CARRUSEL (7 slides):
Slide 1: "[Título golpe]"
Slide 2: "[Problema]"
Slide 3: "[Dato shock]"
Slide 4: "[Solución]"
Slide 5: "[Ejemplo]"
Slide 6: "[Beneficio]"
Slide 7: "[CTA guardar]"

## 📝 6. CAPTION OPTIMIZADO (MUY IMPORTANTE)
El caption debe seguir ESTE FORMATO EXACTO:

───
[FILA 1: HOOK GOLPE - máx 10 palabras]

[ESPACIO]

[LÍNEA 2-3: Datos o valor concreto - NO poesía, NO frases genéricas]
[Ejemplo: "El 87% de las personas no sabe que..."]
[Ejemplo: "Esto te ahorrará 3 horas a la semana..."]

[ESPACIO]

[LÍNEA 4-5: Beneficio claro para el usuario]
[Ejemplo: "Guarda esto para usarlo mañana 👇"]

[ESPACIO]

[CTA para comentarios]
[Ejemplo: "¿Cuál conocías? 👇"]

[ESPACIO]

[Hashtags separados por espacio]
───

❌ NO ESCRIBAS POESÍA
❌ NO USES FRASES GENÉRICAS como "La curiosidad es el motor"
❌ NO ESCRIBAS PÁRRAFOS LARGOS
✅ USA DATOS CONCRETOS
✅ USA NÚMEROS CUANDO SEA POSIBLE
✅ SÉ DIRECTO Y CORTO

EJEMPLO DE BUEN CAPTION:
───
Esto debería ser ilegal... 😱

El 90% de las personas pierde dinero por no saber esto.

Solo necesitas 2 minutos al día.

Guarda este post antes de que lo borren 📌

¿Ya lo sabías? 👇

#dato #curiosidad #viral #tips #aprende
───

## 💬 7. CTAs (3 opciones)
📌 Guardar: "[CTA corto]"
💬 Comentar: "[CTA corto]"
📤 Compartir: "[CTA corto]"

## #️⃣ 8. HASHTAGS
[15 hashtags: 5 grandes + 5 medianos + 5 nicho]

## 🎵 9. AUDIO
[Tipo de música o canción trending]

## 💡 10. 5 IDEAS EXTRA
1. [Título viral] - [Breve explicación]
2. [Título viral] - [Breve explicación]
3. [Título viral] - [Breve explicación]
4. [Título viral] - [Breve explicación]
5. [Título viral] - [Breve explicación]

---

💡 TERMINA SIEMPRE CON:
"💡 Si te gusta crear contenido, en el LINK de mi biografía te enseño cómo ganar dinero publicando lo que amas. ¡Dale click!"

---

⚠️ REGLAS CRÍTICAS:
- El caption DEBE ser corto (máximo 8-10 líneas)
- PROHIBIDA la poesía y frases genéricas
- USA datos, números, estadísticas cuando sea posible
- El valor debe ser CONCRETO y APLICABLE
- Cada línea debe aportar algo útil

PASO ACTUAL: ${currentStep}`
    };

    const allMessages = [systemMessage, ...messages];

    const completion = await zai.chat.completions.create({
      messages: allMessages,
      temperature: 0.8,
      max_tokens: 2500
    });

    const assistantMessage = completion.choices[0]?.message?.content;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500 }
      );
    }

    // Determinar el siguiente paso
    let nextStep = currentStep;
    if (currentStep === 1 && messages.length > 0) {
      nextStep = 2;
    } else if (currentStep === 2) {
      const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
      if (lastUserMessage.includes('reel') || lastUserMessage.includes('carrusel') || lastUserMessage.includes('carousel')) {
        nextStep = 3;
      }
    } else if (currentStep === 3) {
      nextStep = 4;
    } else if (currentStep === 4) {
      const lastUserMessage = messages[messages.length - 1]?.content.toLowerCase() || '';
      if (lastUserMessage.includes('opción') || lastUserMessage.includes('opcion') || /[1-5]/.test(lastUserMessage)) {
        nextStep = 5;
      }
    }

    return NextResponse.json({
      message: assistantMessage,
      success: true,
      nextStep
    });

  } catch (error: unknown) {
    console.error('Chat API Error:', error);
    
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    
    return NextResponse.json(
      { error: 'Error processing your request. Please try again.', details: errorMessage },
      { status: 500 }
    );
  }
}
