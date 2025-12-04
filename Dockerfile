   FROM ubuntu22.04

   # Install build tools + boost (Crow depends on Boost ASIO)
   RUN apt-get update && 
       apt-get install -y build-essential cmake libboost-all-dev && 
       rm -rf varlibaptlists

   WORKDIR app

   # Copy source and data
   COPY app.cpp crow_all.h airlines.dat airports.dat routes.dat .

   # Build
   RUN g++ app.cpp -std=c++17 -O2 -pthread -o server

   # Render sets PORT; default fallback for local testing
   ENV PORT=8080

   EXPOSE 8080
   CMD [.server]