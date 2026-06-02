import { Product, Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'wires', name: 'Electrical Wires & Cables', iconName: 'Cable', count: 48 },
  { id: 'mcbs', name: 'MCBs & Circuit Breakers', iconName: 'ShieldAlert', count: 32 },
  { id: 'switches', name: 'Switches & Sockets', iconName: 'ToggleLeft', count: 64 },
  { id: 'lighting', name: 'LED Bulbs & Lighting', iconName: 'Lightbulb', count: 95 },
  { id: 'extensions', name: 'Extension Cables', iconName: 'Power', count: 28 },
  { id: 'solar', name: 'Solar Products', iconName: 'Sun', count: 18 },
  { id: 'cctv', name: 'CCTV Cameras', iconName: 'Camera', count: 22 },
  { id: 'accessories', name: 'Electronics Accessories', iconName: 'Cpu', count: 120 },
  { id: 'tools', name: 'Power Tools', iconName: 'Wrench', count: 35 },
  { id: 'batteries', name: 'Batteries & Inverters', iconName: 'BatteryCharging', count: 15 }
];

export const PRODUCTS: Product[] = [
  // 1. Wires & Cables
  {
    id: 'wire-1.5-single',
    name: 'Enginia Premium 1.5mm Copper Single Core Cable - 100m Roll',
    category: 'Electrical Wires & Cables',
    price: 35.99,
    originalPrice: 42.00,
    image: 'https://images.unsplash.com/photo-1620121692029-d088224ddc74?w=400&auto=format&fit=crop&q=60',
    description: 'High-purity annealed copper conductor, ideal for domestic electrical conduit installations and domestic lighting circuits. Comes with heat-resistant, flame-retardant PVC insulation.',
    specifications: {
      'Conductor': '99.99% Pure Oxygen-Free Copper',
      'Size': '1.5 Sq mm',
      'Length': '100 Meters',
      'Voltage Rating': '450/750V',
      'Insulation': 'Flame Retardant PVC (FR-PVC)',
      'Standards': 'BS 6004, IEC 60227'
    },
    stock: 24,
    rating: 4.8,
    featured: true,
    bestSeller: true,
    reviews: [
      { id: 'r1', userName: 'Amani K.', rating: 5, comment: 'Excellent quality! Easy to draw through the ducts, highly flexible and sturdy insulation.', date: '2026-05-15' },
      { id: 'r2', userName: 'John D.', rating: 4, comment: 'Good heavy 100m roll. Standard copper thickness is flawless.', date: '2026-05-22' }
    ]
  },
  {
    id: 'wire-heavy-3core',
    name: 'Heavy Duty 3-Core Flexible Rubber Cable 2.5mm',
    category: 'Electrical Wires & Cables',
    price: 64.50,
    image: 'https://images.unsplash.com/photo-1614713570390-b14cf403296d?w=400&auto=format&fit=crop&q=60',
    description: 'Tough rubber sheathed flexible trailing cable designed for harsh industrial applications, submersible pumps, and heavy appliances. Weather and impact resistant.',
    specifications: {
      'Conductor Size': '2.5 Sq mm x 3 Cores',
      'Sheath Material': 'Neoprene Rubber',
      'Temperature limits': '-35°C to +85°C',
      'Current Rating': '25 Amps',
      'Waterproof': 'Yes (IP68 graded sheath)'
    },
    stock: 12,
    rating: 4.5,
    newArrival: true,
    reviews: [
      { id: 'r3', userName: 'Musa O.', rating: 5, comment: 'Used it to connect my submersible pump. Very thick rub-resistant skin.', date: '2026-05-10' }
    ]
  },

  // 2. MCBs & Circuit Breakers
  {
    id: 'mcb-32a-single',
    name: 'Enginia Pro-Tect 32A Single Pole MCB Type C',
    category: 'MCBs & Circuit Breakers',
    price: 8.99,
    originalPrice: 11.50,
    image: 'https://images.unsplash.com/photo-1558489012-859dd7c43557?w=400&auto=format&fit=crop&q=60',
    description: 'A miniature circuit breaker serving short-circuit and overcurrent electrical installations. Featuring optical trip indicators and dual busbar connection possibilities.',
    specifications: {
      'Rated Current': '32 Amps',
      'Breaking Capacity': '10 kA',
      'Tripping Curve': 'Type C (Suitable for inductive loads)',
      'Mounting': 'DIN Rail 35mm',
      'IP Rating': 'IP20 housing'
    },
    stock: 45,
    rating: 4.9,
    featured: true,
    reviews: [
      { id: 'r4', userName: 'Dave S.', rating: 5, comment: 'Crisp toggle switch feedback. Snapped perfectly onto my Schneider consumer unit panel.', date: '2026-05-18' }
    ]
  },
  {
    id: 'mcb-rcdbo-63a',
    name: '63A Double Pole RCD Residual Circuit Breaker',
    category: 'MCBs & Circuit Breakers',
    price: 34.20,
    image: 'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=400&auto=format&fit=crop&q=60',
    description: 'State-of-the-art dual-pole residual current device. Prevents electrical shock hazards and ground faults. Mandatory for central security distribution units.',
    specifications: {
      'Rated Current': '63 Amps',
      'Sensitivity': '30 mA tripping current',
      'Poles': '2 Pole (L+N)',
      'Action Response Time': '< 40 Milliseconds',
      'Test Button': 'Included front safety test actuator'
    },
    stock: 18,
    rating: 4.7,
    reviews: []
  },

  // 3. Switches & Sockets
  {
    id: 'switch-legrand',
    name: 'Enginia Touch Luxe 1-Gang Smart Switch Pad',
    category: 'Switches & Sockets',
    price: 18.25,
    originalPrice: 22.99,
    image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400&auto=format&fit=crop&q=60',
    description: 'A stylish, minimalist glass touch lighting control. Pairs with standard wall box cavities with soft-LED night indicator glows.',
    specifications: {
      'Type': 'Touch Reactive Smart Plate',
      'Life': '100,000 Operations',
      'Voltage': '100V - 240V AC',
      'Wireless connectivity': 'Wi-Fi 2.4GHz / Zigbee Enabled',
      'Plate Finish': 'Tempered Scratch-proof Glass'
    },
    stock: 60,
    rating: 4.6,
    featured: true,
    newArrival: true,
    reviews: [
      { id: 'r5', userName: 'Gideon L.', rating: 4, comment: 'Looks amazing on white plaster walls. LED blue standby light is highly convenient in dark bedrooms.', date: '2026-05-20' }
    ]
  },
  {
    id: 'socket-usb-dual',
    name: 'Double Switched Wall Socket with 2x Smart USB Ports (4.2A)',
    category: 'Switches & Sockets',
    price: 14.99,
    image: 'https://images.unsplash.com/photo-1558244661-d248897f7bc4?w=400&auto=format&fit=crop&q=60',
    description: 'Modern electrical outlet featuring standard dual round/square pins and two embedded high-speed USB-A/C charging ports matching optimal power profiles.',
    specifications: {
      'Grid Format': 'Double gang switched',
      'Max Voltage': '250V AC 13A rating',
      'USB Outflow': '5V DC, 4.2A total smart allocation',
      'Safety shutter': 'Individual safety shutter mechanisms'
    },
    stock: 35,
    rating: 4.8,
    bestSeller: true,
    reviews: [
      { id: 'r6', userName: 'Sandra N.', rating: 5, comment: 'Now I can charge my phone and run the microwave simultaneously. Excellent build quality.', date: '2026-05-24' }
    ]
  },

  // 4. LED Bulbs & Lighting
  {
    id: 'led-bulb-9w',
    name: 'Enginia Smart Hue 9W RGBCW LED Bulb (E27)',
    category: 'LED Bulbs & Lighting',
    price: 12.99,
    image: 'https://images.unsplash.com/photo-1550985616-10810253b84d?w=400&auto=format&fit=crop&q=60',
    description: 'Explore 16 million colors with adaptive smart hue dimming. Voice assistant compatible over smart home systems. Equivalent to traditional 75W lamps.',
    specifications: {
      'Wattage': '9 Watts',
      'Fitting Type': 'E27 / Screw Base',
      'Luminous Flux': '806 Lumens',
      'Energy Grade': 'A++',
      'Dimming Range': '1% to 100%',
      'Color Temp': '2700K to 6500K + Full RGB spectrum'
    },
    stock: 120,
    rating: 4.7,
    bestSeller: true,
    reviews: [
      { id: 'r7', userName: 'Kevin W.', rating: 5, comment: 'Extremely bright yellow and incredible red/blue color range. App control flows smoothly.', date: '2026-05-28' }
    ]
  },
  {
    id: 'led-panel-18w',
    name: 'Ultra-Slim 18W Flush Mount Round LED Ceiling Panel',
    category: 'LED Bulbs & Lighting',
    price: 21.50,
    originalPrice: 26.00,
    image: 'https://images.unsplash.com/photo-1565814636199-ae8133055c1c?w=400&auto=format&fit=crop&q=60',
    description: 'Sleek, glare-free ceiling luminaire. Consumes 80% less energy than old halogen flush grids. High-grade PMMA light guide diffusing smooth white hues.',
    specifications: {
      'Mount Type': 'Recessed spring clamp clips',
      'Diameter': '225mm profile, 12mm thickness',
      'Working lifespan': '50,000 Nominal Hours',
      'Driver': 'Isolated constant-current driver included'
    },
    stock: 50,
    rating: 4.4,
    reviews: []
  },

  // 5. Extension Cables
  {
    id: 'ext-4way-overload',
    name: 'Enginia Safeguard 4-Way Extension Strip - 3m Cable',
    category: 'Extension Cables',
    price: 15.99,
    originalPrice: 19.99,
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&auto=format&fit=crop&q=60',
    description: 'Heavy duty heavy-gauge wiring strip with individual power indicators, built-in child protection gates, and automatic overload circuit breaker protection.',
    specifications: {
      'Outlet Capacity': '4 Grounded Universal Sockets',
      'Cord Length': '3.0 Meters heavy PVC outer',
      'Max Power Rating': '3250 Watts max load',
      'Surge Shield': '900 Joules rating response'
    },
    stock: 40,
    rating: 4.8,
    featured: true,
    reviews: [
      { id: 'r8', userName: 'Amara R.', rating: 5, comment: 'Saved my fridge twice during localized high surge drops.', date: '2026-05-14' }
    ]
  },

  // 6. Solar Products
  {
    id: 'solar-panel-150w',
    name: 'Enginia Sol-Gen 150W Monocrystalline Solar Panel',
    category: 'Solar Products',
    price: 125.00,
    originalPrice: 145.00,
    image: 'https://images.unsplash.com/photo-1509391366360-2e959784a276?w=400&auto=format&fit=crop&q=60',
    description: 'High-conversion solar cells configured to capture optimum electricity flows, even in overcast sky conditions. Framed in heavy anodized rust-proof aluminum.',
    specifications: {
      'Cell Configuration': 'Grade-A Monocrystalline Silicon',
      'Peak Power': '150W peak flow',
      'Conversion Efficiency': '21.5%',
      'Weight': '9.8 Kilograms',
      'IP rating': 'IP67 junction box wiring output'
    },
    stock: 14,
    rating: 4.9,
    featured: true,
    reviews: [
      { id: 'r9', userName: 'Bala F.', rating: 5, comment: 'Very resilient build. Charging my battery bank easily by 2 PM every day.', date: '2026-05-11' }
    ]
  },

  // 7. CCTV Cameras
  {
    id: 'cctv-outdoor-4k',
    name: 'Enginia Vision-Pro 4K Outdoor PTZ Security Camera',
    category: 'CCTV Cameras',
    price: 89.99,
    originalPrice: 110.00,
    image: 'https://images.unsplash.com/photo-1557862921-37829c790f19?w=400&auto=format&fit=crop&q=60',
    description: 'Smart AI person detection camera with full 360 rotation, high-intensity color night-mode LEDs, built-in siren, and direct local storage playback backup.',
    specifications: {
      'Resolution': '4K Ultra High-Def (8 Megapixels)',
      'Rotation Range': 'Horiz 355°, Vertical 90° PTZ',
      'Night Mode': '60m Range Color StarLight technology',
      'Protection Standard': 'IP66 Weather Weatherproofing',
      'Storage support': 'MicroSD card slot up to 256GB / Cloud integration'
    },
    stock: 20,
    rating: 4.7,
    newArrival: true,
    reviews: [
      { id: 'r10', userName: 'Sarah L.', rating: 4, comment: 'Color night mode works. Crisp quality of license plates.', date: '2026-05-30' }
    ]
  },

  // 8. Electronics Accessories
  {
    id: 'acc-hdmi-21',
    name: 'High-Speed Gold-Plated HDMI 2.1 Cable - 2 Meters',
    category: 'Electronics Accessories',
    price: 11.50,
    image: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=400&auto=format&fit=crop&q=60',
    description: 'Certified Ultra High Speed wire backing 8K@60Hz and 4K@120Hz resolutions. Made with premium nylon braiding for long lifecycle endurance.',
    specifications: {
      'Bandwidth limit': '48.0 Gigabits per second',
      'Material': '99.9% Oxygen free cord, heavy gold terminals',
      'Sound Return': 'eARC (Enhanced Audio Return channel certified)',
      'Length': '2.0 Meters braided armor wire'
    },
    stock: 90,
    rating: 4.9,
    bestSeller: true,
    reviews: []
  },

  // 9. Power Tools
  {
    id: 'tool-cordless-drill',
    name: 'Enginia Max-Drill 18V Cordless Impact Hammer Drill',
    category: 'Power Tools',
    price: 79.99,
    originalPrice: 95.00,
    image: 'https://images.unsplash.com/photo-1504148455328-c376907d081c?w=400&auto=format&fit=crop&q=60',
    description: 'Compact hand-drill that matches high-torque outputs. Perfect for electrical chassis panel mounting, wall plugs, and metal cabinetry settings. Dual battery packs included.',
    specifications: {
      'Battery Power': '18V Li-Ion 2.0Ah (Dual core batteries inside)',
      'Max Torque capacity': '45 Nm continuous torque',
      'Speed levels': 'Variable 0-450 / 0-1650 rpm range',
      'Chuck Diameter': '13mm steel keyless lock'
    },
    stock: 15,
    rating: 4.8,
    featured: true,
    reviews: [
      { id: 'r11', userName: 'Timothy N.', rating: 5, comment: 'Includes an auxiliary LED light which makes routing cable boxes under ceilings very clean!', date: '2026-05-19' }
    ]
  },

  // 10. Batteries & Inverters
  {
    id: 'inv-sine-1000w',
    name: 'Enginia VoltSync 1000W Pure Sine Wave Smart Inverter',
    category: 'Batteries & Inverters',
    price: 189.00,
    originalPrice: 220.00,
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&auto=format&fit=crop&q=60',
    description: 'Converts battery energy into pure utility house grade AC currents. Minimizes electrical buzz in fans, TVs, motors, or audio electronics.',
    specifications: {
      'Continuous Capacity': '1000W output flow',
      'Peak Power surge limit': '2000W surge capacity for startup induction',
      'Input requirement': '12V DC standard battery wire terminals',
      'Harmonic Distortion (THD)': '< 3% absolute pure sine wave layout',
      'Cooling system': 'Dynamic fan controlled by thermistor levels'
    },
    stock: 8,
    rating: 4.9,
    bestSeller: true,
    reviews: [
      { id: 'r12', userName: 'Edwin T.', rating: 5, comment: 'Powers my laptop, router, television and LED room lights without any audio background static. Excellent in blackouts.', date: '2026-05-25' }
    ]
  }
];

export const MOCK_COUPONS = [
  { code: 'ENGINIA10', discountPercent: 10, description: '10% off site-wide on accessories!' },
  { code: 'POWERUP20', discountPercent: 20, description: '20% off high performance power systems!' },
  { code: 'FREESHIP', discountPercent: 0, freeShipping: true, description: 'Free shipping on orders above $50.' }
];
