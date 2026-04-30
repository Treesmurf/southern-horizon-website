import { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { doc, setDoc } from "firebase/firestore";


// ═══ LOGO (SVG — scales infinitely, premium feel) ═══
const SHCoLogo = ({ size = 44, light = false }) => (
  <img 
    src={light ? "/shco-logo-white.png" : "/shco-logo.png"} 
    alt="Southern Horizon Co." 
    style={{
      width: size, height: size, borderRadius: "50%", 
      flexShrink: 0, objectFit: "cover",
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
  moreton: "Tangalooma_Wrecks",
  "tropical-north": "Daintree_National_Park",
  whitsundays: "Whitsunday_Island",
  "byron-bay": "Cape_Byron",
  "southern-downs": "Granite_Belt",
  custom: "Queensland",
};

// Fallback URLs — empty so we show nothing (not wrong images) while Wikipedia API loads
const IMAGES_FALLBACK = {
  hero: "",
  kgari: "",
  moreton: "",
  "tropical-north": "",
  whitsundays: "",
  "byron-bay": "",
  "southern-downs": "",
  custom: "",
  vehicle: "",
  accommodation: "",
  route: "",
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
      { q: "What vehicle will I be driving?", a: "A luxury SUV — full-time 4WD with premium audio and every luxury feature you'd expect. It's equally at home cruising the coast to Cairns, crossing K'gari's beaches, or winding through outback Queensland." },
      { q: "Do I need 4WD experience?", a: "Not at all. The vehicle makes off-road touring accessible with advanced traction control and terrain management. We provide a comprehensive vehicle briefing covering beach driving, sand, and unsealed roads before you depart." },
      { q: "Is there phone coverage and internet?", a: "We provide Starlink satellite internet and a backup smartphone with Telstra SIM in the glovebox for emergencies. You'll stay connected from the Daintree Rainforest to the Simpson Desert — and everywhere in between." },
    ],
  },
  {
    category: "What's Included",
    items: [
      { q: "What's included in the daily rate?", a: "Everything. Your daily rate covers the luxury SUV, insurance, curated luxury accommodation at every stop with breakfast included where available, a fleet fuel card (plus backup Visa for remote locations), Starlink satellite internet, backup phone with Telstra SIM for emergencies, your fully curated route with a dining guide of our favourite restaurants, vehicle briefing, and personal concierge support. One rate, everything included. Pricing provided on enquiry." },
      { q: "How does accommodation work?", a: "Luxury accommodation is included in your daily rate. We curate handpicked options at every stop — outback stations, boutique lodges, coastal retreats, eco-lodges. You pick what appeals, we book everything. No research, no chasing availability, no extra charges." },
      { q: "Can I upgrade to ultra-luxury accommodation?", a: "Absolutely. Your daily rate covers quality curated accommodation at every stop. If you'd like to upgrade to ultra-luxury properties — places like Silky Oaks Lodge in the Daintree, Elements of Byron, or Spicers Peak Lodge — we can arrange that as a supplement. Just mention it during your consultation and we'll present upgrade options alongside the standard inclusions at the relevant stops. You only pay the difference for the nights you choose to upgrade." },
      { q: "How does fuel and dining work?", a: "Your luxury SUV comes with a fleet fuel card that works at BP, Shell, and Ampol stations — roughly 95% of fuel stops across Australia. For remote locations like K'gari (Fraser Island) where fleet cards aren't accepted, we provide a backup pre-paid Visa. Breakfast is included where available at your accommodation. For dinner, we provide a curated dining guide with our handpicked restaurant recommendations at every stop — dinner is at your own expense so you can choose exactly where and what you feel like each evening." },
      { q: "Is there a security bond?", a: "Yes — a tiered bond system varies by package and configuration. Full details come with your booking enquiry. The bond is fully refundable subject to standard return conditions." },
    ],
  },
  {
    category: "Booking & Logistics",
    items: [
      { q: "How long can I hire for?", a: "Our regional packages run from 4 to 10 days — long enough to genuinely experience every stop, not just drive through. Moreton Island runs 4–5 days; K'gari runs 5–7 days; Byron Bay and Southern Downs Golf & Wine each run 5–7 days; Whitsundays runs a focused 7 days; Tropical North runs 7–10 days. Want something shorter, longer, or completely custom? That's what the Custom Journey is for — minimum 3 days, no maximum." },
      { q: "Why is there a passenger limit?", a: "For comfort and safety. We cap at 4 adults or 2 adults and 3 children per trip. Outback and remote coastal touring involves long distances, variable road conditions, and limited access to services. Fewer passengers means more space in the cabin, better weight distribution for the vehicle, and a safer, more comfortable experience for everyone — especially on sand, corrugations, and unsealed roads." },
      { q: "Where do I pick up?", a: "You don't — we deliver to you. Your luxury SUV is brought directly to your arrival airport, hotel, or accommodation — Brisbane, Gold Coast, Sunshine Coast (Maroochydore), Proserpine/Mackay, or Cairns depending on your package. Flying into Maroochydore? You could be at Rainbow Beach by lunchtime. Landing at Gold Coast or Ballina? Head straight for Byron Bay. Flying into Cairns for the Tropical North? Your luxury SUV is waiting when you land. Already in Brisbane? We can deliver to your hotel, or you're welcome to collect from our yard in Banyo." },
      { q: "Can I drive on the beach?", a: "Absolutely — beach driving is part of the experience on K'gari and other coastal routes. Sand driving, tyre pressures, tide awareness, and recovery are all covered in your briefing. Required permits are arranged as part of your package." },
      { q: "How much driving is involved?", a: "We design every day with a maximum of four hours behind the wheel. Stops are chosen because they're worth seeing — not just places to sleep. Every package gives you genuine dwell time at each destination so you can explore, relax, and actually experience the place. No rushed itineraries, no bus-tour pace." },
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
    tagline: "The world's largest sand island by luxury SUV",
    description: "Focused adventure on an iconic destination. Drive 75 Mile Beach, swim crystal-clear perched lakes, explore rainforest growing in sand. Stay at island resorts and coastal retreats. Add Hervey Bay for whale watching or extend to a full week at island pace.",
    includes: ["Luxury SUV", "All-inclusive daily rate", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "K'gari permits + barge", "Beach driving briefing", "Luxury curated accommodation", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Rainbow Beach & Inskip Point", day: "Day 1", type: "transit", desc: "Drive north from Brisbane (3–4hrs). Air down tyres at Inskip Point and catch the barge across to K'gari's southern tip.", stay: "Rainbow Beach accommodation", eat: "Rainbow Beach Surf Club before crossing", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Southern K'gari", day: "Days 2–3", type: "highlight", desc: "Lake McKenzie — arguably Australia's most beautiful freshwater lake. Crystal clear water, white silica sand. Central Station rainforest walk among towering satinay trees. Two nights to soak it in.", stay: "Kingfisher Bay Resort or Eurong Beach Resort", eat: "Resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "75 Mile Beach & East Coast", day: "Day 4", type: "highlight", desc: "Drive the sand highway up the east coast. Eli Creek (float down the crystal creek), the Maheno Shipwreck, and the Pinnacles coloured sand cliffs.", stay: "Eurong Beach Resort or Sailfish on Fraser", eat: "Resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Northern K'gari", day: "Day 5", type: "highlight", desc: "Indian Head — climb the headland for whale and dolphin spotting (seasonal). Champagne Pools — natural rock pools with waves crashing over. Lake Wabby — a perched lake slowly swallowed by a sand blow.", stay: "Orchid Beach retreats", eat: "Local options or resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Hervey Bay (optional extension)", day: "Days 6–7", type: "stop", desc: "Barge back to the mainland via River Heads. Hervey Bay — whale watching capital of Australia (Jul–Nov), Urangan Pier, relaxed waterfront town. A slower finish before heading south.", stay: "Hervey Bay waterfront accommodation", eat: "The Black Dog Café, Coast Restaurant", source: "visitherveybay.com.au" },
    ],
  },
  {
    id: "moreton",
    name: "Moreton Island Experience",
    config: "Touring",
    duration: "4–5 Days",
    guests: "2–4 Guests",
    route: "Brisbane · Moreton Island (Mulgumpin)",
    tagline: "Wrecks, dolphins, and sand-tobogganing — an hour from Brisbane",
    description: "The world's third-largest sand island, hiding in plain sight off the Brisbane coastline. MICAT barge from the Port of Brisbane straight to Tangalooma. Snorkel the Tangalooma Wrecks, climb Cape Moreton's heritage lighthouse, sand-toboggan the Desert, swim the Blue Lagoon, and hand-feed wild bottlenose dolphins at dusk. Short, focused, and properly remote despite the Brisbane skyline on the horizon.",
    includes: ["Luxury SUV", "All-inclusive daily rate", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "MICAT barge + Moreton permits", "Beach driving briefing", "Luxury curated accommodation", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Brisbane → Tangalooma", day: "Day 1", type: "transit", desc: "We deliver to your Brisbane hotel or our Banyo yard. Short drive to the Port of Brisbane, then 75 minutes across the bay on the MICAT vehicle barge to Tangalooma. Air down tyres on arrival, vehicle briefing on the beach.", stay: "Tangalooma Island Resort", eat: "Tursiops Restaurant, Beach Café Tangalooma", source: "moretonislandadventures.com.au" },
      { name: "Tangalooma & the Wrecks", day: "Days 2–3", type: "highlight", desc: "Snorkel the Tangalooma Wrecks — 15 sunken hulls now thriving as an artificial reef, ten metres off the beach. Sand-toboggan the Desert, swim the Blue Lagoon, walk to Honeyeater Lake. Hand-feed wild bottlenose dolphins at dusk on the Tangalooma jetty. Two nights at the resort.", stay: "Tangalooma Island Resort", eat: "Fire & Stone, Tursiops Restaurant", source: "tangalooma.com" },
      { name: "Cape Moreton & North", day: "Day 4", type: "highlight", desc: "Drive the sand track north to Cape Moreton — Queensland's oldest lighthouse (1857) on the cliff edge, perfect for whale and dolphin spotting (seasonal). Champagne Pools at North Point, secluded swimming at Honeymoon Bay.", stay: "Tangalooma Island Resort or northern bush camp lodge", eat: "Resort dining", source: "parks.des.qld.gov.au" },
      { name: "Return to Brisbane", day: "Day 5", type: "transit", desc: "Final swim, MICAT barge back to the mainland. Vehicle drop-off at our Banyo yard or your Brisbane hotel.", stay: "Home", eat: "One last lunch at the Port", source: "" },
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
    description: "Start right in the tropics — we deliver your luxury SUV to Cairns Airport so you skip the drive north entirely. Explore Mossman Gorge, the Daintree, Cape Tribulation, Atherton Tablelands, and the reef. Select from our curated eco-lodges and retreats at each stop.",
    includes: ["Luxury SUV", "All-inclusive daily rate", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Cairns airport delivery included", "Luxury curated accommodation", "MAXTRAX + recovery kit", "Tropical route guide", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Cairns", day: "Day 1", type: "transit", desc: "Your starting point. We deliver your luxury SUV to Cairns Airport and fly in to do your handover personally — full vehicle briefing, keys in your hand.", stay: "Cairns or Palm Cove accommodation", eat: "Prawn Star, Salt House, Cairns Night Markets", source: "ellisbeach.com.au" },
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
    includes: ["Luxury SUV", "All-inclusive daily rate", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Luxury curated accommodation", "MAXTRAX + recovery kit", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Airlie Beach", day: "Days 1–3", type: "highlight", desc: "Gateway to the Whitsunday Islands. Day trip to Whitehaven Beach — consistently rated one of the world's best beaches. Sailing, kayaking, snorkelling the outer reef. Whitsunday Great Walk. Three nights to do it justice.", stay: "Airlie Beach accommodation", eat: "Fish D'vine, Mr Bones, Northerlies Beach Bar", source: "big4.com.au" },
      { name: "Cape Hillsborough", day: "Days 4–5", type: "highlight", desc: "Cape Hillsborough National Park — kangaroos and wallabies on the beach at sunrise. One of Queensland's most iconic wildlife encounters. Eungella National Park platypus viewing nearby.", stay: "Cape Hillsborough lodge accommodation", eat: "The Dispensary Mackay, Foodspace", source: "capehillsboroughnatureresort.com.au" },
      { name: "Mackay", day: "Days 6–7", type: "stop", desc: "Bluewater Lagoon, Harbour Beach, and the botanical gardens. A relaxed finish before drop-off. We collect the vehicle from Mackay.", stay: "Mackay accommodation", eat: "The Dispensary, Burp Eat Dessert", source: "mackayregion.com" },
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
    includes: ["Luxury SUV", "All-inclusive daily rate", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Luxury curated accommodation", "Beach driving briefing", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Byron Bay", day: "Days 1–2", type: "highlight", desc: "Cape Byron lighthouse — most easterly point of mainland Australia. Sunrise walk, The Pass for surfing, Main Beach for swimming. The Farm for produce-driven dining. Two nights to soak it in.", stay: "Byron Bay accommodation", eat: "The Balcony Bar & Oyster Co, Three Blue Ducks at The Farm", source: "firstsunbyronbay.com.au" },
      { name: "Ballina & Air Force Beach", day: "Day 3", type: "stop", desc: "South to Air Force Beach — 4.6km stretch of beach driving, no permit required, free access. Easy sand driving introduction. Richmond River, Ballina waterfront.", stay: "Ballina accommodation", eat: "Wharf Bar & Restaurant Ballina", source: "flatrocktentpark.com.au" },
      { name: "Yamba", day: "Days 4–5", type: "highlight", desc: "Consistently rated one of Australia's best small towns. Angourie — NSW's first surfing reserve, blue and green freshwater pools in the rock shelves. Fish and chips on the headland. Proper dwell time.", stay: "Yamba accommodation", eat: "Beachwood Café, Pacific Hotel Yamba (sunset on the deck)", source: "bluedolphinholidayresort.com.au" },
      { name: "Return", day: "Days 6–7", type: "transit", desc: "Drive back to Gold Coast or Ballina for drop-off. Optional extra night in Byron or the hinterland if you're not ready to leave.", stay: "Byron Bay or Gold Coast accommodation", eat: "Your choice — one last café stop", source: "" },
    ],
  },
  {
    id: "southern-downs",
    name: "Southern Downs Golf & Wine",
    config: "Touring",
    duration: "5–7 Days",
    guests: "2–4 Guests",
    route: "Brisbane · Toowoomba · Stanthorpe · Warwick",
    tagline: "Queensland's coolest-climate wine region, on the green",
    description: "Up and over the Great Dividing Range to Queensland's premier cool-climate wine country. Tee off at City Golf Club in Toowoomba, work the Granite Belt's cellar doors at Stanthorpe — Sirromet, Ballandean Estate, Heritage Estate, Symphony Hill — then on to Warwick for one more round before the run back to Brisbane. Granite boulders the size of houses at Girraween, long lunches among the vines, and a luxury SUV that handles the back roads as well as the highway.",
    includes: ["Luxury SUV", "All-inclusive daily rate", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining & cellar door guide", "Personal concierge", "Starlink satellite internet", "Green fees & tee time bookings", "Luxury curated accommodation", "Granite Belt wine trail map", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Toowoomba", day: "Day 1", type: "stop", desc: "Up the range from Brisbane (1.5hrs). Round of 18 at City Golf Club — championship parkland course in the Garden City. Picnic Point lookout over the Lockyer Valley at sunset. Toowoomba's craft beer and laneway dining scene.", stay: "Toowoomba boutique accommodation", eat: "The Spotted Cow, Park House, Picnic Point café", source: "citygolfclub.com.au" },
      { name: "Stanthorpe & the Granite Belt", day: "Days 2–4", type: "highlight", desc: "Queensland's only cool-climate wine region — and the highest. Cellar door tour through Ballandean Estate, Sirromet, Heritage Estate, Symphony Hill, Ridgemill. Strange Bird trail for alternative varieties. Round at Stanthorpe Golf Club among the granite outcrops. Day trip to Girraween National Park — house-sized granite boulders, the Pyramid, Castle Rock. Three nights to do it properly.", stay: "Granite Belt vineyard cottages or Stanthorpe boutique accommodation", eat: "Varias at Queensland College of Wine Tourism, The Barrelroom & Larder, Heritage Estate Restaurant", source: "granitebeltwinecountry.com.au" },
      { name: "Warwick & Killarney", day: "Days 5–6", type: "highlight", desc: "Heritage town founded on bluestone and bushrangers. 18 holes at Warwick Golf Club — long-established country course. Drive out to Killarney for Queen Mary Falls and Browns Falls. Cellar door tasting at Sundown Valley on the way back. Two nights among the heritage streets.", stay: "Warwick heritage accommodation", eat: "Belle's Café, Warwick Hotel, Picnic at Killarney", source: "warwickgolfclub.com.au" },
      { name: "Brisbane (return)", day: "Day 7", type: "transit", desc: "Run back down the range to Brisbane (2hrs). Drop the vehicle at our Banyo yard or your hotel. A boot full of Granite Belt bottles to take home.", stay: "Home", eat: "One last long lunch on the way down", source: "" },
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
    includes: ["All-inclusive daily rate", "Fleet fuel card (BP/Shell/Ampol)", "Breakfast included (where available)", "Curated dining guide", "Personal concierge", "Starlink satellite internet", "Personalised route consultation", "Luxury curated accommodation", "All standard inclusions", "Flexible duration", "24/7 support"],
    vibe: "both",
    stops: null,
  },
];

export default function SouthernHorizonSite() {
  const [authenticated, setAuthenticated] = useState(true);  // Password gate disabled — site is public
  const [pw, setPw] = useState("");
  const [pwError, setPwError] = useState(false);
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({});
  const [viewingPrivacy, setViewingPrivacy] = useState(
    typeof window !== "undefined" && window.location.pathname === "/privacy"
  );
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

  // Handle browser back/forward buttons for /privacy route
  useEffect(() => {
    const onPopState = () => {
      setViewingPrivacy(window.location.pathname === "/privacy");
      window.scrollTo(0, 0);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openPrivacy = () => {
    window.history.pushState({}, "", "/privacy");
    setViewingPrivacy(true);
    window.scrollTo(0, 0);
  };

  const closePrivacy = () => {
    window.history.pushState({}, "", "/");
    setViewingPrivacy(false);
    window.scrollTo(0, 0);
  };

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
    const pkgMap = {"K'gari Experience":"kgari","Moreton Island Experience":"moreton",
      "Tropical North":"tropical-north","Whitsundays":"whitsundays","Byron Bay":"byron-bay",
      "Southern Downs Golf & Wine":"southern-downs","Custom Journey":"custom","Not sure yet":"custom"};
    const pkgId = pkgMap[formData.package] || "custom";

    const pkgStops = {
      kgari: [{n:"Rainbow Beach & Inskip",ni:1},{n:"Southern K'gari",ni:2},{n:"75 Mile Beach",ni:1},{n:"Northern K'gari",ni:1},{n:"Hervey Bay (optional)",ni:1}],
      moreton: [{n:"Brisbane → Tangalooma",ni:1},{n:"Tangalooma & the Wrecks",ni:2},{n:"Cape Moreton & North",ni:1},{n:"Return to Brisbane",ni:0}],
      "tropical-north": [{n:"Cairns",ni:1},{n:"Port Douglas & Mossman Gorge",ni:2},{n:"Daintree Rainforest",ni:2},{n:"Cape Tribulation",ni:2},{n:"Atherton Tablelands",ni:2},{n:"Cairns (return)",ni:2}],
      whitsundays: [{n:"Airlie Beach",ni:3},{n:"Cape Hillsborough",ni:2},{n:"Mackay",ni:1}],
      "byron-bay": [{n:"Byron Bay",ni:2},{n:"Ballina & Air Force Beach",ni:1},{n:"Yamba",ni:2}],
      "southern-downs": [{n:"Toowoomba",ni:1},{n:"Stanthorpe & the Granite Belt",ni:3},{n:"Warwick & Killarney",ni:2},{n:"Brisbane (return)",ni:0}],
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
            website_link: "https://southernhorizonco.com.au",
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

  // ═══ PRIVACY POLICY PAGE ═══
  if (viewingPrivacy) {
    const h1Style = {fontFamily:serif,fontSize:40,fontWeight:500,color:neutral.dark,marginBottom:8,letterSpacing:-0.5};
    const h2Style = {fontFamily:serif,fontSize:22,fontWeight:500,color:neutral.dark,marginTop:40,marginBottom:14,letterSpacing:-0.2};
    const h3Style = {fontFamily:sans,fontSize:13,fontWeight:600,color:neutral.dark,marginTop:20,marginBottom:8,letterSpacing:0.2};
    const pStyle = {fontFamily:sans,fontSize:14,fontWeight:300,color:neutral.mid,lineHeight:1.75,marginBottom:12};
    const liStyle = {fontFamily:sans,fontSize:14,fontWeight:300,color:neutral.mid,lineHeight:1.75,marginBottom:6,marginLeft:18};
    const tableStyle = {width:"100%",borderCollapse:"collapse",marginTop:14,marginBottom:20,fontFamily:sans,fontSize:12.5};
    const thStyle = {textAlign:"left",padding:"10px 12px",borderBottom:`1.5px solid ${neutral.dark}`,fontWeight:600,fontSize:11,letterSpacing:0.8,textTransform:"uppercase",color:neutral.dark};
    const tdStyle = {padding:"10px 12px",borderBottom:`1px solid ${neutral.border}`,color:neutral.mid,fontWeight:300,verticalAlign:"top",lineHeight:1.55};

    return (
      <>
        <style>{`
          @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700&family=Figtree:wght@300;400;500;600;700&display=swap');
          *{margin:0;padding:0;box-sizing:border-box}
          body{background:${neutral.white}}
          ::selection{background:${gold};color:#fff}
        `}</style>

        {/* Simple nav bar */}
        <nav style={{position:"sticky",top:0,zIndex:50,background:"#fff",borderBottom:`1px solid ${neutral.border}`,padding:"16px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto",display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div onClick={closePrivacy} style={{display:"flex",alignItems:"center",gap:10,cursor:"pointer"}}>
              <SHCoLogo size={36}/>
              <div style={{display:"flex",alignItems:"baseline",gap:6}}>
                <span style={{fontFamily:serif,fontSize:20,fontWeight:400,color:neutral.dark,letterSpacing:0.5}}>Southern Horizon</span>
                <span style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",color:gold}}>Co.</span>
              </div>
            </div>
            <button onClick={closePrivacy} style={{
              fontFamily:sans,fontSize:12,fontWeight:500,color:neutral.dark,
              background:"transparent",border:`1px solid ${neutral.border}`,
              padding:"8px 18px",borderRadius:999,cursor:"pointer",letterSpacing:0.5,
            }}>← Back to site</button>
          </div>
        </nav>

        {/* Privacy policy content */}
        <div style={{maxWidth:780,margin:"0 auto",padding:"56px 28px 80px"}}>
          <div style={{fontFamily:sans,fontSize:11,fontWeight:600,color:gold,letterSpacing:2.5,textTransform:"uppercase",marginBottom:16}}>Legal</div>
          <h1 style={h1Style}>Privacy Policy</h1>
          <p style={{fontFamily:sans,fontSize:13,color:neutral.light,marginBottom:40,fontWeight:300,fontStyle:"italic"}}>Last updated: April 2026</p>

          <h2 style={h2Style}>1. About this policy</h2>
          <p style={pStyle}>1.1 Southern Horizon Co. Pty Ltd (ABN to be registered) ("SHCo", "we", "us", "our") respects your privacy and takes the protection of your personal information seriously.</p>
          <p style={pStyle}>1.2 This Privacy Policy describes how we collect, use, disclose, store, and protect your personal information. It applies to all personal information we collect from you — whether through our website, during a booking enquiry or consultation, during your hire period, or through any other interaction with our business.</p>
          <p style={pStyle}>1.3 We are bound by the Australian Privacy Principles (APPs) under the Privacy Act 1988 (Cth) as a matter of good practice. We also recognise the rights of guests from the United Kingdom, European Union, and other jurisdictions under their respective data protection laws, including UK GDPR, EU GDPR, and the California Consumer Privacy Act where applicable.</p>
          <p style={pStyle}>1.4 By providing your personal information to us or using our services, you consent to the collection, use, and disclosure of your personal information in accordance with this Policy.</p>
          <p style={pStyle}>1.5 If you do not agree with this Policy, please do not provide us with your personal information or use our services.</p>

          <h2 style={h2Style}>2. What personal information we collect</h2>
          <p style={pStyle}>We collect the following categories of personal information:</p>

          <h3 style={h3Style}>2.1 Identification and contact information</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>full name, date of birth, nationality;</li>
            <li style={liStyle}>postal address, email address, phone number;</li>
            <li style={liStyle}>passport or other government-issued identification where required for booking verification.</li>
          </ul>

          <h3 style={h3Style}>2.2 Driver information (for all Authorised Drivers)</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>driver licence details including licence number, issuing authority, class, and expiry;</li>
            <li style={liStyle}>International Driving Permit details where applicable;</li>
            <li style={liStyle}>driving history including licence suspensions in the preceding three years;</li>
            <li style={liStyle}>date of birth and years of full licence held.</li>
          </ul>

          <h3 style={h3Style}>2.3 Emergency and guest information</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>emergency contact names, phone numbers, and relationships for all guests;</li>
            <li style={liStyle}>names and dates of birth of all persons travelling in the vehicle;</li>
            <li style={liStyle}>child passenger details and child seat requirements.</li>
          </ul>

          <h3 style={h3Style}>2.4 Health and dietary information (sensitive information under the Privacy Act)</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>food allergies including anaphylactic and non-anaphylactic allergies;</li>
            <li style={liStyle}>medical conditions relevant to dietary management (including coeliac disease, diabetes, and similar);</li>
            <li style={liStyle}>dietary restrictions arising from medical, religious, or cultural practice;</li>
            <li style={liStyle}>any other health information you disclose that is relevant to your safe participation in the hire period.</li>
          </ul>

          <h3 style={h3Style}>2.5 Payment information</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>credit card or debit card details;</li>
            <li style={liStyle}>billing address;</li>
            <li style={liStyle}>transaction history.</li>
          </ul>
          <p style={pStyle}>Full card numbers are processed by our payment processor and are not stored in our systems. We retain transaction references and last four digits only.</p>

          <h3 style={h3Style}>2.6 Vehicle and trip data</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>real-time GPS location of the vehicle during the Hire Period;</li>
            <li style={liStyle}>dashcam footage captured by the vehicle;</li>
            <li style={liStyle}>OBD-II vehicle performance data;</li>
            <li style={liStyle}>accident or incident reports completed during the Hire Period.</li>
          </ul>

          <h3 style={h3Style}>2.7 Website and enquiry data</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>enquiry form submissions including trip interests, travel dates, group composition;</li>
            <li style={liStyle}>correspondence with us including emails, phone call notes, and consultation records;</li>
            <li style={liStyle}>IP address, browser type, device information, and basic usage data collected passively by our hosting and analytics infrastructure.</li>
          </ul>

          <h3 style={h3Style}>2.8 Marketing preferences</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>your consent to receive marketing communications;</li>
            <li style={liStyle}>engagement with marketing content we send.</li>
          </ul>

          <h2 style={h2Style}>3. How we collect your personal information</h2>
          <p style={pStyle}><strong>3.1 Directly from you:</strong> we collect most of our information directly from you — through our enquiry form, during booking consultations, in the Self-Drive Hire Agreement and its schedules, and during the vehicle handover briefing.</p>
          <p style={pStyle}><strong>3.2 From your travel agent or operator:</strong> if you book with us through a travel operator such as Audley Travel, Swain Destinations, Down Under Endeavours, Kuoni, Lightfoot Travel, or Scott Dunn, we will receive your booking information from them.</p>
          <p style={pStyle}><strong>3.3 Passively through our website:</strong> our website, hosted by Vercel, automatically collects basic technical information about your visit including IP address, browser type, pages visited, and referring source. Google services including Google Search Console may also collect information about how our website appears in search results. We do not currently operate any direct marketing analytics or advertising pixels on the website. If we add such tools in future — for example when we launch Google Ads — we will update this Policy accordingly.</p>
          <p style={pStyle}><strong>3.4 Automatically from the vehicle during the Hire Period:</strong> once the Hire Period commences and you take possession of the Vehicle, we automatically collect GPS location data and OBD-II vehicle data in real time for the duration of the Hire Period. Your consent to this collection is obtained in the Self-Drive Hire Agreement.</p>
          <p style={pStyle}><strong>3.5 From third parties:</strong> in the ordinary course of our business we may receive personal information about you from accommodation providers, emergency services, insurance providers, or law enforcement where relevant to the administration of your booking or any incident.</p>

          <h2 style={h2Style}>4. Why we collect your personal information</h2>
          <p style={pStyle}>We collect personal information for specific, disclosed purposes only. We do not collect information we do not need.</p>

          <h3 style={h3Style}>4.1 To manage your booking and hire</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>processing enquiries, providing quotes, and conducting booking consultations;</li>
            <li style={liStyle}>arranging accommodation, vehicle access permits, and route logistics on your behalf;</li>
            <li style={liStyle}>verifying driver eligibility and preparing the Self-Drive Hire Agreement;</li>
            <li style={liStyle}>processing payment and managing the security bond.</li>
          </ul>

          <h3 style={h3Style}>4.2 To deliver the SHCo touring experience</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>communicating dietary requirements to accommodation providers for breakfast provisioning;</li>
            <li style={liStyle}>providing 24/7 route support, safety monitoring, and emergency response via GPS location data during the Hire Period;</li>
            <li style={liStyle}>managing vehicle handover, return, and condition reporting.</li>
          </ul>

          <h3 style={h3Style}>4.3 To meet legal and safety obligations</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>verifying driver licensing and insurance requirements;</li>
            <li style={liStyle}>responding to requests from law enforcement, emergency services, or regulatory bodies;</li>
            <li style={liStyle}>meeting our obligations as a registered inbound tour operator under the Tourism Services Act 2003 (Qld);</li>
            <li style={liStyle}>meeting record-keeping requirements under Australian tax and corporate law.</li>
          </ul>

          <h3 style={h3Style}>4.4 To manage incidents and insurance</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>responding to vehicle accidents, breakdowns, or emergencies during the Hire Period;</li>
            <li style={liStyle}>processing insurance claims on your behalf or on our own behalf;</li>
            <li style={liStyle}>investigating damage, loss, or disputes arising from the Hire Period.</li>
          </ul>

          <h3 style={h3Style}>4.5 To communicate with you</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>responding to enquiries, providing booking confirmations and pre-departure information;</li>
            <li style={liStyle}>sending service-related communications including route updates and safety notifications;</li>
            <li style={liStyle}>sending marketing communications where you have consented to receive them.</li>
          </ul>

          <h3 style={h3Style}>4.6 To improve our services</h3>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>analysing booking patterns and route performance (using aggregated and de-identified data where possible);</li>
            <li style={liStyle}>training and quality assurance of our consultation and operational processes;</li>
            <li style={liStyle}>responding to feedback and resolving complaints.</li>
          </ul>

          <h2 style={h2Style}>5. Health and dietary information — sensitive information</h2>
          <p style={pStyle}>5.1 Information about your health, dietary requirements, and allergies is "sensitive information" under the Privacy Act 1988 (Cth) and receives additional protection under this Policy.</p>
          <p style={pStyle}>5.2 We collect sensitive information only with your consent and only for the purposes disclosed in this Policy — specifically, to ensure your safety and wellbeing during the Hire Period and to communicate your requirements to accommodation providers responsible for your breakfast meals.</p>
          <p style={pStyle}>5.3 We do not share sensitive information with anyone other than:</p>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>accommodation providers who need it to prepare breakfast accommodating your disclosed requirements;</li>
            <li style={liStyle}>emergency services and medical professionals in the event of a medical emergency during the Hire Period;</li>
            <li style={liStyle}>our insurers and their representatives in the event of an incident or claim where the information is relevant.</li>
          </ul>
          <p style={pStyle}>5.4 We do not use sensitive information for marketing, analytics, or any commercial purpose unrelated to your safe participation in the trip.</p>

          <h2 style={h2Style}>6. How we share your personal information</h2>
          <p style={pStyle}>6.1 We share personal information only as necessary to deliver your booking, manage our business operations, or meet legal obligations.</p>
          <p style={pStyle}><strong>6.2 Third parties we share information with:</strong></p>
          <div style={{overflowX:"auto",marginTop:8}}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Category</th>
                  <th style={thStyle}>Examples</th>
                  <th style={thStyle}>Purpose</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Accommodation providers</td><td style={tdStyle}>Hotels, lodges, resorts along your route</td><td style={tdStyle}>Booking accommodation, communicating dietary requirements</td></tr>
                <tr><td style={tdStyle}>Payment processors</td><td style={tdStyle}>Stripe, card networks</td><td style={tdStyle}>Processing your payment and bond</td></tr>
                <tr><td style={tdStyle}>Vehicle repositioning carriers</td><td style={tdStyle}>Truck carriers for interstate routes</td><td style={tdStyle}>Arranging vehicle delivery to your handover location</td></tr>
                <tr><td style={tdStyle}>Trade distribution partners</td><td style={tdStyle}>Audley Travel, Swain Destinations, Down Under Endeavours, Kuoni, Lightfoot Travel, Scott Dunn</td><td style={tdStyle}>Managing bookings made through those operators</td></tr>
                <tr><td style={tdStyle}>Insurance providers</td><td style={tdStyle}>Commercial hire fleet insurer, public liability insurer</td><td style={tdStyle}>Managing insurance and claims</td></tr>
                <tr><td style={tdStyle}>Professional advisors</td><td style={tdStyle}>Lawyers, accountants, auditors</td><td style={tdStyle}>Obtaining legal and financial advice</td></tr>
                <tr><td style={tdStyle}>Technology service providers</td><td style={tdStyle}>Google Workspace, HubSpot, EmailJS, Firebase, Vercel</td><td style={tdStyle}>Email, CRM, booking confirmations, data storage, website hosting</td></tr>
                <tr><td style={tdStyle}>Government and regulatory bodies</td><td style={tdStyle}>Queensland Parks and Wildlife Service, Queensland Police, Australian Taxation Office</td><td style={tdStyle}>Meeting legal and regulatory obligations</td></tr>
                <tr><td style={tdStyle}>Emergency services</td><td style={tdStyle}>Ambulance, police, search and rescue</td><td style={tdStyle}>Responding to emergencies during the Hire Period</td></tr>
              </tbody>
            </table>
          </div>
          <p style={pStyle}>6.3 We do not sell or rent your personal information to any third party for marketing or advertising purposes.</p>
          <p style={pStyle}>6.4 Where we share your personal information with a third party, we take reasonable steps to ensure that third party is bound by obligations of confidentiality and uses your information only for the purpose for which we shared it.</p>

          <h2 style={h2Style}>7. Overseas disclosure</h2>
          <p style={pStyle}>7.1 SHCo is based in Australia and our operations are located in Queensland. However, some of our service providers and trade distribution partners are located overseas. By providing us with your personal information, you consent to us transferring your personal information to the following countries:</p>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}><strong>United Kingdom</strong> — Audley Travel (trade distribution) and potentially other UK-based operators;</li>
            <li style={liStyle}><strong>United States</strong> — Swain Destinations and Down Under Endeavours (trade distribution), as well as technology service providers including Google, HubSpot, and Firebase (which may store data in US data centres);</li>
            <li style={liStyle}><strong>Switzerland and Germany</strong> — Kuoni and DERTOUR (trade distribution in Europe);</li>
            <li style={liStyle}><strong>Singapore and Hong Kong</strong> — Lightfoot Travel (trade distribution);</li>
            <li style={liStyle}><strong>Other jurisdictions</strong> — where a guest's booking involves an accommodation provider or service based outside Australia, or where our technology service providers process data in other regions.</li>
          </ul>
          <p style={pStyle}>7.2 When we transfer your personal information overseas, we take reasonable steps to ensure the recipient complies with obligations substantially similar to the Australian Privacy Principles, or that we obtain your consent to the transfer.</p>

          <h2 style={h2Style}>8. How long we keep your personal information</h2>
          <p style={pStyle}>8.1 We retain personal information only for as long as necessary to fulfil the purposes for which it was collected, meet our legal and regulatory obligations, and protect our legal rights.</p>
          <p style={pStyle}><strong>8.2 Retention periods by data category:</strong></p>
          <div style={{overflowX:"auto",marginTop:8}}>
            <table style={tableStyle}>
              <thead>
                <tr>
                  <th style={thStyle}>Data category</th>
                  <th style={thStyle}>Retention period</th>
                  <th style={thStyle}>Reason</th>
                </tr>
              </thead>
              <tbody>
                <tr><td style={tdStyle}>Booking records, contracts, financial records</td><td style={tdStyle}>7 years after end of relevant financial year</td><td style={tdStyle}>Australian tax and corporate record-keeping</td></tr>
                <tr><td style={tdStyle}>Incident reports, insurance claims</td><td style={tdStyle}>7 years after claim closure or longer if required</td><td style={tdStyle}>Insurance and personal injury statute of limitations</td></tr>
                <tr><td style={tdStyle}>Driver licence and identification details</td><td style={tdStyle}>7 years after end of relevant financial year</td><td style={tdStyle}>Aligned with booking record retention</td></tr>
                <tr><td style={tdStyle}>Health and dietary information</td><td style={tdStyle}>Duration of relevant booking plus 12 months</td><td style={tdStyle}>Managing post-trip dietary incident claims</td></tr>
                <tr><td style={tdStyle}>GPS location data during Hire Period</td><td style={tdStyle}>1 year after end of Hire Period</td><td style={tdStyle}>Incident investigation and claim defence</td></tr>
                <tr><td style={tdStyle}>GPS location data for active claims</td><td style={tdStyle}>Until matter finalised plus 7 years</td><td style={tdStyle}>Defence of legal claims</td></tr>
                <tr><td style={tdStyle}>Dashcam footage</td><td style={tdStyle}>30 days routine; longer if relevant to a claim</td><td style={tdStyle}>Operational storage; extended for claims</td></tr>
                <tr><td style={tdStyle}>Marketing contact data</td><td style={tdStyle}>3 years from last interaction or until you withdraw consent</td><td style={tdStyle}>Refreshing marketing permissions</td></tr>
                <tr><td style={tdStyle}>Enquiry form submissions (unconverted)</td><td style={tdStyle}>2 years</td><td style={tdStyle}>Allowing time for deferred enquiries to proceed</td></tr>
                <tr><td style={tdStyle}>Website analytics and technical logs</td><td style={tdStyle}>12 months</td><td style={tdStyle}>Ordinary operational purposes</td></tr>
              </tbody>
            </table>
          </div>
          <p style={pStyle}>8.3 After the applicable retention period expires, we securely destroy or de-identify the personal information.</p>
          <p style={pStyle}>8.4 We may retain personal information for longer than the periods above where required for the defence of a legal claim, compliance with a legal obligation, or where you have consented to extended retention.</p>

          <h2 style={h2Style}>9. How we protect your personal information</h2>
          <p style={pStyle}>9.1 We take the security of your personal information seriously and implement a range of measures to protect it from unauthorised access, use, modification, loss, or disclosure:</p>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}>all booking data is stored in Firebase Firestore with access restricted to authenticated SHCo personnel;</li>
            <li style={liStyle}>website hosting is provided by Vercel with industry-standard transport layer encryption (HTTPS);</li>
            <li style={liStyle}>credit card details are processed by our payment processor and are not stored in our systems — we retain only transaction references;</li>
            <li style={liStyle}>physical documents are stored securely at our Banyo premises with access restricted to authorised personnel;</li>
            <li style={liStyle}>GPS location data is stored in secure cloud infrastructure with encrypted transmission and restricted access;</li>
            <li style={liStyle}>staff and contractors are bound by confidentiality obligations.</li>
          </ul>
          <p style={pStyle}>9.2 No system can be guaranteed to be 100% secure. If we become aware of a data breach that involves your personal information and is likely to result in serious harm, we will notify you and the Office of the Australian Information Commissioner (OAIC) in accordance with the Notifiable Data Breaches scheme under the Privacy Act.</p>

          <h2 style={h2Style}>10. Your rights and how to exercise them</h2>
          <p style={pStyle}>10.1 You have the following rights in relation to your personal information:</p>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}><strong>Access</strong> — you may request access to the personal information we hold about you. We will provide access unless an exception under the Privacy Act applies.</li>
            <li style={liStyle}><strong>Correction</strong> — you may request that we correct any personal information that is inaccurate, incomplete, or out of date.</li>
            <li style={liStyle}><strong>Withdrawal of consent</strong> — you may withdraw your consent to our collection and use of your personal information at any time. Where you withdraw consent, we may not be able to continue providing our services to you.</li>
            <li style={liStyle}><strong>Marketing opt-out</strong> — you may opt out of receiving marketing communications at any time by clicking the unsubscribe link in any marketing email or by contacting us directly.</li>
            <li style={liStyle}><strong>Complaint</strong> — you may complain about how we have handled your personal information by contacting us using the details below. We will acknowledge your complaint within 5 business days and respond substantively within 30 days.</li>
          </ul>
          <p style={pStyle}>10.2 <strong>Additional rights for UK and EU residents</strong> — if you are a resident of the United Kingdom or European Union, you may have additional rights under UK GDPR or EU GDPR including the right to data portability, the right to object to processing, the right to restriction of processing, and the right to erasure in certain circumstances. You may exercise these rights by contacting us using the details below.</p>
          <p style={pStyle}>10.3 <strong>Additional rights for California residents</strong> — if you are a resident of California, you may have additional rights under the California Consumer Privacy Act including the right to know what personal information we collect, the right to request deletion of your personal information, and the right to non-discrimination for exercising your privacy rights. SHCo does not sell personal information as defined under the CCPA.</p>
          <p style={pStyle}>10.4 If you are not satisfied with our response to a privacy complaint, you may lodge a complaint with:</p>
          <ul style={{listStyle:"disc"}}>
            <li style={liStyle}><strong>Australia</strong> — Office of the Australian Information Commissioner (OAIC) — www.oaic.gov.au — 1300 363 992;</li>
            <li style={liStyle}><strong>United Kingdom</strong> — Information Commissioner's Office (ICO) — www.ico.org.uk;</li>
            <li style={liStyle}><strong>European Union</strong> — your local data protection authority.</li>
          </ul>

          <h2 style={h2Style}>11. Cookies and website tracking</h2>
          <p style={pStyle}>11.1 Our website uses only essential technical cookies required for the website to function. We do not currently operate any direct marketing or advertising cookies, analytics trackers, or third-party advertising pixels.</p>
          <p style={pStyle}>11.2 Our hosting provider (Vercel) and search engine services (Google) collect basic technical information about website visits as part of their ordinary operation. This is standard for any website on the public internet.</p>
          <p style={pStyle}>11.3 If we introduce marketing analytics, advertising pixels, or other tracking technologies in future, we will update this Policy and provide a clear cookie consent mechanism at that time.</p>
          <p style={pStyle}>11.4 You can control cookies through your browser settings. Disabling cookies may affect the functionality of our website.</p>

          <h2 style={h2Style}>12. Children's privacy</h2>
          <p style={pStyle}>12.1 Our services are not directed at children under the age of 18. We do not knowingly collect personal information directly from children.</p>
          <p style={pStyle}>12.2 Where a booking involves children travelling with adult guests — including as passengers in the vehicle — we collect the child's name and date of birth for safety and emergency purposes only. This information is provided by the booking adult (parent or legal guardian) and is collected with their consent.</p>
          <p style={pStyle}>12.3 If we become aware that we have collected personal information directly from a child under 18 without appropriate consent, we will delete that information promptly.</p>

          <h2 style={h2Style}>13. Changes to this Policy</h2>
          <p style={pStyle}>13.1 We may update this Policy from time to time to reflect changes in our practices, our services, or applicable law.</p>
          <p style={pStyle}>13.2 When we make material changes, we will update the "Last updated" date at the top of this Policy and, where appropriate, notify you by email or through a notice on our website.</p>
          <p style={pStyle}>13.3 We encourage you to review this Policy periodically to stay informed about how we are handling your personal information.</p>

          <h2 style={h2Style}>14. Contact us</h2>
          <p style={pStyle}>If you have any questions about this Policy, wish to exercise any of your rights, or want to make a complaint, please contact us:</p>
          <div style={{background:neutral.soft,padding:"22px 24px",borderRadius:4,marginTop:14,marginBottom:20,borderLeft:`3px solid ${gold}`}}>
            <p style={{fontFamily:serif,fontSize:17,fontWeight:500,color:neutral.dark,marginBottom:10}}>Southern Horizon Co. Pty Ltd</p>
            <p style={{...pStyle,marginBottom:4}}>Banyo, Brisbane QLD 4014, Australia</p>
            <p style={{...pStyle,marginBottom:4}}>Email: <a href="mailto:privacy@southernhorizonco.com.au" style={{color:gold,textDecoration:"none"}}>privacy@southernhorizonco.com.au</a></p>
          </div>
          <p style={pStyle}>We will respond to your enquiry within 30 days.</p>

          <div style={{marginTop:56,paddingTop:28,borderTop:`1px solid ${neutral.border}`,textAlign:"center"}}>
            <button onClick={closePrivacy} style={{
              fontFamily:sans,fontSize:12,fontWeight:500,color:neutral.dark,
              background:"transparent",border:`1px solid ${neutral.dark}`,
              padding:"12px 28px",borderRadius:999,cursor:"pointer",letterSpacing:1,textTransform:"uppercase",
            }}>← Back to site</button>
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
              A fully-equipped luxury SUV — delivered to your airport,
              your hotel, or wherever you need it. 
              Drive K'gari's white sand, the Daintree's ancient rainforest, Queensland's red outback — 
              or all of them in one trip. Vehicle, accommodation, breakfast (where available), fuel, and concierge support included.
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
            {val:"All Inclusive",sub:"one daily rate covers all"},{val:"Concierge",sub:"personal trip support"},
            {val:"Luxury",sub:"Touring SUV"},
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
              {icon:"01",title:"Delivered to You",text:"Your luxury SUV comes to you — we meet you in arrivals at the airport, or at your hotel lobby, or wherever your trip begins. Brisbane, Gold Coast, Sunshine Coast, or Cairns. Starlink powered up, premium audio ready. You don't come to us — we come to you.",bg:coast.soft,border:neutral.border},
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
                Luxury SUV, accommodation, breakfast, fuel card, curated routes, Starlink, concierge support — everything included.
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
              Luxury <em style={{fontStyle:"italic"}}>Touring SUV</em>
            </h2>
            <p style={{fontFamily:sans,fontSize:14,color:neutral.light,fontWeight:300,letterSpacing:0.15,maxWidth:440,margin:"12px auto 0",lineHeight:1.7}}>
              As comfortable on the highway as it is on K'gari's sand or outback unsealed roads.
            </p>
          </div>
          <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:10,marginBottom:44}}>
            {[
              {l:"Engine",v:"3.3L Twin-Turbo V6 Diesel"},{l:"Drive",v:"Full-Time 4WD"},
              {l:"Accommodation",v:"Luxury Curated at Every Stop"},{l:"Breakfast",v:"Included at Your Hotel"},
              {l:"Audio",v:"Premium Audio"},{l:"Connectivity",v:"Starlink + Emergency Phone"},
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
              <h3 style={{fontFamily:serif,fontSize:20,fontWeight:700,color:neutral.dark,marginBottom:8}}>Luxury Touring — All Inclusive</h3>
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
                {n:"04",t:"Drive",d:"We meet you at the arrivals area and deliver your luxury SUV to the airport — or to your hotel entrance, or wherever suits. Brisbane, Gold Coast, Sunshine Coast, Cairns, or Sydney. Quick briefing, keys in your hand, and you're on the road.",accent:outback.primary},
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
                {t:"Mobility & Access",d:"The vehicle has a high step-up. Let us know about mobility needs — we'll discuss seating, routes, and accessibility.",bg:coast.soft},
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
                His mechanical background means every vehicle is specified to the highest standard — and when you call at 9pm with
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
                      {["","K'gari Experience","Moreton Island Experience","Tropical North","Whitsundays","Byron Bay","Southern Downs Golf & Wine","Custom Journey","Not sure yet"].map(o=><option key={o} value={o} style={{background:"#1C1917",color:o?"#fff":"#A8A29E"}}>{o||"Select..."}</option>)}
                    </select></div>
                  <div><label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Duration</label>
                    {(()=>{
                      const durOpts = {"K'gari Experience":["","5 days","6 days","7 days"],
                        "Moreton Island Experience":["","4 days","5 days"],
                        "Tropical North":["","7 days","8 days","9 days","10 days"],
                        "Whitsundays":["","7 days"],
                        "Byron Bay":["","5 days","6 days","7 days"],
                        "Southern Downs Golf & Wine":["","5 days","6 days","7 days"],
                        "Custom Journey":["","3 days","5 days","7 days","10 days","14 days","Other"],
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
                <p style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.35)",textAlign:"center",fontWeight:300,lineHeight:1.65,marginTop:-2}}>
                  By submitting, you agree to our{" "}
                  <span onClick={openPrivacy} style={{color:gold,cursor:"pointer",textDecoration:"underline",textUnderlineOffset:2}}>Privacy Policy</span>.
                </p>
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
                Luxury accommodation with breakfast is included at every stop. Fuel card provided. We curate a dining guide of our favourite restaurants at each stop — dinner is at your own leisure..
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
            <div style={{display:"flex",alignItems:"center",gap:20}}>
              <span onClick={openPrivacy} style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.4)",fontWeight:300,cursor:"pointer",letterSpacing:0.3}}
                onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>Privacy Policy</span>
              <span style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.25)",fontWeight:300}}>Coming Soon</span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
