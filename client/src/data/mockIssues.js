export const initialMockIssues = [
  {
    _id: 'mock-1',
    title: 'High-Voltage Transformer Sparking Near School',
    description: 'Utility transformer is emitting continuous loud buzzing, sparks, and smoke near the north playground fence.',
    category: 'Electricity',
    urgency: 'Emergency',
    location: '402 Oak Street (Corner of 4th Ave)',
    status: 'Reported',
    aiSummary: 'Critical electrical fire hazard adjacent to school zone. Automated priority dispatch sent to municipal grid technicians.',
    createdAt: new Date(Date.now() - 1000 * 60 * 18).toISOString()
  },
  {
    _id: 'mock-2',
    title: 'Severe Water Main Rupture Flooding Commercial Avenue',
    description: 'Main water line burst under asphalt, buckling the road surface and flooding both lanes with approximately 8 inches of water.',
    category: 'Water',
    urgency: 'Emergency',
    location: '880 North Commercial Blvd',
    status: 'In Progress',
    aiSummary: 'Major utility rupture causing roadway destabilization. Municipal water isolation valve crew active on site.',
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString()
  },
  {
    _id: 'mock-3',
    title: 'Deep Hazardous Pothole on Highway Off-Ramp',
    description: 'Pothole estimated 2.5 feet wide and 6 inches deep causing tire blowouts at the highway exit curve.',
    category: 'Roads',
    urgency: 'High',
    location: 'Westbound Highway 9 Exit 12 Ramp',
    status: 'Reported',
    aiSummary: 'High-velocity roadway structural failure with confirmed vehicle incidents. Immediate asphalt patching crew dispatched.',
    createdAt: new Date(Date.now() - 1000 * 60 * 95).toISOString()
  },
  {
    _id: 'mock-4',
    title: 'Illegal Chemical Dumping in Stream Drainage Ditch',
    description: 'Suspicious oily chemical residue with strong solvent odor dumped near park boundary stream.',
    category: 'Sanitation',
    urgency: 'High',
    location: 'Riverside Community Park, North Edge',
    status: 'In Progress',
    aiSummary: 'Environmental contamination alert. Environmental protection agency notified for containment and soil sampling.',
    createdAt: new Date(Date.now() - 1000 * 60 * 180).toISOString()
  },
  {
    _id: 'mock-5',
    title: 'Fallen Tree Branch Obstructing Sidewalk and Bike Lane',
    description: 'Heavy storm broke a large oak branch that fell across the pedestrian sidewalk and designated bike lane.',
    category: 'Safety',
    urgency: 'Medium',
    location: '214 Pinecrest Way',
    status: 'Reported',
    aiSummary: 'Right-of-way pedestrian obstruction. Parks & Recreation arborist ticket generated for removal.',
    createdAt: new Date(Date.now() - 1000 * 60 * 240).toISOString()
  },
  {
    _id: 'mock-6',
    title: 'Overflowing Waste Dumpster Attracting Pests',
    description: 'Commercial trash receptacle hasn’t been collected in two weeks, overflowing into the public pedestrian walkway.',
    category: 'Sanitation',
    urgency: 'Medium',
    location: 'Alleyway behind 15 Market Square',
    status: 'Reported',
    aiSummary: 'Sanitation code violation. Priority sanitation pickup route assigned for tomorrow morning.',
    createdAt: new Date(Date.now() - 1000 * 60 * 360).toISOString()
  },
  {
    _id: 'mock-7',
    title: 'Non-Functional Streetlight at Dark Crosswalk',
    description: 'Streetlight pole #42 is completely dark at night, making the crosswalk dangerous for evening pedestrians.',
    category: 'Electricity',
    urgency: 'Low',
    location: 'Intersection of Elm St & 8th Avenue',
    status: 'Resolved',
    aiSummary: 'Routine illumination failure. Public works municipal electrician replaced LED fixture and verified circuit.',
    createdAt: new Date(Date.now() - 1000 * 60 * 720).toISOString()
  },
  {
    _id: 'mock-8',
    title: 'Missing Stop Sign at Residential Intersection',
    description: 'Metal stop sign was knocked over and removed from the corner, leading to near-miss collisions.',
    category: 'Safety',
    urgency: 'High',
    location: 'Corner of Maple & 2nd Street',
    status: 'Resolved',
    aiSummary: 'Critical traffic safety control missing. Traffic department deployed temporary stop sign within 45 minutes.',
    createdAt: new Date(Date.now() - 1000 * 60 * 900).toISOString()
  }
];
