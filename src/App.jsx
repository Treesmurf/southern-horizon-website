import { useState, useEffect } from "react";
import { db } from "./firebase.js";
import { collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, orderBy } from "firebase/firestore";

/* ════════════════════════════════════════════════════════════════
   PROPERTY DATABASE
   ════════════════════════════════════════════════════════════════ */
const PROPERTIES = {
  "Rainbow Beach & Inskip": [
    { name:"Rainbow Beach Surf Club Resort — Standard Room", type:"Rainbow Beach Surf Club Resort", ppn:180, desc:"Beachfront resort above the surf club with ocean views and sunset dining" },
    { name:"Rainbow Beach Surf Club Resort — Ocean View Room", type:"Rainbow Beach Surf Club Resort", ppn:220, desc:"Beachfront resort above the surf club with ocean views and sunset dining" },
    { name:"Rainbow Beach Surf Club Resort — Suite", type:"Rainbow Beach Surf Club Resort", ppn:280, desc:"Beachfront resort above the surf club with ocean views and sunset dining" },
    { name:"Plantation Resort at Rainbow — 1-Bed Unit", type:"Plantation Resort at Rainbow", ppn:200, desc:"Self-contained apartments with tropical pool surrounded by lush gardens" },
    { name:"Plantation Resort at Rainbow — 2-Bed Unit", type:"Plantation Resort at Rainbow", ppn:280, desc:"Self-contained apartments with tropical pool surrounded by lush gardens" },
    { name:"Plantation Resort at Rainbow — 3-Bed Unit", type:"Plantation Resort at Rainbow", ppn:350, desc:"Self-contained apartments with tropical pool surrounded by lush gardens" },
    { name:"Rainbow Getaway Holiday Apartments — 1-Bed Apartment", type:"Rainbow Getaway Holiday Apartments", ppn:170, desc:"Modern apartments in the heart of Rainbow Beach, walking distance to everything" },
    { name:"Rainbow Getaway Holiday Apartments — 2-Bed Apartment", type:"Rainbow Getaway Holiday Apartments", ppn:230, desc:"Modern apartments in the heart of Rainbow Beach, walking distance to everything" },
    { name:"Debbie's Place — Studio", type:"Debbie's Place", ppn:150, desc:"Contemporary self-contained apartments with private balconies and garden outlook" },
    { name:"Debbie's Place — 1-Bed Apartment", type:"Debbie's Place", ppn:200, desc:"Contemporary self-contained apartments with private balconies and garden outlook" },
    { name:"Rainbow Ocean Palms Resort — Studio", type:"Rainbow Ocean Palms Resort", ppn:180, desc:"Tropical resort with pool and landscaped gardens, minutes from the beach" },
    { name:"Rainbow Ocean Palms Resort — 1-Bed Suite", type:"Rainbow Ocean Palms Resort", ppn:230, desc:"Tropical resort with pool and landscaped gardens, minutes from the beach" },
    { name:"Rainbow Ocean Palms Resort — 2-Bed Suite", type:"Rainbow Ocean Palms Resort", ppn:300, desc:"Tropical resort with pool and landscaped gardens, minutes from the beach" },
  ],
  "Southern K'gari": [
    { name:"Kingfisher Bay Resort — Hotel — Resort Room", type:"Kingfisher Bay Resort", ppn:200, desc:"Award-winning eco-resort on K'gari's west coast with four pools, restaurants, and ranger-guided tours" },
    { name:"Kingfisher Bay Resort — Hotel — Spa Room", type:"Kingfisher Bay Resort", ppn:280, desc:"Award-winning eco-resort on K'gari's west coast with four pools, restaurants, and ranger-guided tours" },
    { name:"Kingfisher Bay Resort — Villa — 1-Bed Villa", type:"Kingfisher Bay Villas", ppn:300, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Kingfisher Bay Resort — Villa — 2-Bed Villa", type:"Kingfisher Bay Villas", ppn:400, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Kingfisher Bay Resort — Villa — 3-Bed Kingfisher House", type:"Kingfisher Bay Villas", ppn:500, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Eurong Beach Resort — Standard Room", type:"Eurong Beach Resort", ppn:180, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"Eurong Beach Resort — Beach View Room", type:"Eurong Beach Resort", ppn:250, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"Eurong Beach Resort — Family Room", type:"Eurong Beach Resort", ppn:300, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"K'gari Beach Houses — 2-Bed Beach House", type:"K'gari Beach Houses", ppn:350, desc:"Private beachfront houses with uninterrupted ocean views on K'gari's east coast" },
    { name:"K'gari Beach Houses — 3-Bed Beach House", type:"K'gari Beach Houses", ppn:450, desc:"Private beachfront houses with uninterrupted ocean views on K'gari's east coast" },
    { name:"Sailfish on Fraser — Apartment", type:"Sailfish on Fraser", ppn:250, desc:"Self-contained apartments in Happy Valley with ocean glimpses and island charm" },
    { name:"Sailfish on Fraser — Penthouse", type:"Sailfish on Fraser", ppn:380, desc:"Self-contained apartments in Happy Valley with ocean glimpses and island charm" },
  ],
  "75 Mile Beach": [
    { name:"Kingfisher Bay Resort — Hotel — Resort Room", type:"Kingfisher Bay Resort", ppn:200, desc:"Award-winning eco-resort on K'gari's west coast with four pools, restaurants, and ranger-guided tours" },
    { name:"Kingfisher Bay Resort — Hotel — Spa Room", type:"Kingfisher Bay Resort", ppn:280, desc:"Award-winning eco-resort on K'gari's west coast with four pools, restaurants, and ranger-guided tours" },
    { name:"Kingfisher Bay Resort — Villa — 1-Bed Villa", type:"Kingfisher Bay Villas", ppn:300, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Kingfisher Bay Resort — Villa — 2-Bed Villa", type:"Kingfisher Bay Villas", ppn:400, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Kingfisher Bay Resort — Villa — 3-Bed Kingfisher House", type:"Kingfisher Bay Villas", ppn:500, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Eurong Beach Resort — Standard Room", type:"Eurong Beach Resort", ppn:180, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"Eurong Beach Resort — Beach View Room", type:"Eurong Beach Resort", ppn:250, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"Eurong Beach Resort — Family Room", type:"Eurong Beach Resort", ppn:300, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"K'gari Beach Houses — 2-Bed Beach House", type:"K'gari Beach Houses", ppn:350, desc:"Private beachfront houses with uninterrupted ocean views on K'gari's east coast" },
    { name:"K'gari Beach Houses — 3-Bed Beach House", type:"K'gari Beach Houses", ppn:450, desc:"Private beachfront houses with uninterrupted ocean views on K'gari's east coast" },
    { name:"Sailfish on Fraser — Apartment", type:"Sailfish on Fraser", ppn:250, desc:"Self-contained apartments in Happy Valley with ocean glimpses and island charm" },
    { name:"Sailfish on Fraser — Penthouse", type:"Sailfish on Fraser", ppn:380, desc:"Self-contained apartments in Happy Valley with ocean glimpses and island charm" },
  ],
  "Northern K'gari": [
    { name:"Kingfisher Bay Resort — Hotel — Resort Room", type:"Kingfisher Bay Resort", ppn:200, desc:"Award-winning eco-resort on K'gari's west coast with four pools, restaurants, and ranger-guided tours" },
    { name:"Kingfisher Bay Resort — Hotel — Spa Room", type:"Kingfisher Bay Resort", ppn:280, desc:"Award-winning eco-resort on K'gari's west coast with four pools, restaurants, and ranger-guided tours" },
    { name:"Kingfisher Bay Resort — Villa — 1-Bed Villa", type:"Kingfisher Bay Villas", ppn:300, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Kingfisher Bay Resort — Villa — 2-Bed Villa", type:"Kingfisher Bay Villas", ppn:400, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Kingfisher Bay Resort — Villa — 3-Bed Kingfisher House", type:"Kingfisher Bay Villas", ppn:500, desc:"Self-contained villas set in native bushland within the Kingfisher Bay Resort precinct" },
    { name:"Eurong Beach Resort — Standard Room", type:"Eurong Beach Resort", ppn:180, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"Eurong Beach Resort — Beach View Room", type:"Eurong Beach Resort", ppn:250, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"Eurong Beach Resort — Family Room", type:"Eurong Beach Resort", ppn:300, desc:"East coast resort with direct access to 75 Mile Beach and island touring" },
    { name:"K'gari Beach Houses — 2-Bed Beach House", type:"K'gari Beach Houses", ppn:350, desc:"Private beachfront houses with uninterrupted ocean views on K'gari's east coast" },
    { name:"K'gari Beach Houses — 3-Bed Beach House", type:"K'gari Beach Houses", ppn:450, desc:"Private beachfront houses with uninterrupted ocean views on K'gari's east coast" },
    { name:"Sailfish on Fraser — Apartment", type:"Sailfish on Fraser", ppn:250, desc:"Self-contained apartments in Happy Valley with ocean glimpses and island charm" },
    { name:"Sailfish on Fraser — Penthouse", type:"Sailfish on Fraser", ppn:380, desc:"Self-contained apartments in Happy Valley with ocean glimpses and island charm" },
  ],
  "Hervey Bay (optional)": [
    { name:"Mantra Hervey Bay — Hotel Room", type:"Mantra Hervey Bay", ppn:180, desc:"Waterfront hotel and apartments at the marina — departure point for whale watching and K'gari ferries" },
    { name:"Mantra Hervey Bay — 1-Bed Apartment", type:"Mantra Hervey Bay", ppn:250, desc:"Waterfront hotel and apartments at the marina — departure point for whale watching and K'gari ferries" },
    { name:"Mantra Hervey Bay — 2-Bed Apartment", type:"Mantra Hervey Bay", ppn:320, desc:"Waterfront hotel and apartments at the marina — departure point for whale watching and K'gari ferries" },
    { name:"Oaks Resort & Spa — 1-Bed Suite", type:"Oaks Resort & Spa", ppn:200, desc:"Beachfront resort with day spa, heated pool, and sweeping Hervey Bay views" },
    { name:"Oaks Resort & Spa — 2-Bed Suite", type:"Oaks Resort & Spa", ppn:280, desc:"Beachfront resort with day spa, heated pool, and sweeping Hervey Bay views" },
    { name:"Oaks Resort & Spa — Penthouse", type:"Oaks Resort & Spa", ppn:400, desc:"Beachfront resort with day spa, heated pool, and sweeping Hervey Bay views" },
    { name:"Ramada Hervey Bay — Standard Room", type:"Ramada Hervey Bay", ppn:160, desc:"Contemporary hotel in central Hervey Bay with restaurant and tropical pool" },
    { name:"Ramada Hervey Bay — Ocean View", type:"Ramada Hervey Bay", ppn:220, desc:"Contemporary hotel in central Hervey Bay with restaurant and tropical pool" },
    { name:"Ramada Hervey Bay — Suite", type:"Ramada Hervey Bay", ppn:300, desc:"Contemporary hotel in central Hervey Bay with restaurant and tropical pool" },
    { name:"Oceans Resort & Spa — Ocean Room", type:"Oceans Resort & Spa", ppn:220, desc:"Premium beachfront resort with spa, ocean-view pool, and fine dining" },
    { name:"Oceans Resort & Spa — Spa Suite", type:"Oceans Resort & Spa", ppn:300, desc:"Premium beachfront resort with spa, ocean-view pool, and fine dining" },
    { name:"Oceans Resort & Spa — Penthouse", type:"Oceans Resort & Spa", ppn:420, desc:"Premium beachfront resort with spa, ocean-view pool, and fine dining" },
    { name:"Akama Resort — Studio", type:"Akama Resort", ppn:150, desc:"Tropical resort with lagoon pool set among palm gardens on the Hervey Bay esplanade" },
    { name:"Akama Resort — 1-Bed Apartment", type:"Akama Resort", ppn:200, desc:"Tropical resort with lagoon pool set among palm gardens on the Hervey Bay esplanade" },
    { name:"Akama Resort — 2-Bed Apartment", type:"Akama Resort", ppn:280, desc:"Tropical resort with lagoon pool set among palm gardens on the Hervey Bay esplanade" },
  ],
  "Cairns": [
    { name:"Riley Crystalbrook — Urban Room", type:"Riley Crystalbrook", ppn:300, desc:"Five-star resort on the Esplanade with rooftop bar, Crystal Lagoon pool, and panoramic ocean views" },
    { name:"Riley Crystalbrook — Lagoon Room", type:"Riley Crystalbrook", ppn:380, desc:"Five-star resort on the Esplanade with rooftop bar, Crystal Lagoon pool, and panoramic ocean views" },
    { name:"Riley Crystalbrook — Suite", type:"Riley Crystalbrook", ppn:500, desc:"Five-star resort on the Esplanade with rooftop bar, Crystal Lagoon pool, and panoramic ocean views" },
    { name:"Pullman Cairns International — Superior Room", type:"Pullman Cairns International", ppn:250, desc:"Five-star harbourside hotel in the CBD with tropical pool terrace and Coco's restaurant" },
    { name:"Pullman Cairns International — Deluxe Harbour View", type:"Pullman Cairns International", ppn:320, desc:"Five-star harbourside hotel in the CBD with tropical pool terrace and Coco's restaurant" },
    { name:"Pullman Cairns International — Suite", type:"Pullman Cairns International", ppn:450, desc:"Five-star harbourside hotel in the CBD with tropical pool terrace and Coco's restaurant" },
    { name:"Shangri-La The Marina — Deluxe Room", type:"Shangri-La The Marina", ppn:280, desc:"Luxury waterfront hotel overlooking Marlin Marina with Horizon Club lounge and spa" },
    { name:"Shangri-La The Marina — Horizon Club", type:"Shangri-La The Marina", ppn:380, desc:"Luxury waterfront hotel overlooking Marlin Marina with Horizon Club lounge and spa" },
    { name:"Shangri-La The Marina — Suite", type:"Shangri-La The Marina", ppn:520, desc:"Luxury waterfront hotel overlooking Marlin Marina with Horizon Club lounge and spa" },
    { name:"Crystalbrook Flynn — Urban Room", type:"Crystalbrook Flynn", ppn:250, desc:"Boutique five-star hotel in the arts precinct with curated art collection and Flynn's Italian restaurant" },
    { name:"Crystalbrook Flynn — Flynn Suite", type:"Crystalbrook Flynn", ppn:350, desc:"Boutique five-star hotel in the arts precinct with curated art collection and Flynn's Italian restaurant" },
    { name:"Crystalbrook Flynn — Penthouse", type:"Crystalbrook Flynn", ppn:500, desc:"Boutique five-star hotel in the arts precinct with curated art collection and Flynn's Italian restaurant" },
    { name:"Alamanda Palm Cove — 1-Bed Apartment", type:"Alamanda Palm Cove", ppn:300, desc:"Beachfront resort in Palm Cove with lush tropical gardens, pool, and direct beach access" },
    { name:"Alamanda Palm Cove — 2-Bed Apartment", type:"Alamanda Palm Cove", ppn:400, desc:"Beachfront resort in Palm Cove with lush tropical gardens, pool, and direct beach access" },
    { name:"Alamanda Palm Cove — Penthouse", type:"Alamanda Palm Cove", ppn:550, desc:"Beachfront resort in Palm Cove with lush tropical gardens, pool, and direct beach access" },
  ],
  "Cairns (return)": [
    { name:"Riley Crystalbrook — Urban Room", type:"Riley Crystalbrook", ppn:300, desc:"Five-star resort on the Esplanade with rooftop bar, Crystal Lagoon pool, and panoramic ocean views" },
    { name:"Riley Crystalbrook — Lagoon Room", type:"Riley Crystalbrook", ppn:380, desc:"Five-star resort on the Esplanade with rooftop bar, Crystal Lagoon pool, and panoramic ocean views" },
    { name:"Riley Crystalbrook — Suite", type:"Riley Crystalbrook", ppn:500, desc:"Five-star resort on the Esplanade with rooftop bar, Crystal Lagoon pool, and panoramic ocean views" },
    { name:"Pullman Cairns International — Superior Room", type:"Pullman Cairns International", ppn:250, desc:"Five-star harbourside hotel in the CBD with tropical pool terrace and Coco's restaurant" },
    { name:"Pullman Cairns International — Deluxe Harbour View", type:"Pullman Cairns International", ppn:320, desc:"Five-star harbourside hotel in the CBD with tropical pool terrace and Coco's restaurant" },
    { name:"Pullman Cairns International — Suite", type:"Pullman Cairns International", ppn:450, desc:"Five-star harbourside hotel in the CBD with tropical pool terrace and Coco's restaurant" },
    { name:"Shangri-La The Marina — Deluxe Room", type:"Shangri-La The Marina", ppn:280, desc:"Luxury waterfront hotel overlooking Marlin Marina with Horizon Club lounge and spa" },
    { name:"Shangri-La The Marina — Horizon Club", type:"Shangri-La The Marina", ppn:380, desc:"Luxury waterfront hotel overlooking Marlin Marina with Horizon Club lounge and spa" },
    { name:"Shangri-La The Marina — Suite", type:"Shangri-La The Marina", ppn:520, desc:"Luxury waterfront hotel overlooking Marlin Marina with Horizon Club lounge and spa" },
    { name:"Crystalbrook Flynn — Urban Room", type:"Crystalbrook Flynn", ppn:250, desc:"Boutique five-star hotel in the arts precinct with curated art collection and Flynn's Italian restaurant" },
    { name:"Crystalbrook Flynn — Flynn Suite", type:"Crystalbrook Flynn", ppn:350, desc:"Boutique five-star hotel in the arts precinct with curated art collection and Flynn's Italian restaurant" },
    { name:"Crystalbrook Flynn — Penthouse", type:"Crystalbrook Flynn", ppn:500, desc:"Boutique five-star hotel in the arts precinct with curated art collection and Flynn's Italian restaurant" },
    { name:"Alamanda Palm Cove — 1-Bed Apartment", type:"Alamanda Palm Cove", ppn:300, desc:"Beachfront resort in Palm Cove with lush tropical gardens, pool, and direct beach access" },
    { name:"Alamanda Palm Cove — 2-Bed Apartment", type:"Alamanda Palm Cove", ppn:400, desc:"Beachfront resort in Palm Cove with lush tropical gardens, pool, and direct beach access" },
    { name:"Alamanda Palm Cove — Penthouse", type:"Alamanda Palm Cove", ppn:550, desc:"Beachfront resort in Palm Cove with lush tropical gardens, pool, and direct beach access" },
  ],
  "Port Douglas & Mossman Gorge": [
    { name:"Sheraton Grand Mirage — Mirage Room", type:"Sheraton Grand Mirage", ppn:350, desc:"Iconic five-star resort with two hectares of saltwater lagoon pools and direct Four Mile Beach access" },
    { name:"Sheraton Grand Mirage — Lagoon Room", type:"Sheraton Grand Mirage", ppn:420, desc:"Iconic five-star resort with two hectares of saltwater lagoon pools and direct Four Mile Beach access" },
    { name:"Sheraton Grand Mirage — Villa Suite", type:"Sheraton Grand Mirage", ppn:550, desc:"Iconic five-star resort with two hectares of saltwater lagoon pools and direct Four Mile Beach access" },
    { name:"QT Port Douglas — QT Room", type:"QT Port Douglas", ppn:280, desc:"Boutique designer hotel in the heart of Port Douglas with signature quirky style and rooftop bar" },
    { name:"QT Port Douglas — QT Suite", type:"QT Port Douglas", ppn:380, desc:"Boutique designer hotel in the heart of Port Douglas with signature quirky style and rooftop bar" },
    { name:"QT Port Douglas — Director's Suite", type:"QT Port Douglas", ppn:500, desc:"Boutique designer hotel in the heart of Port Douglas with signature quirky style and rooftop bar" },
    { name:"Pullman Sea Temple Resort — 1-Bed Apartment", type:"Pullman Sea Temple Resort", ppn:300, desc:"Expansive beachfront resort with Australia's largest resort lagoon pool and swim-up bar" },
    { name:"Pullman Sea Temple Resort — Swim-out Apartment", type:"Pullman Sea Temple Resort", ppn:400, desc:"Expansive beachfront resort with Australia's largest resort lagoon pool and swim-up bar" },
    { name:"Pullman Sea Temple Resort — Penthouse", type:"Pullman Sea Temple Resort", ppn:550, desc:"Expansive beachfront resort with Australia's largest resort lagoon pool and swim-up bar" },
    { name:"Niramaya Villas & Spa — 1-Bed Villa", type:"Niramaya Villas & Spa", ppn:350, desc:"Private rainforest villas with plunge pools, day spa, and lush tropical gardens" },
    { name:"Niramaya Villas & Spa — 2-Bed Villa", type:"Niramaya Villas & Spa", ppn:450, desc:"Private rainforest villas with plunge pools, day spa, and lush tropical gardens" },
    { name:"Niramaya Villas & Spa — 3-Bed Villa", type:"Niramaya Villas & Spa", ppn:550, desc:"Private rainforest villas with plunge pools, day spa, and lush tropical gardens" },
    { name:"Peninsula Boutique Hotel — Pool View Room", type:"Peninsula Boutique Hotel", ppn:280, desc:"Adults-only beachfront boutique hotel with infinity pool and intimate, personal service" },
    { name:"Peninsula Boutique Hotel — Ocean View Room", type:"Peninsula Boutique Hotel", ppn:350, desc:"Adults-only beachfront boutique hotel with infinity pool and intimate, personal service" },
    { name:"Peninsula Boutique Hotel — Penthouse Suite", type:"Peninsula Boutique Hotel", ppn:500, desc:"Adults-only beachfront boutique hotel with infinity pool and intimate, personal service" },
  ],
  "Daintree Rainforest": [
    { name:"Daintree Eco Lodge & Spa — Bayans Room", type:"Daintree Eco Lodge & Spa", ppn:320, desc:"Award-winning boutique eco-lodge nestled in the Daintree canopy with Aboriginal-inspired spa" },
    { name:"Daintree Eco Lodge & Spa — Bayans Deluxe", type:"Daintree Eco Lodge & Spa", ppn:400, desc:"Award-winning boutique eco-lodge nestled in the Daintree canopy with Aboriginal-inspired spa" },
    { name:"Daintree Eco Lodge & Spa — Treehouse", type:"Daintree Eco Lodge & Spa", ppn:480, desc:"Award-winning boutique eco-lodge nestled in the Daintree canopy with Aboriginal-inspired spa" },
    { name:"Daintree Riverview Lodges — Riverview Cabin", type:"Daintree Riverview Lodges", ppn:180, desc:"Secluded riverside lodges surrounded by World Heritage rainforest on the banks of the Daintree" },
    { name:"Daintree Riverview Lodges — Deluxe Cabin", type:"Daintree Riverview Lodges", ppn:250, desc:"Secluded riverside lodges surrounded by World Heritage rainforest on the banks of the Daintree" },
    { name:"Heritage Lodge Daintree — Heritage Room", type:"Heritage Lodge Daintree", ppn:200, desc:"Heritage-listed character property set in tropical gardens with rainforest boardwalks" },
    { name:"Heritage Lodge Daintree — Rainforest Suite", type:"Heritage Lodge Daintree", ppn:280, desc:"Heritage-listed character property set in tropical gardens with rainforest boardwalks" },
    { name:"Heritage Lodge Daintree — Treehouse", type:"Heritage Lodge Daintree", ppn:350, desc:"Heritage-listed character property set in tropical gardens with rainforest boardwalks" },
    { name:"Silky Oaks Lodge — Treehouse Retreat", type:"Silky Oaks Lodge", ppn:900, desc:"Baillie Lodges ultra-luxury retreat with treehouse suites suspended above the Mossman River" },
    { name:"Silky Oaks Lodge — Riverhouse", type:"Silky Oaks Lodge", ppn:1200, desc:"Baillie Lodges ultra-luxury retreat with treehouse suites suspended above the Mossman River" },
    { name:"Silky Oaks Lodge — Daintree Pavilion", type:"Silky Oaks Lodge", ppn:1800, desc:"Baillie Lodges ultra-luxury retreat with treehouse suites suspended above the Mossman River" },
    { name:"Red Mill House B&B — Garden Room", type:"Red Mill House B&B", ppn:220, desc:"Award-winning birders' paradise with personalised hosting and expert wildlife knowledge" },
    { name:"Red Mill House B&B — Canopy Room", type:"Red Mill House B&B", ppn:280, desc:"Award-winning birders' paradise with personalised hosting and expert wildlife knowledge" },
  ],
  "Cape Tribulation": [
    { name:"Cape Trib Beach House — Beachfront Room", type:"Cape Trib Beach House", ppn:250, desc:"Where the rainforest meets the beach — the premier property on Cape Tribulation" },
    { name:"Cape Trib Beach House — Rainforest Suite", type:"Cape Trib Beach House", ppn:320, desc:"Where the rainforest meets the beach — the premier property on Cape Tribulation" },
    { name:"Cape Trib Beach House — Beach Cabin", type:"Cape Trib Beach House", ppn:280, desc:"Where the rainforest meets the beach — the premier property on Cape Tribulation" },
    { name:"Ferntree Rainforest Lodge — Rainforest Room", type:"Ferntree Rainforest Lodge", ppn:180, desc:"Nestled in ancient Daintree rainforest with elevated rooms and canopy walkways" },
    { name:"Ferntree Rainforest Lodge — Treehouse Room", type:"Ferntree Rainforest Lodge", ppn:220, desc:"Nestled in ancient Daintree rainforest with elevated rooms and canopy walkways" },
    { name:"Ferntree Rainforest Lodge — Canopy Suite", type:"Ferntree Rainforest Lodge", ppn:280, desc:"Nestled in ancient Daintree rainforest with elevated rooms and canopy walkways" },
    { name:"Daintree Wilderness Lodge — Eco Cabin", type:"Daintree Wilderness Lodge", ppn:280, desc:"Remote eco-retreat offering immersive rainforest experience and guided nature walks" },
    { name:"Daintree Wilderness Lodge — Luxury Cabin", type:"Daintree Wilderness Lodge", ppn:380, desc:"Remote eco-retreat offering immersive rainforest experience and guided nature walks" },
    { name:"Cape Tribulation Camping — Safari Tent", type:"Cape Tribulation Eco Retreat", ppn:120, desc:"Eco-accommodation at the edge of the Daintree with safari tents and cabins" },
    { name:"Cape Tribulation Camping — Cabin", type:"Cape Tribulation Eco Retreat", ppn:160, desc:"Eco-accommodation at the edge of the Daintree with safari tents and cabins" },
    { name:"Epiphyte B&B — Garden Room", type:"Epiphyte B&B", ppn:200, desc:"Intimate boutique B&B with personalised hosting in the heart of Cape Tribulation" },
    { name:"Epiphyte B&B — Rainforest Room", type:"Epiphyte B&B", ppn:250, desc:"Intimate boutique B&B with personalised hosting in the heart of Cape Tribulation" },
  ],
  "Atherton Tablelands": [
    { name:"Mt Quincan Crater Retreat — Crater View Room", type:"Mt Quincan Crater Retreat", ppn:250, desc:"Perched on a volcanic crater rim with sweeping views and exceptional birdwatching" },
    { name:"Mt Quincan Crater Retreat — Luxury Suite", type:"Mt Quincan Crater Retreat", ppn:320, desc:"Perched on a volcanic crater rim with sweeping views and exceptional birdwatching" },
    { name:"Eden House Retreat & Mountain Spa — Garden Room", type:"Eden House Retreat & Mountain Spa", ppn:220, desc:"Mountain spa retreat with day spa, heated pool, and Tablelands garden setting" },
    { name:"Eden House Retreat & Mountain Spa — Spa Room", type:"Eden House Retreat & Mountain Spa", ppn:300, desc:"Mountain spa retreat with day spa, heated pool, and Tablelands garden setting" },
    { name:"Eden House Retreat & Mountain Spa — Suite", type:"Eden House Retreat & Mountain Spa", ppn:380, desc:"Mountain spa retreat with day spa, heated pool, and Tablelands garden setting" },
    { name:"Rose Gums Wilderness Retreat — Treehouse", type:"Rose Gums Wilderness Retreat", ppn:350, desc:"Elevated luxury treehouses in pristine rainforest with wildlife at your doorstep" },
    { name:"Rose Gums Wilderness Retreat — Luxury Treehouse", type:"Rose Gums Wilderness Retreat", ppn:450, desc:"Elevated luxury treehouses in pristine rainforest with wildlife at your doorstep" },
    { name:"Crater Lakes Rainforest Cottages — Cottage", type:"Crater Lakes Rainforest Cottages", ppn:200, desc:"Self-contained cottages near Lake Eacham with private rainforest gardens" },
    { name:"Crater Lakes Rainforest Cottages — Deluxe Cottage", type:"Crater Lakes Rainforest Cottages", ppn:280, desc:"Self-contained cottages near Lake Eacham with private rainforest gardens" },
    { name:"Allumbah Pocket Cottages — Cottage", type:"Allumbah Pocket Cottages", ppn:180, desc:"Charming cottages in Yungaburra village — platypus viewing just a short walk away" },
    { name:"Allumbah Pocket Cottages — Deluxe Cottage", type:"Allumbah Pocket Cottages", ppn:240, desc:"Charming cottages in Yungaburra village — platypus viewing just a short walk away" },
  ],
  "Bundaberg & 1770": [
    { name:"Lagoons 1770 Beachfront Resort — Resort Room", type:"Lagoons 1770 Beachfront Resort", ppn:220, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Lagoons 1770 Beachfront Resort — 1-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:280, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Lagoons 1770 Beachfront Resort — 2-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:350, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Sandcastles 1770 Motel — Standard Room", type:"Sandcastles 1770 Motel", ppn:160, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Sandcastles 1770 Motel — Deluxe Room", type:"Sandcastles 1770 Motel", ppn:200, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Sandcastles 1770 Motel — Family Suite", type:"Sandcastles 1770 Motel", ppn:260, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Agnes Water Beach Club — Studio", type:"Agnes Water Beach Club", ppn:200, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"Agnes Water Beach Club — 1-Bed Apartment", type:"Agnes Water Beach Club", ppn:280, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"Agnes Water Beach Club — 2-Bed Penthouse", type:"Agnes Water Beach Club", ppn:380, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"The Deck at 1770 — Cabin", type:"The Deck at 1770", ppn:180, desc:"Elevated eco-villas in a private bush setting overlooking the coastline" },
    { name:"The Deck at 1770 — Eco Villa", type:"The Deck at 1770", ppn:250, desc:"Elevated eco-villas in a private bush setting overlooking the coastline" },
    { name:"Kellys Beach Resort Bargara — Studio", type:"Kellys Beach Resort Bargara", ppn:180, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
    { name:"Kellys Beach Resort Bargara — 1-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:240, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
    { name:"Kellys Beach Resort Bargara — 2-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:320, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
  ],
  "1770 & Agnes Water": [
    { name:"Lagoons 1770 Beachfront Resort — Resort Room", type:"Lagoons 1770 Beachfront Resort", ppn:220, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Lagoons 1770 Beachfront Resort — 1-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:280, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Lagoons 1770 Beachfront Resort — 2-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:350, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Sandcastles 1770 Motel — Standard Room", type:"Sandcastles 1770 Motel", ppn:160, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Sandcastles 1770 Motel — Deluxe Room", type:"Sandcastles 1770 Motel", ppn:200, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Sandcastles 1770 Motel — Family Suite", type:"Sandcastles 1770 Motel", ppn:260, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Agnes Water Beach Club — Studio", type:"Agnes Water Beach Club", ppn:200, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"Agnes Water Beach Club — 1-Bed Apartment", type:"Agnes Water Beach Club", ppn:280, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"Agnes Water Beach Club — 2-Bed Penthouse", type:"Agnes Water Beach Club", ppn:380, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"The Deck at 1770 — Cabin", type:"The Deck at 1770", ppn:180, desc:"Elevated eco-villas in a private bush setting overlooking the coastline" },
    { name:"The Deck at 1770 — Eco Villa", type:"The Deck at 1770", ppn:250, desc:"Elevated eco-villas in a private bush setting overlooking the coastline" },
    { name:"Kellys Beach Resort Bargara — Studio", type:"Kellys Beach Resort Bargara", ppn:180, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
    { name:"Kellys Beach Resort Bargara — 1-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:240, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
    { name:"Kellys Beach Resort Bargara — 2-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:320, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
  ],
  "Agnes Water & Bundaberg": [
    { name:"Lagoons 1770 Beachfront Resort — Resort Room", type:"Lagoons 1770 Beachfront Resort", ppn:220, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Lagoons 1770 Beachfront Resort — 1-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:280, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Lagoons 1770 Beachfront Resort — 2-Bed Apartment", type:"Lagoons 1770 Beachfront Resort", ppn:350, desc:"Beachfront resort in the Town of 1770 with lagoon pool and waterfront dining" },
    { name:"Sandcastles 1770 Motel — Standard Room", type:"Sandcastles 1770 Motel", ppn:160, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Sandcastles 1770 Motel — Deluxe Room", type:"Sandcastles 1770 Motel", ppn:200, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Sandcastles 1770 Motel — Family Suite", type:"Sandcastles 1770 Motel", ppn:260, desc:"Contemporary motel in Agnes Water with pool and easy access to the beach" },
    { name:"Agnes Water Beach Club — Studio", type:"Agnes Water Beach Club", ppn:200, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"Agnes Water Beach Club — 1-Bed Apartment", type:"Agnes Water Beach Club", ppn:280, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"Agnes Water Beach Club — 2-Bed Penthouse", type:"Agnes Water Beach Club", ppn:380, desc:"Modern rooftop pool complex in Agnes Water with ocean views and relaxed coastal vibe" },
    { name:"The Deck at 1770 — Cabin", type:"The Deck at 1770", ppn:180, desc:"Elevated eco-villas in a private bush setting overlooking the coastline" },
    { name:"The Deck at 1770 — Eco Villa", type:"The Deck at 1770", ppn:250, desc:"Elevated eco-villas in a private bush setting overlooking the coastline" },
    { name:"Kellys Beach Resort Bargara — Studio", type:"Kellys Beach Resort Bargara", ppn:180, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
    { name:"Kellys Beach Resort Bargara — 1-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:240, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
    { name:"Kellys Beach Resort Bargara — 2-Bed Apartment", type:"Kellys Beach Resort Bargara", ppn:320, desc:"Beachfront resort in Bargara with pool, BBQ areas, and Bundaberg region access" },
  ],
  "Yeppoon": [
    { name:"Salt Yeppoon — 1-Bed Apartment", type:"Salt Yeppoon", ppn:250, desc:"Premium waterfront apartments with infinity pool, rooftop terrace, and Keppel Bay views" },
    { name:"Salt Yeppoon — 2-Bed Apartment", type:"Salt Yeppoon", ppn:350, desc:"Premium waterfront apartments with infinity pool, rooftop terrace, and Keppel Bay views" },
    { name:"Salt Yeppoon — Penthouse", type:"Salt Yeppoon", ppn:500, desc:"Premium waterfront apartments with infinity pool, rooftop terrace, and Keppel Bay views" },
    { name:"Coral Inn Boutique Resort — Resort Room", type:"Coral Inn Boutique Resort", ppn:180, desc:"Boutique resort in central Yeppoon with spa rooms and intimate tropical setting" },
    { name:"Coral Inn Boutique Resort — Spa Room", type:"Coral Inn Boutique Resort", ppn:250, desc:"Boutique resort in central Yeppoon with spa rooms and intimate tropical setting" },
    { name:"Coral Inn Boutique Resort — Suite", type:"Coral Inn Boutique Resort", ppn:320, desc:"Boutique resort in central Yeppoon with spa rooms and intimate tropical setting" },
    { name:"Villa Mar Colina — Villa", type:"Villa Mar Colina", ppn:200, desc:"Mediterranean-inspired villas with private pool and coastal Yeppoon views" },
    { name:"Villa Mar Colina — Deluxe Villa", type:"Villa Mar Colina", ppn:280, desc:"Mediterranean-inspired villas with private pool and coastal Yeppoon views" },
    { name:"Oshen Apartments — 1-Bed Apartment", type:"Oshen Apartments", ppn:220, desc:"Modern ocean-view apartments with rooftop terrace and contemporary design" },
    { name:"Oshen Apartments — 2-Bed Apartment", type:"Oshen Apartments", ppn:300, desc:"Modern ocean-view apartments with rooftop terrace and contemporary design" },
    { name:"Oshen Apartments — 3-Bed Apartment", type:"Oshen Apartments", ppn:400, desc:"Modern ocean-view apartments with rooftop terrace and contemporary design" },
    { name:"Capricorn Palms Holiday Park — Cabin", type:"Capricorn Palms Resort", ppn:140, desc:"Family resort with pool, water park, and cabins set in tropical gardens" },
    { name:"Capricorn Palms Holiday Park — Deluxe Cabin", type:"Capricorn Palms Resort", ppn:190, desc:"Family resort with pool, water park, and cabins set in tropical gardens" },
    { name:"Capricorn Palms Holiday Park — Villa", type:"Capricorn Palms Resort", ppn:250, desc:"Family resort with pool, water park, and cabins set in tropical gardens" },
  ],
  "Yeppoon & Capricorn Coast": [
    { name:"Salt Yeppoon — 1-Bed Apartment", type:"Salt Yeppoon", ppn:250, desc:"Premium waterfront apartments with infinity pool, rooftop terrace, and Keppel Bay views" },
    { name:"Salt Yeppoon — 2-Bed Apartment", type:"Salt Yeppoon", ppn:350, desc:"Premium waterfront apartments with infinity pool, rooftop terrace, and Keppel Bay views" },
    { name:"Salt Yeppoon — Penthouse", type:"Salt Yeppoon", ppn:500, desc:"Premium waterfront apartments with infinity pool, rooftop terrace, and Keppel Bay views" },
    { name:"Coral Inn Boutique Resort — Resort Room", type:"Coral Inn Boutique Resort", ppn:180, desc:"Boutique resort in central Yeppoon with spa rooms and intimate tropical setting" },
    { name:"Coral Inn Boutique Resort — Spa Room", type:"Coral Inn Boutique Resort", ppn:250, desc:"Boutique resort in central Yeppoon with spa rooms and intimate tropical setting" },
    { name:"Coral Inn Boutique Resort — Suite", type:"Coral Inn Boutique Resort", ppn:320, desc:"Boutique resort in central Yeppoon with spa rooms and intimate tropical setting" },
    { name:"Villa Mar Colina — Villa", type:"Villa Mar Colina", ppn:200, desc:"Mediterranean-inspired villas with private pool and coastal Yeppoon views" },
    { name:"Villa Mar Colina — Deluxe Villa", type:"Villa Mar Colina", ppn:280, desc:"Mediterranean-inspired villas with private pool and coastal Yeppoon views" },
    { name:"Oshen Apartments — 1-Bed Apartment", type:"Oshen Apartments", ppn:220, desc:"Modern ocean-view apartments with rooftop terrace and contemporary design" },
    { name:"Oshen Apartments — 2-Bed Apartment", type:"Oshen Apartments", ppn:300, desc:"Modern ocean-view apartments with rooftop terrace and contemporary design" },
    { name:"Oshen Apartments — 3-Bed Apartment", type:"Oshen Apartments", ppn:400, desc:"Modern ocean-view apartments with rooftop terrace and contemporary design" },
    { name:"Capricorn Palms Holiday Park — Cabin", type:"Capricorn Palms Resort", ppn:140, desc:"Family resort with pool, water park, and cabins set in tropical gardens" },
    { name:"Capricorn Palms Holiday Park — Deluxe Cabin", type:"Capricorn Palms Resort", ppn:190, desc:"Family resort with pool, water park, and cabins set in tropical gardens" },
    { name:"Capricorn Palms Holiday Park — Villa", type:"Capricorn Palms Resort", ppn:250, desc:"Family resort with pool, water park, and cabins set in tropical gardens" },
  ],
  "Cape Hillsborough": [
    { name:"Ocean International Mackay — Standard Room", type:"Ocean International Mackay", ppn:160, desc:"Waterfront hotel on Mackay's harbour with pool and ocean-facing restaurant" },
    { name:"Ocean International Mackay — Ocean View Room", type:"Ocean International Mackay", ppn:220, desc:"Waterfront hotel on Mackay's harbour with pool and ocean-facing restaurant" },
    { name:"Ocean International Mackay — Suite", type:"Ocean International Mackay", ppn:300, desc:"Waterfront hotel on Mackay's harbour with pool and ocean-facing restaurant" },
    { name:"Clarion Hotel Mackay Marina — Marina Room", type:"Clarion Hotel Mackay Marina", ppn:180, desc:"Marina precinct hotel with waterfront dining and sunset harbour views" },
    { name:"Clarion Hotel Mackay Marina — Deluxe Marina", type:"Clarion Hotel Mackay Marina", ppn:250, desc:"Marina precinct hotel with waterfront dining and sunset harbour views" },
    { name:"Clarion Hotel Mackay Marina — Suite", type:"Clarion Hotel Mackay Marina", ppn:350, desc:"Marina precinct hotel with waterfront dining and sunset harbour views" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Standard Cabin", type:"Cape Hillsborough Nature Resort", ppn:180, desc:"The iconic kangaroo sunrise beach — wake up to wallabies on the sand at dawn" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Deluxe Cabin", type:"Cape Hillsborough Nature Resort", ppn:230, desc:"The iconic kangaroo sunrise beach — wake up to wallabies on the sand at dawn" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Beachfront Cabin", type:"Cape Hillsborough Nature Resort", ppn:280, desc:"The iconic kangaroo sunrise beach — wake up to wallabies on the sand at dawn" },
    { name:"Broken River Mountain Retreat — Eco Cabin", type:"Broken River Mountain Retreat", ppn:200, desc:"Rainforest retreat near Eungella National Park with platypus viewing at your doorstep" },
    { name:"Broken River Mountain Retreat — Rainforest Cabin", type:"Broken River Mountain Retreat", ppn:280, desc:"Rainforest retreat near Eungella National Park with platypus viewing at your doorstep" },
    { name:"Windmill Motel Mackay — Standard Room", type:"Windmill Motel Mackay", ppn:140, desc:"Contemporary hotel in central Mackay with pool and restaurant" },
    { name:"Windmill Motel Mackay — Deluxe Room", type:"Windmill Motel Mackay", ppn:180, desc:"Contemporary hotel in central Mackay with pool and restaurant" },
    { name:"Windmill Motel Mackay — Suite", type:"Windmill Motel Mackay", ppn:240, desc:"Contemporary hotel in central Mackay with pool and restaurant" },
  ],
  "Mackay": [
    { name:"Ocean International Mackay — Standard Room", type:"Ocean International Mackay", ppn:160, desc:"Waterfront hotel on Mackay's harbour with pool and ocean-facing restaurant" },
    { name:"Ocean International Mackay — Ocean View Room", type:"Ocean International Mackay", ppn:220, desc:"Waterfront hotel on Mackay's harbour with pool and ocean-facing restaurant" },
    { name:"Ocean International Mackay — Suite", type:"Ocean International Mackay", ppn:300, desc:"Waterfront hotel on Mackay's harbour with pool and ocean-facing restaurant" },
    { name:"Clarion Hotel Mackay Marina — Marina Room", type:"Clarion Hotel Mackay Marina", ppn:180, desc:"Marina precinct hotel with waterfront dining and sunset harbour views" },
    { name:"Clarion Hotel Mackay Marina — Deluxe Marina", type:"Clarion Hotel Mackay Marina", ppn:250, desc:"Marina precinct hotel with waterfront dining and sunset harbour views" },
    { name:"Clarion Hotel Mackay Marina — Suite", type:"Clarion Hotel Mackay Marina", ppn:350, desc:"Marina precinct hotel with waterfront dining and sunset harbour views" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Standard Cabin", type:"Cape Hillsborough Nature Resort", ppn:180, desc:"The iconic kangaroo sunrise beach — wake up to wallabies on the sand at dawn" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Deluxe Cabin", type:"Cape Hillsborough Nature Resort", ppn:230, desc:"The iconic kangaroo sunrise beach — wake up to wallabies on the sand at dawn" },
    { name:"Cape Hillsborough Nature Resort — Cabin — Beachfront Cabin", type:"Cape Hillsborough Nature Resort", ppn:280, desc:"The iconic kangaroo sunrise beach — wake up to wallabies on the sand at dawn" },
    { name:"Broken River Mountain Retreat — Eco Cabin", type:"Broken River Mountain Retreat", ppn:200, desc:"Rainforest retreat near Eungella National Park with platypus viewing at your doorstep" },
    { name:"Broken River Mountain Retreat — Rainforest Cabin", type:"Broken River Mountain Retreat", ppn:280, desc:"Rainforest retreat near Eungella National Park with platypus viewing at your doorstep" },
    { name:"Windmill Motel Mackay — Standard Room", type:"Windmill Motel Mackay", ppn:140, desc:"Contemporary hotel in central Mackay with pool and restaurant" },
    { name:"Windmill Motel Mackay — Deluxe Room", type:"Windmill Motel Mackay", ppn:180, desc:"Contemporary hotel in central Mackay with pool and restaurant" },
    { name:"Windmill Motel Mackay — Suite", type:"Windmill Motel Mackay", ppn:240, desc:"Contemporary hotel in central Mackay with pool and restaurant" },
  ],
  "Airlie Beach": [
    { name:"Coral Sea Resort — Garden Room", type:"Coral Sea Resort", ppn:280, desc:"Absolute waterfront resort with infinity pool and panoramic Whitsunday Island views" },
    { name:"Coral Sea Resort — Ocean View Room", type:"Coral Sea Resort", ppn:380, desc:"Absolute waterfront resort with infinity pool and panoramic Whitsunday Island views" },
    { name:"Coral Sea Resort — Waterfront Suite", type:"Coral Sea Resort", ppn:500, desc:"Absolute waterfront resort with infinity pool and panoramic Whitsunday Island views" },
    { name:"Peppers Airlie Beach — 1-Bed Apartment", type:"Peppers Airlie Beach", ppn:300, desc:"Contemporary resort with marina views, infinity pool, and walk to Airlie Beach village" },
    { name:"Peppers Airlie Beach — 2-Bed Apartment", type:"Peppers Airlie Beach", ppn:400, desc:"Contemporary resort with marina views, infinity pool, and walk to Airlie Beach village" },
    { name:"Peppers Airlie Beach — Penthouse", type:"Peppers Airlie Beach", ppn:540, desc:"Contemporary resort with marina views, infinity pool, and walk to Airlie Beach village" },
    { name:"Mantra Club Croc — Hotel Room", type:"Mantra Club Croc", ppn:220, desc:"Central Airlie Beach hotel within walking distance of restaurants, bars, and the lagoon" },
    { name:"Mantra Club Croc — 1-Bed Apartment", type:"Mantra Club Croc", ppn:300, desc:"Central Airlie Beach hotel within walking distance of restaurants, bars, and the lagoon" },
    { name:"Mantra Club Croc — 2-Bed Apartment", type:"Mantra Club Croc", ppn:400, desc:"Central Airlie Beach hotel within walking distance of restaurants, bars, and the lagoon" },
    { name:"Mirage Whitsundays — 1-Bed Apartment", type:"Mirage Whitsundays", ppn:250, desc:"Family-friendly resort with expansive lagoon pool and tropical garden apartments" },
    { name:"Mirage Whitsundays — 2-Bed Apartment", type:"Mirage Whitsundays", ppn:350, desc:"Family-friendly resort with expansive lagoon pool and tropical garden apartments" },
    { name:"Mirage Whitsundays — 3-Bed Apartment", type:"Mirage Whitsundays", ppn:450, desc:"Family-friendly resort with expansive lagoon pool and tropical garden apartments" },
    { name:"InterContinental Hayman Island — Resort Room", type:"InterContinental Hayman Island", ppn:800, desc:"Ultra-luxury private island resort — one of Australia's most exclusive destinations" },
    { name:"InterContinental Hayman Island — Pool Access Room", type:"InterContinental Hayman Island", ppn:1000, desc:"Ultra-luxury private island resort — one of Australia's most exclusive destinations" },
    { name:"InterContinental Hayman Island — Suite", type:"InterContinental Hayman Island", ppn:1500, desc:"Ultra-luxury private island resort — one of Australia's most exclusive destinations" },
  ],
  "Airlie Beach & Whitsundays": [
    { name:"Coral Sea Resort — Garden Room", type:"Coral Sea Resort", ppn:280, desc:"Absolute waterfront resort with infinity pool and panoramic Whitsunday Island views" },
    { name:"Coral Sea Resort — Ocean View Room", type:"Coral Sea Resort", ppn:380, desc:"Absolute waterfront resort with infinity pool and panoramic Whitsunday Island views" },
    { name:"Coral Sea Resort — Waterfront Suite", type:"Coral Sea Resort", ppn:500, desc:"Absolute waterfront resort with infinity pool and panoramic Whitsunday Island views" },
    { name:"Peppers Airlie Beach — 1-Bed Apartment", type:"Peppers Airlie Beach", ppn:300, desc:"Contemporary resort with marina views, infinity pool, and walk to Airlie Beach village" },
    { name:"Peppers Airlie Beach — 2-Bed Apartment", type:"Peppers Airlie Beach", ppn:400, desc:"Contemporary resort with marina views, infinity pool, and walk to Airlie Beach village" },
    { name:"Peppers Airlie Beach — Penthouse", type:"Peppers Airlie Beach", ppn:540, desc:"Contemporary resort with marina views, infinity pool, and walk to Airlie Beach village" },
    { name:"Mantra Club Croc — Hotel Room", type:"Mantra Club Croc", ppn:220, desc:"Central Airlie Beach hotel within walking distance of restaurants, bars, and the lagoon" },
    { name:"Mantra Club Croc — 1-Bed Apartment", type:"Mantra Club Croc", ppn:300, desc:"Central Airlie Beach hotel within walking distance of restaurants, bars, and the lagoon" },
    { name:"Mantra Club Croc — 2-Bed Apartment", type:"Mantra Club Croc", ppn:400, desc:"Central Airlie Beach hotel within walking distance of restaurants, bars, and the lagoon" },
    { name:"Mirage Whitsundays — 1-Bed Apartment", type:"Mirage Whitsundays", ppn:250, desc:"Family-friendly resort with expansive lagoon pool and tropical garden apartments" },
    { name:"Mirage Whitsundays — 2-Bed Apartment", type:"Mirage Whitsundays", ppn:350, desc:"Family-friendly resort with expansive lagoon pool and tropical garden apartments" },
    { name:"Mirage Whitsundays — 3-Bed Apartment", type:"Mirage Whitsundays", ppn:450, desc:"Family-friendly resort with expansive lagoon pool and tropical garden apartments" },
    { name:"InterContinental Hayman Island — Resort Room", type:"InterContinental Hayman Island", ppn:800, desc:"Ultra-luxury private island resort — one of Australia's most exclusive destinations" },
    { name:"InterContinental Hayman Island — Pool Access Room", type:"InterContinental Hayman Island", ppn:1000, desc:"Ultra-luxury private island resort — one of Australia's most exclusive destinations" },
    { name:"InterContinental Hayman Island — Suite", type:"InterContinental Hayman Island", ppn:1500, desc:"Ultra-luxury private island resort — one of Australia's most exclusive destinations" },
  ],
  "Townsville & Magnetic Island": [
    { name:"The Ville Resort — Casino — Standard Room", type:"The Ville Resort", ppn:200, desc:"Premier waterfront resort on The Strand with casino, pool, and ocean views" },
    { name:"The Ville Resort — Casino — Deluxe Room", type:"The Ville Resort", ppn:280, desc:"Premier waterfront resort on The Strand with casino, pool, and ocean views" },
    { name:"The Ville Resort — Casino — Suite", type:"The Ville Resort", ppn:400, desc:"Premier waterfront resort on The Strand with casino, pool, and ocean views" },
    { name:"Peppers Blue on Blue — Magnetic Is. — 1-Bed Apartment", type:"Peppers Blue on Blue", ppn:250, desc:"Modern marina apartments on Magnetic Island with ferry access and island lifestyle" },
    { name:"Peppers Blue on Blue — Magnetic Is. — 2-Bed Apartment", type:"Peppers Blue on Blue", ppn:350, desc:"Modern marina apartments on Magnetic Island with ferry access and island lifestyle" },
    { name:"Peppers Blue on Blue — Magnetic Is. — Marina Suite", type:"Peppers Blue on Blue", ppn:450, desc:"Modern marina apartments on Magnetic Island with ferry access and island lifestyle" },
    { name:"Rydges Southbank Townsville — Standard Room", type:"Rydges Southbank Townsville", ppn:180, desc:"Contemporary hotel in the Palmer Street dining precinct with rooftop pool" },
    { name:"Rydges Southbank Townsville — City View Room", type:"Rydges Southbank Townsville", ppn:240, desc:"Contemporary hotel in the Palmer Street dining precinct with rooftop pool" },
    { name:"Rydges Southbank Townsville — Suite", type:"Rydges Southbank Townsville", ppn:350, desc:"Contemporary hotel in the Palmer Street dining precinct with rooftop pool" },
    { name:"Grand Hotel Townsville — Heritage Room", type:"Grand Hotel Townsville", ppn:160, desc:"Heritage hotel in the heart of Townsville with character rooms and fine dining" },
    { name:"Grand Hotel Townsville — Deluxe Room", type:"Grand Hotel Townsville", ppn:220, desc:"Heritage hotel in the heart of Townsville with character rooms and fine dining" },
    { name:"Grand Hotel Townsville — Suite", type:"Grand Hotel Townsville", ppn:300, desc:"Heritage hotel in the heart of Townsville with character rooms and fine dining" },
    { name:"Island Leisure Resort — Magnetic Is. — Studio", type:"Island Leisure Resort", ppn:180, desc:"Relaxed island resort at Horseshoe Bay with pool and tropical gardens" },
    { name:"Island Leisure Resort — Magnetic Is. — 1-Bed Unit", type:"Island Leisure Resort", ppn:250, desc:"Relaxed island resort at Horseshoe Bay with pool and tropical gardens" },
    { name:"Island Leisure Resort — Magnetic Is. — 2-Bed Unit", type:"Island Leisure Resort", ppn:320, desc:"Relaxed island resort at Horseshoe Bay with pool and tropical gardens" },
  ],
  "Mission Beach": [
    { name:"Castaways Resort & Spa — Garden Room", type:"Castaways Resort & Spa", ppn:200, desc:"Beachfront resort on Mission Beach with spa, pool, and Coral Sea views" },
    { name:"Castaways Resort & Spa — Beachfront Room", type:"Castaways Resort & Spa", ppn:260, desc:"Beachfront resort on Mission Beach with spa, pool, and Coral Sea views" },
    { name:"Castaways Resort & Spa — Suite", type:"Castaways Resort & Spa", ppn:380, desc:"Beachfront resort on Mission Beach with spa, pool, and Coral Sea views" },
    { name:"Elandra Mission Beach — Rainforest Room", type:"Elandra Mission Beach", ppn:250, desc:"Boutique luxury retreat with stunning elevated ocean and rainforest views" },
    { name:"Elandra Mission Beach — Ocean View Room", type:"Elandra Mission Beach", ppn:350, desc:"Boutique luxury retreat with stunning elevated ocean and rainforest views" },
    { name:"Elandra Mission Beach — Penthouse", type:"Elandra Mission Beach", ppn:500, desc:"Boutique luxury retreat with stunning elevated ocean and rainforest views" },
    { name:"Licuala Lodge — Rainforest Room", type:"Licuala Lodge", ppn:180, desc:"Intimate rainforest B&B with expert local hosting and cassowary spotting nearby" },
    { name:"Licuala Lodge — Garden Suite", type:"Licuala Lodge", ppn:240, desc:"Intimate rainforest B&B with expert local hosting and cassowary spotting nearby" },
    { name:"Wongalinga — Beach House", type:"Wongalinga", ppn:280, desc:"Private beach houses set between rainforest and ocean on Mission Beach" },
    { name:"Wongalinga — Luxury Beach House", type:"Wongalinga", ppn:380, desc:"Private beach houses set between rainforest and ocean on Mission Beach" },
    { name:"Beachcomber Coconut Holiday Park — Cabin — Cabin", type:"Beachcomber Coconut Village", ppn:140, desc:"Beachfront holiday park with cabins nestled among coconut palms" },
    { name:"Beachcomber Coconut Holiday Park — Cabin — Deluxe Cabin", type:"Beachcomber Coconut Village", ppn:190, desc:"Beachfront holiday park with cabins nestled among coconut palms" },
  ],
  "Toowoomba": [
    { name:"Vacy Hall Historic Guesthouse — Heritage Room", type:"Vacy Hall Historic Guesthouse", ppn:180, desc:"Heritage-listed 1890s guesthouse with manicured gardens in the heart of Toowoomba" },
    { name:"Vacy Hall Historic Guesthouse — Deluxe Room", type:"Vacy Hall Historic Guesthouse", ppn:230, desc:"Heritage-listed 1890s guesthouse with manicured gardens in the heart of Toowoomba" },
    { name:"Vacy Hall Historic Guesthouse — Suite", type:"Vacy Hall Historic Guesthouse", ppn:300, desc:"Heritage-listed 1890s guesthouse with manicured gardens in the heart of Toowoomba" },
    { name:"Mercure Toowoomba — Standard Room", type:"Mercure Toowoomba", ppn:160, desc:"Contemporary hotel in central Toowoomba with restaurant and conference facilities" },
    { name:"Mercure Toowoomba — Superior Room", type:"Mercure Toowoomba", ppn:200, desc:"Contemporary hotel in central Toowoomba with restaurant and conference facilities" },
    { name:"Mercure Toowoomba — Suite", type:"Mercure Toowoomba", ppn:280, desc:"Contemporary hotel in central Toowoomba with restaurant and conference facilities" },
    { name:"Quest Toowoomba — Studio", type:"Quest Toowoomba", ppn:180, desc:"Modern self-contained apartments ideal for extended stays in the Garden City" },
    { name:"Quest Toowoomba — 1-Bed Apartment", type:"Quest Toowoomba", ppn:240, desc:"Modern self-contained apartments ideal for extended stays in the Garden City" },
    { name:"Quest Toowoomba — 2-Bed Apartment", type:"Quest Toowoomba", ppn:320, desc:"Modern self-contained apartments ideal for extended stays in the Garden City" },
    { name:"Picnic Point Villas — 1-Bed Villa", type:"Picnic Point Villas", ppn:200, desc:"Private villas near Picnic Point with panoramic views of the Lockyer Valley" },
    { name:"Picnic Point Villas — 2-Bed Villa", type:"Picnic Point Villas", ppn:280, desc:"Private villas near Picnic Point with panoramic views of the Lockyer Valley" },
    { name:"Downs Motor Inn — Standard Room", type:"Downs Motor Inn", ppn:130, desc:"Well-appointed hotel in central Toowoomba with comfortable rooms and parking" },
    { name:"Downs Motor Inn — Deluxe Room", type:"Downs Motor Inn", ppn:170, desc:"Well-appointed hotel in central Toowoomba with comfortable rooms and parking" },
  ],
  "Roma": [
    { name:"Roma Explorers Inn — Standard Room", type:"Roma Explorers Inn", ppn:140, desc:"Roma's premier accommodation with pool, restaurant, and outback hospitality" },
    { name:"Roma Explorers Inn — Deluxe Room", type:"Roma Explorers Inn", ppn:180, desc:"Roma's premier accommodation with pool, restaurant, and outback hospitality" },
    { name:"Roma Explorers Inn — Family Suite", type:"Roma Explorers Inn", ppn:240, desc:"Roma's premier accommodation with pool, restaurant, and outback hospitality" },
    { name:"Roma Central Motel — Standard Room", type:"Roma Central Motel", ppn:120, desc:"Central Roma motel with well-appointed rooms and easy access to town" },
    { name:"Roma Central Motel — Queen Room", type:"Roma Central Motel", ppn:150, desc:"Central Roma motel with well-appointed rooms and easy access to town" },
    { name:"Roma Central Motel — Family Room", type:"Roma Central Motel", ppn:190, desc:"Central Roma motel with well-appointed rooms and easy access to town" },
    { name:"Overlander Hotel Motel — Standard Room", type:"Overlander Hotel Motel", ppn:130, desc:"Classic outback pub accommodation with character and country hospitality" },
    { name:"Overlander Hotel Motel — Deluxe Room", type:"Overlander Hotel Motel", ppn:170, desc:"Classic outback pub accommodation with character and country hospitality" },
    { name:"Roma Big Rig Tourist Park — Cabin — Standard Cabin", type:"Big Rig Tourist Park Roma", ppn:100, desc:"Cabins adjacent to the Big Rig Night Show attraction with pool and camp kitchen" },
    { name:"Roma Big Rig Tourist Park — Cabin — Deluxe Cabin", type:"Big Rig Tourist Park Roma", ppn:150, desc:"Cabins adjacent to the Big Rig Night Show attraction with pool and camp kitchen" },
    { name:"StarLodge Motor Inn — Standard Room", type:"StarLodge Motor Inn", ppn:120, desc:"Comfortable accommodation in Roma with modern amenities and quiet setting" },
    { name:"StarLodge Motor Inn — Queen Room", type:"StarLodge Motor Inn", ppn:150, desc:"Comfortable accommodation in Roma with modern amenities and quiet setting" },
  ],
  "Mitchell & Charleville": [
    { name:"Hotel Corones — Heritage Room", type:"Hotel Corones", ppn:160, desc:"Iconic 1920s heritage hotel with the famous grand staircase — a must-stay outback experience" },
    { name:"Hotel Corones — Heritage Suite", type:"Hotel Corones", ppn:220, desc:"Iconic 1920s heritage hotel with the famous grand staircase — a must-stay outback experience" },
    { name:"Hotel Corones — Corones Suite", type:"Hotel Corones", ppn:300, desc:"Iconic 1920s heritage hotel with the famous grand staircase — a must-stay outback experience" },
    { name:"Mulga Country Motor Inn — Standard Room", type:"Mulga Country Motor Inn", ppn:130, desc:"Modern motor inn with pool and restaurant in the heart of Charleville" },
    { name:"Mulga Country Motor Inn — Deluxe Room", type:"Mulga Country Motor Inn", ppn:170, desc:"Modern motor inn with pool and restaurant in the heart of Charleville" },
    { name:"Charleville Motel — Standard Room", type:"Charleville Motel", ppn:110, desc:"Comfortable motel accommodation in central Charleville" },
    { name:"Charleville Motel — Queen Room", type:"Charleville Motel", ppn:140, desc:"Comfortable motel accommodation in central Charleville" },
    { name:"Evening Star Tourist Park — Cabin — Standard Cabin", type:"Evening Star Charleville", ppn:100, desc:"Cabins near the Charleville Cosmos Centre with peaceful outback setting" },
    { name:"Evening Star Tourist Park — Cabin — Deluxe Cabin", type:"Evening Star Charleville", ppn:140, desc:"Cabins near the Charleville Cosmos Centre with peaceful outback setting" },
    { name:"Warrego Motel — Standard Room", type:"Warrego Motel", ppn:120, desc:"Comfortable outback motel in central Charleville with pool and parking" },
    { name:"Warrego Motel — Deluxe Room", type:"Warrego Motel", ppn:150, desc:"Comfortable outback motel in central Charleville with pool and parking" },
  ],
  "Blackall": [
    { name:"Acacia Motor Inn — Standard Room", type:"Acacia Motor Inn", ppn:130, desc:"Blackall's premier accommodation with pool, restaurant, and genuine outback welcome" },
    { name:"Acacia Motor Inn — Deluxe Room", type:"Acacia Motor Inn", ppn:170, desc:"Blackall's premier accommodation with pool, restaurant, and genuine outback welcome" },
    { name:"Acacia Motor Inn — Family Room", type:"Acacia Motor Inn", ppn:200, desc:"Blackall's premier accommodation with pool, restaurant, and genuine outback welcome" },
    { name:"Blackall Motor Inn — Standard Room", type:"Blackall Motor Inn", ppn:110, desc:"Comfortable motor inn in central Blackall with well-appointed rooms" },
    { name:"Blackall Motor Inn — Queen Room", type:"Blackall Motor Inn", ppn:140, desc:"Comfortable motor inn in central Blackall with well-appointed rooms" },
    { name:"Barcoo River Hotel — Pub Room", type:"Barcoo River Hotel", ppn:90, desc:"Classic outback pub with character rooms on the banks of the Barcoo River" },
    { name:"Barcoo River Hotel — Deluxe Room", type:"Barcoo River Hotel", ppn:130, desc:"Classic outback pub with character rooms on the banks of the Barcoo River" },
    { name:"Blackall Woolscour Cabins — Cabin", type:"Blackall Woolscour Cabins", ppn:120, desc:"Heritage cabins adjacent to the historic Blackall Woolscour — Australia's last steam-driven woolscour" },
    { name:"Blackall Woolscour Cabins — Deluxe Cabin", type:"Blackall Woolscour Cabins", ppn:160, desc:"Heritage cabins adjacent to the historic Blackall Woolscour — Australia's last steam-driven woolscour" },
    { name:"All Seasons Outback Blackall — Standard Room", type:"All Seasons Outback Blackall", ppn:120, desc:"Modern motel accommodation with consistent quality in central Blackall" },
    { name:"All Seasons Outback Blackall — Queen Room", type:"All Seasons Outback Blackall", ppn:150, desc:"Modern motel accommodation with consistent quality in central Blackall" },
  ],
  "Longreach": [
    { name:"Mitchell Grass Retreat — Luxury Tent", type:"Mitchell Grass Retreat", ppn:250, desc:"Luxury glamping under outback skies with elevated safari tents and gourmet dining" },
    { name:"Mitchell Grass Retreat — Premium Tent", type:"Mitchell Grass Retreat", ppn:350, desc:"Luxury glamping under outback skies with elevated safari tents and gourmet dining" },
    { name:"Mitchell Grass Retreat — Homestead Suite", type:"Mitchell Grass Retreat", ppn:450, desc:"Luxury glamping under outback skies with elevated safari tents and gourmet dining" },
    { name:"Albert Park Motor Inn — Standard Room", type:"Albert Park Motor Inn", ppn:150, desc:"Central Longreach hotel with pool, restaurant, and walking distance to the Qantas Museum" },
    { name:"Albert Park Motor Inn — Deluxe Room", type:"Albert Park Motor Inn", ppn:200, desc:"Central Longreach hotel with pool, restaurant, and walking distance to the Qantas Museum" },
    { name:"Albert Park Motor Inn — Family Suite", type:"Albert Park Motor Inn", ppn:260, desc:"Central Longreach hotel with pool, restaurant, and walking distance to the Qantas Museum" },
    { name:"Longreach Motor Inn — Standard Room", type:"Longreach Motor Inn", ppn:130, desc:"Central Longreach motor inn with pool and restaurant, walking distance to attractions" },
    { name:"Longreach Motor Inn — Queen Room", type:"Longreach Motor Inn", ppn:170, desc:"Central Longreach motor inn with pool and restaurant, walking distance to attractions" },
    { name:"Longreach Motor Inn — Family Room", type:"Longreach Motor Inn", ppn:220, desc:"Central Longreach motor inn with pool and restaurant, walking distance to attractions" },
    { name:"Saltbush Retreat — Cabin", type:"Saltbush Retreat", ppn:180, desc:"Peaceful bush retreat on the outskirts of Longreach with native gardens and stargazing" },
    { name:"Saltbush Retreat — Luxury Cabin", type:"Saltbush Retreat", ppn:250, desc:"Peaceful bush retreat on the outskirts of Longreach with native gardens and stargazing" },
    { name:"Longreach Tourist Park — Cabin — Standard Cabin", type:"Longreach Tourist Park", ppn:100, desc:"Family-friendly park with pool and camp kitchen near central Longreach" },
    { name:"Longreach Tourist Park — Cabin — Deluxe Cabin", type:"Longreach Tourist Park", ppn:150, desc:"Family-friendly park with pool and camp kitchen near central Longreach" },
    { name:"Longreach Tourist Park — Cabin — Villa", type:"Longreach Tourist Park", ppn:200, desc:"Family-friendly park with pool and camp kitchen near central Longreach" },
  ],
  "Longreach (return)": [
    { name:"Mitchell Grass Retreat — Luxury Tent", type:"Mitchell Grass Retreat", ppn:250, desc:"Luxury glamping under outback skies with elevated safari tents and gourmet dining" },
    { name:"Mitchell Grass Retreat — Premium Tent", type:"Mitchell Grass Retreat", ppn:350, desc:"Luxury glamping under outback skies with elevated safari tents and gourmet dining" },
    { name:"Mitchell Grass Retreat — Homestead Suite", type:"Mitchell Grass Retreat", ppn:450, desc:"Luxury glamping under outback skies with elevated safari tents and gourmet dining" },
    { name:"Albert Park Motor Inn — Standard Room", type:"Albert Park Motor Inn", ppn:150, desc:"Central Longreach hotel with pool, restaurant, and walking distance to the Qantas Museum" },
    { name:"Albert Park Motor Inn — Deluxe Room", type:"Albert Park Motor Inn", ppn:200, desc:"Central Longreach hotel with pool, restaurant, and walking distance to the Qantas Museum" },
    { name:"Albert Park Motor Inn — Family Suite", type:"Albert Park Motor Inn", ppn:260, desc:"Central Longreach hotel with pool, restaurant, and walking distance to the Qantas Museum" },
    { name:"Longreach Motor Inn — Standard Room", type:"Longreach Motor Inn", ppn:130, desc:"Central Longreach motor inn with pool and restaurant, walking distance to attractions" },
    { name:"Longreach Motor Inn — Queen Room", type:"Longreach Motor Inn", ppn:170, desc:"Central Longreach motor inn with pool and restaurant, walking distance to attractions" },
    { name:"Longreach Motor Inn — Family Room", type:"Longreach Motor Inn", ppn:220, desc:"Central Longreach motor inn with pool and restaurant, walking distance to attractions" },
    { name:"Saltbush Retreat — Cabin", type:"Saltbush Retreat", ppn:180, desc:"Peaceful bush retreat on the outskirts of Longreach with native gardens and stargazing" },
    { name:"Saltbush Retreat — Luxury Cabin", type:"Saltbush Retreat", ppn:250, desc:"Peaceful bush retreat on the outskirts of Longreach with native gardens and stargazing" },
    { name:"Longreach Tourist Park — Cabin — Standard Cabin", type:"Longreach Tourist Park", ppn:100, desc:"Family-friendly park with pool and camp kitchen near central Longreach" },
    { name:"Longreach Tourist Park — Cabin — Deluxe Cabin", type:"Longreach Tourist Park", ppn:150, desc:"Family-friendly park with pool and camp kitchen near central Longreach" },
    { name:"Longreach Tourist Park — Cabin — Villa", type:"Longreach Tourist Park", ppn:200, desc:"Family-friendly park with pool and camp kitchen near central Longreach" },
  ],
  "Winton": [
    { name:"North Gregory Hotel — Heritage Room", type:"North Gregory Hotel", ppn:150, desc:"Where Waltzing Matilda was first performed — heritage outback pub with genuine character" },
    { name:"North Gregory Hotel — Deluxe Room", type:"North Gregory Hotel", ppn:200, desc:"Where Waltzing Matilda was first performed — heritage outback pub with genuine character" },
    { name:"North Gregory Hotel — Gregory Suite", type:"North Gregory Hotel", ppn:280, desc:"Where Waltzing Matilda was first performed — heritage outback pub with genuine character" },
    { name:"Boulder Opal Motor Inn — Standard Room", type:"Boulder Opal Motor Inn", ppn:130, desc:"Winton's premier motel with pool and comfortable rooms in the dinosaur capital" },
    { name:"Boulder Opal Motor Inn — Deluxe Room", type:"Boulder Opal Motor Inn", ppn:170, desc:"Winton's premier motel with pool and comfortable rooms in the dinosaur capital" },
    { name:"Boulder Opal Motor Inn — Family Suite", type:"Boulder Opal Motor Inn", ppn:220, desc:"Winton's premier motel with pool and comfortable rooms in the dinosaur capital" },
    { name:"Matilda Country Tourist Park — Cabin — Standard Cabin", type:"Matilda Country Winton", ppn:100, desc:"Family-friendly park in Winton with cabins and outback atmosphere" },
    { name:"Matilda Country Tourist Park — Cabin — Deluxe Cabin", type:"Matilda Country Winton", ppn:140, desc:"Family-friendly park in Winton with cabins and outback atmosphere" },
    { name:"Pelican Waters Caravan Park — Cabin — Cabin", type:"Pelican Waters Winton", ppn:90, desc:"Relaxed park accommodation with pool and shaded sites in central Winton" },
    { name:"Pelican Waters Caravan Park — Cabin — Deluxe Cabin", type:"Pelican Waters Winton", ppn:130, desc:"Relaxed park accommodation with pool and shaded sites in central Winton" },
    { name:"Winton Outback Motel — Standard Room", type:"Winton Outback Motel", ppn:110, desc:"Comfortable motel in central Winton close to the Australian Age of Dinosaurs" },
    { name:"Winton Outback Motel — Queen Room", type:"Winton Outback Motel", ppn:140, desc:"Comfortable motel in central Winton close to the Australian Age of Dinosaurs" },
  ],
  "Carnarvon Gorge": [
    { name:"Carnarvon Gorge Wilderness Lodge — Lodge Room", type:"Carnarvon Gorge Wilderness Lodge", ppn:350, desc:"Premium bush lodge at the gorge entrance with guided walks and gourmet dining included" },
    { name:"Carnarvon Gorge Wilderness Lodge — Deluxe Lodge", type:"Carnarvon Gorge Wilderness Lodge", ppn:420, desc:"Premium bush lodge at the gorge entrance with guided walks and gourmet dining included" },
    { name:"Carnarvon Gorge Wilderness Lodge — Premium Suite", type:"Carnarvon Gorge Wilderness Lodge", ppn:500, desc:"Premium bush lodge at the gorge entrance with guided walks and gourmet dining included" },
    { name:"Takarakka Bush Resort — Safari Tent", type:"Takarakka Bush Resort", ppn:150, desc:"Private riverside resort with safari tents, bush cabins, and abundant wildlife" },
    { name:"Takarakka Bush Resort — Bush Cabin", type:"Takarakka Bush Resort", ppn:200, desc:"Private riverside resort with safari tents, bush cabins, and abundant wildlife" },
    { name:"Takarakka Bush Resort — Riverside Cabin", type:"Takarakka Bush Resort", ppn:280, desc:"Private riverside resort with safari tents, bush cabins, and abundant wildlife" },
    { name:"Breeze Holiday Parks — Cabin — Standard Cabin", type:"Breeze Holiday Parks", ppn:140, desc:"Year-round holiday park at Carnarvon Gorge with camp kitchen and legendary bush bar" },
    { name:"Breeze Holiday Parks — Cabin — Deluxe Cabin", type:"Breeze Holiday Parks", ppn:200, desc:"Year-round holiday park at Carnarvon Gorge with camp kitchen and legendary bush bar" },
    { name:"Breeze Holiday Parks — Cabin — Family Villa", type:"Breeze Holiday Parks", ppn:280, desc:"Year-round holiday park at Carnarvon Gorge with camp kitchen and legendary bush bar" },
    { name:"Carnarvon Gorge Discovery Park — Cabin", type:"Carnarvon Gorge Discovery Park", ppn:130, desc:"Comfortable cabin accommodation with easy access to gorge walking trails" },
    { name:"Carnarvon Gorge Discovery Park — Deluxe Cabin", type:"Carnarvon Gorge Discovery Park", ppn:180, desc:"Comfortable cabin accommodation with easy access to gorge walking trails" },
    { name:"Sandstone Park Carnarvon Gorge — Safari Tent", type:"Sandstone Park Carnarvon Gorge", ppn:120, desc:"Intimate eco-retreat with safari tents and cabins in a private bush setting" },
    { name:"Sandstone Park Carnarvon Gorge — Eco Cabin", type:"Sandstone Park Carnarvon Gorge", ppn:180, desc:"Intimate eco-retreat with safari tents and cabins in a private bush setting" },
  ],
  "Emerald & Gemfields": [
    { name:"Emerald Maraboon Motor Inn — Standard Room", type:"Emerald Maraboon Motor Inn", ppn:140, desc:"Emerald's premier motel with pool and central location in the gemfields region" },
    { name:"Emerald Maraboon Motor Inn — Deluxe Room", type:"Emerald Maraboon Motor Inn", ppn:180, desc:"Emerald's premier motel with pool and central location in the gemfields region" },
    { name:"Emerald Maraboon Motor Inn — Suite", type:"Emerald Maraboon Motor Inn", ppn:250, desc:"Emerald's premier motel with pool and central location in the gemfields region" },
    { name:"Quest Emerald — Studio", type:"Quest Emerald", ppn:170, desc:"Modern self-contained apartments in central Emerald with contemporary fitout" },
    { name:"Quest Emerald — 1-Bed Apartment", type:"Quest Emerald", ppn:220, desc:"Modern self-contained apartments in central Emerald with contemporary fitout" },
    { name:"Quest Emerald — 2-Bed Apartment", type:"Quest Emerald", ppn:300, desc:"Modern self-contained apartments in central Emerald with contemporary fitout" },
    { name:"Emerald Star Hotel — Standard Room", type:"Emerald Star Hotel", ppn:120, desc:"Heritage pub in central Emerald with character rooms and local dining" },
    { name:"Emerald Star Hotel — Deluxe Room", type:"Emerald Star Hotel", ppn:160, desc:"Heritage pub in central Emerald with character rooms and local dining" },
    { name:"Rubyvale Gem Gallery — Accommodation — Fossicker's Cabin", type:"Rubyvale Gem Gallery", ppn:130, desc:"Character cabins at the fossicking fields — dig for sapphires right at your doorstep" },
    { name:"Rubyvale Gem Gallery — Accommodation — Gem Cabin", type:"Rubyvale Gem Gallery", ppn:170, desc:"Character cabins at the fossicking fields — dig for sapphires right at your doorstep" },
    { name:"Sapphire Retreat — Studio Cabin", type:"Sapphire Retreat", ppn:140, desc:"Peaceful retreat near Rubyvale surrounded by natural bushland and gemfield country" },
    { name:"Sapphire Retreat — Family Cabin", type:"Sapphire Retreat", ppn:200, desc:"Peaceful retreat near Rubyvale surrounded by natural bushland and gemfield country" },
  ],
  "Rubyvale & Gemfields": [
    { name:"Emerald Maraboon Motor Inn — Standard Room", type:"Emerald Maraboon Motor Inn", ppn:140, desc:"Emerald's premier motel with pool and central location in the gemfields region" },
    { name:"Emerald Maraboon Motor Inn — Deluxe Room", type:"Emerald Maraboon Motor Inn", ppn:180, desc:"Emerald's premier motel with pool and central location in the gemfields region" },
    { name:"Emerald Maraboon Motor Inn — Suite", type:"Emerald Maraboon Motor Inn", ppn:250, desc:"Emerald's premier motel with pool and central location in the gemfields region" },
    { name:"Quest Emerald — Studio", type:"Quest Emerald", ppn:170, desc:"Modern self-contained apartments in central Emerald with contemporary fitout" },
    { name:"Quest Emerald — 1-Bed Apartment", type:"Quest Emerald", ppn:220, desc:"Modern self-contained apartments in central Emerald with contemporary fitout" },
    { name:"Quest Emerald — 2-Bed Apartment", type:"Quest Emerald", ppn:300, desc:"Modern self-contained apartments in central Emerald with contemporary fitout" },
    { name:"Emerald Star Hotel — Standard Room", type:"Emerald Star Hotel", ppn:120, desc:"Heritage pub in central Emerald with character rooms and local dining" },
    { name:"Emerald Star Hotel — Deluxe Room", type:"Emerald Star Hotel", ppn:160, desc:"Heritage pub in central Emerald with character rooms and local dining" },
    { name:"Rubyvale Gem Gallery — Accommodation — Fossicker's Cabin", type:"Rubyvale Gem Gallery", ppn:130, desc:"Character cabins at the fossicking fields — dig for sapphires right at your doorstep" },
    { name:"Rubyvale Gem Gallery — Accommodation — Gem Cabin", type:"Rubyvale Gem Gallery", ppn:170, desc:"Character cabins at the fossicking fields — dig for sapphires right at your doorstep" },
    { name:"Sapphire Retreat — Studio Cabin", type:"Sapphire Retreat", ppn:140, desc:"Peaceful retreat near Rubyvale surrounded by natural bushland and gemfield country" },
    { name:"Sapphire Retreat — Family Cabin", type:"Sapphire Retreat", ppn:200, desc:"Peaceful retreat near Rubyvale surrounded by natural bushland and gemfield country" },
  ],
  "Rockhampton": [
    { name:"Empire Apartment Hotel — Studio", type:"Empire Apartment Hotel", ppn:180, desc:"Heritage-listed building with contemporary apartments — Rockhampton's standout property" },
    { name:"Empire Apartment Hotel — 1-Bed Apartment", type:"Empire Apartment Hotel", ppn:250, desc:"Heritage-listed building with contemporary apartments — Rockhampton's standout property" },
    { name:"Empire Apartment Hotel — 2-Bed Apartment", type:"Empire Apartment Hotel", ppn:350, desc:"Heritage-listed building with contemporary apartments — Rockhampton's standout property" },
    { name:"Quest Rockhampton — Studio", type:"Quest Rockhampton", ppn:170, desc:"Modern self-contained apartments in the CBD with contemporary design" },
    { name:"Quest Rockhampton — 1-Bed Apartment", type:"Quest Rockhampton", ppn:230, desc:"Modern self-contained apartments in the CBD with contemporary design" },
    { name:"Quest Rockhampton — 2-Bed Apartment", type:"Quest Rockhampton", ppn:300, desc:"Modern self-contained apartments in the CBD with contemporary design" },
    { name:"Travelodge Rockhampton — Standard Room", type:"Travelodge Rockhampton", ppn:140, desc:"Central hotel with pool and river proximity in the heart of Rocky" },
    { name:"Travelodge Rockhampton — Deluxe Room", type:"Travelodge Rockhampton", ppn:180, desc:"Central hotel with pool and river proximity in the heart of Rocky" },
    { name:"Travelodge Rockhampton — Suite", type:"Travelodge Rockhampton", ppn:250, desc:"Central hotel with pool and river proximity in the heart of Rocky" },
    { name:"Mercure Rockhampton — Standard Room", type:"Mercure Rockhampton", ppn:150, desc:"Riverfront hotel with restaurant and views over the Fitzroy River" },
    { name:"Mercure Rockhampton — Superior Room", type:"Mercure Rockhampton", ppn:200, desc:"Riverfront hotel with restaurant and views over the Fitzroy River" },
    { name:"Mercure Rockhampton — Suite", type:"Mercure Rockhampton", ppn:280, desc:"Riverfront hotel with restaurant and views over the Fitzroy River" },
    { name:"Heritage Hotel Rockhampton — Heritage Room", type:"Heritage Hotel Rockhampton", ppn:130, desc:"Heritage character hotel in central Rockhampton with period features and charm" },
    { name:"Heritage Hotel Rockhampton — Deluxe Room", type:"Heritage Hotel Rockhampton", ppn:170, desc:"Heritage character hotel in central Rockhampton with period features and charm" },
    { name:"Heritage Hotel Rockhampton — Suite", type:"Heritage Hotel Rockhampton", ppn:230, desc:"Heritage character hotel in central Rockhampton with period features and charm" },
  ],
  "Byron Bay": [
    { name:"Crystalbrook Byron — Byron Room", type:"Crystalbrook Byron", ppn:350, desc:"Luxury rainforest retreat in the Byron hinterland with spa, restaurant, and sustainable design" },
    { name:"Crystalbrook Byron — Retreat Room", type:"Crystalbrook Byron", ppn:450, desc:"Luxury rainforest retreat in the Byron hinterland with spa, restaurant, and sustainable design" },
    { name:"Crystalbrook Byron — Suite", type:"Crystalbrook Byron", ppn:550, desc:"Luxury rainforest retreat in the Byron hinterland with spa, restaurant, and sustainable design" },
    { name:"Elements of Byron — Garden Villa", type:"Elements of Byron", ppn:450, desc:"Resort-style luxury with private villas, lagoon pool, and direct beach access" },
    { name:"Elements of Byron — Beach Villa", type:"Elements of Byron", ppn:550, desc:"Resort-style luxury with private villas, lagoon pool, and direct beach access" },
    { name:"Elements of Byron — Luxury Pool Villa", type:"Elements of Byron", ppn:750, desc:"Resort-style luxury with private villas, lagoon pool, and direct beach access" },
    { name:"The Byron at Byron — Rainforest Room", type:"The Byron at Byron", ppn:400, desc:"Crystalbrook luxury resort set in 18 hectares of subtropical rainforest with spa and fine dining" },
    { name:"The Byron at Byron — Deluxe Suite", type:"The Byron at Byron", ppn:550, desc:"Crystalbrook luxury resort set in 18 hectares of subtropical rainforest with spa and fine dining" },
    { name:"The Byron at Byron — Byron Suite", type:"The Byron at Byron", ppn:800, desc:"Crystalbrook luxury resort set in 18 hectares of subtropical rainforest with spa and fine dining" },
    { name:"Rae's on Wategos — Standard Room", type:"Rae's on Wategos", ppn:400, desc:"Iconic boutique hotel on Wategos Beach — one of Australia's most celebrated coastal stays" },
    { name:"Rae's on Wategos — Ocean View Room", type:"Rae's on Wategos", ppn:500, desc:"Iconic boutique hotel on Wategos Beach — one of Australia's most celebrated coastal stays" },
    { name:"Rae's on Wategos — Suite", type:"Rae's on Wategos", ppn:550, desc:"Iconic boutique hotel on Wategos Beach — one of Australia's most celebrated coastal stays" },
    { name:"Atlantic Byron Bay — Hotel Room", type:"Atlantic Byron Bay", ppn:280, desc:"Central Byron hotel with rooftop pool, bar, and walk to everything" },
    { name:"Atlantic Byron Bay — Pool Room", type:"Atlantic Byron Bay", ppn:350, desc:"Central Byron hotel with rooftop pool, bar, and walk to everything" },
    { name:"Atlantic Byron Bay — Suite", type:"Atlantic Byron Bay", ppn:450, desc:"Central Byron hotel with rooftop pool, bar, and walk to everything" },
  ],
  "Ballina & Air Force Beach": [
    { name:"Ramada Hotel & Suites Ballina — Standard Room", type:"Ramada Hotel & Suites Ballina", ppn:200, desc:"Waterfront hotel overlooking the Richmond River with pool and restaurant" },
    { name:"Ramada Hotel & Suites Ballina — Deluxe Room", type:"Ramada Hotel & Suites Ballina", ppn:260, desc:"Waterfront hotel overlooking the Richmond River with pool and restaurant" },
    { name:"Ramada Hotel & Suites Ballina — Suite", type:"Ramada Hotel & Suites Ballina", ppn:350, desc:"Waterfront hotel overlooking the Richmond River with pool and restaurant" },
    { name:"Ballina Motel — Standard Room", type:"Ballina Motel", ppn:140, desc:"Well-appointed motel in central Ballina with easy access to beaches and restaurants" },
    { name:"Ballina Motel — Deluxe Room", type:"Ballina Motel", ppn:180, desc:"Well-appointed motel in central Ballina with easy access to beaches and restaurants" },
    { name:"Richmond River Motel — Standard Room", type:"Richmond River Motel", ppn:130, desc:"Peaceful riverfront accommodation overlooking the Richmond River in Ballina" },
    { name:"Richmond River Motel — Deluxe Room", type:"Richmond River Motel", ppn:170, desc:"Peaceful riverfront accommodation overlooking the Richmond River in Ballina" },
    { name:"The Henry Rous Tavern — Rooms — Pub Room", type:"The Henry Rous Tavern", ppn:120, desc:"Heritage pub accommodation with character and Northern Rivers charm" },
    { name:"The Henry Rous Tavern — Rooms — Deluxe Room", type:"The Henry Rous Tavern", ppn:160, desc:"Heritage pub accommodation with character and Northern Rivers charm" },
    { name:"Flat Rock Tent Park — Cabin — Cabin", type:"Flat Rock Evans Head", ppn:120, desc:"Beachfront cabins at Evans Head with direct beach access and coastal walks" },
    { name:"Flat Rock Tent Park — Cabin — Deluxe Cabin", type:"Flat Rock Evans Head", ppn:160, desc:"Beachfront cabins at Evans Head with direct beach access and coastal walks" },
    { name:"Flat Rock Tent Park — Cabin — Beachfront Cabin", type:"Flat Rock Evans Head", ppn:200, desc:"Beachfront cabins at Evans Head with direct beach access and coastal walks" },
  ],
  "Yamba": [
    { name:"Angourie Rainforest Resort — Rainforest Room", type:"Angourie Rainforest Resort", ppn:220, desc:"Secluded spa resort near the Angourie blue and green pools with rainforest setting" },
    { name:"Angourie Rainforest Resort — Suite", type:"Angourie Rainforest Resort", ppn:300, desc:"Secluded spa resort near the Angourie blue and green pools with rainforest setting" },
    { name:"Angourie Rainforest Resort — Villa", type:"Angourie Rainforest Resort", ppn:400, desc:"Secluded spa resort near the Angourie blue and green pools with rainforest setting" },
    { name:"Pacific Hotel Yamba — Heritage Room", type:"Pacific Hotel Yamba", ppn:180, desc:"Iconic headland pub with heritage rooms and the best sunset deck on the NSW coast" },
    { name:"Pacific Hotel Yamba — Ocean View Room", type:"Pacific Hotel Yamba", ppn:250, desc:"Iconic headland pub with heritage rooms and the best sunset deck on the NSW coast" },
    { name:"Pacific Hotel Yamba — Premium Ocean", type:"Pacific Hotel Yamba", ppn:320, desc:"Iconic headland pub with heritage rooms and the best sunset deck on the NSW coast" },
    { name:"The Cove Yamba — 1-Bed Apartment", type:"The Cove Yamba", ppn:250, desc:"Contemporary waterfront apartments with river views and modern coastal design" },
    { name:"The Cove Yamba — 2-Bed Apartment", type:"The Cove Yamba", ppn:350, desc:"Contemporary waterfront apartments with river views and modern coastal design" },
    { name:"The Cove Yamba — Penthouse", type:"The Cove Yamba", ppn:450, desc:"Contemporary waterfront apartments with river views and modern coastal design" },
    { name:"Calypso Holiday Park — Villa — Standard Villa", type:"Calypso Yamba Resort", ppn:160, desc:"Family resort with pool, water park, and private villas in tropical gardens" },
    { name:"Calypso Holiday Park — Villa — Deluxe Villa", type:"Calypso Yamba Resort", ppn:220, desc:"Family resort with pool, water park, and private villas in tropical gardens" },
    { name:"Calypso Holiday Park — Villa — Premium Villa", type:"Calypso Yamba Resort", ppn:300, desc:"Family resort with pool, water park, and private villas in tropical gardens" },
    { name:"Yamba Shores Tavern — Rooms — Standard Room", type:"Yamba Shores Tavern", ppn:140, desc:"Central pub accommodation in the heart of Yamba's dining and shopping precinct" },
    { name:"Yamba Shores Tavern — Rooms — Deluxe Room", type:"Yamba Shores Tavern", ppn:180, desc:"Central pub accommodation in the heart of Yamba's dining and shopping precinct" },
  ],
  "Newcastle": [
    { name:"QT Newcastle — QT Room", type:"QT Newcastle", ppn:250, desc:"Boutique designer hotel in the Honeysuckle precinct with signature QT style and rooftop bar" },
    { name:"QT Newcastle — QT King", type:"QT Newcastle", ppn:320, desc:"Boutique designer hotel in the Honeysuckle precinct with signature QT style and rooftop bar" },
    { name:"QT Newcastle — QT Suite", type:"QT Newcastle", ppn:450, desc:"Boutique designer hotel in the Honeysuckle precinct with signature QT style and rooftop bar" },
    { name:"Rydges Newcastle — Standard Room", type:"Rydges Newcastle", ppn:200, desc:"Central harbour-view hotel with rooftop pool and city dining at your doorstep" },
    { name:"Rydges Newcastle — City View Room", type:"Rydges Newcastle", ppn:260, desc:"Central harbour-view hotel with rooftop pool and city dining at your doorstep" },
    { name:"Rydges Newcastle — Suite", type:"Rydges Newcastle", ppn:380, desc:"Central harbour-view hotel with rooftop pool and city dining at your doorstep" },
    { name:"Crystalbrook Kingsley — Urban Room", type:"Crystalbrook Kingsley", ppn:220, desc:"Heritage-listed building transformed into a luxury waterfront hotel with harbour views" },
    { name:"Crystalbrook Kingsley — Harbour Room", type:"Crystalbrook Kingsley", ppn:300, desc:"Heritage-listed building transformed into a luxury waterfront hotel with harbour views" },
    { name:"Crystalbrook Kingsley — Suite", type:"Crystalbrook Kingsley", ppn:420, desc:"Heritage-listed building transformed into a luxury waterfront hotel with harbour views" },
    { name:"Novotel Newcastle Beach — Standard Room", type:"Novotel Newcastle Beach", ppn:200, desc:"Beachfront hotel on Newcastle Beach with ocean views and modern amenities" },
    { name:"Novotel Newcastle Beach — Ocean View Room", type:"Novotel Newcastle Beach", ppn:280, desc:"Beachfront hotel on Newcastle Beach with ocean views and modern amenities" },
    { name:"Novotel Newcastle Beach — Suite", type:"Novotel Newcastle Beach", ppn:380, desc:"Beachfront hotel on Newcastle Beach with ocean views and modern amenities" },
    { name:"The Lucky Hotel — Boutique Room", type:"The Lucky Hotel", ppn:180, desc:"Heritage boutique pub with character rooms and one of Newcastle's best rooftop bars" },
    { name:"The Lucky Hotel — Deluxe Room", type:"The Lucky Hotel", ppn:240, desc:"Heritage boutique pub with character rooms and one of Newcastle's best rooftop bars" },
  ],
  "Stockton Beach & Port Stephens": [
    { name:"Bannisters Port Stephens — Retreat Room", type:"Bannisters Port Stephens", ppn:300, desc:"Waterfront luxury with Rick Stein restaurant, infinity pool, and marina views" },
    { name:"Bannisters Port Stephens — Marina Room", type:"Bannisters Port Stephens", ppn:400, desc:"Waterfront luxury with Rick Stein restaurant, infinity pool, and marina views" },
    { name:"Bannisters Port Stephens — Penthouse", type:"Bannisters Port Stephens", ppn:550, desc:"Waterfront luxury with Rick Stein restaurant, infinity pool, and marina views" },
    { name:"Anchorage Port Stephens — Pool View Room", type:"Anchorage Port Stephens", ppn:250, desc:"Marina resort with spa, pool, and water views in the heart of Nelson Bay" },
    { name:"Anchorage Port Stephens — Marina View Room", type:"Anchorage Port Stephens", ppn:320, desc:"Marina resort with spa, pool, and water views in the heart of Nelson Bay" },
    { name:"Anchorage Port Stephens — Suite", type:"Anchorage Port Stephens", ppn:420, desc:"Marina resort with spa, pool, and water views in the heart of Nelson Bay" },
    { name:"Oaks Pacific Blue Resort — 1-Bed Apartment", type:"Oaks Pacific Blue Resort", ppn:200, desc:"Resort-style living with golf course, multiple pools, and family amenities" },
    { name:"Oaks Pacific Blue Resort — 2-Bed Apartment", type:"Oaks Pacific Blue Resort", ppn:300, desc:"Resort-style living with golf course, multiple pools, and family amenities" },
    { name:"Oaks Pacific Blue Resort — 3-Bed Apartment", type:"Oaks Pacific Blue Resort", ppn:400, desc:"Resort-style living with golf course, multiple pools, and family amenities" },
    { name:"Soldiers Point Marina — Marina Room", type:"Soldiers Point Marina", ppn:220, desc:"Quiet waterfront accommodation on the peaceful side of Port Stephens" },
    { name:"Soldiers Point Marina — Deluxe Marina", type:"Soldiers Point Marina", ppn:300, desc:"Quiet waterfront accommodation on the peaceful side of Port Stephens" },
    { name:"Shoal Bay Resort & Spa — Garden Room", type:"Shoal Bay Resort & Spa", ppn:180, desc:"Beachfront resort on Shoal Bay with spa, pool, and sweeping coastal views" },
    { name:"Shoal Bay Resort & Spa — Ocean View Room", type:"Shoal Bay Resort & Spa", ppn:250, desc:"Beachfront resort on Shoal Bay with spa, pool, and sweeping coastal views" },
    { name:"Shoal Bay Resort & Spa — Suite", type:"Shoal Bay Resort & Spa", ppn:350, desc:"Beachfront resort on Shoal Bay with spa, pool, and sweeping coastal views" },
  ],
  "Hunter Valley": [
    { name:"Spicers Vineyards Estate — Estate Room", type:"Spicers Vineyards Estate", ppn:380, desc:"Vineyard luxury retreat with hatted restaurant, cellar door, and Brokenback Range views" },
    { name:"Spicers Vineyards Estate — Luxury Room", type:"Spicers Vineyards Estate", ppn:450, desc:"Vineyard luxury retreat with hatted restaurant, cellar door, and Brokenback Range views" },
    { name:"Spicers Vineyards Estate — Suite", type:"Spicers Vineyards Estate", ppn:550, desc:"Vineyard luxury retreat with hatted restaurant, cellar door, and Brokenback Range views" },
    { name:"Château Élan — Classic Room", type:"Château Élan", ppn:350, desc:"Resort, spa, and golf club set among Hunter Valley vineyards with fine dining" },
    { name:"Château Élan — Deluxe Room", type:"Château Élan", ppn:450, desc:"Resort, spa, and golf club set among Hunter Valley vineyards with fine dining" },
    { name:"Château Élan — Vintage Suite", type:"Château Élan", ppn:600, desc:"Resort, spa, and golf club set among Hunter Valley vineyards with fine dining" },
    { name:"Crowne Plaza Hunter Valley — Standard Room", type:"Crowne Plaza Hunter Valley", ppn:220, desc:"Central Hunter Valley resort with pool, vineyard views, and wine region access" },
    { name:"Crowne Plaza Hunter Valley — Vineyard View", type:"Crowne Plaza Hunter Valley", ppn:300, desc:"Central Hunter Valley resort with pool, vineyard views, and wine region access" },
    { name:"Crowne Plaza Hunter Valley — Suite", type:"Crowne Plaza Hunter Valley", ppn:400, desc:"Central Hunter Valley resort with pool, vineyard views, and wine region access" },
    { name:"Kirkton Park Hotel — Heritage Room", type:"Kirkton Park Hotel", ppn:200, desc:"Heritage estate with manicured gardens and elegant rooms in the Hunter Valley" },
    { name:"Kirkton Park Hotel — Garden Room", type:"Kirkton Park Hotel", ppn:280, desc:"Heritage estate with manicured gardens and elegant rooms in the Hunter Valley" },
    { name:"Kirkton Park Hotel — Suite", type:"Kirkton Park Hotel", ppn:380, desc:"Heritage estate with manicured gardens and elegant rooms in the Hunter Valley" },
    { name:"Mercure Resort Hunter Valley — Standard Room", type:"Mercure Resort Hunter Valley", ppn:180, desc:"Family-friendly resort with golf course, pool, and vineyard surroundings" },
    { name:"Mercure Resort Hunter Valley — Superior Room", type:"Mercure Resort Hunter Valley", ppn:240, desc:"Family-friendly resort with golf course, pool, and vineyard surroundings" },
    { name:"Mercure Resort Hunter Valley — Suite", type:"Mercure Resort Hunter Valley", ppn:320, desc:"Family-friendly resort with golf course, pool, and vineyard surroundings" },
  ],
};


const PACKAGES = {
  kgari: { name:"K'gari Experience", days:5, db:300, stops:["Rainbow Beach & Inskip","Southern K'gari","75 Mile Beach","Northern K'gari","Hervey Bay (optional)"] },
  "tropical-north": { name:"Tropical North", days:7, db:1050, stops:["Cairns","Port Douglas & Mossman Gorge","Daintree Rainforest","Cape Tribulation","Atherton Tablelands","Cairns (return)"] },
  "coastal-explorer": { name:"Coastal Explorer", days:21, db:2900, stops:["Rainbow Beach & Inskip","Southern K'gari","Bundaberg & 1770","Yeppoon & Capricorn Coast","Cape Hillsborough","Airlie Beach & Whitsundays","Townsville & Magnetic Island","Mission Beach","Cairns"] },
  outback: { name:"Outback Queensland", days:21, db:2100, stops:["Toowoomba","Roma","Mitchell & Charleville","Blackall","Longreach","Winton","Carnarvon Gorge","Emerald & Gemfields","Rockhampton","Agnes Water & Bundaberg"] },
  whitsundays: { name:"Whitsundays", days:7, db:950, stops:["Airlie Beach","Cape Hillsborough","Mackay"] },
  "outback-taster": { name:"Outback Taster", days:7, db:800, stops:["Longreach","Winton","Longreach (return)"] },
  "capricorn-coast": { name:"Capricorn Coast", days:7, db:900, stops:["Yeppoon","1770 & Agnes Water","Rockhampton"] },
  "carnarvon-gorge": { name:"Carnarvon Gorge", days:7, db:250, stops:["Rubyvale & Gemfields","Carnarvon Gorge","Blackall"] },
  "byron-bay": { name:"Byron Bay", days:5, db:900, stops:["Byron Bay","Ballina & Air Force Beach","Yamba"] },
  "stockton-beach": { name:"Stockton Beach", days:7, db:1100, stops:["Newcastle","Stockton Beach & Port Stephens","Hunter Valley"] },
  custom: { name:"Custom Journey", days:7, db:0, stops:[] },
};

const RATE=1500, BOND=7500, ACCOM_CAP=450;
const GUESTS=["1 adult","2 adults (couple)","3 adults","4 adults","1 adult + 1 child","1 adult + 2 children","1 adult + 3 children","2 adults + 1 child","2 adults + 2 children","2 adults + 3 children"];

const visaCalc = b => {
  const touringNights = b.stops.filter(s=>s.mode==="touring").reduce((a,s)=>a+s.nights,0);
  const autoFuel = 1000;
  const autoDining = touringNights * 200;
  if (b.visaFuelOverride !== undefined || b.visaDiningOverride !== undefined) {
    const fuel = b.visaFuelOverride ?? autoFuel;
    const dining = b.visaDiningOverride ?? autoDining;
    return { fuel, dining, total: fuel + dining };
  }
  return { fuel:autoFuel, dining:autoDining, total:autoFuel+autoDining };
};

const accomSupCalc = b => {
  return b.stops.reduce((total, s) => {
    if (s.selectedAccom && s.accomOptions) {
      const opt = s.accomOptions.find(o => o.name === s.selectedAccom);
      if (opt && opt.ppn > ACCOM_CAP) {
        total += (opt.ppn - ACCOM_CAP) * s.nights;
      }
    }
    return total;
  }, 0);
};

/* STYLES */
const sf="'Cormorant Garamond','Georgia',serif";
const sn="'Figtree','Helvetica Neue',sans-serif";
const gd="#C4A265",tl="#0A6B7A",tr="#A04209",dk="#1A1714",md="#57534E",lt="#A8A29E",sd="#F5F0E8",wh="#FFFDF8",bd="#E7E5E4";
const fonts=`@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,400&family=Figtree:wght@300;400;500;600;700&display=swap');*{margin:0;padding:0;box-sizing:border-box}body{background:${wh};font-family:${sn}}`;
const S={
  pg:{fontFamily:sn,background:wh,minHeight:"100vh",color:dk},
  hd:{padding:"20px 32px",borderBottom:`1px solid ${bd}`,display:"flex",justifyContent:"space-between",alignItems:"center",background:wh},
  logo:{fontFamily:sf,fontSize:20,fontWeight:500,color:dk,cursor:"pointer"},
  co:{fontFamily:sn,fontSize:9,fontWeight:700,letterSpacing:3,color:gd,marginLeft:6,textTransform:"uppercase"},
  bg:c=>({fontFamily:sn,fontSize:9,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",padding:"4px 10px",borderRadius:3,
    background:c==="enquiry"?"#FFF3E0":c==="draft"?sd:c==="sent"?`${tl}15`:c==="confirmed"?"#E8F5E9":sd,
    color:c==="enquiry"?"#E65100":c==="draft"?md:c==="sent"?tl:c==="confirmed"?"#2E7D32":md}),
  bt:{fontFamily:sn,fontSize:11,fontWeight:600,letterSpacing:2,textTransform:"uppercase",padding:"13px 28px",border:"none",borderRadius:4,cursor:"pointer",transition:"all .3s"},
  bp:{background:`linear-gradient(135deg,${tl},${tr})`,color:"#fff"},
  bh:{background:"transparent",border:`1px solid ${bd}`,color:md},
  bg2:{background:gd,color:"#fff"},
  ip:{width:"100%",padding:"13px 16px",border:`1px solid ${bd}`,borderRadius:4,fontFamily:sn,fontSize:14,color:dk,outline:"none",background:"#fff"},
  sl:{width:"100%",padding:"13px 16px",border:`1px solid ${bd}`,borderRadius:4,fontFamily:sn,fontSize:14,color:dk,outline:"none",background:"#fff",cursor:"pointer"},
  lb:{fontFamily:sn,fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:lt,marginBottom:6,display:"block"},
  cd:{background:"#fff",border:`1px solid ${bd}`,borderRadius:8,padding:"24px"},
  dv:{width:40,height:1,background:gd,margin:"12px 0"},
};

/* ════════════════════════════════════════════════════════════════
   MAIN APP
   ════════════════════════════════════════════════════════════════ */
export default function BookingApp() {
  const [view, setView] = useState("loading");
  const [bks, setBks] = useState([]);
  const [act, setAct] = useState(null);
  const [pw, setPw] = useState("");
  const [ae, setAe] = useState(false);
  const [sending, setSending] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  // On mount: check for guest booking ID in URL
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    const bid = p.get("booking");
    if (bid) {
      loadGuestBooking(bid);
    } else {
      setView("login");
    }
  }, []);

  // Load single booking for guest
  const loadGuestBooking = async (bid) => {
    try {
      const snap = await getDoc(doc(db, "bookings", bid));
      if (snap.exists()) {
        const data = { id: snap.id, ...snap.data() };
        // Auto-populate options for stops with mode set but no options loaded
        if (data.stops) {
          data.stops = data.stops.map(s => {
            if (s.mode && (!s.accomOptions || s.accomOptions.length === 0)) {
              const dbSource = PROPERTIES;
              return { ...s, accomOptions: (dbSource[s.name] || []).map(p => ({ ...p })) };
            }
            return s;
          });
        }
        setAct(data);
        setView("guest");
      } else {
        setView("login");
      }
    } catch (e) {
      console.error(e);
      setView("login");
    }
  };

  // Load all bookings for admin
  const loadAllBookings = async () => {
    setLoading(true);
    try {
      const snap = await getDocs(collection(db, "bookings"));
      const all = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      all.sort((a, b) => (b.createdAt || "").localeCompare(a.createdAt || ""));
      setBks(all);
    } catch (e) { console.error(e); }
    setLoading(false);
  };

  // Create new booking
  const createBk = async () => {
    const id = "SH-" + Date.now().toString(36).toUpperCase();
    const pk = PACKAGES.kgari;
    const nb = {
      status: "draft", createdAt: new Date().toISOString(),
      guestName: "", guestEmail: "", guestPhone: "", guestCount: "2 adults (couple)",
      packageId: "kgari", startDate: "", totalDays: pk.days,
      stops: pk.stops.map(s => ({ name: s, mode: "touring", nights: 1, accomOptions: [], selectedAccom: null })),
      supplements: 0, notes: "", dietary: "", specialNeeds: "", message: "",
    };
    await setDoc(doc(db, "bookings", id), nb);
    setAct({ id, ...nb });
    setView("edit");
  };

  // Update booking in Firestore
  const updBk = async (updated) => {
    const { id, ...data } = updated;
    await updateDoc(doc(db, "bookings", id), data);
    setAct(updated);
    // Update local list
    setBks(prev => prev.map(b => b.id === id ? updated : b));
  };

  // Delete booking
  const delBk = async (id) => {
    await deleteDoc(doc(db, "bookings", id));
    setBks(prev => prev.filter(b => b.id !== id));
    setView("dashboard");
  };

  /* ═══ GUEST VIEW ═══ */
  if (view === "guest" && act) {
    const b = act;
    const pk = PACKAGES[b.packageId] || { name: "Custom", days: b.totalDays, db: 0 };
    const v = visaCalc(b);
    const pomCostCalc = (b.bondOption||"none")==="assurance"?Math.min(38*b.totalDays,380):(b.bondOption||"none")==="complete"?Math.min(55*b.totalDays,550):0;
    const accomSup = accomSupCalc(b);
    const q = { days: b.totalDays, sub: b.totalDays * RATE, sup: b.supplements || 0, accom: accomSup, total: b.totalDays * RATE + (b.supplements || 0) + accomSup };
    const allStopsSelected = b.stops.every(s => s.selectedAccom);

    const selAccom = async (si, val) => {
      const updated = { ...b, stops: b.stops.map((s, i) => i === si ? { ...s, selectedAccom: val === s.selectedAccom ? null : val } : s) };
      setAct(updated);
      await updateDoc(doc(db, "bookings", b.id), { stops: updated.stops });
    };

    const updGuest = async (field, val) => {
      const updated = { ...b, [field]: val };
      setAct(updated);
      await updateDoc(doc(db, "bookings", b.id), { [field]: val });
    };

    const confirmSel = async () => {
      setSending(true);
      await updateDoc(doc(db, "bookings", b.id), {
        status: "confirmed", stops: b.stops,
        bondOption: b.bondOption || "none",
        childSeats: b.childSeats || false,
        childCutlery: b.childCutlery || false,
        bottleKit: b.bottleKit || false,
      });
      try {
        await fetch("https://api.emailjs.com/api/v1.0/email/send", {
          method: "POST", headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            service_id: "service_boynyl6", template_id: "template_kuncasw", user_id: "xioaylu5g4dwl6Xo6",
            template_params: {
              guest_name: "Troy",
              guest_email: "troy.anderson@southernhorizonco.com.au",
              booking_id: b.id,
              package: pk.name + " — " + b.guestName + " has confirmed their selections",
              dates: b.stops.map(s=>s.name+": "+( s.selectedAccom||"none")).join(" | "),
            },
          }),
        });
      } catch {}
      setConfirmed(true);
      setSending(false);
    };

    // Group options: best included room per property + upgrades
    const getStopOptions = (stop) => {
      const opts = stop.accomOptions || [];
      // Group by property (type field)
      const byProp = {};
      opts.forEach(o => {
        if (!byProp[o.type]) byProp[o.type] = [];
        byProp[o.type].push(o);
      });
      const included = [];
      const upgrades = [];
      Object.values(byProp).forEach(rooms => {
        const incRooms = rooms.filter(r => r.ppn <= ACCOM_CAP);
        const upgRooms = rooms.filter(r => r.ppn > ACCOM_CAP);
        // Best included room = highest ppn under cap
        if (incRooms.length > 0) {
          const best = incRooms.reduce((a, b) => b.ppn > a.ppn ? b : a);
          included.push(best);
        }
        // Best upgrade room = highest ppn (show one per property)
        if (upgRooms.length > 0) {
          const best = upgRooms.reduce((a, b) => b.ppn > a.ppn ? b : a);
          upgrades.push(best);
        }
      });
      return { included, upgrades };
    };

    const isLocked = confirmed || b.status === "confirmed";

    return (
      <div style={S.pg}><style>{fonts}</style>
        <div style={{...S.hd,borderBottom:"none",padding:"24px 32px"}}>
          <div><span style={{fontFamily:sf,fontSize:20,fontWeight:500,color:dk}}>Southern Horizon</span><span style={S.co}>Co.</span></div>
        </div>
        <div style={{maxWidth:680,margin:"0 auto",padding:"20px 24px 80px"}}>

          <div style={{textAlign:"center",marginBottom:48,padding:"40px 20px",background:`linear-gradient(135deg, ${tl}08, ${gd}08)`,borderRadius:16}}>
            <p style={{fontSize:9,fontWeight:700,letterSpacing:4,textTransform:"uppercase",color:gd,marginBottom:12}}>Your Trip</p>
            <h1 style={{fontFamily:sf,fontSize:"clamp(28px,5vw,40px)",fontWeight:400,color:dk,marginBottom:10,lineHeight:1.2}}>{pk.name}</h1>
            <div style={{width:40,height:1,background:gd,margin:"0 auto 14px"}}/>
            <p style={{fontSize:14,color:md}}>{b.guestName}</p>
            <p style={{fontSize:13,color:lt,marginTop:4}}>{b.totalDays} days · {b.guestCount}</p>
            {b.startDate && <p style={{fontSize:13,color:lt,marginTop:2}}>Starting {b.startDate}</p>}
          </div>

          {!isLocked && <div style={{marginBottom:32}}>
            <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,color:dk,marginBottom:4}}>Choose Your Accommodation</h2>
            <p style={{fontSize:13,color:lt,lineHeight:1.6}}>Select your preferred property at each stop. All accommodation below is included in your daily rate. Premium upgrade options are available at select locations.</p>
          </div>}

          {b.stops.map((stop, si) => {
            const { included, upgrades } = getStopOptions(stop);
            const sel = stop.selectedAccom;
            const selOpt = stop.accomOptions.find(o => o.name === sel);
            return (
              <div key={si} style={{marginBottom:28}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"baseline",marginBottom:14}}>
                  <h3 style={{fontFamily:sf,fontSize:19,fontWeight:500,color:dk}}>{stop.name}</h3>
                  <span style={{fontSize:11,fontWeight:600,color:lt,letterSpacing:1}}>{stop.nights} NIGHT{stop.nights>1?"S":""}</span>
                </div>

                {!isLocked && included.length > 0 && (
                  <div style={{display:"flex",flexDirection:"column",gap:8}}>
                    {included.map((opt,oi)=>(
                      <div key={oi} onClick={()=>selAccom(si,opt.name)}
                        style={{padding:"16px 20px",borderRadius:10,cursor:"pointer",transition:"all .25s ease",
                          border:sel===opt.name?`2px solid ${gd}`:`1px solid ${bd}`,
                          background:sel===opt.name?`${gd}06`:"#fff",
                          boxShadow:sel===opt.name?"0 2px 12px rgba(196,162,101,0.12)":"none"}}>
                        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                          <div>
                            <div style={{fontFamily:sf,fontSize:16,fontWeight:500,color:dk}}>{opt.type}</div>
                            <div style={{fontSize:12,color:lt,marginTop:3,lineHeight:1.5}}>{opt.desc}</div>
                          </div>
                          <div style={{width:22,height:22,borderRadius:12,flexShrink:0,marginLeft:16,display:"flex",alignItems:"center",justifyContent:"center",
                            border:sel===opt.name?`2px solid ${gd}`:`2px solid ${bd}`,background:sel===opt.name?gd:"#fff",transition:"all .2s"}}>
                            {sel===opt.name && <span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {!isLocked && upgrades.length > 0 && (
                  <div style={{marginTop:10}}>
                    <p style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:gd,marginBottom:8}}>Premium Upgrades</p>
                    <div style={{display:"flex",flexDirection:"column",gap:8}}>
                      {upgrades.map((opt,oi)=>(
                        <div key={oi} onClick={()=>selAccom(si,opt.name)}
                          style={{padding:"16px 20px",borderRadius:10,cursor:"pointer",transition:"all .25s ease",
                            border:sel===opt.name?`2px solid ${gd}`:`1px solid ${gd}30`,
                            background:sel===opt.name?`${gd}08`:`${gd}04`}}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                            <div>
                              <div style={{fontFamily:sf,fontSize:16,fontWeight:500,color:dk}}>{opt.type}</div>
                              <div style={{fontSize:12,color:lt,marginTop:3,lineHeight:1.5}}>{opt.desc}</div>
                            </div>
                            <div style={{display:"flex",alignItems:"center",gap:12}}>
                              <span style={{fontSize:11,fontWeight:600,color:gd,whiteSpace:"nowrap"}}>Upgrade available</span>
                              <div style={{width:22,height:22,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                                border:sel===opt.name?`2px solid ${gd}`:`2px solid ${gd}60`,background:sel===opt.name?gd:"#fff",transition:"all .2s"}}>
                                {sel===opt.name && <span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {isLocked && sel && (
                  <div style={{padding:"16px 20px",borderRadius:10,background:`${gd}06`,border:`1px solid ${gd}30`}}>
                    <div style={{fontFamily:sf,fontSize:16,fontWeight:500,color:dk}}>{selOpt?.type || sel}</div>
                    {selOpt && <div style={{fontSize:12,color:lt,marginTop:3}}>{selOpt.desc}</div>}
                    {selOpt && selOpt.ppn > ACCOM_CAP && <div style={{fontSize:12,fontWeight:600,color:gd,marginTop:4}}>Premium upgrade</div>}
                  </div>
                )}

                {!isLocked && !sel && included.length === 0 && upgrades.length === 0 && (
                  <p style={{fontSize:12,color:lt,fontStyle:"italic"}}>Accommodation options will be confirmed by your trip consultant.</p>
                )}

                <div style={{height:1,background:bd,marginTop:28}}/>
              </div>
            );
          })}

          {/* Bond / Peace of Mind */}
          {!isLocked && (
            <div style={{marginBottom:28}}>
              <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,color:dk,marginBottom:4}}>Security Bond</h2>
              <p style={{fontSize:13,color:lt,marginBottom:16,lineHeight:1.6}}>A security bond is charged at vehicle handover and fully refunded on return. You can reduce your bond with Peace of Mind Cover:</p>
              {[
                {id:"none",label:"Standard Bond",detail:"$7,500 fully refundable",cost:"Included"},
                {id:"assurance",label:"Peace of Mind — Assurance",detail:"Bond reduced to $5,000",cost:`+$${Math.min(38*b.totalDays,380)}`},
                {id:"complete",label:"Peace of Mind — Complete",detail:"Bond reduced to $3,500",cost:`+$${Math.min(55*b.totalDays,550)}`},
              ].map(opt=>(
                <div key={opt.id} onClick={()=>updGuest("bondOption",opt.id)}
                  style={{padding:"16px 20px",borderRadius:10,marginBottom:8,cursor:"pointer",transition:"all .25s ease",
                    border:(b.bondOption||"none")===opt.id?`2px solid ${gd}`:`1px solid ${bd}`,
                    background:(b.bondOption||"none")===opt.id?`${gd}06`:"#fff",
                    boxShadow:(b.bondOption||"none")===opt.id?"0 2px 12px rgba(196,162,101,0.12)":"none"}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                    <div>
                      <div style={{fontFamily:sf,fontSize:15,fontWeight:500,color:dk}}>{opt.label}</div>
                      <div style={{fontSize:12,color:lt,marginTop:2}}>{opt.detail}</div>
                    </div>
                    <div style={{fontSize:12,fontWeight:700,color:(b.bondOption||"none")===opt.id?gd:md}}>{opt.cost}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Child Equipment */}
          {!isLocked && (b.guestCount||"").includes("child") && (
            <div style={{marginBottom:28}}>
              <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,color:dk,marginBottom:4}}>Children's Equipment</h2>
              <p style={{fontSize:13,color:lt,marginBottom:16,lineHeight:1.6}}>Select any equipment you need for your trip:</p>
              {[
                {k:"childSeats",label:"Child seats / booster seats",desc:"Arranged via Kidsafe QLD — tell us ages during your consultation"},
                {k:"childCutlery",label:"Children's cutlery & dining sets",desc:"BPA-free, travel-friendly sets"},
                {k:"bottleKit",label:"Toddler dining & bottle kit",desc:"Steriliser, bottles, and dining essentials"},
              ].map(item=>(
                <div key={item.k} onClick={()=>updGuest(item.k,!b[item.k])}
                  style={{display:"flex",gap:14,alignItems:"center",cursor:"pointer",padding:"16px 20px",borderRadius:10,marginBottom:8,
                    border:b[item.k]?`2px solid ${gd}`:`1px solid ${bd}`,background:b[item.k]?`${gd}06`:"#fff",transition:"all .25s ease",
                    boxShadow:b[item.k]?"0 2px 12px rgba(196,162,101,0.12)":"none"}}>
                  <div style={{width:22,height:22,borderRadius:12,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",
                    border:b[item.k]?`2px solid ${gd}`:`2px solid ${bd}`,background:b[item.k]?gd:"#fff",transition:"all .2s"}}>
                    {b[item.k] && <span style={{color:"#fff",fontSize:11,fontWeight:700}}>✓</span>}
                  </div>
                  <div>
                    <div style={{fontFamily:sf,fontSize:15,fontWeight:500,color:dk}}>{item.label}</div>
                    <div style={{fontSize:12,color:lt,marginTop:2}}>{item.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Package Summary */}
          <div style={{background:"#fff",border:`1px solid ${bd}`,borderRadius:14,padding:"28px 24px",marginBottom:24}}>
            <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,color:dk,marginBottom:4}}>Package Summary</h2>
            <div style={{width:40,height:1,background:gd,margin:"12px 0 16px"}}/>
            <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:14,color:md}}>{q.days} days × $1,500/day</span><span style={{fontSize:14,fontWeight:600,color:dk}}>${q.sub.toLocaleString()}</span>
            </div>
            {q.accom > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:14,color:gd}}>Premium accommodation upgrades</span><span style={{fontSize:14,fontWeight:600,color:gd}}>${q.accom.toLocaleString()}</span>
            </div>}
            {pomCostCalc > 0 && <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:`1px solid ${bd}`}}>
              <span style={{fontSize:14,color:gd}}>Peace of Mind — {(b.bondOption||"none")==="assurance"?"Assurance":"Complete"}</span>
              <span style={{fontSize:14,fontWeight:600,color:gd}}>${pomCostCalc.toLocaleString()}</span>
            </div>}
            <div style={{display:"flex",justifyContent:"space-between",padding:"14px 0",marginTop:4}}>
              <span style={{fontFamily:sf,fontSize:20,fontWeight:500,color:dk}}>Total</span>
              <span style={{fontFamily:sf,fontSize:20,fontWeight:600,color:dk}}>${(q.total + pomCostCalc).toLocaleString()}</span>
            </div>
            <p style={{fontSize:11,color:lt,marginTop:4,lineHeight:1.5}}>Includes Lexus LX500d Overtrail, luxury accommodation with breakfast, fuel card, curated route & dining guide, Starlink, and personal concierge support.</p>
          </div>

          {/* Confirmed */}
          {isLocked && (
            <div style={{textAlign:"center",padding:"32px 24px",background:`linear-gradient(135deg, ${gd}08, ${tl}06)`,borderRadius:14,border:`1px solid ${gd}20`}}>
              <div style={{fontFamily:sf,fontSize:28,color:gd,marginBottom:10}}>✓</div>
              <p style={{fontFamily:sf,fontSize:20,fontWeight:500,color:dk}}>Selections received</p>
              <p style={{fontSize:13,color:lt,marginTop:8,lineHeight:1.6}}>Troy or Jess will be in touch with your final booking details within 24 hours.</p>
            </div>
          )}

          {/* Submit */}
          {!isLocked && (
            <button onClick={confirmSel} disabled={!allStopsSelected || sending}
              style={{width:"100%",padding:"18px",border:"none",borderRadius:10,cursor:allStopsSelected && !sending?"pointer":"not-allowed",
                fontFamily:sn,fontSize:13,fontWeight:700,letterSpacing:2,textTransform:"uppercase",transition:"all .3s",
                background:allStopsSelected && !sending?`linear-gradient(135deg,${tl},${tr})`:`${bd}`,
                color:allStopsSelected && !sending?"#fff":lt,
                opacity:allStopsSelected && !sending?1:0.6,
                boxShadow:allStopsSelected && !sending?"0 4px 20px rgba(10,107,122,0.25)":"none"}}>
              {sending ? "Sending..." : allStopsSelected ? "Send My Selections to Southern Horizon Co." : "Please select accommodation at each stop"}
            </button>
          )}
        </div>
      </div>
    );
  }

  /* ═══ LOADING ═══ */
  if (view === "loading") return <div style={{...S.pg,display:"flex",alignItems:"center",justifyContent:"center"}}><style>{fonts}</style><p style={{color:lt}}>Loading...</p></div>;

  /* ═══ LOGIN ═══ */
  if (view === "login") return (
    <div style={{...S.pg,display:"flex",alignItems:"center",justifyContent:"center",padding:28,
      background:`linear-gradient(135deg,#0B3D4E 0%,${tl} 25%,#4BA89A 50%,#B8864A 75%,${tr} 100%)`}}>
      <style>{fonts}</style>
      <div style={{maxWidth:400,width:"100%",textAlign:"center",background:"rgba(255,253,248,0.95)",backdropFilter:"blur(20px)",borderRadius:12,padding:"56px 40px",boxShadow:"0 24px 64px rgba(0,0,0,0.15)"}}>
        <span style={{fontFamily:sf,fontSize:28,fontWeight:400,color:dk}}>Southern Horizon</span><span style={S.co}>Co.</span>
        <div style={S.dv}/><p style={{fontSize:13,color:lt,margin:"16px 0 28px"}}>Booking Manager</p>
        <input type="password" placeholder="Password" value={pw} onChange={e=>{setPw(e.target.value);setAe(false)}}
          onKeyDown={e=>{if(e.key==="Enter"){if(pw==="shco2027"){setView("dashboard");loadAllBookings();setAe(false)}else setAe(true)}}}
          style={{...S.ip,textAlign:"center",marginBottom:12}}/>
        {ae && <p style={{fontSize:12,color:tr,marginBottom:12}}>Incorrect password</p>}
        <button onClick={()=>{if(pw==="shco2027"){setView("dashboard");loadAllBookings();setAe(false)}else setAe(true)}} style={{...S.bt,...S.bp,width:"100%"}}>Enter</button>
      </div>
    </div>
  );

  /* ═══ DASHBOARD ═══ */
  if (view === "dashboard") return (
    <div style={S.pg}><style>{fonts}</style>
      <div style={S.hd}>
        <div><span style={S.logo}>Southern Horizon</span><span style={S.co}>Co.</span></div>
        <div style={{display:"flex",gap:10}}>
          <button onClick={loadAllBookings} style={{...S.bt,...S.bh,padding:"10px 20px",fontSize:10}}>Refresh</button>
          <button onClick={createBk} style={{...S.bt,...S.bp}}>New Booking</button>
        </div>
      </div>
      <div style={{maxWidth:900,margin:"0 auto",padding:"40px 24px"}}>
        <h1 style={{fontFamily:sf,fontSize:28,fontWeight:400,marginBottom:4}}>Bookings</h1>
        <div style={S.dv}/><p style={{fontSize:13,color:lt,marginBottom:32}}>{loading?"Loading...":bks.length+" booking"+(bks.length!==1?"s":"")}</p>
        {bks.length === 0 && !loading ? (
          <div style={{textAlign:"center",padding:"60px 24px",background:sd,borderRadius:8}}>
            <p style={{fontFamily:sf,fontSize:20,color:md,marginBottom:12}}>No bookings yet</p>
            <button onClick={createBk} style={{...S.bt,...S.bg2}}>Create First Booking</button>
          </div>
        ) : (
          <div style={{display:"flex",flexDirection:"column",gap:12}}>
            {bks.map(b => {
              const pk = PACKAGES[b.packageId];
              const qtotal = b.totalDays * RATE + (b.supplements || 0) + accomSupCalc(b);
              const picks = b.stops?.filter(s => s.mode === "touring" && s.selectedAccom).length || 0;
              const tTotal = b.stops?.filter(s => s.mode === "touring" && s.accomOptions?.length > 0).length || 0;
              return (
                <div key={b.id} onClick={async () => { const snap = await getDoc(doc(db,"bookings",b.id)); if(snap.exists()) setAct({id:snap.id,...snap.data()}); setView("edit"); }}
                  style={{...S.cd,cursor:"pointer",display:"flex",justifyContent:"space-between",alignItems:"center",
                    borderLeft:`3px solid ${b.status==="confirmed"?"#2E7D32":b.status==="sent"?tl:b.status==="enquiry"?"#E65100":gd}`,transition:"box-shadow .2s"}}
                  onMouseEnter={e=>e.currentTarget.style.boxShadow="0 4px 20px rgba(0,0,0,0.06)"}
                  onMouseLeave={e=>e.currentTarget.style.boxShadow="none"}>
                  <div>
                    <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:4}}>
                      <span style={{fontFamily:sf,fontSize:18,fontWeight:500}}>{b.guestName || "Unnamed"}</span>
                      <span style={S.bg(b.status)}>{b.status}</span>
                    </div>
                    <p style={{fontSize:12,color:lt}}>{pk?.name||"Custom"} · {b.totalDays}d · {b.guestCount} · {b.id}</p>
                    {b.status === "enquiry" && b.message && <p style={{fontSize:11,color:md,marginTop:4,fontStyle:"italic"}}>"{b.message.substring(0,80)}{b.message.length>80?"...":""}"</p>}
                    {tTotal > 0 && <p style={{fontSize:11,color:picks===tTotal?"#2E7D32":tr,marginTop:4}}>Accom: {picks}/{tTotal} selected</p>}
                  </div>
                  <div style={{textAlign:"right"}}>
                    <div style={{fontFamily:sf,fontSize:20,fontWeight:500}}>${qtotal.toLocaleString()}</div>

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );

  /* ═══ ADMIN EDIT ═══ */
  if (view === "edit" && act) {
    const b = act, pk = PACKAGES[b.packageId], v = visaCalc(b);
    const pomCost = (b.bondOption||"none")==="assurance"?Math.min(38*b.totalDays,380):(b.bondOption||"none")==="complete"?Math.min(55*b.totalDays,550):0;
    const accomSup = accomSupCalc(b);
    const q = { days:b.totalDays, sub:b.totalDays*RATE, sup:b.supplements||0, pom:pomCost, accom:accomSup, total:b.totalDays*RATE+(b.supplements||0)+pomCost+accomSup };
    const upd = (f, val) => updBk({ ...b, [f]: val });

    const chgPkg = pid => {
      const np = PACKAGES[pid];
      updBk({...b, packageId:pid, totalDays:np.days,
        stops:(np.stops||[]).map(s=>({name:s,mode:"touring",nights:1,accomOptions:(PROPERTIES[s]||[]).map(p=>({...p})),selectedAccom:null}))});
    };

    const updStop = (i, f, val) => {
      const ns = b.stops.map((s, idx) => {
        if (idx !== i) return s;
        const u = { ...s, [f]: val };
        if (f === "mode" && val === "touring" && s.accomOptions.length === 0) u.accomOptions = (PROPERTIES[s.name] || []).map(p => ({ ...p }));
        if (f === "mode") { u.selectedAccom = null; u.accomOptions = (PROPERTIES[s.name] || []).map(p => ({ ...p })); }
        return u;
      });
      updBk({ ...b, stops: ns });
    };

    const addFromDb = (si, name, mode) => {
      const stop = b.stops[si];
      const dbSource = PROPERTIES;
      const prop = (dbSource[stop.name] || []).find(p => p.name === name);
      if (!prop || stop.accomOptions.find(o => o.name === name)) return;
      updBk({...b, stops: b.stops.map((s, i) => i === si ? { ...s, accomOptions: [...s.accomOptions, { ...prop }] } : s)});
    };

    const addCustom = si => {
      updBk({...b, stops: b.stops.map((s, i) => i === si ? { ...s, accomOptions: [...s.accomOptions, { name:"", type:"", ppn:0, desc:"" }] } : s)});
    };

    const updAccom = (si, ai, f, val) => {
      updBk({...b, stops: b.stops.map((s, i) => {
        if (i !== si) return s;
        return { ...s, accomOptions: s.accomOptions.map((o, j) => j === ai ? { ...o, [f]: val } : o) };
      })});
    };

    const rmAccom = (si, ai) => {
      updBk({...b, stops: b.stops.map((s, i) => {
        if (i !== si) return s;
        return { ...s, accomOptions: s.accomOptions.filter((_, j) => j !== ai), selectedAccom: null };
      })});
    };

    const gLink = `${window.location.origin}${window.location.pathname}?booking=${b.id}`;
    const copyLink = () => { navigator.clipboard?.writeText(gLink); setCopied(true); setTimeout(()=>setCopied(false),3000); };

    return (
      <div style={S.pg}><style>{fonts}</style>
        <div style={S.hd}>
          <div style={{display:"flex",alignItems:"center",gap:16}}>
            <span onClick={()=>{setView("dashboard");loadAllBookings()}} style={{cursor:"pointer",fontSize:12,color:lt}}>← Back</span>
            <div><span style={S.logo}>Southern Horizon</span><span style={S.co}>Co.</span></div>
          </div>
          <div style={{display:"flex",gap:10,alignItems:"center"}}>
            <span style={S.bg(b.status)}>{b.status}</span>
            <span style={{fontSize:11,color:lt}}>{b.id}</span>
          </div>
        </div>

        <div style={{maxWidth:900,margin:"0 auto",padding:"32px 24px 80px"}}>
          {/* Enquiry details from website */}
          {b.status === "enquiry" && (
            <div style={{...S.cd,marginBottom:20,borderLeft:`3px solid #E65100`,background:"#FFF3E0"}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#E65100",marginBottom:8}}>Website Enquiry</h3>
              {b.dates && <p style={{fontSize:12,color:md}}>Preferred dates: <strong>{b.dates}</strong></p>}
              {b.duration && <p style={{fontSize:12,color:md}}>Duration: <strong>{b.duration}</strong></p>}
              {b.dietary && <p style={{fontSize:12,color:md}}>Dietary: {b.dietary}</p>}
              {b.specialNeeds && <p style={{fontSize:12,color:md}}>Special requirements: <strong style={{color:dk}}>{b.specialNeeds}</strong></p>}
              {(b.childSeats || b.childCutlery || b.bottleKit) && (
                <div style={{marginTop:6}}>
                  <span style={{fontSize:12,color:md}}>Children's equipment requested: </span>
                  <strong style={{fontSize:12,color:dk}}>
                    {[b.childSeats&&"Child seats",b.childCutlery&&"Cutlery sets",b.bottleKit&&"Toddler bottle kit"].filter(Boolean).join(", ")}
                  </strong>
                </div>
              )}
              {b.message && <p style={{fontSize:13,color:dk,marginTop:8,padding:"10px 14px",background:"rgba(255,255,255,0.6)",borderRadius:6}}>"{b.message}"</p>}
            </div>
          )}

          {/* Show special needs & child equipment for all statuses (not just enquiry) */}
          {b.status !== "enquiry" && (b.specialNeeds || b.childSeats || b.childCutlery || b.bottleKit) && (
            <div style={{...S.cd,marginBottom:20,borderLeft:`3px solid ${gd}`}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:gd,marginBottom:8}}>Guest Requirements</h3>
              {b.specialNeeds && <p style={{fontSize:12,color:md}}>Special requirements: <strong style={{color:dk}}>{b.specialNeeds}</strong></p>}
              {b.dietary && <p style={{fontSize:12,color:md}}>Dietary: {b.dietary}</p>}
              {(b.childSeats || b.childCutlery || b.bottleKit) && (
                <div style={{marginTop:4}}>
                  <span style={{fontSize:12,color:md}}>Children's equipment: </span>
                  <strong style={{fontSize:12,color:dk}}>
                    {[b.childSeats&&"Child seats",b.childCutlery&&"Cutlery sets",b.bottleKit&&"Toddler bottle kit"].filter(Boolean).join(", ")}
                  </strong>
                </div>
              )}
            </div>
          )}

          {/* Guest Details */}
          <div style={{...S.cd,marginBottom:20}}>
            <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,marginBottom:16}}>Guest Details</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              <div><label style={S.lb}>Name</label><input style={S.ip} value={b.guestName} onChange={e=>upd("guestName",e.target.value)}/></div>
              <div><label style={S.lb}>Email</label><input style={S.ip} value={b.guestEmail} onChange={e=>upd("guestEmail",e.target.value)}/></div>
              <div><label style={S.lb}>Phone</label><input style={S.ip} value={b.guestPhone} onChange={e=>upd("guestPhone",e.target.value)}/></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr 1fr",gap:14,marginTop:14}}>
              <div><label style={S.lb}>Guests</label>
                <select style={S.sl} value={b.guestCount} onChange={e=>upd("guestCount",e.target.value)}>
                  {GUESTS.map(o=><option key={o}>{o}</option>)}
                </select>
              </div>
              <div><label style={S.lb}>Package</label>
                <select style={S.sl} value={b.packageId} onChange={e=>chgPkg(e.target.value)}>
                  {Object.entries(PACKAGES).map(([k,v])=><option key={k} value={k}>{v.name}</option>)}
                </select>
              </div>
              <div><label style={S.lb}>Start Date</label><input type="date" style={S.ip} value={b.startDate} onChange={e=>upd("startDate",e.target.value)}/></div>
              <div><label style={S.lb}>Total Days</label><input type="number" min="3" style={S.ip} value={b.totalDays} onChange={e=>upd("totalDays",parseInt(e.target.value)||0)}/></div>
            </div>
          </div>

          {/* Stops */}
          <div style={{...S.cd,marginBottom:20}}>
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
              <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500}}>Stops & Accommodation</h2>
              <button onClick={()=>updBk({...b,stops:[...b.stops,{name:"New Stop",mode:"touring",nights:1,accomOptions:[],selectedAccom:null}]})}
                style={{...S.bt,...S.bh,padding:"8px 16px",fontSize:10}}>+ Add Stop</button>
            </div>
            {b.stops.map((stop, si) => {
              const dbSource = PROPERTIES;
              const avail = dbSource[stop.name] || [];
              const added = stop.accomOptions.map(o => o.name);
              const unadded = avail.filter(p => !added.includes(p.name));
              return (
                <div key={si} style={{padding:"16px 0",borderBottom:si<b.stops.length-1?`1px solid ${bd}`:"none"}}>
                  <div style={{display:"grid",gridTemplateColumns:"2fr 1fr 80px 80px",gap:10,alignItems:"end"}}>
                    <div><label style={S.lb}>Stop</label><input style={S.ip} value={stop.name} onChange={e=>updStop(si,"name",e.target.value)}/></div>
                    <div><label style={S.lb}>Mode</label>
                      <select style={{...S.sl,borderColor:tr,color:tr}}
                        value={stop.mode} onChange={e=>updStop(si,"mode",e.target.value)}>
                        <option value="touring">Touring</option>
                      </select>
                    </div>
                    <div><label style={S.lb}>Nights</label><input type="number" min="1" style={S.ip} value={stop.nights} onChange={e=>updStop(si,"nights",parseInt(e.target.value)||1)}/></div>
                    <div><button onClick={()=>updBk({...b,stops:b.stops.filter((_,i)=>i!==si)})} style={{...S.bt,...S.bh,padding:"12px",fontSize:10,width:"100%",color:tr}}>Remove</button></div>
                  </div>

                  {stop.mode==="touring" && stop.selectedAccom && (
                    <div style={{marginTop:10,padding:"10px 16px",background:"#E8F5E9",borderRadius:6,borderLeft:"3px solid #2E7D32"}}>
                      <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:"#2E7D32"}}>Guest selected: </span>
                      <span style={{fontFamily:sf,fontSize:15,fontWeight:500}}>{stop.selectedAccom}</span>
                      {(()=>{const s=stop.accomOptions.find(o=>o.name===stop.selectedAccom);return s?<span style={{fontSize:12,color:md}}> · ${s.ppn}/n × {stop.nights}n = ${s.ppn*stop.nights}</span>:null})()}
                    </div>
                  )}


                  {/* Accommodation Options */}
                  {stop.mode && (
                    <div style={{marginTop:12,paddingLeft:16,borderLeft:`2px solid ${tr}20`}}>
                      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}>
                        <span style={{fontSize:10,fontWeight:700,letterSpacing:1.5,textTransform:"uppercase",color:tr}}>
                          "Accommodation Options (" + stop.accomOptions.length + ")"
                        </span>
                        <div style={{display:"flex",gap:8}}>
                          {unadded.length > 0 && (
                            <select onChange={e=>{if(e.target.value){addFromDb(si,e.target.value,"touring");e.target.value=""}}}
                              style={{padding:"6px 10px",borderRadius:4,border:`1px solid ${bd}`,fontSize:11,color:md,cursor:"pointer"}}>
                              <option value="">+ From database</option>
                              {unadded.map((p,i)=><option key={i} value={p.name}>{p.name}{p.ppn>0?` — $${p.ppn}/n`:""}</option>)}
                            </select>
                          )}
                          <button onClick={()=>addCustom(si)} style={{fontSize:10,fontWeight:600,color:gd,background:"none",border:`1px solid ${gd}40`,borderRadius:4,padding:"6px 12px",cursor:"pointer"}}>+ Custom</button>
                        </div>
                      </div>
                      {stop.accomOptions.map((opt,ai)=>(
                        <div key={ai} style={{display:"grid",gridTemplateColumns:"2fr 1fr 2fr 80px 40px",gap:8,marginBottom:8,alignItems:"end"}}>
                          <div><label style={{...S.lb,fontSize:9}}>Name</label><input style={{...S.ip,padding:"10px 12px",fontSize:12}} value={opt.name} onChange={e=>updAccom(si,ai,"name",e.target.value)}/></div>
                          <div><label style={{...S.lb,fontSize:9}}>Type</label><input style={{...S.ip,padding:"10px 12px",fontSize:12}} value={opt.type} onChange={e=>updAccom(si,ai,"type",e.target.value)}/></div>
                          <div><label style={{...S.lb,fontSize:9}}>Desc</label><input style={{...S.ip,padding:"10px 12px",fontSize:12}} value={opt.desc} onChange={e=>updAccom(si,ai,"desc",e.target.value)}/></div>
                          <div><label style={{...S.lb,fontSize:9}}>$/Night</label><input type="number" style={{...S.ip,padding:"10px 12px",fontSize:12}} value={opt.ppn} onChange={e=>updAccom(si,ai,"ppn",parseInt(e.target.value)||0)}/></div>
                          <button onClick={()=>rmAccom(si,ai)} style={{fontSize:10,color:tr,background:"none",border:`1px solid ${bd}`,borderRadius:4,padding:"10px",cursor:"pointer"}}>×</button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Admin Controls — Visa, Bond, Ultra-Luxury */}
          <div style={{...S.cd,marginBottom:20}}>
            <h2 style={{fontFamily:sf,fontSize:22,fontWeight:500,marginBottom:16}}>Admin Controls</h2>
            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr 1fr",gap:14}}>
              <div><label style={S.lb}>Visa — Fuel ($)</label>
                <input type="number" style={S.ip} value={b.visaFuelOverride ?? ""} placeholder="Auto: $1,000"
                  onChange={e=>upd("visaFuelOverride",e.target.value?parseInt(e.target.value):undefined)}/></div>
              <div><label style={S.lb}>Visa — Dining ($)</label>
                <input type="number" style={S.ip} value={b.visaDiningOverride ?? ""} placeholder={`Auto: $${b.stops.filter(s=>s.mode==="touring").reduce((a,s)=>a+s.nights,0) * 200} ($200/day × touring nights)`}
                  onChange={e=>upd("visaDiningOverride",e.target.value?parseInt(e.target.value):undefined)}/></div>
              <div><label style={S.lb}>Peace of Mind</label>
                <select style={{...S.sl,borderColor:(b.bondOption&&b.bondOption!=="none")?gd:bd,color:(b.bondOption&&b.bondOption!=="none")?gd:dk}}
                  value={b.bondOption||"none"} onChange={e=>upd("bondOption",e.target.value)}>
                  <option value="none">Standard Bond — $7,500</option>
                  <option value="assurance">Assurance — ${Math.min(38*q.days,380)} (bond → $5,000)</option>
                  <option value="complete">Complete — ${Math.min(55*q.days,550)} (bond → $3,500)</option>
                </select></div>
            </div>
            <div style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:14,marginTop:14}}>
              <div><label style={S.lb}>Ultra-Luxury Supplements ($)</label>
                <input type="number" style={S.ip} value={b.supplements} onChange={e=>upd("supplements",parseInt(e.target.value)||0)}/></div>
              <div><label style={S.lb}>Notes</label>
                <input style={S.ip} value={b.notes} onChange={e=>upd("notes",e.target.value)} placeholder="Internal notes"/></div>
            </div>
          </div>

          {/* Quote & Visa */}
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:20,marginBottom:20}}>
            <div style={S.cd}>
              <h3 style={{fontFamily:sf,fontSize:20,fontWeight:500,marginBottom:12}}>Quote</h3>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>{q.days}d × $1,500</span><span style={{fontSize:13,fontWeight:600}}>${q.sub.toLocaleString()}</span></div>
              {q.sup>0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:md}}>Ultra-luxury supplements</span><span style={{fontSize:13,fontWeight:600}}>${q.sup.toLocaleString()}</span></div>}
              {q.accom>0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:tr}}>Accommodation upgrades</span><span style={{fontSize:13,fontWeight:600,color:tr}}>${q.accom.toLocaleString()}</span></div>}
              {q.pom>0 && <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}><span style={{fontSize:13,color:gd}}>Peace of Mind — {(b.bondOption||"none")==="assurance"?"Assurance":"Complete"}</span><span style={{fontSize:13,fontWeight:600,color:gd}}>${q.pom.toLocaleString()}</span></div>}
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginTop:6,borderTop:`1px solid ${bd}`}}>
                <span style={{fontFamily:sf,fontSize:18,fontWeight:500}}>Total</span><span style={{fontFamily:sf,fontSize:18,fontWeight:600}}>${q.total.toLocaleString()}</span>
              </div>
              <div style={{marginTop:12,padding:"10px 14px",background:sd,borderRadius:4}}>
                {(()=>{
                  const opt = b.bondOption || "none";
                  const bondAmt = opt==="assurance"?5000:opt==="complete"?3500:7500;
                  const pomCost = opt==="assurance"?Math.min(38*q.days,380):opt==="complete"?Math.min(55*q.days,550):0;
                  return <>
                    <div style={{fontSize:11,color:md}}>Bond: <strong>${bondAmt.toLocaleString()}</strong></div>
                    {opt!=="none" && <div style={{fontSize:11,color:gd}}>Peace of Mind {opt==="assurance"?"Assurance":"Complete"}: <strong>${pomCost}</strong></div>}
                  </>;
                })()}
              </div>
            </div>
            <div style={{...S.cd,borderLeft:`3px solid ${gd}`}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:gd,marginBottom:12}}>Visa Pre-load</h3>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
                <span style={{fontSize:13,color:md}}>Fuel{b.visaFuelOverride!==undefined?<span style={{color:gd}}> (override)</span>:""}</span>
                <span>${v.fuel.toLocaleString()}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"6px 0"}}>
                <span style={{fontSize:13,color:md}}>Dining{b.visaDiningOverride!==undefined?<span style={{color:gd}}> (override)</span>:""}</span>
                <span>${v.dining.toLocaleString()}</span>
              </div>
              <div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginTop:6,borderTop:`1px solid ${bd}`}}>
                <span style={{fontWeight:600}}>Total</span><span style={{fontWeight:600,color:gd}}>${v.total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Guest Selections */}
          {b.stops.some(s => s.selectedAccom) && (
            <div style={{...S.cd,marginBottom:20,borderLeft:`3px solid #2E7D32`}}>
              <h3 style={{fontSize:10,fontWeight:700,letterSpacing:2,textTransform:"uppercase",color:"#2E7D32",marginBottom:12}}>Guest Selections</h3>
              {b.stops.filter(s=>s.selectedAccom).map((s,i,arr)=>{
                const sel=s.accomOptions.find(o=>o.name===s.selectedAccom);
                return <div key={i} style={{display:"flex",justifyContent:"space-between",padding:"8px 0",borderBottom:i<arr.length-1?`1px solid ${bd}`:"none"}}>
                  <span style={{fontSize:13,color:md}}>{s.name}</span>
                  <span style={{fontSize:13,fontWeight:500}}>{s.selectedAccom}{sel?` · $${sel.ppn} × ${s.nights}n = $${sel.ppn*s.nights}`:""}</span>
                </div>;
              })}
              {(()=>{const t=b.stops.filter(s=>s.selectedAccom).reduce((a,s)=>{const sel=s.accomOptions.find(o=>o.name===s.selectedAccom);return a+(sel?sel.ppn*s.nights:0)},0);
                return t>0?<div style={{display:"flex",justifyContent:"space-between",padding:"10px 0",marginTop:6,borderTop:`1px solid ${bd}`}}>
                  <span style={{fontFamily:sf,fontSize:16,fontWeight:500,color:"#2E7D32"}}>Total Accom</span>
                  <span style={{fontFamily:sf,fontSize:16,fontWeight:600,color:"#2E7D32"}}>${t.toLocaleString()}</span>
                </div>:null})()}
            </div>
          )}

          {/* Share */}
          <div style={S.cd}>
            <h3 style={{fontFamily:sf,fontSize:20,fontWeight:500,marginBottom:12}}>Share with Guest</h3>
            <div style={{display:"flex",gap:10,alignItems:"center",marginBottom:6}}>
              <input style={{...S.ip,flex:1,fontSize:12,color:lt}} value={gLink} readOnly onClick={e=>e.target.select()}/>
              <button onClick={copyLink} style={{...S.bt,...S.bg2,padding:"13px 20px",whiteSpace:"nowrap"}}>{copied?"Copied!":"Copy Link"}</button>
            </div>
            <p style={{fontSize:11,color:lt,marginBottom:16}}>This is a short link — safe to email or text to your guest.</p>
            <div style={{display:"flex",gap:10,flexWrap:"wrap"}}>
              {b.status !== "sent" && b.status !== "confirmed" && <button onClick={()=>updBk({...b,status:"sent"})} style={{...S.bt,...S.bp}}>Mark as Sent</button>}
              <button onClick={()=>{setView("dashboard");loadAllBookings()}} style={{...S.bt,...S.bh}}>Back</button>
              <button onClick={()=>{if(confirm("Delete?"))delBk(b.id)}} style={{...S.bt,...S.bh,color:tr,borderColor:`${tr}40`}}>Delete</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
