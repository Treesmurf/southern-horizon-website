import { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { doc, setDoc } from "firebase/firestore";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "experience", label: "The Experience" },
  { id: "packages", label: "Packages" },
  { id: "choose-mode", label: "Your Mode" },
  { id: "vehicle", label: "The Vehicle" },
  { id: "camping-gear", label: "Camping Gear" },
  { id: "itinerary", label: "Plan Your Trip" },
  { id: "food-drink", label: "Food & Drink" },
  { id: "special-needs", label: "Requirements" },
  { id: "faq", label: "FAQs" },
  { id: "about", label: "Meet Us" },
  { id: "enquiry", label: "Enquire" },
];

const FAQ_DATA = [
  {
    category: "Luggage & Packing",
    items: [
      { q: "How much luggage can I bring?", a: "In camping mode, up to 3 soft duffel bags — two in the boot around the camping modules and one on the rear middle seat, plus a day pack per person at your feet. In touring mode (no camping modules), the full boot is free so each passenger gets one soft bag, plus day packs at your feet. Either way, there's plenty of room." },
      { q: "What size bags?", a: "Soft duffel bags only — no hard-shell suitcases. Max 65cm × 40cm × 25cm (roughly 60–65L), one per passenger in touring mode. In camping mode, bags are shared between the group (max 3). A 65L duffel handles two weeks easily — swimwear and sunscreen on Monday, boots and layers by Friday." },
      { q: "Can I use the roof rack?", a: "The vehicle has a genuine Toyota roof platform with side rails. Roof storage is available on most routes, however it is strictly prohibited on sand island sections including K'gari (Fraser Island) due to soft sand driving. We'll advise based on your itinerary." },
      { q: "What should I pack?", a: "Pack for variety — that's the beauty of Australia. Swimwear, reef-safe sunscreen, a light rain jacket for the tropics, plus layers and closed shoes for cooler outback evenings. Hat, sunnies, insect repellent, and a camera are essentials everywhere. Leave formal wear and heavy luggage at home." },
    ],
  },
  {
    category: "The Vehicle",
    items: [
      { q: "What vehicle will I be driving?", a: "A Toyota LandCruiser 300 Series Sahara — twin-turbo V6 diesel, full-time 4WD, every luxury feature Toyota makes. It's equally at home cruising the coast to Cairns, crossing K'gari's beaches, or grinding through bulldust on the Birdsville Track." },
      { q: "Do I need 4WD experience?", a: "Not at all. The 300 Series makes off-road touring accessible with advanced traction control and terrain management. We provide a comprehensive vehicle briefing covering beach driving, sand, unsealed roads, water crossings, and outback conditions before you depart." },
      { q: "What's the camping setup?", a: "The Lawson Automotive INFINITY modular system — a premium false-floor with integrated PowerDeck lithium battery, fridge slide with slim drawer, prep table, base drawer module, and side wing kits. It clicks in and out without permanent modifications." },
      { q: "Is there phone coverage and internet?", a: "We provide a Telstra SIM card for best regional coverage across Australia, plus a Starlink satellite internet terminal. You'll stay connected from the Daintree Rainforest to the Simpson Desert — and everywhere in between." },
    ],
  },
  {
    category: "What's Included",
    items: [
      { q: "What's included in the daily rate?", a: "Everything. The $1,200 daily rate is the same in both modes — the LandCruiser, insurance, food, a pre-loaded Visa card for fuel and dining, Telstra SIM, Starlink, curated route, vehicle briefing, and 24/7 support. In camping mode, that covers over $12,000 worth of premium camping equipment — Lawson INFINITY modular system, ARB Zero fridge, Coleman Darkroom tent, Helinox chairs and table, Snow Peak and Jetboil cooking gear, Sea to Summit sleeping bags and mats — plus full food provisioning (every meal) and camp site fees. In touring mode, it covers luxury curated accommodation at every stop, road snacks in the vehicle, and a Visa card loaded with your fuel and dining budget for breakfast and dinner at curated restaurants. The rate is the same because premium camping gear is the accommodation equivalent." },
      { q: "How does accommodation work?", a: "It depends on your mode. In camping mode, everything you need to sleep is in the vehicle — tent, sleeping bags, mats, and lighting — and camp site fees are covered. In touring mode, luxury accommodation is included in your $1,200 daily rate. We curate handpicked options at every stop — outback stations, boutique lodges, coastal retreats, eco-lodges. You pick what appeals, we book everything. No research, no chasing availability, no extra charges." },
      { q: "Can I upgrade to ultra-luxury accommodation?", a: "Absolutely. Your $1,200 daily rate covers quality curated accommodation at every stop. If you'd like to upgrade to ultra-luxury properties — places like Silky Oaks Lodge in the Daintree, Elements of Byron, or Spicers Peak Lodge — we can arrange that as a supplement. Just mention it during your consultation and we'll present upgrade options alongside the standard inclusions at the relevant stops. You only pay the difference for the nights you choose to upgrade." },
      { q: "How does food work?", a: "In camping mode, your LandCruiser arrives fully stocked with everything — fresh produce, quality meats, pantry essentials, snacks, and cold drinks. That's breakfast, lunch, dinner, and everything in between. In touring mode, your vehicle is stocked with road snacks and drinks. Breakfast and dinner are at curated restaurants along your route — covered by your pre-loaded Visa card. We tell you the dining budget during your consultation, and any unspent balance is recovered at the end. For longer trips we map resupply points along your route." },
      { q: "How does fuel and dining work?", a: "Your LandCruiser comes with a pre-loaded Visa card that covers fuel and — in touring mode — dining at curated restaurants. In camping mode the card covers fuel only (all your food is provisioned). In touring mode it covers fuel plus your breakfast and dinner budget at restaurants in your route guide. We discuss the Visa limit during your consultation so there are no surprises. Unspent balance is recovered after your trip. For remote outback routes, we recommend also carrying some cash — a few roadhouses may not have EFTPOS." },
      { q: "Is there a security bond?", a: "Yes — a tiered bond system varies by package and configuration. Full details come with your booking enquiry. The bond is fully refundable subject to standard return conditions." },
    ],
  },
  {
    category: "Booking & Logistics",
    items: [
      { q: "How long can I hire for?", a: "Our signature touring packages are curated at 21 days — long enough to genuinely experience every stop, not just drive through. K'gari and Tropical North run 5–10 days for a more focused experience. We also offer 7-day regional packages — Whitsundays, Outback Taster, Capricorn Coast, Carnarvon Gorge, Byron Bay, and Stockton Beach. Want something shorter, longer, or completely custom? That's what the Custom Journey is for — minimum 3 days, no maximum." },
      { q: "Why is there a passenger limit?", a: "For comfort and safety. We cap at 4 adults or 2 adults and 3 children per trip. Outback and remote coastal touring involves long distances, variable road conditions, and limited access to services. Fewer passengers means more space in the cabin, better weight distribution for the vehicle, and a safer, more comfortable experience for everyone — especially on sand, corrugations, and unsealed roads." },
      { q: "Where do I pick up?", a: "You don't — we deliver to you. Your fully-stocked LandCruiser is brought directly to your arrival airport, hotel, or accommodation — Brisbane, Gold Coast, Sunshine Coast (Maroochydore), Cairns, or Sydney depending on your package. Flying into Maroochydore? You could be at Rainbow Beach by lunchtime. Landing at Gold Coast? Head straight for Byron Bay or north to K'gari. Flying into Cairns for the Tropical North? Your LandCruiser is waiting when you land. Already in Brisbane? We can deliver to your hotel, or you're welcome to collect from our yard in Banyo." },
      { q: "Can I drive on the beach?", a: "Absolutely — beach driving is part of the experience on K'gari and other coastal routes. Sand driving, tyre pressures, tide awareness, and recovery are all covered in your briefing. Required permits are arranged as part of your package." },
      { q: "How much driving is involved?", a: "We design every day with a maximum of four hours behind the wheel. Stops are chosen because they're worth seeing — not just places to sleep. Our 21-day signature packages give you genuine dwell time at every stop so you can explore, relax, and actually experience each destination. No rushed itineraries, no bus-tour pace." },
      { q: "What if something goes wrong?", a: "24/7 phone support, Telstra SIM for mobile coverage, Starlink for beyond-range areas, UHF radio. Emergency procedures and contacts are provided in your pre-departure briefing." },
    ],
  },
];

const PACKAGES = [
  {
    id: "kgari",
    name: "K'gari Experience",
    config: "Camping or Touring",
    duration: "5–7 Days",
    guests: "2–4 Guests",
    route: "Brisbane → K'gari (Fraser Island)",
    tagline: "The world's largest sand island by LandCruiser",
    description: "Focused adventure on an iconic destination. Drive 75 Mile Beach, swim crystal-clear perched lakes, explore rainforest growing in sand. Camp under the stars or stay at island resorts — or mix both. Add Hervey Bay for whale watching or extend to a full week at island pace.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "K'gari permits + barge", "Beach driving briefing", "Luxury accommodation included (touring)", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Rainbow Beach & Inskip Point", day: "Day 1", type: "transit", desc: "Drive north from Brisbane (3–4hrs). Air down tyres at Inskip Point and catch the barge across to K'gari's southern tip.", stay: "Camp: MV Sarawak, Inskip Peninsula (toilets) | Accom: Rainbow Beach accommodation", eat: "Rainbow Beach Surf Club before crossing", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Southern K'gari", day: "Days 2–3", type: "highlight", desc: "Lake McKenzie — arguably Australia's most beautiful freshwater lake. Crystal clear water, white silica sand. Central Station rainforest walk among towering satinay trees. Two nights to soak it in.", stay: "Camp: Central Station (flush toilets, showers, fenced, dingo-safe) | Accom: Kingfisher Bay Resort or Eurong Beach Resort", eat: "Self-catered at camp or resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "75 Mile Beach & East Coast", day: "Day 4", type: "highlight", desc: "Drive the sand highway up the east coast. Eli Creek (float down the crystal creek), the Maheno Shipwreck, and the Pinnacles coloured sand cliffs.", stay: "Camp: Dundubara (flush toilets, showers, fenced, fire rings) | Accom: Eurong Beach Resort or Sailfish on Fraser", eat: "Self-catered or resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Northern K'gari", day: "Day 5", type: "highlight", desc: "Indian Head — climb the headland for whale and dolphin spotting (seasonal). Champagne Pools — natural rock pools with waves crashing over. Lake Wabby — a perched lake slowly swallowed by a sand blow.", stay: "Camp: Waddy Point (flush toilets, showers, fenced, fire rings, beachfront) | Accom: Orchid Beach retreats", eat: "Self-catered — your fridge is still going strong", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Hervey Bay (optional extension)", day: "Days 6–7", type: "stop", desc: "Barge back to the mainland via River Heads. Hervey Bay — whale watching capital of Australia (Jul–Nov), Urangan Pier, relaxed waterfront town. A slower finish before heading south.", stay: "Camp: Hervey Bay caravan parks | Accom: Hervey Bay waterfront accommodation", eat: "The Black Dog Café, Coast Restaurant", source: "visitherveybaay.com.au" },
    ],
  },
  {
    id: "tropical-north",
    name: "Tropical North",
    config: "Camping or Touring",
    duration: "7–10 Days",
    guests: "2–4 Guests",
    route: "Cairns · Daintree · Cape Tribulation",
    tagline: "Where the rainforest meets the reef",
    description: "Start right in the tropics — we deliver your LandCruiser to Cairns Airport so you skip the drive north entirely. Explore Mossman Gorge, the Daintree, Cape Tribulation, Atherton Tablelands, and the reef. Camp surrounded by ancient rainforest, or choose touring mode and select from our curated eco-lodges and retreats at each stop.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "Cairns airport delivery included", "Luxury accommodation included (touring)", "All recovery & safety gear", "Tropical route guide", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Cairns", day: "Day 1", type: "transit", desc: "Your starting point. We deliver your LandCruiser to Cairns Airport and fly in to do your handover personally — full vehicle briefing, keys in your hand, fridge stocked.", stay: "Camp: Ellis Beach Oceanfront Bungalows (toilets, showers, beachfront) | Accom: Cairns or Palm Cove accommodation", eat: "Prawn Star, Salt House, Cairns Night Markets", source: "ellisbeach.com.au" },
      { name: "Port Douglas & Mossman Gorge", day: "Days 2–3", type: "highlight", desc: "Four Mile Beach, the Sunday markets, gateway to the Low Isles and outer reef. Mossman Gorge — Indigenous-guided Dreamtime walks, crystal-clear swimming hole among granite boulders.", stay: "Camp: Wonga Beach Camping Area — QPWS (composting toilets) | Accom: Port Douglas boutique accommodation", eat: "Zinc, Salsa Bar & Grill, Sunday markets for tropical fruit", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Daintree River & Rainforest", day: "Days 4–5", type: "highlight", desc: "Cable ferry across the Daintree River into the world's oldest rainforest. Croc-spotting river cruises, Daintree Discovery Centre canopy walk, hidden swimming holes.", stay: "Camp: Daintree Riverview Caravan Park (toilets, showers) | Accom: Daintree Eco Lodge or Silky Oaks Lodge", eat: "Daintree Ice Cream Company, Daintree Tea Company", source: "daintreeriverview.com.au" },
      { name: "Cape Tribulation", day: "Days 5–6", type: "highlight", desc: "Where the rainforest meets the reef — literally. Swim off the beach with the canopy at your back. Night walks for wildlife. Dubuji Boardwalk through the mangroves.", stay: "Camp: Noah Beach — QPWS (composting toilets, 15 sites, book ahead) | Accom: Cape Trib Beach House or Ferntree Rainforest Lodge", eat: "Whet Café Cape Tribulation, self-catered at camp", source: "QPWS — book via qld.gov.au/camping (closed wet season Dec–Apr)" },
      { name: "Atherton Tablelands", day: "Days 7–8", type: "stop", desc: "Head inland and up. Curtain Fig Tree, Millaa Millaa Falls, Lake Eacham crater lake, Yungaburra platypus viewing at dawn, Millstream Falls — widest single-drop waterfall in Australia.", stay: "Camp: Lake Tinaroo — Downfall Creek (toilets, QPWS) | Accom: Yungaburra or Atherton Tablelands accommodation", eat: "Nick's Swiss-Italian Restaurant Yungaburra, Gallo Dairyland", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Cairns (return)", day: "Days 9–10", type: "highlight", desc: "Return to Cairns for the finale. Great Barrier Reef day trip. Kuranda Scenic Railway. Night markets, Esplanade lagoon. Drop the keys and fly home.", stay: "Camp: Ellis Beach (toilets, showers, beachfront) | Accom: Cairns or Palm Cove accommodation", eat: "Ochre Restaurant, Cairns Night Markets", source: "cairns.com.au" },
      { name: "Cooktown (optional extension)", day: "+2–3 Days", type: "stop", desc: "For the adventurous — continue north on the Bloomfield Track (4WD essential, subject to seasonal closure Dec–Apr). Remote beaches, Indigenous rock art at Split Rock. Discussed during your booking consultation.", stay: "Camp: Rinyirru (Lakefield) NP — Kalpowar Crossing (toilets, QPWS) | Accom: Cooktown accommodation", eat: "The Bowls Club (surprisingly good), Cooktown RSL", source: "QPWS / cooktowncaravanpark.com.au" },
    ],
  },
  {
    id: "whitsundays",
    name: "Whitsundays",
    config: "Camping or Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Proserpine / Mackay · Airlie Beach · Cape Hillsborough",
    tagline: "Islands, reef, and kangaroos on the beach",
    description: "Fly into Proserpine or Mackay and head straight for the Whitsundays. Three nights based at Airlie Beach — day trip to Whitehaven Beach, sailing, snorkelling the reef. Then south to Cape Hillsborough for sunrise kangaroos on the beach, and finish in Mackay. Short, focused, and unforgettable.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "Luxury accommodation included (touring)", "All recovery & safety gear", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Airlie Beach", day: "Days 1–3", type: "highlight", desc: "Gateway to the Whitsunday Islands. Day trip to Whitehaven Beach — consistently rated one of the world's best beaches. Sailing, kayaking, snorkelling the outer reef. Whitsunday Great Walk. Three nights to do it justice.", stay: "Camp: BIG4 Adventure Whitsunday Resort (toilets, showers, pool) | Accom: Airlie Beach accommodation", eat: "Fish D'vine, Mr Bones, Northerlies Beach Bar", source: "big4.com.au" },
      { name: "Cape Hillsborough", day: "Days 4–5", type: "highlight", desc: "Cape Hillsborough National Park — kangaroos and wallabies on the beach at sunrise. One of Queensland's most iconic wildlife encounters. Eungella National Park platypus viewing nearby.", stay: "Camp: Cape Hillsborough Nature Tourist Park (toilets, showers, beachfront) | Accom: Cape Hillsborough lodge accommodation", eat: "The Dispensary Mackay, Foodspace", source: "capehillsboroughnatureresort.com.au" },
      { name: "Mackay", day: "Days 6–7", type: "stop", desc: "Bluewater Lagoon, Harbour Beach, and the botanical gardens. A relaxed finish before drop-off. We collect the vehicle from Mackay.", stay: "Camp: Mackay caravan parks | Accom: Mackay accommodation", eat: "The Dispensary, Burp Eat Dessert", source: "mackayregion.com" },
    ],
  },
  {
    id: "capricorn-coast",
    name: "Capricorn Coast",
    config: "Camping or Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Rockhampton · Yeppoon · 1770 & Agnes Water",
    tagline: "Reef islands, headland walks, and Queensland's most northerly surf",
    description: "Fly into Rockhampton and head for the coast. Yeppoon Lagoon, Great Keppel Island day trip, Capricorn Caves. Then south to the Town of 1770 and Agnes Water — Queensland's most northerly surf beach, Lady Musgrave Island on the southern Great Barrier Reef. A week of coast without the crowds.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "Luxury accommodation included (touring)", "All recovery & safety gear", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Yeppoon & Capricorn Coast", day: "Days 1–3", type: "highlight", desc: "Yeppoon Lagoon, Bluff Point walk. Day trip to Great Keppel Island by ferry — pristine beaches, snorkelling, bushwalks. Capricorn Caves — natural limestone cathedral.", stay: "Camp: Farnborough Beach Caravan Park (toilets, showers) | Accom: Yeppoon waterfront accommodation", eat: "Waterline Restaurant Yeppoon, The Strand Hotel", source: "farnboroughbeach.com.au" },
      { name: "1770 & Agnes Water", day: "Days 4–6", type: "highlight", desc: "Town of 1770 — where Captain Cook first set foot in Queensland. Agnes Water — most northerly surf beach. Lady Musgrave Island day trip — southern Great Barrier Reef with pristine coral. Three nights.", stay: "Camp: 1770 Camping Ground (toilets, showers) | Accom: Agnes Water or 1770 accommodation", eat: "The Tree Bar at 1770, Getaway Garden Café", source: "1770campingground.com.au" },
      { name: "Rockhampton", day: "Day 7", type: "transit", desc: "Back to Rocky for drop-off. Capricorn Caves if you haven't done them, Great Western Hotel for a last outback pub meal.", stay: "Home", eat: "Great Western Hotel", source: "capricorncaves.com.au" },
    ],
  },
  {
    id: "byron-bay",
    name: "Byron Bay",
    config: "Camping or Touring",
    duration: "5–7 Days",
    guests: "2–4 Guests",
    route: "Gold Coast / Ballina · Byron Bay · Yamba",
    tagline: "Lighthouse walks, beach driving, and Australia's most laid-back coast",
    description: "Pick up from Gold Coast or Ballina airport and head straight for Byron Bay. Cape Byron lighthouse, The Pass, The Farm. South to Air Force Beach for a taste of sand driving — no permit needed. Then Yamba, consistently rated one of Australia's best small towns. Short, coastal, and completely relaxed.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "Luxury accommodation included (touring)", "Beach driving briefing", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Byron Bay", day: "Days 1–2", type: "highlight", desc: "Cape Byron lighthouse — most easterly point of mainland Australia. Sunrise walk, The Pass for surfing, Main Beach for swimming. The Farm for produce-driven dining. Two nights to soak it in.", stay: "Camp: First Sun Holiday Park Byron Bay (toilets, showers, pool) | Accom: Byron Bay accommodation", eat: "The Balcony Bar & Oyster Co, Three Blue Ducks at The Farm", source: "firstsunbyronbay.com.au" },
      { name: "Ballina & Air Force Beach", day: "Day 3", type: "stop", desc: "South to Air Force Beach — 4.6km stretch of beach driving, no permit required, free access. Easy sand driving introduction. Richmond River, Ballina waterfront.", stay: "Camp: Flat Rock Tent Park Evans Head (toilets, showers, beachfront) | Accom: Ballina accommodation", eat: "Wharf Bar & Restaurant Ballina", source: "flatrocktentpark.com.au" },
      { name: "Yamba", day: "Days 4–5", type: "highlight", desc: "Consistently rated one of Australia's best small towns. Angourie — NSW's first surfing reserve, blue and green freshwater pools in the rock shelves. Fish and chips on the headland. Proper dwell time.", stay: "Camp: Blue Dolphin Holiday Resort Yamba (toilets, showers, pool) | Accom: Yamba accommodation", eat: "Beachwood Café, Pacific Hotel Yamba (sunset on the deck)", source: "bluedolphinholidayresort.com.au" },
      { name: "Return", day: "Days 6–7", type: "transit", desc: "Drive back to Gold Coast or Ballina for drop-off. Optional extra night in Byron or the hinterland if you're not ready to leave.", stay: "Camp: Byron Bay or hinterland parks | Accom: Byron Bay or Gold Coast accommodation", eat: "Your choice — one last café stop", source: "" },
    ],
  },
  {
    id: "stockton-beach",
    name: "Stockton Beach",
    config: "Camping or Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Sydney / Newcastle · Port Stephens · Hunter Valley",
    tagline: "Australia's largest coastal dunes, dolphins, and wine country",
    description: "The NSW 4WD highlight. Fly into Sydney or Newcastle and head for Worimi Conservation Lands — 19km of beach driving through massive sand dunes, Tin City, and WWII relics. Nelson Bay for dolphins. Then inland to the Hunter Valley for cellar doors and vineyard stays. Beach, sand, and wine in one week.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "Stockton Beach 4WD permit", "Luxury accommodation included (touring)", "Beach driving briefing", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Newcastle", day: "Day 1", type: "transit", desc: "Fly into Sydney or Newcastle. Bathers Way walk — Nobbys Beach, Bogey Hole (convict-cut ocean bath), Merewether Ocean Baths. Street art, craft beer scene.", stay: "Camp: Newcastle caravan parks | Accom: Newcastle accommodation (Merewether or inner city)", eat: "Merewether Surfhouse, The Edwards", source: "visitnewcastle.com.au" },
      { name: "Stockton Beach & Port Stephens", day: "Days 2–4", type: "highlight", desc: "Worimi Conservation Lands — 19km of beach driving, massive sand dune system, Tin City (fishermen's shacks built from shipwreck tin), WWII defence relics. Nelson Bay for dolphins, whale watching (seasonal). Tomaree Head Summit walk. Three nights.", stay: "Camp: Halifax Holiday Park Nelson Bay (toilets, showers, pool) | Accom: Port Stephens accommodation", eat: "Inner Lighthouse Café Nelson Bay, The Retreat Port Stephens", source: "worimiconservationlands.com" },
      { name: "Hunter Valley", day: "Days 5–6", type: "highlight", desc: "Wine country. Tyrrell's, Brokenback Range views, cellar door tastings. A deliberate change of pace — put the 4WD in the background for a day. Two nights among the vineyards.", stay: "Camp: Hunter Valley caravan parks | Accom: Hunter Valley vineyard lodges or boutique stays", eat: "Muse Restaurant, Margan Restaurant", source: "huntervalley.com.au" },
      { name: "Return", day: "Day 7", type: "transit", desc: "Drive back to Sydney or Newcastle for drop-off. We collect the vehicle.", stay: "Home", eat: "Celebration lunch", source: "" },
    ],
  },
  {
    id: "coastal-explorer",
    name: "Coastal Explorer",
    config: "Camping or Touring",
    duration: "21 Days",
    guests: "2–4 Guests",
    route: "Brisbane → K'gari → Cairns",
    tagline: "The full Queensland coastline — beaches, rainforest, and reef",
    description: "Our signature coastal journey. Head north from Brisbane, cross to K'gari for world-class beach driving, then wind up through the Whitsundays and into Tropical North Queensland. Camp on the beach, stay in coastal resorts, or mix both — every stop gets genuine dwell time. Finish in Cairns and fly home.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "K'gari permits + barge", "All recovery & safety gear", "Luxury accommodation included (touring)", "Coastal route guide", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Rainbow Beach & Inskip", day: "Day 1", type: "transit", desc: "Barge departure point for K'gari. Air down tyres at Inskip Point and get your first taste of coastal sand driving.", stay: "Camp: MV Sarawak or SS Dorrigo, Inskip Peninsula (toilets) | Accom: Rainbow Beach accommodation", eat: "Rainbow Beach Surf Club, Waterview Bistro", source: "QPWS — book via qld.gov.au/camping" },
      { name: "K'gari (Fraser Island)", day: "Days 2–4", type: "highlight", desc: "75 Mile Beach highway, Lake McKenzie, Lake Wabby, Eli Creek, Central Station rainforest walk, Indian Head lookout, Champagne Pools. Three nights on the island.", stay: "Camp: Central Station or Dundubara (flush toilets, showers, fenced) | Accom: Kingfisher Bay Resort or Eurong Beach Resort", eat: "Self-catered at camp or resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Bundaberg & 1770", day: "Days 5–6", type: "stop", desc: "Back on the mainland. Mon Repos Turtle Centre (seasonal Nov–Mar). Town of 1770 and Agnes Water — Queensland's most northerly surf beach. Lady Musgrave Island day trip available.", stay: "Camp: 1770 Camping Ground (toilets, showers) | Accom: Agnes Water or 1770 accommodation", eat: "The Tree Bar at 1770, Getaway Garden Café Agnes Water", source: "1770campingground.com.au" },
      { name: "Yeppoon & Capricorn Coast", day: "Days 7–8", type: "stop", desc: "Capricorn Coast. Yeppoon Lagoon, Bluff Point walk. Day trip to Great Keppel Island by ferry — pristine beaches, snorkelling, bushwalks.", stay: "Camp: Farnborough Beach Caravan Park (toilets, showers) | Accom: Yeppoon waterfront accommodation", eat: "Waterline Restaurant Yeppoon, The Strand Hotel", source: "QPWS / farnboroughbeach.com.au" },
      { name: "Mackay & Cape Hillsborough", day: "Days 9–10", type: "highlight", desc: "Cape Hillsborough National Park — kangaroos and wallabies on the beach at sunrise. Eungella National Park platypus viewing. Mackay's Bluewater Lagoon.", stay: "Camp: Cape Hillsborough Nature Tourist Park (toilets, showers, beachfront) | Accom: Mackay or Cape Hillsborough lodge", eat: "The Dispensary Mackay, Foodspace", source: "capehillsboroughnatureresort.com.au" },
      { name: "Airlie Beach & Whitsundays", day: "Days 11–13", type: "highlight", desc: "Gateway to the Whitsunday Islands. Day trip to Whitehaven Beach. Sailing, kayaking, Whitsunday Great Walk. Three nights to do it justice.", stay: "Camp: BIG4 Adventure Whitsunday Resort (toilets, showers, pool) | Accom: Airlie Beach or island accommodation", eat: "Fish D'vine, Mr Bones, Northerlies Beach Bar", source: "big4.com.au / QPWS" },
      { name: "Townsville & Magnetic Island", day: "Days 14–15", type: "stop", desc: "The Strand waterfront, Castle Hill lookout. Ferry to Magnetic Island — Forts Walk (WWII fortifications with wild koalas), secluded bays.", stay: "Camp: Rowes Bay Caravan Park (toilets, showers, beachfront) | Accom: Townsville or Magnetic Island accommodation", eat: "A Touch of Salt, Longboard Bar & Grill", source: "rowesbaycaravanpark.com.au" },
      { name: "Mission Beach", day: "Days 16–17", type: "stop", desc: "Cassowary country. Rainforest meets the reef. Licuala Fan Palm track, cassowary spotting, uncrowded tropical beaches. Dunk Island day trip available.", stay: "Camp: Beachcomber Coconut Caravan Village (toilets, showers, beachfront) | Accom: Mission Beach accommodation", eat: "Garage Bar & Grill, New Deli Mission Beach", source: "beachcombercoconut.com.au" },
      { name: "Cairns", day: "Days 18–21", type: "highlight", desc: "Journey's end — four nights to explore properly. Great Barrier Reef day trip, Kuranda Scenic Railway, night markets. We fly up to collect the vehicle — just drop the keys and catch your flight home.", stay: "Camp: Ellis Beach Oceanfront Bungalows (toilets, showers, beachfront) | Accom: Cairns or Palm Cove accommodation", eat: "Prawn Star (floating seafood bar), Ochre Restaurant, Cairns Night Markets", source: "ellisbeach.com.au" },
    ],
  },
  {
    id: "outback-taster",
    name: "Outback Taster",
    config: "Camping or Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Longreach · Winton",
    tagline: "Dinosaurs, stargazing, and the Qantas story — without the 21-day commitment",
    description: "Fly into Longreach and dive straight into outback Queensland's highlights. Qantas Founders Museum, Australian Age of Dinosaurs on the mesa at Winton, Thomson River sunset cruise. All the best of the Red Centre route in one focused week. All sealed roads, every leg under four hours.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "Luxury accommodation included (touring)", "All recovery & safety gear", "Remote route mapping", "24/7 satellite support"],
    vibe: "outback",
    stops: [
      { name: "Longreach", day: "Days 1–3", type: "highlight", desc: "Heart of outback Queensland. Qantas Founders Museum — walk through a 747 and 707 on the tarmac. Australian Stockman's Hall of Fame. Thomson River sunset cruise with camp oven dinner. Three nights to soak it in.", stay: "Camp: Longreach Tourist Park (toilets, showers, pool, camp kitchen) | Accom: Longreach accommodation or station stays", eat: "Harry's at the Australian Hotel, Merino Bakery", source: "longreachtouristpark.com.au" },
      { name: "Winton", day: "Days 4–5", type: "highlight", desc: "Dinosaur country. Australian Age of Dinosaurs — perched on a mesa, hands-on fossil prep lab. Lark Quarry dinosaur stampede trackways. Waltzing Matilda Centre. North Gregory Hotel.", stay: "Camp: Pelican Waters Caravan Park (toilets, showers, pool) | Accom: Winton accommodation", eat: "The North Gregory Hotel Winton", source: "pelicanwaterswinton.com.au" },
      { name: "Longreach (return)", day: "Days 6–7", type: "stop", desc: "Return to Longreach for anything you missed. Stockman's Hall of Fame if you haven't done it, or just sit on the verandah and watch the outback. Fly home from Longreach.", stay: "Camp: Longreach Tourist Park | Accom: Longreach accommodation", eat: "Harry's at the Australian Hotel", source: "longreachtouristpark.com.au" },
    ],
  },
  {
    id: "carnarvon-gorge",
    name: "Carnarvon Gorge",
    config: "Camping or Touring",
    duration: "7 Days",
    guests: "2–4 Guests",
    route: "Emerald · Carnarvon Gorge · Blackall",
    tagline: "Ancient rock art, sandstone cathedrals, and outback silence",
    description: "Fly into Emerald and head for the gorge. Four nights at Carnarvon Gorge — 30km sandstone gorge with Aboriginal rock art, moss gardens, the Amphitheatre, Ward's Canyon. Multiple day-walks. Bookended by sapphire fossicking at Rubyvale and outback hospitality at Blackall. A short, deep outback immersion.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "Luxury accommodation included (touring)", "All recovery & safety gear", "Remote route mapping", "24/7 satellite support"],
    vibe: "outback",
    stops: [
      { name: "Rubyvale & Gemfields", day: "Day 1", type: "stop", desc: "Fly into Emerald, drive to Rubyvale. Sapphire fossicking — try your luck hands-on. A different kind of treasure hunt before the gorge.", stay: "Camp: Rubyvale Gem Caravan Park (toilets, showers) | Accom: Rubyvale or Emerald accommodation", eat: "Rubyvale Gem Gallery café", source: "rubyvalegem.com.au" },
      { name: "Carnarvon Gorge", day: "Days 2–5", type: "highlight", desc: "The showstopper. 30km sandstone gorge with Aboriginal rock art (Art Gallery, Cathedral Cave), moss gardens, the Amphitheatre, Ward's Canyon. Multiple day-walks — each one different. Four nights minimum to do it justice.", stay: "Camp: Breeze Holiday Parks Carnarvon Gorge (toilets, showers, camp kitchen — open year-round) | Accom: Breeze Holiday Parks cabins or Carnarvon Gorge Wilderness Lodge", eat: "Breeze Holiday Parks bush bar & roast dinners, self-catered at camp", source: "breezeholidayparks.com.au" },
      { name: "Blackall", day: "Days 6–7", type: "stop", desc: "West to Blackall. Home of the Black Stump, Jackie Howe shearing memorial, artesian aquatic centre. Proper outback hospitality before flying home from Longreach or Emerald.", stay: "Camp: Blackall Caravan Park (toilets, showers) | Accom: Acacia Motor Inn Blackall", eat: "Blackall Hotel, Barcoo River Café", source: "blackall-tambo.qld.gov.au" },
    ],
  },
  {
    id: "outback",
    name: "Red Centre & Outback",
    config: "Camping or Touring",
    duration: "21 Days",
    guests: "2–4 Guests",
    route: "Brisbane → Longreach · Winton · Carnarvon Gorge",
    tagline: "Stargazing, dinosaurs, and silence you can't find on the coast",
    description: "Head west into outback Queensland's heartland. Artesian spas under the stars, the Qantas birthplace, dinosaur fossils on a mesa, and a 30km sandstone gorge with ancient rock art. Camp under outback skies or stay in outback pubs, stations, and lodges — or mix both. All on sealed roads with every leg under four hours. The Birdsville Extension is available for experienced guests by request.",
    includes: ["LandCruiser 300 Series Sahara", "Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "All recovery & safety gear", "Luxury accommodation included (touring)", "Remote route & water mapping", "24/7 satellite support"],
    vibe: "outback",
    stops: [
      { name: "Toowoomba", day: "Day 1", type: "transit", desc: "Up and over the Great Dividing Range. Picnic Point lookout over the Lockyer Valley. Queensland's Garden City — a deliberately gentle start before the landscape strips back.", stay: "Camp: Toowoomba Showgrounds or caravan parks | Accom: Toowoomba accommodation", eat: "The Spotted Cow, Picnic Point café", source: "toowoombaregion.com.au" },
      { name: "Roma", day: "Day 2", type: "stop", desc: "Through the Darling Downs to Roma. The Big Rig night show — the story of Australia's first oil and gas discovery told with fire, light and sound.", stay: "Camp: Big Rig Tourist Park (toilets, showers) | Accom: Roma Explorers Inn or Roma accommodation", eat: "Roma on Bungil Gallery Café", source: "maranoa.qld.gov.au" },
      { name: "Mitchell & Charleville", day: "Days 3–4", type: "highlight", desc: "Mitchell — the Great Artesian Spa. Free hot mineral springs under the stars. Charleville — Cosmos Centre stargazing (some of the darkest skies in Australia), Bilby Experience (endangered bilbies up close).", stay: "Camp: Charleville Bush Caravan Park (toilets, showers) | Accom: Hotel Corones (heritage pub) or Charleville accommodation", eat: "Hotel Corones (heritage pub, famous staircase)", source: "charlevillebushcaravanpark.com.au" },
      { name: "Blackall", day: "Days 5–6", type: "stop", desc: "Home of the Black Stump. Jackie Howe memorial (hand-blade shearing world record, unbroken since 1892). Artesian aquatic centre. The landscape is properly red now.", stay: "Camp: Blackall Caravan Park (toilets, showers) | Accom: Acacia Motor Inn Blackall", eat: "Blackall Hotel, Barcoo River Café", source: "blackall-tambo.qld.gov.au" },
      { name: "Longreach", day: "Days 7–9", type: "highlight", desc: "Heart of outback Queensland. Qantas Founders Museum — walk through a 747 and 707 on the tarmac. Australian Stockman's Hall of Fame. Thomson River sunset cruise with camp oven dinner. Three nights minimum.", stay: "Camp: Longreach Tourist Park (toilets, showers, pool, camp kitchen) | Accom: Longreach accommodation or station stays", eat: "Harry's at the Australian Hotel, Merino Bakery", source: "longreachtouristpark.com.au" },
      { name: "Winton", day: "Days 10–12", type: "highlight", desc: "Dinosaur country. Australian Age of Dinosaurs — perched on a mesa, hands-on fossil prep lab. Lark Quarry dinosaur stampede trackways. Waltzing Matilda Centre. North Gregory Hotel — where Banjo Paterson first performed Waltzing Matilda.", stay: "Camp: Pelican Waters Caravan Park (toilets, showers, pool) or Bladensburg NP — Bough Shed Hole (toilets, QPWS) | Accom: Winton accommodation", eat: "The North Gregory Hotel Winton", source: "QPWS / pelicanwaterswinton.com.au" },
      { name: "Birdsville Extension", day: "+4–6 Days", type: "stop", desc: "For experienced guests only — by request. South from Winton through the Channel Country to Birdsville. The iconic Birdsville Hotel, Big Red sand dune at sunset, and the Simpson Desert on your doorstep. Remote, harsh, and unforgettable. This is genuine outback — long distances between fuel and water, unsealed roads, extreme heat. We assess your readiness during the booking consultation and won't approve this extension unless we're confident you're prepared. Return via the Diamantina Development Road or Birdsville Track.", stay: "Camp: Birdsville Caravan Park (toilets, showers) or bush camping (self-sufficient) | Accom: Birdsville Hotel", eat: "Birdsville Hotel (the only option — and worth the trip alone)", source: "birdsvillehotel.com.au" },
      { name: "Carnarvon Gorge", day: "Days 13–15", type: "highlight", desc: "The showstopper of inland Queensland. 30km sandstone gorge with Aboriginal rock art, moss gardens, the Amphitheatre, Ward's Canyon. Multiple day-walks. Three nights minimum.", stay: "Camp: Breeze Holiday Parks Carnarvon Gorge (toilets, showers, camp kitchen — open year-round) | Accom: Breeze Holiday Parks cabins or Carnarvon Gorge Wilderness Lodge", eat: "Breeze Holiday Parks bush bar & roast dinners, self-catered at camp", source: "breezeholidayparks.com.au" },
      { name: "Emerald & Gemfields", day: "Days 16–17", type: "stop", desc: "Rubyvale sapphire fossicking — try your luck hands-on. Tree of Knowledge at Barcaldine. The landscape transitions from red back to green.", stay: "Camp: Rubyvale Gem Caravan Park (toilets, showers) | Accom: Emerald accommodation", eat: "Emerald pubs, Rubyvale Gem Gallery café", source: "rubyvalegem.com.au" },
      { name: "Rockhampton", day: "Day 18", type: "stop", desc: "Capricorn Caves — natural limestone cathedral. Tropic of Capricorn marker. Great Western Hotel — bull riding on Friday nights.", stay: "Camp: Rockhampton caravan parks | Accom: Rockhampton accommodation", eat: "Great Western Hotel, Saigon Saigon", source: "capricorncaves.com.au" },
      { name: "Agnes Water & Bundaberg", day: "Days 19–20", type: "stop", desc: "Optional stops on the coastal run home. Agnes Water — most northerly surf beach in Queensland. Bundaberg rum distillery, Mon Repos turtle centre (seasonal). Watch the red dirt fade to green.", stay: "Camp: 1770 Camping Ground (toilets, showers) | Accom: Agnes Water or Bundaberg accommodation", eat: "The Tree Bar at 1770, Bundaberg Barrel", source: "1770campingground.com.au" },
      { name: "Brisbane", day: "Day 21", type: "transit", desc: "South through the coast to Brisbane. Drop the vehicle at our Banyo yard or your accommodation.", stay: "Home", eat: "Celebration dinner in Brisbane", source: "" },
    ],
  },
  {
    id: "custom",
    name: "Custom Journey",
    config: "Camping or Touring",
    duration: "Your Choice",
    guests: "2–4 Guests",
    route: "You decide",
    tagline: "Your trip, your way — we build it together",
    description: "Combine coast and outback. Explore one region in depth. Design something completely unique. Camping, accommodation, or both — in touring mode we present options at each stop and handle all the bookings. Want a shorter version of any signature tour, or something we haven't thought of? Minimum 3 days, no maximum.",
    includes: ["Camping or Touring — $1,200/day", "Food & drinks fully stocked", "Pre-loaded Visa card (fuel & dining)", "Telstra SIM + Starlink", "Personalised route consultation", "Luxury accommodation included (touring)", "All standard inclusions", "Flexible duration", "24/7 support"],
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
  const [formData, setFormData] = useState({ name:"",email:"",phone:"",guests:"",dates:"",package:"",dietary:"",specialNeeds:"",message:"",childSeats:false,childCutlery:false,bottleKit:false });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formSubmitting, setFormSubmitting] = useState(false);
  const [routeGuide, setRouteGuide] = useState(null);

  const goTo = id => { setActiveSection(id); setMobileMenuOpen(false); setRouteGuide(null); window.scrollTo(0,0); };
  const isHome = activeSection === "home";

  const toggleFaq = k => setOpenFaqs(p => ({ ...p, [k]: !p[k] }));
  const handleSubmit = async () => {
    setFormSubmitting(true);
    try {
      // Create booking in Firebase with status "enquiry"
      const id = "SH-" + Date.now().toString(36).toUpperCase();
      const pkgMap = {"K'gari Experience":"kgari","Tropical North":"tropical-north","Coastal Explorer":"coastal-explorer",
        "Red Centre & Outback":"outback","Whitsundays":"whitsundays","Outback Taster":"outback-taster",
        "Capricorn Coast":"capricorn-coast","Carnarvon Gorge":"carnarvon-gorge","Byron Bay":"byron-bay",
        "Stockton Beach":"stockton-beach","Custom Journey":"custom","Not sure yet":"custom"};
      const pkgId = pkgMap[formData.package] || "custom";
      const pkgData = {kgari:{days:5},["tropical-north"]:{days:7},["coastal-explorer"]:{days:21},outback:{days:21},
        whitsundays:{days:7},["outback-taster"]:{days:7},["capricorn-coast"]:{days:7},["carnarvon-gorge"]:{days:7},
        ["byron-bay"]:{days:5},["stockton-beach"]:{days:7},custom:{days:7}};

      await setDoc(doc(db, "bookings", id), {
        status: "enquiry", createdAt: new Date().toISOString(),
        guestName: formData.name, guestEmail: formData.email, guestPhone: formData.phone,
        guestCount: formData.guests || "2 adults (couple)",
        packageId: pkgId, startDate: "", totalDays: pkgData[pkgId]?.days || 7,
        stops: [], supplements: 0, notes: "",
        dietary: formData.dietary, specialNeeds: formData.specialNeeds,
        message: formData.message, dates: formData.dates,
        childSeats: formData.childSeats || false,
        childCutlery: formData.childCutlery || false,
        bottleKit: formData.bottleKit || false,
      });

      // Also send email via Web3Forms
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Accept": "application/json" },
        body: JSON.stringify({
          access_key: "97ccfeb1-d44e-4773-bcbe-d2ad854bf675",
          subject: `SHCo Enquiry — ${formData.name || "New Guest"}`,
          from_name: "Southern Horizon Co. Website",
          "Booking ID": id,
          Name: formData.name, Email: formData.email, Phone: formData.phone,
          Guests: formData.guests, Dates: formData.dates, Package: formData.package,
          "Dietary Requirements": formData.dietary,
          "Special Requirements": formData.specialNeeds,
          "Child Seats": formData.childSeats ? "Yes" : "No",
          "Child Cutlery Sets": formData.childCutlery ? "Yes" : "No",
          "Bottle Steriliser & Brush Kit": formData.bottleKit ? "Yes" : "No",
          Message: formData.message,
        }),
      });
      setFormSubmitted(true);
    } catch (err) {
      console.error(err);
      alert("Something went wrong — please email us directly at troy.anderson@southernhorizonco.com.au");
    }
    setFormSubmitting(false);
  };

  const serif = `'Cormorant Garamond', 'Georgia', serif`;
  const sans = `'Figtree', 'Helvetica Neue', sans-serif`;

  // Dual palette — refined luxury
  const coast = { primary: "#0A6B7A", light: "#E6FAFB", mid: "#0E8A9B", accent: "#22D3EE", soft: "#F0FDFA" };
  const outback = { primary: "#A04209", light: "#FEF7ED", mid: "#C4570E", accent: "#D4820B", soft: "#FFFBF0" };
  const neutral = { sand: "#F5F0E8", white: "#FFFDF8", dark: "#1A1714", mid: "#57534E", light: "#A8A29E", border: "#E7E5E4" };
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
          background:`linear-gradient(135deg, #0B3D4E 0%, ${coast.primary} 25%, #4BA89A 50%, #B8864A 75%, ${outback.primary} 100%)`,
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
                background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginLeft:6,
              }}>Co.</span>
            </div>
            <div style={{width:40,height:1,background:gold,margin:"16px auto 20px"}}/>
            <p style={{fontFamily:sans,fontSize:13,color:neutral.light,marginBottom:32,fontWeight:300}}>
              Preview — launching June 2027
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
              background:`linear-gradient(135deg,${coast.primary} 0%,#3A6B5E 50%,${outback.primary} 100%)`,
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
        ::selection{background:${coast.primary};color:#fff}

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
          background:linear-gradient(135deg,${coast.primary} 0%,#3A6B5E 50%,${outback.primary} 100%);color:#fff;border:none;
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

        .btn-coast{background:${coast.primary};color:#fff;border:none;padding:15px 36px;font-family:${sans};font-size:11px;font-weight:600;letter-spacing:2.5px;text-transform:uppercase;cursor:pointer;border-radius:4px;transition:all .35s}
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
        .faq-q:hover{color:${coast.primary}}

        .vibe-coast{border-left:3px solid ${coast.primary}}
        .vibe-outback{border-left:3px solid ${outback.primary}}
        .vibe-both{border-left:3px solid transparent;border-image:linear-gradient(to bottom,${coast.primary},${outback.primary}) 1}

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
        background:isHome?"transparent":"rgba(255,253,248,0.94)",
        backdropFilter:isHome?"none":"blur(16px) saturate(180%)",
        borderBottom:isHome?"none":`1px solid ${neutral.border}`,
        transition:"all .4s",padding:isHome?"18px 28px":"10px 28px",
      }}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{cursor:"pointer",display:"flex",alignItems:"baseline",gap:6}} onClick={()=>goTo("home")}>
            <span style={{
              fontFamily:serif,fontSize:18,fontWeight:700,letterSpacing:.5,
              color:isHome?"#fff":neutral.dark,transition:"color .4s",
              textShadow:isHome?"0 1px 10px rgba(0,0,0,0.25)":"none",
            }}>Southern Horizon</span>
            <span style={{
              fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
              background:isHome?"linear-gradient(90deg,rgba(255,255,255,0.7),rgba(255,255,255,0.5))":`linear-gradient(90deg,${coast.primary},${outback.primary})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",transition:"all .4s",
            }}>Co.</span>
          </div>
          <div className="desk-nav" style={{display:"flex",gap:22,alignItems:"center"}}>
            {SECTIONS.map(s=>(
              <span key={s.id} className={`nav-link ${activeSection===s.id?"active":""}`}
                onClick={()=>goTo(s.id)} style={{
                  fontFamily:sans,fontSize:10.5,fontWeight:400,letterSpacing:1,
                  color:isHome?"rgba(255,255,255,0.8)":neutral.mid,transition:"color .35s",
                  textShadow:isHome?"0 1px 3px rgba(0,0,0,0.1)":"none",
                }}>{s.label}</span>
            ))}
          </div>
          <div className="mob-btn" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}
            style={{display:"none",cursor:"pointer",zIndex:1001,alignItems:"center",justifyContent:"center",
              width:36,height:36,fontSize:24,
              color:mobileMenuOpen?neutral.dark:(isHome?"#fff":neutral.dark),transition:"color .3s"}}>
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
      {/* ═══ HERO — DUAL GRADIENT ═══ */}
      <div id="home">
        <div style={{
          minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
          background:`linear-gradient(135deg, 
            #0B3D4E 0%, ${coast.primary} 18%, #1098A8 30%, 
            #4BA89A 42%, #8B9B6E 50%, 
            #B8864A 58%, ${outback.primary} 70%, #A04E0C 82%, #6B2E08 100%)`,
          position:"relative",overflow:"hidden",padding:"140px 28px 110px",
        }}>
          {/* Texture: sand grain overlay */}
          <div style={{position:"absolute",inset:0,opacity:.03,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize:"128px",
          }}/>
          {/* Horizon line */}
          <div style={{position:"absolute",top:"52%",left:0,right:0,height:1,
            background:`linear-gradient(90deg, transparent, ${gold}20 20%, ${gold}35 50%, ${gold}20 80%, transparent)`
          }}/>
          {/* Transition wave at bottom */}
          <svg style={{position:"absolute",bottom:-1,left:0,width:"100%",height:90}} viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0,35 C360,75 720,5 1080,45 C1260,65 1380,35 1440,50 L1440,90 L0,90Z" fill={neutral.white}/>
          </svg>

          <div style={{textAlign:"center",maxWidth:820,position:"relative",zIndex:2,animation:"fadeUp .9s ease"}}>
            <div style={{
              display:"inline-block",fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:3.5,textTransform:"uppercase",
              color:"rgba(255,255,255,0.85)",marginBottom:28,padding:"8px 22px",borderRadius:2,
              background:"rgba(255,255,255,0.08)",border:`1px solid ${gold}40`,
              backdropFilter:"blur(8px)",
            }}>Coming June '27</div>
            <div style={{
              fontFamily:sans,fontSize:10,fontWeight:500,letterSpacing:7,textTransform:"uppercase",
              color:"rgba(255,255,255,0.4)",marginBottom:36,
            }}>Self-Drive Luxury Touring — Queensland & Beyond</div>
            <h1 className="hero-h" style={{
              fontFamily:serif,fontSize:"clamp(36px, 6.5vw, 72px)",fontWeight:400,
              color:"#fff",lineHeight:1.12,marginBottom:28,
              textShadow:"0 2px 30px rgba(0,0,0,0.15)",
            }}>
              Turquoise water today,<br/>
              <em style={{fontStyle:"italic",fontWeight:300}}>red dirt tomorrow</em>
            </h1>
            <div style={{width:60,height:1,background:gold,margin:"0 auto 28px",opacity:0.6}}/>
            <p style={{fontFamily:sans,fontSize:15,color:"rgba(255,255,255,0.55)",lineHeight:1.85,
              maxWidth:520,margin:"0 auto 48px",fontWeight:300,letterSpacing:0.2}}>
              A fully-stocked Toyota LandCruiser 300 Series Sahara — delivered to your airport, 
              your hotel, or wherever you need it. 
              Drive K'gari's white sand, Cairns' tropics, Birdsville's red earth — 
              or all of them in one trip. Vehicle, food, fuel, and equipment included.
              Everything included — $1,200/day, either mode.
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
            {val:"$1,200/Day",sub:"everything included — either mode"},
            {val:"300 Series",sub:"LandCruiser Sahara"},
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
              {icon:"01",title:"Delivered to You",text:"Your LandCruiser comes to you — airport terminal, hotel lobby, or wherever your trip begins. Brisbane, Gold Coast, Sunshine Coast, Cairns, or Sydney. Fridge full, pantry packed, Starlink powered up. You don't come to us — we come to you.",bg:coast.soft,border:"#CCFBF1"},
              {icon:"02",title:"Self-Drive Freedom",text:"No guide, no tour bus, no schedule. Follow the coast, detour through rainforest, chase sunset in the desert. Stop where you want, stay as long as you like.",bg:neutral.sand,border:"#E7E5E4"},
              {icon:"03",title:"Connected Everywhere",text:"Telstra SIM for regional coverage, Starlink satellite internet for everywhere else. Navigate, stream, and share from the Daintree to the Simpson.",bg:outback.soft,border:"#FDE68A"},
              {icon:"04",title:"Premium Equipment",text:"Lawson INFINITY camping system, PowerDeck lithium battery, ARB Zero 60L fridge/freezer, Snow Peak and Jetboil cooking gear, GSI Pinnacle ceramic cookset, Sea to Summit sleeping and camp furniture. Nothing generic — every piece is chosen.",bg:outback.soft,border:"#FDE68A"},
              {icon:"05",title:"Curated Routes",text:"We've driven every road. Handpicked camp spots, tide charts, provisioning points, swimming holes, sunset lookouts, and the local tips that make the difference.",bg:neutral.sand,border:"#E7E5E4"},
              {icon:"06",title:"24/7 Support",text:"Day or night — flat tyre advice, route changes, or 'where's the best fish and chips near here.' We're a call or Starlink message away.",bg:coast.soft,border:"#CCFBF1"},
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
            background:`linear-gradient(135deg, ${coast.primary} 0%, #3A8A6C 50%, ${outback.primary} 100%)`,
            display:"flex",alignItems:"center",justifyContent:"space-between",gap:28,flexWrap:"wrap",
          }}>
            <div>
              <div style={{fontFamily:serif,fontSize:26,fontWeight:700,color:"#fff"}}>
                Your vehicle, fully loaded
              </div>
              <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:300,marginTop:4}}>
                Vehicle, food, pre-loaded Visa card, Starlink, Telstra SIM, all equipment, 24/7 support — $1,200/day, everything included in both modes.
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
                const accentSolid = pkg.vibe==="coast"?coast.primary:pkg.vibe==="outback"?outback.primary:"#6B7B4E";
                const bgTint = pkg.vibe==="coast"?coast.soft:pkg.vibe==="outback"?outback.soft:"#F8F6F0";
                const labelText = pkg.vibe==="coast"?"Coastal":pkg.vibe==="outback"?"Outback":"Coast + Outback";
                return(
                  <div key={pkg.id} className={`card-up vibe-${pkg.vibe}`} style={{
                    background:"#fff",borderRadius:8,overflow:"hidden",display:"flex",flexDirection:"column",
                    borderTop:"none",borderRight:`1px solid ${neutral.border}`,borderBottom:`1px solid ${neutral.border}`,
                  }}>
                    <div style={{padding:"24px 24px 18px",borderBottom:`1px solid ${neutral.border}`,position:"relative"}}>
                      <div style={{display:"flex",gap:8,marginBottom:10,alignItems:"center"}}>
                        <span style={{
                          fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                          color:accentSolid,background:bgTint,padding:"4px 10px",borderRadius:4,
                        }}>{labelText}</span>
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
      {activeSection === "choose-mode" && (<>
      {/* ═══ CHOOSE YOUR MODE ═══ */}
      <div id="choose-mode" style={{paddingTop:60}}>
        <div style={{padding:"110px 28px",maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              color:gold,marginBottom:14,
            }}>Choose Your Mode</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
              Camp, stay, or <em style={{fontStyle:"italic"}}>mix both</em>
            </h2>
            <p style={{fontFamily:sans,fontSize:14,color:neutral.light,fontWeight:300,letterSpacing:0.15,maxWidth:520,margin:"12px auto 0",lineHeight:1.7}}>
              Every package is available in both modes. Camp one night, stay in a lodge the next — it's your trip.
            </p>
          </div>

          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
            {/* Camping Mode */}
            <div style={{background:coast.soft,borderRadius:8,overflow:"hidden",border:`1px solid #CCFBF1`,display:"flex",flexDirection:"column"}}>
              <div style={{padding:"28px 28px 0",textAlign:"center"}}>
                <div style={{fontFamily:serif,fontSize:11,fontWeight:500,letterSpacing:4,textTransform:"uppercase",color:coast.primary,marginBottom:16,opacity:0.6}}>Mode One</div>
                <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:coast.primary,marginBottom:6}}>Camping Mode</div>
                <h3 style={{fontFamily:serif,fontSize:24,fontWeight:700,color:neutral.dark,marginBottom:4}}>Sleep Under the Stars</h3>
                <div style={{fontFamily:serif,fontSize:28,fontWeight:700,color:coast.primary,marginBottom:8}}>$1,200<span style={{fontSize:14,fontWeight:400,color:neutral.light}}>/day</span></div>
                <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:20}}>
                  The full Lawson INFINITY camping system loads into the rear — fridge, drawers, prep table, PowerDeck battery. 
                  Premium tent, sleeping gear, cooking kit, and all your food fully provisioned. You're completely self-sufficient.
                </p>
              </div>
              <div style={{padding:"0 28px 28px",flex:1,display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:coast.primary,marginBottom:2}}>Everything included</div>
                {["LandCruiser 300 Series Sahara + insurance","Full camping equipment (tent, beds, chairs, kitchen)","All food & drinks — breakfast, lunch, dinner, snacks","Pre-loaded Visa card for fuel","Camp site fees & permits included","Telstra SIM + Starlink satellite internet","Pre-planned route with curated stops","Vehicle briefing + 24/7 support"].map((t,i)=>(
                  <div key={i} style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.6,fontWeight:300,display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{color:coast.primary,fontSize:11,marginTop:3,flexShrink:0}}>✓</span>{t}
                  </div>
                ))}
                <div style={{marginTop:14,padding:"14px 16px",background:"#fff",borderRadius:10,border:`1px solid ${neutral.border}`}}>
                  <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:coast.primary,marginBottom:6}}>Over $12,000 in premium gear included</div>
                  <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7,fontWeight:300}}>
                    Lawson INFINITY modular system, ARB Zero 60L fridge, Coleman Instant Up 8P Darkroom tent, 
                    Helinox chairs & table, Sea to Summit sleeping bags & mats, Snow Peak & Jetboil cooking, 
                    GSI Pinnacle ceramic cookset, BioLite & Goal Zero lighting. This is the kit you'd buy yourself.
                  </p>
                </div>
                <div style={{padding:"12px 16px",background:"#fff",borderRadius:10,border:`1px solid ${neutral.border}`}}>
                  <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:coast.primary,marginBottom:4}}>Luggage</div>
                  <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.6,fontWeight:300}}>Up to 3 soft duffel bags + day packs at your feet</p>
                </div>
              </div>
            </div>

            {/* Touring Mode */}
            <div style={{background:outback.soft,borderRadius:8,overflow:"hidden",border:`1px solid #FDE68A`,display:"flex",flexDirection:"column"}}>
              <div style={{padding:"28px 28px 0",textAlign:"center"}}>
                <div style={{fontFamily:serif,fontSize:11,fontWeight:500,letterSpacing:4,textTransform:"uppercase",color:outback.primary,marginBottom:16,opacity:0.6}}>Mode Two</div>
                <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:outback.primary,marginBottom:6}}>Touring Mode</div>
                <h3 style={{fontFamily:serif,fontSize:24,fontWeight:700,color:neutral.dark,marginBottom:4}}>Stay in Style</h3>
                <div style={{fontFamily:serif,fontSize:28,fontWeight:700,color:outback.primary,marginBottom:8}}>$1,200<span style={{fontSize:14,fontWeight:400,color:neutral.light}}>/day</span></div>
                <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:20}}>
                  Camping modules come out, giving you a full open boot. Luxury curated accommodation at every stop is included. 
                  Your pre-loaded Visa card covers fuel plus breakfast and dinner at curated restaurants along your route — minimal out-of-pocket expenses.
                </p>
              </div>
              <div style={{padding:"0 28px 28px",flex:1,display:"flex",flexDirection:"column",gap:10}}>
                <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:outback.primary,marginBottom:2}}>Everything included</div>
                {["LandCruiser 300 Series Sahara + insurance","Luxury curated accommodation at every stop","Pre-loaded Visa card for fuel + dining","Breakfast & dinner at curated restaurants (Visa card)","Road snacks & drinks stocked in vehicle","Telstra SIM + Starlink satellite internet","Pre-planned route with curated stops","Vehicle briefing + 24/7 support"].map((t,i)=>(
                  <div key={i} style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.6,fontWeight:300,display:"flex",gap:8,alignItems:"flex-start"}}>
                    <span style={{color:outback.primary,fontSize:11,marginTop:3,flexShrink:0}}>✓</span>{t}
                  </div>
                ))}
                <div style={{marginTop:14,padding:"14px 16px",background:"#fff",borderRadius:10,border:`1px solid ${neutral.border}`}}>
                  <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:outback.primary,marginBottom:6}}>How accommodation works</div>
                  <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7,fontWeight:300}}>
                    We present handpicked accommodation at each stop — eco-lodges, heritage pubs, luxury retreats. 
                    You choose what appeals, we book it all. Included in your $1,200/day rate.
                  </p>
                </div>
                <div style={{padding:"12px 16px",background:"#fff",borderRadius:10,border:`1px solid ${neutral.border}`}}>
                  <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:outback.primary,marginBottom:4}}>Luggage</div>
                  <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.6,fontWeight:300}}>1 soft bag per passenger + day packs at your feet — full boot space</p>
                </div>
              </div>
            </div>
          </div>

          {/* Mix Both callout */}
          <div style={{
            marginTop:24,padding:"26px 28px",borderRadius:8,
            background:`linear-gradient(135deg, ${coast.primary}06, ${outback.primary}06)`,
            border:`1px solid ${neutral.border}`,display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap",
          }}>
            <div style={{width:3,background:gold,borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/>
            <div style={{flex:1,minWidth:260}}>
              <h4 style={{fontFamily:serif,fontSize:19,fontWeight:700,color:neutral.dark,marginBottom:8}}>Mix Both on the Same Trip</h4>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>
                Camp on K'gari for three nights, then check into Silky Oaks Lodge in the Daintree. 
                Sleep under outback stars at Carnarvon Gorge, then stay at Hotel Corones in Charleville. 
                The rate is $1,200/day either way — premium camping gear is the accommodation equivalent. Mix freely.
              </p>
            </div>
          </div>

          {/* Pricing clarity */}
          <div style={{
            marginTop:16,padding:"22px 28px",borderRadius:8,
            background:neutral.sand,display:"flex",gap:16,alignItems:"flex-start",flexWrap:"wrap",
          }}>
            <div style={{width:3,background:gold,borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/>
            <div style={{flex:1,minWidth:260}}>
              <h4 style={{fontFamily:serif,fontSize:17,fontWeight:700,color:neutral.dark,marginBottom:6}}>How Pricing Works</h4>
              <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>
                One rate: <strong style={{color:neutral.dark}}>$1,200/day, both modes</strong>. In camping mode that covers the LandCruiser, 
                all camping gear, full food provisioning (every meal), a Visa card for fuel, camp sites, permits, and 24/7 support. 
                In touring mode it covers the LandCruiser, luxury curated accommodation, road snacks, and a pre-loaded Visa card for fuel plus 
                breakfast and dinner at curated restaurants. Premium camping gear is the accommodation equivalent — that's why the rate is the same. 
                Your Visa card limit is discussed during your consultation. Unspent balance is recovered after your trip.
              </p>
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
              LandCruiser 300 <em style={{fontStyle:"italic"}}>Sahara</em>
            </h2>
            <p style={{fontFamily:sans,fontSize:14,color:neutral.light,fontWeight:300,letterSpacing:0.15,maxWidth:440,margin:"12px auto 0",lineHeight:1.7}}>
              As comfortable on the highway as it is on K'gari's sand or Birdsville's bulldust.
            </p>
          </div>
          <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:10,marginBottom:44}}>
            {[
              {l:"Engine",v:"3.3L Twin-Turbo V6 Diesel"},{l:"Drive",v:"Full-Time 4WD"},
              {l:"Configs",v:"Camping Mode / Touring Mode"},{l:"Camping",v:"Lawson INFINITY Modular"},
              {l:"Power",v:"PowerDeck Lithium Battery"},{l:"Fridge",v:"ARB Zero 60L"},
              {l:"Kitchen",v:"Snow Peak Burner + GSI Pinnacle Cookset"},{l:"Water",v:"60L Under-Car Tank"},
              {l:"Roof",v:"Toyota Roof Platform & Side Rails"},{l:"Internet",v:"Starlink Satellite"},
              {l:"Mobile",v:"Telstra SIM Card"},{l:"Fuel & Dining",v:"Pre-loaded Visa Card"},
            ].map((f,i)=>(
              <div key={i} style={{padding:"18px 16px",background:i%2===0?coast.soft:outback.soft,borderRadius:10}}>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                  color:i%2===0?coast.primary:outback.primary,marginBottom:5}}>{f.l}</div>
                <div style={{fontFamily:serif,fontSize:14,fontWeight:700,color:neutral.dark,lineHeight:1.3}}>{f.v}</div>
              </div>
            ))}
          </div>
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <div style={{padding:"30px 26px",background:coast.soft,borderRadius:8,borderLeft:`4px solid ${coast.primary}`}}>
              <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:coast.primary,marginBottom:8}}>Camping Mode</div>
              <h3 style={{fontFamily:serif,fontSize:20,fontWeight:700,color:neutral.dark,marginBottom:8}}>Camp Anywhere</h3>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:12}}>
                Full Lawson INFINITY module in the rear — PowerDeck lithium floor, fridge slide, drawer, prep table, side wings. Everything you need to be completely self-sufficient. Roof rack available except on sand islands.
              </p>
              <div style={{fontFamily:sans,fontSize:12.5,color:coast.primary,fontWeight:600}}>Up to 4 guests · 3 soft bags · Day packs at feet</div>
            </div>
            <div style={{padding:"30px 26px",background:outback.soft,borderRadius:8,borderLeft:`4px solid ${outback.primary}`}}>
              <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:outback.primary,marginBottom:8}}>Touring Mode</div>
              <h3 style={{fontFamily:serif,fontSize:20,fontWeight:700,color:neutral.dark,marginBottom:8}}>Stay in Style</h3>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:12}}>
                Camping modules removed, giving you a full open boot. Luxury curated accommodation included at every stop. 
                Pre-loaded Visa card covers fuel and dining at curated restaurants. Road snacks in the vehicle. One bag per passenger fits comfortably.
              </p>
              <div style={{fontFamily:sans,fontSize:12.5,color:outback.primary,fontWeight:600}}>Up to 4 guests · 1 bag per passenger · Day packs at feet</div>
            </div>
          </div>
          {/* Passenger cap note */}
          <div style={{marginTop:18,padding:"18px 22px",background:neutral.sand,borderRadius:10,display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:3,background:coast.primary,borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/>
            <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7}}>
              <strong style={{color:neutral.dark}}>Guest limit:</strong> For comfort and safety, we carry a maximum of <strong style={{color:neutral.dark}}>4 adults</strong> or <strong style={{color:neutral.dark}}>2 adults and 3 children</strong> per trip — in either configuration. Fewer passengers means more space, more comfort, and a better experience on remote roads.
            </p>
          </div>
          <div style={{marginTop:18,padding:"18px 22px",background:"#FFFBEB",borderRadius:10,border:"1px solid #FDE68A",display:"flex",gap:12,alignItems:"flex-start"}}>
            <div style={{width:3,background:"#D97706",borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/>
            <p style={{fontFamily:sans,fontSize:12.5,color:"#92400E",lineHeight:1.7}}>
              <strong>Roof rack:</strong> Toyota roof platform with side rails available on most routes. Roof loading is <strong>strictly prohibited on sand island sections</strong> including K'gari.
            </p>
          </div>
        </div>
      </div>

      </>)}
      {activeSection === "camping-gear" && (<>
      {/* ═══ CAMPING GEAR ═══ */}
      <div id="camping-gear" style={{paddingTop:60}}>
        <div style={{background:neutral.sand,padding:"110px 28px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
                color:gold,marginBottom:14,
              }}>Camping Gear</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
                Nothing generic, <em style={{fontStyle:"italic"}}>everything chosen</em>
              </h2>
              <p style={{fontFamily:sans,fontSize:14,color:neutral.light,fontWeight:300,letterSpacing:0.15,maxWidth:520,margin:"12px auto 0",lineHeight:1.7}}>
                Every item in your LandCruiser is premium outdoor gear from brands trusted by serious adventurers. 
                No rental-grade leftovers — this is the kit you'd buy yourself.
              </p>
            </div>

            {/* Shelter & Furniture */}
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:40,height:1,background:gold}}/>
                <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Shelter & Camp Furniture</h3>
              </div>
              <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:14}}>
                {[
                  {brand:"Coleman",item:"Instant Up 8P Darkroom Tent",detail:"Full standing height, LED lighting built in, Darkroom technology blocks 90% of sunlight. Sets up in under 2 minutes — no threading poles.",bg:coast.soft},
                  {brand:"Helinox",item:"Chair One × 4",detail:"The gold standard in camp chairs. Ultralight alloy frame (890g), packs down to 35×11cm. Supports 145kg. One per guest.",bg:"#fff"},
                  {brand:"Helinox",item:"Table One Hard Top",detail:"Matching hard-top camp table. Packs to 41×12cm, weighs 690g. Stable on any surface — sand, rock, grass.",bg:coast.soft},
                  {brand:"ARB",item:"Awning & Walls",detail:"Vehicle-mounted awning with detachable walls. Instant shade and wind protection. Sets up from the Toyota roof platform in seconds.",bg:"#fff"},
                  {brand:"Sea to Summit",item:"Basecamp BcII Sleeping Bags × 4",detail:"Comfort-rated to 4°C. Synthetic fill dries fast in humid conditions — ideal for coastal and tropical routes. One per guest.",bg:coast.soft},
                  {brand:"Sea to Summit",item:"Camp Plus S.I. Mats × 4",detail:"5cm thick self-inflating camp mats. No air mattress pumps, no deflating at 2am. Roll out, open the valve, sleep well.",bg:"#fff"},
                ].map((g,i)=>(
                  <div key={i} style={{padding:"22px 20px",background:g.bg,borderRadius:8,border:`1px solid ${neutral.border}`}}>
                    <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:coast.primary,marginBottom:4}}>{g.brand}</div>
                    <div style={{fontFamily:serif,fontSize:16,fontWeight:700,color:neutral.dark,marginBottom:8}}>{g.item}</div>
                    <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7,fontWeight:300}}>{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Cooking */}
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:40,height:1,background:gold}}/>
                <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Cooking & Kitchen</h3>
              </div>
              <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:14}}>
                {[
                  {brand:"Snow Peak",item:"Home & Camp Burner",detail:"Japanese-engineered butane burner that folds to the size of a wine bottle. Stable flame, wind-resistant, beautiful design. The centrepiece of camp cooking.",bg:outback.soft},
                  {brand:"Jetboil",item:"Flash Stove System",detail:"Isobutane stove that boils water in 100 seconds. Perfect for morning coffee, instant meals, and fast-boil when the Snow Peak is cooking dinner.",bg:"#fff"},
                  {brand:"GSI Outdoors",item:"Pinnacle Camper Cookset (Ceramic)",detail:"Non-stick ceramic-coated 2-pot set with fry pan, 4 mugs, 4 bowls, 4 plates, pot gripper, and stuff sack. Everything nests inside itself. One kit, full kitchen.",bg:outback.soft},
                  {brand:"Sea to Summit",item:"Camp Kitchen Tool Kit",detail:"Spatula, ladle, and tongs — all heat-resistant, lightweight, and designed to pack flat. The tools that make the cookset work.",bg:"#fff"},
                  {brand:"Sea to Summit",item:"Delta Cutlery Sets × 4",detail:"Adult knife, fork, and spoon sets in BPA-free material. One set per guest. Clip together for storage — no rattling around in drawers.",bg:outback.soft},
                  {brand:"ARB",item:"Zero 60L Fridge/Freezer",detail:"12/24V compressor fridge on the Lawson fridge slide. Runs off the PowerDeck lithium battery 24/7 — engine on or off. Your food stays cold from Day 1 to Day 21.",bg:"#fff"},
                ].map((g,i)=>(
                  <div key={i} style={{padding:"22px 20px",background:g.bg,borderRadius:8,border:`1px solid ${neutral.border}`}}>
                    <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:outback.primary,marginBottom:4}}>{g.brand}</div>
                    <div style={{fontFamily:serif,fontSize:16,fontWeight:700,color:neutral.dark,marginBottom:8}}>{g.item}</div>
                    <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7,fontWeight:300}}>{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Lighting */}
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:40,height:1,background:gold}}/>
                <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Camp Lighting</h3>
              </div>
              <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[
                  {brand:"BioLite",item:"AlpenGlow 250 Lantern",detail:"USB-rechargeable, 250 lumens, colour modes including a warm amber campfire glow. Hang it, stand it, or clip it. The main light for camp.",bg:coast.soft},
                  {brand:"Goal Zero",item:"Crush Light Chroma",detail:"Collapsible solar-charged lantern for the tent. Weighs almost nothing, packs flat, provides gentle ambient light for reading and wind-down.",bg:"#fff"},
                ].map((g,i)=>(
                  <div key={i} style={{padding:"22px 20px",background:g.bg,borderRadius:8,border:`1px solid ${neutral.border}`}}>
                    <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:coast.primary,marginBottom:4}}>{g.brand}</div>
                    <div style={{fontFamily:serif,fontSize:16,fontWeight:700,color:neutral.dark,marginBottom:8}}>{g.item}</div>
                    <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7,fontWeight:300}}>{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Recovery & Safety */}
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:40,height:1,background:gold}}/>
                <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Recovery & Safety</h3>
              </div>
              <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:14}}>
                {[
                  {brand:"MAXTRAX",item:"MKII Recovery Tracks",detail:"The original, lifetime warranty. Get yourself out of sand, mud, or soft ground."},
                  {brand:"ARB",item:"Snatch Strap & Soft Shackles",detail:"11,000kg rated strap, 14.5T UHMWPE shackles. Serious recovery kit."},
                  {brand:"Bushranger",item:"X-Jack Exhaust Jack",detail:"Inflate from exhaust or compressor. Lifts the vehicle where a standard jack can't — sand, mud, uneven ground."},
                  {brand:"NOCO",item:"GB70 Jump Starter (2000A)",detail:"Lithium jump pack that starts a diesel cold. Also charges phones, tablets, and the iPad."},
                  {brand:"ARB",item:"E-Z Tyre Deflator & Speedy Seal",detail:"Brass deflator with analogue gauge for precise airing down. Speedy Seal for roadside tyre repair."},
                  {brand:"GME",item:"TX6160 UHF Handheld Radio",detail:"5W, IP67 waterproof, 30-hour battery. Essential for areas beyond mobile coverage."},
                  {brand:"",item:"Comprehensive First Aid Kit",detail:"4WD-specific kit covering remote touring. Snake bandage, burns, splints, and standard supplies."},
                  {brand:"",item:"Full Tool Kit & Spares",detail:"Basic tools, cable ties, duct tape, spare fuses, bungee cords, tie-downs, and a funnel. Everything for minor roadside fixes."},
                ].map((g,i)=>(
                  <div key={i} style={{padding:"18px 16px",background:i%2===0?coast.soft:"#fff",borderRadius:10,border:`1px solid ${neutral.border}`}}>
                    {g.brand && <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:outback.primary,marginBottom:3}}>{g.brand}</div>}
                    <div style={{fontFamily:serif,fontSize:14,fontWeight:700,color:neutral.dark,marginBottom:6}}>{g.item}</div>
                    <p style={{fontFamily:sans,fontSize:11.5,color:neutral.mid,lineHeight:1.65,fontWeight:300}}>{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Navigation & Connectivity */}
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <div style={{width:40,height:1,background:gold}}/>
                <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Navigation & Connectivity</h3>
              </div>
              <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:14}}>
                {[
                  {brand:"Apple",item:"iPad (Wi-Fi + Cellular, 256GB)",detail:"Mounted in a rugged case on a vehicle mount. Runs Hema Explorer for offline topographic navigation — every track, every fuel stop, every camp site.",bg:"#fff"},
                  {brand:"Starlink",item:"Satellite Internet Terminal",detail:"High-speed internet anywhere in Australia. Stream, video call, check weather, download maps. Works in the Simpson Desert, the Daintree, and everywhere between.",bg:coast.soft},
                  {brand:"Telstra",item:"SIM Card (Best Regional Coverage)",detail:"Pre-loaded Telstra SIM for maximum mobile coverage across regional and remote Australia. The network that reaches furthest.",bg:"#fff"},
                ].map((g,i)=>(
                  <div key={i} style={{padding:"22px 20px",background:g.bg,borderRadius:8,border:`1px solid ${neutral.border}`}}>
                    <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:coast.primary,marginBottom:4}}>{g.brand}</div>
                    <div style={{fontFamily:serif,fontSize:16,fontWeight:700,color:neutral.dark,marginBottom:8}}>{g.item}</div>
                    <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7,fontWeight:300}}>{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Families callout */}
            <div style={{
              padding:"28px 28px",borderRadius:8,
              background:`linear-gradient(135deg, ${coast.primary}08, ${outback.primary}08)`,
              border:`1px solid ${neutral.border}`,display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap",
            }}>
              <div style={{width:3,background:gold,borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/>
              <div style={{flex:1,minWidth:260}}>
                <h4 style={{fontFamily:serif,fontSize:20,fontWeight:500,color:neutral.dark,marginBottom:8}}>Travelling with Kids?</h4>
                <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:10}}>
                  We carry Sea to Summit Delta Camp Sets for older children (plate, bowl, mug, cutlery) as standard in camping mode. 
                  For toddlers, we have a dedicated kit available on request — b.box BPA-free dining sets, Milton travel sterilisers and tablets, 
                  and bottle brushes. Just let us know ages when you register and we'll have everything ready.
                </p>
                <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>
                  Child seats and booster seats are arranged through Kidsafe Queensland — we handle the booking, you just tell us how many and what ages.
                </p>
              </div>
            </div>

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
                {n:"01",t:"Register",d:"Tell us your dates, group, and what you're after — coast, tropics, outback, or the full mix. We're taking registrations now ahead of our June 2027 launch.",accent:coast.primary},
                {n:"02",t:"We Design",d:"We build your itinerary — daily waypoints, camp spots or accommodation, provisions, tide charts, hidden gems. We'll talk through driving conditions on your route and match the trip to your experience level.",accent:"#3A8A6C"},
                {n:"03",t:"Refine",d:"We send the route. Add days, swap stops, change pace. It's not finalised until you're happy.",accent:"#8B7A3E"},
                {n:"04",t:"Drive",d:"We deliver your LandCruiser to your airport gate, hotel entrance, or wherever suits — Brisbane, Gold Coast, Sunshine Coast, Cairns, or Sydney. Quick briefing, keys in your hand, and you're on the road.",accent:outback.primary},
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
      {activeSection === "food-drink" && (<>
      {/* ═══ FOOD & DRINK ═══ */}
      <div id="food-drink" style={{paddingTop:60}}>
        <div style={{padding:"110px 28px",maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              color:gold,marginBottom:14,
            }}>Food & Drink</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(30px,4.5vw,48px)",fontWeight:300,color:neutral.dark,lineHeight:1.2,letterSpacing:-0.5}}>
              Fully stocked, <em style={{fontStyle:"italic"}}>ready to eat</em>
            </h2>
          </div>
          {/* Hero banner */}
          <div style={{
            padding:"36px 34px",borderRadius:8,marginBottom:28,textAlign:"center",
            background:`linear-gradient(135deg, ${coast.primary} 0%, #3A8A6C 50%, ${outback.primary} 100%)`,
          }}>
            <h3 style={{fontFamily:serif,fontSize:24,fontWeight:400,color:"#fff",marginBottom:10}}>Your vehicle arrives fully stocked</h3>
            <p style={{fontFamily:sans,fontSize:14,color:"rgba(255,255,255,0.6)",fontWeight:300,maxWidth:520,margin:"0 auto",lineHeight:1.75}}>
              Food, drinks, snacks — planned for your group, trip length, and dietary needs. 
              The ARB Zero 60L fridge/freezer keeps everything cold 24/7.
            </p>
          </div>
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <div style={{padding:"28px 24px",background:coast.soft,borderRadius:8,borderLeft:`4px solid ${coast.primary}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
                <h3 style={{fontFamily:serif,fontSize:19,fontWeight:700,color:neutral.dark}}>Camping Mode</h3>
                <span style={{fontFamily:serif,fontSize:16,fontWeight:700,color:coast.primary}}>$1,200/day</span>
              </div>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>
                Every meal is on us. We provision everything — fresh produce, quality meats, pantry staples, snacks, cold drinks, quality coffee beans with a plunger. 
                Breakfast, lunch, dinner, and everything in between — planned for your group size, duration, and dietary needs. Premium cooking gear included: 
                Snow Peak Home & Camp burner, Jetboil Flash, GSI Pinnacle ceramic cookset, Sea to Summit camp kitchen tools and Delta cutlery sets. 
                A 60L under-car water tank keeps you supplied between stops. For longer trips we map resupply points along your route. No fast food, no home brand — premium supermarket quality throughout.
              </p>
            </div>
            <div style={{padding:"28px 24px",background:outback.soft,borderRadius:8,borderLeft:`4px solid ${outback.primary}`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:12}}>
                <h3 style={{fontFamily:serif,fontSize:19,fontWeight:700,color:neutral.dark}}>Touring Mode</h3>
                <span style={{fontFamily:serif,fontSize:16,fontWeight:700,color:outback.primary}}>$1,200/day</span>
              </div>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>
                Road snacks and drinks are stocked in your vehicle. Breakfast and dinner are at curated restaurants along your route — coastal seafood, 
                tropical restaurants, outback pubs, fine dining — all covered by your pre-loaded Visa card. We discuss the dining budget during your consultation 
                so there are no surprises. Your accommodation is included — we present handpicked options, you choose, we book. Designed for minimal out-of-pocket expenses.
              </p>
            </div>
          </div>
          <div style={{marginTop:18,padding:"22px 24px",background:neutral.sand,borderRadius:8,display:"flex",gap:14,alignItems:"flex-start"}}>
            <div style={{width:3,background:coast.primary,borderRadius:2,flexShrink:0,alignSelf:"stretch"}}/>
            <div>
              <h4 style={{fontFamily:serif,fontSize:17,fontWeight:700,color:neutral.dark,marginBottom:5}}>Dietary Requirements & Allergies</h4>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>
                Vegetarian, vegan, gluten-free, halal, kosher, nut-free, lactose-free — tell us and we provision accordingly. 
                Severe allergies are factored into every meal. Since we stock your vehicle ourselves, nothing is left to chance.
              </p>
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
                {t:"Mobility & Access",d:"The 300 Series has a high step-up. Let us know about mobility needs — we'll discuss seating, routes, and camp accessibility.",bg:coast.soft},
                {t:"Medical Conditions",d:"Remote touring means distance from hospitals. Disclose any conditions and we factor proximity to medical facilities into your route.",bg:outback.soft},
                {t:"Children & Families",d:"Families welcome — we carry up to 2 adults and 3 children. Child seats and boosters arranged, just tell us ages. We tailor your itinerary with family-friendly stops, safe swimming spots, and shorter driving days.",bg:"#F0FDF4"},
                {t:"Dietary & Allergies",d:"We stock your vehicle — tell us your needs and every meal is provisioned accordingly. Severe allergies planned for from day one.",bg:outback.soft},
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
              The people behind the wheel — and behind every route, every recommendation, and every detail.
            </p>
          </div>

          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:22}}>
            {/* Troy */}
            <div style={{padding:"32px 28px",background:outback.soft,borderRadius:8,border:`1px solid #FDE68A`}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{
                  width:56,height:56,borderRadius:28,flexShrink:0,
                  background:`linear-gradient(135deg, ${outback.primary}, ${outback.mid})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:serif,fontSize:22,fontWeight:700,color:"#fff",
                }}>T</div>
                <div>
                  <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Troy</h3>
                  <p style={{fontFamily:sans,fontSize:12,color:outback.primary,fontWeight:600,letterSpacing:0.5}}>Founder & Operations</p>
                </div>
              </div>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,marginBottom:16}}>
                Qualified mechanic, lifelong 4WD enthusiast, and the person who built every route in this business from the driver's seat. 
                Troy has been running 4WDs through Queensland's coast, tropics, and outback since he could reach the pedals — and knows 
                the difference between a track that delivers and one that just looks good on a map.
              </p>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,marginBottom:18}}>
                His mechanical background means every vehicle specification, every accessory choice, and every piece of recovery 
                gear has been selected by someone who actually uses it — not sourced from a catalogue. When you call with a flat tyre 
                at 9pm, the person on the other end has changed one in worse conditions.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["Qualified Mechanic","4WD & Off-Road","Vehicle Specification","Route Design","Travel Industry"].map((t,i)=>(
                  <span key={i} style={{fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",
                    color:outback.primary,background:"#fff",padding:"5px 10px",borderRadius:6,border:`1px solid #FDE68A`,
                  }}>{t}</span>
                ))}
              </div>
            </div>

            {/* Jess */}
            <div style={{padding:"32px 28px",background:coast.soft,borderRadius:8,border:`1px solid #CCFBF1`}}>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
                <div style={{
                  width:56,height:56,borderRadius:28,flexShrink:0,
                  background:`linear-gradient(135deg, ${coast.primary}, ${coast.mid})`,
                  display:"flex",alignItems:"center",justifyContent:"center",
                  fontFamily:serif,fontSize:22,fontWeight:700,color:"#fff",
                }}>J</div>
                <div>
                  <h3 style={{fontFamily:serif,fontSize:24,fontWeight:500,color:neutral.dark}}>Jess</h3>
                  <p style={{fontFamily:sans,fontSize:12,color:coast.primary,fontWeight:600,letterSpacing:0.5}}>Co-Founder & Guest Experience</p>
                </div>
              </div>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,marginBottom:16}}>
                Fifteen years with Virgin Australia gave Jess a deep understanding of what travellers actually need — 
                and what separates a good experience from an unforgettable one. She knows the travel industry from the inside, 
                from logistics and guest expectations to the small details that make people feel looked after.
              </p>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.8,fontWeight:300,marginBottom:18}}>
                Jess is the reason your welcome pack feels personal, your provisions match your dietary needs, and your accommodation 
                options are curated — not just listed. If Troy builds the route, Jess makes sure every stop feels right.
              </p>
              <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
                {["15 Years Travel Industry","Guest Experience","Accommodation Curation","Provisioning","Concierge"].map((t,i)=>(
                  <span key={i} style={{fontFamily:sans,fontSize:10,fontWeight:600,letterSpacing:1,textTransform:"uppercase",
                    color:coast.primary,background:"#fff",padding:"5px 10px",borderRadius:6,border:`1px solid #CCFBF1`,
                  }}>{t}</span>
                ))}
              </div>
            </div>
          </div>

          {/* Shared passion callout */}
          <div style={{
            marginTop:24,padding:"28px 28px",borderRadius:8,
            background:`linear-gradient(135deg, ${coast.primary} 0%, #3A8A6C 50%, ${outback.primary} 100%)`,
            position:"relative",overflow:"hidden",
          }}>
            <div style={{position:"relative",zIndex:1,maxWidth:720}}>
              <h4 style={{fontFamily:serif,fontSize:21,fontWeight:400,color:"#fff",marginBottom:10,lineHeight:1.35}}>
                We've driven every route, camped at every stop, and done every activity we recommend.
              </h4>
              <p style={{fontFamily:sans,fontSize:13.5,color:"rgba(255,255,255,0.6)",lineHeight:1.75,fontWeight:300}}>
                Southern Horizon isn't a business we designed from a desk — it's built from years of loading up the LandCruiser and 
                heading out. We're passionate about regional Queensland and we started this because we wanted to share it properly — 
                not the rushed, bus-tour version, but the real thing. The hidden swimming hole, the pub with the best steak, the camp spot 
                where you wake up to wallabies. That's what we want to give you.
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
                {[
                  [{l:"Name *",k:"name",p:"Full name"},{l:"Email *",k:"email",p:"your@email.com",t:"email"}],
                  [{l:"Phone",k:"phone",p:"+61 ..."},{l:"Guests",k:"guests",sel:["","1 adult","2 adults","3 adults","4 adults","1 adult + 1 child","1 adult + 2 children","1 adult + 3 children","2 adults + 1 child","2 adults + 2 children","2 adults + 3 children"]}],
                  [{l:"Dates",k:"dates",sel:["","June 2027","July 2027","August 2027","September 2027","October 2027","November 2027","December 2027","January 2028","February 2028","March 2028","April 2028","May 2028","Later in 2028","Flexible / not sure yet"]},{l:"Package",k:"package",sel:["","K'gari Experience","Tropical North","Coastal Explorer","Red Centre & Outback","Whitsundays","Outback Taster","Capricorn Coast","Carnarvon Gorge","Byron Bay","Stockton Beach","Custom Journey","Not sure yet"]}],
                ].map((row,ri)=>(
                  <div key={ri} className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {row.map((f,fi)=>(
                      <div key={fi}>
                        <label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>{f.l}</label>
                        {f.sel?(
                          <select value={formData[f.k]} onChange={e=>setFormData(p=>({...p,[f.k]:e.target.value}))}
                            style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:formData[f.k]?"#fff":"rgba(255,255,255,0.3)",borderRadius:8}}>
                            {f.sel.map((o,oi)=><option key={oi} value={o} style={{background:"#1C1917",color:o?"#fff":"#A8A29E"}}>{o||"Select..."}</option>)}
                          </select>
                        ):(
                          <input type={f.t||"text"} value={formData[f.k]} onChange={e=>setFormData(p=>({...p,[f.k]:e.target.value}))}
                            style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}} placeholder={f.p}/>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
                <div>
                  <label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Dietary Requirements or Allergies</label>
                  <input value={formData.dietary} onChange={e=>setFormData(p=>({...p,dietary:e.target.value}))}
                    style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}} placeholder="e.g. vegetarian, gluten-free, nut allergy..."/>
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
                      {k:"childCutlery",label:"Children's cutlery & dining sets (Sea to Summit Delta Camp Sets)"},
                      {k:"bottleKit",label:"Bottle steriliser, brush & toddler dining kit (b.box + Milton)"},
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
                Camp sites are included in camping mode. In touring mode, luxury accommodation is included. Your pre-loaded Visa card covers fuel in both modes, plus dining at curated restaurants in touring mode. $1,200/day, both modes — designed for minimal out-of-pocket expenses.
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
              <div style={{display:"flex",alignItems:"baseline",gap:6,marginBottom:10}}>
                <span style={{fontFamily:serif,fontSize:20,fontWeight:400,color:"#fff",letterSpacing:0.5}}>Southern Horizon</span>
                <span style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
                  background:`linear-gradient(90deg,${coast.accent},${outback.accent})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                }}>Co.</span>
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
            <span style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.25)",fontWeight:300}}>Launching June 2027</span>
          </div>
        </div>
      </footer>
    </>
  );
}
