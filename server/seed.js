require('dotenv').config();
const mongoose = require('mongoose');
const Issue = require('./models/Issue');
const User = require('./models/User');

const sampleIssues = [
  {
    title: 'High-Voltage Transformer Sparking Near Elementary School',
    description: 'Transformer on the utility pole is emitting loud pops and visible electrical sparks near the corner of Oak St. and 4th Ave.',
    category: 'Electricity',
    urgency: 'Emergency',
    location: '402 Oak Street (Corner of 4th Ave)',
    status: 'Reported',
    aiSummary: 'Critical electrical hazard adjacent to school zone. Immediate power company isolation and emergency crew dispatch dispatched.'
  },
  {
    title: 'Severe Water Main Rupture Flooding Commercial Avenue',
    description: 'Main water line burst under asphalt, buckling the road surface and flooding both lanes with approximately 8 inches of water.',
    category: 'Water',
    urgency: 'Emergency',
    location: '880 North Commercial Blvd',
    status: 'In Progress',
    aiSummary: 'Major utility rupture causing infrastructure damage and transit disruption. Water department valve shutdown active.'
  },
  {
    title: 'Deep Hazardous Pothole Damaging Vehicles on Expressway Exit',
    description: 'Pothole estimated 2.5 feet wide and 6 inches deep causing tire blowouts at the highway exit ramp.',
    category: 'Roads',
    urgency: 'High',
    location: 'Westbound Highway 9 Exit 12 Ramp',
    status: 'Reported',
    aiSummary: 'High-speed roadway defect with confirmed vehicle damage incidents. Road maintenance crew prioritized for asphalt patching.'
  },
  {
    title: 'Overflowing Waste Dumpster Attracting Rodents',
    description: 'Commercial trash receptacle hasn’t been collected in two weeks, overflowing into the public pedestrian walkway.',
    category: 'Sanitation',
    urgency: 'Medium',
    location: 'Alleyway behind 15 Market Square',
    status: 'In Progress',
    aiSummary: 'Sanitation violation and health compliance risk. Department of Public Works route scheduled for pickup.'
  },
  {
    title: 'Fallen Tree Branch Obstructing Sidewalk and Bike Lane',
    description: 'Heavy storm broke a large oak branch that fell across the pedestrian sidewalk and designated bike lane.',
    category: 'Safety',
    urgency: 'Medium',
    location: '214 Pinecrest Way',
    status: 'Reported',
    aiSummary: 'Pedestrian right-of-way obstruction. Parks & Recreation arborist crew ticket generated for removal.'
  },
  {
    title: 'Non-Functional Streetlight Creating Dark Intersection',
    description: 'Streetlight pole #42 is dark at night, making the crosswalk dangerous for evening pedestrians.',
    category: 'Electricity',
    urgency: 'Low',
    location: 'Intersection of Elm St & 8th Avenue',
    status: 'Resolved',
    aiSummary: 'Routine illumination failure. Public works municipal electrician replaced LED fixture and verified circuit.'
  },
  {
    title: 'Broken Storm Drain Grate In Bicycle Commute Corridor',
    description: 'Metal storm drain cover is cracked in half, leaving an open hole that can catch bicycle wheels or pedestrians.',
    category: 'Roads',
    urgency: 'High',
    location: '512 Riverview Promenade',
    status: 'Reported',
    aiSummary: 'Pedestrian and cyclist safety hazard. Immediate barricade placement and grate replacement required.'
  },
  {
    title: 'Illegal Chemical Dumping in Public Park Drainage Ditch',
    description: 'Suspicious oily chemical residue with strong solvent odor dumped near park boundary stream.',
    category: 'Sanitation',
    urgency: 'High',
    location: 'Riverside Community Park, North Edge',
    status: 'In Progress',
    aiSummary: 'Environmental contamination alert. Environmental protection agency notified for containment and soil sampling.'
  }
];

const seedDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/civicpulse';
    console.log(`Connecting to MongoDB at: ${mongoURI}...`);
    await mongoose.connect(mongoURI);

    console.log('Clearing existing demo issues & users...');
    await Issue.deleteMany({});
    await User.deleteMany({});

    console.log(`Inserting ${sampleIssues.length} realistic hackathon demo issues...`);
    const created = await Issue.insertMany(sampleIssues);

    console.log('Creating demo Citizen and Admin accounts...');
    const citizenUser = new User({
      name: 'Jane Doe',
      email: 'citizen@civicpulse.org',
      role: 'citizen',
      department: 'Community Resident'
    });
    citizenUser.setPassword('citizen123');
    await citizenUser.save();

    const adminUser = new User({
      name: 'Officer Davis',
      email: 'admin@cityhall.gov',
      role: 'admin',
      department: 'Emergency Dispatch'
    });
    adminUser.setPassword('admin123');
    await adminUser.save();

    console.log(`✅ Successfully seeded ${created.length} issues and 2 demo accounts into CivicPulse DB!`);
    console.log(`   Citizen Account: citizen@civicpulse.org / citizen123`);
    console.log(`   Admin Account:   admin@cityhall.gov / admin123`);
    process.exit(0);
  } catch (error) {
    console.error(`❌ Seeding failed: ${error.message}`);
    process.exit(1);
  }
};

seedDB();

