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
        id: 26, name: 'Vintage Gold Choker', price: 12499, comparePrice: 16000,
        description: 'Antique finish gold choker.', collection: 'handmade', category: 'necklace', stock: 3,
        image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?w=800&q=80'
    },
    {
        id: 27, name: 'Sapphire Drop Pendant', price: 7999, comparePrice: 9999,
        description: 'Elegant sapphire drop necklace.', collection: 'anti-tarnish', category: 'necklace', stock: 5,
        image: 'https://images.unsplash.com/photo-1599643477877-530eb83abc8e?w=800&q=80'
    },
    {
        id: 29, name: 'Minimalist Moon Chain', price: 2999, comparePrice: 3999,
        description: 'Sleek crescent moon pendant.', collection: 'anti-tarnish', category: 'necklace', stock: 12,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
    },
    {
        id: 34, name: 'Tassel Lariat Necklace', price: 4299, comparePrice: 5500,
        description: 'Long lariat necklace with tassel.', collection: 'anti-tarnish', category: 'necklace', stock: 7,
        image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?w=800&q=80'
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