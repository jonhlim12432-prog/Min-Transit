// server.ts
import express from "express";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// src/mockData.ts
var MOCK_DESTINATIONS = [
  {
    id: "dest-camiguin",
    name: "Camiguin Island",
    slug: "camiguin-island",
    province: "Camiguin",
    region: "Region X (Northern Mindanao)",
    heroImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Island Born of Fire known for pristine white sandbars, hot springs, waterfalls, and lanzones.",
    longDescription: "Camiguin is a pear-shaped volcanic island in the Bohol Sea, north of Misamis Oriental. Famous for having more volcanoes than towns, it offers breathtaking natural wonders including White Island, Mantigue Island, the Sunken Cemetery, Katibawasan Falls, and rejuvenating volcanic hot springs.",
    category: "islands",
    attractions: ["White Island", "Mantigue Island", "Sunken Cemetery", "Katibawasan Falls", "Tuasan Falls", "Ardent Hot Springs"],
    bestTimeToVisit: "March to October (Dry Season)",
    recommendedDuration: "3 Days / 2 Nights",
    budgetEstimate: "\u20B14,500 - \u20B18,000 per person",
    transportationOptions: ["Ferry from Balingoan Port", "Bus + Ferry combination from CDO"],
    nearbyAirports: ["Camiguin Airport (CGM) - limited flights", "Laguindingan Airport (CGY) via ferry"],
    nearbyPorts: ["Benoni Port", "Balbagon Port"],
    nearbyTerminals: ["Mambajao Central Terminal"],
    travelTips: ["Rent a scooter for easy island exploration", "Try the famous Pastel bread at Vjandep", "Bring cash as ATMs are limited in remote areas"],
    activities: ["Snorkeling & Island Hopping", "Volcanic Hiking", "Hot Spring Relaxation", "Waterfall Swimming"],
    isFeatured: true,
    searchCount: 1420,
    favoriteCount: 890
  },
  {
    id: "dest-cdo",
    name: "Cagayan de Oro",
    slug: "cagayan-de-oro",
    province: "Misamis Oriental",
    region: "Region X (Northern Mindanao)",
    heroImage: "https://images.unsplash.com/photo-1508873696983-2df5c92064c5?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "City of Golden Friendship and the Whitewater Rafting Adventure Capital of the Philippines.",
    longDescription: "Cagayan de Oro is a bustling regional hub connecting Northern Mindanao to the rest of the country. Renowned for exhilarating whitewater rafting along the Cagayan River, vibrant culinary scenes, night markets, and as the gateway to Bukidnon and Camiguin.",
    category: "cities",
    attractions: ["Cagayan River Whitewater Rafting", "Malasag Eco-Tourism Village", "Gaston Park", "St. Augustine Cathedral", "Divisoria Night Market"],
    bestTimeToVisit: "Year-round (Best during August fiesta)",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,000 - \u20B16,000 per person",
    transportationOptions: ["Domestic Flights via Laguindingan Airport", "Express Buses from Davao, Iligan, Butuan, Surigao"],
    nearbyAirports: ["Laguindingan International Airport (CGY)"],
    nearbyPorts: ["Port of Cagayan de Oro"],
    nearbyTerminals: ["Agora Bus Terminal", "Bulua Westbound Terminal"],
    travelTips: ["Book whitewater rafting in advance with certified operators", "Try local sinuglaw at CdeO night spots"],
    activities: ["Whitewater Rafting", "Zip-lining at Dahilayan (via gateway)", "Food Tripping", "River Cruise"],
    isFeatured: true,
    searchCount: 2150,
    favoriteCount: 1240
  },
  {
    id: "dest-bukidnon",
    name: "Bukidnon Highlands",
    slug: "bukidnon-highlands",
    province: "Bukidnon",
    region: "Region X (Northern Mindanao)",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "The Food Basket and Adventure Highlands of Mindanao with pine forests and cool mountain breeze.",
    longDescription: "Bukidnon features rolling green hills, pineapple plantations, majestic mountains like Mount Kitanglad, and world-class adventure parks in Manolo Fortich and Malaybalay. Enjoy cooler temperatures, misty mornings, and farm tourism.",
    category: "mountains",
    attractions: ["Dahilayan Adventure Park", "Monastery of the Transfiguration", "Mt. Kitanglad Range", "Del Monte Pineapple Plantations", "Cedar Hinoba-an"],
    bestTimeToVisit: "November to May (Cool & Dry)",
    recommendedDuration: "3 Days / 2 Nights",
    budgetEstimate: "\u20B14,000 - \u20B17,500 per person",
    transportationOptions: ["Bus from Cagayan de Oro or Davao", "Van rentals or private car"],
    nearbyAirports: ["Laguindingan Airport (CGY) + 2hr drive", "Davao Airport (DVO) + 3hr drive"],
    nearbyPorts: [],
    nearbyTerminals: ["Malaybalay Bus Terminal", "Manolo Fortich Terminal"],
    travelTips: ["Bring thick jackets as highland evenings get chilly", "Pre-book adventure park rides during weekends"],
    activities: ["Zip-lining & Adventure Rides", "Mountain Climbing", "Pineapple Farm Tours", "Coffee Tasting"],
    isFeatured: true,
    searchCount: 1680,
    favoriteCount: 950
  },
  {
    id: "dest-siargao",
    name: "Siargao Island",
    slug: "siargao-island",
    province: "Surigao del Norte",
    region: "Region XIII (Caraga)",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "The Surfing Capital of the Philippines with world-class breaks, lagoons, and island vibes.",
    longDescription: "Siargao is a teardrop-shaped island in the Philippine Sea known for Cloud 9 surf break, pristine mangroves, Sugba Lagoon, Magpupungko rock pools, and a thriving digital nomad and culinary community.",
    category: "beaches",
    attractions: ["Cloud 9 Surf Spot", "Sugba Lagoon", "Magpupungko Rock Pools", "Guyam, Daku & Naked Islands", "Maasin River Bent Palm Tree"],
    bestTimeToVisit: "August to November (Peak Surf Season)",
    recommendedDuration: "4 Days / 3 Nights",
    budgetEstimate: "\u20B17,000 - \u20B115,000 per person",
    transportationOptions: ["Direct flights to Siargao (IAO)", "Ferry from Surigao Port + Speedboat"],
    nearbyAirports: ["Sayak Airport / Siargao Airport (IAO)"],
    nearbyPorts: ["Dapa Port"],
    nearbyTerminals: ["General Luna Tourism Port"],
    travelTips: ["Rent a motorbike or bicycle for getting around General Luna", "Book island hopping tours a day prior"],
    activities: ["Surfing Lessons", "Island Hopping", "Paddleboarding in Sugba Lagoon", "Nightlife & Dining"],
    isFeatured: true,
    searchCount: 3400,
    favoriteCount: 2100
  },
  {
    id: "dest-davao",
    name: "Davao City",
    slug: "davao-city",
    province: "Davao del Sur",
    region: "Region XI (Davao Region)",
    heroImage: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Crown Jewel of Mindanao combining urban sophistication, Mount Apo, and exotic fruits.",
    longDescription: "Davao City is one of the largest cities in the world by land area, known for safety, cleanliness, Mount Apo (highest peak in the Philippines), the Philippine Eagle, durian orchards, and easy access to Samal Island.",
    category: "cities",
    attractions: ["Philippine Eagle Center", "Eden Nature Park", "Mount Apo National Park", "Jack\u2019s Ridge", "People\u2019s Park", "Samal Island Beaches"],
    bestTimeToVisit: "August (Kadayawan Festival) or Year-round",
    recommendedDuration: "3 Days / 2 Nights",
    budgetEstimate: "\u20B15,000 - \u20B110,000 per person",
    transportationOptions: ["Flights to Francisco Bangoy International Airport (DVO)", "Buses from CDO, General Santos, Butuan"],
    nearbyAirports: ["Francisco Bangoy International Airport (DVO)"],
    nearbyPorts: ["Davao Sasa Port", "Sta. Ana Wharf"],
    nearbyTerminals: ["Davao City Overland Transport Terminal (DCOTT)"],
    travelTips: ["Try fresh durian at Magsaysay Park", "Take the RoRo ferry to Samal Island for a quick beach escape"],
    activities: ["Eagle Sanctuary Visit", "Highland Nature Parks", "Island Beach Hopping", "Food & Night Market Tour"],
    isFeatured: true,
    searchCount: 2890,
    favoriteCount: 1650
  },
  {
    id: "dest-samal",
    name: "Samal Island",
    slug: "samal-island",
    province: "Davao del Norte",
    region: "Region XI (Davao Region)",
    heroImage: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Island Garden City of Samal offering luxury resorts, white sand beaches, and bat caves.",
    longDescription: "Just a 10-minute ferry ride from Davao City, Samal Island boasts over 100 kilometers of coastline, crystal-clear waters, majestic coral reefs, and world-class resort destinations.",
    category: "islands",
    attractions: ["Hagimit Falls", "Monfort Bat Cave Sanctuary", "Talikud Island", "Costa Marina Beach", "Pearl Farm Beach Resort"],
    bestTimeToVisit: "December to May",
    recommendedDuration: "3 Days / 2 Nights",
    budgetEstimate: "\u20B14,500 - \u20B19,000 per person",
    transportationOptions: ["RoRo Ferry from Davao Sasa Port", "Passenger boat from Sta. Ana Wharf"],
    nearbyAirports: ["Davao International Airport (DVO)"],
    nearbyPorts: ["Babak Port", "Kaputian Port"],
    nearbyTerminals: ["Sasa Ferry Terminal"],
    travelTips: ["Bring reef-safe sunscreen to protect marine life", "Rent a habal-habal or tricycle for touring the island"],
    activities: ["Beach Resort Stay", "Snorkeling & Scuba Diving", "Waterfall Bathing", "Bat Cave Tour"],
    isFeatured: false,
    searchCount: 1560,
    favoriteCount: 920
  },
  {
    id: "dest-iligan",
    name: "Iligan City",
    slug: "iligan-city",
    province: "Lanao del Norte",
    region: "Region X (Northern Mindanao)",
    heroImage: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "The City of Majestic Waterfalls with over 20 scenic waterfalls including Maria Cristina and Tinago.",
    longDescription: "Iligan City is nature\u2019s water wonderland in Northern Mindanao. Home to the iconic Maria Cristina Falls (which powers much of Mindanao\u2019s electricity) and the enchanting multi-tiered Tinago Falls hidden in a deep ravine.",
    category: "waterfalls",
    attractions: ["Maria Cristina Falls", "Tinago Falls", "Mimbalot Falls", "Anacleta Falls", "Paseo de Santiago"],
    bestTimeToVisit: "Year-round",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,000 - \u20B15,500 per person",
    transportationOptions: ["Bus from Cagayan de Oro (1.5 hrs) or Dipolog / Ozamiz"],
    nearbyAirports: ["Laguindingan Airport (CGY) + 1.5hr drive"],
    nearbyPorts: ["Port of Iligan"],
    nearbyTerminals: ["Iligan Integrated Bus Terminal"],
    travelTips: ["Hire local guides at Tinago Falls for safety and photography assistance", "Try local Palapa spicy condiment"],
    activities: ["Waterfall Trekking", "Rafting at Tinago Falls", "Sightseeing & Photography", "Local Food Tripping"],
    isFeatured: true,
    searchCount: 1340,
    favoriteCount: 780
  },
  {
    id: "dest-zamboanga",
    name: "Zamboanga City",
    slug: "zamboanga-city",
    province: "Zamboanga del Sur",
    region: "Zamboanga Peninsula (Region IX)",
    heroImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Asia\u2019s Latin City known for its unique pink sand beach, Fort Pilar, and vibrant barter trade.",
    longDescription: "Zamboanga City offers rich Spanish colonial history, Chavacano culture, the breathtaking pink sand beach of Great Santa Cruz Island, Fort Pilar Shrine, and delicious seafood dishes like Curacha.",
    category: "cultural",
    attractions: ["Great Santa Cruz Island (Pink Beach)", "Fort Pilar Museum & Shrine", "Pasonanca Park", "Yakan Weaving Village", "Rio Hondo"],
    bestTimeToVisit: "October (Hermosa Festival)",
    recommendedDuration: "3 Days / 2 Nights",
    budgetEstimate: "\u20B15,000 - \u20B19,500 per person",
    transportationOptions: ["Flights to Zamboanga International Airport (ZAM)", "Ferries from Basilan, Jolo, Sandakan"],
    nearbyAirports: ["Zamboanga International Airport (ZAM)"],
    nearbyPorts: ["Zamboanga Port"],
    nearbyTerminals: ["Integrated Bus Terminal Zamboanga"],
    travelTips: ["Book Santa Cruz Island boat tours in advance via DOT Zamboanga", "Try Curacha in Alavar Seafood Restaurant"],
    activities: ["Pink Sand Beach Swimming", "Heritage & Museum Walking Tour", "Weaving Culture Workshop", "Seafood Dining"],
    isFeatured: true,
    searchCount: 1450,
    favoriteCount: 810
  },
  {
    id: "dest-lake-sebu",
    name: "Lake Sebu",
    slug: "lake-sebu",
    province: "South Cotabato",
    region: "SOCCSKSARGEN (Region XII)",
    heroImage: "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Misty highland sanctuary of the T\u2019boli tribe, tranquil lakes, and the Seven Falls.",
    longDescription: "Lake Sebu is a serene mountain lake town surrounded by rainforests and indigenous T\u2019boli culture. Famous for its breathtaking Seven Falls zipline, tilapia aquaculture, and traditional T\u2019nalak dream-weaving.",
    category: "mountains",
    attractions: ["Seven Falls Zipline & Trek", "Lake Sebu Waters", "Punta Isla Lake Resort", "T\u2019boli Museum & Vernacular Schools", "Sunrise Viewpoints"],
    bestTimeToVisit: "November to April",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,500 - \u20B16,500 per person",
    transportationOptions: ["Van or Bus from General Santos City or Koronadal"],
    nearbyAirports: ["General Santos International Airport (GES) + 1.5hr drive"],
    nearbyPorts: [],
    nearbyTerminals: ["Koronadal / Surallah Transport Terminals"],
    travelTips: ["Taste fresh grilled tilapia at Punta Isla restaurant overlooking the lake", "Respect indigenous T\u2019boli customs"],
    activities: ["Seven Falls Zipline", "Wooden Canoe Boat Ride", "Cultural Weaving Tour", "Highland Photography"],
    isFeatured: true,
    searchCount: 1120,
    favoriteCount: 690
  },
  {
    id: "dest-surigao",
    name: "Surigao City & Islands",
    slug: "surigao-city",
    province: "Surigao del Norte",
    region: "Region XIII (Caraga)",
    heroImage: "https://images.unsplash.com/photo-1510414842594-a61c69b5ae57?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Gateway to island adventures, Bucas Grande Sohoton Cove, and rich mining heritage.",
    longDescription: "Surigao City sits at the northeastern tip of Mindanao. It serves as the primary jump-off point to Siargao Island and the mesmerizing stingless jellyfish lagoons of Sohoton Cove in Bucas Grande.",
    category: "islands",
    attractions: ["Sohoton Cove National Park (Bucas Grande)", "Magkukuob Cave", "Punta Bililar Lighthouse", "Fabrica Beach", "Day-asan Floating Village"],
    bestTimeToVisit: "March to October",
    recommendedDuration: "3 Days / 2 Nights",
    budgetEstimate: "\u20B14,000 - \u20B18,000 per person",
    transportationOptions: ["Ferries from Cebu, Leyte, and Siargao", "Bus from Butuan or Davao", "Flights to Surigao Airport (SUG)"],
    nearbyAirports: ["Surigao Airport (SUG)"],
    nearbyPorts: ["Surigao City Port / Lipata Ferry Terminal"],
    nearbyTerminals: ["Surigao Integrated Bus Terminal"],
    travelTips: ["Hire certified boat operators when entering Sohoton Cove", "Try local kinilaw"],
    activities: ["Sohoton Cove Exploration", "Jellyfish Lagoon Swimming", "Cave Spelunking", "Island Hopping"],
    isFeatured: false,
    searchCount: 1280,
    favoriteCount: 710
  },
  {
    id: "dest-dinagat",
    name: "Dinagat Islands",
    slug: "dinagat-islands",
    province: "Dinagat Islands",
    region: "Region XIII (Caraga)",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Mystical islands of pristine rock formations, blue lagoons, and untouched white sand beaches.",
    longDescription: "Dinagat Islands is an unspoiled paradise in Northeastern Mindanao featuring dramatic limestone karsts, secret blue lagoons like Bababu Lake, pristine beaches, and warm local hospitality.",
    category: "islands",
    attractions: ["Bababu Lake & Cave", "Isla Aga", "Jubangan Mining View Deck", "Bitaogan Beach", "Puyo Lake"],
    bestTimeToVisit: "April to September",
    recommendedDuration: "3 Days / 2 Nights",
    budgetEstimate: "\u20B15,000 - \u20B19,000 per person",
    transportationOptions: ["Ferry from Surigao City Port to San Jose, Dinagat"],
    nearbyAirports: ["Surigao Airport (SUG) + Ferry"],
    nearbyPorts: ["San Jose Port, Dinagat"],
    nearbyTerminals: ["San Jose Municipal Port"],
    travelTips: ["Coordinate with provincial tourism office for island boat rentals", "Bring cash as banking facilities are scarce"],
    activities: ["Lagoon Swimming", "Rock Formation Trekking", "Island Camping", "Snorkeling"],
    isFeatured: false,
    searchCount: 940,
    favoriteCount: 550
  },
  {
    id: "dest-mati",
    name: "Mati City (Dahican)",
    slug: "mati-city-dahican",
    province: "Davao Oriental",
    region: "Region XI (Davao Region)",
    heroImage: "https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Home of Dahican Beach, paradise for skimboarders, sea turtles, and sunrise lovers.",
    longDescription: "Mati City in Davao Oriental faces the Pacific Ocean, offering the legendary 7-kilometer crescent white sand of Dahican Beach. Famous for surfing, skimboarding, marine turtle nesting sanctuaries, and breathtaking Sleeping Dinosaur island view.",
    category: "beaches",
    attractions: ["Dahican Beach", "Sleeping Dinosaur Island Viewpoint", "Mindanao\u865F Sanctuary", "Waniban Island", "Cuabo Island"],
    bestTimeToVisit: "October to March (Wave & Breeze Season)",
    recommendedDuration: "3 Days / 2 Nights",
    budgetEstimate: "\u20B14,000 - \u20B17,500 per person",
    transportationOptions: ["Bus or Van from Davao City Ecoland Terminal (3.5 hrs)"],
    nearbyAirports: ["Davao International Airport (DVO) + 3.5hr drive"],
    nearbyPorts: ["Mati Port"],
    nearbyTerminals: ["Mati Integrated Bus Terminal"],
    travelTips: ["Watch professional skimboarders practice at Dahican at sunrise", "Stop by the Sleeping Dinosaur viewpoint along the highway"],
    activities: ["Skimboarding Lessons", "Surfing", "Island Hopping", "Sunrise Beach Camping"],
    isFeatured: true,
    searchCount: 1620,
    favoriteCount: 980
  },
  {
    id: "dest-gensan",
    name: "General Santos City",
    slug: "general-santos-city",
    province: "South Cotabato",
    region: "SOCCSKSARGEN (Region XII)",
    heroImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Tuna Capital of the Philippines and southern economic powerhouse.",
    longDescription: "General Santos City (GenSan) is famous worldwide for its booming sashimi-grade yellowfin tuna industry. Enjoy bustling fish ports, modern malls, rich cultural festivals like Tuna Festival, and gateway to Lake Sebu and Sarangani.",
    category: "cities",
    attractions: ["General Santos Fish Port Complex", "Tuna Festival (September)", "Plaza Heneral Santos", "Queen Tuna Park", "Sarangani Highlands"],
    bestTimeToVisit: "September (Tuna Festival)",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,500 - \u20B16,500 per person",
    transportationOptions: ["Flights to General Santos Airport (GES)", "Buses from Davao, Cotabato, Koronadal"],
    nearbyAirports: ["General Santos International Airport (GES)"],
    nearbyPorts: ["Makar Wharf / Fish Port"],
    nearbyTerminals: ["Bulaong Integrated Bus Terminal"],
    travelTips: ["Visit the fish port early in the morning (around 6 AM) to witness the tuna auction", "Eat fresh sashimi at local seafood grills"],
    activities: ["Fish Port Tour", "Sashimi & Seafood Tasting", "Highland Dining at Sarangani Highlands", "Shopping"],
    isFeatured: false,
    searchCount: 1150,
    favoriteCount: 620
  },
  {
    id: "dest-butuan",
    name: "Butuan City",
    slug: "butuan-city",
    province: "Agusan del Norte",
    region: "Region XIII (Caraga)",
    heroImage: "https://images.unsplash.com/photo-1508873696983-2df5c92064c5?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Historic home of ancient Balangay boats and the gateway to Caraga region.",
    longDescription: "Butuan is one of the oldest settlements in the Philippines, renowned for archaeological discoveries of ancient balangay wooden boats dating back to the 4th century, Agusan River culture, and regional connectivity.",
    category: "cultural",
    attractions: ["Balangay Shrine Museum", "National Museum Butuan", "Agusan River Cruise", "Banza Church Ruins", "Mount Mayapay"],
    bestTimeToVisit: "May (Balangay Festival)",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,000 - \u20B16,000 per person",
    transportationOptions: ["Flights to Butuan Airport (BXU)", "Buses from CDO, Davao, Surigao"],
    nearbyAirports: ["Bancasi Airport / Butuan Airport (BXU)"],
    nearbyPorts: ["Port of Nasipit"],
    nearbyTerminals: ["Butuan City Integrated Bus Terminal"],
    travelTips: ["Explore the Balangay replica site to learn about ancient pre-colonial maritime history", "Take an Agusan River sunset boat ride"],
    activities: ["Museum & Heritage Tours", "River Cruising", "Mountain Hiking", "Historical Sightseeing"],
    isFeatured: false,
    searchCount: 990,
    favoriteCount: 530
  },
  {
    id: "dest-hinatuan",
    name: "Hinatuan Enchanted River",
    slug: "hinatuan-enchanted-river",
    province: "Surigao del Sur",
    region: "Region XIII (Caraga)",
    heroImage: "https://images.unsplash.com/photo-1432821596592-e2c18b78144f?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "A mystical, deep blue freshwater river hidden in the jungles of Hinatuan.",
    longDescription: "The Enchanted River of Hinatuan is a deep spring river of unbelievable crystal-clear turquoise and sapphire blue water. Surrounded by lush jungle folklore and feeding into the Pacific Ocean, it is one of Mindanao\u2019s greatest natural wonders.",
    category: "waterfalls",
    attractions: ["Enchanted River Main Spring", "Talisay Fish Feeding Spectacle", "Cambugahay-style river swimming", "Sibadan Fish Cage"],
    bestTimeToVisit: "March to October (Dry Season)",
    recommendedDuration: "Day Trip from Surigao/Bislig",
    budgetEstimate: "\u20B12,500 - \u20B14,500 per person",
    transportationOptions: ["Bus from Butuan or San Francisco to Hinatuan town + habal-habal"],
    nearbyAirports: ["Butuan Airport (BXU) + 3hr drive", "Davao Airport + 4hr drive"],
    nearbyPorts: ["Port of Lianga"],
    nearbyTerminals: ["Hinatuan Bus Terminal"],
    travelTips: ["Be present at exactly 12:00 PM for the daily fish feeding ceremony and siren song", "Wear water shoes for rocky riverbeds"],
    activities: ["River Swimming", "Fish Feeding Viewing", "Boat Riding", "Jungle Photography"],
    isFeatured: true,
    searchCount: 1980,
    favoriteCount: 1350
  },
  {
    id: "dest-tinuyan",
    name: "Tinuy-an Falls (Bislig)",
    slug: "tinuyan-falls-bislig",
    province: "Surigao del Sur",
    region: "Region XIII (Caraga)",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "The Niagara Falls of the Philippines\u2014a majestic 95-meter wide multi-tiered curtain of water.",
    longDescription: "Tinuy-an Falls in Bislig City is widely regarded as the widest waterfall in the Philippines. Spanning 95 meters across and 55 meters high, it produces a majestic white veil of water accompanied by perpetual rainbows.",
    category: "waterfalls",
    attractions: ["Tinuy-an Main Falls", "Bamboo Raft ride under the waterfall", "Hinayagan Cave", "Lake Margie"],
    bestTimeToVisit: "Year-round (Best mornings for rainbows)",
    recommendedDuration: "Day trip or 1 Night",
    budgetEstimate: "\u20B12,500 - \u20B15,000 per person",
    transportationOptions: ["Bus to Bislig (Barobo/San Francisco) + habal-habal to Tinuy-an"],
    nearbyAirports: ["Butuan Airport (BXU) or Davao Airport (DVO)"],
    nearbyPorts: ["Bislig Port"],
    nearbyTerminals: ["Bislig Integrated Bus Terminal"],
    travelTips: ["Take the bamboo raft ride right under the crashing cascade for an unforgettable thrill", "Visit early around 8 AM for calm lighting and rainbows"],
    activities: ["Bamboo Rafting under Falls", "Waterfall Bathing", "Nature Trekking", "Photography"],
    isFeatured: true,
    searchCount: 1750,
    favoriteCount: 1120
  },
  {
    id: "dest-cotabato",
    name: "Cotabato City",
    slug: "cotabato-city",
    province: "Maguindanao del Norte",
    region: "BARMM",
    heroImage: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Historic cultural crossroads and home of the magnificent Sultan Kudarat Grand Mosque.",
    longDescription: "Cotabato City serves as the regional center of BARMM. It features stunning Islamic architecture including the Grand Mosque (largest in the Philippines), Rio Grande de Mindanao, Timanan hills, and rich cultural heritage.",
    category: "cultural",
    attractions: ["Sultan Haji Hassanal Bolkiah Mosque (Grand Mosque)", "Tamontaka Church", "Rio Grande de Mindanao", "Kutang Bato Caves", "Awang Airport gateway"],
    bestTimeToVisit: "Year-round",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,000 - \u20B16,000 per person",
    transportationOptions: ["Flights to Awang Airport (CBO)", "Buses from Davao, GenSan, Kidapawan"],
    nearbyAirports: ["Awang Airport (CBO)"],
    nearbyPorts: ["Cotabato River Port"],
    nearbyTerminals: ["Cotabato Integrated Terminal"],
    travelTips: ["Dress modestly when visiting mosques and cultural sites", "Try local pastil wrapped in banana leaves"],
    activities: ["Mosque Architectural Tour", "River Heritage Cruise", "Cultural Food Tasting", "Historical Exploration"],
    isFeatured: false,
    searchCount: 780,
    favoriteCount: 420
  },
  {
    id: "dest-dipolog",
    name: "Dipolog City",
    slug: "dipolog-city",
    province: "Zamboanga del Norte",
    region: "Zamboanga Peninsula (Region IX)",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Gateway to Western Mindanao and the Sardines Capital of the Philippines.",
    longDescription: "Dipolog City is a peaceful, clean coastal city renowned for canned sardines, Linabo Peak with its 3,003 steps, Cogon eco-park, and proximity to Dapitan City (where Dr. Jose Rizal was exiled).",
    category: "cities",
    attractions: ["Linabo Peak (3,003 Steps)", "Sunset Boulevard Dipolog", "Rizal Shrine Dapitan (nearby)", "Cogon Eco-Tourism Park", "Galas Beach"],
    bestTimeToVisit: "July (Pagsalabuk Festival)",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,000 - \u20B15,500 per person",
    transportationOptions: ["Flights to Dipolog Airport (DPL)", "Ferries from Dumaguete and Cebu"],
    nearbyAirports: ["Dipolog Airport (DPL)"],
    nearbyPorts: ["Pulauan Port (Dapitan) / Dipolog Port"],
    nearbyTerminals: ["Dipolog Integrated Bus Terminal"],
    travelTips: ["Buy famous Dipolog canned sardines as pasalubong", "Climb Linabo Peak early morning for panoramic views"],
    activities: ["Peak Climbing", "Sunset Boulevard Strolling", "Historical Dapitan Tour", "Seafood Dining"],
    isFeatured: false,
    searchCount: 650,
    favoriteCount: 380
  },
  {
    id: "dest-ozamiz",
    name: "Ozamiz City",
    slug: "ozamiz-city",
    province: "Misamis Occidental",
    region: "Region X (Northern Mindanao)",
    heroImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "Historic port city featuring Cotta Shrine and gateway to Panguil Bay.",
    longDescription: "Ozamiz City is a vibrant trading and port hub in Misamis Occidental across the bay from Lanao del Norte. Highlights include the Spanish-era Cotta Stone Fort and underground tunnels.",
    category: "cultural",
    attractions: ["Cotta Shrine & Fort Concepcion y Virgen", "Subanen Culture", "Horton Park", "Tangub City (Christmas Symbol City nearby)"],
    bestTimeToVisit: "July (Subayan Keg Subanon Festival)",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,000 - \u20B15,500 per person",
    transportationOptions: ["Flights to Labo Airport (OZC)", "Ferries from Iligan, Tubod, and Cebu"],
    nearbyAirports: ["Labo Airport (OZC)"],
    nearbyPorts: ["Ozamiz Port / Mukas Ferry Terminal"],
    nearbyTerminals: ["Ozamiz Integrated Bus Terminal"],
    travelTips: ["Take the RoRo ferry across Panguil Bay to Mukas for fast land transit to Iligan/CDO", "Visit Cotta Shrine at sunset"],
    activities: ["Fort & Museum Tour", "Baywalk Strolling", "Local Heritage Exploring", "Food Tasting"],
    isFeatured: false,
    searchCount: 590,
    favoriteCount: 310
  },
  {
    id: "dest-pagadian",
    name: "Pagadian City",
    slug: "pagadian-city",
    province: "Zamboanga del Sur",
    region: "Zamboanga Peninsula (Region IX)",
    heroImage: "https://images.unsplash.com/photo-1508873696983-2df5c92064c5?auto=format&fit=crop&w=1200&q=80",
    shortDescription: "The Little Hong Kong of the South famous for unique angled tricycles and hilly terrain.",
    longDescription: "Pagadian City is built on rolling hills overlooking Illana Bay. It is famously known as the only city in the Philippines with tricycles specially customized with an inclined passenger cabin to navigate steep mountain slopes.",
    category: "cities",
    attractions: ["Rotunda Hill", "Dao-Dao Islands", "Spring Protected Area", "Illana Bay Sunset View", "Paseo del Mar"],
    bestTimeToVisit: "Third week of August (Regada Festival)",
    recommendedDuration: "2 Days / 1 Night",
    budgetEstimate: "\u20B13,000 - \u20B15,500 per person",
    transportationOptions: ["Buses from Zamboanga, Dipolog, CDO, and Davao", "Flights to Pagadian Airport (PAG)"],
    nearbyAirports: ["Pagadian Airport (PAG)"],
    nearbyPorts: ["Pagadian Port"],
    nearbyTerminals: ["Pagadian Integrated Bus Terminal"],
    travelTips: ["Ride the iconic inclined tricycle for an authentic Pagadian urban experience", "Visit Dao-Dao islands for swimming"],
    activities: ["Hillside Tricycle Tour", "Island Boat Ride", "Sunset Viewing", "Seafood Tasting"],
    isFeatured: false,
    searchCount: 520,
    favoriteCount: 290
  }
];
var MOCK_OPERATORS = [
  {
    id: "op-mindanao-express",
    name: "Mindanao Express Airlines",
    type: "flight",
    logo: "MXA",
    verified: true,
    rating: 4.8,
    reviewCount: 1420,
    description: "Premier domestic carrier connecting major Mindanao cities and island airports with modern regional turboprops and jets.",
    policies: {
      cancellation: "Refundable up to 24 hours before departure with minor processing fee.",
      baggage: "7kg hand-carry included + 20kg check-in luggage.",
      boarding: "Boarding gate closes 30 minutes prior to scheduled departure."
    }
  },
  {
    id: "op-superferry",
    name: "SuperFerry Mindanao",
    type: "ferry",
    logo: "SFM",
    verified: true,
    rating: 4.6,
    reviewCount: 2180,
    description: "Trusted passenger and RoRo ferry line connecting northern and southern ports of Mindanao with comfortable cabins and tourist seats.",
    policies: {
      cancellation: "Full refund if cancelled 48 hours prior to sailing.",
      baggage: "Up to 30kg personal luggage allowed per passenger.",
      boarding: "Port terminal check-in closes 2 hours before departure."
    }
  },
  {
    id: "op-rural-transit",
    name: "Rural Transit (RTMI)",
    type: "bus",
    logo: "RTMI",
    verified: true,
    rating: 4.7,
    reviewCount: 3850,
    description: "The largest and most dependable bus network across Northern, Western, and Southern Mindanao.",
    policies: {
      cancellation: "Rebookable up to 6 hours before departure time.",
      baggage: "Complimentary luggage storage in bus cargo bay.",
      boarding: "Arrive at bus terminal 30 minutes prior to departure."
    }
  },
  {
    id: "op-bachelor-express",
    name: "Bachelor Express",
    type: "bus",
    logo: "BE",
    verified: true,
    rating: 4.5,
    reviewCount: 2940,
    description: "Providing airconditioned and economy express buses linking Caraga, Davao, and Northern Mindanao regions.",
    policies: {
      cancellation: "Ticket transfer or refund available at terminal ticket counters.",
      baggage: "Standard baggage rules apply.",
      boarding: "Show digital ticket QR code at terminal gate."
    }
  },
  {
    id: "op-cokaliong",
    name: "Cokaliong Shipping Lines",
    type: "ferry",
    logo: "CSL",
    verified: true,
    rating: 4.6,
    reviewCount: 1150,
    description: "Reliable overnight and inter-island passenger ferries connecting CDO, Surigao, Iligan, and Cebu.",
    policies: {
      cancellation: "Refund requests processed within 3-5 business days.",
      baggage: "Generous baggage allowance with secure cargo handling.",
      boarding: "Terminal boarding starts 3 hours before departure."
    }
  }
];
var MOCK_SCHEDULES = [
  // CDO to Camiguin (Bus + Ferry combo or Ferry)
  {
    id: "sch-1",
    operatorId: "op-superferry",
    operatorName: "SuperFerry Mindanao",
    operatorLogo: "SFM",
    transportType: "ferry",
    origin: "Cagayan de Oro",
    destination: "Camiguin Island",
    originTerminal: "Port of Cagayan de Oro",
    destinationTerminal: "Benoni Port, Camiguin",
    departureTime: "2026-10-10T06:00:00",
    arrivalTime: "2026-10-10T09:30:00",
    duration: "3h 30m",
    vehicleType: "High-Speed Catamaran",
    vehicleNumber: "SF-Mindanao-01",
    availableSeats: 48,
    totalSeats: 120,
    baseFare: 850,
    terminalFee: 30,
    serviceFee: 50,
    discountEligible: true,
    sukiEligible: true,
    baggageAllowance: "20kg checked + 7kg hand",
    classType: "Tourist"
  },
  {
    id: "sch-2",
    operatorId: "op-rural-transit",
    operatorName: "Rural Transit (RTMI)",
    operatorLogo: "RTMI",
    transportType: "bus",
    origin: "Cagayan de Oro",
    destination: "Camiguin Island",
    originTerminal: "Agora Bus Terminal (CDO)",
    destinationTerminal: "Balingoan Port (Bus + Ferry)",
    departureTime: "2026-10-10T04:30:00",
    arrivalTime: "2026-10-10T08:30:00",
    duration: "4h 00m",
    vehicleType: "Aircon Bus + RoRo Ferry",
    vehicleNumber: "RTMI-502",
    availableSeats: 18,
    totalSeats: 45,
    baseFare: 480,
    terminalFee: 15,
    serviceFee: 30,
    discountEligible: true,
    sukiEligible: true,
    baggageAllowance: "15kg cargo + hand carry",
    classType: "Aircon"
  },
  // CDO to Davao
  {
    id: "sch-3",
    operatorId: "op-rural-transit",
    operatorName: "Rural Transit (RTMI)",
    operatorLogo: "RTMI",
    transportType: "bus",
    origin: "Cagayan de Oro",
    destination: "Davao City",
    originTerminal: "Bulua Westbound Terminal",
    destinationTerminal: "DCOTT Davao",
    departureTime: "2026-10-10T08:00:00",
    arrivalTime: "2026-10-10T16:30:00",
    duration: "8h 30m",
    vehicleType: "Executive Sleeper Bus",
    vehicleNumber: "RTMI-EX-99",
    availableSeats: 12,
    totalSeats: 36,
    baseFare: 950,
    terminalFee: 20,
    serviceFee: 40,
    discountEligible: true,
    sukiEligible: true,
    baggageAllowance: "20kg cargo",
    classType: "Sleeper"
  },
  {
    id: "sch-4",
    operatorId: "op-mindanao-express",
    operatorName: "Mindanao Express Airlines",
    operatorLogo: "MXA",
    transportType: "flight",
    origin: "Cagayan de Oro",
    destination: "Davao City",
    originTerminal: "Laguindingan Airport (CGY)",
    destinationTerminal: "Davao Airport (DVO)",
    departureTime: "2026-10-10T10:15:00",
    arrivalTime: "2026-10-10T11:05:00",
    duration: "50m",
    vehicleType: "ATR 72-600 Turboprop",
    vehicleNumber: "MX-402",
    availableSeats: 24,
    totalSeats: 72,
    baseFare: 1850,
    terminalFee: 200,
    serviceFee: 80,
    discountEligible: true,
    sukiEligible: true,
    baggageAllowance: "7kg hand + 20kg check",
    classType: "Economy"
  },
  // Davao to Siargao
  {
    id: "sch-5",
    operatorId: "op-mindanao-express",
    operatorName: "Mindanao Express Airlines",
    operatorLogo: "MXA",
    transportType: "flight",
    origin: "Davao City",
    destination: "Siargao Island",
    originTerminal: "Davao Airport (DVO)",
    destinationTerminal: "Siargao Airport (IAO)",
    departureTime: "2026-10-11T07:30:00",
    arrivalTime: "2026-10-11T08:35:00",
    duration: "1h 05m",
    vehicleType: "ATR 72-600",
    vehicleNumber: "MX-881",
    availableSeats: 9,
    totalSeats: 72,
    baseFare: 2450,
    terminalFee: 200,
    serviceFee: 100,
    discountEligible: true,
    sukiEligible: true,
    baggageAllowance: "7kg hand + 20kg check",
    classType: "Economy"
  },
  // Surigao to Siargao Ferry
  {
    id: "sch-6",
    operatorId: "op-cokaliong",
    operatorName: "Cokaliong Shipping Lines",
    operatorLogo: "CSL",
    transportType: "ferry",
    origin: "Surigao City",
    destination: "Siargao Island",
    originTerminal: "Surigao City Port",
    destinationTerminal: "Dapa Port, Siargao",
    departureTime: "2026-10-11T06:00:00",
    arrivalTime: "2026-10-11T08:30:00",
    duration: "2h 30m",
    vehicleType: "Fast RoRo Ferry",
    vehicleNumber: "CK-Surigao-05",
    availableSeats: 65,
    totalSeats: 180,
    baseFare: 420,
    terminalFee: 20,
    serviceFee: 30,
    discountEligible: true,
    sukiEligible: true,
    baggageAllowance: "20kg",
    classType: "Tourist"
  },
  // CDO to Iligan Bus
  {
    id: "sch-7",
    operatorId: "op-bachelor-express",
    operatorName: "Bachelor Express",
    operatorLogo: "BE",
    transportType: "bus",
    origin: "Cagayan de Oro",
    destination: "Iligan City",
    originTerminal: "Bulua Westbound Terminal",
    destinationTerminal: "Iligan Integrated Terminal",
    departureTime: "2026-10-10T09:00:00",
    arrivalTime: "2026-10-10T10:30:00",
    duration: "1h 30m",
    vehicleType: "Aircon Bus",
    vehicleNumber: "BE-210",
    availableSeats: 22,
    totalSeats: 45,
    baseFare: 180,
    terminalFee: 10,
    serviceFee: 15,
    discountEligible: true,
    sukiEligible: true,
    baggageAllowance: "15kg",
    classType: "Aircon"
  },
  // Davao to General Santos
  {
    id: "sch-8",
    operatorId: "op-rural-transit",
    operatorName: "Rural Transit (RTMI)",
    operatorLogo: "RTMI",
    transportType: "bus",
    origin: "Davao City",
    destination: "General Santos City",
    originTerminal: "DCOTT Davao",
    destinationTerminal: "Bulaong Terminal GenSan",
    departureTime: "2026-10-12T07:00:00",
    arrivalTime: "2026-10-12T09:45:00",
    duration: "2h 45m",
    vehicleType: "Deluxe Aircon Bus",
    vehicleNumber: "RTMI-GS-11",
    availableSeats: 15,
    totalSeats: 40,
    baseFare: 320,
    terminalFee: 15,
    serviceFee: 20,
    discountEligible: true,
    sukiEligible: true,
    baggageAllowance: "20kg",
    classType: "Deluxe"
  }
];
var MOCK_VOUCHERS = [
  {
    id: "v-1",
    code: "WELCOME10",
    title: "10% OFF First Booking",
    description: "Welcome to Mindanao Travel Ticketing Hub! Enjoy 10% off on your very first bus, ferry, or flight booking.",
    discountType: "percentage",
    discountValue: 10,
    minSpend: 500,
    maxDiscount: 300,
    validUntil: "2026-12-31",
    eligibleTransport: "all",
    claimed: true
  },
  {
    id: "v-2",
    code: "MINDANAO200",
    title: "\u20B1200 OFF Island Trips",
    description: "Save \u20B1200 on ferry or flight tickets heading to Camiguin, Siargao, or Dinagat Islands.",
    discountType: "fixed",
    discountValue: 200,
    minSpend: 1e3,
    validUntil: "2026-11-30",
    eligibleTransport: "ferry",
    claimed: false
  },
  {
    id: "v-3",
    code: "SUKIGOLD",
    title: "Suki Gold Exclusive: \u20B1500 OFF",
    description: "Special reward voucher for Gold & VIP Suki Travelers across any Mindanao route.",
    discountType: "fixed",
    discountValue: 500,
    minSpend: 2e3,
    validUntil: "2026-12-31",
    eligibleTransport: "all",
    requiredSukiTier: "Gold",
    claimed: false
  },
  {
    id: "v-4",
    code: "BUSBUDDY",
    title: "\u20B1100 OFF Bus Travel",
    description: "Save on long-distance bus trips between CDO, Davao, and Iligan.",
    discountType: "fixed",
    discountValue: 100,
    minSpend: 350,
    validUntil: "2026-10-31",
    eligibleTransport: "bus",
    claimed: true
  }
];
var MOCK_PROMOTIONS = [
  {
    id: "promo-1",
    code: "CAMIGUIN15",
    title: "Weekend Camiguin Getaway",
    subtitle: "White Island & Volcanic Springs Special",
    discountText: "15% OFF",
    transportType: "ferry",
    originalPrice: 950,
    discountedPrice: 807,
    heroImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=600&q=80",
    expiryDate: "2026-10-31",
    isFlashSale: true
  },
  {
    id: "promo-2",
    code: "SIARGAOSURFSAVE",
    title: "Siargao Cloud 9 Surf Pass",
    subtitle: "Fly direct from Davao or CDO",
    discountText: "\u20B1300 OFF",
    transportType: "flight",
    originalPrice: 2750,
    discountedPrice: 2450,
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=600&q=80",
    expiryDate: "2026-11-15",
    isFlashSale: true
  },
  {
    id: "promo-3",
    code: "CDODAVAOBUSECONOMY",
    title: "CDO \u2013 Davao Bus Saver",
    subtitle: "Comfortable aircon sleeper ride across Mindanao",
    discountText: "\u20B1150 OFF",
    transportType: "bus",
    originalPrice: 950,
    discountedPrice: 800,
    heroImage: "https://images.unsplash.com/photo-1508873696983-2df5c92064c5?auto=format&fit=crop&w=600&q=80",
    expiryDate: "2026-10-25",
    isFlashSale: false
  }
];
var MOCK_GUIDES = [
  {
    id: "guide-1",
    slug: "how-to-travel-cdo-to-camiguin",
    title: "How to Travel from Cagayan de Oro to Camiguin Island",
    subtitle: "A complete step-by-step guide on bus and ferry connections for first-timers.",
    category: "Ferry Guides",
    heroImage: "https://images.unsplash.com/photo-1544644181-1484b3fdfc62?auto=format&fit=crop&w=1200&q=80",
    author: "Captain Lakbay",
    date: "October 2, 2026",
    readingTime: "5 min read",
    introduction: "Planning a tropical escape to Camiguin Island from Cagayan de Oro? Whether you prefer a direct high-speed ferry or the scenic bus-and-RoRo combination via Balingoan Port, here is everything you need to know.",
    content: [
      "Step 1: Head to Agora Bus Terminal or Port of Cagayan de Oro in the early morning (around 5:00 AM to 6:00 AM).",
      "Step 2: Choose your travel mode \u2014 take an airconditioned bus bound for Balingoan Port (approx 2 hours), then board the RoRo ferry to Benoni Port, Camiguin (approx 1 hour). Alternatively, take a direct high-speed ferry straight from CDO Port.",
      "Step 3: Upon arrival at Benoni Port, rent a scooter or hire a multi-cab to take you to Mambajao town or your resort.",
      "Step 4: Do not forget to visit White Island at dawn and soak in Ardent Hot Springs at night!"
    ],
    travelTips: [
      "Book your ferry tickets in advance during long weekends and holidays.",
      "Bring motion sickness medication if you are sensitive to boat rides across the Bohol Sea.",
      "Cash is king on Camiguin island as some resorts and restaurants do not accept cards."
    ],
    estimatedBudget: "\u20B11,500 - \u20B13,000 per person one-way",
    howToGetThere: "Depart from Cagayan de Oro via Agora Bus Terminal or CDO Port.",
    thingsToDo: ["Sunrise at White Island", "Sunken Cemetery snorkeling", "Ardent Hot Springs soak", "Eat Pastel bread"],
    transportationTips: "Buses depart hourly from Agora Terminal to Balingoan. Ferries run regularly from 6 AM to 5 PM.",
    relatedDestinations: ["camiguin-island", "cagayan-de-oro"],
    isFeatured: true
  },
  {
    id: "guide-2",
    slug: "complete-siargao-travel-guide",
    title: "Complete Siargao Island Travel Guide 2026",
    subtitle: "Surf breaks, secret lagoons, coconut roads, and island hopping adventures.",
    category: "Island Travel",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80",
    author: "Maria Santos",
    date: "September 28, 2026",
    readingTime: "7 min read",
    introduction: "Siargao is more than just the surf capital of the Philippines\u2014it is a haven of coconut palm trees, crystal blue lagoons, world-class cafes, and unforgettable island culture.",
    content: [
      "Getting There: You can fly direct to Siargao Airport (IAO) from Manila, Cebu, or Davao via Mindanao Express or partner airlines. Alternatively, take a ferry from Surigao City Port to Dapa.",
      "Where to Stay: General Luna is the center of action with beachfront hostels, surf camps, and boutique resorts.",
      "Must-See Spots: Cloud 9 boardwalk for sunrise surfing, Sugba Lagoon for paddleboarding, and Magpupungko Rock Pools during low tide."
    ],
    travelTips: [
      "Rent a scooter with surfboard racks if you plan to surf.",
      "Always check the tide schedules for Magpupungko Rock Pools.",
      "Support local eco-initiatives by avoiding single-use plastics."
    ],
    estimatedBudget: "\u20B17,000 - \u20B115,000 per person",
    howToGetThere: "Direct flight to IAO airport or ferry via Surigao Port.",
    thingsToDo: ["Surf at Cloud 9", "Paddleboard Sugba Lagoon", "Island hop to Daku & Naked Island", "Eat fresh seafood"],
    transportationTips: "Tricycles are the main public transport in General Luna. Scooters are best for long-distance island trips.",
    relatedDestinations: ["siargao-island", "surigao-city"],
    isFeatured: true
  },
  {
    id: "guide-3",
    slug: "budget-travel-guide-bukidnon",
    title: "Budget Travel Guide to Bukidnon Highlands",
    subtitle: "Pine forests, cool mountain air, and high-altitude adventures on a budget.",
    category: "Budget Travel",
    heroImage: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80",
    author: "Jake Adventurer",
    date: "September 15, 2026",
    readingTime: "4 min read",
    introduction: "Escape the tropical heat and journey up to the verdant highlands of Bukidnon. From Dahilayan adventure park to the majestic Monastery of the Transfiguration, here is how to explore for less.",
    content: [
      "Transport: Take a Rural Transit bus from Cagayan de Oro Agora or Bulua terminal bound for Malaybalay or Manolo Fortich.",
      "Accommodation: Cozy mountain lodges and farm stays offer breathtaking sunrise views without breaking the bank.",
      "Highlights: Pineapple fields, strawberry picking, and cool highland coffee."
    ],
    travelTips: [
      "Pack a warm sweater for chilly evenings.",
      "Book group vans for easier navigation around Malaybalay and Dahilayan."
    ],
    estimatedBudget: "\u20B13,500 - \u20B16,000 per person",
    howToGetThere: "Bus from Cagayan de Oro to Bukidnon terminals.",
    thingsToDo: ["Visit Dahilayan Adventure Park", "Monastery meditation", "Pineapple plantation tour"],
    transportationTips: "Buses run frequently every 30 minutes from CDO.",
    relatedDestinations: ["bukidnon-highlands", "cagayan-de-oro"],
    isFeatured: false
  }
];
var MOCK_REVIEWS = [
  {
    id: "rev-1",
    bookingId: "bk-101",
    userName: "Atty. Marco Alcantara",
    userAvatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    overall: 5,
    comfort: 5,
    punctuality: 5,
    staff: 5,
    cleanliness: 5,
    comment: "Super smooth booking and seamless digital QR ticket check-in for our SuperFerry trip to Camiguin! Saved time and points.",
    date: "October 1, 2026",
    operatorName: "SuperFerry Mindanao",
    route: "Cagayan de Oro \u2192 Camiguin"
  },
  {
    id: "rev-2",
    bookingId: "bk-102",
    userName: "Bea Alonzo-Cruz",
    userAvatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=100&q=80",
    rating: 5,
    overall: 5,
    comfort: 4,
    punctuality: 5,
    staff: 5,
    cleanliness: 5,
    comment: "Rural Transit sleeper bus from CDO to Davao was extremely comfortable and clean. Highly recommend MTTH for easy ticketing!",
    date: "September 27, 2026",
    operatorName: "Rural Transit (RTMI)",
    route: "Cagayan de Oro \u2192 Davao City"
  },
  {
    id: "rev-3",
    bookingId: "bk-103",
    userName: "Kahlil Ramos",
    userAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&q=80",
    rating: 4,
    overall: 4,
    comfort: 5,
    punctuality: 4,
    staff: 4,
    cleanliness: 4,
    comment: "Flown with Mindanao Express to Siargao. Great service, on-time departure, and earned Suki points instantly!",
    date: "September 20, 2026",
    operatorName: "Mindanao Express Airlines",
    route: "Davao City \u2192 Siargao Island"
  }
];
var createBlankSukiAccount = (userId, name, email) => ({
  userId,
  name,
  email,
  tier: "Starter",
  points: 100,
  // Welcome bonus points
  pointsToNextTier: 900,
  completedTrips: 0,
  vouchersCount: 1,
  joinedDate: "October 2026",
  avatar: ""
});
var createBlankUserProfile = (id, fullName, email, phone = "") => {
  const parts = fullName.trim().split(" ");
  const firstName = parts[0] || "";
  const lastName = parts.slice(1).join(" ") || "";
  return {
    id,
    fullName,
    firstName,
    lastName,
    avatarUrl: "",
    email,
    phone,
    dob: "2000-01-01",
    gender: "other",
    nationality: "Filipino",
    address: {
      street: "",
      city: "",
      province: "",
      region: "",
      zipCode: ""
    },
    emergencyContact: {
      name: "",
      relationship: "",
      phone: ""
    },
    travelPreferences: {
      seatPreference: "window",
      specialAssistance: false,
      frequentFlyerNo: "",
      preferredBusClass: "Aircon",
      preferredFerryClass: "Tourist"
    },
    notificationSettings: {
      emailTripUpdates: true,
      smsDepartureAlerts: true,
      promotionalOffers: true
    },
    kyc: {
      status: "unverified",
      idType: "philsys_national_id",
      idNumber: "",
      submittedAt: "",
      verifiedAt: "",
      verificationCode: ""
    }
  };
};
var INITIAL_SUKI_ACCOUNT = createBlankSukiAccount("guest-user", "Guest Traveler", "");
var INITIAL_USER_PROFILE = createBlankUserProfile("guest-user", "Guest Traveler", "");
var MOCK_CUSTOMERS_KYC = [];
var MOCK_POINT_HISTORY = [];
var MOCK_SUPPORT_TICKETS = [];
var MOCK_NOTIFICATIONS = [];
var DEFAULT_SAMPLE_BOOKINGS = [];

// server.ts
dotenv.config();
var __filename = fileURLToPath(import.meta.url);
var __dirname = path.dirname(__filename);
var app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
var DB_FILE = path.join(__dirname, "server-db.json");
var dbState = {};
try {
  if (fs.existsSync(DB_FILE)) {
    const raw = fs.readFileSync(DB_FILE, "utf-8");
    if (raw && raw.trim().length > 0) {
      dbState = JSON.parse(raw);
    }
  }
} catch (err) {
  console.warn("Notice: Rebuilding DB state from defaults:", err);
}
var schedulesStore = Array.isArray(dbState.schedules) && dbState.schedules.length > 0 ? dbState.schedules : [...MOCK_SCHEDULES];
var vouchersStore = Array.isArray(dbState.vouchers) && dbState.vouchers.length > 0 ? dbState.vouchers : [...MOCK_VOUCHERS];
var bookingsStore = Array.isArray(dbState.bookings) && dbState.bookings.length > 0 ? dbState.bookings : [...DEFAULT_SAMPLE_BOOKINGS];
var customersKycStore = Array.isArray(dbState.customersKyc) && dbState.customersKyc.length > 0 ? dbState.customersKyc : [...MOCK_CUSTOMERS_KYC];
var subAdminsStore = Array.isArray(dbState.subAdmins) && dbState.subAdmins.length > 0 ? dbState.subAdmins : [
  {
    id: "sub-super-admin",
    name: "Mark Kenneth Ulgasan",
    email: "markkennethulgasan@gmail.com",
    role: "Super Admin",
    status: "Active",
    permissions: ["Full Access", "Super Admin", "Manage Bookings", "Manage Operators", "Issue Refunds", "Site Settings"],
    createdAt: "2026-10-01",
    lastActive: "Online now"
  },
  {
    id: "sub-1",
    name: "Carlos Mendoza",
    email: "carlos.ops@mtth.ph",
    role: "Operations Admin",
    status: "Active",
    permissions: ["Manage Bookings", "Manage Operators", "Issue Refunds"],
    createdAt: "2026-08-12",
    lastActive: "10 mins ago"
  },
  {
    id: "sub-2",
    name: "Eileen Dalisay",
    email: "eileen.ticketing@mtth.ph",
    role: "Ticketing Agent",
    status: "Active",
    permissions: ["Manage Bookings", "Issue Tickets"],
    createdAt: "2026-09-01",
    lastActive: "1 hour ago"
  },
  {
    id: "sub-3",
    name: "Ramon Bautista",
    email: "ramon.support@mtth.ph",
    role: "Support Agent",
    status: "Active",
    permissions: ["Manage Support", "Review Inquiries"],
    createdAt: "2026-09-15",
    lastActive: "Yesterday"
  }
];
var siteSettingsStore = dbState.siteSettings || {
  siteName: "MTTH",
  siteSubtitle: "Mindanao",
  tagline: "Your Journey Starts Here",
  logoUrl: "",
  contactEmail: "support@mtth.ph",
  contactPhone: "+63 88 123 4567",
  announcementText: "Mindanao Travel Week \u2014 Earn 2X Suki Points on selected routes",
  announcementActive: true,
  allowNewRegistrations: true,
  currency: "PHP (\u20B1)"
};
var sukiStore = dbState.sukiAccount || { ...INITIAL_SUKI_ACCOUNT };
var registeredUsersStore = Array.isArray(dbState.registeredUsers) ? dbState.registeredUsers : [];
var pointHistoryStore = [...MOCK_POINT_HISTORY];
var supportTicketsStore = [...MOCK_SUPPORT_TICKETS];
var notificationsStore = [...MOCK_NOTIFICATIONS];
var saveDb = () => {
  try {
    const data = {
      schedules: schedulesStore,
      vouchers: vouchersStore,
      bookings: bookingsStore,
      customersKyc: customersKycStore,
      subAdmins: subAdminsStore,
      siteSettings: siteSettingsStore,
      sukiAccount: sukiStore,
      registeredUsers: registeredUsersStore
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), "utf-8");
  } catch (err) {
    console.error("Failed to write to DB_FILE:", err);
  }
};
saveDb();
var stateVersion = Date.now();
var sseClients = /* @__PURE__ */ new Set();
var broadcastState = () => {
  stateVersion = Date.now();
  const payload = JSON.stringify({
    type: "update",
    version: stateVersion,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    data: {
      schedules: schedulesStore,
      vouchers: vouchersStore,
      bookings: bookingsStore,
      customersKyc: customersKycStore,
      subAdmins: subAdminsStore,
      siteSettings: siteSettingsStore,
      sukiAccount: sukiStore,
      registeredUsers: registeredUsersStore
    }
  });
  const message = `data: ${payload}

`;
  for (const client of Array.from(sseClients)) {
    try {
      client.write(message);
    } catch {
      sseClients.delete(client);
    }
  }
};
var apiKey = process.env.GEMINI_API_KEY;
var ai = apiKey ? new GoogleGenAI({ apiKey }) : null;
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: (/* @__PURE__ */ new Date()).toISOString() });
});
app.get("/api/destinations", (req, res) => {
  const { category, search } = req.query;
  let results = [...MOCK_DESTINATIONS];
  if (category && category !== "all") {
    results = results.filter((d) => d.category === category);
  }
  if (search && typeof search === "string") {
    const q = search.toLowerCase();
    results = results.filter((d) => d.name.toLowerCase().includes(q) || d.province.toLowerCase().includes(q) || d.shortDescription.toLowerCase().includes(q));
  }
  res.json(results);
});
app.get("/api/destinations/:slug", (req, res) => {
  const dest = MOCK_DESTINATIONS.find((d) => d.slug === req.params.slug);
  if (!dest) {
    return res.status(404).json({ error: "Destination not found" });
  }
  res.json(dest);
});
app.get("/api/operators", (req, res) => {
  res.json(MOCK_OPERATORS);
});
app.get("/api/schedules", (req, res) => {
  const { origin, destination, transportType, date } = req.query;
  let schedules = [...schedulesStore];
  if (origin && typeof origin === "string") {
    schedules = schedules.filter((s) => s.origin.toLowerCase().includes(origin.toLowerCase()));
  }
  if (destination && typeof destination === "string") {
    schedules = schedules.filter((s) => s.destination.toLowerCase().includes(destination.toLowerCase()));
  }
  if (transportType && transportType !== "all") {
    schedules = schedules.filter((s) => s.transportType === transportType);
  }
  res.json(schedules);
});
app.get("/api/vouchers", (req, res) => {
  res.json(vouchersStore);
});
app.post("/api/vouchers/claim", (req, res) => {
  const { voucherId } = req.body;
  vouchersStore = vouchersStore.map((v) => v.id === voucherId ? { ...v, claimed: true } : v);
  res.json({ success: true, vouchers: vouchersStore });
});
app.get("/api/promotions", (req, res) => {
  res.json(MOCK_PROMOTIONS);
});
app.get("/api/guides", (req, res) => {
  res.json(MOCK_GUIDES);
});
app.get("/api/guides/:slug", (req, res) => {
  const guide = MOCK_GUIDES.find((g) => g.slug === req.params.slug);
  if (!guide) {
    return res.status(404).json({ error: "Guide not found" });
  }
  res.json(guide);
});
app.get("/api/reviews", (req, res) => {
  res.json(MOCK_REVIEWS);
});
app.get("/api/suki", (req, res) => {
  res.json({
    account: sukiStore,
    pointHistory: pointHistoryStore
  });
});
app.get("/api/bookings", (req, res) => {
  res.json(bookingsStore);
});
app.post("/api/bookings", (req, res) => {
  const bookingData = req.body;
  const newBooking = {
    id: `bk-${Date.now()}`,
    bookingCode: `MTTH-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
    userId: bookingData.userId || sukiStore.userId || "guest-user",
    ...bookingData,
    status: "confirmed",
    createdAt: (/* @__PURE__ */ new Date()).toISOString(),
    qrCodeToken: `MTTH-QR-SECURE-${Date.now()}`
  };
  bookingsStore.unshift(newBooking);
  const pointsEarned = Math.round(newBooking.totalPaid * 0.1);
  sukiStore.points += pointsEarned;
  sukiStore.completedTrips += 1;
  pointHistoryStore.unshift({
    id: `pt-${Date.now()}`,
    date: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    description: `Booking completed: ${newBooking.origin} to ${newBooking.destination}`,
    pointsChange: pointsEarned,
    type: "earned"
  });
  notificationsStore.unshift({
    id: `notif-${Date.now()}`,
    title: "Booking Confirmed!",
    message: `Your trip from ${newBooking.origin} to ${newBooking.destination} is confirmed. Booking Code: ${newBooking.bookingCode}`,
    type: "booking",
    timestamp: "Just now",
    read: false,
    link: "/my-trips"
  });
  saveDb();
  broadcastState();
  res.json(newBooking);
});
app.get("/api/tickets/verify/:code", (req, res) => {
  const query = (req.params.code || "").trim().toLowerCase();
  if (!query) {
    return res.status(400).json({ found: false, error: "Reference number is required" });
  }
  const cleanQuery = query.replace(/[^a-z0-9]/g, "");
  const match = bookingsStore.find((b) => {
    const code = (b.bookingCode || "").toLowerCase();
    const id = (b.id || "").toLowerCase();
    const qr = (b.qrCodeToken || "").toLowerCase();
    const cleanCode = code.replace(/[^a-z0-9]/g, "");
    const cleanQr = qr.replace(/[^a-z0-9]/g, "");
    return code === query || id === query || qr === query || cleanCode === cleanQuery || cleanQr.includes(cleanQuery) || cleanQuery.length >= 6 && cleanCode.includes(cleanQuery);
  });
  if (match) {
    res.json({
      found: true,
      verified: match.status === "confirmed",
      status: match.status,
      booking: match,
      verifiedAt: (/* @__PURE__ */ new Date()).toISOString(),
      authenticityCertificate: `MTTH-AUTH-DOT-${match.bookingCode}-${Date.now().toString(36).toUpperCase()}`
    });
  } else {
    res.json({
      found: false,
      verified: false,
      error: `Ticket reference "${req.params.code}" was not found in the verified ticketing ledger.`
    });
  }
});
app.post("/api/bookings/:id/cancel", (req, res) => {
  const { id } = req.body;
  bookingsStore = bookingsStore.map((b) => {
    if (b.id === req.params.id) {
      return {
        ...b,
        status: "cancelled",
        refundStatus: "requested",
        refundAmount: Math.round(b.totalPaid * 0.8)
      };
    }
    return b;
  });
  saveDb();
  broadcastState();
  res.json({ success: true, bookings: bookingsStore });
});
app.get("/api/support", (req, res) => {
  res.json(supportTicketsStore);
});
app.post("/api/support", (req, res) => {
  const ticket = req.body;
  const newTicket = {
    id: `sup-${Date.now()}`,
    ticketNo: `MTTH-${Math.floor(1e3 + Math.random() * 9e3)}`,
    ...ticket,
    status: "Open",
    createdAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0],
    updatedAt: (/* @__PURE__ */ new Date()).toISOString().split("T")[0]
  };
  supportTicketsStore.unshift(newTicket);
  res.json(newTicket);
});
app.get("/api/notifications", (req, res) => {
  res.json(notificationsStore);
});
app.post("/api/notifications/read", (req, res) => {
  notificationsStore = notificationsStore.map((n) => ({ ...n, read: true }));
  res.json({ success: true });
});
app.post("/api/ai/recommend", async (req, res) => {
  const { prompt, destination, budget, style } = req.body;
  if (!ai) {
    return res.json({
      recommendation: `Here is a wonderful itinerary for ${destination || "Mindanao"}! Enjoy exploring the stunning beaches, local culture, and delicious cuisine with a budget of ${budget || "moderate"}. (AI API Key not configured, showing smart curation).`
    });
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.8-flash",
      contents: `You are an expert Mindanao travel concierge for Mindanao Travel Ticketing Hub (MTTH). Provide a warm, helpful, detailed travel recommendation and 3-day itinerary for destination "${destination || "Camiguin"}", travel style "${style || "Adventure & Leisure"}", and budget "${budget || "Mid-range"}". ${prompt || ""}. IMPORTANT: Do NOT use any emojis in your response. Keep all formatting clean, professional, and readable without emojis.`
    });
    res.json({ recommendation: response.text });
  } catch (error) {
    console.error("Gemini AI error:", error);
    res.status(500).json({ error: "Failed to generate AI recommendation" });
  }
});
app.get("/api/admin/state", (req, res) => {
  res.json({
    version: stateVersion,
    schedules: schedulesStore,
    vouchers: vouchersStore,
    bookings: bookingsStore,
    customersKyc: customersKycStore,
    subAdmins: subAdminsStore,
    siteSettings: siteSettingsStore,
    sukiAccount: sukiStore
  });
});
app.get("/api/admin/state/stream", (req, res) => {
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "Connection": "keep-alive",
    "Access-Control-Allow-Origin": "*"
  });
  const initialPayload = JSON.stringify({
    type: "sync",
    version: stateVersion,
    timestamp: (/* @__PURE__ */ new Date()).toISOString(),
    data: {
      schedules: schedulesStore,
      vouchers: vouchersStore,
      bookings: bookingsStore,
      customersKyc: customersKycStore,
      subAdmins: subAdminsStore,
      siteSettings: siteSettingsStore,
      sukiAccount: sukiStore
    }
  });
  res.write(`data: ${initialPayload}

`);
  sseClients.add(res);
  const heartbeat = setInterval(() => {
    try {
      res.write(": heartbeat\n\n");
    } catch {
      clearInterval(heartbeat);
      sseClients.delete(res);
    }
  }, 25e3);
  req.on("close", () => {
    clearInterval(heartbeat);
    sseClients.delete(res);
  });
});
app.get("/api/admin/state/version", (req, res) => {
  res.json({
    version: stateVersion,
    timestamp: (/* @__PURE__ */ new Date()).toISOString()
  });
});
app.post("/api/admin/settings", (req, res) => {
  const newSettings = req.body;
  if (newSettings && typeof newSettings === "object") {
    siteSettingsStore = { ...siteSettingsStore, ...newSettings };
    saveDb();
    broadcastState();
  }
  res.json({ success: true, version: stateVersion, siteSettings: siteSettingsStore });
});
app.post("/api/admin/state", (req, res) => {
  const { schedules, vouchers, bookings, customersKyc, subAdmins, siteSettings, sukiAccount } = req.body;
  if (schedules) schedulesStore = schedules;
  if (vouchers) vouchersStore = vouchers;
  if (bookings) bookingsStore = bookings;
  if (customersKyc) customersKycStore = customersKyc;
  if (subAdmins) subAdminsStore = subAdmins;
  if (siteSettings) siteSettingsStore = siteSettings;
  if (sukiAccount) sukiStore = sukiAccount;
  saveDb();
  broadcastState();
  res.json({ success: true, version: stateVersion });
});
app.get("/api/admin/metrics", (req, res) => {
  res.json({
    totalBookings: bookingsStore.length,
    totalRevenue: bookingsStore.reduce((sum, b) => sum + b.totalPaid, 0),
    totalTravelers: 12450,
    activeOperators: MOCK_OPERATORS.length,
    destinationsCount: MOCK_DESTINATIONS.length,
    sukiMembers: 8420
  });
});
if (process.env.NODE_ENV !== "production") {
  const vite = await createViteServer({
    server: { middlewareMode: true, hmr: false },
    appType: "spa"
  });
  app.use(vite.middlewares);
} else {
  const staticPath = path.join(__dirname, "dist");
  app.use(express.static(staticPath));
  app.get("*", (req, res) => {
    res.sendFile(path.join(staticPath, "index.html"));
  });
}
var PORT = 3e3;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Mindanao Travel Ticketing Hub server running at http://localhost:${PORT}`);
});
