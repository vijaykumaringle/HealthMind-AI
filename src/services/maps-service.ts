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
  await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 500)); // Add some randomness

  // Mocked responses based on query keywords
  const lowerQuery = query.toLowerCase();

  if (lowerQuery.includes("pune")) {
    if (lowerQuery.includes("hospital") || lowerQuery.includes("hospitals")) {
        return [
            { name: "Sahyadri Super Speciality Hospital Deccan", address: "Plot No. 30-C, Erandwane, Deccan Gymkhana, Pune, Maharashtra 411004", type: "Super Speciality Hospital" },
            { name: "Jehangir Hospital", address: "32, Sassoon Rd, Opposite Pune Railway Station, Central Excise Colony, Sangamvadi, Pune, Maharashtra 411001", type: "Multi-Speciality Hospital" },
            { name: "Noble Hospital", address: "153, Magarpatta Road, Hadapsar, Pune, Maharashtra 411013", type: "Multi-Speciality Hospital" },
            { name: "KEM Hospital", address: "489, Rasta Peth, Sardar Moodliar Rd, Pune, Maharashtra 411011", type: "General Hospital" }
        ].slice(0,3); // Return top 3
    } else if (lowerQuery.includes("clinic") || lowerQuery.includes("clinics")) {
        return [
            { name: "Dr. Joshi's Family Clinic", address: "Shop No 5, Near Balgandharva Chowk, FC Road, Shivajinagar, Pune, Maharashtra 411005", type: "General Clinic" },
            { name: "Wellness First Polyclinic", address: "North Main Road, Koregaon Park, Pune, Maharashtra 411001", type: "Polyclinic" },
            { name: "Care & Cure Clinic", address: "Viman Nagar Rd, Clover Park, Viman Nagar, Pune, Maharashtra 411014", type: "Family Clinic"}
        ].slice(0,3);
    } else if (lowerQuery.includes("cardiologist") || lowerQuery.includes("cardiology")) {
        return [
            { name: "Deccan Heart Institute", address: "Deccan Gymkhana, Pune", type: "Cardiology Hospital"},
            { name: "Dr. Rahul Patil - Cardiologist", address: "Tilak Road, Pune", type: "Cardiologist Clinic"}
        ].slice(0,2);
    }
  }
  
  if (lowerQuery.includes("new york") || lowerQuery.includes("nyc")) {
     if (lowerQuery.includes("hospital") || lowerQuery.includes("hospitals")) {
        return [
            { name: "NewYork-Presbyterian/Weill Cornell Medical Center", address: "525 E 68th St, New York, NY 10065", type: "Hospital" },
            { name: "Mount Sinai Hospital", address: "1 Gustave L Levy Pl, New York, NY 10029", type: "Hospital" },
            { name: "NYU Langone Health", address: "550 1st Avenue, New York, NY 10016", type: "Academic Medical Center"}
        ].slice(0,3);
     } else if (lowerQuery.includes("pediatrician") || lowerQuery.includes("pediatrics")) {
        return [
            { name: "Tribeca Pediatrics", address: "Multiple Locations, New York, NY", type: "Pediatric Clinic"},
            { name: "CPW Pediatrics", address: "251 Central Park West, New York, NY 10024", type: "Pediatric Clinic"}
        ].slice(0,2);
     }
  }

  // Generic fallback if no specific keywords match, or query is too generic
  if (lowerQuery.includes("hospital") || lowerQuery.includes("hospitals")) {
    return [
        { name: "City General Hospital", address: "123 Main St, Anytown, USA", type: "Hospital" },
        { name: "County Medical Center", address: "456 Oak Rd, Anytown, USA", type: "Medical Center" },
    ];
  }
   if (lowerQuery.includes("clinic") || lowerQuery.includes("clinics")) {
    return [
        { name: "Community Health Clinic", address: "789 Pine Ave, Anytown, USA", type: "Clinic" },
        { name: "Downtown Urgent Care", address: "101 River St, Anytown, USA", type: "Urgent Care Clinic" },
    ];
  }


  // If query is very generic or doesn't match known patterns, return fewer/empty results
  console.warn(`Mock maps service: Unhandled query or too generic: "${query}". Returning empty array.`);
  return [];
}
