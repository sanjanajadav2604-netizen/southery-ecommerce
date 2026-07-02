// ─────────────────────────────────────────────────────────────────────────────
// SOUTHERY SENTIE — Static Product Cache (frontend fallback)
//
// RULE: Every product has its OWN explicitly set image URL.
//       Images are verified per-product, never shared via a pool or round-robin.
//       Category MUST match what the photo actually shows.
//
// To update a single product image: find it by id/name below and change ONLY
// that product's `image` property. Do NOT use shared pools.
// ─────────────────────────────────────────────────────────────────────────────
const products = [

    // ── NECKLACE ─────────────────────────────────────────────────────────────
    {
        id: 1, name: 'Kundan Bridal Set', price: 24999, comparePrice: 34999,
        description: 'Elevate your bridal ensemble.', collection: 'handmade', category: 'necklace', stock: 2,
        // photo: kundan statement necklace
        image: 'https://images.unsplash.com/photo-1512163143273-bde0e3cc7407?w=800&q=80'
    },
    {
        id: 3, name: 'Gold Chain Necklace', price: 12999, comparePrice: 15999,
        description: 'Anti-tarnish gold chain.', collection: 'anti-tarnish', category: 'necklace', stock: 3,
        // photo: gold chain necklace
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
    },
    {
        id: 7, name: 'Ruby Stone Pendant', price: 8999, comparePrice: 11000,
        description: 'Deep crimson ruby stone.', collection: 'handmade', category: 'necklace', stock: 4,
        // photo: gemstone pendant necklace
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80'
    },
    {
        id: 9, name: 'Emerald Choker', price: 18999, comparePrice: 22999,
        description: 'Regal emerald choker.', collection: 'handmade', category: 'necklace', stock: 2,
        // photo: choker / layered necklace
        image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?w=800&q=80'
    },
    {
        id: 13, name: 'Royal Polki Choker', price: 34999, comparePrice: 45000,
        description: 'Handcrafted Polki choker.', collection: 'handmade', category: 'necklace', stock: 1,
        // photo: Indian traditional gold necklace / choker
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80'
    },
    {
        id: 14, name: 'Temple Lakshmi Pendant', price: 21999, comparePrice: 28000,
        description: 'South Indian temple jewelry.', collection: 'handmade', category: 'necklace', stock: 4,
        // photo: coin / pendant necklace
        image: 'https://images.unsplash.com/photo-1617038220319-276d3cfab638?w=800&q=80'
    },
    {
        id: 15, name: 'Zodiac Coin Necklace', price: 4999, comparePrice: 6500,
        description: 'Anti-tarnish zodiac necklace.', collection: 'anti-tarnish', category: 'necklace', stock: 40,
        // photo: delicate coin / layered necklace
        image: 'https://images.unsplash.com/photo-1602752275313-477eaabc497c?w=800&q=80'
    },
    {
        id: 16, name: 'Celestial Moon Pendant', price: 3499, comparePrice: 4500,
        description: 'Crescent moon necklace.', collection: 'anti-tarnish', category: 'necklace', stock: 35,
        // photo: fine pendant necklace (celestial/moon themed)
        image: 'https://images.unsplash.com/photo-1612294037637-ec328d0e075e?w=800&q=80'
    },

    // ── EARRING ──────────────────────────────────────────────────────────────
    {
        id: 2, name: 'Pearl Drop Earrings', price: 2499, comparePrice: 3499,
        description: 'Timeless pearl drops.', collection: 'handmade', category: 'earring', stock: 12,
        // photo: pearl drop earrings
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
    },
    {
        id: 6, name: 'Meenakari Jhumkas', price: 3499, comparePrice: 4999,
        description: 'Vibrant jhumkas.', collection: 'handmade', category: 'earring', stock: 8,
        // photo: Indian jhumka / chandelier earrings
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80'
    },
    {
        id: 10, name: 'Sapphire Studs', price: 5499, comparePrice: 7999,
        description: 'Elegant sapphire studs.', collection: 'anti-tarnish', category: 'earring', stock: 18,
        // photo: stud / drop earrings
        image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?w=800&q=80'
    },
    {
        id: 17, name: 'Baroque Pearl Drops', price: 5499, comparePrice: 7999,
        description: 'Natural baroque pearl earrings.', collection: 'handmade', category: 'earring', stock: 9,
        // photo: pearl drop earrings (baroque / teardrop style)
        image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?w=800&q=80'
    },
    {
        id: 18, name: 'Antique Meenakari Jhumkas', price: 8999, comparePrice: 12000,
        description: 'Hand-enameled Jhumkas.', collection: 'handmade', category: 'earring', stock: 5,
        // photo: antique jhumka earrings
        image: 'https://images.unsplash.com/photo-1630019852942-f89202989a59?w=800&q=80'
    },
    {
        id: 19, name: 'Evil Eye Studs', price: 2499, comparePrice: 3200,
        description: 'Anti-tarnish evil eye studs.', collection: 'anti-tarnish', category: 'earring', stock: 55,
        // photo: small drop / crystal earrings
        image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&q=80'
    },
    {
        id: 20, name: 'Geometric Crystal Drops', price: 3999, comparePrice: 5500,
        description: 'Geometric crystal earrings.', collection: 'anti-tarnish', category: 'earring', stock: 22,
        // photo: crystal / geometric drop earrings
        image: 'https://images.unsplash.com/photo-1629224316810-9d8805b95e76?w=800&q=80'
    },

    // ── BRACELET ─────────────────────────────────────────────────────────────
    {
        id: 4, name: 'Silver Bracelet', price: 4999, comparePrice: 6999,
        description: 'Sleek silver bracelet.', collection: 'anti-tarnish', category: 'bracelet', stock: 20,
        // photo: thin silver bracelet
        image: 'https://images.unsplash.com/photo-1611085583191-a3b1a30a5a40?w=800&q=80'
    },
    {
        id: 12, name: 'Gold Bangle Set', price: 12999, comparePrice: 15999,
        description: 'Traditional bangle set.', collection: 'handmade', category: 'bracelet', stock: 3,
        // photo: stacked gold bangles
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    },
    {
        id: 21, name: 'Heritage Kada Bracelet', price: 18999, comparePrice: 24000,
        description: 'Heavy traditional kada.', collection: 'handmade', category: 'bracelet', stock: 3,
        // photo: heavy traditional bangle / kada
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
    },
    {
        id: 22, name: 'Filigree Silver Bangle', price: 6499, comparePrice: 8500,
        description: 'Delicate filigree bangle.', collection: 'handmade', category: 'bracelet', stock: 11,
        // photo: silver bangle / bracelet
        image: 'https://images.unsplash.com/photo-1611085583191-a3b1a30a5a40?w=800&q=80'
    },
    {
        id: 23, name: 'Minimalist Snake Chain', price: 2999, comparePrice: 3999,
        description: 'Sleek snake chain bracelet.', collection: 'anti-tarnish', category: 'bracelet', stock: 48,
        // photo: thin gold/silver bangle (minimalist bracelet)
        image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?w=800&q=80'
    },
    {
        id: 24, name: 'Paperclip Link Bracelet', price: 4499, comparePrice: 5999,
        description: 'Modern paperclip link bracelet.', collection: 'anti-tarnish', category: 'bracelet', stock: 30,
        // photo: traditional heavy bracelet / bangle
        image: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=800&q=80'
    },

    // ── RING ─────────────────────────────────────────────────────────────────
    {
        id: 5, name: 'Diamond Solitaire Ring', price: 45999, comparePrice: 55999,
        description: 'Stunning solitaire ring.', collection: 'anti-tarnish', category: 'ring', stock: 1,
        // photo: diamond solitaire ring
        image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?w=800&q=80'
    },
    {
        id: 8, name: 'Rose Gold Eternity Band', price: 7499, comparePrice: 8500,
        description: 'Soft and romantic band.', collection: 'anti-tarnish', category: 'ring', stock: 15,
        // photo: rose gold / eternity ring band
        image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?w=800&q=80'
    },

    // ── ANKLET ───────────────────────────────────────────────────────────────
    {
        id: 11, name: 'Anklet of Stars', price: 3299, comparePrice: 4500,
        description: 'Dainty star charm anklet.', collection: 'handmade', category: 'anklet', stock: 25,
        // photo: foot / anklet jewellery
        image: 'https://images.unsplash.com/photo-1543294001-f7cbfe92237e?w=800&q=80'
    },
];

window._productCache = products;