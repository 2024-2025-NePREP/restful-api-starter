export const pricingTiers = [
  { maxHours: 1, amount: 200 },   // 1 hour = 400
  { maxHours: 2, amount: 500 },  // 2 hours = 1000
  { maxHours: 3, amount: 800 },  // 4 hours = 1800
  { maxHours: 5, amount: 1000 },  // 8 hours = 3000
  { maxHours: 6, amount: 1200 },  // 8 hours = 3000
  { maxHours: 7, amount: 1500 },  // 8 hours = 3000
  { maxHours: 8, amount: 1800 },  // 8 hours = 3000
  { maxHours: 9, amount: 2000 },  // 8 hours = 3000
  { maxHours: 10, amount: 2300 },  // 8 hours = 3000
  // Add more tiers as needed
];

// Function to determine amount based on duration (in hours)
export function getParkingAmount(durationHours: number): number {
  for (const tier of pricingTiers) {
    if (durationHours <= tier.maxHours) {
      return tier.amount;
    }
  }
  // Default/fallback for durations exceeding the last tier
  return pricingTiers[pricingTiers.length - 1].amount + 500; // Add extra for longer durations
}