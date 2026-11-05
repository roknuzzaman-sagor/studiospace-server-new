require('dotenv').config();
const bcrypt = require('bcryptjs');
const mongoose = require('mongoose');
const connectDB = require('./config/db');
const User = require('./models/User');
const Studio = require('./models/Studio');
const Review = require('./models/Review');

const HOST = {
  name: 'Elena Vasquez',
  email: 'host@studiospace.dev',
  password: 'Host@123456',
  photoURL:
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
};

const STUDIOS = [
  {
    title: 'Northlight Cyc Wall — Daylight Photo Bay',
    category: 'Photo Studio',
    hourlyRate: 85,
    securityDeposit: 200,
    maxCapacity: 12,
    location: 'Greenpoint, Brooklyn, NY',
    imageURL:
      'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1574717024653-61fd2cf4d44d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Cyc Wall',
      'Natural Light',
      'C-Stands',
      'Makeup Station',
      'Freight Elevator',
      'Free Wi-Fi',
    ],
    overview:
      'A 24-foot seamless white cyclorama with 14-foot north-facing windows for clean, wraparound daylight. Grip package, rolling carts and a client lounge with a monitor feed from the shooting floor. Ideal for fashion, product and editorial work.',
  },
  {
    title: 'Stage 9 — Cinema Sound Stage',
    category: 'Film Stage',
    hourlyRate: 145,
    securityDeposit: 750,
    maxCapacity: 30,
    location: 'Astoria, Queens, NY',
    imageURL:
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1485846234645-a62644f84728?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Blackout Blinds',
      'Soundproofing',
      'Freight Elevator',
      'Parking',
      '24/7 Access',
      'Client Lounge',
    ],
    overview:
      'A 4,800 sq ft blackout stage with a 20 ft lighting grid, dolly track and drive-in access. Treated for clean production audio with a dedicated quiet zone for interviews and dialogue scenes.',
  },
  {
    title: 'The Green Room — Broadcast Podcast Lounge',
    category: 'Podcast Lounge',
    hourlyRate: 45,
    securityDeposit: 100,
    maxCapacity: 6,
    location: 'Williamsburg, Brooklyn, NY',
    imageURL:
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1590602847861-f357a9332bbc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Podcast Mics',
      'Soundproofing',
      '4K Camera',
      'Free Wi-Fi',
      'Air Conditioning',
    ],
    overview:
      'A fully treated four-seat podcast set with broadcast dynamic mics, a Rodecaster Pro II and two locked-off 4K cameras for video episodes. Warm walnut panelling, practical lighting and a backdrop you can brand in minutes.',
  },
  {
    title: 'Analog Room — Tracking & Mixing Suite',
    category: 'Music Suite',
    hourlyRate: 70,
    securityDeposit: 300,
    maxCapacity: 8,
    location: 'Bushwick, Brooklyn, NY',
    imageURL:
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'PA System',
      'Drum Kit',
      'Soundproofing',
      'Kitchenette',
      'Free Wi-Fi',
      '24/7 Access',
    ],
    overview:
      'A hybrid tracking room built around a 32-channel analog console and outboard chain, with a separate iso booth for vocals and amps. Engineer add-ons available, or bring your own and self-produce.',
  },
  {
    title: 'Clay & Canvas — Daylight Art Workshop',
    category: 'Workshop',
    hourlyRate: 38,
    securityDeposit: 75,
    maxCapacity: 16,
    location: 'Ridgewood, Queens, NY',
    imageURL:
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Natural Light',
      'Kitchenette',
      'Free Wi-Fi',
      'Parking',
      'Air Conditioning',
    ],
    overview:
      'Sixteen easels, two pottery wheels and long communal benches under skylights. Sink stations, drying racks and a wipe-clean floor make this the easiest room in the city to teach a class in — and to clean up after.',
  },
  {
    title: 'Golden Hour — Rooftop-Adjacent Photo Loft',
    category: 'Photo Studio',
    hourlyRate: 62,
    securityDeposit: 150,
    maxCapacity: 10,
    location: 'LIC, Queens, NY',
    imageURL:
      'https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1567443024551-f3e3cc2be870?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Natural Light',
      'Blackout Blinds',
      'C-Stands',
      'Editing Suite',
      'Free Wi-Fi',
      'Parking',
    ],
    overview:
      'Corner windows on three sides throw warm directional light from 4pm until sunset — hence the name. White oak floors, a movable white wall and an on-site editing bay for same-day selects.',
  },
  {
    title: 'Blackbox — Narrative Film Stage',
    category: 'Film Stage',
    hourlyRate: 120,
    securityDeposit: 600,
    maxCapacity: 25,
    location: 'Sunset Park, Brooklyn, NY',
    imageURL:
      'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1478720568477-152d9b164e26?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Green Screen',
      'Blackout Blinds',
      'Soundproofing',
      'Freight Elevator',
      'Parking',
      '24/7 Access',
    ],
    overview:
      'A true blackbox with 18 ft of hard green screen, cyc-ready floor paint and a full grid package. Production office, client monitors and a load-in dock that fits a box truck.',
  },
  {
    title: 'Tone Loft — Vocal & Podcast Hybrid',
    category: 'Podcast Lounge',
    hourlyRate: 52,
    securityDeposit: 120,
    maxCapacity: 5,
    location: 'Fort Greene, Brooklyn, NY',
    imageURL:
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1478737270239-2f02b77fc618?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1589903308904-1010c2294adc?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Podcast Mics',
      'Soundproofing',
      '4K Camera',
      'Air Conditioning',
      'Free Wi-Fi',
    ],
    overview:
      'Three-mic roundtable setup with an acoustically treated booth, key light and a soft-focus camera for vertical clips. Record audio and video in one pass with a push-button stream deck preset.',
  },
  {
    title: 'The Rehearsal — Band Suite with Drum Room',
    category: 'Music Suite',
    hourlyRate: 55,
    securityDeposit: 200,
    maxCapacity: 12,
    location: 'Gowanus, Brooklyn, NY',
    imageURL:
      'https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1519508234439-4f23643125c1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'PA System',
      'Drum Kit',
      'Soundproofing',
      'Parking',
      '24/7 Access',
      'Kitchenette',
    ],
    overview:
      'A loud-friendly rehearsal room with an isolated drum enclosure, backline amps and a 1,200W PA. Hourly or block rates — perfect for pre-tour rehearsals and live session recordings.',
  },
  {
    title: 'Maker Bench — Print & Ceramics Workshop',
    category: 'Workshop',
    hourlyRate: 42,
    securityDeposit: 100,
    maxCapacity: 14,
    location: 'Bed-Stuy, Brooklyn, NY',
    imageURL:
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1503602642458-232111445657?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Natural Light',
      'Kitchenette',
      'Free Wi-Fi',
      'Air Conditioning',
      'Parking',
    ],
    overview:
      'Screen-printing carousels, a slab roller and a ventilated kiln area share one big open room. Washout sinks and a photo-emulsion darkroom round out the setup for print and clay workshops alike.',
  },
  {
    title: 'Softbox Studio — E-Commerce Product Bay',
    category: 'Photo Studio',
    hourlyRate: 48,
    securityDeposit: 120,
    maxCapacity: 8,
    location: 'Chelsea, Manhattan, NY',
    imageURL:
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598653222000-6b7b7a552625?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'Blackout Blinds',
      'Editing Suite',
      'C-Stands',
      'Makeup Station',
      'Free Wi-Fi',
    ],
    overview:
      'A controlled-light product bay with a 10 ft shooting table, tethering station and motorized seamless rolls in six colors. Built for high-volume catalog work with fast turnaround.',
  },
  {
    title: 'Vinyl Room — Analog Listening & Recording',
    category: 'Music Suite',
    hourlyRate: 66,
    securityDeposit: 250,
    maxCapacity: 9,
    location: 'Astoria, Queens, NY',
    imageURL:
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
    gallery: [
      'https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=1200&q=80',
    ],
    amenities: [
      'PA System',
      'Soundproofing',
      'Natural Light',
      'Kitchenette',
      'Free Wi-Fi',
    ],
    overview:
      'Warm wood treatment, a vintage upright piano and a tape machine that still runs. Set up for full-band tracking or an intimate listening session with clients and collaborators.',
  },
];

const REVIEW_POOL = [
  {
    authorName: 'Amara Okafor',
    authorAvatar:
      'https://images.unsplash.com/photo-1531123897727-8f129e1688ce?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'Spotless space and the host had the grip package pre-racked before we arrived. We wrapped an hour early because everything just worked.',
  },
  {
    authorName: 'Diego Marín',
    authorAvatar:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'Load-in was easy, the room was quiet, and the monitor feed saved our client review. Already rebooked for next month.',
  },
  {
    authorName: 'Priya Raghavan',
    authorAvatar:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80',
    rating: 4,
    comment:
      'Great value for the neighborhood. The lighting grid is well maintained and the host answered every question within minutes.',
  },
  {
    authorName: 'Noah Bennett',
    authorAvatar:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'We shot a full lookbook here in one afternoon. Clean cyc, strong air conditioning and plenty of room for a small crew.',
  },
  {
    authorName: 'Lena Hoffmann',
    authorAvatar:
      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    rating: 4,
    comment:
      'Accurate listing and a smooth check-in. Parking took a few minutes to find, but the space itself was exactly as photographed.',
  },
  {
    authorName: 'Marcus Lee',
    authorAvatar:
      'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=200&q=80',
    rating: 5,
    comment:
      'The acoustics are excellent. We tracked vocals and a full drum kit without any bleed issues, and the engineer add-on was worth it.',
  },
];

async function ensureHost() {
  const existing = await User.findOne({ email: HOST.email });
  if (existing) {
    console.log(`Host already exists: ${HOST.email}`);
    return existing;
  }

  const password = await bcrypt.hash(HOST.password, 10);
  const user = await User.create({
    name: HOST.name,
    email: HOST.email,
    photoURL: HOST.photoURL,
    password,
    provider: 'local',
  });
  console.log(`Created host: ${HOST.email}`);
  return user;
}

async function seedStudios(host) {
  const ids = [];

  for (const studio of STUDIOS) {
    const saved = await Studio.findOneAndUpdate(
      { title: studio.title },
      {
        $setOnInsert: {
          ...studio,
          ownerEmail: host.email,
          ownerName: host.name,
          rating: 0,
          reviewCount: 0,
        },
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    ids.push(saved._id);
    console.log(`Studio ready: ${saved.title}`);
  }

  return ids;
}

async function seedReviews(studioIds) {
  for (const [studioIndex, studioId] of studioIds.entries()) {
    for (let offset = 0; offset < 3; offset += 1) {
      const review = REVIEW_POOL[(studioIndex + offset) % REVIEW_POOL.length];
      const reviewerEmail = `seed.reviewer.${offset + 1}@studiospace.dev`;

      await Review.findOneAndUpdate(
        { studioId, userEmail: reviewerEmail },
        {
          $setOnInsert: {
            studioId,
            userEmail: reviewerEmail,
            authorName: review.authorName,
            authorAvatar: review.authorAvatar,
            rating: review.rating,
            comment: review.comment,
          },
        },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
    }

    const stats = await Review.aggregate([
      { $match: { studioId } },
      {
        $group: {
          _id: null,
          rating: { $avg: '$rating' },
          reviewCount: { $sum: 1 },
        },
      },
    ]);

    const summary = stats[0];
    await Studio.findByIdAndUpdate(studioId, {
      rating: summary ? Math.round(summary.rating * 10) / 10 : 0,
      reviewCount: summary ? summary.reviewCount : 0,
    });
  }

  console.log(`Seeded reviews for ${studioIds.length} studios.`);
}

async function removePlaceholderStudios() {
  const result = await Studio.deleteMany({
    $or: [{ title: 'photoshop' }, { overview: 'dgdgdg' }],
  });

  if (result.deletedCount) {
    console.log(`Removed ${result.deletedCount} placeholder studio(s).`);
  }
}

async function main() {
  await connectDB();

  await removePlaceholderStudios();
  const host = await ensureHost();
  const studioIds = await seedStudios(host);
  await seedReviews(studioIds);

  console.log('\nSeed complete.');
  console.log(`Database: ${mongoose.connection.name}`);
  console.log(`Host login: ${HOST.email} / ${HOST.password}`);
}

main()
  .catch((error) => {
    console.error('Seed failed:', error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });
