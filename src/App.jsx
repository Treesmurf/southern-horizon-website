import { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { doc, setDoc } from "firebase/firestore";


// ═══ LOGO (SVG — scales infinitely, premium feel) ═══
const SHCoLogo = ({ size = 44, light = false }) => (
  <img 
    src="/shco-logo.png" 
    alt="Southern Horizon Co." 
    style={{
      width: size, height: size, borderRadius: "50%", 
      flexShrink: 0, objectFit: "cover",
      filter: light ? "brightness(0) invert(1)" : "none"
    }}
  />
);

// ═══ DESTINATION IMAGES — Auto-fetched from Wikipedia at runtime ═══
// Each key maps to a Wikipedia article. The site fetches the main image of each
// article on page load via Wikipedia's public API, guaranteeing the image
// actually matches the destination. Fallback URLs kick in only if the fetch fails.
const WIKI_ARTICLES = {
  hero: "Whitehaven_Beach",
  kgari: "Lake_McKenzie",
  "tropical-north": "Daintree_National_Park",
  whitsundays: "Whitsunday_Island",
  "capricorn-coast": "Town_of_1770",
  "byron-bay": "Cape_Byron",
  "stockton-beach": "Stockton_Beach",
  "coastal-explorer": "Bruce_Highway",
  "outback-taster": "Longreach,_Queensland",
  "carnarvon-gorge": "Carnarvon_National_Park",
  outback: "Lark_Quarry_Dinosaur_Trackways",
  custom: "Queensland",
};

// Fallback URLs — used only if Wikipedia fetch fails
const IMAGES_FALLBACK = {
  hero: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1800&q=85&auto=format&fit=crop",
  kgari: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=1200&q=80&auto=format&fit=crop",
  "tropical-north": "https://images.unsplash.com/photo-1552733407-5d5c46c3bb3b?w=1200&q=80&auto=format&fit=crop",
  whitsundays: "https://images.unsplash.com/photo-1589802829985-817e51171b92?w=1200&q=80&auto=format&fit=crop",
  "capricorn-coast": "https://images.unsplash.com/photo-1566024287286-457247b70310?w=1200&q=80&auto=format&fit=crop",
  "byron-bay": "https://images.unsplash.com/photo-1493558103817-58b2924bce98?w=1200&q=80&auto=format&fit=crop",
  "stockton-beach": "https://images.unsplash.com/photo-1516638261969-1c2fc6709f92?w=1200&q=80&auto=format&fit=crop",
  "coastal-explorer": "https://images.unsplash.com/photo-1533105079780-92b9be482077?w=1200&q=80&auto=format&fit=crop",
  "outback-taster": "https://images.unsplash.com/photo-1516815231560-8f41ec531527?w=1200&q=80&auto=format&fit=crop",
  "carnarvon-gorge": "https://images.unsplash.com/photo-1628605239057-a0b7b3e7e6ce?w=1200&q=80&auto=format&fit=crop",
  outback: "https://images.unsplash.com/photo-1514119412350-e174d90d280e?w=1200&q=80&auto=format&fit=crop",
  custom: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?w=1200&q=80&auto=format&fit=crop",
  vehicle: "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=1200&q=80&auto=format&fit=crop",
  accommodation: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80&auto=format&fit=crop",
  route: "https://images.unsplash.com/photo-1601035593569-a6f41fe37a6e?w=1200&q=80&auto=format&fit=crop",
};


const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "experience", label: "The Experience" },
  { id: "packages", label: "Packages" },
  { id: "vehicle", label: "The Vehicle" },
  { id: "itinerary", label: "Plan Your Trip" },
  { id: "special-needs", label: "Requirements" },
  { id: "faq", label: "FAQs" },
  { id: "about", label: "Meet Us" },
  { id: "enquiry", label: "Enquire" },
];

const FAQ_DATA = [
  {
    category: "Luggage & Packing",
    items: [
      { q: "How much luggage can I bring?", a: "The full boot is free — each passenger gets one soft bag, plus day packs at your feet. Plenty of room for everything you need." },
      { q: "What size bags?", a: "Soft duffel bags only — no hard-shell suitcases. Max 65cm × 40cm × 25cm (roughly 60–65L), one per passenger. A 65L duffel handles two weeks easily — swimwear and sunscreen on Monday, boots and layers by Friday." },
      { q: "What should I pack?", a: "Pack for variety — that's the beauty of Australia. Swimwear, reef-safe sunscreen, a light rain jacket for the tropics, plus layers and closed shoes for cooler outback evenings. Hat, sunnies, insect repellent, and a camera are essentials everywhere. Leave formal wear and heavy luggage at home." },
    ],
  },
  {
    category: "The Vehicle",
    items: [
      { q: "What vehicle will I be driving?", a: "A Lexus LX500d Overtrail — twin-turbo V6 diesel, full-time 4WD, Mark Levinson premium audio, and every luxury feature Lexus makes. It's equally at home cruising the coast to Cairns, crossing K'gari's beaches, or winding through outback Queensland." },
      { q: "Do I need 4WD experience?", a: "Not at all. The LX500d makes off-road touring accessible with advanced traction control and terrain management. We provide a comprehensive vehicle briefing covering beach driving, sand, and unsealed roads before you depart." },
      { q: "Is there phone coverage and internet?", a: "We provide Starlink satellite internet and a backup smartphone with Telstra SIM in the glovebox for emergencies. You'll stay connected from the Daintree Rainforest to the Simpson Desert — and everywhere in between." },
    ],
  },
  {
    category: "What's Included",
    items: [
      { q: "What's included in the daily rate?", a: "Everything. The $1,500 daily rate covers the Lexus LX500d Overtrail, insurance, curated luxury accommodation at every stop with breakfast included where available, a fleet fuel card (plus backup Visa for remote locations), Starlink satellite internet, backup phone with Telstra SIM for emergencies, your fully curated route with a dining guide of our favourite restaurants, vehicle briefing, and personal concierge support. One rate, everything included." },
      { q: "How does accommodation work?", a: "Luxury accommodation is included in your $1,500 daily rate. We curate handpicked options at every stop — outback stations, boutique lodges, coastal retreats, eco-lodges. You pick what appeals, we book everything. No research, no chasing availability, no extra charges." },
      { q: "Can I upgrade to ultra-luxury accommodation?", a: "Absolutely. Your $1,500 daily rate covers quality curated accommodation at every stop. If you'd like to upgrade to ultra-luxury properties — places like Silky Oaks Lodge in the Daintree, Elements of Byron, or Spicers Peak Lodge — we can arrange that as a supplement. Just mention it during your consultation and we'll present upgrade options alongside the standard inclusions at the relevant stops. You only pay the difference for the nights you choose to upgrade." },
      { q: "How does fuel and dining work?", a: "Your Lexus LX comes with a fleet fuel card that works at BP, Shell, and Ampol stations — roughly 95% of fuel stops across Australia. For remote locations like K'gari (Fraser Island) where fleet cards aren't accepted, we provide a backup pre-paid Visa. Breakfast is included where available at your accommodation. For dinner, we provide a curated dining guide with our handpicked restaurant recommendations at every stop — dinner is at your own expense so you can choose exactly where and what you feel like each evening." },
      { q: "Is there a security bond?", a: "Yes — a tiered bond system varies by package and configuration. Full details come with your booking enquiry. The bond is fully refundable subject to standard return conditions." },
    ],
  },
  {
    category: "Booking & Logistics",
    items: [
      { q: "How long can I hire for?", a: "Our signature touring packages are curated at 21 days — long enough to genuinely experience every stop, not just drive through. K'gari and Tropical North run 5–10 days for a more focused experience. We also offer 7-day regional packages — Whitsundays, Outback Taster, Capricorn Coast, Carnarvon Gorge, Byron Bay, and Stockton Beach. Want something shorter, longer, or completely custom? That's what the Custom Journey is for — minimum 3 days, no maximum." },
      { q: "Why is there a passenger limit?", a: "For comfort and safety. We cap at 4 adults or 2 adults and 3 children per trip. Outback and remote coastal touring involves long distances, variable road conditions, and limited access to services. Fewer passengers means more space in the cabin, better weight distribution for the vehicle, and a safer, more comfortable experience for everyone — especially on sand, corrugations, and unsealed roads." },
      { q: "Where do I pick up?", a: "You don't — we deliver to you. Your Lexus LX is brought directly to your arrival airport, hotel, or accommodation — Brisbane, Gold Coast, Sunshine Coast (Maroochydore), Cairns, or Sydney depending on your package. Flying into Maroochydore? You could be at Rainbow Beach by lunchtime. Landing at Gold Coast? Head straight for Byron Bay or north to K'gari. Flying into Cairns for the Tropical North? Your Lexus LX is waiting when you land. Already in Brisbane? We can deliver to your hotel, or you're welcome to collect from our yard in Banyo." },
      { q: "Can I drive on the beach?", a: "Absolutely — beach driving is part of the experience on K'gari and other coastal routes. Sand driving, tyre pressures, tide awareness, and recovery are all covered in your briefing. Required permits are arranged as part of your package." },
      { q: "How much driving is involved?", a: "We design every day with a maximum of four hours behind the wheel. Stops are chosen because they're worth seeing — not just places to sleep. Our 21-day signature packages give you genuine dwell time at every stop so you can explore, relax, and actually experience each destination. No rushed itineraries, no bus-tour pace." },
      { q: "What if something goes wrong?", a: "24/7 phone support, Starlink satellite internet, backup emergency phone with Telstra SIM, and UHF radio. Emergency procedures and contacts are provided in your pre-departure briefing." },
    ],
  },
];

const PACKAGES = [
  {
    id: "kgari",
    name: "K'gari Experience",
    config: "Touring",
    duration: "5–7 Days",
    guests: "2–4 Guests",
    route: "Brisbane → K'gari (Fraser Island)",
    tagline: "The world's largest sand island by Lexus LX",
    description: "Focused adventure on an iconic destination. Drive 75 Mile Beach, swim crystal-clear perched lakes, explore rainforest growing in sand. Stay at island resorts and coastal retreats. Add Hervey Bay for whale watching or extend to a full week at island pace.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "K'gari permits + barge", "Beach driving briefing", "Luxury curated accommodation", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Rainbow Beach & Inskip Point", day: "Day 1", type: "transit", desc: "Drive north from Brisbane (3–4hrs). Air down tyres at Inskip Point and catch the barge across to K'gari's southern tip.", stay: "Rainbow Beach accommodation", eat: "Rainbow Beach Surf Club before crossing", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Southern K'gari", day: "Days 2–3", type: "highlight", desc: "Lake McKenzie — arguably Australia's most beautiful freshwater lake. Crystal clear water, white silica sand. Central Station rainforest walk among towering satinay trees. Two nights to soak it in.", stay: "Kingfisher Bay Resort or Eurong Beach Resort", eat: "Resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "75 Mile Beach & East Coast", day: "Day 4", type: "highlight", desc: "Drive the sand highway up the east coast. Eli Creek (float down the crystal creek), the Maheno Shipwreck, and the Pinnacles coloured sand cliffs.", stay: "Eurong Beach Resort or Sailfish on Fraser", eat: "Resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Northern K'gari", day: "Day 5", type: "highlight", desc: "Indian Head — climb the headland for whale and dolphin spotting (seasonal). Champagne Pools — natural rock pools with waves crashing over. Lake Wabby — a perched lake slowly swallowed by a sand blow.", stay: "Orchid Beach retreats", eat: "Local options or resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Hervey Bay (optional extension)", day: "Days 6–7", type: "stop", desc: "Barge back to the mainland via River Heads. Hervey Bay — whale watching capital of Australia (Jul–Nov), Urangan Pier, relaxed waterfront town. A slower finish before heading south.", stay: "Hervey Bay waterfront accommodation", eat: "The Black Dog Café, Coast Restaurant", source: "visitherveybaay.com.au" },
    ],
  },
  {
    id: "tropical-north",
    name: "Tropical North",
    config: "Touring",
    duration: "7–10 Days",
    guests: "2–4 Guests",
    route: "Cairns · Daintree · Cape Tribulation",
    tagline: "Where the rainforest meets the reef",
    description: "Start right in the tropics — we deliver your Lexus LX to Cairns Airport so you skip the drive north entirely. Explore Mossman Gorge, the Daintree, Cape Tribulation, Atherton Tablelands, and the reef. Select from our curated eco-lodges and retreats at each stop.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Cairns airport delivery included", "Luxury curated accommodation", "MAXTRAX + recovery kit", "Tropical route guide", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Cairns", day: "Day 1", type: "transit", desc: "Your starting point. We deliver your Lexus LX to Cairns Airport and fly in to do your handover personally — full vehicle briefing, keys in your hand.", stay: "Cairns or Palm Cove accommodation", eat: "Prawn Star, Salt House, Cairns Night Markets", source: "ellisbeach.com.au" },
      { name: "Port Douglas & Mossman Gorge", day: "Days 2–3", type: "highlight", desc: "Four Mile Beach, the Sunday markets, gateway to the Low Isles and outer reef. Mossman Gorge — Indigenous-guided Dreamtime walks, crystal-clear swimming hole among granite boulders.", stay: "Port Douglas boutique accommodation", eat: "Zinc, Salsa Bar & Grill, Sunday markets for tropical fruit", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Daintree River & Rainforest", day: "Days 4–5", type: "highlight", desc: "Cable ferry across the Daintree River into the world's oldest rainforest. Croc-spotting river cruises, Daintree Discovery Centre canopy walk, hidden swimming holes.", stay: "Daintree Eco Lodge or Silky Oaks Lodge", eat: "Daintree Ice Cream Company, Daintree Tea Company", source: "daintreeriverview.com.au" },
      { name: "Cape Tribulation", day: "Days 5–6", type: "highlight", desc: "Where the rainforest meets the reef — literally. Swim off the beach with the canopy at your back. Night walks for wildlife. Dubuji Boardwalk through the mangroves.", stay: "Cape Trib Beach House or Ferntree Rainforest Lodge", eat: "Whet Café Cape Tribulation, local dining", source: "QPWS — book via qld.gov.au/camping (closed wet season Dec–Apr)" },
      { name: "Atherton Tablelands", day: "Days 7–8", type: "stop", desc: "Head inland and up. Curtain Fig Tree, Millaa Millaa Falls, Lake Eacham crater lake, Yungaburra platypus viewing at dawn, Millstream Falls — widest single-drop waterfall in Australia.", stay: "Yungaburra or Atherton Tablelands accommodation", eat: "Nick's Swiss-Italian Restaurant Yungaburra, Gallo Dairyland", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Cairns (return)", day: "Days 9–10", type: "highlight", desc: "Return to Cairns for the finale. Great Barrier Reef day trip. Kuranda Scenic Railway. Night markets, Esplanade lagoon. Drop the keys and fly home.", stay: "Cairns or Palm Cove accommodation", eat: "Ochre Restaurant, Cairns Night Markets", source: "cairns.com.au" },
      { name: "Cooktown (optional extension)", day: "+2–3 Days", type: "stop", desc: "For the adventurous — continue north on the Bloomfield Track (4WD essential, subject to seasonal closure Dec–Apr). Remote beaches, Indigenous rock art at Split Rock. Discussed during your booking consultation.", stay: "Cooktown accommodation", eat: "The Bowls Club (surprisingly good), Cooktown RSL", source: "QPWS / cooktowncaravanpark.com.au" },
    ],
  },
  {
    id: "whitsundays",
    name: "Whitsundays",
    config: "Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Proserpine / Mackay · Airlie Beach · Cape Hillsborough",
    tagline: "Islands, reef, and kangaroos on the beach",
    description: "Fly into Proserpine or Mackay and head straight for the Whitsundays. Three nights based at Airlie Beach — day trip to Whitehaven Beach, sailing, snorkelling the reef. Then south to Cape Hillsborough for sunrise kangaroos on the beach, and finish in Mackay. Short, focused, and unforgettable.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Luxury curated accommodation", "MAXTRAX + recovery kit", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Airlie Beach", day: "Days 1–3", type: "highlight", desc: "Gateway to the Whitsunday Islands. Day trip to Whitehaven Beach — consistently rated one of the world's best beaches. Sailing, kayaking, snorkelling the outer reef. Whitsunday Great Walk. Three nights to do it justice.", stay: "Airlie Beach accommodation", eat: "Fish D'vine, Mr Bones, Northerlies Beach Bar", source: "big4.com.au" },
      { name: "Cape Hillsborough", day: "Days 4–5", type: "highlight", desc: "Cape Hillsborough National Park — kangaroos and wallabies on the beach at sunrise. One of Queensland's most iconic wildlife encounters. Eungella National Park platypus viewing nearby.", stay: "Cape Hillsborough lodge accommodation", eat: "The Dispensary Mackay, Foodspace", source: "capehillsboroughnatureresort.com.au" },
      { name: "Mackay", day: "Days 6–7", type: "stop", desc: "Bluewater Lagoon, Harbour Beach, and the botanical gardens. A relaxed finish before drop-off. We collect the vehicle from Mackay.", stay: "Mackay accommodation", eat: "The Dispensary, Burp Eat Dessert", source: "mackayregion.com" },
    ],
  },
  {
    id: "capricorn-coast",
    name: "Capricorn Coast",
    config: "Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Rockhampton · Yeppoon · 1770 & Agnes Water",
    tagline: "Reef islands, headland walks, and Queensland's most northerly surf",
    description: "Fly into Rockhampton and head for the coast. Yeppoon Lagoon, Great Keppel Island day trip, Capricorn Caves. Then south to the Town of 1770 and Agnes Water — Queensland's most northerly surf beach, Lady Musgrave Island on the southern Great Barrier Reef. A week of coast without the crowds.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Luxury curated accommodation", "MAXTRAX + recovery kit", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Yeppoon & Capricorn Coast", day: "Days 1–3", type: "highlight", desc: "Yeppoon Lagoon, Bluff Point walk. Day trip to Great Keppel Island by ferry — pristine beaches, snorkelling, bushwalks. Capricorn Caves — natural limestone cathedral.", stay: "Yeppoon waterfront accommodation", eat: "Waterline Restaurant Yeppoon, The Strand Hotel", source: "farnboroughbeach.com.au" },
      { name: "1770 & Agnes Water", day: "Days 4–6", type: "highlight", desc: "Town of 1770 — where Captain Cook first set foot in Queensland. Agnes Water — most northerly surf beach. Lady Musgrave Island day trip — southern Great Barrier Reef with pristine coral. Three nights.", stay: "Agnes Water or 1770 accommodation", eat: "The Tree Bar at 1770, Getaway Garden Café", source: "1770campingground.com.au" },
      { name: "Rockhampton", day: "Day 7", type: "transit", desc: "Back to Rocky for drop-off. Capricorn Caves if you haven't done them, Great Western Hotel for a last outback pub meal.", stay: "Home", eat: "Great Western Hotel", source: "capricorncaves.com.au" },
    ],
  },
  {
    id: "byron-bay",
    name: "Byron Bay",
    config: "Touring",
    duration: "5–7 Days",
    guests: "2–4 Guests",
    route: "Gold Coast / Ballina · Byron Bay · Yamba",
    tagline: "Lighthouse walks, beach driving, and Australia's most laid-back coast",
    description: "Pick up from Gold Coast or Ballina airport and head straight for Byron Bay. Cape Byron lighthouse, The Pass, The Farm. South to Air Force Beach for a taste of sand driving — no permit needed. Then Yamba, consistently rated one of Australia's best small towns. Short, coastal, and completely relaxed.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Luxury curated accommodation", "Beach driving briefing", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Byron Bay", day: "Days 1–2", type: "highlight", desc: "Cape Byron lighthouse — most easterly point of mainland Australia. Sunrise walk, The Pass for surfing, Main Beach for swimming. The Farm for produce-driven dining. Two nights to soak it in.", stay: "Byron Bay accommodation", eat: "The Balcony Bar & Oyster Co, Three Blue Ducks at The Farm", source: "firstsunbyronbay.com.au" },
      { name: "Ballina & Air Force Beach", day: "Day 3", type: "stop", desc: "South to Air Force Beach — 4.6km stretch of beach driving, no permit required, free access. Easy sand driving introduction. Richmond River, Ballina waterfront.", stay: "Ballina accommodation", eat: "Wharf Bar & Restaurant Ballina", source: "flatrocktentpark.com.au" },
      { name: "Yamba", day: "Days 4–5", type: "highlight", desc: "Consistently rated one of Australia's best small towns. Angourie — NSW's first surfing reserve, blue and green freshwater pools in the rock shelves. Fish and chips on the headland. Proper dwell time.", stay: "Yamba accommodation", eat: "Beachwood Café, Pacific Hotel Yamba (sunset on the deck)", source: "bluedolphinholidayresort.com.au" },
      { name: "Return", day: "Days 6–7", type: "transit", desc: "Drive back to Gold Coast or Ballina for drop-off. Optional extra night in Byron or the hinterland if you're not ready to leave.", stay: "Byron Bay or Gold Coast accommodation", eat: "Your choice — one last café stop", source: "" },
    ],
  },
  {
    id: "stockton-beach",
    name: "Stockton Beach",
    config: "Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Sydney / Newcastle · Port Stephens · Hunter Valley",
    tagline: "Australia's largest coastal dunes, dolphins, and wine country",
    description: "The NSW 4WD highlight. Fly into Sydney or Newcastle and head for Worimi Conservation Lands — 19km of beach driving through massive sand dunes, Tin City, and WWII relics. Nelson Bay for dolphins. Then inland to the Hunter Valley for cellar doors and vineyard stays. Beach, sand, and wine in one week.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Stockton Beach 4WD permit", "Luxury curated accommodation", "Beach driving briefing", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Newcastle", day: "Day 1", type: "transit", desc: "Fly into Sydney or Newcastle. Bathers Way walk — Nobbys Beach, Bogey Hole (convict-cut ocean bath), Merewether Ocean Baths. Street art, craft beer scene.", stay: "Newcastle accommodation (Merewether or inner city)", eat: "Merewether Surfhouse, The Edwards", source: "visitnewcastle.com.au" },
      { name: "Stockton Beach & Port Stephens", day: "Days 2–4", type: "highlight", desc: "Worimi Conservation Lands — 19km of beach driving, massive sand dune system, Tin City (fishermen's shacks built from shipwreck tin), WWII defence relics. Nelson Bay for dolphins, whale watching (seasonal). Tomaree Head Summit walk. Three nights.", stay: "Port Stephens accommodation", eat: "Inner Lighthouse Café Nelson Bay, The Retreat Port Stephens", source: "worimiconservationlands.com" },
      { name: "Hunter Valley", day: "Days 5–6", type: "highlight", desc: "Wine country. Tyrrell's, Brokenback Range views, cellar door tastings. A deliberate change of pace — put the 4WD in the background for a day. Two nights among the vineyards.", stay: "Hunter Valley vineyard lodges or boutique stays", eat: "Muse Restaurant, Margan Restaurant", source: "huntervalley.com.au" },
      { name: "Return", day: "Day 7", type: "transit", desc: "Drive back to Sydney or Newcastle for drop-off. We collect the vehicle.", stay: "Home", eat: "Celebration lunch", source: "" },
    ],
  },
  {
    id: "coastal-explorer",
    name: "Coastal Explorer",
    config: "Touring",
    duration: "21 Days",
    guests: "2–4 Guests",
    route: "Brisbane → K'gari → Cairns",
    tagline: "The full Queensland coastline — beaches, rainforest, and reef",
    description: "Our signature coastal journey. Head north from Brisbane, cross to K'gari for world-class beach driving, then wind up through the Whitsundays and into Tropical North Queensland. Stay in coastal resorts and boutique lodges — every stop gets genuine dwell time. Finish in Cairns and fly home.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "K'gari permits + barge", "MAXTRAX + recovery kit", "Luxury curated accommodation", "Coastal route guide", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Rainbow Beach & Inskip", day: "Day 1", type: "transit", desc: "Barge departure point for K'gari. Air down tyres at Inskip Point and get your first taste of coastal sand driving.", stay: "Rainbow Beach accommodation", eat: "Rainbow Beach Surf Club, Waterview Bistro", source: "QPWS — book via qld.gov.au/camping" },
      { name: "K'gari (Fraser Island)", day: "Days 2–4", type: "highlight", desc: "75 Mile Beach highway, Lake McKenzie, Lake Wabby, Eli Creek, Central Station rainforest walk, Indian Head lookout, Champagne Pools. Three nights on the island.", stay: "Kingfisher Bay Resort or Eurong Beach Resort", eat: "Resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Bundaberg & 1770", day: "Days 5–6", type: "stop", desc: "Back on the mainland. Mon Repos Turtle Centre (seasonal Nov–Mar). Town of 1770 and Agnes Water — Queensland's most northerly surf beach. Lady Musgrave Island day trip available.", stay: "Agnes Water or 1770 accommodation", eat: "The Tree Bar at 1770, Getaway Garden Café Agnes Water", source: "1770campingground.com.au" },
      { name: "Yeppoon & Capricorn Coast", day: "Days 7–8", type: "stop", desc: "Capricorn Coast. Yeppoon Lagoon, Bluff Point walk. Day trip to Great Keppel Island by ferry — pristine beaches, snorkelling, bushwalks.", stay: "Yeppoon waterfront accommodation", eat: "Waterline Restaurant Yeppoon, The Strand Hotel", source: "QPWS / farnboroughbeach.com.au" },
      { name: "Mackay & Cape Hillsborough", day: "Days 9–10", type: "highlight", desc: "Cape Hillsborough National Park — kangaroos and wallabies on the beach at sunrise. Eungella National Park platypus viewing. Mackay's Bluewater Lagoon.", stay: "Mackay or Cape Hillsborough lodge", eat: "The Dispensary Mackay, Foodspace", source: "capehillsboroughnatureresort.com.au" },
      { name: "Airlie Beach & Whitsundays", day: "Days 11–13", type: "highlight", desc: "Gateway to the Whitsunday Islands. Day trip to Whitehaven Beach. Sailing, kayaking, Whitsunday Great Walk. Three nights to do it justice.", stay: "Airlie Beach or island accommodation", eat: "Fish D'vine, Mr Bones, Northerlies Beach Bar", source: "big4.com.au / QPWS" },
      { name: "Townsville & Magnetic Island", day: "Days 14–15", type: "stop", desc: "The Strand waterfront, Castle Hill lookout. Ferry to Magnetic Island — Forts Walk (WWII fortifications with wild koalas), secluded bays.", stay: "Townsville or Magnetic Island accommodation", eat: "A Touch of Salt, Longboard Bar & Grill", source: "rowesbaycaravanpark.com.au" },
      { name: "Mission Beach", day: "Days 16–17", type: "stop", desc: "Cassowary country. Rainforest meets the reef. Licuala Fan Palm track, cassowary spotting, uncrowded tropical beaches. Dunk Island day trip available.", stay: "Mission Beach accommodation", eat: "Garage Bar & Grill, New Deli Mission Beach", source: "beachcombercoconut.com.au" },
      { name: "Cairns", day: "Days 18–21", type: "highlight", desc: "Journey's end — four nights to explore properly. Great Barrier Reef day trip, Kuranda Scenic Railway, night markets. We fly up to collect the vehicle — just drop the keys and catch your flight home.", stay: "Cairns or Palm Cove accommodation", eat: "Prawn Star (floating seafood bar), Ochre Restaurant, Cairns Night Markets", source: "ellisbeach.com.au" },
    ],
  },
  {
    id: "outback-taster",
    name: "Outback Taster",
    config: "Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Longreach · Winton",
    tagline: "Dinosaurs, stargazing, and the Qantas story — without the 21-day commitment",
    description: "Fly into Longreach and dive straight into outback Queensland's highlights. Qantas Founders Museum, Australian Age of Dinosaurs on the mesa at Winton, Thomson River sunset cruise. All the best of the outback route in one focused week. All sealed roads, every leg under four hours.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Luxury curated accommodation", "MAXTRAX + recovery kit", "Remote route mapping", "24/7 satellite support"],
    vibe: "outback",
    stops: [
      { name: "Longreach", day: "Days 1–3", type: "highlight", desc: "Heart of outback Queensland. Qantas Founders Museum — walk through a 747 and 707 on the tarmac. Australian Stockman's Hall of Fame. Thomson River sunset cruise with camp oven dinner. Three nights to soak it in.", stay: "Longreach accommodation or station stays", eat: "Harry's at the Australian Hotel, Merino Bakery", source: "longreachtouristpark.com.au" },
      { name: "Winton", day: "Days 4–5", type: "highlight", desc: "Dinosaur country. Australian Age of Dinosaurs — perched on a mesa, hands-on fossil prep lab. Lark Quarry dinosaur stampede trackways. Waltzing Matilda Centre. North Gregory Hotel.", stay: "Winton accommodation", eat: "The North Gregory Hotel Winton", source: "pelicanwaterswinton.com.au" },
      { name: "Longreach (return)", day: "Days 6–7", type: "stop", desc: "Return to Longreach for anything you missed. Stockman's Hall of Fame if you haven't done it, or just sit on the verandah and watch the outback. Fly home from Longreach.", stay: "Longreach accommodation", eat: "Harry's at the Australian Hotel", source: "longreachtouristpark.com.au" },
    ],
  },
  {
    id: "carnarvon-gorge",
    name: "Carnarvon Gorge",
    config: "Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Emerald · Carnarvon Gorge · Blackall",
    tagline: "Ancient rock art, sandstone cathedrals, and outback silence",
    description: "Fly into Emerald and head for the gorge. Four nights at Carnarvon Gorge — 30km sandstone gorge with Aboriginal rock art, moss gardens, the Amphitheatre, Ward's Canyon. Multiple day-walks. Bookended by sapphire fossicking at Rubyvale and outback hospitality at Blackall. A short, deep outback immersion.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Luxury curated accommodation", "MAXTRAX + recovery kit", "Remote route mapping", "24/7 satellite support"],
    vibe: "outback",
    stops: [
      { name: "Rubyvale & Gemfields", day: "Day 1", type: "stop", desc: "Fly into Emerald, drive to Rubyvale. Sapphire fossicking — try your luck hands-on. A different kind of treasure hunt before the gorge.", stay: "Rubyvale or Emerald accommodation", eat: "Rubyvale Gem Gallery café", source: "rubyvalegem.com.au" },
      { name: "Carnarvon Gorge", day: "Days 2–5", type: "highlight", desc: "The showstopper. 30km sandstone gorge with Aboriginal rock art (Art Gallery, Cathedral Cave), moss gardens, the Amphitheatre, Ward's Canyon. Multiple day-walks — each one different. Four nights minimum to do it justice.", stay: "Breeze Holiday Parks cabins or Carnarvon Gorge Wilderness Lodge", eat: "Breeze Holiday Parks bush bar & roast dinners, local dining", source: "breezeholidayparks.com.au" },
      { name: "Blackall", day: "Days 6–7", type: "stop", desc: "West to Blackall. Home of the Black Stump, Jackie Howe shearing memorial, artesian aquatic centre. Proper outback hospitality before flying home from Longreach or Emerald.", stay: "Acacia Motor Inn Blackall", eat: "Blackall Hotel, Barcoo River Café", source: "blackall-tambo.qld.gov.au" },
    ],
  },
  {
    id: "outback",
    name: "Outback Queensland",
    config: "Touring",
    duration: "21 Days",
    guests: "2–4 Guests",
    route: "Brisbane → Longreach · Winton · Carnarvon Gorge",
    tagline: "Stargazing, dinosaurs, and silence you can't find on the coast",
    description: "Head west into outback Queensland's heartland. Artesian spas under the stars, the Qantas birthplace, dinosaur fossils on a mesa, and a 30km sandstone gorge with ancient rock art. Stay in outback pubs, stations, and lodges. All on sealed roads with every leg under four hours. All on sealed and unsealed roads with every leg under four hours.",
    includes: ["Lexus LX500d Overtrail", "$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "MAXTRAX + recovery kit", "Luxury curated accommodation", "Remote route & water mapping", "24/7 satellite support"],
    vibe: "outback",
    stops: [
      { name: "Toowoomba", day: "Day 1", type: "transit", desc: "Up and over the Great Dividing Range. Picnic Point lookout over the Lockyer Valley. Queensland's Garden City — a deliberately gentle start before the landscape strips back.", stay: "Toowoomba accommodation", eat: "The Spotted Cow, Picnic Point café", source: "toowoombaregion.com.au" },
      { name: "Roma", day: "Day 2", type: "stop", desc: "Through the Darling Downs to Roma. The Big Rig night show — the story of Australia's first oil and gas discovery told with fire, light and sound.", stay: "Roma Explorers Inn or Roma accommodation", eat: "Roma on Bungil Gallery Café", source: "maranoa.qld.gov.au" },
      { name: "Mitchell & Charleville", day: "Days 3–4", type: "highlight", desc: "Mitchell — the Great Artesian Spa. Free hot mineral springs under the stars. Charleville — Cosmos Centre stargazing (some of the darkest skies in Australia), Bilby Experience (endangered bilbies up close).", stay: "Hotel Corones (heritage pub) or Charleville accommodation", eat: "Hotel Corones (heritage pub, famous staircase)", source: "charlevillebushcaravanpark.com.au" },
      { name: "Blackall", day: "Days 5–6", type: "stop", desc: "Home of the Black Stump. Jackie Howe memorial (hand-blade shearing world record, unbroken since 1892). Artesian aquatic centre. The landscape is properly red now.", stay: "Acacia Motor Inn Blackall", eat: "Blackall Hotel, Barcoo River Café", source: "blackall-tambo.qld.gov.au" },
      { name: "Longreach", day: "Days 7–9", type: "highlight", desc: "Heart of outback Queensland. Qantas Founders Museum — walk through a 747 and 707 on the tarmac. Australian Stockman's Hall of Fame. Thomson River sunset cruise with camp oven dinner. Three nights minimum.", stay: "Longreach accommodation or station stays", eat: "Harry's at the Australian Hotel, Merino Bakery", source: "longreachtouristpark.com.au" },
      { name: "Winton", day: "Days 10–12", type: "highlight", desc: "Dinosaur country. Australian Age of Dinosaurs — perched on a mesa, hands-on fossil prep lab. Lark Quarry dinosaur stampede trackways. Waltzing Matilda Centre. North Gregory Hotel — where Banjo Paterson first performed Waltzing Matilda.", stay: "Winton accommodation", eat: "The North Gregory Hotel Winton", source: "QPWS / pelicanwaterswinton.com.au" },
      { name: "Carnarvon Gorge", day: "Days 13–15", type: "highlight", desc: "The showstopper of inland Queensland. 30km sandstone gorge with Aboriginal rock art, moss gardens, the Amphitheatre, Ward's Canyon. Multiple day-walks. Three nights minimum.", stay: "Breeze Holiday Parks cabins or Carnarvon Gorge Wilderness Lodge", eat: "Breeze Holiday Parks bush bar & roast dinners, local dining", source: "breezeholidayparks.com.au" },
      { name: "Emerald & Gemfields", day: "Days 16–17", type: "stop", desc: "Rubyvale sapphire fossicking — try your luck hands-on. Tree of Knowledge at Barcaldine. The landscape transitions from red back to green.", stay: "Emerald accommodation", eat: "Emerald pubs, Rubyvale Gem Gallery café", source: "rubyvalegem.com.au" },
      { name: "Rockhampton", day: "Day 18", type: "stop", desc: "Capricorn Caves — natural limestone cathedral. Tropic of Capricorn marker. Great Western Hotel — bull riding on Friday nights.", stay: "Rockhampton accommodation", eat: "Great Western Hotel, Saigon Saigon", source: "capricorncaves.com.au" },
      { name: "Agnes Water & Bundaberg", day: "Days 19–20", type: "stop", desc: "Optional stops on the coastal run home. Agnes Water — most northerly surf beach in Queensland. Bundaberg rum distillery, Mon Repos turtle centre (seasonal). Watch the red dirt fade to green.", stay: "Agnes Water or Bundaberg accommodation", eat: "The Tree Bar at 1770, Bundaberg Barrel", source: "1770campingground.com.au" },
      { name: "Brisbane", day: "Day 21", type: "transit", desc: "South through the coast to Brisbane. Drop the vehicle at our Banyo yard or your accommodation.", stay: "Home", eat: "Celebration dinner in Brisbane", source: "" },
    ],
  },
  {
    id: "custom",
    name: "Custom Journey",
    config: "Touring",
    duration: "Your Choice",
    guests: "2–4 Guests",
    route: "You decide",
    tagline: "Your trip, your way — we build it together",
    description: "Combine coast and outback. Explore one region in depth. Design something completely unique. We present curated accommodation options at each stop and handle all the bookings. Want a shorter version of any signature tour, or something we haven't thought of? Minimum 3 days, no maximum.",
    includes: ["$1,500/day — all inclusive", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Personalised route consultation", "Luxury curated accommodation", "All standard inclusions", "Flexible duration", "24/7 support"],
    vibe: "both",
    stops: null,
  },
];

export default function SouthernHorizonSite() {
  const [authenticated, setAuthenticated] = useState(false);
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({});
  const [formData, setFormData] = useState({ name:"",email:"",phone:"",guests:"",dates:"",package:"",duration:"",specialNeeds:"",message:"",childSeats:false });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [routeGuide, setRouteGuide] = useState(null);
  const [wikiImages, setWikiImages] = useState({});

  // Fetch verified destination images from Wikipedia on mount
  useEffect(() => {
    const fetchWikiImages = async () => {
      const results = {};
      await Promise.all(
        Object.entries(WIKI_ARTICLES).map(async ([key, title]) => {
          try {
            const url = `https://en.wikipedia.org/w/api.php?action=query&titles=${encodeURIComponent(title)}&prop=pageimages&format=json&pithumbsize=1600&origin=*`;
            const res = await fetch(url);
            const data = await res.json();
            const pages = data?.query?.pages || {};
            const page = Object.values(pages)[0];
            if (page?.thumbnail?.source) {
              results[key] = page.thumbnail.source;
            }
          } catch (e) {
            // Silent fail — fallback URL will be used
          }
        })
      );
      setWikiImages(results);
    };
    fetchWikiImages();
  }, []);

  // Helper: returns Wikipedia image if fetched, else fallback Unsplash URL
  const IMAGES = new Proxy({}, {
    get: (_, key) => wikiImages[key] || IMAGES_FALLBACK[key] || "",
  });

  const goTo = id => { setActiveSection(id); setMobileMenuOpen(false); setRouteGuide(null); window.scrollTo(0,0); };
  const isHome = activeSection === "home";

  const toggleFaq = k => setOpenFaqs(p => ({ ...p, [k]: !p[k] }));
  const handleSubmit = async () => {
    setFormSubmitting(true);
    const id = "SH-" + Date.now().toString(36).toUpperCase();
    const pkgMap = {"K'gari Experience":"kgari","Tropical North":"tropical-north","Coastal Explorer":"coastal-explorer",
      "Outback Queensland":"outback","Whitsundays":"whitsundays","Outback Taster":"outback-taster",
      "Capricorn Coast":"capricorn-coast","Carnarvon Gorge":"carnarvon-gorge","Byron Bay":"byron-bay",
      "Stockton Beach":"stockton-beach","Custom Journey":"custom","Not sure yet":"custom"};
    const pkgId = pkgMap[formData.package] || "custom";

    const pkgStops = {
      kgari: [{n:"Rainbow Beach & Inskip",ni:1},{n:"Southern K'gari",ni:2},{n:"75 Mile Beach",ni:1},{n:"Northern K'gari",ni:1},{n:"Hervey Bay (optional)",ni:1}],
      "tropical-north": [{n:"Cairns",ni:1},{n:"Port Douglas & Mossman Gorge",ni:2},{n:"Daintree Rainforest",ni:2},{n:"Cape Tribulation",ni:2},{n:"Atherton Tablelands",ni:2},{n:"Cairns (return)",ni:2}],
      "coastal-explorer": [{n:"Rainbow Beach & Inskip",ni:1},{n:"Southern K'gari",ni:3},{n:"Bundaberg & 1770",ni:2},{n:"Yeppoon & Capricorn Coast",ni:2},{n:"Cape Hillsborough",ni:2},{n:"Airlie Beach & Whitsundays",ni:3},{n:"Townsville & Magnetic Island",ni:2},{n:"Mission Beach",ni:2},{n:"Cairns",ni:4}],
      outback: [{n:"Toowoomba",ni:1},{n:"Roma",ni:1},{n:"Mitchell & Charleville",ni:2},{n:"Blackall",ni:2},{n:"Longreach",ni:3},{n:"Winton",ni:3},{n:"Carnarvon Gorge",ni:3},{n:"Emerald & Gemfields",ni:2},{n:"Rockhampton",ni:1},{n:"Agnes Water & Bundaberg",ni:2}],
      whitsundays: [{n:"Airlie Beach",ni:3},{n:"Cape Hillsborough",ni:2},{n:"Mackay",ni:1}],
      "outback-taster": [{n:"Longreach",ni:3},{n:"Winton",ni:2},{n:"Longreach (return)",ni:1}],
      "capricorn-coast": [{n:"Yeppoon",ni:3},{n:"1770 & Agnes Water",ni:3},{n:"Rockhampton",ni:1}],
      "carnarvon-gorge": [{n:"Rubyvale & Gemfields",ni:1},{n:"Carnarvon Gorge",ni:4},{n:"Blackall",ni:1}],
      "byron-bay": [{n:"Byron Bay",ni:2},{n:"Ballina & Air Force Beach",ni:1},{n:"Yamba",ni:2}],
      "stockton-beach": [{n:"Newcastle",ni:1},{n:"Stockton Beach & Port Stephens",ni:3},{n:"Hunter Valley",ni:2}],
      custom: [],
    };

    const stops = (pkgStops[pkgId] || []).map(s => ({
      name: s.n, mode: "touring", nights: s.ni, accomOptions: [], selectedAccom: null,
    }));
    const totalDays = parseInt(formData.duration) || stops.reduce((a, s) => a + s.nights, 0) || 7;

    // 1. Write to Firebase (booking app)
    try {
      await setDoc(doc(db, "bookings", id), {
        status: "enquiry", createdAt: new Date().toISOString(),
        guestName: formData.name, guestEmail: formData.email, guestPhone: formData.phone,
        guestCount: formData.guests || "2 adults (couple)",
        packageId: pkgId, startDate: "", totalDays,
        stops, supplements: 0, notes: "",
        specialNeeds: formData.specialNeeds,
        message: formData.message, dates: formData.dates, duration: formData.duration,
        childSeats: formData.childSeats || false,
      });
    } catch (err) { console.error("Firebase error:", err); }

    // 2. Send guest confirmation email via EmailJS
    try {
      await fetch("https://api.emailjs.com/api/v1.0/email/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          service_id: "service_boynyl6",
          template_id: "template_kuncasw",
          user_id: "xioaylu5g4dwl6Xo6",
          template_params: {
            guest_name: formData.name,
            guest_email: formData.email,
            booking_id: id,
            package: formData.package + (formData.duration ? " (" + formData.duration + ")" : ""),
            dates: formData.dates,
          },
        }),
      });
    } catch (err) { console.error("EmailJS error:", err); }

    setFormSubmitted(true);
    setFormSubmitting(false);
  };

  const serif = `'Cormorant Garamond', 'Georgia', serif`;
  const sans = `'Figtree', 'Helvetica Neue', sans-serif`;

  // Dual palette — refined luxury
  const coast = { primary: "#1C1917", light: "#FFFFFF", mid: "#44403C", accent: "#C4A265", soft: "#FAFAF9" };
  const outback = { primary: "#1C1917", light: "#FFFFFF", mid: "#44403C", accent: "#C4A265", soft: "#FAFAF9" };
  const neutral = { sand: "#FAFAF9", white: "#FFFFFF", dark: "#1C1917", mid: "#57534E", light: "#A8A29E", border: "#E7E5E4" };
  const gold = "#C4A265";

  // ═══ PASSWORD GATE ═══
  if (!authenticated) {
    const tryLogin = () => {
      if (pw === "shco2027") { setAuthenticated(true); setPwError(false); }
      else setPwError(true);
    };
    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Figtree:wght@300;400;500;600;700&display=swap');
          *{margin:0;padding:0;box-sizing:border-box}
          body{background:${neutral.white}}
        `}</style>
        <div style={{
          minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",
          background:neutral.dark,
          padding:28,
        }}>
          <div style={{
            maxWidth:400,width:"100%",textAlign:"center",
            background:"rgba(255,253,248,0.95)",backdropFilter:"blur(20px)",
            borderRadius:12,padding:"56px 40px",boxShadow:"0 24px 64px rgba(0,0,0,0.15)",
          }}>
            <div style={{marginBottom:8}}>
              <span style={{fontFamily:serif,fontSize:32,fontWeight:400,color:neutral.dark}}>Southern Horizon</span>
              <span style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
                color:gold,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginLeft:6,
              }}>Co.</span>
            </div>
            <div style={{width:40,height:1,background:gold,margin:"16px auto 20px"}}/>
            <p style={{fontFamily:sans,fontSize:13,color:neutral.light,marginBottom:32,fontWeight:300}}>
              Preview — Coming Soon
            </p>
            <input type="password" placeholder="Enter password" value={pw}
              onChange={e=>{setPw(e.target.value);setPwError(false)}}
              onKeyDown={e=>e.key==="Enter"&&tryLogin()}
              style={{
                width:"100%",padding:"15px 18px",border:`1px solid ${neutral.border}`,
                borderRadius:6,fontFamily:sans,fontSize:14,color:neutral.dark,
                outline:"none",textAlign:"center",marginBottom:12,
                background:"#fff",transition:"border-color .3s",
              }}/>
            {pwError && <p style={{fontFamily:sans,fontSize:12,color:outback.primary,marginBottom:12}}>Incorrect password</p>}
            <button onClick={tryLogin} style={{
              width:"100%",padding:"15px",border:"none",borderRadius:6,cursor:"pointer",
              background:gold,
              color:"#fff",fontFamily:sans,fontSize:11,fontWeight:600,letterSpacing:2.5,textTransform:"uppercase",
              transition:"all .3s",boxShadow:"0 4px 20px rgba(0,0,0,0.1)",
            }}>Enter</button>
            <p style={{fontFamily:sans,fontSize:11,color:neutral.light,marginTop:20,fontWeight:300}}>
              Invited guests only
            </p>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400;1,500&family=Figtree:wght@300;400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:${neutral.white}}
        ::selection{background:${gold};color:#fff}

        @keyframes fadeUp{from{opacity:0;transform:translateY(24px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}
        @keyframes slideIn{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:translateY(0)}}

        .page-enter{animation:slideIn .4s cubic-bezier(.25,.46,.45,.94)}

        .nav-link{position:relative;cursor:pointer;text-decoration:none;color:inherit;transition:color .3s}
        .nav-link::after{content:'';position:absolute;bottom:-4px;left:50%;width:0;height:1.5px;
          background:${gold};
          transition:width .35s cubic-bezier(.25,.46,.45,.94);transform:translateX(-50%)}
        .nav-link:hover::after,.nav-link.active::after{width:100%}

        .card-up{transition:transform .5s cubic-bezier(.25,.46,.45,.94),box-shadow .5s}
        .card-up:hover{transform:translateY(-4px);box-shadow:0 24px 56px rgba(28,25,23,0.06)}

        .btn-dual{
          background:${neutral.dark};color:#fff;border:none;
          padding:16px 40px;font-family:${sans};font-size:11px;font-weight:600;
          letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;
          border-radius:4px;transition:all .35s;box-shadow:0 4px 20px rgba(28,25,23,0.10);
        }
        .btn-dual:hover{transform:translateY(-2px);box-shadow:0 8px 32px rgba(28,25,23,0.14);filter:brightness(1.06)}

        .btn-ghost{
          background:transparent;color:#fff;border:1px solid rgba(255,255,255,0.3);
          padding:15px 36px;font-family:${sans};font-size:11px;font-weight:500;
          letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;
          border-radius:4px;transition:all .35s;
        }
        .btn-ghost:hover{background:rgba(255,255,255,0.08);border-color:rgba(255,255,255,0.5)}

        .btn-coast{background:${neutral.dark};color:#fff;border:none;padding:15px 36px;font-family:${sans};font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:all .35s}
        .btn-coast:hover{background:#08535F;transform:translateY(-2px)}

        input,textarea,select{
          width:100%;padding:15px 18px;border:1px solid ${neutral.border};background:#fff;
          font-family:${sans};font-size:14px;color:${neutral.dark};outline:none;
          transition:border-color .3s,box-shadow .3s;border-radius:4px;
        }
        input:focus,textarea:focus,select:focus{border-color:${gold};box-shadow:0 0 0 3px rgba(196,162,101,0.08)}
        textarea{resize:vertical;min-height:120px}
        input::placeholder,textarea::placeholder{color:${neutral.light}}

        .faq-item{border-bottom:1px solid ${neutral.border}}
        .faq-q{padding:22px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;transition:color .25s}
        .faq-q:hover{color:${gold}}

        .vibe-coast{border-left:3px solid ${gold}}
        .vibe-outback{border-left:3px solid ${gold}}
        .vibe-both{border-left:3px solid ${gold}}

        .luxury-divider{width:60px;height:1px;background:${gold};margin:0 auto 14px}

        @media(max-width:768px){
          .desk-nav{display:none!important}
          .mob-btn{display:flex!important}
          .g2{grid-template-columns:1fr!important}
          .g3{grid-template-columns:1fr!important}
          .g4{grid-template-columns:1fr 1fr!important}
          .hero-h{font-size:32px!important}
          .stat-row{gap:16px!important;padding:16px!important}
          .pkg-grid{grid-template-columns:1fr!important}
        }
        @media(max-width:480px){.g4{grid-template-columns:1fr!important}}
      `}</style>

      {/* ═══ NAV ═══ */}
      <nav style={{
        position:"fixed",top:0,left:0,right:0,zIndex:100,
        background:"rgba(255,255,255,0.95)",
        backdropFilter:"blur(16px) saturate(180%)",
        borderBottom:`1px solid ${neutral.border}`,
        transition:"all .4s",padding:"12px 28px",
      }}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{cursor:"pointer",display:"flex",alignItems:"center",gap:10}} onClick={()=>goTo("home")}>
            <SHCoLogo size={38}/>
            <div style={{display:"flex",alignItems:"baseline",gap:6}}>
            <span style={{
              fontFamily:serif,fontSize:18,fontWeight:700,letterSpacing:.5,
              color:neutral.dark,transition:"color .4s",
              textShadow:"none",
            }}>Southern Horizon</span>
            <span style={{
              fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
              color:gold,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",transition:"all .4s",
            }}>Co.</span>
            </div>
          </div>
          <div className="desk-nav" style={{display:"flex",gap:22,alignItems:"center"}}>
            {SECTIONS.map(s=>(
              <span key={s.id} className={`nav-link ${activeSection===s.id?"active":""}`}
                onClick={()=>goTo(s.id)} style={{
                  fontFamily:sans,fontSize:10.5,fontWeight:400,letterSpacing:1,
                  color:neutral.mid,transition:"color .35s",
                  textShadow:"none",
                }}>{s.label}</span>
            ))}
          </div>
          <div className="mob-btn" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}
            style={{display:"none",cursor:"pointer",zIndex:1001,alignItems:"center",justifyContent:"center",
              width:36,height:36,fontSize:24,
              color:neutral.dark,transition:"color .3s"}}>
            {mobileMenuOpen?"✕":"☰"}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div style={{position:"fixed",inset:0,background:neutral.white,zIndex:999,padding:"88px 32px 40px",
          display:"flex",flexDirection:"column",gap:2,animation:"fadeIn .2s",overflowY:"auto"}}>
          {SECTIONS.map(s=>(
            <div key={s.id} onClick={()=>goTo(s.id)} style={{
              fontFamily:serif,fontSize:24,fontWeight:300,color:neutral.dark,cursor:"pointer",
              padding:"18px 0",borderBottom:`1px solid ${neutral.border}`,letterSpacing:0.5,
            }}>{s.label}</div>
          ))}
        </div>
      )}

      {activeSection === "home" && (<>
      {/* ═══ HERO — WHITE BACKGROUND + PHOTO ═══ */}
      <div id="home">
        <div style={{
          minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
          background:`linear-gradient(180deg, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.85) 60%, rgba(255,255,255,0.98) 100%), url(${IMAGES.hero}) center/cover no-repeat`,
          position:"relative",overflow:"hidden",padding:"140px 28px 110px",
        }}>
          {/* Texture: sand grain overlay */}
          <div style={{position:"absolute",inset:0,opacity:.03,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize:"128px",
          }}/>
          {/* Horizon line */}
          <div style={{position:"absolute",top:"52%",left:0,right:0,height:1,
            background:`linear-gradient(90deg, transparent, ${gold}30 30%, ${gold}50 50%, ${gold}30 70%, transparent)`
          }}/>
          {/* Transition wave at bottom */}
          <svg style={{position:"absolute",bottom:-1,left:0,width:"100%",height:90}} viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0,35 C360,75 720,5 1080,45 C1260,65 1380,35 1440,50 L1440,90 L0,90Z" fill={neutral.white}/>
          </svg>

          <div style={{textAlign:"center",maxWidth:820,position:"relative",zIndex:2,animation:"fadeUp .9s ease"}}>
            <div style={{
              display:"inline-block",fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:3.5,textTransform:"uppercase",
              color:gold,marginBottom:28,padding:"8px 22px",borderRadius:2,
              background:"rgba(255,255,255,0.9)",border:`1px solid ${gold}`,
              backdropFilter:"blur(8px)",
            }}>Coming Soon</div>
            <div style={{
              fontFamily:sans,fontSize:10,fontWeight:500,letterSpacing:7,textTransform:"uppercase",
              color:neutral.mid,marginBottom:36,
            }}>Self-Drive Luxury Touring — Queensland & Beyond</div>
            <h1 className="hero-h" style={{
              fontFamily:serif,fontSize:"clamp(36px, 6.5vw, 72px)",fontWeight:400,
              color:neutral.dark,lineHeight:1.12,marginBottom:28,
            }}>
              Turquoise water today,<br/>
              <em style={{fontStyle:"italic",fontWeight:300}}>red dirt tomorrow</em>
            </h1>
            <div style={{width:60,height:1,background:gold,margin:"0 auto 28px"}}/>
            <p style={{fontFamily:sans,fontSize:15,color:neutral.mid,lineHeight:1.85,
              maxWidth:520,margin:"0 auto 48px",fontWeight:300,letterSpacing:0.2}}>
              A fully-equipped Lexus LX500d Overtrail — delivered to your airport, 
              your hotel, or wherever you need it. 
              Drive K'gari's white sand, the Daintree's ancient rainforest, Queensland's red outback — 
              or all of them in one trip. Vehicle, accommodation, breakfast (where available), fuel, and concierge support included.
              Everything included — $1,500/day.
            </p>
            <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn-dual" onClick={()=>goTo("packages")}>Explore Packages</button>
              <button className="btn-ghost" onClick={()=>goTo("enquiry")}>Enquire Now</button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="stat-row" style={{
          maxWidth:900,margin:"0 auto",padding:"32px 36px",
          display:"flex",justifyContent:"center",gap:56,flexWrap:"wrap",
          borderBottom:`1px solid ${gold}30`,
        }}>
          {[
            {val:"$1,500/Day",sub:"everything included"},{val:"Concierge",sub:"personal trip support"},
            {val:"LX500d",sub:"Lexus Overtrail"},
            {val:"5–21 Days",sub:"curated packages"},
            {val:"Starlink",sub:"connected anywhere"},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:serif,fontSize:22,fontWeight:500,color:neutral.dark,letterSpacing:0.5}}>{s.val}</div>
              <div style={{fontFamily:sans,fontSize:9,color:neutral.light,letterSpacing:2,textTransform:"uppercase",marginTop:5}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      </>)}
      {activeSection === "experience" && (<>
      {/* ═══ EXPERIENCE ═══ */}
      <div id="experience" style={{paddingTop:60}}>
        <div style={{padding:"110px 28px",maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              color:gold,marginBottom:14,
            }}>The Experience</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
              Two thousand kilometres of <em style={{fontStyle:"italic"}}>everything</em>
            </h2>
          </div>
          <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:20}}>
            {[
              {icon:"01",title:"Delivered to You",text:"Your Lexus LX comes to you — we meet you in arrivals at the airport, or at your hotel lobby, or wherever your trip begins. Brisbane, Gold Coast, Sunshine Coast, or Cairns. Starlink powered up, Mark Levinson ready. You don't come to us — we come to you.",bg:coast.soft,border:neutral.border},
              {icon:"02",title:"Self-Drive Freedom",text:"No guide, no tour bus, no schedule. Follow the coast, detour through rainforest, chase sunset in the desert. Stop where you want, stay as long as you like.",bg:neutral.sand,border:"#E7E5E4"},
              {icon:"03",title:"Connected Everywhere",text:"Starlink satellite internet keeps you connected everywhere. Backup emergency phone with Telstra SIM in the glovebox. Navigate, stream, and share from the Daintree to the outback.",bg:outback.soft,border:neutral.border},
              {icon:"04",title:"Luxury Accommodation",text:"Handpicked boutique lodges, eco-retreats, coastal resorts, and outback stations at every stop. You pick what appeals from our curated options, we book everything. Included in your daily rate.",bg:outback.soft,border:neutral.border},
              {icon:"05",title:"Curated Routes",text:"We've driven every road. Handpicked accommodation, tide charts, swimming holes, sunset lookouts, and the local tips that make the difference.",bg:neutral.sand,border:"#E7E5E4"},
              {icon:"06",title:"24/7 Support",text:"Day or night — roadside assistance, route adjustments, restaurant recommendations, or anything else you need. Personal concierge service, a call or Starlink message away.",bg:coast.soft,border:neutral.border},
            ].map((item,i)=>(
              <div key={i} style={{padding:"30px 26px",background:item.bg,border:`1px solid ${item.border}`,borderRadius:8}}>
                <div style={{fontFamily:serif,fontSize:28,fontWeight:300,color:gold,marginBottom:14,letterSpacing:1}}>{item.icon}</div>
                <h3 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:neutral.dark,marginBottom:10}}>{item.title}</h3>
                <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div style={{
            marginTop:44,padding:"34px 38px",borderRadius:8,overflow:"hidden",position:"relative",
            background:neutral.dark,
            display:"flex",alignItems:"center",justifyContent:"space-between",gap:28,flexWrap:"wrap",
          }}>
            <div>
              <div style={{fontFamily:serif,fontSize:26,fontWeight:700,color:"#fff"}}>
                Your vehicle, fully loaded
              </div>
              <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:300,marginTop:4}}>
                Lexus LX, luxury accommodation, breakfast, fuel card, curated routes, Starlink, concierge support — everything included.
              </p>
            </div>
            <button className="btn-dual" onClick={()=>goTo("enquiry")}
              style={{background:"#fff",color:neutral.dark,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",
                backgroundImage:"none"}}>
              Get in Touch
            </button>
          </div>
        </div>
      </div>

      </>)}
      {activeSection === "packages" && (<>
      {/* ═══ PACKAGES ═══ */}
      <div id="packages" style={{paddingTop:60}}>
        <div style={{background:neutral.sand,padding:"110px 28px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
                color:gold,marginBottom:14,
              }}>Tour Packages</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
                Pick a direction — <em style={{fontStyle:"italic"}}>or pick them all</em>
              </h2>
              <p style={{fontFamily:sans,fontSize:14,color:neutral.light,fontWeight:300,letterSpacing:0.15,maxWidth:480,margin:"14px auto 0",lineHeight:1.7}}>
                From weekend beach escapes to three-week coastal expeditions and outback crossings — Queensland, NSW, and everywhere in between.
              </p>
            </div>
            <div className="pkg-grid" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(320px, 1fr))",gap:22}}>
              {PACKAGES.map(pkg=>{
                const vibeColor = pkg.vibe==="coast"?coast.primary:pkg.vibe==="outback"?outback.primary:`linear-gradient(to bottom,${coast.primary},${outback.primary})`;
                const accentSolid = neutral.dark;
                const bgTint = pkg.vibe==="coast"?coast.soft:pkg.vibe==="outback"?outback.soft:"#F8F6F0";
                const labelText = pkg.vibe==="coast"?"Coastal":pkg.vibe==="outback"?"Outback":"Coast + Outback";
                return(
                  <div key={pkg.id} className={`card-up vibe-${pkg.vibe}`} style={{
                    background:"#fff",borderRadius:8,overflow:"hidden",display:"flex",flexDirection:"column",
                    borderTop:"none",borderRight:`1px solid ${neutral.border}`,borderBottom:`1px solid ${neutral.border}`,
                  }}>
                    {/* Package image */}
                    {IMAGES[pkg.id] && (
                      <div style={{
                        width:"100%",height:200,
                        background:`linear-gradient(180deg, rgba(0,0,0,0) 40%, rgba(0,0,0,0.45) 100%), url(${IMAGES[pkg.id]}) center/cover no-repeat`,
                        position:"relative",
                      }}>
                        <div style={{position:"absolute",bottom:12,left:20,right:20,color:"#fff"}}>
                          <span style={{
                            fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                            background:"rgba(0,0,0,0.35)",padding:"4px 10px",borderRadius:4,backdropFilter:"blur(4px)",
                          }}>{labelText}</span>
                        </div>
                      </div>
                    )}
                    <div style={{padding:"24px 24px 18px",borderBottom:`1px solid ${neutral.border}`,position:"relative"}}>
                      <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
                        {!IMAGES[pkg.id] && <span style={{
                          fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                          color:accentSolid,background:bgTint,padding:"4px 10px",borderRadius:4,
                        }}>{labelText}</span>}
                        <span style={{
                          fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                          color:neutral.light,
                        }}>{pkg.config}</span>
                      </div>
                      <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark,marginBottom:4}}>{pkg.name}</h3>
                      <p style={{fontFamily:serif,fontSize:14,fontWeight:400,color:accentSolid,fontStyle:"italic"}}>{pkg.tagline}</p>
                    </div>
                    <div style={{padding:"18px 24px",flex:1}}>
                      <div style={{display:"flex",gap:14,marginBottom:6,flexWrap:"wrap"}}>
                        <span style={{fontFamily:sans,fontSize:11.5,color:neutral.light}}>{pkg.duration}</span>
                        <span style={{fontFamily:sans,fontSize:11.5,color:neutral.light}}>{pkg.guests}</span>
                      </div>
                      <div style={{fontFamily:sans,fontSize:12,color:accentSolid,fontWeight:500,marginBottom:14}}>{pkg.route}</div>
                      <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:18}}>{pkg.description}</p>

                      <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:neutral.dark,marginBottom:8}}>Included</div>
                      {pkg.includes.map((item,i)=>(
                        <div key={i} style={{fontFamily:sans,fontSize:12,color:neutral.mid,padding:"4px 0",
                          borderBottom:i<pkg.includes.length-1?`1px solid #F5F5F4`:"none",
                          display:"flex",gap:8,alignItems:"flex-start",
                        }}><span style={{color:accentSolid,fontSize:10,marginTop:2.5,flexShrink:0}}>✓</span>{item}</div>
                      ))}
                    </div>
                    <div style={{padding:"12px 24px 22px",display:"flex",gap:10,flexDirection:"column"}}>
                      {pkg.stops && (
                        <button onClick={()=>setRouteGuide(pkg)} style={{
                          width:"100%",fontSize:11,padding:"12px 20px",background:"transparent",
                          border:`1.5px solid ${accentSolid}`,color:accentSolid,fontFamily:sans,
                          fontWeight:600,letterSpacing:1.8,textTransform:"uppercase",cursor:"pointer",
                          borderRadius:6,transition:"all .3s",
                        }}
                        onMouseEnter={e=>{e.target.style.background=accentSolid;e.target.style.color="#fff"}}
                        onMouseLeave={e=>{e.target.style.background="transparent";e.target.style.color=accentSolid}}>
                          View Route Guide
                        </button>
                      )}
                      <button className="btn-coast" onClick={()=>goTo("enquiry")}
                        style={{width:"100%",fontSize:11,padding:"12px 20px",background:accentSolid}}>
                        Enquire Now
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      </>)}
      {activeSection === "vehicle" && (<>
      {/* ═══ VEHICLE ═══ */}
      <div id="vehicle" style={{paddingTop:60}}>
        <div style={{padding:"110px 28px",maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              color:gold,marginBottom:14,
            }}>The Vehicle</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
              Lexus LX500d <em style={{fontStyle:"italic"}}>Overtrail</em>
            </h2>
            <p style={{fontFamily:sans,fontSize:14,color:neutral.light,fontWeight:300,letterSpacing:0.15,maxWidth:440,margin:"12px auto 0",lineHeight:1.7}}>
              As comfortable on the highway as it is on K'gari's sand or outback unsealed roads.
            </p>
          </div>
          <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:10,marginBottom:44}}>
            {[
              {l:"Engine",v:"3.3L Twin-Turbo V6 Diesel"},{l:"Drive",v:"Full-Time 4WD"},
              {l:"Accommodation",v:"Luxury Curated at Every Stop"},{l:"Breakfast",v:"Included at Your Hotel"},
              {l:"Audio",v:"Mark Levinson Premium"},{l:"Connectivity",v:"Starlink + Emergency Phone"},
              {l:"Safety",v:"MAXTRAX + Recovery Kit"},{l:"Internet",v:"Starlink Satellite"},
              {l:"Mobile",v:"Emergency Phone"},{l:"Fuel",v:"Fleet Card + Backup Visa"},
            ].map((f,i)=>(
              <div key={i} style={{padding:"18px 16px",background:i%2===0?coast.soft:outback.soft,borderRadius:10}}>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                  color:i%2===0?coast.primary:outback.primary,marginBottom:5}}>{f.l}</div>
                <div style={{fontFamily:serif,fontSize:14,fontWeight:700,color:neutral.dark,lineHeight:1.3}}>{f.v}</div>
              </div>
            ))}
          </div>
          <div style={{padding:"30px 26px",background:outback.soft,borderRadius:14,borderLeft:`4px solid ${outback.primary}`}}>
              <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:outback.primary,marginBottom:8}}>What's Included</div>
              <h3 style={{fontFamily:serif,fontSize:20,fontWeight:700,color:neutral.dark,marginBottom:8}}>Luxury Touring — $1,500/day</h3>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:12}}>
                Luxury curated accommodation at every stop — boutique lodges, eco-retreats, coastal resorts, outback stations. 
                Fleet fuel card (BP, Shell, Ampol) included for your entire trip, plus a backup Visa for remote fuel stops. Breakfast included where available at your accommodation. We provide a curated dining guide with our favourite restaurants at every stop — dinner is your choice.
                You pick your accommodation from our curated options at each stop, we book everything. One bag per passenger, full open boot.
              </p>
              <div style={{fontFamily:sans,fontSize:12.5,color:outback.primary,fontWeight:600}}>Up to 4 guests · 1 bag per passenger · Day packs at feet</div>
          </div>
          {/* Passenger cap note */}
          <div style={{marginTop:18,padding:"18px 22px",background:neutral.sand,borderRadius:10,display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:3,background:coast.primary,borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/>
            <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7}}>
              <strong style={{color:neutral.dark}}>Guest limit:</strong> For comfort and safety, we carry a maximum of <strong style={{color:neutral.dark}}>4 adults</strong> or <strong style={{color:neutral.dark}}>2 adults and 3 children</strong> per trip. Fewer passengers means more space, more comfort, and a better experience on remote roads.
            </p>
          </div>

        </div>
      </div>

      </>)}
      {activeSection === "itinerary" && (<>
      {/* ═══ PLAN YOUR TRIP ═══ */}
      <div id="itinerary" style={{paddingTop:60}}>
        <div style={{background:neutral.sand,padding:"110px 28px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
                color:gold,marginBottom:14,
              }}>Plan Your Trip</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
                Four steps to <em style={{fontStyle:"italic"}}>the road</em>
              </h2>
            </div>
            <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:14}}>
              {[
                {n:"01",t:"Register",d:"Tell us your dates, group, and what you're after — coast, tropics, outback, or the full mix. We're taking registrations now ahead of our upcoming launch.",accent:coast.primary},
                {n:"02",t:"We Design",d:"We build your itinerary — daily waypoints, curated accommodation, tide charts, hidden gems. We'll talk through driving conditions on your route and match the trip to your experience level.",accent:"#3A8A6C"},
                {n:"03",t:"Refine",d:"We send the route. Add days, swap stops, change pace. It's not finalised until you're happy.",accent:"#8B7A3E"},
                {n:"04",t:"Drive",d:"We meet you at the arrivals area and deliver your Lexus LX to the airport — or to your hotel entrance, or wherever suits. Brisbane, Gold Coast, Sunshine Coast, Cairns, or Sydney. Quick briefing, keys in your hand, and you're on the road.",accent:outback.primary},
              ].map((s,i)=>(
                <div key={i} style={{padding:"28px 22px",background:"#fff",borderRadius:8,borderTop:`3px solid ${s.accent}`}}>
                  <div style={{fontFamily:serif,fontSize:32,fontWeight:400,color:neutral.border,marginBottom:10}}>{s.n}</div>
                  <h3 style={{fontFamily:serif,fontSize:20,fontWeight:500,color:neutral.dark,marginBottom:8}}>{s.t}</h3>
                  <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      </>)}
      {activeSection === "special-needs" && (<>
      {/* ═══ SPECIAL REQUIREMENTS ═══ */}
      <div id="special-needs" style={{paddingTop:60}}>
        <div style={{background:neutral.sand,padding:"110px 28px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
                color:gold,marginBottom:14,
              }}>Special Requirements</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
                Tell us what you need
              </h2>
            </div>
            <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:18}}>
              {[
                {t:"Mobility & Access",d:"The LX500d has a high step-up. Let us know about mobility needs — we'll discuss seating, routes, and accessibility.",bg:coast.soft},
                {t:"Medical Conditions",d:"Remote touring means distance from hospitals. Disclose any conditions and we factor proximity to medical facilities into your route.",bg:outback.soft},
                {t:"Children & Families",d:"Families welcome — we carry up to 2 adults and 3 children. Child seats and boosters arranged, just tell us ages. We tailor your itinerary with family-friendly stops and shorter driving days.",bg:"#F0FDF4"},
                
                {t:"Driving Confidence",d:"First time on sand or dirt? Our briefing covers everything. We can design routes that stick to well-maintained roads if you prefer.",bg:coast.soft},
                {t:"Something Else?",d:"Anything that would make your trip better — however small — mention it. We'd rather know early so we can plan properly.",bg:neutral.sand},
              ].map((item,i)=>(
                <div key={i} style={{padding:"26px 22px",background:item.bg,borderRadius:8}}>
                  <h3 style={{fontFamily:serif,fontSize:19,fontWeight:500,color:neutral.dark,marginBottom:8}}>{item.t}</h3>
                  <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      </>)}
      {activeSection === "faq" && (<>
      {/* ═══ FAQs ═══ */}
      <div id="faq" style={{paddingTop:60}}>
        <div style={{padding:"110px 28px",maxWidth:840,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              color:gold,marginBottom:14,
            }}>FAQs</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
              Before you <em style={{fontStyle:"italic"}}>hit the road</em>
            </h2>
          </div>
          {FAQ_DATA.map((cat,ci)=>(
            <div key={ci} style={{marginBottom:36}}>
              <h3 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:neutral.dark,paddingBottom:10,
                borderBottom:`2px solid`,borderImage:`linear-gradient(90deg,${gold},${gold}40) 1`,marginBottom:2}}>{cat.category}</h3>
              {cat.items.map((faq,fi)=>{
                const k=`${ci}-${fi}`;const open=openFaqs[k];
                return(
                  <div key={fi} className="faq-item">
                    <div className="faq-q" onClick={()=>toggleFaq(k)}>
                      <span style={{fontFamily:sans,fontSize:14,fontWeight:400,color:neutral.dark,letterSpacing:0.2}}>{faq.q}</span>
                      <span style={{
                        flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:18,fontWeight:300,fontFamily:serif,transition:"all .3s",
                        color:open?gold:neutral.light,
                        transform:open?"rotate(45deg)":"rotate(0deg)",
                      }}>+</span>
                    </div>
                    {open&&(
                      <div style={{paddingBottom:18,animation:"fadeIn .2s"}}>
                        <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,paddingRight:40}}>{faq.a}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

      </>)}
      {activeSection === "about" && (<>
      {/* ═══ MEET US ═══ */}
      <div id="about" style={{paddingTop:60}}>
        <div style={{padding:"110px 28px",maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              color:gold,marginBottom:14,
            }}>Meet the Operators</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
              Troy & Jess
            </h2>
            <p style={{fontFamily:sans,fontSize:14,color:neutral.light,fontWeight:300,letterSpacing:0.15,maxWidth:480,margin:"12px auto 0",lineHeight:1.7}}>
              The people behind every route, every recommendation, and every detail of your experience.
            </p>
          </div>

          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
            {/* Troy */}
            <div style={{padding:"32px 28px",background:outback.soft,borderRadius:8,border:`1px solid ${neutral.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{
                  width:56,height:56,borderRadius:28,flexShrink:0,
                  background:neutral.dark,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:serif,fontSize:22,fontWeight:700,color:"#fff",
                }}>T</div>
                <div>
                  <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Troy</h3>
                  <p style={{fontFamily:sans,fontSize:12,color:outback.primary,fontWeight:600,letterSpacing:0.5}}>Founder & Tour Director</p>
                </div>
              </div>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,marginBottom:16}}>
                Qualified mechanic turned luxury touring operator. Troy has spent years exploring Queensland's coast, tropics, and outback 
                by 4WD — and built Southern Horizon Co. to share those experiences at a level that doesn't exist in the self-drive market. 
                Every route, every accommodation recommendation, and every restaurant in our dining guide comes from personal experience.
              </p>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,marginBottom:18}}>
                His mechanical background means the Lexus LX500d is specified to the highest standard — and when you call at 9pm with 
                a question, the person on the other end knows the vehicle and the road you're on. That's the concierge difference.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["Qualified Mechanic","Luxury Touring","Route Curation","Concierge Support","Queensland Expert"].map((t,i)=>(
                  <span key={i} style={{fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",
                    color:outback.primary,background:"#fff",padding:"5px 10px",borderRadius:6,border:`1px solid ${neutral.border}`,
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Jess */}
            <div style={{padding:"32px 28px",background:coast.soft,borderRadius:8,border:`1px solid ${neutral.border}`}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{
                  width:56,height:56,borderRadius:28,flexShrink:0,
                  background:neutral.dark,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:serif,fontSize:22,fontWeight:700,color:"#fff",
                }}>J</div>
                <div>
                  <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Jess</h3>
                  <p style={{fontFamily:sans,fontSize:12,color:coast.primary,fontWeight:600,letterSpacing:0.5}}>Co-Founder & Guest Experience</p>
                </div>
              </div>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,marginBottom:16}}>
                Fifteen years with Virgin Australia gave Jess an instinct for what separates good hospitality from exceptional. 
                She understands guest expectations from the inside — the logistics, the timing, the details that make people feel genuinely looked after. 
                That experience now shapes every aspect of the Southern Horizon guest journey.
              </p>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,marginBottom:18}}>
                Jess curates the accommodation, builds the dining guides, and designs the welcome experience. 
                If Troy maps the road, Jess makes sure every stop along it feels considered, personal, and worth remembering.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["15 Years Travel Industry","Guest Experience","Accommodation Curation","Dining Guides","Concierge"].map((t,i)=>(
                  <span key={i} style={{fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",
                    color:coast.primary,background:"#fff",padding:"5px 10px",borderRadius:6,border:`1px solid ${neutral.border}`,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Shared passion callout */}
          <div style={{
            marginTop:24,padding:"28px 28px",borderRadius:8,
            background:neutral.dark,
            position:"relative",overflow:"hidden",
          }}>
            <div style={{position:"relative",zIndex:1,maxWidth:720}}>
              <h4 style={{fontFamily:serif,fontSize:21,fontWeight:400,color:"#fff",marginBottom:10,lineHeight:1.35}}>
                We've driven every route, stayed at every property, and visited every restaurant we recommend.
              </h4>
              <p style={{fontFamily:sans,fontSize:13.5,color:"rgba(255,255,255,0.6)",lineHeight:1.75,fontWeight:300}}>
                Southern Horizon isn't a business we designed from a desk — it's built from years of exploring Queensland's most 
                remarkable places. We started this because we wanted to share them properly — 
                not the rushed, bus-tour version, but the real thing. The boutique lodge with the sunrise view, the restaurant the locals 
                don't tell tourists about, the stretch of coast where you won't see another car. That's what we want to give you.
              </p>
            </div>
          </div>

        </div>
      </div>

      </>)}
      {activeSection === "enquiry" && (<>
      {/* ═══ ENQUIRY ═══ */}
      <div id="enquiry" style={{paddingTop:60}}>
        <div style={{
          background:`linear-gradient(135deg, #0B3D4E 0%, ${coast.primary} 22%, #3A8A6C 44%, #6B7B4E 56%, ${outback.primary} 78%, #6B2E08 100%)`,
          padding:"110px 28px",position:"relative",overflow:"hidden",
        }}>
          {/* Top wave */}
          <svg style={{position:"absolute",top:-1,left:0,width:"100%",height:70}} viewBox="0 0 1440 70" preserveAspectRatio="none">
            <path d="M0,0 L1440,0 L1440,30 C1200,70 960,10 720,40 C480,70 240,15 0,50Z" fill={neutral.white}/>
          </svg>
          <div style={{position:"absolute",inset:0,opacity:.03,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize:"128px",
          }}/>

          <div style={{maxWidth:660,margin:"0 auto",position:"relative",zIndex:1}}>
            <div style={{textAlign:"center",marginBottom:40}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:600,letterSpacing:5,textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:14}}>Get in Touch</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.5vw,42px)",fontWeight:400,color:"#fff",lineHeight:1.2,marginBottom:10}}>
                Start your <em style={{fontStyle:"italic"}}>journey</em>
              </h2>
              <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.45)",maxWidth:420,margin:"0 auto",lineHeight:1.7,fontWeight:300}}>
                Tell us where you want to go and we'll be in touch within 24 hours to start planning your trip.
              </p>
            </div>

            {formSubmitted?(
              <div style={{textAlign:"center",padding:"48px 28px",background:"rgba(255,255,255,0.06)",borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",animation:"fadeUp .5s"}}>
                <div style={{fontFamily:serif,fontSize:42,marginBottom:14,color:gold,fontWeight:300}}>✓</div>
                <h3 style={{fontFamily:serif,fontSize:22,fontWeight:400,color:"#fff",marginBottom:8}}>We've Got Your Details</h3>
                <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:300}}>You'll receive a confirmation email shortly. Troy or Jess will be in touch personally within 24 hours.</p>
              </div>
            ):(
              <div style={{display:"grid",gap:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",padding:"30px 26px",borderRadius:16}}>
                <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Name *</label>
                    <input value={formData.name} onChange={e=>setFormData(p=>({...p,name:e.target.value}))} style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}} placeholder="Full name"/></div>
                  <div><label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Email *</label>
                    <input type="email" value={formData.email} onChange={e=>setFormData(p=>({...p,email:e.target.value}))} style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}} placeholder="your@email.com"/></div>
                </div>
                <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Phone</label>
                    <input value={formData.phone} onChange={e=>setFormData(p=>({...p,phone:e.target.value}))} style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}} placeholder="+61 ..."/></div>
                  <div><label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Guests</label>
                    <select value={formData.guests} onChange={e=>setFormData(p=>({...p,guests:e.target.value}))}
                      style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:formData.guests?"#fff":"rgba(255,255,255,0.3)",borderRadius:8}}>
                      {["","1 adult","2 adults","3 adults","4 adults","1 adult + 1 child","1 adult + 2 children","1 adult + 3 children","2 adults + 1 child","2 adults + 2 children","2 adults + 3 children"].map(o=><option key={o} value={o} style={{background:"#1C1917",color:o?"#fff":"#A8A29E"}}>{o||"Select..."}</option>)}
                    </select></div>
                </div>
                <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Package</label>
                    <select value={formData.package} onChange={e=>setFormData(p=>({...p,package:e.target.value,duration:""}))}
                      style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:formData.package?"#fff":"rgba(255,255,255,0.3)",borderRadius:8}}>
                      {["","K'gari Experience","Tropical North","Coastal Explorer","Outback Queensland","Whitsundays","Outback Taster","Capricorn Coast","Carnarvon Gorge","Byron Bay","Stockton Beach","Custom Journey","Not sure yet"].map(o=><option key={o} value={o} style={{background:"#1C1917",color:o?"#fff":"#A8A29E"}}>{o||"Select..."}</option>)}
                    </select></div>
                  <div><label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Duration</label>
                    {(()=>{
                      const durOpts = {"K'gari Experience":["","5 days","6 days","7 days"],
                        "Tropical North":["","7 days","8 days","9 days","10 days"],
                        "Byron Bay":["","5 days","6 days","7 days"],
                        "Coastal Explorer":["","21 days"],
                        "Outback Queensland":["","21 days"],
                        "Whitsundays":["","7 days"],
                        "Outback Taster":["","7 days"],
                        "Capricorn Coast":["","7 days"],
                        "Carnarvon Gorge":["","7 days"],
                        "Stockton Beach":["","7 days"],
                        "Custom Journey":["","3 days","5 days","7 days","10 days","14 days","21 days","Other"],
                        "Not sure yet":["","Not sure yet"]};
                      const opts = durOpts[formData.package] || [""];
                      return <select value={formData.duration} onChange={e=>setFormData(p=>({...p,duration:e.target.value}))}
                        style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:formData.duration?"#fff":"rgba(255,255,255,0.3)",borderRadius:8}}>
                        {opts.map(o=><option key={o} value={o} style={{background:"#1C1917",color:o?"#fff":"#A8A29E"}}>{o||"Select..."}</option>)}
                      </select>;
                    })()}</div>
                </div>
                <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                  <div><label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Preferred Dates</label>
                    <select value={formData.dates} onChange={e=>setFormData(p=>({...p,dates:e.target.value}))}
                      style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:formData.dates?"#fff":"rgba(255,255,255,0.3)",borderRadius:8}}>
                      {["","June 2027","July 2027","August 2027","September 2027","October 2027","November 2027","December 2027","January 2028","February 2028","March 2028","April 2028","May 2028","Later in 2028","Flexible / not sure yet"].map(o=><option key={o} value={o} style={{background:"#1C1917",color:o?"#fff":"#A8A29E"}}>{o||"Select..."}</option>)}
                    </select></div>
                  <div/>
                </div>

                <div>
                  <label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Special Requirements</label>
                  <input value={formData.specialNeeds} onChange={e=>setFormData(p=>({...p,specialNeeds:e.target.value}))}
                    style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}} placeholder="e.g. mobility, medical..."/>
                </div>
                <div>
                  <label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:10,display:"block"}}>Children's Equipment (optional)</label>
                  <div style={{display:"flex",flexDirection:"column",gap:10}}>
                    {[
                      {k:"childSeats",label:"Child seats / booster seats (arranged via Kidsafe QLD)"},
                    ].map(item=>(
                      <label key={item.k} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
                        <div onClick={()=>setFormData(p=>({...p,[item.k]:!p[item.k]}))}
                          style={{width:20,height:20,borderRadius:4,border:formData[item.k]?`2px solid ${gold}`:"2px solid rgba(255,255,255,0.2)",
                            background:formData[item.k]?gold:"rgba(255,255,255,0.05)",display:"flex",alignItems:"center",justifyContent:"center",
                            flexShrink:0,transition:"all .2s",cursor:"pointer"}}>
                          {formData[item.k] && <span style={{color:"#fff",fontSize:12,fontWeight:700}}>✓</span>}
                        </div>
                        <span style={{fontFamily:sans,fontSize:12.5,color:"rgba(255,255,255,0.5)",fontWeight:300}}>{item.label}</span>
                      </label>
                    ))}
                  </div>
                </div>
                <div>
                  <label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Tell Us More</label>
                  <textarea value={formData.message} onChange={e=>setFormData(p=>({...p,message:e.target.value}))}
                    style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}}
                    placeholder="Coast, outback, or both? How long? Any specific destinations? We'd love to hear."/>
                </div>
                <button className="btn-dual" onClick={handleSubmit} disabled={formSubmitting} style={{width:"100%",marginTop:4,opacity:formSubmitting?0.7:1}}>
                  {formSubmitting ? "Sending..." : "Send Enquiry"}
                </button>
                <p style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.2)",textAlign:"center",fontWeight:300}}>We respond to every enquiry personally within 24 hours.</p>
              </div>
            )}
          </div>
        </div>
      </div>

      </>)}
      {/* ═══ ROUTE GUIDE MODAL ═══ */}
      {routeGuide && (
        <div onClick={()=>setRouteGuide(null)} style={{
          position:"fixed",inset:0,zIndex:1000,background:"rgba(28,25,23,0.6)",
          backdropFilter:"blur(6px)",display:"flex",alignItems:"center",justifyContent:"center",
          padding:20,animation:"fadeIn .2s",
        }}>
          <div onClick={e=>e.stopPropagation()} style={{
            background:neutral.white,borderRadius:18,maxWidth:720,width:"100%",
            maxHeight:"85vh",overflow:"hidden",display:"flex",flexDirection:"column",
            boxShadow:"0 32px 80px rgba(0,0,0,0.2)",
          }}>
            {/* Modal header */}
            <div style={{
              padding:"28px 32px 20px",
              borderBottom:`1px solid ${neutral.border}`,
              background:routeGuide.vibe==="coast"?coast.soft:routeGuide.vibe==="outback"?outback.soft:"#F8F6F0",
              position:"relative",flexShrink:0,
            }}>
              <div onClick={()=>setRouteGuide(null)} style={{
                position:"absolute",top:16,right:20,width:32,height:32,borderRadius:8,
                background:"rgba(0,0,0,0.06)",display:"flex",alignItems:"center",justifyContent:"center",
                cursor:"pointer",fontSize:16,color:neutral.mid,transition:"background .2s",
              }}
              onMouseEnter={e=>e.target.style.background="rgba(0,0,0,0.12)"}
              onMouseLeave={e=>e.target.style.background="rgba(0,0,0,0.06)"}>✕</div>
              <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",
                color:routeGuide.vibe==="coast"?coast.primary:routeGuide.vibe==="outback"?outback.primary:"#6B7B4E",
                marginBottom:6,
              }}>Route Guide</div>
              <h3 style={{fontFamily:serif,fontSize:26,fontWeight:700,color:neutral.dark,marginBottom:4}}>{routeGuide.name}</h3>
              <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,fontWeight:300}}>
                {routeGuide.route} &nbsp;·&nbsp; {routeGuide.duration} &nbsp;·&nbsp; {routeGuide.guests}
              </p>
            </div>

            {/* Modal scrollable body */}
            <div style={{overflowY:"auto",padding:"24px 32px 32px",flex:1}}>
              <p style={{fontFamily:sans,fontSize:13,color:neutral.light,marginBottom:24,fontWeight:300,fontStyle:"italic"}}>
                This is a sample itinerary — every trip is personalised. Days and stops can be adjusted, extended, or rearranged to suit your pace. 
                Luxury accommodation with breakfast is included at every stop. Fuel card provided. We curate a dining guide of our favourite restaurants at each stop — dinner is at your own leisure. $1,500/day.
              </p>

              {routeGuide.stops.map((stop, i) => {
                const isHighlight = stop.type === "highlight";
                const stopAccent = routeGuide.vibe==="coast"?coast.primary:routeGuide.vibe==="outback"?outback.primary:"#6B7B4E";
                return (
                  <div key={i} style={{
                    display:"flex",gap:20,marginBottom:i<routeGuide.stops.length-1?0:0,
                  }}>
                    {/* Timeline */}
                    <div style={{display:"flex",flexDirection:"column",alignItems:"center",flexShrink:0,width:28}}>
                      <div style={{
                        width:isHighlight?14:10,height:isHighlight?14:10,borderRadius:7,flexShrink:0,
                        background:isHighlight?stopAccent:neutral.border,
                        border:isHighlight?`2px solid ${stopAccent}`:"2px solid "+neutral.border,
                        boxShadow:isHighlight?`0 0 0 4px ${stopAccent}18`:"none",
                      }}/>
                      {i<routeGuide.stops.length-1 && (
                        <div style={{width:2,flex:1,minHeight:20,
                          background:routeGuide.vibe==="both"
                            ?`linear-gradient(to bottom,${coast.primary}30,${outback.primary}30)`
                            :`${stopAccent}20`,
                        }}/>
                      )}
                    </div>

                    {/* Stop content */}
                    <div style={{
                      flex:1,paddingBottom:i<routeGuide.stops.length-1?28:0,
                    }}>
                      <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:6,flexWrap:"wrap"}}>
                        <span style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",
                          color:stopAccent,background:`${stopAccent}10`,padding:"3px 8px",borderRadius:4,
                        }}>{stop.day}</span>
                        {isHighlight && (
                          <span style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",
                            color:"#fff",background:stopAccent,padding:"3px 8px",borderRadius:4,
                          }}>Highlight</span>
                        )}
                      </div>
                      <h4 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:neutral.dark,marginBottom:6}}>{stop.name}</h4>
                      <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:12}}>{stop.desc}</p>

                      <div style={{display:"grid",gridTemplateColumns:stop.stay.includes("|")?"1fr 1fr 1fr":"1fr 1fr",gap:10}}>
                        {stop.stay.includes("|") ? (
                          <>
                            <div style={{padding:"10px 14px",background:coast.soft,borderRadius:8,borderLeft:`3px solid ${coast.primary}`}}>
                              <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:coast.primary,marginBottom:4}}>Camp</div>
                              <p style={{fontFamily:sans,fontSize:12,color:neutral.mid,lineHeight:1.5,fontWeight:300}}>{stop.stay.split("|")[0].replace("Camp:","").trim()}</p>
                            </div>
                            <div style={{padding:"10px 14px",background:outback.soft,borderRadius:8,borderLeft:`3px solid ${outback.primary}`}}>
                              <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:outback.primary,marginBottom:4}}>Accommodation</div>
                              <p style={{fontFamily:sans,fontSize:12,color:neutral.mid,lineHeight:1.5,fontWeight:300}}>{stop.stay.split("|")[1].replace("Accom:","").trim()}</p>
                            </div>
                          </>
                        ) : (
                          <div style={{padding:"10px 14px",background:neutral.sand,borderRadius:8}}>
                            <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:neutral.light,marginBottom:4}}>Stay</div>
                            <p style={{fontFamily:sans,fontSize:12,color:neutral.mid,lineHeight:1.5,fontWeight:300}}>{stop.stay}</p>
                          </div>
                        )}
                        <div style={{padding:"10px 14px",background:neutral.sand,borderRadius:8}}>
                          <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:neutral.light,marginBottom:4}}>Eat & Drink</div>
                          <p style={{fontFamily:sans,fontSize:12,color:neutral.mid,lineHeight:1.5,fontWeight:300}}>{stop.eat}</p>
                        </div>
                      </div>
                      {stop.source && (
                        <div style={{marginTop:6,fontFamily:sans,fontSize:10.5,color:neutral.light,fontStyle:"italic"}}>
                          Book via: {stop.source}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Bottom CTA */}
              <div style={{
                marginTop:32,padding:"24px 28px",borderRadius:8,textAlign:"center",
                background:routeGuide.vibe==="coast"?coast.soft:routeGuide.vibe==="outback"?outback.soft:"#F8F6F0",
              }}>
                <p style={{fontFamily:serif,fontSize:17,fontWeight:400,color:neutral.dark,marginBottom:12,fontStyle:"italic"}}>
                  Like what you see?
                </p>
                <button className="btn-dual" onClick={()=>{setRouteGuide(null);goTo("enquiry")}}
                  style={{fontSize:11,padding:"13px 32px"}}>
                  Enquire Now
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ FOOTER ═══ */}
      <footer style={{background:neutral.dark,padding:"48px 24px 28px"}}>
        <div style={{maxWidth:1100,margin:"0 auto"}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:32,paddingBottom:28,borderBottom:"1px solid rgba(255,255,255,0.06)"}}>
            <div>
              <div style={{display:"flex",alignItems:"center",gap:10,marginBottom:10}}>
                <SHCoLogo size={38} light/>
                <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{fontFamily:serif,fontSize:20,fontWeight:400,color:"#fff",letterSpacing:0.5}}>Southern Horizon</span>
                <span style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
                  background:`linear-gradient(90deg,${coast.accent},${outback.accent})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                }}>Co.</span>
                </div>
              </div>
              <p style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,0.25)",maxWidth:240,lineHeight:1.65,fontWeight:300}}>
                Self-drive luxury touring across<br/>Queensland's coast, tropics & outback — and beyond.
              </p>
            </div>
            <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
              <div>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.18)",marginBottom:10}}>Navigate</div>
                {SECTIONS.slice(0,5).map(s=>(
                  <div key={s.id} onClick={()=>goTo(s.id)} style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,0.3)",cursor:"pointer",padding:"3px 0"}}
                    onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.3)"}>{s.label}</div>
                ))}
              </div>
              <div>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.18)",marginBottom:10}}>Info</div>
                {SECTIONS.slice(5).map(s=>(
                  <div key={s.id} onClick={()=>goTo(s.id)} style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,0.3)",cursor:"pointer",padding:"3px 0"}}
                    onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.3)"}>{s.label}</div>
                ))}
              </div>
              <div>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.18)",marginBottom:10}}>Base</div>
                <p style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,0.3)",lineHeight:1.65,fontWeight:300}}>Based in Banyo, Brisbane<br/>Delivery: BNE · OOL · MCY · CNS · SYD</p>
              </div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:18,flexWrap:"wrap",gap:10}}>
            <span style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.12)",fontWeight:300}}>© 2026 Southern Horizon Co. All rights reserved.</span>
            <span style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.25)",fontWeight:300}}>Coming Soon</span>
          </div>
        </div>
      </footer>
    </>
  );
}
