
import { Category, Business, SubCategory } from './types';

// Helper to generate a vetted business
const createBusiness = (id: string, name: string, type: string, imageId: number): Business => ({
  id,
  name,
  shortDescription: `Premier ${type} services for luxury Hamptons estates.`,
  description: `Experience the pinnacle of ${type} with ${name}. Serving the East End for over a decade, we specialize in high-end residential projects, ensuring discretion, quality, and white-glove service. Our team of certified professionals is dedicated to maintaining the beauty and functionality of your Hamptons home.`,
  address: "123 Main St, East Hampton, NY 11937",
  phone: "(631) 555-0199",
  email: `contact@${name.replace(/\s/g, '').toLowerCase()}.com`,
  website: `www.${name.replace(/\s/g, '').toLowerCase()}.com`,
  rating: 4.9,
  reviewCount: Math.floor(Math.random() * 50) + 10,
  verified: true,
  yearsInBusiness: Math.floor(Math.random() * 20) + 5,
  imageUrl: `https://picsum.photos/id/${imageId}/800/600`,
  gallery: [
    `https://picsum.photos/id/${imageId + 1}/800/600`,
    `https://picsum.photos/id/${imageId + 2}/800/600`,
    `https://picsum.photos/id/${imageId + 3}/800/600`,
  ],
  services: ["Consultation", "Installation", "Maintenance", "Emergency Service"],
  bioText: `Since founding ${name}, our mission has been simple: perfection in every detail. We understand that Hamptons homeowners expect nothing less than the best, and my team works tirelessly to exceed those expectations every single day.`,
  bioVideoUrl: "https://vid.cdn-website.com/e37982c0/videos/6l8vw55sS1OiP5zC7BIY_social_poppageddon_httpss.mj.run4g9dj_oDxf8_show_a_timelapse_of_a_te_1e7cf96d-3222-44f0-b0f8-addb0eb0cd00_0-v.mp4",
  reviews: [
    {
      id: 'r1',
      author: 'Alistair W.',
      rating: 5,
      text: 'Absolutely impeccable service. The team arrived on time and left the property spotless.',
      date: '2023-08-15'
    },
    {
      id: 'r2',
      author: 'Eleanor R.',
      rating: 5,
      text: 'The best in the Hamptons. Highly recommended for any estate owner.',
      date: '2023-09-02'
    }
  ],
  // NEW: Initial Metric Data
  metrics: {
    views: Math.floor(Math.random() * 500) + 50,
    contactClicks: Math.floor(Math.random() * 50) + 5,
    impressions: Math.floor(Math.random() * 2000) + 500,
    monthlyHistory: [
      { name: 'Jan', views: Math.floor(Math.random() * 100), contacts: Math.floor(Math.random() * 10) },
      { name: 'Feb', views: Math.floor(Math.random() * 100), contacts: Math.floor(Math.random() * 10) },
      { name: 'Mar', views: Math.floor(Math.random() * 100), contacts: Math.floor(Math.random() * 10) },
      { name: 'Apr', views: Math.floor(Math.random() * 120), contacts: Math.floor(Math.random() * 15) },
      { name: 'May', views: Math.floor(Math.random() * 150), contacts: Math.floor(Math.random() * 20) },
      { name: 'Jun', views: Math.floor(Math.random() * 200), contacts: Math.floor(Math.random() * 30) },
    ]
  }
});

export const DIRECTORY_DATA: Category[] = [
  {
    id: 'cat_construction_repairs',
    name: 'CONSTRUCTION, REPAIRS & MAINTENANCE',
    description: 'Builders, Systems, Renovations & Essential Services',
    imageUrl: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'HardHat',
    subCategories: [
      { id: 'sub_appliance', name: 'Appliance Repair', icon: 'Wrench', businesses: [
          createBusiness('biz_app_1', 'Hamptons Appliance Pros', 'Appliance Repair', 10),
          createBusiness('biz_app_2', 'Elite Home Appliances', 'Luxury Appliance Care', 11)
      ]},
      { id: 'sub_av', name: 'Audio Visual', icon: 'Tv', businesses: [
          createBusiness('biz_av_1', 'Sight & Sound Hamptons', 'Home Cinema', 12),
          createBusiness('biz_av_2', 'East End AV Integrators', 'Smart Audio', 13)
      ]},
      { id: 'sub_build_supply', name: 'Building Material Supplier', icon: 'Package', businesses: [
          createBusiness('biz_sup_1', 'Hamptons Lumber & Supply', 'Building Materials', 14),
          createBusiness('biz_sup_2', 'East End Masonry Supply', 'Stone & Brick', 15)
      ]},
      { id: 'sub_carpenter', name: 'Carpenter', icon: 'Hammer', businesses: [
          createBusiness('biz_carp_1', 'Custom Coastal Carpentry', 'Fine Woodworking', 16),
          createBusiness('biz_carp_2', 'Heritage Joinery', 'Restoration Carpentry', 17)
      ]},
      { id: 'sub_cabinetry', name: 'Custom Cabinetry', icon: 'Box', businesses: [
          createBusiness('biz_cab_1', 'Sag Harbor Cabinetry', 'Kitchen Cabinetry', 18),
          createBusiness('biz_cab_2', 'Montauk Millwork', 'Custom Closets', 19)
      ]},
      { id: 'sub_electrician', name: 'Electrician', icon: 'Zap', businesses: [
          createBusiness('biz_elec_1', 'Wire Works Luxury', 'Electrical Design', 20),
          createBusiness('biz_elec_2', 'Hampton Circuits', 'Emergency Electrical', 21)
      ]},
      { id: 'sub_excavation', name: 'Excavation & Sitework', icon: 'Truck', businesses: [
          createBusiness('biz_ex_1', 'East End Earthworks', 'Excavation', 22),
          createBusiness('biz_ex_2', 'Foundation First', 'Sitework', 23)
      ]},
      { id: 'sub_flooring', name: 'Flooring', icon: 'Layers', businesses: [
          createBusiness('biz_floor_1', 'Hamptons Hardwood', 'Floor Refinishing', 24),
          createBusiness('biz_floor_2', 'Coastal Tile & Stone', 'Luxury Flooring', 25)
      ]},
      { id: 'sub_garage', name: 'Garage Doors', icon: 'Warehouse', businesses: [
          createBusiness('biz_gar_1', 'Secure Garage Systems', 'Custom Doors', 26),
          createBusiness('biz_gar_2', 'East End Openers', 'Automation', 27)
      ]},
      { id: 'sub_generator', name: 'Generator', icon: 'Power', businesses: [
          createBusiness('biz_gen_1', 'Power On Hamptons', 'Generator Install', 28),
          createBusiness('biz_gen_2', 'Backup Systems Pros', 'Maintenance', 29)
      ]},
      { id: 'sub_glass', name: 'Glass Enclosures', icon: 'Maximize', businesses: [
          createBusiness('biz_glass_1', 'Crystal Clear Glass', 'Shower Enclosures', 30),
          createBusiness('biz_glass_2', 'Modern Glass Works', 'Railings', 31)
      ]},
      { id: 'sub_hvac', name: 'HVAC', icon: 'Thermometer', businesses: [
          createBusiness('biz_hvac_1', 'Ocean Air Systems', 'Climate Control', 32),
          createBusiness('biz_hvac_2', 'East End Mechanical', 'Heating & Cooling', 33)
      ]},
      { id: 'sub_insulation', name: 'Insulation', icon: 'Snowflake', businesses: [
          createBusiness('biz_ins_1', 'EcoFoam Hamptons', 'Spray Foam', 34),
          createBusiness('biz_ins_2', 'Thermal Guard', 'Attic Insulation', 35)
      ]},
      { id: 'sub_interior_ren', name: 'Interior Renovations', icon: 'PaintBucket', businesses: [
          createBusiness('biz_ren_1', 'Hamptons Interiors', 'Full Renovation', 36),
          createBusiness('biz_ren_2', 'Modern Living Remodel', 'Kitchen & Bath', 37)
      ]},
      { id: 'sub_locksmith', name: 'Locksmith', icon: 'Key', businesses: [
          createBusiness('biz_lock_1', 'Secure Access', 'Emergency Locksmith', 38),
          createBusiness('biz_lock_2', 'Hamptons Safe & Lock', 'Security Hardware', 39)
      ]},
      { id: 'sub_metal', name: 'Metal Fabricator', icon: 'Settings', businesses: [
          createBusiness('biz_metal_1', 'Iron Forge Hamptons', 'Custom Gates', 40),
          createBusiness('biz_metal_2', 'Coastal Steel', 'Structural Steel', 41)
      ]},
      { id: 'sub_new_build', name: 'New Construction Builder', icon: 'HardHat', businesses: [
          createBusiness('biz_build_1', 'Sag Harbor Estates', 'Luxury Construction', 42),
          createBusiness('biz_build_2', 'Montauk Master Builders', 'Custom Homes', 43)
      ]},
      { id: 'sub_oil', name: 'Oil Service & Supply', icon: 'Droplet', businesses: [
          createBusiness('biz_oil_1', 'Hamptons Fuel', 'Oil Delivery', 44),
          createBusiness('biz_oil_2', 'East End Energy', 'Burner Service', 45)
      ]},
      { id: 'sub_painter', name: 'Painter', icon: 'Brush', businesses: [
          createBusiness('biz_paint_1', 'Pristine Painting', 'Interior/Exterior', 46),
          createBusiness('biz_paint_2', 'Fine Finishes', 'Cabinet Refinishing', 47)
      ]},
      { id: 'sub_plumber', name: 'Plumber', icon: 'Wrench', businesses: [
          createBusiness('biz_plumb_1', 'Hamptons Plumbing', 'Emergency Service', 48),
          createBusiness('biz_plumb_2', 'Flow Masters', 'Fixture Install', 49)
      ]},
      { id: 'sub_pool_build', name: 'Pool Builder', icon: 'Waves', businesses: [
          createBusiness('biz_poolb_1', 'Infinite Blue Pools', 'Gunite Pools', 50),
          createBusiness('biz_poolb_2', 'Hamptons Aquatics', 'Custom Spas', 51)
      ]},
      { id: 'sub_propane', name: 'Propane Service & Supply', icon: 'Flame', businesses: [
          createBusiness('biz_pro_1', 'East End Propane', 'Tank Install', 52),
          createBusiness('biz_pro_2', 'Hamptons Gas', 'Delivery', 53)
      ]},
      { id: 'sub_restore', name: 'Restoration & Emergency', icon: 'Siren', businesses: [
          createBusiness('biz_res_1', 'Hamptons Restoration', 'Water Damage', 54),
          createBusiness('biz_res_2', 'Rapid Response Team', 'Fire & Mold', 55)
      ]},
      { id: 'sub_roofer', name: 'Roofer', icon: 'Home', businesses: [
          createBusiness('biz_roof_1', 'Elite Hamptons Roofing', 'Cedar & Slate', 56),
          createBusiness('biz_roof_2', 'Southampton Roofing', 'Flat Roofs', 57)
      ]},
      { id: 'sub_security', name: 'Security Camera & Alarm', icon: 'Camera', businesses: [
          createBusiness('biz_sec_1', 'Hamptons Security', 'Surveillance', 58),
          createBusiness('biz_sec_2', 'Safe Home Systems', 'Alarm Monitoring', 59)
      ]},
      { id: 'sub_septic', name: 'Septic & Cesspool', icon: 'Trash2', businesses: [
          createBusiness('biz_sep_1', 'East End Septic', 'Pumping', 60),
          createBusiness('biz_sep_2', 'Clean Waste Pros', 'System Install', 61)
      ]},
      { id: 'sub_solar', name: 'Solar Panel', icon: 'Sun', businesses: [
          createBusiness('biz_solar_1', 'Hamptons Green Energy', 'Solar Install', 62),
          createBusiness('biz_solar_2', 'Sun Power East', 'Battery Backup', 63)
      ]},
      { id: 'sub_stairs', name: 'Stairs & Handrails', icon: 'TrendingUp', businesses: [
          createBusiness('biz_stair_1', 'Custom Stair Works', 'Curved Stairs', 64),
          createBusiness('biz_stair_2', 'Iron & Wood Rails', 'Handrails', 65)
      ]},
      { id: 'sub_tile', name: 'Tile Installer', icon: 'Grid', businesses: [
          createBusiness('biz_tile_1', 'Master Tile Setters', 'Marble & Stone', 66),
          createBusiness('biz_tile_2', 'Coastal Mosaics', 'Custom Tile', 67)
      ]},
      { id: 'sub_venetian', name: 'Venetian Plaster', icon: 'Palette', businesses: [
          createBusiness('biz_plas_1', 'Old World Plaster', 'Venetian Finishes', 68),
          createBusiness('biz_plas_2', 'Hamptons Wall Finishes', 'Lime Plaster', 69)
      ]},
      { id: 'sub_water_treat', name: 'Waste Water Treatment', icon: 'Recycle', businesses: [
          createBusiness('biz_ww_1', 'Pure Water Systems', 'Filtration', 70),
          createBusiness('biz_ww_2', 'Eco Treat', 'Waste Management', 71)
      ]},
      { id: 'sub_well', name: 'Well Water Pump', icon: 'Droplets', businesses: [
          createBusiness('biz_well_1', 'Hamptons Well', 'Pump Repair', 72),
          createBusiness('biz_well_2', 'Deep Water Drilling', 'Well Install', 73)
      ]},
      { id: 'sub_win_treat', name: 'Window Treatment', icon: 'Columns', businesses: [
          createBusiness('biz_wint_1', 'Hamptons Blinds', 'Automated Shades', 74),
          createBusiness('biz_wint_2', 'Coastal Drapes', 'Custom Curtains', 75)
      ]},
      { id: 'sub_win_door', name: 'Windows & Doors', icon: 'DoorOpen', businesses: [
          createBusiness('biz_wd_1', 'Viewpoint Windows', 'Impact Glass', 76),
          createBusiness('biz_wd_2', 'Grand Entrances', 'Custom Doors', 77)
      ]}
    ]
  },
  {
    id: 'cat_outdoor',
    name: 'OUTDOOR & GARDEN',
    description: 'Landscaping, Pools, Sport Courts & Exterior Care',
    imageUrl: 'https://images.unsplash.com/photo-1558435186-d31d1162f778?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'Shovel',
    subCategories: [
      { id: 'sub_apiculturist', name: 'Apiculturist', icon: 'Hexagon', businesses: [
          createBusiness('biz_bee_1', 'Hamptons Honey Bees', 'Hive Management', 78),
          createBusiness('biz_bee_2', 'East End Apiaries', 'Pollinator Gardens', 79)
      ]},
      { id: 'sub_arborist', name: 'Arborist', icon: 'TreeDeciduous', businesses: [
          createBusiness('biz_tree_1', 'Hamptons Tree Care', 'Pruning & Removal', 80),
          createBusiness('biz_tree_2', 'Arbor Experts', 'Tree Health', 81)
      ]},
      { id: 'sub_awning', name: 'Awning & Shutters', icon: 'Umbrella', businesses: [
          createBusiness('biz_shade_1', 'Coastal Shade', 'Retractable Awnings', 82),
          createBusiness('biz_shade_2', 'Storm Shutters Pro', 'Hurricane Shutters', 83)
      ]},
      { id: 'sub_blacktop', name: 'Blacktop & Asphalt', icon: 'Map', businesses: [
          createBusiness('biz_pave_1', 'Hamptons Paving', 'Driveways', 84),
          createBusiness('biz_pave_2', 'Blacktop Sealers', 'Resurfacing', 85)
      ]},
      { id: 'sub_fence', name: 'Fence & Gate', icon: 'GripVertical', businesses: [
          createBusiness('biz_fence_1', 'Secure Estates', 'Privacy Fencing', 86),
          createBusiness('biz_fence_2', 'Iron & Wood Gates', 'Automated Gates', 87)
      ]},
      { id: 'sub_holiday', name: 'Holiday Lighting', icon: 'Star', businesses: [
          createBusiness('biz_light_1', 'Festive Hamptons', 'Design & Install', 88),
          createBusiness('biz_light_2', 'Holiday Bright', 'Event Lighting', 89)
      ]},
      { id: 'sub_irrigation', name: 'Irrigation', icon: 'CloudRain', businesses: [
          createBusiness('biz_water_1', 'Green Lawns', 'Sprinkler Systems', 90),
          createBusiness('biz_water_2', 'Water Wise', 'Drip Irrigation', 91)
      ]},
      { id: 'sub_landscaper', name: 'Landscaper', icon: 'Shovel', businesses: [
          createBusiness('biz_land_1', 'Verdant Vistas', 'Landscape Design', 92),
          createBusiness('biz_land_2', 'Dune Grass Gardens', 'Maintenance', 93)
      ]},
      { id: 'sub_masonry', name: 'Masonry & Hardscapes', icon: 'BrickWall', businesses: [
          createBusiness('biz_mason_1', 'Stone Age Masonry', 'Patios & Walkways', 94),
          createBusiness('biz_mason_2', 'Hamptons Hardscapes', 'Retaining Walls', 95)
      ]},
      { id: 'sub_nursery', name: 'Nursery', icon: 'Sprout', businesses: [
          createBusiness('biz_plant_1', 'East End Nursery', 'Native Plants', 96),
          createBusiness('biz_plant_2', 'Hamptons Gardens', 'Trees & Shrubs', 97)
      ]},
      { id: 'sub_pest', name: 'Pest Control', icon: 'Bug', businesses: [
          createBusiness('biz_pest_1', 'Hamptons Pest Pros', 'Organic Control', 98),
          createBusiness('biz_pest_2', 'Tick & Mosquito Guard', 'Vector Control', 99)
      ]},
      { id: 'sub_plant_health', name: 'Plant Health', icon: 'Stethoscope', businesses: [
          createBusiness('biz_phc_1', 'Green Leaf Care', 'Soil Analysis', 100),
          createBusiness('biz_phc_2', 'Tree & Shrub Doctor', 'Disease Treatment', 101)
      ]},
      { id: 'sub_pond', name: 'Pond & Fish Service', icon: 'Fish', businesses: [
          createBusiness('biz_pond_1', 'Tranquil Waters', 'Koi Ponds', 102),
          createBusiness('biz_pond_2', 'Pond Maintenance', 'Filtration', 103)
      ]},
      { id: 'sub_pool_svc', name: 'Pool Service', icon: 'Waves', businesses: [
          createBusiness('biz_pool_1', 'Crystal Clear Hamptons', 'Weekly Service', 104),
          createBusiness('biz_pool_2', 'Hamptons Pool Care', 'Openings & Closings', 105)
      ]},
      { id: 'sub_shrink', name: 'Shrink Wrap', icon: 'Package', businesses: [
          createBusiness('biz_wrap_1', 'Hamptons Shrink Wrap', 'Furniture Protection', 106),
          createBusiness('biz_wrap_2', 'Winter Cover Pros', 'Outdoor Kitchens', 107)
      ]},
      { id: 'sub_tennis', name: 'Tennis & Turf', icon: 'Trophy', businesses: [
          createBusiness('biz_court_1', 'Pro Court Surfaces', 'Court Construction', 108),
          createBusiness('biz_court_2', 'Hamptons Synthetic', 'Putting Greens', 109)
      ]}
    ]
  },
  {
    id: 'cat_lifestyle',
    name: 'REAL ESTATE, DESIGN & LIFESTYLE',
    description: 'Interiors, Events, Finance, and Concierge',
    imageUrl: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'Key',
    subCategories: [
      { id: 'sub_arch', name: 'Architect', icon: 'PencilRuler', businesses: [
          createBusiness('biz_arch_1', 'Hamptons Modern Architecture', 'Architect', 201),
          createBusiness('biz_arch_2', 'Heritage Design Studio', 'Classical Architecture', 202)
      ]},
      { id: 'sub_eng', name: 'Engineer & Expeditor', icon: 'HardHat', businesses: [
          createBusiness('biz_eng_1', 'East End Engineering', 'Structural Engineer', 203),
          createBusiness('biz_eng_2', 'Permit Pros', 'Expediting Services', 204)
      ]},
      { id: 'sub_furn', name: 'Furniture Sales', icon: 'Armchair', businesses: [
          createBusiness('biz_furn_1', 'Coastal Living Furnishings', 'Luxury Furniture', 205),
          createBusiness('biz_furn_2', 'The Hamptons Collection', 'Bespoke Pieces', 206)
      ]},
      { id: 'sub_home_insp', name: 'Home Inspection', icon: 'ClipboardCheck', businesses: [
          createBusiness('biz_insp_1', 'Detailed Home Inspections', 'Buyer Inspections', 207),
          createBusiness('biz_insp_2', 'Estate Check', 'Pre-Purchase Review', 208)
      ]},
      { id: 'sub_home_ins', name: 'Home Insurance', icon: 'ShieldCheck', businesses: [
          createBusiness('biz_ins_1', 'Coastal Risk Advisors', 'High-Value Home Insurance', 209),
          createBusiness('biz_ins_2', 'Hamptons Underwriters', 'Flood & Storm Coverage', 210)
      ]},
      { id: 'sub_org', name: 'Home Organizer', icon: 'LayoutGrid', businesses: [
          createBusiness('biz_org_1', 'The Organized Estate', 'Closet Organization', 211),
          createBusiness('biz_org_2', 'Clutter Free Hamptons', 'Garage Systems', 212)
      ]},
      { id: 'sub_int_des', name: 'Interior Design', icon: 'Palette', businesses: [
          createBusiness('biz_id_1', 'Coastal Chic Interiors', 'Interior Design', 213),
          createBusiness('biz_id_2', 'The Hamptons Aesthetic', 'Interior Design', 214)
      ]},
      { id: 'sub_mort', name: 'Mortgage Lender', icon: 'Landmark', businesses: [
          createBusiness('biz_mort_1', 'East End Capital', 'Jumbo Loans', 215),
          createBusiness('biz_mort_2', 'Hamptons Private Lending', 'Construction Loans', 216)
      ]},
      { id: 'sub_move', name: 'Moving & Storage', icon: 'Truck', businesses: [
          createBusiness('biz_move_1', 'White Glove Moving', 'Luxury Relocation', 217),
          createBusiness('biz_move_2', 'Climate Secure Storage', 'Art Storage', 218)
      ]},
      { id: 'sub_prop_man', name: 'Property Management', icon: 'Key', businesses: [
          createBusiness('biz_prop_1', 'Estate Caretakers', 'Full Management', 219),
          createBusiness('biz_prop_2', 'Hamptons House Watch', 'Weekly Inspections', 220)
      ]},
      { id: 'sub_attorney', name: 'Real Estate Attorney', icon: 'Scale', businesses: [
          createBusiness('biz_law_1', 'Hamptons Legal Group', 'Closing Attorney', 221),
          createBusiness('biz_law_2', 'East End Law', 'Zoning Law', 222)
      ]},
      { id: 'sub_photo', name: 'Real Estate Photography', icon: 'Camera', businesses: [
          createBusiness('biz_photo_1', 'Luxury Lens', 'Drone Photography', 223),
          createBusiness('biz_photo_2', 'Estate Exposures', 'Interior Photography', 224)
      ]},
      { id: 'sub_realtor', name: 'Realtor', icon: 'Home', businesses: [
          createBusiness('biz_realty_1', 'Hamptons Estates Realty', 'Luxury Listings', 225),
          createBusiness('biz_realty_2', 'Oceanfront Properties', 'Buyer Representation', 226)
      ]},
      { id: 'sub_survey', name: 'Surveyor', icon: 'Map', businesses: [
          createBusiness('biz_surv_1', 'East End Surveying', 'Boundary Surveys', 227),
          createBusiness('biz_surv_2', 'Precision Mapping', 'Topographical Surveys', 228)
      ]},
      { id: 'sub_title', name: 'Title Insurance', icon: 'FileCheck', businesses: [
          createBusiness('biz_title_1', 'Secure Title Agency', 'Title Search', 229),
          createBusiness('biz_title_2', 'Hamptons Abstract', 'Closing Services', 230)
      ]},
      { id: 'sub_video', name: 'Videographer', icon: 'Video', businesses: [
          createBusiness('biz_vid_1', 'Cinematic Estates', 'Property Tours', 231),
          createBusiness('biz_vid_2', 'Hamptons Drone', 'Aerial Video', 232)
      ]},
      { id: 'sub_trust', name: 'Wills, Trusts & Estate Attorney', icon: 'Scroll', businesses: [
          createBusiness('biz_trust_1', 'Legacy Planning Group', 'Estate Planning', 233),
          createBusiness('biz_trust_2', 'Hamptons Trust Law', 'Asset Protection', 234)
      ]}
    ]
  },
  {
    id: 'cat_cleaning',
    name: 'CLEANING SERVICES',
    description: 'Housekeeping, Windows, and Deep Cleans',
    imageUrl: 'https://images.unsplash.com/photo-1584622050111-993a426fbf0a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    icon: 'SprayCan',
    subCategories: [
      { id: 'sub_airduct', name: 'Air Duct Cleaning', icon: 'Wind', businesses: [
          createBusiness('biz_duct_1', 'Hamptons Clean Air', 'Duct Purification', 301),
          createBusiness('biz_duct_2', 'East End Vent Pros', 'HVAC Cleaning', 302)
      ]},
      { id: 'sub_bbq', name: 'BBQ Grill Cleaning', icon: 'Flame', businesses: [
          createBusiness('biz_bbq_1', 'Grill Masters Clean', 'Deep Degreasing', 303),
          createBusiness('biz_bbq_2', 'Hamptons BBQ Shine', 'Grate Restoration', 304)
      ]},
      { id: 'sub_carpet', name: 'Carpet Cleaning', icon: 'Layers', businesses: [
          createBusiness('biz_carpet_1', 'Luxury Rug Care', 'Oriental Rug Cleaning', 305),
          createBusiness('biz_carpet_2', 'Pristine Carpets', 'Steam Cleaning', 306)
      ]},
      { id: 'sub_garbage', name: 'Garbage Service', icon: 'Trash2', businesses: [
          createBusiness('biz_garb_1', 'East End Waste', 'Estate Pickup', 307),
          createBusiness('biz_garb_2', 'Hamptons Haulers', 'Recycling Services', 308)
      ]},
      { id: 'sub_house_clean', name: 'House Cleaning', icon: 'SprayCan', businesses: [
          createBusiness('biz_hclean_1', 'White Glove Maids', 'Weekly Housekeeping', 309),
          createBusiness('biz_hclean_2', 'Eco Clean Hamptons', 'Green Cleaning', 310)
      ]},
      { id: 'sub_janitorial', name: 'Janitorial & Commercial', icon: 'Building', businesses: [
          createBusiness('biz_jan_1', 'Pro Office Cleaners', 'Commercial Spaces', 311),
          createBusiness('biz_jan_2', 'Hamptons Corporate Clean', 'Event Cleanup', 312)
      ]},
      { id: 'sub_junk', name: 'Junk Removal', icon: 'Truck', businesses: [
          createBusiness('biz_junk_1', 'Clean Sweep Removal', 'Estate Clearouts', 313),
          createBusiness('biz_junk_2', 'East End Junk Pros', 'Debris Removal', 314)
      ]},
      { id: 'sub_mold', name: 'Mold & Environmental Testing', icon: 'Activity', businesses: [
          createBusiness('biz_mold_1', 'Pure Air Environmental', 'Mold Remediation', 315),
          createBusiness('biz_mold_2', 'Hamptons Air Test', 'Air Quality Check', 316)
      ]},
      { id: 'sub_portable', name: 'Portable Toilets', icon: 'Box', businesses: [
          createBusiness('biz_port_1', 'Luxury Loos', 'Event Restrooms', 317),
          createBusiness('biz_port_2', 'Hamptons Portables', 'Construction Units', 318)
      ]},
      { id: 'sub_power', name: 'Power Washing & Soft Washing', icon: 'Droplets', businesses: [
          createBusiness('biz_power_1', 'Hamptons Power Wash', 'Soft Wash Siding', 319),
          createBusiness('biz_power_2', 'Deck & Patio Restore', 'High Pressure Clean', 320)
      ]},
      { id: 'sub_water_filt', name: 'Water Filtration', icon: 'Filter', businesses: [
          createBusiness('biz_waterf_1', 'Pure Water Hamptons', 'Whole House Filter', 321),
          createBusiness('biz_waterf_2', 'Crystal Clear Aqua', 'Reverse Osmosis', 322)
      ]},
      { id: 'sub_window', name: 'Window Cleaner', icon: 'Sun', businesses: [
          createBusiness('biz_win_1', 'Clear View Hamptons', 'Interior/Exterior', 323),
          createBusiness('biz_win_2', 'Sunshine Window Care', 'Skylight Cleaning', 324)
      ]}
    ]
  }
];
