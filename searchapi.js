
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 3004;

app.use(cors({
  origin: [
    'http://localhost:3001',
    'https://test-project-wbscsite.vercel.app'
  ]
}));

app.use(express.json());

const products = [
  {
    id: 1,
    name: "Hinge Accessories Deep Thread System Screws POZI Drive #7 Gauge 1/2\" Length - 1,000 Box Qty",
    category: "Screws",
    sku: "BP6611300HG",
    price: 100.00,
    priceUnit: "1000 Each",
    unitPrice: 0.100,
    description: "Deep thread system screws with POZI drive, #7 gauge, 1/2\" length.",
    image: "Screw.png"
  },
  {
    id: 2,
    name: "110 Deg + CLIP Top BLUMOTION, Soft-Close Hinges For Door Overlays Up To 22 mm, Dowel",
    category: "Hinges",
    sku: "BP73B3580",
    price: 5.140,
    priceUnit: "Each",
    unitPrice: 5.140,
    description: "110 degree soft-close hinges for door overlays up to 22mm, dowel.",
    image: "Hinge.png"
  },
  {
    id: 3,
    name: "CLIP Top BLUMOTION Angled Hinges +45 Deg Angled 110 Deg Opening Hinge with BLUMOTION Soft-Closing, 45mm Boring Pattern, Full Overlay, Nickel-Plated, Inserta",
    category: "Hinges",
    sku: "BP79B3598",
    price: 11.850,
    priceUnit: "Each",
    unitPrice: 11.850,
    description: "Angled hinges with BLUMOTION, 45mm boring pattern, full overlay, nickel-plated, Inserta.",
    image: "Hinge2.png"
  },
  {
    id: 4,
    name: "No. 8 Deep Thread Wood Screw 2\" Length - 1,000 Box Qty",
    category: "Screws",
    sku: "BP8200Z1000",
    price: 50.00,
    priceUnit: "1000 Each",
    unitPrice: 0.050,
    description: "No. 8 deep thread wood screw, 2\" length, 1,000 per box.",
    image: "Screw2.png"
  },
  {
    id: 5,
    name: "Blum TANDEM Plus BLUMOTION 563F Undermount Drawer Slides Full Extension Drawer Slides 18\"",
    category: "Drawer Slides",
    sku: "BP563F4570B",
    price: 36.560,
    priceUnit: "Set",
    unitPrice: 36.560,
    description: "18\" full extension undermount drawer slides with BLUMOTION.",
    image: "Slide.png"
  },
  {
    id: 6,
    name: "95 Deg Onyx Black CLIP Top BLUMOTION Soft-Close Blind Corner Hinges, Inserta",
    category: "Hinges",
    sku: "BP79B9590-ONYX",
    price: 11.120,
    priceUnit: "Each",
    unitPrice: 11.120,
    description: "95 degree onyx black soft-close blind corner hinge, Inserta.",
    image: "Clip.png"
  },
  {
    id: 7,
    name: "18\" 569F HEAVY DUTY TANDEM BLUMOTION SLD - Blum BP569F4570B",
    category: "Drawer Slides",
    sku: "BP569F4570B",
    price: 54.330,
    priceUnit: "Set",
    unitPrice: 54.330,
    description: "18\" 569F heavy duty TANDEM BLUMOTION slide.",
    image: "Slide2.png"
  },
  {
    id: 8,
    name: "18\" 569H HEAVY DUTY TANDEM BLUMOTION SLD - Blum BP569H4570B",
    category: "Drawer Slides",
    sku: "BP569H4570B",
    price: 52.130,
    priceUnit: "Set",
    unitPrice: 52.130,
    description: "18\" 569H heavy duty TANDEM BLUMOTION slide.",
    image: "Slide3.png"
  },
  {
    id: 9,
    name: "Blum TANDEM plus BLUMOTION 563H Undermount Drawer Slides Full Extension Soft-Close, 21\" Length",
    category: "Drawer Slides",
    sku: "BP563H5330B",
    price: 34.250,
    priceUnit: "Set",
    unitPrice: 34.250,
    description: "21\" full extension soft-close undermount drawer slides.",
    image: "Slide4.png"
  }
];

app.get('/api/products/search', (req, res) => {
  const { q, category, minPrice, maxPrice, limit = 50 } = req.query;
  
  let filteredProducts = [...products];
  
  if (q) {
    const searchTerm = q.toLowerCase();
    filteredProducts = filteredProducts.filter(product =>
      product.name.toLowerCase().includes(searchTerm) ||
      product.sku.toLowerCase().includes(searchTerm) ||
      product.description.toLowerCase().includes(searchTerm)
    );
  }
  
  if (category) {
    filteredProducts = filteredProducts.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  }
  
  if (minPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.unitPrice >= parseFloat(minPrice)
    );
  }
  
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(product => 
      product.unitPrice <= parseFloat(maxPrice)
    );
  }
  
  filteredProducts = filteredProducts.slice(0, parseInt(limit));
  
  res.json({
    results: filteredProducts,
    count: filteredProducts.length,
    query: { q, category, minPrice, maxPrice }
  });
});

app.get('/api/products/name/:name', (req, res) => {
  const productName = req.params.name;
  const product = products.find(p => 
    p.name.toLowerCase() === productName.toLowerCase()
  );
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/api/products/sku/:sku', (req, res) => {
  const sku = req.params.sku;
  const product = products.find(p => 
    p.sku.toLowerCase() === sku.toLowerCase()
  );
  
  if (product) {
    res.json(product);
  } else {
    res.status(404).json({ error: 'Product not found' });
  }
});

app.get('/api/products/categories', (req, res) => {
  const categories = [...new Set(products.map(p => p.category))];
  res.json({ categories });
});

app.get('/api/products', (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const startIndex = (parseInt(page) - 1) * parseInt(limit);
  const endIndex = startIndex + parseInt(limit);
  
  const paginatedProducts = products.slice(startIndex, endIndex);
  
  res.json({
    products: paginatedProducts,
    totalProducts: products.length,
    currentPage: parseInt(page),
    totalPages: Math.ceil(products.length / parseInt(limit))
  });
});

app.listen(port, () => {
  console.log(`API server running at http://localhost:${port}`);
});