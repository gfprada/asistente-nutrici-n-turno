import React, { useState } from 'react';
import { 
  Calendar, ShoppingBag, MessageSquare, Download, 
  Clock, CheckCircle, Plus, RefreshCw, Send, FileText, Utensils 
} from 'lucide-react';
import { jsPDF } from 'jspdf';

export default function App() {
  const [activeTab, setActiveTab] = useState('chat');
  const [messages, setMessages] = useState([
    { role: 'assistant', content: '¡Hola! Soy tu asistente para turnos nocturnos. Cuéntame, ¿qué ingredientes tienes disponibles o qué tipo de alternativa te gustaría crear para tu menú?' }
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Lista de mercado interactiva
  const [groceryItems, setGroceryItems] = useState([
    { id: 1, name: 'Aguacate', category: 'fruver', checked: false },
    { id: 2, name: 'Tomate', category: 'fruver', checked: false },
    { id: 3, name: 'Pechuga de pollo', category: 'meat', checked: false },
    { id: 4, name: 'Carne molida magra', category: 'meat', checked: false },
    { id: 5, name: 'Huevos (cartón)', category: 'supermarket', checked: false },
    { id: 6, name: 'Avena en hojuelas', category: 'supermarket', checked: false },
    { id: 7, name: 'Arroz integral', category: 'supermarket', checked: false },
  ]);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('supermarket');

  // Plan semanal de comidas editable
  const [mealPlan, setMealPlan] = useState([
    { day: 'Lunes', breakfast: 'Omelette de 3 huevos con espinaca y tostadas', dinner: 'Pechuga a la plancha, arroz integral y aguacate', shiftMeal: 'Bowl de pollo con quinua y plátano maduro' },
    { day: 'Martes', breakfast: 'Batido denso (avena, banano, maní) + 2 huevos', dinner: 'Carne salteada, puré de papa criolla y ensalada', shiftMeal: 'Pasta corta con atún, maíz y arvejas' },
    { day: 'Miércoles', breakfast: 'Huevos pericos con arepa y queso campesino', dinner: 'Lomo de cerdo, yuca al vapor con hogao', shiftMeal: 'Arroz chaufa de pollo con verduras' },
    { day: 'Jueves', breakfast: 'Pancakes de avena y banano con miel + 3 huevos', dinner: 'Pechuga en salsa de champiñones y papa', shiftMeal: 'Bowl de carne molida, arroz y frijol negro' },
    { day: 'Viernes', breakfast: 'Yogur griego, granola, frutos secos y banano', dinner: 'Pescado a la plancha con patacón pisado', shiftMeal: 'Ensalada tibia de pasta, pollo y queso' },
    { day: 'Sábado', breakfast: 'Huevos rancheros con tortilla de maíz', dinner: 'Sobrebarriga o carne desmechada con arroz', shiftMeal: 'Wrap integral de pollo con vegetales' },
    { day: 'Domingo', breakfast: 'Omelette de jamón y queso + arepa con maní', dinner: 'Pollo al horno con finas hierbas y papas', shiftMeal: 'Arroz con verduras y carne desmechada' },
  ]);

  // Manejador del chat con lógica para proponer alternativas reales
  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!inputMessage.trim()) return;

    const userMsg = inputMessage;
    setMessages(prev => [...prev, { role: 'user', content: userMsg }]);
    setInputMessage('');
    setLoading(true);

    setTimeout(() => {
      let reply = "";
      const lower = userMsg.toLowerCase();

      if (lower.includes('vegetariano') || lower.includes('sin carne')) {
        reply = "¡Claro! Como alternativa sin carne para tu turno de noche (2:00 a.m.), te sugiero un **bowl de lentejas cocidas con arroz integral, plátano maduro al horno y aguacate**. Es de fácil digestión, rico en carbohidratos complejos y proteína vegetal sin causar pesadez.";
      } else if (lower.includes('rápido') || lower.includes('afán') || lower.includes('práctico')) {
        reply = "Para algo exprés: Prepara un **sándwich tostado en pan integral con atún en agua, queso fundido, tomate y un toque de aceite de oliva**. Te toma 5 minutos y es perfecto para llevar en el contenedor al turno.";
      } else if (lower.includes('desayuno') || lower.includes('2 de la tarde')) {
        reply = "Para tu hora de despertar (2:00 p.m.), una excelente alternativa es un **porridge o gachas de avena cocida con leche, rodajas de banano, una cucharada de mantequilla de maní y 2 huevos cocidos al lado**. Te dará energía sostenida sin inflamar.";
      } else {
        reply = `Entiendo perfectamente tu solicitud sobre "${userMsg}". Para mantener tu rendimiento de 10 p.m. a 6 a.m., te sugiero combinar una proteína magra con un carbohidrato de absorción moderada y evitar grasas pesadas a las 2:00 a.m. ¿Te gustaría que ajuste alguna receta específica del plan semanal?`;
      }

      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      setLoading(false);
    }, 1000);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    if (!newItemName.trim()) return;
    setGroceryItems([...groceryItems, { id: Date.now(), name: newItemName, category: newItemCategory, checked: false }]);
    setNewItemName('');
  };

  const toggleCheck = (id) => {
    setGroceryItems(groceryItems.map(item => item.id === id ? { ...item, checked: !item.checked } : item));
  };

  const removeGroceryItem = (id) => {
    setGroceryItems(groceryItems.filter(item => item.id !== id));
  };

  // Función para generar PDF
  const generatePDF = () => {
    const doc = new jsPDF();
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Cronograma Nutricional - Turno Nocturno", 14, 20);
    
    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    doc.text("Horario: 10:00 p.m. - 6:00 a.m. | Descanso: 7:00 a.m. - 1:00 p.m.", 14, 28);

    let y = 38;
    mealPlan.forEach((item) => {
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
      doc.setFont("helvetica", "bold");
      doc.text(`${item.day}:`, 14, y);
      doc.setFont("helvetica", "normal");
      doc.text(`- 2:00 PM: ${item.breakfast}`, 22, y + 6);
      doc.text(`- 5:00 PM: ${item.dinner}`, 22, y + 12);
      doc.text(`- 2:00 AM: ${item.shiftMeal}`, 22, y + 18);
      y += 26;
    });

    doc.save("Cronograma-Turno-Nocturno.pdf");
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 p-4 sticky top-0 z-50 shadow-md">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="bg-amber-500/10 p-2 rounded-xl border border-amber-500/20 text-amber-400">
              <Utensils className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight">Turno Nocturno & Nutrición AI</h1>
              <p className="text-xs text-slate-400">Optimización de energía y descanso (10:00 p.m. - 6:00 a.m.)</p>
            </div>
          </div>
          
          {/* Navegación por pestañas */}
          <nav className="flex bg-slate-950 p-1 rounded-xl border border-slate-800">
            <button 
              onClick={() => setActiveTab('chat')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'chat' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <MessageSquare className="w-4 h-4" /> Chat IA
            </button>
            <button 
              onClick={() => setActiveTab('plan')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'plan' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <Calendar className="w-4 h-4" /> Plan Semanal
            </button>
            <button 
              onClick={() => setActiveTab('grocery')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${activeTab === 'grocery' ? 'bg-amber-500 text-slate-950 shadow' : 'text-slate-400 hover:text-white'}`}
            >
              <ShoppingBag className="w-4 h-4" /> Mercado
            </button>
          </nav>
        </div>
      </header>

      {/* Contenido Principal */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-6">
        
        {/* PESTAÑA 1: CHATBOT */}
        {activeTab === 'chat' && (
          <div className="flex flex-col h-[75vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
            <div className="bg-slate-850 p-3 border-b border-slate-800 text-xs font-medium text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              Asistente activo • Pídele alternativas de recetas, ajustes de horario o consejos de descanso.
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div key={index} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-[85%] sm:max-w-[75%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${msg.role === 'user' ? 'bg-amber-500 text-slate-950 font-medium rounded-br-none' : 'bg-slate-800 text-slate-100 rounded-bl-none border border-slate-700'}`}>
                    {msg.content}
                  </div>
                </div>
              ))}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 text-slate-400 rounded-2xl px-4 py-3 text-sm rounded-bl-none border border-slate-700 flex items-center gap-2">
                    <RefreshCw className="w-4 h-4 animate-spin" /> Pensando alternativa...
                  </div>
                </div>
              )}
            </div>

            {/* Accesos rápidos de preguntas */}
            <div className="px-4 py-2 bg-slate-950 border-t border-slate-800 flex gap-2 overflow-x-auto no-scrollbar">
              <button onClick={() => setInputMessage("Dame una alternativa vegetariana para las 2 a.m.")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-slate-700 transition">
                🌱 Alternativa vegetariana turno noche
              </button>
              <button onClick={() => setInputMessage("Dame una opción rápida y exprés para llevar")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-slate-700 transition">
                ⚡ Opción exprés para llevar
              </button>
              <button onClick={() => setInputMessage("¿Cómo ajustar la cafeína en mi turno?")} className="text-xs bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1.5 rounded-full whitespace-nowrap border border-slate-700 transition">
                ☕ Regla de cafeína
              </button>
            </div>

            <form onSubmit={handleSendMessage} className="p-3 bg-slate-900 border-t border-slate-800 flex gap-2">
              <input 
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                placeholder="Ej. Reemplaza el pollo del martes por carne de cerdo..."
                className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-amber-500 text-slate-100 placeholder-slate-500"
              />
              <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-4 rounded-xl font-medium transition flex items-center justify-center">
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}

        {/* PESTAÑA 2: PLAN SEMANAL */}
        {activeTab === 'plan' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center bg-slate-900 p-4 rounded-2xl border border-slate-800">
              <div>
                <h2 className="text-base font-bold">Cronograma Nutricional Semanal</h2>
                <p className="text-xs text-slate-400">Diseñado para turnos de 10:00 p.m. a 6:00 a.m.</p>
              </div>
              <button 
                onClick={generatePDF}
                className="bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs px-3 py-2 rounded-xl font-semibold transition flex items-center gap-1.5 shadow"
              >
                <Download className="w-3.5 h-3.5" /> Descargar PDF
              </button>
            </div>

            <div className="grid gap-4">
              {mealPlan.map((item, index) => (
                <div key={index} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-sm hover:border-slate-700 transition">
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-slate-800">
                    <span className="font-bold text-amber-400 text-sm">{item.day}</span>
                    <span className="text-xs bg-slate-800 px-2.5 py-1 rounded-full text-slate-300">Turno Nocturno Activo</span>
                  </div>
                  <div className="grid sm:grid-cols-3 gap-3 text-xs">
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="block font-semibold text-slate-400 mb-1">2:00 p.m. (Desayuno)</span>
                      <span className="text-slate-200">{item.breakfast}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="block font-semibold text-slate-400 mb-1">5:00 p.m. (Cena Principal)</span>
                      <span className="text-slate-200">{item.dinner}</span>
                    </div>
                    <div className="bg-slate-950 p-3 rounded-xl border border-slate-850">
                      <span className="block font-semibold text-slate-400 mb-1">2:00 a.m. (Comida en Turno)</span>
                      <span className="text-slate-200">{item.shiftMeal}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* PESTAÑA 3: MERCADO */}
        {activeTab === 'grocery' && (
          <div className="space-y-6">
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4">
              <h2 className="text-base font-bold mb-1">Lista de Mercado Organizada</h2>
              <p className="text-xs text-slate-400 mb-4">Clasificada para tu ruta de compras semanal.</p>
              
              <form onSubmit={handleAddItem} className="flex gap-2 mb-4">
                <input 
                  type="text" 
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Agregar nuevo ingrediente..."
                  className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500 text-slate-100"
                />
                <select 
                  value={newItemCategory}
                  onChange={(e) => setNewItemCategory(e.target.value)}
                  className="bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-300 focus:outline-none"
                >
                  <option value="fruver">Fruver</option>
                  <option value="meat">Carnicería</option>
                  <option value="supermarket">Supermercado</option>
                </select>
                <button type="submit" className="bg-amber-500 hover:bg-amber-400 text-slate-950 px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1">
                  <Plus className="w-4 h-4" /> Añadir
                </button>
              </form>

              <div className="space-y-4">
                {['fruver', 'meat', 'supermarket'].map((cat) => {
                  const titles = { fruver: '🥬 Fruver y Verduras', meat: '🥩 Carnes y Proteínas', supermarket: '🛒 Supermercado y Despensa' };
                  const itemsInCat = groceryItems.filter(i => i.category === cat);
                  if (itemsInCat.length === 0) return null;
                  
                  return (
                    <div key={cat} className="bg-slate-950 rounded-xl p-3 border border-slate-850">
                      <h3 className="text-xs font-bold text-amber-400 uppercase tracking-wider mb-2">{titles[cat]}</h3>
                      <div className="space-y-1.5">
                        {itemsInCat.map(item => (
                          <div key={item.id} className="flex items-center justify-between text-xs py-1 px-2 hover:bg-slate-900 rounded-lg">
                            <label className="flex items-center gap-2 cursor-pointer flex-1">
                              <input 
                                type="checkbox" 
                                checked={item.checked} 
                                onChange={() => toggleCheck(item.id)}
                                className="rounded border-slate-700 text-amber-500 focus:ring-0 bg-slate-900"
                              />
                              <span className={item.checked ? 'line-through text-slate-500' : 'text-slate-300'}>{item.name}</span>
                            </label>
                            <button onClick={() => removeGroceryItem(item.id)} className="text-slate-600 hover:text-red-400 text-xs px-1">✕</button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
