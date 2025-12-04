// Mock Data for Openflights Database

export interface Airline {
    id: number;
    name: string;
    alias: string;
    iata: string;
    icao: string;
    callsign: string;
    country: string;
    active: string;
}

export interface Airport {
    id: number;
    name: string;
    city: string;
    country: string;
    iata: string;
    icao: string;
    latitude: number;
    longitude: number;
    altitude: number;
    timezone: string;
    dst: string;
    tz: string;
    type: string;
    source: string;
}

export interface Route {
    airline: string;
    airlineId: number;
    sourceAirport: string;
    sourceAirportId: number;
    destinationAirport: string;
    destinationAirportId: number;
    codeshare: string;
    stops: number;
    equipment: string;
}

// Mock Airlines
export const mockAirlines: Airline[] = [
    {
        id: 1,
        name: "American Airlines",
        alias: "AA",
        iata: "AA",
        icao: "AAL",
        callsign: "AMERICAN",
        country: "United States",
        active: "Y"
    },
    {
        id: 2,
        name: "Delta Air Lines",
        alias: "DL",
        iata: "DL",
        icao: "DAL",
        callsign: "DELTA",
        country: "United States",
        active: "Y"
    },
    {
        id: 3,
        name: "United Airlines",
        alias: "UA",
        iata: "UA",
        icao: "UAL",
        callsign: "UNITED",
        country: "United States",
        active: "Y"
    },
    {
        id: 4,
        name: "Southwest Airlines",
        alias: "WN",
        iata: "WN",
        icao: "SWA",
        callsign: "SOUTHWEST",
        country: "United States",
        active: "Y"
    },
    {
        id: 5,
        name: "Alaska Airlines",
        alias: "AS",
        iata: "AS",
        icao: "ASA",
        callsign: "ALASKA",
        country: "United States",
        active: "Y"
    }
];

// Mock Airports
export const mockAirports: Airport[] = [
    {
        id: 1,
        name: "San Francisco International Airport",
        city: "San Francisco",
        country: "United States",
        iata: "SFO",
        icao: "KSFO",
        latitude: 37.618972,
        longitude: -122.374889,
        altitude: 13,
        timezone: "-8",
        dst: "A",
        tz: "America/Los_Angeles",
        type: "airport",
        source: "OurAirports"
    },
    {
        id: 2,
        name: "Los Angeles International Airport",
        city: "Los Angeles",
        country: "United States",
        iata: "LAX",
        icao: "KLAX",
        latitude: 33.942536,
        longitude: -118.408075,
        altitude: 125,
        timezone: "-8",
        dst: "A",
        tz: "America/Los_Angeles",
        type: "airport",
        source: "OurAirports"
    },
    {
        id: 3,
        name: "John F Kennedy International Airport",
        city: "New York",
        country: "United States",
        iata: "JFK",
        icao: "KJFK",
        latitude: 40.639751,
        longitude: -73.778925,
        altitude: 13,
        timezone: "-5",
        dst: "A",
        tz: "America/New_York",
        type: "airport",
        source: "OurAirports"
    },
    {
        id: 4,
        name: "Chicago O'Hare International Airport",
        city: "Chicago",
        country: "United States",
        iata: "ORD",
        icao: "KORD",
        latitude: 41.978603,
        longitude: -87.904842,
        altitude: 672,
        timezone: "-6",
        dst: "A",
        tz: "America/Chicago",
        type: "airport",
        source: "OurAirports"
    },
    {
        id: 5,
        name: "Seattle-Tacoma International Airport",
        city: "Seattle",
        country: "United States",
        iata: "SEA",
        icao: "KSEA",
        latitude: 47.449,
        longitude: -122.309306,
        altitude: 433,
        timezone: "-8",
        dst: "A",
        tz: "America/Los_Angeles",
        type: "airport",
        source: "OurAirports"
    }
];

// Mock Routes
export const mockRoutes: Route[] = [
    { airline: "AA", airlineId: 1, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "LAX", destinationAirportId: 2, codeshare: "", stops: 0, equipment: "738" },
    { airline: "AA", airlineId: 1, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "JFK", destinationAirportId: 3, codeshare: "", stops: 0, equipment: "321" },
    { airline: "AA", airlineId: 1, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "ORD", destinationAirportId: 4, codeshare: "", stops: 0, equipment: "738" },
    { airline: "AA", airlineId: 1, sourceAirport: "LAX", sourceAirportId: 2, destinationAirport: "JFK", destinationAirportId: 3, codeshare: "", stops: 0, equipment: "321" },
    { airline: "AA", airlineId: 1, sourceAirport: "LAX", sourceAirportId: 2, destinationAirport: "ORD", destinationAirportId: 4, codeshare: "", stops: 0, equipment: "738" },

    { airline: "DL", airlineId: 2, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "SEA", destinationAirportId: 5, codeshare: "", stops: 0, equipment: "739" },
    { airline: "DL", airlineId: 2, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "JFK", destinationAirportId: 3, codeshare: "", stops: 0, equipment: "763" },
    { airline: "DL", airlineId: 2, sourceAirport: "LAX", sourceAirportId: 2, destinationAirport: "JFK", destinationAirportId: 3, codeshare: "", stops: 0, equipment: "321" },
    { airline: "DL", airlineId: 2, sourceAirport: "LAX", sourceAirportId: 2, destinationAirport: "SEA", destinationAirportId: 5, codeshare: "", stops: 0, equipment: "739" },
    { airline: "DL", airlineId: 2, sourceAirport: "SEA", sourceAirportId: 5, destinationAirport: "JFK", destinationAirportId: 3, codeshare: "", stops: 0, equipment: "739" },
    { airline: "DL", airlineId: 2, sourceAirport: "SEA", sourceAirportId: 5, destinationAirport: "ORD", destinationAirportId: 4, codeshare: "", stops: 0, equipment: "739" },
    { airline: "DL", airlineId: 2, sourceAirport: "JFK", sourceAirportId: 3, destinationAirport: "ORD", destinationAirportId: 4, codeshare: "", stops: 0, equipment: "739" },

    { airline: "UA", airlineId: 3, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "LAX", destinationAirportId: 2, codeshare: "", stops: 0, equipment: "738" },
    { airline: "UA", airlineId: 3, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "ORD", destinationAirportId: 4, codeshare: "", stops: 0, equipment: "739" },
    { airline: "UA", airlineId: 3, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "JFK", destinationAirportId: 3, codeshare: "", stops: 0, equipment: "757" },
    { airline: "UA", airlineId: 3, sourceAirport: "LAX", sourceAirportId: 2, destinationAirport: "ORD", destinationAirportId: 4, codeshare: "", stops: 0, equipment: "738" },
    { airline: "UA", airlineId: 3, sourceAirport: "ORD", sourceAirportId: 4, destinationAirport: "JFK", destinationAirportId: 3, codeshare: "", stops: 0, equipment: "738" },

    { airline: "WN", airlineId: 4, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "LAX", destinationAirportId: 2, codeshare: "", stops: 0, equipment: "73W" },
    { airline: "WN", airlineId: 4, sourceAirport: "LAX", sourceAirportId: 2, destinationAirport: "SEA", destinationAirportId: 5, codeshare: "", stops: 0, equipment: "73W" },

    { airline: "AS", airlineId: 5, sourceAirport: "SFO", sourceAirportId: 1, destinationAirport: "SEA", destinationAirportId: 5, codeshare: "", stops: 0, equipment: "73J" },
    { airline: "AS", airlineId: 5, sourceAirport: "SEA", sourceAirportId: 5, destinationAirport: "LAX", destinationAirportId: 2, codeshare: "", stops: 0, equipment: "73J" },
    { airline: "AS", airlineId: 5, sourceAirport: "SEA", sourceAirportId: 5, destinationAirport: "ORD", destinationAirportId: 4, codeshare: "", stops: 0, equipment: "73J" },
];

// Helper function to get airline by IATA code
export function getAirlineByIATA(iata: string, airlines: Airline[] = mockAirlines): Airline | undefined {
    return airlines.find(airline => airline.iata.toLowerCase() === iata.toLowerCase());
}

// Helper function to get airport by IATA code
export function getAirportByIATA(iata: string, airports: Airport[] = mockAirports): Airport | undefined {
    return airports.find(airport => airport.iata.toLowerCase() === iata.toLowerCase());
}

// Helper function to get routes for an airline
export function getRoutesForAirline(iata: string, routes: Route[] = mockRoutes, airports: Airport[] = mockAirports, airlines: Airline[] = mockAirlines) {
    const airline = getAirlineByIATA(iata, airlines);
    if (!airline) return null;

    const airlineRoutes = routes.filter(route => route.airline === iata.toUpperCase());

    // Count routes per airport
    const airportCounts = new Map<string, number>();
    airlineRoutes.forEach(route => {
        airportCounts.set(route.destinationAirport, (airportCounts.get(route.destinationAirport) || 0) + 1);
        airportCounts.set(route.sourceAirport, (airportCounts.get(route.sourceAirport) || 0) + 1);
    });

    // Get unique airports with route counts
    const uniqueAirports = Array.from(new Set([
        ...airlineRoutes.map(r => r.sourceAirport),
        ...airlineRoutes.map(r => r.destinationAirport)
    ])).map(iata => {
        const airport = getAirportByIATA(iata, airports);
        return {
            ...airport,
            routeCount: airportCounts.get(iata) || 0
        };
    }).sort((a, b) => b.routeCount - a.routeCount);

    return {
        airline,
        airports: uniqueAirports
    };
}

// Helper function to get airlines for an airport
export function getAirlinesForAirport(iata: string, routes: Route[] = mockRoutes, airports: Airport[] = mockAirports, airlines: Airline[] = mockAirlines) {
    const airport = getAirportByIATA(iata, airports);
    if (!airport) return null;

    const airportRoutes = routes.filter(
        route => route.sourceAirport === iata.toUpperCase() || route.destinationAirport === iata.toUpperCase()
    );

    // Count routes per airline
    const airlineCounts = new Map<string, number>();
    airportRoutes.forEach(route => {
        airlineCounts.set(route.airline, (airlineCounts.get(route.airline) || 0) + 1);
    });

    // Get unique airlines with route counts
    const uniqueAirlines = Array.from(new Set(airportRoutes.map(r => r.airline))).map(iata => {
        const airline = getAirlineByIATA(iata, airlines);
        return {
            ...airline,
            routeCount: airlineCounts.get(iata) || 0
        };
    }).sort((a, b) => b.routeCount - a.routeCount);

    return {
        airport,
        airlines: uniqueAirlines
    };
}

// Helper function to get all airlines sorted by IATA
export function getAllAirlinesSorted(airlines: Airline[] = mockAirlines): Airline[] {
    return [...airlines].sort((a, b) => a.iata.localeCompare(b.iata));
}

// Helper function to get all airports sorted by IATA
export function getAllAirportsSorted(airports: Airport[] = mockAirports): Airport[] {
    return [...airports].sort((a, b) => a.iata.localeCompare(b.iata));
}

// Helper function to export to CSV
export function exportToCSV(data: any[], filename: string) {
    if (data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvContent = [
        headers.join(','),
        ...data.map(row => headers.map(header => {
            const value = row[header];
            // Escape commas and quotes
            if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
                return `"${value.replace(/"/g, '""')}"`;
            }
            return value;
        }).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
