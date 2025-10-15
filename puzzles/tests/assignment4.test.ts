// import { describe, it, expect } from 'vitest';
// import { optimizeDeliveryRoute } from '../problems/assignment4';

// describe('optimizeDeliveryRoute', () => {
//   it('handles single stop within capacity', () => {
//     const result = optimizeDeliveryRoute(10, [
//       { id: 'A', x: 2, y: 3, weight: 5 }
//     ]);
    
//     expect(result.trips).toEqual([['A']]);
//     expect(result.totalDistance).toBe(10); // 5 there + 5 back
//   });

//   it('handles multiple stops requiring separate trips due to weight', () => {
//     const result = optimizeDeliveryRoute(10, [
//       { id: 'A', x: 1, y: 1, weight: 5 },
//       { id: 'B', x: 2, y: 2, weight: 6 }
//     ]);
    
//     expect(result.trips).toEqual([['A'], ['B']]);
//     expect(result.totalDistance).toBe(12); // Trip1: 2+2=4, Trip2: 4+4=8
//   });

//   it('handles multiple stops in single trip when capacity allows', () => {
//     const result = optimizeDeliveryRoute(15, [
//       { id: 'A', x: 3, y: 0, weight: 5 },
//       { id: 'B', x: 0, y: 4, weight: 5 }
//     ]);
    
//     expect(result.trips).toEqual([['A', 'B']]);
//     expect(result.totalDistance).toBe(14); // 3 + 7 + 4
//   });

//   it('chooses nearest stop first within each trip', () => {
//     const result = optimizeDeliveryRoute(20, [
//       { id: 'FAR', x: 10, y: 10, weight: 5 },
//       { id: 'NEAR', x: 1, y: 1, weight: 5 },
//       { id: 'MID', x: 5, y: 5, weight: 5 }
//     ]);
    
//     expect(result.trips[0][0]).toBe('NEAR'); // Nearest to depot
//     expect(result.trips).toEqual([['NEAR', 'MID', 'FAR']]);
//   });

//   it('handles empty stops array', () => {
//     const result = optimizeDeliveryRoute(10, []);
    
//     expect(result.trips).toEqual([]);
//     expect(result.totalDistance).toBe(0);
//   });

//   it('breaks tie by choosing first stop in input order', () => {
//     const result = optimizeDeliveryRoute(20, [
//       { id: 'FIRST', x: 2, y: 0, weight: 5 },
//       { id: 'SECOND', x: 0, y: 2, weight: 5 }
//     ]);
    
//     expect(result.trips[0][0]).toBe('FIRST'); // Both distance 2, FIRST comes first
//   });

//   it('forces multiple trips with realistic scenario', () => {
//     const result = optimizeDeliveryRoute(12, [
//       { id: 'A', x: 1, y: 0, weight: 4 },
//       { id: 'B', x: 2, y: 0, weight: 5 },
//       { id: 'C', x: 3, y: 0, weight: 6 },
//       { id: 'D', x: 4, y: 0, weight: 3 }
//     ]);
    
//     // Trip 1: A(4kg) + B(5kg) = 9kg <= 12kg ✓
//     // Can't add C (would be 15kg > 12kg)
//     // Trip 2: C(6kg) + D(3kg) = 9kg <= 12kg ✓
//     expect(result.trips).toEqual([['A', 'B'], ['C', 'D']]);
    
//     // Trip 1: 0->A(1) + A->B(1) + B->0(2) = 4
//     // Trip 2: 0->C(3) + C->D(1) + D->0(4) = 8
//     expect(result.totalDistance).toBe(12);
//   });

//   it('handles stops with exact capacity', () => {
//     const result = optimizeDeliveryRoute(10, [
//       { id: 'EXACT', x: 5, y: 5, weight: 10 }
//     ]);
    
//     expect(result.trips).toEqual([['EXACT']]);
//     expect(result.totalDistance).toBe(20); // 10 there + 10 back
//   });

//   it('handles complex routing with multiple trips', () => {
//     const result = optimizeDeliveryRoute(8, [
//       { id: 'A', x: 1, y: 1, weight: 3 },
//       { id: 'B', x: 10, y: 10, weight: 7 },
//       { id: 'C', x: 2, y: 1, weight: 4 },
//       { id: 'D', x: 1, y: 2, weight: 2 }
//     ]);
    
//     // Should pick nearest-first greedily each trip
//     // Trip 1 from depot: A(dist=2, 3kg), then D(dist=1, total 5kg), then C(dist=2, total 9kg > 8) - can't fit C
//     // Trip 2: C(dist=3, 4kg), can't fit B(would be 11kg)
//     // Trip 3: B(dist=20, 7kg)
//     expect(result.trips.length).toBe(3);
//     expect(result.trips[0]).toContain('A');
//     expect(result.trips[0]).toContain('D');
//   });
// });