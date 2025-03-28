export interface Route {
    flightNumber: string,
    to: {
      iata: string
    },
    from: {
      iata: string
    },
  }