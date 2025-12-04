#define CROW_USE_BOOST
#include "crow_all.h"
#include <cstdlib>

#include <fstream>
#include <sstream>
#include <string>
#include <vector>
#include <unordered_map>
#include <iostream>
#include <algorithm>
#include <cmath>
#include <utility>

// ---------- Constants ----------

const double PI = 3.14159265358979323846;

// ---------- Data Structures ----------

struct Airline {
    int id = -1;
    std::string name;
    std::string alias;
    std::string iata;
    std::string icao;
    std::string callsign;
    std::string country;
    std::string active;
};

struct Airport {
    int id = -1;
    std::string name;
    std::string city;
    std::string country;
    std::string iata;
    std::string icao;
    double latitude  = 0.0;
    double longitude = 0.0;
};

struct Route {
    int airlineId    = -1;
    int srcAirportId = -1;
    int dstAirportId = -1;
    int stops        = 0;
};

// ---------- Global Storage ----------

// airlines
std::unordered_map<int, Airline> airlinesById;
std::unordered_map<std::string, Airline*> airlinesByIata;

// airports
std::unordered_map<int, Airport> airportsById;
std::unordered_map<std::string, Airport*> airportsByIata;

// routes
std::vector<Route> routes;

// ---------- CSV Helpers ----------

std::vector<std::string> parseCsvLine(const std::string& line) {
    std::vector<std::string> result;
    std::string field;
    bool inQuotes = false;

    for (char c : line) {
        if (c == '"') {
            inQuotes = !inQuotes;
        } else if (c == ',' && !inQuotes) {
            result.push_back(field);
            field.clear();
        } else {
            field.push_back(c);
        }
    }
    result.push_back(field);
    return result;
}

bool isNullField(const std::string& s) {
    return s == "\\N" || s.empty();
}

// ---------- Loaders ----------

void loadAirlines(const std::string& filename) {
    std::ifstream in(filename);
    if (!in) {
        std::cerr << "Failed to open airlines file: " << filename << "\n";
        return;
    }

    std::string line;
    while (std::getline(in, line)) {
        auto fields = parseCsvLine(line);
        if (fields.size() < 8) continue;

        Airline a;
        if (!isNullField(fields[0])) a.id = std::stoi(fields[0]);
        a.name     = fields[1];
        a.alias    = fields[2];
        a.iata     = isNullField(fields[3]) ? "" : fields[3];
        a.icao     = fields[4];
        a.callsign = fields[5];
        a.country  = fields[6];
        a.active   = fields[7];

        if (a.id == -1) continue;
        airlinesById[a.id] = a;
    }

    // build IATA index
    for (auto& kv : airlinesById) {
        Airline& a = kv.second;
        if (!a.iata.empty()) {
            airlinesByIata[a.iata] = &a;
        }
    }

    std::cerr << "Loaded " << airlinesById.size() << " airlines.\n";
}

void loadAirports(const std::string& filename) {
    std::ifstream in(filename);
    if (!in) {
        std::cerr << "Failed to open airports file: " << filename << "\n";
        return;
    }

    std::string line;
    while (std::getline(in, line)) {
        auto fields = parseCsvLine(line);
        if (fields.size() < 8) continue;

        Airport ap;
        if (!isNullField(fields[0])) ap.id = std::stoi(fields[0]);
        ap.name     = fields[1];
        ap.city     = fields[2];
        ap.country  = fields[3];
        ap.iata     = isNullField(fields[4]) ? "" : fields[4];
        ap.icao     = fields[5];
        ap.latitude  = isNullField(fields[6]) ? 0.0 : std::stod(fields[6]);
        ap.longitude = isNullField(fields[7]) ? 0.0 : std::stod(fields[7]);

        if (ap.id == -1) continue;
        airportsById[ap.id] = ap;
    }

    // build IATA index
    for (auto& kv : airportsById) {
        Airport& ap = kv.second;
        if (!ap.iata.empty()) {
            airportsByIata[ap.iata] = &ap;
        }
    }

    std::cerr << "Loaded " << airportsById.size() << " airports.\n";
}

void loadRoutes(const std::string& filename) {
    std::ifstream in(filename);
    if (!in) {
        std::cerr << "Failed to open routes file: " << filename << "\n";
        return;
    }

    std::string line;
    while (std::getline(in, line)) {
        if (line.empty()) continue;
        auto fields = parseCsvLine(line);
        if (fields.size() < 8) continue;

        Route r;
        // fields: 0 airline code, 1 airline ID,
        //         2 src code,   3 src ID,
        //         4 dst code,   5 dst ID,
        //         6 codeshare,  7 stops, ...
        if (!isNullField(fields[1])) r.airlineId    = std::stoi(fields[1]);
        if (!isNullField(fields[3])) r.srcAirportId = std::stoi(fields[3]);
        if (!isNullField(fields[5])) r.dstAirportId = std::stoi(fields[5]);
        if (!isNullField(fields[7])) r.stops        = std::stoi(fields[7]);

        if (r.airlineId == -1 || r.srcAirportId == -1 || r.dstAirportId == -1)
            continue;

        routes.push_back(r);
    }

    std::cerr << "Loaded " << routes.size() << " routes.\n";
}

// ---------- Lookup Helpers ----------

Airline* getAirlineByIata(const std::string& code) {
    auto it = airlinesByIata.find(code);
    if (it == airlinesByIata.end()) return nullptr;
    return it->second;
}

Airport* getAirportByIata(const std::string& code) {
    auto it = airportsByIata.find(code);
    if (it == airportsByIata.end()) return nullptr;
    return it->second;
}

// Haversine distance in kilometers
double haversineKm(double lat1, double lon1, double lat2, double lon2) {
    const double R = 6371.0; // Earth radius in km
    double dLat = (lat2 - lat1) * PI / 180.0;
    double dLon = (lon2 - lon1) * PI / 180.0;
    double a =
        std::sin(dLat / 2) * std::sin(dLat / 2) +
        std::cos(lat1 * PI / 180.0) * std::cos(lat2 * PI / 180.0) *
        std::sin(dLon / 2) * std::sin(dLon / 2);
    double c = 2 * std::atan2(std::sqrt(a), std::sqrt(1 - a));
    return R * c;
}

// ---------- CORS Helpers ----------

std::string getAllowedOrigin() {
    static std::string origin = [](){
        const char* env = std::getenv("ALLOWED_ORIGIN");
        return env ? std::string(env) : "http://localhost:3000";
    }();
    return origin;
}

struct CorsMiddleware {
    struct context {};

    void before_handle(crow::request& /*req*/, crow::response& /*res*/, context& /*ctx*/) {
        // no-op
    }

    void after_handle(crow::request& /*req*/, crow::response& res, context& /*ctx*/) {
        res.add_header("Access-Control-Allow-Origin", getAllowedOrigin());
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
    }
};

// ---------- WinMain shim (for some MinGW setups) ----------

#ifdef _WIN32
#include <windows.h>
int main();
int WINAPI WinMain(HINSTANCE, HINSTANCE, LPSTR, int) {
    return main();
}
#endif

// ---------- MAIN ----------

int main() {
    loadAirlines("airlines.dat");
    loadAirports("airports.dat");
    loadRoutes("routes.dat");

    // use CORS middleware
    crow::App<CorsMiddleware> app;

    // --- basic health check ---
    CROW_ROUTE(app, "/health")
    ([]{
        crow::json::wvalue r;
        r["status"] = "ok";
        return r;
    });

    // --- student info endpoint ---
    CROW_ROUTE(app, "/student")
    ([]{
        crow::json::wvalue r;
        r["name"]       = "Richard Chan";
        r["student_id"] = "20628498";
        return r;
    });

    // --- airline by IATA ---
    CROW_ROUTE(app, "/airline/<string>")
    ([](const std::string& iata) {
        crow::json::wvalue r;
        Airline* a = getAirlineByIata(iata);
        if (!a) {
            r["error"] = "Airline not found";
            return r;
        }
        r["id"]       = a->id;
        r["name"]     = a->name;
        r["alias"]    = a->alias;
        r["iata"]     = a->iata;
        r["icao"]     = a->icao;
        r["callsign"] = a->callsign;
        r["country"]  = a->country;
        r["active"]   = a->active;
        return r;
    });

    // --- airport by IATA ---
    CROW_ROUTE(app, "/airport/<string>")
    ([](const std::string& iata) {
        crow::json::wvalue r;
        Airport* ap = getAirportByIata(iata);
        if (!ap) {
            r["error"] = "Airport not found";
            return r;
        }
        r["id"]        = ap->id;
        r["name"]      = ap->name;
        r["city"]      = ap->city;
        r["country"]   = ap->country;
        r["iata"]      = ap->iata;
        r["icao"]      = ap->icao;
        r["latitude"]  = ap->latitude;
        r["longitude"] = ap->longitude;
        return r;
    });

    // --- airlines that fly into a given airport (destination) ---
    CROW_ROUTE(app, "/airlinesForAirport/<string>")
    ([](const std::string& airportIata) {
        crow::json::wvalue r;
        Airport* ap = getAirportByIata(airportIata);
        if (!ap) {
            r["error"] = "Airport not found";
            return r;
        }

        // collect airline IDs that have this airport as destination
        std::unordered_map<int, bool> airlineIds;
        for (const auto& rt : routes) {
            if (rt.dstAirportId == ap->id) {
                airlineIds[rt.airlineId] = true;
            }
        }

        // build list of airlines
        std::vector<const Airline*> list;
        list.reserve(airlineIds.size());
        for (auto& kv : airlineIds) {
            auto it = airlinesById.find(kv.first);
            if (it != airlinesById.end()) {
                list.push_back(&it->second);
            }
        }

        // sort by airline IATA for stable output
        std::sort(list.begin(), list.end(),
                  [](const Airline* a, const Airline* b) {
                      return a->iata < b->iata;
                  });

        crow::json::wvalue arr = crow::json::wvalue::list(list.size());
        for (size_t i = 0; i < list.size(); ++i) {
            arr[i]["id"]      = list[i]->id;
            arr[i]["name"]    = list[i]->name;
            arr[i]["iata"]    = list[i]->iata;
            arr[i]["country"] = list[i]->country;
        }

        r["airport"]  = ap->iata;
        r["airlines"] = std::move(arr);
        return r;
    });

    // --- top 3 destination cities for an airline ---
    CROW_ROUTE(app, "/topCitiesForAirline/<string>")
    ([](const std::string& airlineIata) {
        crow::json::wvalue r;
        Airline* a = getAirlineByIata(airlineIata);
        if (!a) {
            r["error"] = "Airline not found";
            return r;
        }

        int n = 3; // for now: always top 3

        // count destination cities
        std::unordered_map<std::string, int> cityCount;
        for (const auto& rt : routes) {
            if (rt.airlineId == a->id) {
                auto itAp = airportsById.find(rt.dstAirportId);
                if (itAp != airportsById.end()) {
                    const Airport& ap = itAp->second;
                    cityCount[ap.city] += 1;
                }
            }
        }

        struct Row { std::string city; int count; };
        std::vector<Row> rows;
        rows.reserve(cityCount.size());
        for (auto& kv : cityCount) {
            rows.push_back({ kv.first, kv.second });
        }

        std::sort(rows.begin(), rows.end(),
                  [](const Row& x, const Row& y) {
                      return x.count > y.count;
                  });

        if (n > static_cast<int>(rows.size()))
            n = static_cast<int>(rows.size());

        crow::json::wvalue arr = crow::json::wvalue::list(n);
        for (int i = 0; i < n; ++i) {
            arr[i]["city"]   = rows[i].city;
            arr[i]["routes"] = rows[i].count;
        }

        r["airline"]    = a->iata;
        r["top_cities"] = std::move(arr);
        return r;
    });

    // --- distance between two airports by IATA ---
    CROW_ROUTE(app, "/distance/<string>/<string>")
    ([](const std::string& srcIata, const std::string& dstIata) {
        crow::json::wvalue r;

        Airport* src = getAirportByIata(srcIata);
        Airport* dst = getAirportByIata(dstIata);

        if (!src) {
            r["error"] = "Source airport not found";
            return r;
        }
        if (!dst) {
            r["error"] = "Destination airport not found";
            return r;
        }

        double km = haversineKm(src->latitude, src->longitude,
                                dst->latitude, dst->longitude);
        double miles = km * 0.621371;

        r["src"]          = src->iata;
        r["dst"]          = dst->iata;
        r["distance_km"]  = km;
        r["distance_mi"]  = miles;
        return r;
    });

    // --- reports: all airlines sorted by IATA ---
    CROW_ROUTE(app, "/reports/airlines")
    ([] {
        std::vector<const Airline*> list;
        list.reserve(airlinesById.size());
        for (auto& kv : airlinesById) {
            list.push_back(&kv.second);
        }

        std::sort(list.begin(), list.end(),
                  [](const Airline* a, const Airline* b) {
                      return a->iata < b->iata;
                  });

        crow::json::wvalue arr = crow::json::wvalue::list(list.size());
        for (size_t i = 0; i < list.size(); ++i) {
            arr[i]["id"]       = list[i]->id;
            arr[i]["name"]     = list[i]->name;
            arr[i]["iata"]     = list[i]->iata;
            arr[i]["icao"]     = list[i]->icao;
            arr[i]["country"]  = list[i]->country;
            arr[i]["active"]   = list[i]->active;
        }

        crow::json::wvalue r;
        r["count"] = static_cast<int>(list.size());
        r["airlines"] = std::move(arr);
        return r;
    });

    // --- reports: all airports sorted by IATA ---
    CROW_ROUTE(app, "/reports/airports")
    ([] {
        std::vector<const Airport*> list;
        list.reserve(airportsById.size());
        for (auto& kv : airportsById) {
            list.push_back(&kv.second);
        }

        std::sort(list.begin(), list.end(),
                  [](const Airport* a, const Airport* b) {
                      return a->iata < b->iata;
                  });

        crow::json::wvalue arr = crow::json::wvalue::list(list.size());
        for (size_t i = 0; i < list.size(); ++i) {
            arr[i]["id"]        = list[i]->id;
            arr[i]["name"]      = list[i]->name;
            arr[i]["iata"]      = list[i]->iata;
            arr[i]["city"]      = list[i]->city;
            arr[i]["country"]   = list[i]->country;
            arr[i]["latitude"]  = list[i]->latitude;
            arr[i]["longitude"] = list[i]->longitude;
        }

        crow::json::wvalue r;
        r["count"] = static_cast<int>(list.size());
        r["airports"] = std::move(arr);
        return r;
    });

    // --- reports: airports served by airline ordered by route counts ---
    CROW_ROUTE(app, "/reports/airlineRoutes/<string>")
    ([](const std::string& airlineIata) {
        crow::json::wvalue r;
        Airline* airline = getAirlineByIata(airlineIata);
        if (!airline) {
            r["error"] = "Airline not found";
            return r;
        }

        std::unordered_map<int, int> airportCounts;
        for (const auto& rt : routes) {
            if (rt.airlineId == airline->id) {
                airportCounts[rt.srcAirportId] += 1;
                airportCounts[rt.dstAirportId] += 1;
            }
        }

        struct Row {
            const Airport* airport;
            int count;
        };
        std::vector<Row> rows;
        rows.reserve(airportCounts.size());
        for (auto& kv : airportCounts) {
            auto it = airportsById.find(kv.first);
            if (it != airportsById.end()) {
                rows.push_back({ &it->second, kv.second });
            }
        }

        std::sort(rows.begin(), rows.end(),
                  [](const Row& a, const Row& b) {
                      if (a.count == b.count) {
                          return a.airport->iata < b.airport->iata;
                      }
                      return a.count > b.count;
                  });

        crow::json::wvalue arr = crow::json::wvalue::list(rows.size());
        for (size_t i = 0; i < rows.size(); ++i) {
            arr[i]["iata"]      = rows[i].airport->iata;
            arr[i]["name"]      = rows[i].airport->name;
            arr[i]["city"]      = rows[i].airport->city;
            arr[i]["country"]   = rows[i].airport->country;
            arr[i]["routes"]    = rows[i].count;
        }

        r["airline"]["id"]      = airline->id;
        r["airline"]["name"]    = airline->name;
        r["airline"]["iata"]    = airline->iata;
        r["airline"]["country"] = airline->country;
        r["airports"] = std::move(arr);
        r["count"] = static_cast<int>(rows.size());
        return r;
    });

    // --- reports: airlines serving airport ordered by route counts ---
    CROW_ROUTE(app, "/reports/airportRoutes/<string>")
    ([](const std::string& airportIata) {
        crow::json::wvalue r;
        Airport* airport = getAirportByIata(airportIata);
        if (!airport) {
            r["error"] = "Airport not found";
            return r;
        }

        std::unordered_map<int, int> airlineCounts;
        for (const auto& rt : routes) {
            if (rt.srcAirportId == airport->id || rt.dstAirportId == airport->id) {
                airlineCounts[rt.airlineId] += 1;
            }
        }

        struct Row {
            const Airline* airline;
            int count;
        };
        std::vector<Row> rows;
        rows.reserve(airlineCounts.size());
        for (auto& kv : airlineCounts) {
            auto it = airlinesById.find(kv.first);
            if (it != airlinesById.end()) {
                rows.push_back({ &it->second, kv.second });
            }
        }

        std::sort(rows.begin(), rows.end(),
                  [](const Row& a, const Row& b) {
                      if (a.count == b.count) {
                          return a.airline->iata < b.airline->iata;
                      }
                      return a.count > b.count;
                  });

        crow::json::wvalue arr = crow::json::wvalue::list(rows.size());
        for (size_t i = 0; i < rows.size(); ++i) {
            arr[i]["iata"]     = rows[i].airline->iata;
            arr[i]["name"]     = rows[i].airline->name;
            arr[i]["country"]  = rows[i].airline->country;
            arr[i]["routes"]   = rows[i].count;
        }

        r["airport"]["id"]      = airport->id;
        r["airport"]["name"]    = airport->name;
        r["airport"]["iata"]    = airport->iata;
        r["airport"]["city"]    = airport->city;
        r["airport"]["country"] = airport->country;
        r["airlines"] = std::move(arr);
        r["count"] = static_cast<int>(rows.size());
        return r;
    });

    // --- GET /code - return this source file ---
    CROW_ROUTE(app, "/code")
    ([] {
        crow::json::wvalue r;
        std::ifstream file("app.cpp");
        if (!file) {
            r["error"] = "Could not read source file";
            return r;
        }
        std::stringstream buffer;
        buffer << file.rdbuf();
        r["code"] = buffer.str();
        r["filename"] = "app.cpp";
        return r;
    });

    // --- GET /onehop/<src>/<dst> - find 1-hop connections ---
    CROW_ROUTE(app, "/onehop/<string>/<string>")
    ([](const std::string& srcIata, const std::string& dstIata) {
        crow::json::wvalue r;

        Airport* src = getAirportByIata(srcIata);
        Airport* dst = getAirportByIata(dstIata);

        if (!src) {
            r["error"] = "Source airport not found";
            return r;
        }
        if (!dst) {
            r["error"] = "Destination airport not found";
            return r;
        }

        // Find airports reachable from src
        std::unordered_map<int, bool> fromSrc;
        for (const auto& rt : routes) {
            if (rt.srcAirportId == src->id) {
                fromSrc[rt.dstAirportId] = true;
            }
        }

        // Find airports that can reach dst
        std::unordered_map<int, bool> toDst;
        for (const auto& rt : routes) {
            if (rt.dstAirportId == dst->id) {
                toDst[rt.srcAirportId] = true;
            }
        }

        // Find intersection (connecting airports)
        std::vector<const Airport*> connections;
        for (auto& kv : fromSrc) {
            if (toDst.find(kv.first) != toDst.end()) {
                auto it = airportsById.find(kv.first);
                if (it != airportsById.end()) {
                    connections.push_back(&it->second);
                }
            }
        }

        // Calculate distances and sort by total distance
        struct Connection {
            const Airport* hub;
            double leg1_km;
            double leg2_km;
            double total_km;
        };

        std::vector<Connection> results;
        for (const Airport* hub : connections) {
            double leg1 = haversineKm(src->latitude, src->longitude, hub->latitude, hub->longitude);
            double leg2 = haversineKm(hub->latitude, hub->longitude, dst->latitude, dst->longitude);
            results.push_back({hub, leg1, leg2, leg1 + leg2});
        }

        // Sort by total distance (ascending)
        std::sort(results.begin(), results.end(),
                  [](const Connection& a, const Connection& b) {
                      return a.total_km < b.total_km;
                  });

        crow::json::wvalue arr = crow::json::wvalue::list(results.size());
        for (size_t i = 0; i < results.size(); ++i) {
            arr[i]["hub_iata"] = results[i].hub->iata;
            arr[i]["hub_name"] = results[i].hub->name;
            arr[i]["hub_city"] = results[i].hub->city;
            arr[i]["leg1_km"] = results[i].leg1_km;
            arr[i]["leg2_km"] = results[i].leg2_km;
            arr[i]["total_km"] = results[i].total_km;
            arr[i]["total_mi"] = results[i].total_km * 0.621371;
        }

        r["src"] = src->iata;
        r["dst"] = dst->iata;
        r["connections"] = std::move(arr);
        r["count"] = static_cast<int>(results.size());
        return r;
    });

    // --- POST /airline - insert new airline ---
    CROW_ROUTE(app, "/airline").methods("POST"_method)
    ([](const crow::request& req) {
        crow::json::wvalue r;
        auto body = crow::json::load(req.body);
        if (!body) {
            r["error"] = "Invalid JSON";
            return r;
        }

        Airline a;
        a.id = body["id"].i();
        a.name = body["name"].s();
        a.iata = body["iata"].s();
        a.icao = body.has("icao") ? std::string(body["icao"].s()) : "";
        a.callsign = body.has("callsign") ? std::string(body["callsign"].s()) : "";
        a.country = body.has("country") ? std::string(body["country"].s()) : "";
        a.active = body.has("active") ? std::string(body["active"].s()) : "Y";

        if (airlinesById.find(a.id) != airlinesById.end()) {
            r["error"] = "Airline ID already exists";
            return r;
        }

        airlinesById[a.id] = a;
        if (!a.iata.empty()) {
            airlinesByIata[a.iata] = &airlinesById[a.id];
        }

        r["success"] = true;
        r["message"] = "Airline inserted successfully";
        r["id"] = a.id;
        return r;
    });

    // --- PUT /airline/<id> - modify airline ---
    CROW_ROUTE(app, "/airline/<int>").methods("PUT"_method)
    ([](const crow::request& req, int id) {
        crow::json::wvalue r;
        auto it = airlinesById.find(id);
        if (it == airlinesById.end()) {
            r["error"] = "Airline ID not found";
            return r;
        }

        auto body = crow::json::load(req.body);
        if (!body) {
            r["error"] = "Invalid JSON";
            return r;
        }

        // Update only fields that are specified
        Airline& a = it->second;
        if (body.has("name")) a.name = std::string(body["name"].s());
        if (body.has("alias")) a.alias = std::string(body["alias"].s());
        if (body.has("icao")) a.icao = std::string(body["icao"].s());
        if (body.has("callsign")) a.callsign = std::string(body["callsign"].s());
        if (body.has("country")) a.country = std::string(body["country"].s());
        if (body.has("active")) a.active = std::string(body["active"].s());
        
        // Handle IATA update - need to update index
        if (body.has("iata")) {
            std::string newIata = std::string(body["iata"].s());
            if (newIata != a.iata) {
                if (!a.iata.empty()) {
                    airlinesByIata.erase(a.iata);
                }
                a.iata = newIata;
                if (!a.iata.empty()) {
                    airlinesByIata[a.iata] = &a;
                }
            }
        }

        r["success"] = true;
        r["message"] = "Airline modified successfully";
        r["id"] = id;
        return r;
    });

    // --- DELETE /airline/<id> - remove airline ---
    CROW_ROUTE(app, "/airline/<int>").methods("DELETE"_method)
    ([](int id) {
        crow::json::wvalue r;
        auto it = airlinesById.find(id);
        if (it == airlinesById.end()) {
            r["error"] = "Airline not found";
            return r;
        }

        // Remove from IATA index
        if (!it->second.iata.empty()) {
            airlinesByIata.erase(it->second.iata);
        }

        // Remove routes for this airline
        routes.erase(
            std::remove_if(routes.begin(), routes.end(),
                [id](const Route& rt) { return rt.airlineId == id; }),
            routes.end()
        );

        airlinesById.erase(it);

        r["success"] = true;
        r["message"] = "Airline and associated routes removed";
        return r;
    });

    // --- POST /airport - insert new airport ---
    CROW_ROUTE(app, "/airport").methods("POST"_method)
    ([](const crow::request& req) {
        crow::json::wvalue r;
        auto body = crow::json::load(req.body);
        if (!body) {
            r["error"] = "Invalid JSON";
            return r;
        }

        Airport ap;
        ap.id = body["id"].i();
        ap.name = body["name"].s();
        ap.iata = body["iata"].s();
        ap.city = body.has("city") ? std::string(body["city"].s()) : "";
        ap.country = body.has("country") ? std::string(body["country"].s()) : "";
        ap.icao = body.has("icao") ? std::string(body["icao"].s()) : "";
        ap.latitude = body.has("latitude") ? body["latitude"].d() : 0.0;
        ap.longitude = body.has("longitude") ? body["longitude"].d() : 0.0;

        if (airportsById.find(ap.id) != airportsById.end()) {
            r["error"] = "Airport ID already exists";
            return r;
        }

        airportsById[ap.id] = ap;
        if (!ap.iata.empty()) {
            airportsByIata[ap.iata] = &airportsById[ap.id];
        }

        r["success"] = true;
        r["message"] = "Airport inserted successfully";
        r["id"] = ap.id;
        return r;
    });

    // --- PUT /airport/<id> - modify airport ---
    CROW_ROUTE(app, "/airport/<int>").methods("PUT"_method)
    ([](const crow::request& req, int id) {
        crow::json::wvalue r;
        auto it = airportsById.find(id);
        if (it == airportsById.end()) {
            r["error"] = "Airport ID not found";
            return r;
        }

        auto body = crow::json::load(req.body);
        if (!body) {
            r["error"] = "Invalid JSON";
            return r;
        }

        // Update only fields that are specified
        Airport& ap = it->second;
        if (body.has("name")) ap.name = std::string(body["name"].s());
        if (body.has("city")) ap.city = std::string(body["city"].s());
        if (body.has("country")) ap.country = std::string(body["country"].s());
        if (body.has("icao")) ap.icao = std::string(body["icao"].s());
        if (body.has("latitude")) ap.latitude = body["latitude"].d();
        if (body.has("longitude")) ap.longitude = body["longitude"].d();
        
        // Handle IATA update - need to update index
        if (body.has("iata")) {
            std::string newIata = std::string(body["iata"].s());
            if (newIata != ap.iata) {
                if (!ap.iata.empty()) {
                    airportsByIata.erase(ap.iata);
                }
                ap.iata = newIata;
                if (!ap.iata.empty()) {
                    airportsByIata[ap.iata] = &ap;
                }
            }
        }

        r["success"] = true;
        r["message"] = "Airport modified successfully";
        r["id"] = id;
        return r;
    });

    // --- DELETE /airport/<id> - remove airport ---
    CROW_ROUTE(app, "/airport/<int>").methods("DELETE"_method)
    ([](int id) {
        crow::json::wvalue r;
        auto it = airportsById.find(id);
        if (it == airportsById.end()) {
            r["error"] = "Airport not found";
            return r;
        }

        // Remove from IATA index
        if (!it->second.iata.empty()) {
            airportsByIata.erase(it->second.iata);
        }

        // Remove routes to/from this airport
        routes.erase(
            std::remove_if(routes.begin(), routes.end(),
                [id](const Route& rt) { return rt.srcAirportId == id || rt.dstAirportId == id; }),
            routes.end()
        );

        airportsById.erase(it);

        r["success"] = true;
        r["message"] = "Airport and associated routes removed";
        return r;
    });

    // --- POST /route - insert new route ---
    CROW_ROUTE(app, "/route").methods("POST"_method)
    ([](const crow::request& req) {
        crow::json::wvalue r;
        auto body = crow::json::load(req.body);
        if (!body) {
            r["error"] = "Invalid JSON";
            return r;
        }

        Route rt;
        rt.airlineId = body["airlineId"].i();
        rt.srcAirportId = body["srcAirportId"].i();
        rt.dstAirportId = body["dstAirportId"].i();
        rt.stops = body.has("stops") ? body["stops"].i() : 0;

        // Validate foreign keys
        if (airlinesById.find(rt.airlineId) == airlinesById.end()) {
            r["error"] = "Invalid airline ID";
            return r;
        }
        if (airportsById.find(rt.srcAirportId) == airportsById.end()) {
            r["error"] = "Invalid source airport ID";
            return r;
        }
        if (airportsById.find(rt.dstAirportId) == airportsById.end()) {
            r["error"] = "Invalid destination airport ID";
            return r;
        }

        routes.push_back(rt);

        r["success"] = true;
        r["message"] = "Route inserted successfully";
        return r;
    });

    // --- DELETE /route - remove route ---
    CROW_ROUTE(app, "/route").methods("DELETE"_method)
    ([](const crow::request& req) {
        crow::json::wvalue r;
        auto body = crow::json::load(req.body);
        if (!body) {
            r["error"] = "Invalid JSON";
            return r;
        }

        int airlineId = body["airlineId"].i();
        int srcId = body["srcAirportId"].i();
        int dstId = body["dstAirportId"].i();

        size_t before = routes.size();
        routes.erase(
            std::remove_if(routes.begin(), routes.end(),
                [airlineId, srcId, dstId](const Route& rt) {
                    return rt.airlineId == airlineId &&
                           rt.srcAirportId == srcId &&
                           rt.dstAirportId == dstId;
                }),
            routes.end()
        );

        if (routes.size() == before) {
            r["error"] = "Route not found";
            return r;
        }

        r["success"] = true;
        r["message"] = "Route removed";
        return r;
    });

    // --- OPTIONS handler for CORS preflight ---
    CROW_ROUTE(app, "/<path>").methods("OPTIONS"_method)
    ([](const std::string&) {
        crow::response res(204);
        res.add_header("Access-Control-Allow-Origin", getAllowedOrigin());
        res.add_header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
        res.add_header("Access-Control-Allow-Headers", "Content-Type");
        return res;
    });

    const char* portEnv = std::getenv("PORT");
    int port = portEnv ? std::stoi(portEnv) : 8080;
    app.port(port).multithreaded().run();
    return 0;
}
