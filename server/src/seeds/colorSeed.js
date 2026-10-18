const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const User = require('../models/User');
const Color = require('../models/Color');
const Pattern = require('../models/Pattern');

const colorsData = [
  // Living Room - Warm & Neutral
  { name: 'Warm Cashmere', hex: '#E6D7C3', rgb: { r: 230, g: 215, b: 195 }, brand: 'Asian Paints', finish: 'matte', category: ['Living Room', 'Bedroom'], description: 'A gentle, comforting beige with subtle warm undertones.' },
  { name: 'Classic Cream', hex: '#FFF8E7', rgb: { r: 255, g: 248, b: 231 }, brand: 'Asian Paints', finish: 'eggshell', category: ['Living Room', 'Dining Room'], description: 'Timeless off-white cream that adds softness to any interior.' },
  { name: 'Morning Mist', hex: '#D8E2DC', rgb: { r: 216, g: 226, b: 220 }, brand: 'Dulux', finish: 'satin', category: ['Living Room', 'Bathroom'], description: 'A delicate silvery-grey with calming greenish mist nuances.' },
  { name: 'Smoky Charcoal', hex: '#333A42', rgb: { r: 51, g: 58, b: 66 }, brand: 'Berger', finish: 'matte', category: ['Living Room', 'Accent'], description: 'Deep, dramatic charcoal perfect for feature accent walls.' },
  { name: 'Sandstone Beige', hex: '#C2B280', rgb: { r: 194, g: 178, b: 128 }, brand: 'Nerolac', finish: 'eggshell', category: ['Living Room', 'Hallway'], description: 'Earthy golden-beige reminiscent of natural stone.' },
  { name: 'Urban Taupe', hex: '#8B8589', rgb: { r: 139, g: 133, b: 137 }, brand: 'Asian Paints', finish: 'matte', category: ['Living Room'], description: 'Sophisticated neutral balancing cool grey and earthy brown.' },
  { name: 'Oatmeal Luxe', hex: '#D7C9AA', rgb: { r: 215, g: 201, b: 170 }, brand: 'Nippon Paint', finish: 'satin', category: ['Living Room', 'Dining Room'], description: 'Soft golden oatmeal that creates an inviting open atmosphere.' },
  { name: 'Weathered Slate', hex: '#5B6770', rgb: { r: 91, g: 103, b: 112 }, brand: 'Dulux', finish: 'semi-gloss', category: ['Living Room', 'Accent'], description: 'Muted slate blue-grey bringing modern industrial elegance.' },

  // Bedroom - Calming & Restful
  { name: 'Serene Lavender', hex: '#BDB0D0', rgb: { r: 189, g: 176, b: 208 }, brand: 'Asian Paints', finish: 'matte', category: ['Bedroom', 'Nursery'], description: 'Tranquil pastel violet promoting deep relaxation and calm.' },
  { name: 'Tranquil Sage', hex: '#9CAE96', rgb: { r: 156, g: 174, b: 150 }, brand: 'Berger', finish: 'matte', category: ['Bedroom', 'Living Room'], description: 'Subtle herbal green that connects interiors to nature.' },
  { name: 'Blush Velvet', hex: '#E8CCD7', rgb: { r: 232, g: 204, b: 215 }, brand: 'Dulux', finish: 'satin', category: ['Bedroom', 'Nursery'], description: 'Delicate dusty rose blush that flatters ambient lighting.' },
  { name: 'Midnight Navy', hex: '#1B263B', rgb: { r: 27, g: 38, b: 59 }, brand: 'Asian Paints', finish: 'matte', category: ['Bedroom', 'Accent'], description: 'Rich, immersive deep blue that envelops a space with tranquility.' },
  { name: 'Seafoam Whisper', hex: '#C1DBD5', rgb: { r: 193, g: 219, b: 213 }, brand: 'Nippon Paint', finish: 'eggshell', category: ['Bedroom', 'Bathroom'], description: 'Airy aqua tint creating an open, spa-like feeling.' },
  { name: 'Dusk Heather', hex: '#7E6B80', rgb: { r: 126, g: 107, b: 128 }, brand: 'Nerolac', finish: 'matte', category: ['Bedroom'], description: 'Moody muted mauve ideal for cozy sanctuary bedrooms.' },
  { name: 'Feather Grey', hex: '#E5E5E5', rgb: { r: 229, g: 229, b: 229 }, brand: 'Dulux', finish: 'matte', category: ['Bedroom', 'Living Room'], description: 'Clean, light-reflecting soft grey for minimalist spaces.' },
  { name: 'Dusty Indigo', hex: '#3E5C76', rgb: { r: 62, g: 92, b: 118 }, brand: 'Berger', finish: 'satin', category: ['Bedroom', 'Accent'], description: 'Gentle denim-inspired blue adding depth and warmth.' },

  // Kitchen & Dining - Energetic & Appetizing
  { name: 'Tuscan Sun', hex: '#F4A261', rgb: { r: 244, g: 162, b: 97 }, brand: 'Asian Paints', finish: 'satin', category: ['Kitchen', 'Dining Room'], description: 'Warm apricot orange radiating hospitality and zest.' },
  { name: 'Olive Grove', hex: '#556B2F', rgb: { r: 85, g: 107, b: 47 }, brand: 'Berger', finish: 'semi-gloss', category: ['Kitchen', 'Accent'], description: 'Rich organic olive green offering artisanal kitchen charm.' },
  { name: 'Paprika Glow', hex: '#C85A32', rgb: { r: 200, g: 90, b: 50 }, brand: 'Dulux', finish: 'matte', category: ['Dining Room', 'Accent'], description: 'Spicy terracotta that stimulates conversation and dining.' },
  { name: 'Crisp Linen White', hex: '#F9F6F0', rgb: { r: 249, g: 246, b: 240 }, brand: 'Asian Paints', finish: 'semi-gloss', category: ['Kitchen', 'Living Room'], description: 'Bright yet soft white with high cleanability for kitchens.' },
  { name: 'Pistachio Gelato', hex: '#B8D5B8', rgb: { r: 184, g: 213, b: 184 }, brand: 'Nippon Paint', finish: 'satin', category: ['Kitchen'], description: 'Refreshing pastel pistachio bringing retro-modern vibrance.' },
  { name: 'Espresso Bean', hex: '#3E2723', rgb: { r: 62, g: 39, b: 35 }, brand: 'Nerolac', finish: 'gloss', category: ['Dining Room', 'Accent'], description: 'Luxurious dark roast brown delivering opulent contrast.' },
  { name: 'Mustard Velvet', hex: '#D4A373', rgb: { r: 212, g: 163, b: 115 }, brand: 'Asian Paints', finish: 'matte', category: ['Dining Room'], description: 'Earthy mustard amber with vintage European warmth.' },
  { name: 'Mint Sorbet', hex: '#A8DADC', rgb: { r: 168, g: 218, b: 220 }, brand: 'Dulux', finish: 'semi-gloss', category: ['Kitchen', 'Bathroom'], description: 'Crisp mint cyan that energizes cooking spaces.' },

  // Bathroom - Crisp, Clean & Spa
  { name: 'Ocean Breeze', hex: '#457B9D', rgb: { r: 69, g: 123, b: 157 }, brand: 'Asian Paints', finish: 'semi-gloss', category: ['Bathroom', 'Accent'], description: 'Deep coastal cyan blue evocative of fresh marine breezes.' },
  { name: 'Pearl Essence', hex: '#F0EAD6', rgb: { r: 240, g: 234, b: 214 }, brand: 'Dulux', finish: 'gloss', category: ['Bathroom', 'Living Room'], description: 'Iridescent eggshell white highlighting moisture-resistant tiles.' },
  { name: 'Aqua Whisper', hex: '#90E0EF', rgb: { r: 144, g: 224, b: 239 }, brand: 'Berger', finish: 'gloss', category: ['Bathroom'], description: 'Luminous light cyan conveying crystalline tropical waters.' },
  { name: 'Eucalyptus Leaf', hex: '#709775', rgb: { r: 112, g: 151, b: 117 }, brand: 'Nerolac', finish: 'semi-gloss', category: ['Bathroom', 'Bedroom'], description: 'Soothing herbal botanical green for luxury wellness baths.' },
  { name: 'Nordic Frost', hex: '#E0FAFF', rgb: { r: 224, g: 250, b: 255 }, brand: 'Nippon Paint', finish: 'satin', category: ['Bathroom'], description: 'Ultra-light glacial blue giving small bathrooms expansive depth.' },
  { name: 'Basalt Grey', hex: '#4A4E69', rgb: { r: 74, g: 78, b: 105 }, brand: 'Asian Paints', finish: 'matte', category: ['Bathroom', 'Accent'], description: 'Contemporary volcanic slate with a velvety purple undertone.' },

  // Accent & Feature Walls
  { name: 'Emerald Jewel', hex: '#0B6623', rgb: { r: 11, g: 102, b: 35 }, brand: 'Asian Paints', finish: 'gloss', category: ['Accent', 'Living Room'], description: 'Opulent forest emerald that anchors luxury gallery walls.' },
  { name: 'Royal Sapphire', hex: '#0F52BA', rgb: { r: 15, g: 82, b: 186 }, brand: 'Dulux', finish: 'semi-gloss', category: ['Accent'], description: 'Vibrant cobalt blue with radiant depth and prestige.' },
  { name: 'Crimson Majesty', hex: '#9E2A2B', rgb: { r: 158, g: 42, b: 43 }, brand: 'Berger', finish: 'matte', category: ['Accent', 'Dining Room'], description: 'Deep, rich wine red expressing confidence and architectural drama.' },
  { name: 'Marigold Spark', hex: '#FFB703', rgb: { r: 255, g: 183, b: 3 }, brand: 'Asian Paints', finish: 'satin', category: ['Accent', 'Living Room'], description: 'Joyful radiant golden-yellow bringing instant sunshine.' },
  { name: 'Teal Peacock', hex: '#005F73', rgb: { r: 0, g: 95, b: 115 }, brand: 'Nerolac', finish: 'satin', category: ['Accent', 'Bedroom'], description: 'Deep jewel teal with enchanting balance of blue and green.' },
  { name: 'Coral Horizon', hex: '#E76F51', rgb: { r: 231, g: 111, b: 81 }, brand: 'Nippon Paint', finish: 'matte', category: ['Accent', 'Living Room'], description: 'Lively terracotta coral brimming with Mediterranean spirit.' },
  { name: 'Electric Violet', hex: '#5A189A', rgb: { r: 90, g: 24, b: 154 }, brand: 'Berger', finish: 'gloss', category: ['Accent'], description: 'High-energy modern violet that makes striking statements.' },
  { name: 'Gilded Ochre', hex: '#CC8B3C', rgb: { r: 204, g: 139, b: 60 }, brand: 'Dulux', finish: 'matte', category: ['Accent'], description: 'Warm artisan gold with burnished metallic aura.' },

  // Nursery & Kids
  { name: 'Sky Cadet Blue', hex: '#A2D2FF', rgb: { r: 162, g: 210, b: 255 }, brand: 'Asian Paints', finish: 'matte', category: ['Nursery', 'Bedroom'], description: 'Cheery, airy cloud blue that sparks imagination.' },
  { name: 'Cotton Candy', hex: '#FFAFCC', rgb: { r: 255, g: 175, b: 204 }, brand: 'Berger', finish: 'satin', category: ['Nursery'], description: 'Sweet whimsical pink for warm, tender nurseries.' },
  { name: 'Buttercup Yellow', hex: '#FFE066', rgb: { r: 255, g: 224, b: 102 }, brand: 'Dulux', finish: 'satin', category: ['Nursery', 'Playroom'], description: 'Playful sunny yellow encouraging creativity and laughter.' },
  { name: 'Sweet Mint', hex: '#B7E4C7', rgb: { r: 183, g: 228, b: 199 }, brand: 'Nerolac', finish: 'matte', category: ['Nursery', 'Bathroom'], description: 'Soft pastel spring leaf green promoting restful sleep.' },
  { name: 'Lilac Cloud', hex: '#D8BBFF', rgb: { r: 216, g: 187, b: 255 }, brand: 'Nippon Paint', finish: 'eggshell', category: ['Nursery', 'Bedroom'], description: 'Gentle fairy-tale lilac that enchants nursery ceilings.' },

  // Exterior & Hallway
  { name: 'Terracotta Hearth', hex: '#A2482B', rgb: { r: 162, g: 72, b: 43 }, brand: 'Asian Paints', finish: 'matte', category: ['Exterior', 'Accent'], description: 'Weathered clay red evoking timeless Mediterranean villas.' },
  { name: 'Granite Peak', hex: '#495057', rgb: { r: 73, g: 80, b: 87 }, brand: 'Dulux', finish: 'matte', category: ['Exterior', 'Hallway'], description: 'Steely modern granite grey with strong exterior curb appeal.' },
  { name: 'Mediterranean Ochre', hex: '#E9C46A', rgb: { r: 233, g: 196, b: 106 }, brand: 'Berger', finish: 'satin', category: ['Exterior', 'Living Room'], description: 'Warm sun-drenched stucco yellow for welcoming entrances.' },
  { name: 'Forest Moss', hex: '#2D6A4F', rgb: { r: 45, g: 106, b: 79 }, brand: 'Nerolac', finish: 'semi-gloss', category: ['Exterior', 'Accent'], description: 'Deep organic pine green that harmonizes with garden landscapes.' },
  { name: 'Pure Chalk', hex: '#FFFFFF', rgb: { r: 255, g: 255, b: 255 }, brand: 'Asian Paints', finish: 'gloss', category: ['Exterior', 'Living Room'], description: 'Pristine, ultra-bright architectural pure white.' },
  { name: 'Warm Pewter', hex: '#8D99AE', rgb: { r: 141, g: 153, b: 174 }, brand: 'Nippon Paint', finish: 'matte', category: ['Hallway', 'Exterior'], description: 'Balanced silver-blue neutral that suits modern facades.' },
  { name: 'Sienna Dusk', hex: '#873e23', rgb: { r: 135, g: 62, b: 35 }, brand: 'Dulux', finish: 'matte', category: ['Exterior', 'Dining Room'], description: 'Rich burnt sienna adding rustic depth to trims and porches.' },
];

const patternsData = [
  { name: 'Modern Geometric Hex', description: 'Hexagonal honeycomb motif with subtle metallic accents', category: 'Geometric', imageUrl: '/uploads/pattern-geo.png', style: 'Contemporary', scale: 1 },
  { name: 'Botanical Palm Leaves', description: 'Tropical lush foliage with watercolor gradients', category: 'Floral', imageUrl: '/uploads/pattern-botanical.png', style: 'Tropical Boho', scale: 1.2 },
  { name: 'Art Deco Chevron', description: 'Elegant gold-tipped zig-zag chevron lines', category: 'Abstract', imageUrl: '/uploads/pattern-artdeco.png', style: 'Vintage Luxury', scale: 0.8 },
  { name: 'Scandinavian Minimal Stripes', description: 'Clean vertical pinstripes with alternating widths', category: 'Stripes', imageUrl: '/uploads/pattern-stripes.png', style: 'Nordic Minimal', scale: 1 },
  { name: 'Victorian Damask', description: 'Classic regal damask scrollwork for heritage feature walls', category: 'Floral', imageUrl: '/uploads/pattern-damask.png', style: 'Heritage Classic', scale: 1.5 },
];

async function seedDatabase() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/wall-paint-visualizer';
    console.log(`Connecting to MongoDB at: ${mongoUri}`);
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully for seeding.');

    // Clear existing colors and patterns
    await Color.deleteMany({});
    await Pattern.deleteMany({});
    console.log('Cleared existing colors and patterns.');

    // Seed colors
    const createdColors = await Color.insertMany(colorsData);
    console.log(`Successfully seeded ${createdColors.length} paint colors.`);

    // Seed patterns
    const createdPatterns = await Pattern.insertMany(patternsData);
    console.log(`Successfully seeded ${createdPatterns.length} patterns.`);

    // Check or create admin user
    const adminEmail = 'admin@wallpaint.com';
    let admin = await User.findOne({ email: adminEmail });
    if (!admin) {
      admin = await User.create({
        name: 'System Admin',
        email: adminEmail,
        password: 'admin123',
        role: 'admin',
      });
      console.log(`Created default admin account: ${adminEmail} (password: admin123)`);
    } else {
      console.log(`Admin user already exists: ${adminEmail}`);
    }

    // Check or create demo user
    const demoEmail = 'user@wallpaint.com';
    let demoUser = await User.findOne({ email: demoEmail });
    if (!demoUser) {
      demoUser = await User.create({
        name: 'Jane Designer',
        email: demoEmail,
        password: 'user123',
        role: 'user',
      });
      console.log(`Created demo user account: ${demoEmail} (password: user123)`);
    } else {
      console.log(`Demo user already exists: ${demoEmail}`);
    }

    console.log('Seed completed successfully!');
  } catch (error) {
    console.error('Error during seeding:', error);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from MongoDB.');
    process.exit(0);
  }
}

seedDatabase();
