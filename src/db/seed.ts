import "server-only";
import { sql } from "drizzle-orm";
import { db } from "@/db";
import {
  adminUsers,
  b2bInquiries,
  models,
  portfolioCampaigns,
  scoutingApplications,
  siteSettings,
  type ApplicationRecord,
  type CampaignRecord,
  type InquiryRecord,
  type ModelRecord,
} from "@/db/schema";
import { hashPassword } from "@/lib/auth";
import { px } from "@/lib/media";

let seedPromise: Promise<void> | null = null;

export const ROSTER = [
  {
    name: "Aarthi Venkatesh",
    slug: "aarthi-venkatesh",
    category: "Runway",
    location: "Chennai // Paris",
    bio: "Opened three debut couture shows in her first season. A measured, architectural walk and a face built for closing looks.",
    stats: { height: "179 cm", bust: "82 cm", waist: "60 cm", hips: "89 cm", shoe: "EU 40", hair: "Black", eyes: "Dark Brown" },
    featured: px(32982934),
    polaroid: px(30364581),
    gallery: [px(32982847), px(39409045), px(30703860), px(2723623)],
    polaroids: [px(30364581), px(35470105)],
    instagram: "@aarthi.vkt",
    isFeatured: true,
  },
  {
    name: "Meera Sundaram",
    slug: "meera-sundaram",
    category: "Editorial",
    location: "Kochi // Milan",
    bio: "A sculptural presence shot for independent editorials across Milan and Seoul. Specialises in high-contrast beauty close-ups.",
    stats: { height: "176 cm", bust: "81 cm", waist: "61 cm", hips: "88 cm", shoe: "EU 39", hair: "Dark Brown", eyes: "Hazel" },
    featured: px(35470105),
    polaroid: px(37043522),
    gallery: [px(31258229), px(32703557), px(2723623), px(30703860)],
    polaroids: [px(37043522), px(32982847)],
    instagram: "@meera.snd",
    isFeatured: true,
  },
  {
    name: "Ilhaam Rafeeq",
    slug: "ilhaam-rafeeq",
    category: "Commercial",
    location: "Bengaluru // Dubai",
    bio: "Commercial lead for five regional apparel houses. Warm, direct-to-camera energy with effortless catalogue stamina.",
    stats: { height: "174 cm", bust: "84 cm", waist: "64 cm", hips: "91 cm", shoe: "EU 40", hair: "Black", eyes: "Brown" },
    featured: px(31258229),
    polaroid: px(32703557),
    gallery: [px(37043522), px(39409045), px(32982934)],
    polaroids: [px(32703557)],
    instagram: "@ilhaam.r",
    isFeatured: false,
  },
  {
    name: "Nadia Okoye",
    slug: "nadia-okoye",
    category: "Runway",
    location: "Lagos // London",
    bio: "International board. Seven seasons of exclusive runway, with a signature long-limbed cadence engineered for closing walks.",
    stats: { height: "181 cm", bust: "80 cm", waist: "59 cm", hips: "88 cm", shoe: "EU 41", hair: "Black", eyes: "Black" },
    featured: px(987577),
    polaroid: px(17945059),
    gallery: [px(20387329), px(19892525), px(20437814)],
    polaroids: [px(17945059)],
    instagram: "@nadia.okoye",
    isFeatured: true,
  },
  {
    name: "Elif Demir",
    slug: "elif-demir",
    category: "Editorial",
    location: "Istanbul // Berlin",
    bio: "Tailoring specialist. Reads androgynous and severe on camera — frequently booked for monochrome studio stories.",
    stats: { height: "178 cm", bust: "83 cm", waist: "62 cm", hips: "90 cm", shoe: "EU 40", hair: "Brown", eyes: "Green" },
    featured: px(17945059),
    polaroid: px(19892525),
    gallery: [px(19222080), px(20437814), px(987577)],
    polaroids: [px(19892525)],
    instagram: "@elifdmr",
    isFeatured: false,
  },
  {
    name: "Rhea Kulkarni",
    slug: "rhea-kulkarni",
    category: "New Faces",
    location: "Hyderabad // Scouted 2026",
    bio: "Scouted in Hyderabad at seventeen. Raw, unpolished and already testing with three Mumbai-based editorial photographers.",
    stats: { height: "177 cm", bust: "80 cm", waist: "60 cm", hips: "87 cm", shoe: "EU 39", hair: "Black", eyes: "Dark Brown" },
    featured: px(37043522),
    polaroid: px(2723623),
    gallery: [px(30364581), px(32982934), px(35470105)],
    polaroids: [px(2723623)],
    instagram: "@rhea.klk",
    isFeatured: false,
  },
  {
    name: "Dev Anand Raj",
    slug: "dev-anand-raj",
    category: "Commercial",
    location: "Coimbatore // Singapore",
    bio: "Menswear and technical sportswear. Fast on set, exceptional with movement direction and repeat catalogue volume.",
    stats: { height: "186 cm", chest: "96 cm", waist: "78 cm", hips: "94 cm", shoe: "EU 43", hair: "Black", eyes: "Brown" },
    featured: px(26903333),
    polaroid: px(7779223, 1000, 1500),
    gallery: [px(7778887, 1000, 1500), px(9577608, 1000, 1500)],
    polaroids: [px(7779223, 1000, 1500)],
    instagram: "@devanandraj",
    isFeatured: false,
  },
  {
    name: "Sana Qureshi",
    slug: "sana-qureshi",
    category: "New Faces",
    location: "Mysuru // Development",
    bio: "In development. Striking bone structure and a quiet, unforced stillness that holds the frame without performance.",
    stats: { height: "175 cm", bust: "81 cm", waist: "61 cm", hips: "88 cm", shoe: "EU 39", hair: "Dark Brown", eyes: "Amber" },
    featured: px(33714925),
    polaroid: px(33852945),
    gallery: [px(19222080), px(9690414), px(20387329)],
    polaroids: [px(33852945)],
    instagram: "@sana.qrsh",
    isFeatured: true,
  },
  {
    name: "Tara Iyengar",
    slug: "tara-iyengar",
    category: "Editorial",
    location: "Pondicherry // New York",
    bio: "Fine-art editorial board. Movement-trained; regularly booked for long-form motion campaigns and jewellery stories.",
    stats: { height: "177 cm", bust: "82 cm", waist: "61 cm", hips: "89 cm", shoe: "EU 40", hair: "Black", eyes: "Brown" },
    featured: px(32703557),
    polaroid: px(39409045),
    gallery: [px(30703860), px(32982847), px(31258229)],
    polaroids: [px(39409045)],
    instagram: "@tara.iyengar",
    isFeatured: false,
  },
  {
    name: "Juno Park",
    slug: "juno-park",
    category: "Runway",
    location: "Seoul // Chennai",
    bio: "International exchange board. Precision walk, strong showroom fitting history across three continents.",
    stats: { height: "180 cm", bust: "80 cm", waist: "59 cm", hips: "87 cm", shoe: "EU 40", hair: "Black", eyes: "Dark Brown" },
    featured: px(20437814),
    polaroid: px(20387329),
    gallery: [px(9690414), px(19892525), px(987577)],
    polaroids: [px(20387329)],
    instagram: "@juno.pk",
    isFeatured: false,
  },
];

export const CAMPAIGNS = [
  {
    title: "Obsidian Season 04",
    clientBrand: "KAVI ATELIER",
    category: "Editorial",
    cover: px(9509647, 1600, 1000),
    video: "https://videos.pexels.com/video-files/3917526/3917526-uhd_4096_2160_25fps.mp4",
    summary: "A sixteen-page monochrome study on structure, shot across two days in a disused Chennai press house.",
    gallery: [px(1343522, 1600, 1000), px(9577608, 1600, 1000), px(31648380, 1600, 1000)],
    credits: { photographer: "R. Nandakumar", stylist: "Ira Fernandes", direction: "Huexe Creative", location: "Chennai, IN" },
  },
  {
    title: "Remote Catalogue — SS26",
    clientBrand: "NORTHBOUND APPAREL (UK)",
    category: "Remote Production",
    cover: px(7778887, 1600, 1000),
    video: "https://videos.pexels.com/video-files/7779784/7779784-uhd_4096_2160_25fps.mp4",
    summary: "412 SKUs, 9 shooting days, delivered end-to-end from India with live remote art direction from London.",
    gallery: [px(7779223, 1600, 1000), px(9577608, 1600, 1000)],
    credits: { photographer: "Huexe Studio Unit 2", stylist: "Priya Mathew", direction: "Remote / London", location: "Bengaluru, IN" },
  },
  {
    title: "Opening Ceremony Casting",
    clientBrand: "GULF FASHION WEEK",
    category: "Runway",
    cover: px(31648380, 1600, 1000),
    video: "https://videos.pexels.com/video-files/7779055/7779055-uhd_4096_2160_25fps.mp4",
    summary: "Curated and managed a 38-model lineup across six designers, including travel, fittings and backstage ops.",
    gallery: [px(1343522, 1600, 1000), px(9509647, 1600, 1000)],
    credits: { direction: "Huexe Casting", location: "Dubai, AE", talent: "38 models" },
  },
  {
    title: "Raw Faces Vol. 02",
    clientBrand: "HUEXE IN-HOUSE",
    category: "Lookbook",
    cover: px(9577608, 1600, 1000),
    video: "https://videos.pexels.com/video-files/8089121/8089121-uhd_4096_2160_25fps.mp4",
    summary: "Development lookbook for six new faces — no retouching, no styling, pure presence tests.",
    gallery: [px(4287637, 1600, 1000), px(7779223, 1600, 1000)],
    credits: { photographer: "Huexe Scouting Unit", direction: "Huexe Creative", location: "Mysuru, IN" },
  },
  {
    title: "Backstage: Monsoon Couture",
    clientBrand: "ANAI COUTURE",
    category: "Runway",
    cover: px(4287637, 1600, 1000),
    video: "https://videos.pexels.com/video-files/7779056/7779056-uhd_4096_2160_25fps.mp4",
    summary: "Full backstage choreography and model management for a 22-look couture presentation.",
    gallery: [px(1343522, 1600, 1000), px(4287635, 1600, 1000)],
    credits: { direction: "Huexe Production", location: "Kochi, IN", talent: "22 looks" },
  },
  {
    title: "Still Motion / Jewellery",
    clientBrand: "VELLORE & SONS",
    category: "Editorial",
    cover: px(1343522, 1600, 1000),
    video: "https://videos.pexels.com/video-files/3917526/3917526-uhd_4096_2160_25fps.mp4",
    summary: "Slow-motion campaign film and stills package for a heritage jewellery house entering European retail.",
    gallery: [px(9509647, 1600, 1000), px(7778887, 1600, 1000)],
    credits: { photographer: "L. Ravichandran", stylist: "Huexe Styling", direction: "Huexe Creative", location: "Madurai, IN" },
  },
];

/* ----------------- IN-MEMORY FALLBACK DATASETS ----------------- */

export const FALLBACK_MODELS: ModelRecord[] = ROSTER.map((entry, index) => ({
  id: `00000000-0000-0000-0000-${String(index + 1).padStart(12, "0")}`,
  name: entry.name,
  slug: entry.slug,
  category: entry.category,
  location: entry.location,
  bio: entry.bio,
  stats: entry.stats,
  featuredImage: entry.featured,
  hoverPolaroid: entry.polaroid,
  galleryImages: entry.gallery,
  polaroidImages: entry.polaroids,
  instagram: entry.instagram,
  isFeatured: entry.isFeatured,
  status: "published",
  sortOrder: index,
  createdAt: new Date("2026-01-01T00:00:00Z"),
}));

export const FALLBACK_CAMPAIGNS: CampaignRecord[] = CAMPAIGNS.map((campaign, index) => ({
  id: `00000000-0000-0000-0001-${String(index + 1).padStart(12, "0")}`,
  title: campaign.title,
  clientBrand: campaign.clientBrand,
  category: campaign.category,
  coverMediaUrl: campaign.cover,
  mediaType: "image",
  previewVideoUrl: campaign.video,
  summary: campaign.summary,
  gallery: campaign.gallery,
  credits: campaign.credits,
  status: "published",
  publishedAt: new Date(Date.now() - index * 86400000),
}));

export const FALLBACK_APPLICATIONS: ApplicationRecord[] = [
  {
    id: "00000000-0000-0000-0002-000000000001",
    fullName: "Lakshmi Narayanan",
    email: "lakshmi.n@example.com",
    phone: "+91 98840 11223",
    instagram: "@lakshmi.nry",
    location: "Madurai, IN",
    age: 19,
    measurements: { heightCm: "178", heightFt: "5'10\"", bust: "81", waist: "60", hips: "88", shoe: "EU 39" },
    digitalsUrls: {},
    status: "Shortlisted",
    internalNotes: "Strong bone structure. Book a test with Unit 2 in Chennai.",
    submittedAt: new Date("2026-03-01T00:00:00Z"),
  },
  {
    id: "00000000-0000-0000-0002-000000000002",
    fullName: "Fatima Zahra",
    email: "fatima.z@example.com",
    phone: "+91 90031 55412",
    instagram: "@ftmzhr",
    location: "Kochi, IN",
    age: 22,
    measurements: { heightCm: "173", heightFt: "5'8\"", bust: "84", waist: "63", hips: "90", shoe: "EU 40" },
    digitalsUrls: {},
    status: "Pending Review",
    internalNotes: null,
    submittedAt: new Date("2026-03-02T00:00:00Z"),
  },
  {
    id: "00000000-0000-0000-0002-000000000003",
    fullName: "Arjun Pillai",
    email: "arjun.pillai@example.com",
    phone: "+91 73058 99210",
    instagram: "@arjun.plai",
    location: "Trivandrum, IN",
    age: 24,
    measurements: { heightCm: "187", heightFt: "6'2\"", bust: "97", waist: "79", hips: "95", shoe: "EU 44" },
    digitalsUrls: {},
    status: "Contacted",
    internalNotes: "Available for Gulf Fashion Week fittings in March.",
    submittedAt: new Date("2026-03-03T00:00:00Z"),
  },
];

export const FALLBACK_INQUIRIES: InquiryRecord[] = [
  {
    id: "00000000-0000-0000-0003-000000000001",
    companyName: "Northbound Apparel",
    contactName: "Helena Voss",
    email: "helena@northbound.co.uk",
    serviceType: "Turnkey Remote Production",
    requestedModels: [],
    projectBrief: "AW26 catalogue, approx 380 SKUs. Need full remote execution from India with UK art direction.",
    status: "In Discussion",
    createdAt: new Date("2026-03-01T00:00:00Z"),
  },
  {
    id: "00000000-0000-0000-0003-000000000002",
    companyName: "Gulf Fashion Week",
    contactName: "Omar Haddad",
    email: "casting@gulffashionweek.ae",
    serviceType: "Event Casting",
    requestedModels: [],
    projectBrief: "Looking for a 40-model lineup across six designers for the October edition.",
    status: "New",
    createdAt: new Date("2026-03-02T00:00:00Z"),
  },
];

/* ----------------- SEED EXECUTION ----------------- */

async function runSeed() {
  const adminEmail = (process.env.ADMIN_EMAIL || "admin@huexe.co").trim().toLowerCase();
  const adminPassword = process.env.ADMIN_PASSWORD || "Huexe#Admin2026!Global";

  // 1. Ensure production admin exists with owner role
  await db
    .insert(adminUsers)
    .values({
      email: adminEmail,
      name: "Huexe Executive Studio",
      role: "owner",
      passwordHash: hashPassword(adminPassword),
    })
    .onConflictDoUpdate({
      target: adminUsers.email,
      set: {
        passwordHash: hashPassword(adminPassword),
        role: "owner",
      },
    });

  // 2. Insert roster models idempotently by unique slug
  for (let index = 0; index < ROSTER.length; index++) {
    const entry = ROSTER[index];
    await db
      .insert(models)
      .values({
        name: entry.name,
        slug: entry.slug,
        category: entry.category,
        location: entry.location,
        bio: entry.bio,
        stats: entry.stats,
        featuredImage: entry.featured,
        hoverPolaroid: entry.polaroid,
        galleryImages: entry.gallery,
        polaroidImages: entry.polaroids,
        instagram: entry.instagram,
        isFeatured: entry.isFeatured,
        status: "published",
        sortOrder: index,
      })
      .onConflictDoNothing({ target: models.slug });
  }

  // 3. Insert portfolio campaigns if table is unseeded
  const existingCampaigns = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(portfolioCampaigns);
  if (Number(existingCampaigns[0]?.count ?? 0) === 0) {
    await db.insert(portfolioCampaigns).values(
      CAMPAIGNS.map((campaign) => ({
        title: campaign.title,
        clientBrand: campaign.clientBrand,
        category: campaign.category,
        coverMediaUrl: campaign.cover,
        mediaType: "image",
        previewVideoUrl: campaign.video,
        summary: campaign.summary,
        gallery: campaign.gallery,
        credits: campaign.credits,
        status: "published",
      })),
    );
  }

  // 4. Insert scouting applications if empty
  const existingApps = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(scoutingApplications);
  if (Number(existingApps[0]?.count ?? 0) === 0) {
    await db.insert(scoutingApplications).values([
      {
        fullName: "Lakshmi Narayanan",
        email: "lakshmi.n@example.com",
        phone: "+91 98840 11223",
        instagram: "@lakshmi.nry",
        location: "Madurai, IN",
        age: 19,
        measurements: { heightCm: "178", heightFt: "5'10\"", bust: "81", waist: "60", hips: "88", shoe: "EU 39" },
        digitalsUrls: {},
        status: "Shortlisted",
        internalNotes: "Strong bone structure. Book a test with Unit 2 in Chennai.",
      },
      {
        fullName: "Fatima Zahra",
        email: "fatima.z@example.com",
        phone: "+91 90031 55412",
        instagram: "@ftmzhr",
        location: "Kochi, IN",
        age: 22,
        measurements: { heightCm: "173", heightFt: "5'8\"", bust: "84", waist: "63", hips: "90", shoe: "EU 40" },
        digitalsUrls: {},
        status: "Pending Review",
      },
      {
        fullName: "Arjun Pillai",
        email: "arjun.pillai@example.com",
        phone: "+91 73058 99210",
        instagram: "@arjun.plai",
        location: "Trivandrum, IN",
        age: 24,
        measurements: { heightCm: "187", heightFt: "6'2\"", bust: "97", waist: "79", hips: "95", shoe: "EU 44" },
        digitalsUrls: {},
        status: "Contacted",
        internalNotes: "Available for Gulf Fashion Week fittings in March.",
      },
    ]);
  }

  // 5. Insert B2B inquiries if empty
  const existingInquiries = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(b2bInquiries);
  if (Number(existingInquiries[0]?.count ?? 0) === 0) {
    await db.insert(b2bInquiries).values([
      {
        companyName: "Northbound Apparel",
        contactName: "Helena Voss",
        email: "helena@northbound.co.uk",
        serviceType: "Turnkey Remote Production",
        requestedModels: [],
        projectBrief: "AW26 catalogue, approx 380 SKUs. Need full remote execution from India with UK art direction.",
        status: "In Discussion",
      },
      {
        companyName: "Gulf Fashion Week",
        contactName: "Omar Haddad",
        email: "casting@gulffashionweek.ae",
        serviceType: "Event Casting",
        requestedModels: [],
        projectBrief: "Looking for a 40-model lineup across six designers for the October edition.",
        status: "New",
      },
    ]);
  }

  // 6. Insert Default Site Settings if empty
  const existingSettings = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(siteSettings);
  if (Number(existingSettings[0]?.count ?? 0) === 0) {
    await db.insert(siteSettings).values([
      { key: "seo_gtag_id", value: "" },
      { key: "seo_ga_id", value: "" },
      { key: "seo_clarity_id", value: "" },
      { key: "social_instagram", value: "https://instagram.com/huexe" },
      { key: "social_twitter", value: "https://x.com/huexe" },
      { key: "social_linkedin", value: "https://linkedin.com/company/huexe" },
      { key: "social_tiktok", value: "https://tiktok.com/@huexe" },
      { key: "social_youtube", value: "https://youtube.com/@huexe" },
      { key: "whatsapp_number", value: "+919876543210" },
      { key: "whatsapp_message", value: "Hello Manasa, I would like to inquire about booking & casting at HUEXE." },
      { key: "resend_api_key", value: "" },
      { key: "resend_from_email", value: "HUEXE Studio <onboarding@resend.dev>" },
      { key: "admin_notification_email", value: "studio@huexe.co" },
      { key: "cloudinary_cloud_name", value: "" },
      { key: "cloudinary_api_key", value: "" },
      { key: "cloudinary_api_secret", value: "" },
      { key: "cloudinary_folder", value: "huexe-production" },
    ]);
  }
}

export async function ensureSeeded() {
  if (!seedPromise) {
    seedPromise = runSeed().catch((error) => {
      seedPromise = null;
      throw error;
    });
  }
  try {
    await seedPromise;
  } catch {
    /* database may not be migrated yet or offline — pages fall back cleanly */
  }
}
