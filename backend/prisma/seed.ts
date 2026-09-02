import bcrypt from 'bcryptjs';
import { env } from '../src/lib/env';
import { prisma } from '../src/lib/prisma';

type SeedProduct = {
  name: string;
  category: string;
  price: number;
  mrp: number;
  stock: number;
  rating: number;
  ratingCount: number;
  featured?: boolean;
  description: string;
};

const catalogue: SeedProduct[] = [
  {
    name: 'Kundan Bridal Necklace Set with Maang Tikka',
    category: 'Bridal Collection',
    price: 3499,
    mrp: 6999,
    stock: 12,
    rating: 4.6,
    ratingCount: 318,
    featured: true,
    description:
      'Hand-set kundan stones on a gold polished brass base, paired with matching jhumkas and maang tikka. The complete bridal look, finished by our karigars in Gangakhed.',
  },
  {
    name: 'Antique Temple Laxmi Coin Long Haram',
    category: 'Temple Jewellery',
    price: 2899,
    mrp: 5499,
    stock: 8,
    rating: 4.7,
    ratingCount: 245,
    featured: true,
    description:
      'A traditional South Indian long haram with Laxmi coin motifs in an antique gold finish. Sits beautifully over silk sarees for weddings and temple visits.',
  },
  {
    name: 'Pearl Choker Set with Ruby Drops',
    category: 'Necklace Sets',
    price: 1899,
    mrp: 3499,
    stock: 20,
    rating: 4.4,
    ratingCount: 176,
    featured: true,
    description:
      'Fresh water pearl choker strung by hand with red ruby-tone drops. Lightweight enough for a full day of functions, adjustable dori at the back.',
  },
  {
    name: 'Meenakari Peacock Jhumka Earrings',
    category: 'Earrings',
    price: 799,
    mrp: 1599,
    stock: 34,
    rating: 4.5,
    ratingCount: 402,
    featured: true,
    description:
      'Enamel meenakari work in blue and green over a peacock silhouette, finished with pearl beading. Secure push-back closure, weighs just 18 grams a pair.',
  },
  {
    name: 'Polki Gold Plated Bridal Set',
    category: 'Bridal Collection',
    price: 4299,
    mrp: 8499,
    stock: 6,
    rating: 4.8,
    ratingCount: 129,
    featured: true,
    description:
      'Uncut polki stones in a layered rani haar with earrings. Two year gold plating warranty, delivered in a velvet bridal box.',
  },
  {
    name: 'Oxidised Silver Statement Necklace',
    category: 'Necklace Sets',
    price: 1249,
    mrp: 2499,
    stock: 25,
    rating: 4.3,
    ratingCount: 288,
    description:
      'German silver oxidised necklace with tribal motifs and ghungroo detailing. Pairs perfectly with cotton and handloom outfits.',
  },
  {
    name: 'Traditional Green Bangles Set of 12',
    category: 'Bangles & Bracelets',
    price: 949,
    mrp: 1899,
    stock: 40,
    rating: 4.2,
    ratingCount: 356,
    description:
      'A dozen glass and metal bangles in emerald green with gold rims. Available in 2.4, 2.6 and 2.8 sizes, sent as a complete stacking set.',
  },
  {
    name: 'Rose Gold CZ Solitaire Ring',
    category: 'Rings',
    price: 699,
    mrp: 1499,
    stock: 30,
    rating: 4.4,
    ratingCount: 214,
    description:
      'A single American diamond set in a rose gold plated band. Adjustable shank fits most sizes, tarnish resistant with everyday wear.',
  },
  {
    name: 'Silver Payal Anklets with Ghungroo',
    category: 'Anklets',
    price: 899,
    mrp: 1799,
    stock: 22,
    rating: 4.5,
    ratingCount: 187,
    description:
      'Pure look silver payal with tiny ghungroo bells, sold as a pair. Strong clasp and anti tarnish coating for daily wear.',
  },
  {
    name: 'Antique Gold Lakshmi Temple Necklace',
    category: 'Temple Jewellery',
    price: 2499,
    mrp: 4999,
    stock: 10,
    rating: 4.6,
    ratingCount: 143,
    description:
      'Goddess Lakshmi pendant framed by intricate filigree and hanging pearls, in a matte antique gold finish.',
  },
  {
    name: 'Chandbali Kundan Earrings',
    category: 'Earrings',
    price: 1099,
    mrp: 2199,
    stock: 28,
    rating: 4.6,
    ratingCount: 331,
    featured: true,
    description:
      'Half moon chandbali with kundan stones and pearl fringe. Comes with an ear chain for extra support with heavier outfits.',
  },
  {
    name: 'Bridal Rani Haar Long Necklace Set',
    category: 'Bridal Collection',
    price: 3899,
    mrp: 7499,
    stock: 7,
    rating: 4.7,
    ratingCount: 98,
    description:
      'Two layer rani haar with a detachable short necklace, so one set works for both the wedding and reception.',
  },
  {
    name: 'Pachi Kundan Kada Bangles Pair',
    category: 'Bangles & Bracelets',
    price: 1799,
    mrp: 3599,
    stock: 15,
    rating: 4.4,
    ratingCount: 121,
    description:
      'Broad pachi kundan kadas with screw openings, sold as a pair. The stone setting is hand pressed, not glued.',
  },
  {
    name: 'Navratna Nine Stone Pendant Set',
    category: 'Necklace Sets',
    price: 1599,
    mrp: 2999,
    stock: 18,
    rating: 4.3,
    ratingCount: 156,
    description:
      'Nine auspicious stones set around a gold plated pendant with a matching chain and studs.',
  },
  {
    name: 'Jadau Nath Nose Ring',
    category: 'Bridal Collection',
    price: 649,
    mrp: 1299,
    stock: 26,
    rating: 4.2,
    ratingCount: 89,
    description:
      'Maharashtrian style jadau nath with pearl drops and a supporting chain. Clip on version, no piercing required.',
  },
  {
    name: 'Kolhapuri Saaj Traditional Necklace',
    category: 'Temple Jewellery',
    price: 2199,
    mrp: 4299,
    stock: 0,
    rating: 4.8,
    ratingCount: 267,
    description:
      'The classic Kolhapuri saaj with 21 leaf motifs and a central pendant, made the way it has been made in Maharashtra for generations.',
  },
  {
    name: 'American Diamond Bracelet',
    category: 'Bangles & Bracelets',
    price: 1149,
    mrp: 2299,
    stock: 19,
    rating: 4.3,
    ratingCount: 142,
    description:
      'Sparkling AD stones in a flexible tennis bracelet with a lobster clasp and extension chain.',
  },
  {
    name: 'Pearl Drop Stud Earrings',
    category: 'Earrings',
    price: 549,
    mrp: 1099,
    stock: 45,
    rating: 4.1,
    ratingCount: 512,
    description:
      'Everyday pearl drops on a gold plated stud. Light on the ear at only 6 grams a pair, office and festival friendly.',
  },
  {
    name: 'Gold Plated Vanki Armlet',
    category: 'Bridal Collection',
    price: 1399,
    mrp: 2799,
    stock: 11,
    rating: 4.5,
    ratingCount: 76,
    description:
      'Traditional vanki armlet with kundan work and an adjustable band, worn on the upper arm for South Indian bridal looks.',
  },
  {
    name: 'Antique Finish Toe Rings Pair',
    category: 'Anklets',
    price: 399,
    mrp: 799,
    stock: 50,
    rating: 4.0,
    ratingCount: 203,
    description:
      'Adjustable bichhiya toe rings in an antique silver finish, comfortable enough to keep on all day.',
  },
  {
    name: 'Emerald Stone Cocktail Ring',
    category: 'Rings',
    price: 849,
    mrp: 1699,
    stock: 0,
    rating: 4.4,
    ratingCount: 118,
    description:
      'A bold emerald green centre stone surrounded by AD halo work, on an adjustable gold plated band.',
  },
];

async function main() {
  console.log('Seeding database...');

  const passwordHash = await bcrypt.hash(env.adminPassword, 10);
  await prisma.user.upsert({
    where: { email: env.adminEmail.toLowerCase() },
    update: { role: 'ADMIN' },
    create: {
      fullName: 'Store Admin',
      email: env.adminEmail.toLowerCase(),
      phone: '9999999999',
      passwordHash,
      role: 'ADMIN',
    },
  });
  console.log(`Admin account ready: ${env.adminEmail}`);

  const demoPassword = await bcrypt.hash('Demo@123', 10);
  await prisma.user.upsert({
    where: { email: 'demo@nikunjcreation.com' },
    update: {},
    create: {
      fullName: 'Demo Customer',
      email: 'demo@nikunjcreation.com',
      phone: '9876543210',
      passwordHash: demoPassword,
    },
  });

  for (const [index, item] of catalogue.entries()) {
    const image = `/images/products/set-${index + 1}.jpeg`;
    const slug = item.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    await prisma.product.upsert({
      where: { slug },
      update: { ...item, image, gallery: [image] },
      create: { ...item, slug, image, gallery: [image] },
    });
  }

  console.log(`Seeded ${catalogue.length} products.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
