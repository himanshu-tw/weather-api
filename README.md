# weather-api

A simple weather api wrapper built with bun and typescript.

This project is a solution to the [roadmap.sh weather api project](https://roadmap.sh/projects/weather-api-wrapper-service)

## Features
- **Caching with Redis:** - When the result is being fetched for the first time from the API, the response is cached in Redis so next time, it is much faster.
- **Rate limit:** - When someone sends more than 100 requests in 1 minute their IP Address is temporarily blocked for security reasons.

## Getting Started

### Prerequisites
Make sure you have [Bun](https://bun.com/) installed on your system (version 1.4 or higher recommended).

### Installation & Running

1. Clone this repository to your local machine:
   ```bash
   git clone https://github.com/himanshu-tw/weather-api.git
   ```

2. Navigate into the project directory:
   ```bash
   cd weather-api
   ```

3. Run the server directly:
   ```bash
   bun run src/index.ts
   ```

