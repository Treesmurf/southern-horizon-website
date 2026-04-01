import { useState, useEffect } from "react";

const SECTIONS = [
  { id: "home", label: "Home" },
  { id: "experience", label: "The Experience" },
  { id: "packages", label: "Packages" },
  { id: "vehicle", label: "The Vehicle" },
  { id: "camping-gear", label: "Camping Gear" },
  { id: "itinerary", label: "Plan Your Trip" },
  { id: "food-drink", label: "Food & Drink" },
  { id: "special-needs", label: "Requirements" },
  { id: "faq", label: "FAQs" },
  { id: "enquiry", label: "Register Interest" },
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
      { q: "What's included in the daily rate?", a: "The $950 daily rate covers everything that comes with the vehicle — the LandCruiser itself, insurance, all camping equipment, food and drinks fully stocked, a $500 Visa gift card for fuel, Telstra SIM, Starlink satellite internet, pre-planned route with curated stops, vehicle briefing, and 24/7 phone support. In camping mode, camp site fees are included. Accommodation in touring mode is additional — we present curated options at each stop, you pick what you like, and we handle all the bookings. You get one total package price." },
      { q: "How does accommodation work?", a: "It depends on your mode. In camping mode, everything you need to sleep is in the vehicle — tent, sleeping bags, mats, and lighting — and camp site fees are covered in your daily rate. In touring mode, we curate handpicked accommodation options at every stop on your route — outback stations, boutique lodges, coastal retreats, eco-lodges. You pick the options you like at each stop, we book everything for you, and you get one total accommodation price added to your package. No research, no chasing availability — just choose what appeals and we take care of the rest." },
      { q: "How does food work?", a: "Your LandCruiser arrives fully stocked with food and drinks — fresh produce, quality meats, pantry essentials, snacks, and cold drinks planned around your group size, duration, and dietary needs. For longer trips we map resupply points along your route." },
      { q: "How does fuel work?", a: "We provide a $500 Visa gift card for fuel purchases. For remote outback routes, we strongly recommend also carrying cash — some roadhouses and fuel stops may not have EFTPOS." },
      { q: "Is there a security bond?", a: "Yes — a tiered bond system varies by package and configuration. Full details come with your booking enquiry. The bond is fully refundable subject to standard return conditions." },
    ],
  },
  {
    category: "Booking & Logistics",
    items: [
      { q: "How long can I hire for?", a: "Our signature touring packages are curated at 21 days — long enough to genuinely experience every stop, not just drive through. K'gari and Tropical North run 5–10 days for a more focused experience. Want something shorter, longer, or completely custom? That's what the Custom Journey is for — minimum 3 days, no maximum." },
      { q: "Why is there a passenger limit?", a: "For comfort and safety. We cap at 4 adults or 2 adults and 3 children per trip. Outback and remote coastal touring involves long distances, variable road conditions, and limited access to services. Fewer passengers means more space in the cabin, better weight distribution for the vehicle, and a safer, more comfortable experience for everyone — especially on sand, corrugations, and unsealed roads." },
      { q: "Where do I pick up?", a: "We deliver your fully-stocked LandCruiser directly to your arrival airport — Brisbane, Gold Coast, Sunshine Coast (Maroochydore), or Cairns. Flying into Maroochydore? You could be at Rainbow Beach by lunchtime. Landing at Gold Coast? Head straight for the hinterland or north to K'gari. Flying into Cairns for the Tropical North? Your LandCruiser is waiting when you land. Already in Brisbane? We can deliver to your hotel, or you're welcome to collect from our yard in Banyo." },
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
    includes: ["LandCruiser 300 Series Sahara", "Camping or touring mode — your choice", "Food & drinks fully stocked", "$500 Visa gift card for fuel", "Telstra SIM + Starlink", "K'gari permits + barge", "Beach driving briefing", "Curated accommodation options (touring)", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Rainbow Beach & Inskip Point", day: "Day 1", type: "transit", desc: "Drive north from Brisbane (3–4hrs). Air down tyres at Inskip Point and catch the barge across to K'gari's southern tip.", stay: "Camp: MV Sarawak, Inskip Peninsula (toilets) | Accom: Rainbow Beach accommodation", eat: "Rainbow Beach Surf Club before crossing", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Southern K'gari", day: "Days 2–3", type: "highlight", desc: "Lake McKenzie — arguably Australia's most beautiful freshwater lake. Crystal clear water, white silica sand. Central Station rainforest walk among towering satinay trees. Two nights to soak it in.", stay: "Camp: Central Station (flush toilets, showers, fenced, dingo-safe) | Accom: Kingfisher Bay Resort or Eurong Beach Resort", eat: "Self-catered at camp or resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "75 Mile Beach & East Coast", day: "Day 4", type: "highlight", desc: "Drive the sand highway up the east coast — 75 Mile Beach is your road. Float down Eli Creek on your back through crystal-clear water that flows straight from the island’s interior. Walk around the rusting Maheno Shipwreck half-buried in the sand. Watch the Pinnacles glow orange at sunset — ancient coloured sand cliffs sculpted by wind and rain.", stay: "Camp: Dundubara (flush toilets, showers, fenced, fire rings) | Accom: Eurong Beach Resort or Sailfish on Fraser", eat: "Self-catered or resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Northern K'gari", day: "Day 5", type: "highlight", desc: "Climb Indian Head and scan the ocean for whales breaching, dolphins surfing, and sharks cruising the shallows below (seasonal Jul–Nov). Soak in the Champagne Pools — natural rock pools where waves crash over the volcanic rim, fizzing like a spa. Walk the sand blow to Lake Wabby and swim in a lake the dunes are slowly swallowing.", stay: "Camp: Waddy Point (flush toilets, showers, fenced, fire rings, beachfront) | Accom: Orchid Beach retreats", eat: "Self-catered — your fridge is still going strong", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Hervey Bay (optional extension)", day: "Days 6–7", type: "stop", desc: "Barge back to the mainland and head to Hervey Bay — the whale watching capital of Australia. Board a cruise and watch humpbacks breach, tail-slap, and spy-hop metres from the boat (Jul–Nov, sightings almost guaranteed). Walk the historic Urangan Pier at sunset. A slower finish before heading south.", stay: "Camp: Hervey Bay caravan parks | Accom: Hervey Bay waterfront accommodation", eat: "The Black Dog Café, Coast Restaurant", source: "visitherveybaay.com.au" },
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
    includes: ["LandCruiser 300 Series Sahara", "Camping or touring mode — your choice", "Food & drinks fully stocked", "$500 Visa gift card for fuel", "Telstra SIM + Starlink", "Cairns airport delivery included", "Curated accommodation options (touring)", "All recovery & safety gear", "Tropical route guide", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Cairns", day: "Day 1", type: "transit", desc: "Your starting point. We deliver your LandCruiser to Cairns Airport and fly in to do your handover personally — full vehicle briefing, keys in your hand, fridge stocked. Swim in the Esplanade lagoon on the waterfront, then wander the night markets for street food and local crafts as the tropical sun sets.", stay: "Camp: Ellis Beach Oceanfront Bungalows (toilets, showers, beachfront) | Accom: Cairns or Palm Cove accommodation", eat: "Prawn Star, Salt House, Cairns Night Markets", source: "ellisbeach.com.au" },
      { name: "Port Douglas & Mossman Gorge", day: "Days 2–3", type: "highlight", desc: "Walk the full length of Four Mile Beach at sunrise before the town wakes up. Browse the Sunday markets for tropical mango smoothies and handmade jewellery. Take a Kuku Yalanji Dreamtime walk through Mossman Gorge — your Indigenous guide shares stories of the rainforest while you cool off in a crystal-clear swimming hole among granite boulders. Sail to the Low Isles for calm-water snorkelling, or head to the outer Agincourt Ribbon Reef for serious diving.", stay: "Camp: Wonga Beach Camping Area — QPWS (composting toilets) | Accom: Port Douglas boutique accommodation", eat: "Zinc, Salsa Bar & Grill, Sunday markets for tropical fruit", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Daintree River & Rainforest", day: "Days 4–5", type: "highlight", desc: "Cable ferry across the Daintree River into the world's oldest rainforest. Croc-spotting river cruises, Daintree Discovery Centre canopy walk, hidden swimming holes.", stay: "Camp: Daintree Riverview Caravan Park (toilets, showers) | Accom: Daintree Eco Lodge or Silky Oaks Lodge", eat: "Daintree Ice Cream Company, Daintree Tea Company", source: "daintreeriverview.com.au" },
      { name: "Cape Tribulation", day: "Days 5–6", type: "highlight", desc: "Where the rainforest meets the reef — literally. Swim off the beach with ancient rainforest canopy at your back. Fly between the treetops on a zip-line through the canopy. After dark, join a guided night walk to spot tree kangaroos, geckos, and glow-in-the-dark fungi. Ride horses along the beach at sunrise. Walk the Dubuji Boardwalk through the mangroves at sunset.", stay: "Camp: Noah Beach — QPWS (composting toilets, 15 sites, book ahead) | Accom: Cape Trib Beach House or Ferntree Rainforest Lodge", eat: "Whet Café Cape Tribulation, self-catered at camp", source: "QPWS — book via qld.gov.au/camping (closed wet season Dec–Apr)" },
      { name: "Atherton Tablelands", day: "Days 7–8", type: "stop", desc: "Head inland and up — the temperature drops, the landscape shifts from tropical lowland to cool-climate highland. Swim under Millaa Millaa Falls (bring a towel, you’ll want the photo). Stand inside the Curtain Fig Tree — a strangler fig so massive it creates its own room. Float over the Tablelands in a hot air balloon at dawn. Watch platypus feed at Peterson Creek in Yungaburra in the quiet of first light. Swim in Lake Eacham — a volcanic crater lake surrounded by rainforest.", stay: "Camp: Lake Tinaroo — Downfall Creek (toilets, QPWS) | Accom: Yungaburra or Atherton Tablelands accommodation", eat: "Nick's Swiss-Italian Restaurant Yungaburra, Gallo Dairyland", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Cairns (return)", day: "Days 9–10", type: "highlight", desc: "Return to Cairns for the finale. Spend a full day on the Great Barrier Reef — snorkel among giant clams and sea turtles, or try an introductory dive on the outer reef. Take the Kuranda Scenic Railway up through the Barron Gorge rainforest and ride the Skyrail gondola back over the canopy. Stroll the night markets one last time. Drop the keys and fly home.", stay: "Camp: Ellis Beach (toilets, showers, beachfront) | Accom: Cairns or Palm Cove accommodation", eat: "Ochre Restaurant, Cairns Night Markets", source: "cairns.com.au" },
      { name: "Cooktown (optional extension)", day: "+2–3 Days", type: "stop", desc: "For the adventurous — continue north on the Bloomfield Track through some of Australia’s most remote rainforest (4WD essential, closed Dec–Apr). Stand before ancient Quinkan rock art at Split Rock with an Indigenous guide. Walk the same shore where Captain Cook beached the Endeavour in 1770. This extension is discussed during your booking consultation.", stay: "Camp: Rinyirru (Lakefield) NP — Kalpowar Crossing (toilets, QPWS) | Accom: Cooktown accommodation", eat: "The Bowls Club (surprisingly good), Cooktown RSL", source: "QPWS / cooktowncaravanpark.com.au" },
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
    includes: ["LandCruiser 300 Series Sahara", "Camping or touring mode — your choice", "Food & drinks fully stocked", "$500 Visa gift card for fuel", "Telstra SIM + Starlink", "K'gari permits + barge", "All recovery & safety gear", "Curated accommodation options (touring)", "Coastal route guide", "24/7 support"],
    vibe: "coast",
    stops: [
      { name: "Rainbow Beach & Inskip", day: "Day 1", type: "transit", desc: "Barge departure point for K'gari. Air down tyres at Inskip Point and get your first taste of coastal sand driving.", stay: "Camp: MV Sarawak or SS Dorrigo, Inskip Peninsula (toilets) | Accom: Rainbow Beach accommodation", eat: "Rainbow Beach Surf Club, Waterview Bistro", source: "QPWS — book via qld.gov.au/camping" },
      { name: "K'gari (Fraser Island)", day: "Days 2–4", type: "highlight", desc: "Three nights on the world’s largest sand island. Drive the 75 Mile Beach sand highway. Swim in Lake McKenzie’s crystal water. Float down Eli Creek on your back. Climb Indian Head to spot whales, dolphins, and sharks from the clifftop. Soak in the Champagne Pools while waves crash over the rocks. Walk the Central Station rainforest where ancient trees grow in pure sand.", stay: "Camp: Central Station or Dundubara (flush toilets, showers, fenced) | Accom: Kingfisher Bay Resort or Eurong Beach Resort", eat: "Self-catered at camp or resort dining", source: "QPWS — book via qld.gov.au/camping" },
      { name: "Bundaberg & 1770", day: "Days 5–6", type: "stop", desc: "Back on the mainland. Watch loggerhead turtles nest and hatch at Mon Repos at night (seasonal Nov–Mar — one of the most moving wildlife experiences in Australia). Surf Queensland's most northerly break at Agnes Water. Board an amphibious LARC vehicle for a unique estuary tour at 1770. Take a day trip to Lady Musgrave Island — pristine southern Great Barrier Reef with some of the best coral anywhere.", stay: "Camp: 1770 Camping Ground (toilets, showers) | Accom: Agnes Water or 1770 accommodation", eat: "The Tree Bar at 1770, Getaway Garden Café Agnes Water", source: "1770campingground.com.au" },
      { name: "Yeppoon & Capricorn Coast", day: "Days 7–8", type: "stop", desc: "Catch the ferry to Great Keppel Island — pristine beaches with barely a footprint, snorkelling straight off the sand, and bushwalks through the headlands. Back on the mainland, walk the Bluff Point trail and spot dolphins and turtles from the clifftop lookout. Swim in the Yeppoon Lagoon as the sun goes down.", stay: "Camp: Farnborough Beach Caravan Park (toilets, showers) | Accom: Yeppoon waterfront accommodation", eat: "Waterline Restaurant Yeppoon, The Strand Hotel", source: "QPWS / farnboroughbeach.com.au" },
      { name: "Mackay & Cape Hillsborough", day: "Days 9–10", type: "highlight", desc: "Set your alarm. Be on the beach at Cape Hillsborough before dawn and watch kangaroos and wallabies emerge from the forest to feed on the sand as the sun rises behind them — one of Queensland's most iconic wildlife moments. Drive inland to Eungella and stand on the Broken River viewing platform at dawn watching platypus feed in the creek below.", stay: "Camp: Cape Hillsborough Nature Tourist Park (toilets, showers, beachfront) | Accom: Mackay or Cape Hillsborough lodge", eat: "The Dispensary Mackay, Foodspace", source: "capehillsboroughnatureresort.com.au" },
      { name: "Airlie Beach & Whitsundays", day: "Days 11–13", type: "highlight", desc: "Three nights at the gateway to the Whitsunday Islands. Spend a full day at Whitehaven Beach — sand so fine it squeaks underfoot. Climb to Hill Inlet lookout and watch the tide shift the sandbars through every shade of blue. Take a scenic helicopter flight over Heart Reef. Sail the islands, kayak to secluded bays, or jet ski between the islands.", stay: "Camp: BIG4 Adventure Whitsunday Resort (toilets, showers, pool) | Accom: Airlie Beach or island accommodation", eat: "Fish D'vine, Mr Bones, Northerlies Beach Bar", source: "big4.com.au / QPWS" },
      { name: "Townsville & Magnetic Island", day: "Days 14–15", type: "stop", desc: "Drive to the top of Castle Hill for 360° views over the coast. Catch the ferry to Magnetic Island and walk the Forts trail — WWII gun emplacements hidden in the bush, with wild koalas sleeping in the trees above you. Kayak to secluded bays only accessible from the water. Walk The Strand waterfront as the sun sets.", stay: "Camp: Rowes Bay Caravan Park (toilets, showers, beachfront) | Accom: Townsville or Magnetic Island accommodation", eat: "A Touch of Salt, Longboard Bar & Grill", source: "rowesbaycaravanpark.com.au" },
      { name: "Mission Beach", day: "Days 16–17", type: "stop", desc: "Cassowary country. Walk the Licuala Fan Palm track through the only place in Australia where this extraordinary palm grows — keep your eyes open for a southern cassowary crossing the path. Catch the water taxi to Dunk Island for deserted beaches and bushwalking. For the bold, skydive over the reef and land on the beach. Or raft the Tully River — grade 3–4 white water through rainforest gorge.", stay: "Camp: Beachcomber Coconut Caravan Village (toilets, showers, beachfront) | Accom: Mission Beach accommodation", eat: "Garage Bar & Grill, New Deli Mission Beach", source: "beachcombercoconut.com.au" },
      { name: "Cairns", day: "Days 18–21", type: "highlight", desc: "Journey's end — four nights to explore properly. Great Barrier Reef day trip, Kuranda Scenic Railway, night markets. We fly up to collect the vehicle — just drop the keys and catch your flight home.", stay: "Camp: Ellis Beach Oceanfront Bungalows (toilets, showers, beachfront) | Accom: Cairns or Palm Cove accommodation", eat: "Prawn Star (floating seafood bar), Ochre Restaurant, Cairns Night Markets", source: "ellisbeach.com.au" },
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
    includes: ["LandCruiser 300 Series Sahara", "Camping or touring mode — your choice", "Food & drinks fully stocked", "$500 Visa gift card for fuel", "Telstra SIM + Starlink", "All recovery & safety gear", "Curated accommodation options (touring)", "Remote route & water mapping", "24/7 satellite support"],
    vibe: "outback",
    stops: [
      { name: "Toowoomba", day: "Day 1", type: "transit", desc: "Up and over the Great Dividing Range. Stand at Picnic Point lookout and watch the Lockyer Valley stretch out below you — the last green you'll see for a while. Queensland's Garden City — a deliberately gentle start before the landscape strips back to red.", stay: "Camp: Toowoomba Showgrounds or caravan parks | Accom: Toowoomba accommodation", eat: "The Spotted Cow, Picnic Point café", source: "toowoombaregion.com.au" },
      { name: "Roma", day: "Day 2", type: "stop", desc: "Through the golden Darling Downs to Roma. After dark, watch the Big Rig night show — the story of Australia's first oil and gas discovery told with towering flames, coloured light, and surround sound in the open air.", stay: "Camp: Big Rig Tourist Park (toilets, showers) | Accom: Roma Explorers Inn or Roma accommodation", eat: "Roma on Bungil Gallery Café", source: "maranoa.qld.gov.au" },
      { name: "Mitchell & Charleville", day: "Days 3–4", type: "highlight", desc: "Stop at Mitchell and sink into the Great Artesian Spa — free hot mineral springs fed from two kilometres underground, under open outback skies. Continue to Charleville. After dark, the Cosmos Centre puts you behind research-grade telescopes under some of the darkest skies in Australia — see Saturn’s rings, Jupiter’s moons, and the Milky Way like you’ve never seen it. Next morning, meet endangered bilbies up close at the Bilby Experience.", stay: "Camp: Charleville Bush Caravan Park (toilets, showers) | Accom: Hotel Corones (heritage pub) or Charleville accommodation", eat: "Hotel Corones (heritage pub, famous staircase)", source: "charlevillebushcaravanpark.com.au" },
      { name: "Blackall", day: "Days 5–6", type: "stop", desc: "Home of the Black Stump — the origin of ‘beyond the black stump.’ Stand at the Jackie Howe memorial where a man sheared 321 sheep in a day by hand in 1892 — a record that still stands. Swim in the artesian aquatic centre fed by ancient underground water. The landscape is properly red now, the sky enormous, and the pace has slowed to something that feels right.", stay: "Camp: Blackall Caravan Park (toilets, showers) | Accom: Acacia Motor Inn Blackall", eat: "Blackall Hotel, Barcoo River Café", source: "blackall-tambo.qld.gov.au" },
      { name: "Longreach", day: "Days 7–9", type: "highlight", desc: "Heart of outback Queensland. Qantas Founders Museum — walk through a 747 and 707 on the tarmac. Australian Stockman's Hall of Fame. Thomson River sunset cruise with camp oven dinner. Three nights minimum.", stay: "Camp: Longreach Tourist Park (toilets, showers, pool, camp kitchen) | Accom: Longreach accommodation or station stays", eat: "Harry's at the Australian Hotel, Merino Bakery", source: "longreachtouristpark.com.au" },
      { name: "Winton", day: "Days 10–12", type: "highlight", desc: "Dinosaur country. Drive up to the Australian Age of Dinosaurs — a museum perched on a flat-topped mesa with outback views in every direction. Hold real dinosaur bones in the fossil preparation lab and watch palaeontologists chip away at new discoveries. Drive out to Lark Quarry to see the only known evidence of a dinosaur stampede — 3,300 footprints frozen in rock, 95 million years old. Have a beer at the North Gregory Hotel where Banjo Paterson first performed Waltzing Matilda.", stay: "Camp: Pelican Waters Caravan Park (toilets, showers, pool) or Bladensburg NP — Bough Shed Hole (toilets, QPWS) | Accom: Winton accommodation", eat: "The North Gregory Hotel Winton", source: "QPWS / pelicanwaterswinton.com.au" },
      { name: "Carnarvon Gorge", day: "Days 13–15", type: "highlight", desc: "The showstopper of inland Queensland. 30km sandstone gorge with Aboriginal rock art, moss gardens, the Amphitheatre, Ward's Canyon. Multiple day-walks. Three nights minimum.", stay: "Camp: Breeze Holiday Parks Carnarvon Gorge (toilets, showers, camp kitchen — open year-round) | Accom: Breeze Holiday Parks cabins or Carnarvon Gorge Wilderness Lodge", eat: "Breeze Holiday Parks bush bar & roast dinners, self-catered at camp", source: "breezeholidayparks.com.au" },
      { name: "Emerald & Gemfields", day: "Days 16–17", type: "stop", desc: "Get your hands dirty fossicking for sapphires at Rubyvale — wash and sieve through buckets of ore and keep whatever you find. Tour an underground mine to see how gems are extracted from the earth. Stop at Barcaldine to see the Tree of Knowledge — birthplace of the Australian Labor Party. The landscape transitions from red back to green as you head east.", stay: "Camp: Rubyvale Gem Caravan Park (toilets, showers) | Accom: Emerald accommodation", eat: "Emerald pubs, Rubyvale Gem Gallery café", source: "rubyvalegem.com.au" },
      { name: "Rockhampton", day: "Day 18", type: "stop", desc: "Walk through the Capricorn Caves — a natural limestone cathedral where light pours through the ceiling in summer and tiny bats roost in the dark corners. Stand at the Tropic of Capricorn marker — you’re officially in the tropics now. If it’s a Friday, watch bull riding at the Great Western Hotel with a cold beer. Last outback night before the coast.", stay: "Camp: Rockhampton caravan parks | Accom: Rockhampton accommodation", eat: "Great Western Hotel, Saigon Saigon", source: "capricorncaves.com.au" },
      { name: "Agnes Water & Bundaberg", day: "Days 19–20", type: "stop", desc: "Optional stops on the coastal run home. Grab a board and surf Queensland’s most northerly break at Agnes Water. Tour the Bundaberg rum distillery and taste it straight from the barrel. If it’s turtle season (Nov–Mar), watch loggerhead turtles nest at Mon Repos after dark. The red dirt fades to green as you head south toward home.", stay: "Camp: 1770 Camping Ground (toilets, showers) | Accom: Agnes Water or Bundaberg accommodation", eat: "The Tree Bar at 1770, Bundaberg Barrel", source: "1770campingground.com.au" },
      { name: "Brisbane", day: "Day 21", type: "transit", desc: "South through the coast to Brisbane. Stop anywhere that catches your eye — the last day is yours. Drop the vehicle at our Banyo yard or your accommodation.", stay: "Home", eat: "Celebration dinner in Brisbane", source: "" },
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
    includes: ["Camping or touring mode — your choice", "Food & drinks fully stocked", "$500 Visa gift card for fuel", "Telstra SIM + Starlink", "Personalised route consultation", "Curated accommodation options (touring)", "All standard inclusions", "Flexible duration", "24/7 support"],
    vibe: "both",
    stops: null,
  },
];

export default function SouthernHorizonSite() {
  const [activeSection, setActiveSection] = useState("home");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openFaqs, setOpenFaqs] = useState({});
  const [scrolled, setScrolled] = useState(false);
  const [formData, setFormData] = useState({ name:"",email:"",phone:"",guests:"",dates:"",package:"",dietary:"",specialNeeds:"",message:"" });
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [routeGuide, setRouteGuide] = useState(null);

  useEffect(() => {
    const h = () => {
      setScrolled(window.scrollY > 50);
      const secs = SECTIONS.map(s => document.getElementById(s.id)).filter(Boolean);
      for (let i = secs.length - 1; i >= 0; i--) {
        if (secs[i].getBoundingClientRect().top <= 120) { setActiveSection(SECTIONS[i].id); break; }
      }
    };
    window.addEventListener("scroll", h);
    return () => window.removeEventListener("scroll", h);
  }, []);

  const scrollTo = id => { document.getElementById(id)?.scrollIntoView({ behavior: "smooth" }); setMobileMenuOpen(false); };
  const toggleFaq = k => setOpenFaqs(p => ({ ...p, [k]: !p[k] }));
  const handleSubmit = () => { setFormSubmitted(true); setTimeout(() => setFormSubmitted(false), 6000); };

  const serif = `'Libre Baskerville', 'Georgia', serif`;
  const sans = `'Figtree', 'Helvetica Neue', sans-serif`;

  // Dual palette
  const coast = { primary: "#0B7285", light: "#E6FAFB", mid: "#15AABF", accent: "#22D3EE", soft: "#F0FDFA" };
  const outback = { primary: "#B45309", light: "#FEF7ED", mid: "#D97706", accent: "#F59E0B", soft: "#FFFBF0" };
  const neutral = { sand: "#F5F0E8", white: "#FFFDF8", dark: "#1C1917", mid: "#57534E", light: "#A8A29E", border: "#E7E5E4" };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Figtree:wght@300;400;500;600;700&display=swap');
        *{margin:0;padding:0;box-sizing:border-box}
        html{scroll-behavior:smooth}
        body{background:${neutral.white}}
        ::selection{background:${coast.primary};color:#fff}

        @keyframes fadeUp{from{opacity:0;transform:translateY(28px)}to{opacity:1;transform:translateY(0)}}
        @keyframes fadeIn{from{opacity:0}to{opacity:1}}

        .nav-link{position:relative;cursor:pointer;text-decoration:none;color:inherit;transition:color .25s}
        .nav-link::after{content:'';position:absolute;bottom:-3px;left:50%;width:0;height:2px;
          background:linear-gradient(90deg,${coast.primary},${outback.primary});
          transition:width .3s;transform:translateX(-50%);border-radius:1px}
        .nav-link:hover::after,.nav-link.active::after{width:100%}

        .card-up{transition:transform .4s cubic-bezier(.25,.46,.45,.94),box-shadow .4s}
        .card-up:hover{transform:translateY(-6px);box-shadow:0 20px 50px rgba(28,25,23,0.07)}

        .btn-dual{
          background:linear-gradient(135deg,${coast.primary},${outback.primary});color:#fff;border:none;
          padding:15px 36px;font-family:${sans};font-size:12.5px;font-weight:600;
          letter-spacing:1.8px;text-transform:uppercase;cursor:pointer;
          border-radius:6px;transition:all .3s;box-shadow:0 4px 16px rgba(28,25,23,0.12);
        }
        .btn-dual:hover{transform:translateY(-2px);box-shadow:0 8px 28px rgba(28,25,23,0.16);filter:brightness(1.08)}

        .btn-ghost{
          background:transparent;color:#fff;border:1.5px solid rgba(255,255,255,0.35);
          padding:14px 32px;font-family:${sans};font-size:12px;font-weight:500;
          letter-spacing:1.8px;text-transform:uppercase;cursor:pointer;
          border-radius:6px;transition:all .3s;
        }
        .btn-ghost:hover{background:rgba(255,255,255,0.12);border-color:rgba(255,255,255,0.6)}

        .btn-coast{background:${coast.primary};color:#fff;border:none;padding:14px 32px;font-family:${sans};font-size:12px;font-weight:600;letter-spacing:1.8px;text-transform:uppercase;cursor:pointer;border-radius:6px;transition:all .3s}
        .btn-coast:hover{background:#095C6A;transform:translateY(-2px)}

        input,textarea,select{
          width:100%;padding:14px 16px;border:1.5px solid ${neutral.border};background:#fff;
          font-family:${sans};font-size:14px;color:${neutral.dark};outline:none;
          transition:border-color .3s,box-shadow .3s;border-radius:8px;
        }
        input:focus,textarea:focus,select:focus{border-color:${coast.primary};box-shadow:0 0 0 3px rgba(11,114,133,0.06)}
        textarea{resize:vertical;min-height:110px}
        input::placeholder,textarea::placeholder{color:${neutral.light}}

        .faq-item{border-bottom:1px solid ${neutral.border}}
        .faq-q{padding:20px 0;cursor:pointer;display:flex;justify-content:space-between;align-items:center;gap:16px;transition:color .2s}
        .faq-q:hover{color:${coast.primary}}

        .vibe-coast{border-left:4px solid ${coast.primary}}
        .vibe-outback{border-left:4px solid ${outback.primary}}
        .vibe-both{border-left:4px solid transparent;border-image:linear-gradient(to bottom,${coast.primary},${outback.primary}) 1}

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
        background:scrolled?"rgba(255,253,248,0.94)":"transparent",
        backdropFilter:scrolled?"blur(16px) saturate(180%)":"none",
        borderBottom:scrolled?`1px solid ${neutral.border}`:"none",
        transition:"all .4s",padding:scrolled?"10px 28px":"18px 28px",
      }}>
        <div style={{maxWidth:1200,margin:"0 auto",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
          <div style={{cursor:"pointer",display:"flex",alignItems:"baseline",gap:6}} onClick={()=>scrollTo("home")}>
            <span style={{
              fontFamily:serif,fontSize:18,fontWeight:700,letterSpacing:.5,
              color:scrolled?neutral.dark:"#fff",transition:"color .4s",
              textShadow:scrolled?"none":"0 1px 10px rgba(0,0,0,0.25)",
            }}>Southern Horizon</span>
            <span style={{
              fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
              background:scrolled?`linear-gradient(90deg,${coast.primary},${outback.primary})`:"linear-gradient(90deg,rgba(255,255,255,0.7),rgba(255,255,255,0.5))",
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",transition:"all .4s",
            }}>Co.</span>
          </div>
          <div className="desk-nav" style={{display:"flex",gap:22,alignItems:"center"}}>
            {SECTIONS.map(s=>(
              <span key={s.id} className={`nav-link ${activeSection===s.id?"active":""}`}
                onClick={()=>scrollTo(s.id)} style={{
                  fontFamily:sans,fontSize:11,fontWeight:500,letterSpacing:.6,
                  color:scrolled?neutral.mid:"rgba(255,255,255,0.85)",transition:"color .4s",
                  textShadow:scrolled?"none":"0 1px 3px rgba(0,0,0,0.1)",
                }}>{s.label}</span>
            ))}
          </div>
          <div className="mob-btn" onClick={()=>setMobileMenuOpen(!mobileMenuOpen)}
            style={{display:"none",cursor:"pointer",zIndex:1001,alignItems:"center",justifyContent:"center",
              width:36,height:36,fontSize:24,
              color:mobileMenuOpen?neutral.dark:(scrolled?neutral.dark:"#fff"),transition:"color .3s"}}>
            {mobileMenuOpen?"✕":"☰"}
          </div>
        </div>
      </nav>

      {mobileMenuOpen && (
        <div style={{position:"fixed",inset:0,background:neutral.white,zIndex:999,padding:"88px 32px 40px",
          display:"flex",flexDirection:"column",gap:2,animation:"fadeIn .2s",overflowY:"auto"}}>
          {SECTIONS.map(s=>(
            <div key={s.id} onClick={()=>scrollTo(s.id)} style={{
              fontFamily:serif,fontSize:22,fontWeight:400,color:neutral.dark,cursor:"pointer",
              padding:"16px 0",borderBottom:`1px solid ${neutral.border}`,
            }}>{s.label}</div>
          ))}
        </div>
      )}

      {/* ═══ HERO — DUAL GRADIENT ═══ */}
      <div id="home" style={{scrollMarginTop:80}}>
        <div style={{
          minHeight:"100vh",display:"flex",flexDirection:"column",justifyContent:"center",alignItems:"center",
          background:`linear-gradient(135deg, 
            #0B3D4E 0%, ${coast.primary} 18%, #1098A8 30%, 
            #4BA89A 42%, #8B9B6E 50%, 
            #B8864A 58%, ${outback.primary} 70%, #A04E0C 82%, #6B2E08 100%)`,
          position:"relative",overflow:"hidden",padding:"120px 28px 90px",
        }}>
          {/* Texture: sand grain overlay */}
          <div style={{position:"absolute",inset:0,opacity:.04,
            backgroundImage:`url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='256' height='256' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
            backgroundSize:"128px",
          }}/>
          {/* Horizon line */}
          <div style={{position:"absolute",top:"52%",left:0,right:0,height:1,
            background:"linear-gradient(90deg, transparent, rgba(255,255,255,0.12) 20%, rgba(255,255,255,0.2) 50%, rgba(255,255,255,0.12) 80%, transparent)"
          }}/>
          {/* Transition wave at bottom */}
          <svg style={{position:"absolute",bottom:-1,left:0,width:"100%",height:90}} viewBox="0 0 1440 90" preserveAspectRatio="none">
            <path d="M0,35 C360,75 720,5 1080,45 C1260,65 1380,35 1440,50 L1440,90 L0,90Z" fill={neutral.white}/>
          </svg>

          <div style={{textAlign:"center",maxWidth:820,position:"relative",zIndex:2,animation:"fadeUp .9s ease"}}>
            <div style={{
              display:"inline-block",fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
              color:"#fff",marginBottom:24,padding:"8px 20px",borderRadius:40,
              background:"rgba(255,255,255,0.12)",border:"1px solid rgba(255,255,255,0.2)",
              backdropFilter:"blur(8px)",
            }}>Coming Dec '26</div>
            <div style={{
              fontFamily:sans,fontSize:11,fontWeight:600,letterSpacing:6,textTransform:"uppercase",
              color:"rgba(255,255,255,0.55)",marginBottom:32,
            }}>Self-Drive Luxury Touring — Queensland, Australia</div>
            <h1 className="hero-h" style={{
              fontFamily:serif,fontSize:"clamp(34px, 6vw, 64px)",fontWeight:400,
              color:"#fff",lineHeight:1.15,marginBottom:24,
              textShadow:"0 2px 24px rgba(0,0,0,0.2)",
            }}>
              Turquoise water today,<br/>
              <em style={{fontStyle:"italic"}}>red dirt tomorrow</em>
            </h1>
            <p style={{fontFamily:sans,fontSize:16,color:"rgba(255,255,255,0.65)",lineHeight:1.8,
              maxWidth:540,margin:"0 auto 44px",fontWeight:300}}>
              Pick up a fully-stocked Toyota LandCruiser 300 Series Sahara at your airport. 
              Drive K'gari's white sand, Cairns' tropics, Birdsville's red earth — 
              or all of them in one trip. Vehicle, food, fuel, and equipment included.
              Pick your accommodation at each stop and we'll book it all.
            </p>
            <div style={{display:"flex",gap:14,justifyContent:"center",flexWrap:"wrap"}}>
              <button className="btn-dual" onClick={()=>scrollTo("packages")}>Explore Packages</button>
              <button className="btn-ghost" onClick={()=>scrollTo("enquiry")}>Register Interest</button>
            </div>
          </div>
        </div>

        {/* Stats strip */}
        <div className="stat-row" style={{
          maxWidth:960,margin:"0 auto",padding:"26px 36px",
          display:"flex",justifyContent:"center",gap:48,flexWrap:"wrap",
          borderBottom:`1px solid ${neutral.border}`,
        }}>
          {[
            {val:"Vehicle All-In",sub:"food, fuel, equipment, support"},
            {val:"300 Series",sub:"LandCruiser Sahara"},
            {val:"5–21 Days",sub:"curated packages"},
            {val:"Starlink",sub:"connected anywhere"},
          ].map((s,i)=>(
            <div key={i} style={{textAlign:"center"}}>
              <div style={{fontFamily:serif,fontSize:19,fontWeight:700,color:neutral.dark}}>{s.val}</div>
              <div style={{fontFamily:sans,fontSize:10,color:neutral.light,letterSpacing:1.5,textTransform:"uppercase",marginTop:3}}>{s.sub}</div>
            </div>
          ))}
        </div>
      </div>

      {/* ═══ EXPERIENCE ═══ */}
      <div id="experience" style={{scrollMarginTop:80}}>
        <div style={{padding:"96px 24px",maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14,
            }}>The Experience</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:neutral.dark,lineHeight:1.25}}>
              Two thousand kilometres of <em style={{fontStyle:"italic"}}>everything</em>
            </h2>
          </div>
          <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:20}}>
            {[
              {icon:"☀",title:"Delivered to You",text:"We bring your LandCruiser to your airport, hotel, or our yard in Banyo. Brisbane, Gold Coast, Sunshine Coast, or Cairns — your trip starts where you land. Fridge full, pantry packed, Starlink powered up.",bg:coast.soft,border:"#CCFBF1"},
              {icon:"🧭",title:"Self-Drive Freedom",text:"No guide, no tour bus, no schedule. Follow the coast, detour through rainforest, chase sunset in the desert. Stop where you want, stay as long as you like.",bg:neutral.sand,border:"#E7E5E4"},
              {icon:"📡",title:"Connected Everywhere",text:"Telstra SIM for regional coverage, Starlink satellite internet for everywhere else. Navigate, stream, and share from the Daintree to the Simpson.",bg:outback.soft,border:"#FDE68A"},
              {icon:"❄",title:"Premium Equipment",text:"Lawson INFINITY camping system, PowerDeck lithium battery, ARB Zero 60L fridge/freezer, Snow Peak and Jetboil cooking gear, GSI Pinnacle ceramic cookset, Sea to Summit sleeping and camp furniture. Nothing generic — every piece is chosen.",bg:outback.soft,border:"#FDE68A"},
              {icon:"🗺",title:"Curated Routes",text:"We've driven every road. Handpicked camp spots, tide charts, provisioning points, swimming holes, sunset lookouts, and the local tips that make the difference.",bg:neutral.sand,border:"#E7E5E4"},
              {icon:"📞",title:"24/7 Support",text:"Day or night — flat tyre advice, route changes, or 'where's the best fish and chips near here.' We're a call or Starlink message away.",bg:coast.soft,border:"#CCFBF1"},
            ].map((item,i)=>(
              <div key={i} style={{padding:"30px 26px",background:item.bg,border:`1px solid ${item.border}`,borderRadius:14}}>
                <div style={{fontSize:26,marginBottom:12}}>{item.icon}</div>
                <h3 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:neutral.dark,marginBottom:10}}>{item.title}</h3>
                <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>{item.text}</p>
              </div>
            ))}
          </div>

          {/* CTA banner */}
          <div style={{
            marginTop:44,padding:"34px 38px",borderRadius:16,overflow:"hidden",position:"relative",
            background:`linear-gradient(135deg, ${coast.primary} 0%, #3A8A6C 50%, ${outback.primary} 100%)`,
            display:"flex",alignItems:"center",justifyContent:"space-between",gap:28,flexWrap:"wrap",
          }}>
            <div>
              <div style={{fontFamily:serif,fontSize:26,fontWeight:700,color:"#fff"}}>
                Your vehicle, fully loaded
              </div>
              <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.55)",fontWeight:300,marginTop:4}}>
                Vehicle, food, drinks, fuel card, Starlink, Telstra SIM, all equipment, 24/7 support — one daily rate. Pick your accommodation, we book it all.
              </p>
            </div>
            <button className="btn-dual" onClick={()=>scrollTo("enquiry")}
              style={{background:"#fff",color:neutral.dark,boxShadow:"0 4px 16px rgba(0,0,0,0.1)",
                backgroundImage:"none"}}>
              Get in Touch
            </button>
          </div>
        </div>
      </div>

      {/* ═══ PACKAGES ═══ */}
      <div id="packages" style={{scrollMarginTop:80}}>
        <div style={{background:neutral.sand,padding:"96px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
                background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14,
              }}>Tour Packages</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:neutral.dark,lineHeight:1.25}}>
                Pick a direction — <em style={{fontStyle:"italic"}}>or pick them all</em>
              </h2>
              <p style={{fontFamily:sans,fontSize:14,color:neutral.light,maxWidth:480,margin:"14px auto 0",lineHeight:1.7,fontWeight:300}}>
                From weekend beach escapes to three-week coastal expeditions and outback crossings — all in Queensland.
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
                    background:"#fff",borderRadius:14,overflow:"hidden",display:"flex",flexDirection:"column",
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
                      <h3 style={{fontFamily:serif,fontSize:22,fontWeight:700,color:neutral.dark,marginBottom:4}}>{pkg.name}</h3>
                      <p style={{fontFamily:serif,fontSize:14,fontWeight:400,color:accentSolid,fontStyle:"italic"}}>{pkg.tagline}</p>
                    </div>
                    <div style={{padding:"18px 24px",flex:1}}>
                      <div style={{display:"flex",gap:14,marginBottom:6,flexWrap:"wrap"}}>
                        <span style={{fontFamily:sans,fontSize:11.5,color:neutral.light}}>⏱ {pkg.duration}</span>
                        <span style={{fontFamily:sans,fontSize:11.5,color:neutral.light}}>👥 {pkg.guests}</span>
                      </div>
                      <div style={{fontFamily:sans,fontSize:12,color:accentSolid,fontWeight:500,marginBottom:14}}>📍 {pkg.route}</div>
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
                      <button className="btn-coast" onClick={()=>scrollTo("enquiry")}
                        style={{width:"100%",fontSize:11,padding:"12px 20px",background:accentSolid}}>
                        Register Interest
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ VEHICLE ═══ */}
      <div id="vehicle" style={{scrollMarginTop:80}}>
        <div style={{padding:"96px 24px",maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14,
            }}>The Vehicle</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:neutral.dark,lineHeight:1.25}}>
              LandCruiser 300 <em style={{fontStyle:"italic"}}>Sahara</em>
            </h2>
            <p style={{fontFamily:sans,fontSize:14,color:neutral.light,maxWidth:440,margin:"12px auto 0",lineHeight:1.7,fontWeight:300}}>
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
              {l:"Mobile",v:"Telstra SIM Card"},{l:"Fuel",v:"$500 Visa Gift Card"},
            ].map((f,i)=>(
              <div key={i} style={{padding:"18px 16px",background:i%2===0?coast.soft:outback.soft,borderRadius:10}}>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",
                  color:i%2===0?coast.primary:outback.primary,marginBottom:5}}>{f.l}</div>
                <div style={{fontFamily:serif,fontSize:14,fontWeight:700,color:neutral.dark,lineHeight:1.3}}>{f.v}</div>
              </div>
            ))}
          </div>
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <div style={{padding:"30px 26px",background:coast.soft,borderRadius:14,borderLeft:`4px solid ${coast.primary}`}}>
              <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:coast.primary,marginBottom:8}}>Camping Mode</div>
              <h3 style={{fontFamily:serif,fontSize:20,fontWeight:700,color:neutral.dark,marginBottom:8}}>Camp Anywhere</h3>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:12}}>
                Full Lawson INFINITY module in the rear — PowerDeck lithium floor, fridge slide, drawer, prep table, side wings. Everything you need to be completely self-sufficient. Roof rack available except on sand islands.
              </p>
              <div style={{fontFamily:sans,fontSize:12.5,color:coast.primary,fontWeight:600}}>Up to 4 guests · 3 soft bags · Day packs at feet</div>
            </div>
            <div style={{padding:"30px 26px",background:outback.soft,borderRadius:14,borderLeft:`4px solid ${outback.primary}`}}>
              <div style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:outback.primary,marginBottom:8}}>Touring Mode</div>
              <h3 style={{fontFamily:serif,fontSize:20,fontWeight:700,color:neutral.dark,marginBottom:8}}>Stay in Style</h3>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300,marginBottom:12}}>
                Camping modules removed, giving you a full open boot. We present curated accommodation options at every stop — outback stations, boutique lodges, coastal retreats. Pick what you like, we book the lot. One bag per passenger fits comfortably.
              </p>
              <div style={{fontFamily:sans,fontSize:12.5,color:outback.primary,fontWeight:600}}>Up to 4 guests · 1 bag per passenger · Day packs at feet</div>
            </div>
          </div>
          {/* Passenger cap note */}
          <div style={{marginTop:18,padding:"18px 22px",background:neutral.sand,borderRadius:10,display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:16,flexShrink:0}}>👥</span>
            <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7}}>
              <strong style={{color:neutral.dark}}>Guest limit:</strong> For comfort and safety, we carry a maximum of <strong style={{color:neutral.dark}}>4 adults</strong> or <strong style={{color:neutral.dark}}>2 adults and 3 children</strong> per trip — in either configuration. Fewer passengers means more space, more comfort, and a better experience on remote roads.
            </p>
          </div>
          <div style={{marginTop:18,padding:"18px 22px",background:"#FFFBEB",borderRadius:10,border:"1px solid #FDE68A",display:"flex",gap:12,alignItems:"flex-start"}}>
            <span style={{fontSize:16,flexShrink:0}}>⚠️</span>
            <p style={{fontFamily:sans,fontSize:12.5,color:"#92400E",lineHeight:1.7}}>
              <strong>Roof rack:</strong> Toyota roof platform with side rails available on most routes. Roof loading is <strong>strictly prohibited on sand island sections</strong> including K'gari.
            </p>
          </div>
        </div>
      </div>

      {/* ═══ CAMPING GEAR ═══ */}
      <div id="camping-gear" style={{scrollMarginTop:80}}>
        <div style={{background:neutral.sand,padding:"96px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
                background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14,
              }}>Camping Gear</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:neutral.dark,lineHeight:1.25}}>
                Nothing generic, <em style={{fontStyle:"italic"}}>everything chosen</em>
              </h2>
              <p style={{fontFamily:sans,fontSize:14,color:neutral.light,maxWidth:520,margin:"12px auto 0",lineHeight:1.7,fontWeight:300}}>
                Every item in your LandCruiser is premium outdoor gear from brands trusted by serious adventurers. 
                No rental-grade leftovers — this is the kit you'd buy yourself.
              </p>
            </div>

            {/* Shelter & Furniture */}
            <div style={{marginBottom:32}}>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:16}}>
                <span style={{fontSize:22}}>⛺</span>
                <h3 style={{fontFamily:serif,fontSize:22,fontWeight:700,color:neutral.dark}}>Shelter & Camp Furniture</h3>
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
                  <div key={i} style={{padding:"22px 20px",background:g.bg,borderRadius:12,border:`1px solid ${neutral.border}`}}>
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
                <span style={{fontSize:22}}>🔥</span>
                <h3 style={{fontFamily:serif,fontSize:22,fontWeight:700,color:neutral.dark}}>Cooking & Kitchen</h3>
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
                  <div key={i} style={{padding:"22px 20px",background:g.bg,borderRadius:12,border:`1px solid ${neutral.border}`}}>
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
                <span style={{fontSize:22}}>💡</span>
                <h3 style={{fontFamily:serif,fontSize:22,fontWeight:700,color:neutral.dark}}>Camp Lighting</h3>
              </div>
              <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:14}}>
                {[
                  {brand:"BioLite",item:"AlpenGlow 250 Lantern",detail:"USB-rechargeable, 250 lumens, colour modes including a warm amber campfire glow. Hang it, stand it, or clip it. The main light for camp.",bg:coast.soft},
                  {brand:"Goal Zero",item:"Crush Light Chroma",detail:"Collapsible solar-charged lantern for the tent. Weighs almost nothing, packs flat, provides gentle ambient light for reading and wind-down.",bg:"#fff"},
                ].map((g,i)=>(
                  <div key={i} style={{padding:"22px 20px",background:g.bg,borderRadius:12,border:`1px solid ${neutral.border}`}}>
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
                <span style={{fontSize:22}}>🛡</span>
                <h3 style={{fontFamily:serif,fontSize:22,fontWeight:700,color:neutral.dark}}>Recovery & Safety</h3>
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
                <span style={{fontSize:22}}>📡</span>
                <h3 style={{fontFamily:serif,fontSize:22,fontWeight:700,color:neutral.dark}}>Navigation & Connectivity</h3>
              </div>
              <div className="g3" style={{display:"grid",gridTemplateColumns:"repeat(3, 1fr)",gap:14}}>
                {[
                  {brand:"Apple",item:"iPad (Wi-Fi + Cellular, 256GB)",detail:"Mounted in a rugged case on a vehicle mount. Runs Hema Explorer for offline topographic navigation — every track, every fuel stop, every camp site.",bg:"#fff"},
                  {brand:"Starlink",item:"Satellite Internet Terminal",detail:"High-speed internet anywhere in Australia. Stream, video call, check weather, download maps. Works in the Simpson Desert, the Daintree, and everywhere between.",bg:coast.soft},
                  {brand:"Telstra",item:"SIM Card (Best Regional Coverage)",detail:"Pre-loaded Telstra SIM for maximum mobile coverage across regional and remote Australia. The network that reaches furthest.",bg:"#fff"},
                ].map((g,i)=>(
                  <div key={i} style={{padding:"22px 20px",background:g.bg,borderRadius:12,border:`1px solid ${neutral.border}`}}>
                    <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2.5,textTransform:"uppercase",color:coast.primary,marginBottom:4}}>{g.brand}</div>
                    <div style={{fontFamily:serif,fontSize:16,fontWeight:700,color:neutral.dark,marginBottom:8}}>{g.item}</div>
                    <p style={{fontFamily:sans,fontSize:12.5,color:neutral.mid,lineHeight:1.7,fontWeight:300}}>{g.detail}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Families callout */}
            <div style={{
              padding:"28px 28px",borderRadius:14,
              background:`linear-gradient(135deg, ${coast.primary}08, ${outback.primary}08)`,
              border:`1px solid ${neutral.border}`,display:"flex",gap:20,alignItems:"flex-start",flexWrap:"wrap",
            }}>
              <span style={{fontSize:28,flexShrink:0}}>👶</span>
              <div style={{flex:1,minWidth:260}}>
                <h4 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:neutral.dark,marginBottom:8}}>Travelling with Kids?</h4>
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

      {/* ═══ PLAN YOUR TRIP ═══ */}
      <div id="itinerary" style={{scrollMarginTop:80}}>
        <div style={{background:neutral.sand,padding:"96px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
                background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14,
              }}>Plan Your Trip</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:neutral.dark,lineHeight:1.25}}>
                Four steps to <em style={{fontStyle:"italic"}}>the road</em>
              </h2>
            </div>
            <div className="g4" style={{display:"grid",gridTemplateColumns:"repeat(4, 1fr)",gap:14}}>
              {[
                {n:"01",t:"Register",d:"Tell us your dates, group, and what you're after — coast, tropics, outback, or the full mix. We're taking registrations now ahead of our December launch.",accent:coast.primary},
                {n:"02",t:"We Design",d:"We build your itinerary — daily waypoints, camp spots or accommodation, provisions, tide charts, hidden gems.",accent:"#3A8A6C"},
                {n:"03",t:"Refine",d:"We send the route. Add days, swap stops, change pace. It's not finalised until you're happy.",accent:"#8B7A3E"},
                {n:"04",t:"Drive",d:"We deliver to your airport (Brisbane, Gold Coast, Sunshine Coast, or Cairns), your hotel, or our Banyo yard. Quick briefing, bag in the back, and you're on the road.",accent:outback.primary},
              ].map((s,i)=>(
                <div key={i} style={{padding:"28px 22px",background:"#fff",borderRadius:14,borderTop:`3px solid ${s.accent}`}}>
                  <div style={{fontFamily:serif,fontSize:32,fontWeight:400,color:neutral.border,marginBottom:10}}>{s.n}</div>
                  <h3 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:neutral.dark,marginBottom:8}}>{s.t}</h3>
                  <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FOOD & DRINK ═══ */}
      <div id="food-drink" style={{scrollMarginTop:80}}>
        <div style={{padding:"96px 24px",maxWidth:1100,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14,
            }}>Food & Drink</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:neutral.dark,lineHeight:1.25}}>
              Fully stocked, <em style={{fontStyle:"italic"}}>ready to eat</em>
            </h2>
          </div>
          {/* Hero banner */}
          <div style={{
            padding:"36px 34px",borderRadius:16,marginBottom:28,textAlign:"center",
            background:`linear-gradient(135deg, ${coast.primary} 0%, #3A8A6C 50%, ${outback.primary} 100%)`,
          }}>
            <h3 style={{fontFamily:serif,fontSize:24,fontWeight:400,color:"#fff",marginBottom:10}}>Your vehicle arrives fully stocked</h3>
            <p style={{fontFamily:sans,fontSize:14,color:"rgba(255,255,255,0.6)",fontWeight:300,maxWidth:520,margin:"0 auto",lineHeight:1.75}}>
              Food, drinks, snacks — planned for your group, trip length, and dietary needs. 
              The ARB Zero 60L fridge/freezer keeps everything cold 24/7.
            </p>
          </div>
          <div className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}}>
            <div style={{padding:"28px 24px",background:coast.soft,borderRadius:14,borderLeft:`4px solid ${coast.primary}`}}>
              <h3 style={{fontFamily:serif,fontSize:19,fontWeight:700,color:neutral.dark,marginBottom:12}}>Camping Packages</h3>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>
                We provision everything — fresh produce, quality meats, pantry staples, snacks, cold drinks. Premium cooking gear included: Snow Peak Home & Camp burner, Jetboil Flash for fast boil, GSI Pinnacle ceramic cookset (pots, fry pan, mugs, bowls, plates), Sea to Summit camp kitchen tools and Delta cutlery sets. A 60L under-car water tank keeps you supplied between stops. For longer trips we map resupply points along your route.
              </p>
            </div>
            <div style={{padding:"28px 24px",background:outback.soft,borderRadius:14,borderLeft:`4px solid ${outback.primary}`}}>
              <h3 style={{fontFamily:serif,fontSize:19,fontWeight:700,color:neutral.dark,marginBottom:12}}>Touring Packages</h3>
              <p style={{fontFamily:sans,fontSize:13.5,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>
                Vehicle stocked with road snacks, drinks, and picnic supplies. Your itinerary includes dining recommendations — coastal seafood, tropical restaurants, outback pubs. We match suggestions to your tastes and flag any legs with limited options.
              </p>
            </div>
          </div>
          <div style={{marginTop:18,padding:"22px 24px",background:neutral.sand,borderRadius:14,display:"flex",gap:14,alignItems:"flex-start"}}>
            <span style={{fontSize:22,color:coast.primary,flexShrink:0}}>※</span>
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

      {/* ═══ SPECIAL REQUIREMENTS ═══ */}
      <div id="special-needs" style={{scrollMarginTop:80}}>
        <div style={{background:neutral.sand,padding:"96px 24px"}}>
          <div style={{maxWidth:1100,margin:"0 auto"}}>
            <div style={{textAlign:"center",marginBottom:56}}>
              <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
                background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
                WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14,
              }}>Special Requirements</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:neutral.dark,lineHeight:1.25}}>
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
                <div key={i} style={{padding:"26px 22px",background:item.bg,borderRadius:14}}>
                  <h3 style={{fontFamily:serif,fontSize:17,fontWeight:700,color:neutral.dark,marginBottom:8}}>{item.t}</h3>
                  <p style={{fontFamily:sans,fontSize:13,color:neutral.mid,lineHeight:1.75,fontWeight:300}}>{item.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ═══ FAQs ═══ */}
      <div id="faq" style={{scrollMarginTop:80}}>
        <div style={{padding:"96px 24px",maxWidth:840,margin:"0 auto"}}>
          <div style={{textAlign:"center",marginBottom:56}}>
            <p style={{fontFamily:sans,fontSize:11,fontWeight:700,letterSpacing:5,textTransform:"uppercase",
              background:`linear-gradient(90deg,${coast.primary},${outback.primary})`,
              WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",marginBottom:14,
            }}>FAQs</p>
            <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.2vw,44px)",fontWeight:400,color:neutral.dark,lineHeight:1.25}}>
              Before you <em style={{fontStyle:"italic"}}>hit the road</em>
            </h2>
          </div>
          {FAQ_DATA.map((cat,ci)=>(
            <div key={ci} style={{marginBottom:36}}>
              <h3 style={{fontFamily:serif,fontSize:18,fontWeight:700,color:neutral.dark,paddingBottom:10,
                borderBottom:`2px solid`,borderImage:`linear-gradient(90deg,${coast.primary},${outback.primary}) 1`,marginBottom:2}}>{cat.category}</h3>
              {cat.items.map((faq,fi)=>{
                const k=`${ci}-${fi}`;const open=openFaqs[k];
                return(
                  <div key={fi} className="faq-item">
                    <div className="faq-q" onClick={()=>toggleFaq(k)}>
                      <span style={{fontFamily:sans,fontSize:14,fontWeight:500,color:neutral.dark}}>{faq.q}</span>
                      <span style={{
                        width:26,height:26,borderRadius:13,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                        fontSize:15,fontWeight:400,fontFamily:sans,transition:"all .25s",
                        background:open?`linear-gradient(135deg,${coast.primary},${outback.primary})`:"#F1F5F9",
                        color:open?"#fff":neutral.light,
                      }}>{open?"−":"+"}</span>
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

      {/* ═══ ENQUIRY ═══ */}
      <div id="enquiry" style={{scrollMarginTop:80}}>
        <div style={{
          background:`linear-gradient(135deg, #0B3D4E 0%, ${coast.primary} 22%, #3A8A6C 44%, #6B7B4E 56%, ${outback.primary} 78%, #6B2E08 100%)`,
          padding:"96px 24px",position:"relative",overflow:"hidden",
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
              <p style={{fontFamily:sans,fontSize:11,fontWeight:600,letterSpacing:5,textTransform:"uppercase",color:"rgba(255,255,255,0.4)",marginBottom:14}}>Coming December 2026</p>
              <h2 style={{fontFamily:serif,fontSize:"clamp(28px,4.5vw,42px)",fontWeight:400,color:"#fff",lineHeight:1.2,marginBottom:10}}>
                Register your <em style={{fontStyle:"italic"}}>interest</em>
              </h2>
              <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.45)",maxWidth:420,margin:"0 auto",lineHeight:1.7,fontWeight:300}}>
                We're launching in December 2026. Tell us where you want to go and we'll be in touch as soon as bookings open.
              </p>
            </div>

            {formSubmitted?(
              <div style={{textAlign:"center",padding:"48px 28px",background:"rgba(255,255,255,0.06)",borderRadius:16,border:"1px solid rgba(255,255,255,0.1)",animation:"fadeUp .5s"}}>
                <div style={{fontSize:38,marginBottom:10}}>✓</div>
                <h3 style={{fontFamily:serif,fontSize:22,fontWeight:400,color:"#fff",marginBottom:8}}>You're on the List</h3>
                <p style={{fontFamily:sans,fontSize:13,color:"rgba(255,255,255,0.45)",fontWeight:300}}>We'll be in touch ahead of our December 2026 launch.</p>
              </div>
            ):(
              <div style={{display:"grid",gap:12,background:"rgba(255,255,255,0.05)",border:"1px solid rgba(255,255,255,0.08)",padding:"30px 26px",borderRadius:16}}>
                {[
                  [{l:"Name *",k:"name",p:"Full name"},{l:"Email *",k:"email",p:"your@email.com",t:"email"}],
                  [{l:"Phone",k:"phone",p:"+61 ..."},{l:"Guests",k:"guests",sel:["","2 (couple)","3 (adults)","4 (adults)","2 adults + 2 children","2 adults + 3 children"]}],
                  [{l:"Dates",k:"dates",p:"e.g. July 2027, flexible"},{l:"Package",k:"package",sel:["","K'gari Experience","Tropical North","Coastal Explorer","Red Centre & Outback","Custom Journey","Not sure yet"]}],
                ].map((row,ri)=>(
                  <div key={ri} className="g2" style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:10}}>
                    {row.map((f,fi)=>(
                      <div key={fi}>
                        <label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>{f.l}</label>
                        {f.sel?(
                          <select value={formData[f.k]} onChange={e=>setFormData(p=>({...p,[f.k]:e.target.value}))}
                            style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:formData[f.k]?"#fff":"rgba(255,255,255,0.3)",borderRadius:8}}>
                            {f.sel.map((o,oi)=><option key={oi} value={o}>{o||"Select..."}</option>)}
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
                    style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}} placeholder="e.g. child seats, mobility, medical..."/>
                </div>
                <div>
                  <label style={{fontFamily:sans,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"rgba(255,255,255,0.35)",marginBottom:5,display:"block"}}>Tell Us More</label>
                  <textarea value={formData.message} onChange={e=>setFormData(p=>({...p,message:e.target.value}))}
                    style={{background:"rgba(255,255,255,0.07)",borderColor:"rgba(255,255,255,0.12)",color:"#fff",borderRadius:8}}
                    placeholder="Coast, outback, or both? How long? Any specific destinations? We'd love to hear."/>
                </div>
                <button className="btn-dual" onClick={handleSubmit} style={{width:"100%",marginTop:4}}>Register Interest</button>
                <p style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.2)",textAlign:"center",fontWeight:300}}>Launching December 2026. We'll be in touch.</p>
              </div>
            )}
          </div>
        </div>
      </div>

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
                position:"absolute",top:16,right:20,width:32,height:32,borderRadius:16,
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
                📍 {routeGuide.route} &nbsp;·&nbsp; ⏱ {routeGuide.duration} &nbsp;·&nbsp; 👥 {routeGuide.guests}
              </p>
            </div>

            {/* Modal scrollable body */}
            <div style={{overflowY:"auto",padding:"24px 32px 32px",flex:1}}>
              <p style={{fontFamily:sans,fontSize:13,color:neutral.light,marginBottom:24,fontWeight:300,fontStyle:"italic"}}>
                This is a sample itinerary — every trip is personalised. Days and stops can be adjusted, extended, or rearranged to suit your pace. 
                Camp sites are included in camping mode. In touring mode, we present accommodation options at each stop — you pick what suits, we book everything, and you get one total package price.
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
                              <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:coast.primary,marginBottom:4}}>⛺ Camp</div>
                              <p style={{fontFamily:sans,fontSize:12,color:neutral.mid,lineHeight:1.5,fontWeight:300}}>{stop.stay.split("|")[0].replace("Camp:","").trim()}</p>
                            </div>
                            <div style={{padding:"10px 14px",background:outback.soft,borderRadius:8,borderLeft:`3px solid ${outback.primary}`}}>
                              <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:outback.primary,marginBottom:4}}>🏨 Accommodation</div>
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
                          📋 Book via: {stop.source}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {/* Bottom CTA */}
              <div style={{
                marginTop:32,padding:"24px 28px",borderRadius:14,textAlign:"center",
                background:routeGuide.vibe==="coast"?coast.soft:routeGuide.vibe==="outback"?outback.soft:"#F8F6F0",
              }}>
                <p style={{fontFamily:serif,fontSize:17,fontWeight:400,color:neutral.dark,marginBottom:12,fontStyle:"italic"}}>
                  Like what you see?
                </p>
                <button className="btn-dual" onClick={()=>{setRouteGuide(null);scrollTo("enquiry")}}
                  style={{fontSize:11,padding:"13px 32px"}}>
                  Register Interest
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
                <span style={{fontFamily:serif,fontSize:17,fontWeight:700,color:"#fff",letterSpacing:.5}}>Southern Horizon</span>
                <span style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:3,textTransform:"uppercase",
                  background:`linear-gradient(90deg,${coast.accent},${outback.accent})`,
                  WebkitBackgroundClip:"text",WebkitTextFillColor:"transparent",
                }}>Co.</span>
              </div>
              <p style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,0.25)",maxWidth:240,lineHeight:1.65,fontWeight:300}}>
                Self-drive luxury touring across<br/>Queensland's coast, tropics & outback.
              </p>
            </div>
            <div style={{display:"flex",gap:40,flexWrap:"wrap"}}>
              <div>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.18)",marginBottom:10}}>Navigate</div>
                {SECTIONS.slice(0,5).map(s=>(
                  <div key={s.id} onClick={()=>scrollTo(s.id)} style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,0.3)",cursor:"pointer",padding:"3px 0"}}
                    onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.3)"}>{s.label}</div>
                ))}
              </div>
              <div>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.18)",marginBottom:10}}>Info</div>
                {SECTIONS.slice(5).map(s=>(
                  <div key={s.id} onClick={()=>scrollTo(s.id)} style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,0.3)",cursor:"pointer",padding:"3px 0"}}
                    onMouseEnter={e=>e.target.style.color="#fff"} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.3)"}>{s.label}</div>
                ))}
              </div>
              <div>
                <div style={{fontFamily:sans,fontSize:9,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"rgba(255,255,255,0.18)",marginBottom:10}}>Base</div>
                <p style={{fontFamily:sans,fontSize:12,color:"rgba(255,255,255,0.3)",lineHeight:1.65,fontWeight:300}}>Based in Banyo, Brisbane<br/>Delivery: BNE · OOL · MCY · CNS</p>
              </div>
            </div>
          </div>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:18,flexWrap:"wrap",gap:10}}>
            <span style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.12)",fontWeight:300}}>© 2026 Southern Horizon Co. All rights reserved.</span>
            <span style={{fontFamily:sans,fontSize:10.5,color:"rgba(255,255,255,0.25)",fontWeight:300}}>Launching December 2026</span>
          </div>
        </div>
      </footer>
    </>
  );
}
