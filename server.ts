import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { PRODUCTS, MOCK_COUPONS } from './src/data/products';
import { Product, Order, Notification } from './src/types';

// In-memory persistent database for full-stack interactive behavior
let inMemoryProducts: Product[] = [...PRODUCTS];
let inMemoryOrders: Order[] = [
  {
    id: 'ORD-8452-ENG',
    date: '2026-06-01T14:30:00Z',
    items: [
      {
        product: PRODUCTS[0], // Enginia Premium 1.5mm Copper Single Core Cable - 100m Roll
        quantity: 2
      },
      {
        product: PRODUCTS[2], // Enginia Pro-Tect 32A Single Pole MCB Type C
        quantity: 5
      }
    ],
    subtotal: 116.93,
    vat: 14.03,
    discount: 10.00,
    total: 120.96,
    status: 'Shipped',
    paymentMethod: 'Credit/Debit Card',
    customerInfo: {
      name: 'Jane Doe',
      email: 'jane.doe@example.com',
      phone: '+1 (555) 019-2834',
      address: '42 Innovation Avenue',
      city: 'Tech City'
    },
    trackingLogs: [
      { time: '2026-06-01T15:00:00Z', status: 'Processing', description: 'Order packaging finalized' },
      { time: '2026-06-02T08:00:00Z', status: 'Shipped', description: 'Handed over to Enginia Express courier' }
    ]
  }
];

let inMemoryNotifications: Notification[] = [
  {
    id: 'n-1',
    type: 'promo',
    title: 'Welcome Discount!',
    body: 'Use code ENGINIA10 to get 10% off site-wide on accessories.',
    date: '2026-06-02T08:00:00Z',
    read: false
  },
  {
    id: 'n-2',
    type: 'alert',
    title: 'Solar Influx',
    body: 'Solar panels stock updated. 150W panels are back in stock!',
    date: '2026-06-02T08:15:00Z',
    read: false
  }
];

// Initialize Gemini SDK lazily
let aiClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (apiKey && apiKey !== 'MY_GEMINI_API_KEY') {
      aiClient = new GoogleGenAI({
        apiKey: apiKey,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          }
        }
      });
    }
  }
  return aiClient;
}

const app = express();
app.use(express.json());

// API: Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', time: new Date().toISOString() });
});

// API: Products List & Detail / Modification
app.get('/api/products', (req, res) => {
  res.json(inMemoryProducts);
});

app.post('/api/products', (req, res) => {
  const newProduct: Product = req.body;
  if (!newProduct.id) {
    newProduct.id = 'prod-' + Date.now();
  }
  // Check if exists
  const existingIdx = inMemoryProducts.findIndex(p => p.id === newProduct.id);
  if (existingIdx > -1) {
    inMemoryProducts[existingIdx] = { ...inMemoryProducts[existingIdx], ...newProduct };
  } else {
    inMemoryProducts.push(newProduct);
  }
  res.json({ success: true, product: newProduct });
});

app.delete('/api/products/:id', (req, res) => {
  const { id } = req.params;
  inMemoryProducts = inMemoryProducts.filter(p => p.id !== id);
  res.json({ success: true, id });
});

// API: Order APIs
app.get('/api/orders', (req, res) => {
  res.json(inMemoryOrders);
});

app.post('/api/orders', (req, res) => {
  const newOrder: Order = req.body;
  if (!newOrder.id) {
    newOrder.id = 'ORD-' + Math.floor(1000 + Math.random() * 9000) + '-ENG';
  }
  newOrder.date = new Date().toISOString();
  newOrder.status = 'Processing';
  newOrder.trackingLogs = [
    { time: new Date().toISOString(), status: 'Processing', description: 'Order received and being verified.' }
  ];
  inMemoryOrders.unshift(newOrder);

  // Trigger an order notification
  inMemoryNotifications.unshift({
    id: 'n-' + Date.now(),
    type: 'order',
    title: 'Order Placed!',
    body: `Your order #${newOrder.id} has been initiated for shipping.`,
    date: new Date().toISOString(),
    read: false
  });

  res.json({ success: true, order: newOrder });
});

// Update order status (Admin function / Delivery simulation)
app.put('/api/orders/:id', (req, res) => {
  const { id } = req.params;
  const { status, description } = req.body;
  const orderIndex = inMemoryOrders.findIndex(o => o.id === id);

  if (orderIndex > -1) {
    inMemoryOrders[orderIndex].status = status;
    inMemoryOrders[orderIndex].trackingLogs.push({
      time: new Date().toISOString(),
      status: status,
      description: description || `Status updated to ${status}`
    });
    res.json({ success: true, order: inMemoryOrders[orderIndex] });
  } else {
    res.status(404).json({ error: 'Order not found' });
  }
});

// API: Notifications
app.get('/api/notifications', (req, res) => {
  res.json(inMemoryNotifications);
});

app.post('/api/notifications/read', (req, res) => {
  inMemoryNotifications.forEach(n => n.read = true);
  res.json({ success: true });
});

// API: Chatbot Assistant
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body;
  if (!messages || !Array.isArray(messages)) {
    return res.status(400).json({ error: 'Invalid message structure' });
  }

  const ai = getGenAI();
  if (!ai) {
    // Graceful fallback if API key is not configured or is placeholder
    const lastUserMsg = messages[messages.length - 1]?.text || '';
    let fallbackText = `Hi! I'm Enginia Assistant, your default expert system. I'm currently running in localized simulation mode. To unlock my highly intelligent real-time electrical answers, product specifications, and wiring configurations, please configure a valid \`GEMINI_API_KEY\` in **Settings > Secrets**.\n\nHere is a local answer based on your query: *"${lastUserMsg}"*\n\nYes! Enginia Electronics offers a premium suite of wires, circuit breakers, smart LED bulbs, and solar components. Our **Premium 1.5mm Single Core cable** is fully BS 6004 approved and starts at $35.99 a roll. Let me know if you want to add any items to your shopping cart!`;
    return res.json({ text: fallbackText });
  }

  try {
    // Construct rich text contexts of our products so the bot is highly knowledgeable
    const productsContext = inMemoryProducts.map(p => {
      const specString = Object.entries(p.specifications).map(([k, v]) => `${k}: ${v}`).join(', ');
      return `- [ID: ${p.id}] "${p.name}" in category "${p.category}". Price: $${p.price} (${p.stock} units available). Rating: ${p.rating}/5. Highlights: ${p.description}. Specs: ${specString}`;
    }).join('\n');

    const systemInstruction = `You are "Enginia Assistant", the expert smart technician chatbot for Enginia Electronics - an elite online shop for electrical components, circuit protection, wiring, smart home automation, power tools, and high-performance solar systems with the tagline "Powering Your Electrical Solutions".

Your goals:
1. Assist customers professionally, tech-forward, and enthusiastically with electrical accessories shopping, specifications lookup, and custom items comparison.
2. Intelligently answer technical and electrical installation questions (e.g., recommend cable sizing, explain circuit breaker ratings, explain solar monocrystalline efficiency, safety measures) using actual electrical knowledge.
3. Recommend specific products from the inventory listed below. Reference products by name, price, and category. Offer useful advice tailored to their specific needs.
4. Assist with order tracking. If they mention an order ID (e.g. "ORD-8452-ENG"), refer to them as having a real shipped item.
5. Provide real safety troubleshooting. Always add safety disclaimers (e.g. "Switch off mains distribution boards before installation") when citizens ask for manual modifications.

Below is our entire Live Catalog inventory of products to recommend. Do NOT invent other products outside this brand catalog unless suggesting a general concept, but prefer suggesting these exact items:
${productsContext}

Keep your answers visually pleasant, structured with clear Markdown bullet points where appropriate, and friendly yet authoritative. Ensure you display deep structural intelligence!`;

    // Format chat history for Gemini API
    const formattedHistory = messages.map((m: any) => ({
      role: m.sender === 'user' ? 'user' : 'model',
      parts: [{ text: m.text }]
    }));

    // Generate output with gemini-3.5-flash
    const response = await ai.models.generateContent({
      model: 'gemini-3.5-flash',
      contents: formattedHistory,
      config: {
        systemInstruction: systemInstruction,
        temperature: 0.7,
      }
    });

    res.json({ text: response.text });
  } catch (error: any) {
    console.error('Gemini Assistant Error:', error);
    res.status(500).json({ error: 'AI Assistant process failure', details: error.message });
  }
});

// Serve Frontend using Vite in Dev Mode, or built bundle in Prod Mode
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  const PORT = 3000;
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Enginia Server] Running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
