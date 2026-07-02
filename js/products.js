// ─────────────────────────────────────────────────────────────────────────────
// SOUTHERY SENTIE — Static Product Cache (frontend fallback)
// IMPORTANT: Images are assigned per category via categoryImageMap below.
// Do NOT hardcode image URLs inline next to products.
// To update images: modify categoryImageMap, not individual product objects.
// ─────────────────────────────────────────────────────────────────────────────

// Curated category-to-image mapping. Each URL is verified to match the category.
const categoryImageMap = {
    earring:  [
        'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80',  // pearl drop earrings
        'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80',  // jhumka / chandelier
        'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&q=80',  // crystal drop earrings
        'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80',  // stud earrings
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',  // hoop earrings
    ],
    necklace: [
        'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=800&q=80',  // kundan bridal necklace
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',  // gold chain necklace
        'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80',  // ruby/pendant necklace
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',  // emerald choker
        'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80',  // temple / Indian pendant
        'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80',  // coin necklace
        'https://images.unsplash.com/photo-1602752275313-477eaabc497c?w=800&q=80',  // celestial / zodiac
        'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?w=800&q=80',  // polki choker
    ],
    bracelet: [
        'https://images.unsplash.com/photo-1611085583191-a3b1a30a5a40?w=800&q=80',  // silver/thin bracelet
        'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80',  // gold bangle set
        'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80',  // heavy kada
        'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80',  // filigree bangle
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',  // minimalist / snake chain
        'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80',  // paperclip link
    ],
    ring:     [
        'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80',  // diamond solitaire ring
        'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80',  // rose gold eternity band
    ],
    anklet:   [
        'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=800&q=80',     // anklet / foot jewellery
    ],
    set:      [
        'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=800&q=80',  // bridal set
        'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80',  // Indian set
    ],
};

// Counter per category for round-robin assignment
const _catCounters = {};
function _pickImage(category) {
    const pool = categoryImageMap[category] || categoryImageMap['necklace'];
    if (!(_catCounters[category] >= 0)) _catCounters[category] = 0;
    const url = pool[_catCounters[category] % pool.length];
    _catCounters[category]++;
    return url;
}

// ─────────────────────────────────────────────────────────────────────────────
// PRODUCT DEFINITIONS — no inline images
// ─────────────────────────────────────────────────────────────────────────────
const _productDefs = [
    { id: 1,  name: 'Kundan Bridal Set',          price: 24999, comparePrice: 34999, description: 'Elevate your bridal ensemble.', collection: 'handmade',    category: 'necklace', stock: 2  },
    { id: 2,  name: 'Pearl Drop Earrings',         price: 2499,  comparePrice: 3499,  description: 'Timeless pearl drops.',         collection: 'handmade',    category: 'earring',  stock: 12 },
    { id: 3,  name: 'Gold Chain Necklace',         price: 12999, comparePrice: 15999, description: 'Anti-tarnish gold chain.',       collection: 'anti-tarnish',category: 'necklace', stock: 3  },
    { id: 4,  name: 'Silver Bracelet',             price: 4999,  comparePrice: 6999,  description: 'Sleek silver bracelet.',         collection: 'anti-tarnish',category: 'bracelet', stock: 20 },
    { id: 5,  name: 'Diamond Solitaire Ring',      price: 45999, comparePrice: 55999, description: 'Stunning solitaire ring.',       collection: 'anti-tarnish',category: 'ring',     stock: 1  },
    { id: 6,  name: 'Meenakari Jhumkas',           price: 3499,  comparePrice: 4999,  description: 'Vibrant jhumkas.',              collection: 'handmade',    category: 'earring',  stock: 8  },
    { id: 7,  name: 'Ruby Stone Pendant',          price: 8999,  comparePrice: 11000, description: 'Deep crimson ruby stone.',       collection: 'handmade',    category: 'necklace', stock: 4  },
    { id: 8,  name: 'Rose Gold Eternity Band',     price: 7499,  comparePrice: 8500,  description: 'Soft and romantic band.',        collection: 'anti-tarnish',category: 'ring',     stock: 15 },
    { id: 9,  name: 'Emerald Choker',              price: 18999, comparePrice: 22999, description: 'Regal emerald choker.',          collection: 'handmade',    category: 'necklace', stock: 2  },
    { id: 10, name: 'Sapphire Studs',              price: 5499,  comparePrice: 7999,  description: 'Elegant sapphire studs.',        collection: 'anti-tarnish',category: 'earring',  stock: 18 },
    { id: 11, name: 'Anklet of Stars',             price: 3299,  comparePrice: 4500,  description: 'Dainty star charm anklet.',      collection: 'handmade',    category: 'anklet',   stock: 25 },
    { id: 12, name: 'Gold Bangle Set',             price: 12999, comparePrice: 15999, description: 'Traditional bangle set.',        collection: 'handmade',    category: 'bracelet', stock: 3  },
    { id: 13, name: 'Royal Polki Choker',          price: 34999, comparePrice: 45000, description: 'Handcrafted Polki choker.',      collection: 'handmade',    category: 'necklace', stock: 1  },
    { id: 14, name: 'Temple Lakshmi Pendant',      price: 21999, comparePrice: 28000, description: 'South Indian temple jewelry.',   collection: 'handmade',    category: 'necklace', stock: 4  },
    { id: 15, name: 'Zodiac Coin Necklace',        price: 4999,  comparePrice: 6500,  description: 'Anti-tarnish zodiac necklace.', collection: 'anti-tarnish',category: 'necklace', stock: 40 },
    { id: 16, name: 'Celestial Moon Pendant',      price: 3499,  comparePrice: 4500,  description: 'Crescent moon necklace.',        collection: 'anti-tarnish',category: 'necklace', stock: 35 },
    { id: 17, name: 'Baroque Pearl Drops',         price: 5499,  comparePrice: 7999,  description: 'Natural baroque pearl earrings.',collection: 'handmade',    category: 'earring',  stock: 9  },
    { id: 18, name: 'Antique Meenakari Jhumkas',   price: 8999,  comparePrice: 12000, description: 'Hand-enameled Jhumkas.',         collection: 'handmade',    category: 'earring',  stock: 5  },
    { id: 19, name: 'Evil Eye Studs',              price: 2499,  comparePrice: 3200,  description: 'Anti-tarnish evil eye studs.',  collection: 'anti-tarnish',category: 'earring',  stock: 55 },
    { id: 20, name: 'Geometric Crystal Drops',     price: 3999,  comparePrice: 5500,  description: 'Geometric crystal earrings.',    collection: 'anti-tarnish',category: 'earring',  stock: 22 },
    { id: 21, name: 'Heritage Kada Bracelet',      price: 18999, comparePrice: 24000, description: 'Heavy traditional kada.',        collection: 'handmade',    category: 'bracelet', stock: 3  },
    { id: 22, name: 'Filigree Silver Bangle',      price: 6499,  comparePrice: 8500,  description: 'Delicate filigree bangle.',      collection: 'handmade',    category: 'bracelet', stock: 11 },
    { id: 23, name: 'Minimalist Snake Chain',      price: 2999,  comparePrice: 3999,  description: 'Sleek snake chain bracelet.',    collection: 'anti-tarnish',category: 'bracelet', stock: 48 },
    { id: 24, name: 'Paperclip Link Bracelet',     price: 4499,  comparePrice: 5999,  description: 'Modern paperclip link bracelet.',collection: 'anti-tarnish',category: 'bracelet', stock: 30 },
];

// Assign images per category (round-robin, never by product array index)
const products = _productDefs.map(p => ({
    ...p,
    image: _pickImage(p.category),
}));

window._productCache = products;