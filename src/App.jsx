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

  // Manejador del chat
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
        reply = "¡Claro! Como alternativa sin carne para
