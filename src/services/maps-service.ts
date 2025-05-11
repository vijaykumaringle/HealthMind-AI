// src/services/maps-service.ts
'use server';
/**
 * @fileOverview Service for interacting with map APIs, e.g., Google Maps.
 *
 * - fetchNearbyMedicalFacilities - Fetches nearby medical facilities.
 */

export interface MedicalFacility {
  name: string;
  address: string;
  type: string; // e.g., Hospital, Clinic
}

/**
 * Simulates fetching nearby medical facilities.
 * In a real application, this would call the Google Maps Places API.
 * @param query A query string, typically including facility type and location (e.g., "hospitals in Pune").
 * @returns A promise that resolves to an array of medical facilities.
 */
export async function fetchNearbyMedicalFacilities(
  query: string
): Promise<MedicalFacility[]> {
  console.log(`Mock maps service: Fetching facilities for query: "${query}"`);

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500)); 

  const lowerQuery = query.toLowerCase();
  const results: MedicalFacility[] = [];

  // Pune Data
  if (lowerQuery.includes("pune")) {
    if (lowerQuery.includes("hospital") && !lowerQuery.includes("oncologist") && !lowerQuery.includes("cancer") && !lowerQuery.includes("surgeon") && !lowerQuery.includes("surgery")) { // Avoid double-listing if specialist query also includes 'hospital'
      results.push(
        { name: "Sahyadri Super Speciality Hospital Deccan", address: "Plot No. 30-C, Erandwane, Deccan Gymkhana, Pune, Maharashtra 411004", type: "Super Speciality Hospital" },
        { name: "Jehangir Hospital", address: "32, Sassoon Rd, Opposite Pune Railway Station, Central Excise Colony, Sangamvadi, Pune, Maharashtra 411001", type: "Multi-Speciality Hospital" },
        { name: "Noble Hospital", address: "153, Magarpatta Road, Hadapsar, Pune, Maharashtra 411013", type: "Multi-Speciality Hospital" },
        { name: "KEM Hospital", address: "489, Rasta Peth, Sardar Moodliar Rd, Pune, Maharashtra 411011", type: "General Hospital" }
      );
    }
    if (lowerQuery.includes("clinic") && !lowerQuery.includes("pediatric") && !lowerQuery.includes("cardiologist") && !lowerQuery.includes("dermatologist") && !lowerQuery.includes("oncologist") && !lowerQuery.includes("surgeon")) {
      results.push(
        { name: "Dr. Joshi's Family Clinic", address: "Shop No 5, Near Balgandharva Chowk, FC Road, Shivajinagar, Pune, Maharashtra 411005", type: "General Clinic" },
        { name: "Wellness First Polyclinic", address: "North Main Road, Koregaon Park, Pune, Maharashtra 411001", type: "Polyclinic" },
        { name: "Care & Cure Clinic", address: "Viman Nagar Rd, Clover Park, Viman Nagar, Pune, Maharashtra 411014", type: "Family Clinic"}
      );
    }
    if (lowerQuery.includes("cardiologist")) {
      results.push(
        { name: "Deccan Heart Institute", address: "Deccan Gymkhana, Pune, Maharashtra 411004", type: "Cardiology Hospital"},
        { name: "Dr. Rahul Patil - Cardiologist Clinic", address: "Tilak Road, Swargate, Pune, Maharashtra 411030", type: "Cardiologist Clinic"}
      );
    }
     if (lowerQuery.includes("pediatrician") || lowerQuery.includes("child specialist")) {
        results.push(
            { name: "Cloudnine Hospital - Shivajinagar (Pediatrics)", address: "Plot No. 47, Service Road, Shivajinagar, Pune, Maharashtra 411005", type: "Pediatric & Maternity Hospital"},
            { name: "Dr. Mehta's Children's Clinic", address: "Aundh-Wakad Road, Aundh, Pune, Maharashtra 411007", type: "Pediatric Clinic"}
        );
    }
    if (lowerQuery.includes("oncologist") || lowerQuery.includes("cancer")) {
      results.push(
          { name: "Galaxy CARE Hospital (Oncology Dept.)", address: "S.No.23, Plot No.207, Karve Rd, Deccan Gymkhana, Pune, Maharashtra 411004", type: "Oncology Hospital / Cancer Care" },
          { name: "Ruby Hall Clinic (Cancer Center)", address: "40, Sassoon Rd, Sangamvadi, Pune, Maharashtra 411001", type: "Comprehensive Cancer Center" },
          { name: "Chellaram Hospital - Diabetes Care & Multi-Speciality (Oncology Wing)", address: "Lalani Quantum, Bavdhan, Pune, Maharashtra 411021", type: "Hospital with Oncology Dept."}
      );
    }
    if (lowerQuery.includes("surgeon") || lowerQuery.includes("surgery")) {
      results.push(
          { name: "Sahyadri Super Speciality Hospital Deccan (Advanced Surgery)", address: "Plot No. 30-C, Erandwane, Deccan Gymkhana, Pune, Maharashtra 411004", type: "Hospital - Surgical Services" },
          { name: "Jehangir Hospital (Dept. of Surgery)", address: "32, Sassoon Rd, Opposite Pune Railway Station, Central Excise Colony, Sangamvadi, Pune, Maharashtra 411001", type: "Hospital - Surgical Services" },
          { name: "Poona Hospital and Research Centre (Surgical Unit)", address: "27, Sadashiv Peth, Near Alka Talkies, Pune, Maharashtra 411030", type: "Hospital with Surgical Unit"}
      );
    }
  }
  
  // New York Data
  if (lowerQuery.includes("new york") || lowerQuery.includes("nyc")) {
     if (lowerQuery.includes("hospital")) {
        results.push(
            { name: "NewYork-Presbyterian/Weill Cornell Medical Center", address: "525 E 68th St, New York, NY 10065", type: "Hospital" },
            { name: "Mount Sinai Hospital", address: "1 Gustave L Levy Pl, New York, NY 10029", type: "Hospital" },
            { name: "NYU Langone Health", address: "550 1st Avenue, New York, NY 10016", type: "Academic Medical Center"}
        );
     }
     if (lowerQuery.includes("pediatrician") || lowerQuery.includes("child specialist")) {
        results.push(
            { name: "Tribeca Pediatrics - Warren Street", address: "46 Warren St, New York, NY 10007", type: "Pediatric Clinic"},
            { name: "CPW Pediatrics", address: "251 Central Park West, New York, NY 10024", type: "Pediatric Clinic"}
        );
     }
     if (lowerQuery.includes("urgent care")) {
        results.push(
            { name: "CityMD West 57th St Urgent Care - NYC", address: "315 W 57th St, New York, NY 10019", type: "Urgent Care Clinic"},
            { name: "GoHealth Urgent Care - Upper West Side", address: "2628 Broadway, New York, NY 10025", type: "Urgent Care Clinic"}
        );
     }
  }

  // London Data
  if (lowerQuery.includes("london")) {
    if (lowerQuery.includes("hospital")) {
      results.push(
        { name: "St Thomas' Hospital", address: "Westminster Bridge Rd, Lambeth, London SE1 7EH, UK", type: "NHS Hospital" },
        { name: "University College Hospital at Westmoreland Street", address: "16-18 Westmoreland St, London W1G 8PH, UK", type: "NHS Hospital" },
        { name: "The Royal London Hospital", address: "Whitechapel Rd, London E1 1BB, UK", type: "NHS Hospital" }
      );
    }
    if (lowerQuery.includes("clinic") && !lowerQuery.includes("dermatologist")) {
      results.push(
        { name: "The London General Practice", address: "114a Harley St, London W1G 7JL, UK", type: "Private GP Clinic" },
        { name: "Soho Square General Practice", address: "1 Frith St, London W1D 3HZ, UK", type: "NHS GP Clinic" }
      );
    }
    if (lowerQuery.includes("dermatologist")) {
        results.push(
            { name: "The London Skin and Hair Clinic", address: "233 High Holborn, London WC1V 7DN, UK", type: "Dermatology Clinic"},
            { name: "Cadogan Clinic (Dermatology)", address: "120 Sloane St, London SW1X 9BW, UK", type: "Private Dermatology Clinic"}
        );
    }
  }

  // Generic fallbacks if no specific location matched or results array is still empty from specific matches
  if (results.length === 0 && query.trim() !== "") {
    let facilityType = "Medical Facility"; // Default
    // Prioritize specific specialist terms for more relevant generic types
    if (lowerQuery.includes("oncologist") || lowerQuery.includes("cancer center")) facilityType = "Oncology Center";
    else if (lowerQuery.includes("surgeon") || lowerQuery.includes("surgery center")) facilityType = "Surgical Center";
    else if (lowerQuery.includes("cardiologist") || lowerQuery.includes("heart clinic")) facilityType = "Cardiology Clinic";
    else if (lowerQuery.includes("pediatrician") || lowerQuery.includes("child clinic")) facilityType = "Pediatric Clinic";
    else if (lowerQuery.includes("dermatologist") || lowerQuery.includes("skin clinic")) facilityType = "Dermatology Clinic";
    // Then more general terms
    else if (lowerQuery.includes("hospital")) facilityType = "Hospital";
    else if (lowerQuery.includes("clinic")) facilityType = "Clinic";
    else if (lowerQuery.includes("doctor") || lowerQuery.includes("physician")) facilityType = "Doctor's Office";
    else if (lowerQuery.includes("specialist")) facilityType = "Specialist Office"; // Fallback specialist
    else if (lowerQuery.includes("urgent care")) facilityType = "Urgent Care Center";

    let pseudoLocation = "Anytown"; 
    const locationKeywords = ["in ", "near ", "at ", "around "];
    for (const keyword of locationKeywords) {
        const keywordIndex = lowerQuery.indexOf(keyword);
        if (keywordIndex !== -1) {
            const potentialLocation = lowerQuery.substring(keywordIndex + keyword.length).split(/,|\bon\b|\bfor\b|\band\b|\bwith\b|\bthe\b/)[0].trim();
            const cleanedLocation = potentialLocation.replace(/\b\d{5}\b/g, '').trim(); 
            if (cleanedLocation.length > 2 || cleanedLocation.split(' ').length > 1) {
                 pseudoLocation = cleanedLocation.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');
                 break;
            }
        }
    }
    if (pseudoLocation === "Anytown" && lowerQuery.match(/\b\d{5}\b/)) {
        pseudoLocation = lowerQuery.match(/\b\d{5}\b/)![0];
    }


    results.push(
      { name: `General ${facilityType} of ${pseudoLocation}`, address: `123 Health St, ${pseudoLocation}, Earth`, type: facilityType },
      { name: `Community ${facilityType} Center`, address: `456 Care Ave, ${pseudoLocation}, Earth`, type: facilityType }
    );
    if (Math.random() > 0.5) { 
         results.push({ name: `Advanced ${facilityType} Services`, address: `789 Wellness Blvd, ${pseudoLocation}, Earth`, type: facilityType });
    }
  }
  
  const uniqueResults = results.filter((facility, index, self) =>
    index === self.findIndex((f) => (
      f.name === facility.name && f.address === facility.address
    ))
  );

  const finalResults = uniqueResults.slice(0, Math.min(uniqueResults.length, 5));

  if (finalResults.length === 0 && query.trim() !== "") {
     console.warn(`Mock maps service: No specific or generic facilities found for query: "${query}". Returning empty array as per design for LLM clarity.`);
     return []; // Return a genuinely empty array if nothing is found
  }

  // console.log(`[MAPS DEBUG] Final results for query "${query}": ${JSON.stringify(finalResults, null, 2)}`);
  return finalResults;
}
