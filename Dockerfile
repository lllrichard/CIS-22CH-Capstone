# Use Ubuntu as the base image
FROM ubuntu:22.04

# Install build tools and Boost (Crow relies on Boost ASIO)
RUN apt-get update && \
    apt-get install -y build-essential cmake libboost-all-dev && \
    rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Copy source + data files into the image
COPY app.cpp crow_all.h airlines.dat airports.dat routes.dat ./

# Build the Crow server (adjust flags if you add more files)
RUN g++ app.cpp -std=c++17 -O2 -pthread -o server

# Render injects PORT; default to 8080 for local docker run
ENV PORT=8080

EXPOSE 8080

# Start the server
CMD ["./server"]