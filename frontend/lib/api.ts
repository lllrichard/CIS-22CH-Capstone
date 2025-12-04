// API module for connecting to C++ Crow backend on port 8080

const API_BASE = 'http://localhost:8080';

// Fetch airline by IATA code
export async function fetchAirline(iata: string) {
    const response = await fetch(`${API_BASE}/airline/${iata.toUpperCase()}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Fetch airport by IATA code
export async function fetchAirport(iata: string) {
    const response = await fetch(`${API_BASE}/airport/${iata.toUpperCase()}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Fetch airlines for a given airport (destination)
export async function fetchAirlinesForAirport(airportIata: string) {
    const response = await fetch(`${API_BASE}/airlinesForAirport/${airportIata.toUpperCase()}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data.airlines || [];
}

// Fetch top cities for an airline
export async function fetchTopCitiesForAirline(airlineIata: string) {
    const response = await fetch(`${API_BASE}/topCitiesForAirline/${airlineIata.toUpperCase()}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data.top_cities || [];
}

// Fetch distance between two airports
export async function fetchDistance(srcIata: string, dstIata: string) {
    const response = await fetch(`${API_BASE}/distance/${srcIata.toUpperCase()}/${dstIata.toUpperCase()}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Fetch one-hop connections between two airports
export async function fetchOneHop(srcIata: string, dstIata: string) {
    const response = await fetch(`${API_BASE}/onehop/${srcIata.toUpperCase()}/${dstIata.toUpperCase()}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Fetch source code from backend
export async function fetchCode() {
    const response = await fetch(`${API_BASE}/code`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Insert airline
export async function insertAirline(airline: {
    id: number;
    name: string;
    iata: string;
    icao?: string;
    callsign?: string;
    country?: string;
    active?: string;
}) {
    const response = await fetch(`${API_BASE}/airline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(airline)
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Modify airline
export async function modifyAirline(id: number, updates: {
    name?: string;
    iata?: string;
    icao?: string;
    callsign?: string;
    country?: string;
    active?: string;
}) {
    const response = await fetch(`${API_BASE}/airline/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Delete airline
export async function deleteAirline(id: number) {
    const response = await fetch(`${API_BASE}/airline/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Insert airport
export async function insertAirport(airport: {
    id: number;
    name: string;
    iata: string;
    icao?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}) {
    const response = await fetch(`${API_BASE}/airport`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(airport)
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Modify airport
export async function modifyAirport(id: number, updates: {
    name?: string;
    iata?: string;
    icao?: string;
    city?: string;
    country?: string;
    latitude?: number;
    longitude?: number;
}) {
    const response = await fetch(`${API_BASE}/airport/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Delete airport
export async function deleteAirport(id: number) {
    const response = await fetch(`${API_BASE}/airport/${id}`, {
        method: 'DELETE'
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Insert route
export async function insertRoute(route: {
    airlineId: number;
    srcAirportId: number;
    dstAirportId: number;
    stops?: number;
}) {
    const response = await fetch(`${API_BASE}/route`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route)
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Delete route
export async function deleteRoute(route: {
    airlineId: number;
    srcAirportId: number;
    dstAirportId: number;
}) {
    const response = await fetch(`${API_BASE}/route`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(route)
    });
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Health check
export async function checkHealth() {
    try {
        const response = await fetch(`${API_BASE}/health`);
        const data = await response.json();
        return data.status === 'ok';
    } catch {
        return false;
    }
}

// Reports: airlines ordered by IATA
export async function fetchAirlineReport() {
    const response = await fetch(`${API_BASE}/reports/airlines`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data.airlines || [];
}

// Reports: airports ordered by IATA
export async function fetchAirportReport() {
    const response = await fetch(`${API_BASE}/reports/airports`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data.airports || [];
}

// Reports: airports served by airline ordered by route count
export async function fetchAirlineRoutesReport(iata: string) {
    const response = await fetch(`${API_BASE}/reports/airlineRoutes/${iata.toUpperCase()}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

// Reports: airlines serving airport ordered by route count
export async function fetchAirportRoutesReport(iata: string) {
    const response = await fetch(`${API_BASE}/reports/airportRoutes/${iata.toUpperCase()}`);
    const data = await response.json();
    if (data.error) {
        throw new Error(data.error);
    }
    return data;
}

