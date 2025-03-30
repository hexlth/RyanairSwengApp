export interface Route {
  flightNumber: string;
  from: { iata: string };
  to: { iata: string };
  isLow?: boolean;  
}
