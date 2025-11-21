// --- Length-for-Weight Z-Score Table for Boys (full data) ---
const lengthWeightTableBoys = [
  { length: 45, '-3SD': 1.9, '-2SD': 2, '-1SD': 2.2, 'Median': 2.4, '+1SD': 2.7, '+2SD': 3, '+3SD': 3.3 },
  { length: 45.5, '-3SD': 1.9, '-2SD': 2.1, '-1SD': 2.3, 'Median': 2.5, '+1SD': 2.8, '+2SD': 3.1, '+3SD': 3.4 },
  { length: 46, '-3SD': 2, '-2SD': 2.2, '-1SD': 2.4, 'Median': 2.6, '+1SD': 2.9, '+2SD': 3.1, '+3SD': 3.5 },
  { length: 46.5, '-3SD': 2.1, '-2SD': 2.3, '-1SD': 2.5, 'Median': 2.7, '+1SD': 3, '+2SD': 3.2, '+3SD': 3.6 },
  { length: 47, '-3SD': 2.1, '-2SD': 2.3, '-1SD': 2.5, 'Median': 2.8, '+1SD': 3, '+2SD': 3.3, '+3SD': 3.7 },
  { length: 47.5, '-3SD': 2.2, '-2SD': 2.4, '-1SD': 2.6, 'Median': 2.9, '+1SD': 3.1, '+2SD': 3.4, '+3SD': 3.8 },
  { length: 48, '-3SD': 2.3, '-2SD': 2.5, '-1SD': 2.7, 'Median': 2.9, '+1SD': 3.2, '+2SD': 3.6, '+3SD': 3.9 },
  { length: 48.5, '-3SD': 2.3, '-2SD': 2.6, '-1SD': 2.8, 'Median': 3, '+1SD': 3.3, '+2SD': 3.7, '+3SD': 4 },
  { length: 49, '-3SD': 2.4, '-2SD': 2.6, '-1SD': 2.9, 'Median': 3.1, '+1SD': 3.4, '+2SD': 3.8, '+3SD': 4.2 },
  { length: 49.5, '-3SD': 2.5, '-2SD': 2.7, '-1SD': 3, 'Median': 3.2, '+1SD': 3.5, '+2SD': 3.9, '+3SD': 4.3 },
  { length: 50, '-3SD': 2.6, '-2SD': 2.8, '-1SD': 3, 'Median': 3.3, '+1SD': 3.6, '+2SD': 4, '+3SD': 4.4 },
  { length: 50.5, '-3SD': 2.7, '-2SD': 2.9, '-1SD': 3.1, 'Median': 3.4, '+1SD': 3.8, '+2SD': 4.1, '+3SD': 4.5 },
  { length: 51, '-3SD': 2.7, '-2SD': 3, '-1SD': 3.2, 'Median': 3.5, '+1SD': 3.9, '+2SD': 4.2, '+3SD': 4.7 },
  { length: 51.5, '-3SD': 2.8, '-2SD': 3.1, '-1SD': 3.3, 'Median': 3.6, '+1SD': 4, '+2SD': 4.4, '+3SD': 4.8 },
  { length: 52, '-3SD': 2.9, '-2SD': 3.2, '-1SD': 3.5, 'Median': 3.8, '+1SD': 4.1, '+2SD': 4.5, '+3SD': 5 },
  { length: 52.5, '-3SD': 3, '-2SD': 3.3, '-1SD': 3.6, 'Median': 3.9, '+1SD': 4.2, '+2SD': 4.6, '+3SD': 5.1 },
  { length: 53, '-3SD': 3.1, '-2SD': 3.4, '-1SD': 3.7, 'Median': 4, '+1SD': 4.4, '+2SD': 4.8, '+3SD': 5.3 },
  { length: 53.5, '-3SD': 3.2, '-2SD': 3.5, '-1SD': 3.8, 'Median': 4.1, '+1SD': 4.5, '+2SD': 4.9, '+3SD': 5.4 },
  { length: 54, '-3SD': 3.3, '-2SD': 3.6, '-1SD': 3.9, 'Median': 4.3, '+1SD': 4.7, '+2SD': 5.1, '+3SD': 5.6 },
  { length: 54.5, '-3SD': 3.4, '-2SD': 3.7, '-1SD': 4, 'Median': 4.4, '+1SD': 4.8, '+2SD': 5.3, '+3SD': 5.8 },
  { length: 55, '-3SD': 3.6, '-2SD': 3.8, '-1SD': 4.2, 'Median': 4.5, '+1SD': 5, '+2SD': 5.4, '+3SD': 6 },
  { length: 55.5, '-3SD': 3.7, '-2SD': 4, '-1SD': 4.3, 'Median': 4.7, '+1SD': 5.1, '+2SD': 5.6, '+3SD': 6.1 },
  { length: 56, '-3SD': 3.8, '-2SD': 4.1, '-1SD': 4.4, 'Median': 4.8, '+1SD': 5.3, '+2SD': 5.8, '+3SD': 6.3 },
  { length: 56.5, '-3SD': 3.9, '-2SD': 4.2, '-1SD': 4.6, 'Median': 5, '+1SD': 5.4, '+2SD': 5.9, '+3SD': 6.5 },
  { length: 57, '-3SD': 4, '-2SD': 4.3, '-1SD': 4.7, 'Median': 5.1, '+1SD': 5.6, '+2SD': 6.1, '+3SD': 6.7 },
  { length: 57.5, '-3SD': 4.1, '-2SD': 4.5, '-1SD': 4.9, 'Median': 5.3, '+1SD': 5.7, '+2SD': 6.3, '+3SD': 6.9 },
  { length: 58, '-3SD': 4.3, '-2SD': 4.6, '-1SD': 5, 'Median': 5.4, '+1SD': 5.9, '+2SD': 6.4, '+3SD': 7.1 },
  { length: 58.5, '-3SD': 4.4, '-2SD': 4.7, '-1SD': 5.1, 'Median': 5.6, '+1SD': 6.1, '+2SD': 6.6, '+3SD': 7.2 },
  { length: 59, '-3SD': 4.5, '-2SD': 4.8, '-1SD': 5.3, 'Median': 5.7, '+1SD': 6.2, '+2SD': 6.8, '+3SD': 7.4 },
  { length: 59.5, '-3SD': 4.6, '-2SD': 5, '-1SD': 5.4, 'Median': 5.9, '+1SD': 6.4, '+2SD': 7, '+3SD': 7.6 },
  { length: 60, '-3SD': 4.7, '-2SD': 5.1, '-1SD': 5.5, 'Median': 6, '+1SD': 6.5, '+2SD': 7.1, '+3SD': 7.8 },
  { length: 60.5, '-3SD': 4.8, '-2SD': 5.2, '-1SD': 5.6, 'Median': 6.1, '+1SD': 6.7, '+2SD': 7.3, '+3SD': 8 },
  { length: 61, '-3SD': 4.9, '-2SD': 5.3, '-1SD': 5.8, 'Median': 6.3, '+1SD': 6.8, '+2SD': 7.4, '+3SD': 8.1 },
  { length: 61.5, '-3SD': 5, '-2SD': 5.4, '-1SD': 5.9, 'Median': 6.4, '+1SD': 7, '+2SD': 7.6, '+3SD': 8.3 },
  { length: 62, '-3SD': 5.1, '-2SD': 5.6, '-1SD': 6, 'Median': 6.5, '+1SD': 7.1, '+2SD': 7.7, '+3SD': 8.5 },
  { length: 62.5, '-3SD': 5.2, '-2SD': 5.7, '-1SD': 6.1, 'Median': 6.7, '+1SD': 7.2, '+2SD': 7.9, '+3SD': 8.6 },
  { length: 63, '-3SD': 5.3, '-2SD': 5.8, '-1SD': 6.2, 'Median': 6.8, '+1SD': 7.4, '+2SD': 8, '+3SD': 8.8 },
  { length: 63.5, '-3SD': 5.4, '-2SD': 5.9, '-1SD': 6.4, 'Median': 6.9, '+1SD': 7.5, '+2SD': 8.2, '+3SD': 8.9 },
  { length: 64, '-3SD': 5.5, '-2SD': 6, '-1SD': 6.5, 'Median': 7, '+1SD': 7.6, '+2SD': 8.3, '+3SD': 9.1 },
  { length: 64.5, '-3SD': 5.6, '-2SD': 6.1, '-1SD': 6.6, 'Median': 7.1, '+1SD': 7.8, '+2SD': 8.5, '+3SD': 9.3 },
  { length: 65, '-3SD': 5.7, '-2SD': 6.2, '-1SD': 6.7, 'Median': 7.3, '+1SD': 7.9, '+2SD': 8.6, '+3SD': 9.4 },
  { length: 65.5, '-3SD': 5.8, '-2SD': 6.3, '-1SD': 6.8, 'Median': 7.4, '+1SD': 8, '+2SD': 8.7, '+3SD': 9.6 },
  { length: 66, '-3SD': 5.9, '-2SD': 6.4, '-1SD': 6.9, 'Median': 7.5, '+1SD': 8.2, '+2SD': 8.9, '+3SD': 9.7 },
  { length: 66.5, '-3SD': 6, '-2SD': 6.5, '-1SD': 7, 'Median': 7.6, '+1SD': 8.3, '+2SD': 9, '+3SD': 9.9 },
  { length: 67, '-3SD': 6.1, '-2SD': 6.6, '-1SD': 7.1, 'Median': 7.7, '+1SD': 8.4, '+2SD': 9.2, '+3SD': 10 },
  { length: 67.5, '-3SD': 6.2, '-2SD': 6.7, '-1SD': 7.2, 'Median': 7.9, '+1SD': 8.5, '+2SD': 9.3, '+3SD': 10.2 },
  { length: 68, '-3SD': 6.3, '-2SD': 6.8, '-1SD': 7.3, 'Median': 8, '+1SD': 8.7, '+2SD': 9.4, '+3SD': 10.3 },
  { length: 68.5, '-3SD': 6.4, '-2SD': 6.9, '-1SD': 7.5, 'Median': 8.1, '+1SD': 8.8, '+2SD': 9.6, '+3SD': 10.5 },
  { length: 69, '-3SD': 6.5, '-2SD': 7, '-1SD': 7.6, 'Median': 8.2, '+1SD': 8.9, '+2SD': 9.7, '+3SD': 10.6 },
  { length: 69.5, '-3SD': 6.6, '-2SD': 7.1, '-1SD': 7.7, 'Median': 8.3, '+1SD': 9, '+2SD': 9.8, '+3SD': 10.8 },
  { length: 70, '-3SD': 6.6, '-2SD': 7.2, '-1SD': 7.8, 'Median': 8.4, '+1SD': 9.2, '+2SD': 10, '+3SD': 10.9 },
  { length: 70.5, '-3SD': 6.7, '-2SD': 7.3, '-1SD': 7.9, 'Median': 8.5, '+1SD': 9.3, '+2SD': 10.1, '+3SD': 11.1 },
  { length: 71, '-3SD': 6.8, '-2SD': 7.4, '-1SD': 8, 'Median': 8.6, '+1SD': 9.4, '+2SD': 10.2, '+3SD': 11.2 },
  { length: 71.5, '-3SD': 6.9, '-2SD': 7.5, '-1SD': 8.1, 'Median': 8.8, '+1SD': 9.5, '+2SD': 10.4, '+3SD': 11.3 },
  { length: 72, '-3SD': 7, '-2SD': 7.6, '-1SD': 8.2, 'Median': 8.9, '+1SD': 9.6, '+2SD': 10.5, '+3SD': 11.5 },
  { length: 72.5, '-3SD': 7.1, '-2SD': 7.6, '-1SD': 8.3, 'Median': 9, '+1SD': 9.8, '+2SD': 10.6, '+3SD': 11.6 },
  { length: 73, '-3SD': 7.2, '-2SD': 7.7, '-1SD': 8.4, 'Median': 9.1, '+1SD': 9.9, '+2SD': 10.8, '+3SD': 11.8 },
  { length: 73.5, '-3SD': 7.2, '-2SD': 7.8, '-1SD': 8.5, 'Median': 9.2, '+1SD': 10, '+2SD': 10.9, '+3SD': 11.9 },
  { length: 74, '-3SD': 7.3, '-2SD': 7.9, '-1SD': 8.6, 'Median': 9.3, '+1SD': 10.1, '+2SD': 11, '+3SD': 12.1 },
  { length: 74.5, '-3SD': 7.4, '-2SD': 8, '-1SD': 8.7, 'Median': 9.4, '+1SD': 10.2, '+2SD': 11.2, '+3SD': 12.2 },
  { length: 75, '-3SD': 7.5, '-2SD': 8.1, '-1SD': 8.8, 'Median': 9.5, '+1SD': 10.3, '+2SD': 11.3, '+3SD': 12.3 },
  { length: 75.5, '-3SD': 7.6, '-2SD': 8.2, '-1SD': 8.8, 'Median': 9.6, '+1SD': 10.4, '+2SD': 11.4, '+3SD': 12.5 },
  { length: 76, '-3SD': 7.6, '-2SD': 8.3, '-1SD': 8.9, 'Median': 9.7, '+1SD': 10.6, '+2SD': 11.5, '+3SD': 12.6 },
  { length: 76.5, '-3SD': 7.7, '-2SD': 8.3, '-1SD': 9, 'Median': 9.8, '+1SD': 10.7, '+2SD': 11.6, '+3SD': 12.7 },
  { length: 77, '-3SD': 7.8, '-2SD': 8.4, '-1SD': 9.1, 'Median': 9.9, '+1SD': 10.8, '+2SD': 11.7, '+3SD': 12.8 },
  { length: 77.5, '-3SD': 7.9, '-2SD': 8.5, '-1SD': 9.2, 'Median': 10, '+1SD': 10.9, '+2SD': 11.9, '+3SD': 13 },
  { length: 78, '-3SD': 7.9, '-2SD': 8.6, '-1SD': 9.3, 'Median': 10.1, '+1SD': 11, '+2SD': 12, '+3SD': 13.1 },
  { length: 78.5, '-3SD': 8, '-2SD': 8.7, '-1SD': 9.4, 'Median': 10.2, '+1SD': 11.1, '+2SD': 12.1, '+3SD': 13.2 },
  { length: 79, '-3SD': 8.1, '-2SD': 8.7, '-1SD': 9.5, 'Median': 10.3, '+1SD': 11.2, '+2SD': 12.2, '+3SD': 13.3 },
  { length: 79.5, '-3SD': 8.2, '-2SD': 8.8, '-1SD': 9.5, 'Median': 10.4, '+1SD': 11.3, '+2SD': 12.3, '+3SD': 13.4 },
  { length: 80, '-3SD': 8.2, '-2SD': 8.9, '-1SD': 9.6, 'Median': 10.4, '+1SD': 11.4, '+2SD': 12.4, '+3SD': 13.6 },
  { length: 80.5, '-3SD': 8.3, '-2SD': 9, '-1SD': 9.7, 'Median': 10.5, '+1SD': 11.5, '+2SD': 12.5, '+3SD': 13.7 },
  { length: 81, '-3SD': 8.4, '-2SD': 9.1, '-1SD': 9.8, 'Median': 10.6, '+1SD': 11.6, '+2SD': 12.6, '+3SD': 13.8 },
  { length: 81.5, '-3SD': 8.5, '-2SD': 9.1, '-1SD': 9.9, 'Median': 10.7, '+1SD': 11.7, '+2SD': 12.7, '+3SD': 13.9 },
  { length: 82, '-3SD': 8.5, '-2SD': 9.2, '-1SD': 10, 'Median': 10.8, '+1SD': 11.8, '+2SD': 12.8, '+3SD': 14 },
  { length: 82.5, '-3SD': 8.6, '-2SD': 9.3, '-1SD': 10.1, 'Median': 10.9, '+1SD': 11.9, '+2SD': 13, '+3SD': 14.2 },
  { length: 83, '-3SD': 8.7, '-2SD': 9.4, '-1SD': 10.2, 'Median': 11, '+1SD': 12, '+2SD': 13.1, '+3SD': 14.3 },
  { length: 83.5, '-3SD': 8.8, '-2SD': 9.5, '-1SD': 10.3, 'Median': 11.2, '+1SD': 12.1, '+2SD': 13.2, '+3SD': 14.4 },
  { length: 84, '-3SD': 8.9, '-2SD': 9.6, '-1SD': 10.4, 'Median': 11.3, '+1SD': 12.2, '+2SD': 13.3, '+3SD': 14.6 },
  { length: 84.5, '-3SD': 9, '-2SD': 9.7, '-1SD': 10.5, 'Median': 11.4, '+1SD': 12.4, '+2SD': 13.5, '+3SD': 14.7 },
  { length: 85, '-3SD': 9.1, '-2SD': 9.8, '-1SD': 10.6, 'Median': 11.5, '+1SD': 12.5, '+2SD': 13.6, '+3SD': 14.9 },
  { length: 85.5, '-3SD': 9.2, '-2SD': 9.9, '-1SD': 10.7, 'Median': 11.6, '+1SD': 12.6, '+2SD': 13.7, '+3SD': 15 },
  { length: 86, '-3SD': 9.3, '-2SD': 10, '-1SD': 10.8, 'Median': 11.7, '+1SD': 12.8, '+2SD': 13.9, '+3SD': 15.2 },
  { length: 86.5, '-3SD': 9.4, '-2SD': 10.1, '-1SD': 11, 'Median': 11.9, '+1SD': 12.9, '+2SD': 14, '+3SD': 15.3 },
  { length: 87, '-3SD': 9.5, '-2SD': 10.2, '-1SD': 11.1, 'Median': 12, '+1SD': 13, '+2SD': 14.2, '+3SD': 15.5 },
  { length: 87.5, '-3SD': 9.6, '-2SD': 10.4, '-1SD': 11.2, 'Median': 12.1, '+1SD': 13.2, '+2SD': 14.3, '+3SD': 15.6 },
  { length: 88, '-3SD': 9.7, '-2SD': 10.5, '-1SD': 11.3, 'Median': 12.2, '+1SD': 13.3, '+2SD': 14.5, '+3SD': 15.8 },
  { length: 88.5, '-3SD': 9.8, '-2SD': 10.6, '-1SD': 11.4, 'Median': 12.4, '+1SD': 13.4, '+2SD': 14.6, '+3SD': 15.9 },
  { length: 89, '-3SD': 9.9, '-2SD': 10.7, '-1SD': 11.5, 'Median': 12.5, '+1SD': 13.5, '+2SD': 14.7, '+3SD': 16.1 },
  { length: 89.5, '-3SD': 10, '-2SD': 10.8, '-1SD': 11.6, 'Median': 12.6, '+1SD': 13.7, '+2SD': 14.9, '+3SD': 16.2 },
  { length: 90, '-3SD': 10.1, '-2SD': 10.9, '-1SD': 11.8, 'Median': 12.7, '+1SD': 13.8, '+2SD': 15, '+3SD': 16.4 },
  { length: 90.5, '-3SD': 10.2, '-2SD': 11, '-1SD': 11.9, 'Median': 12.8, '+1SD': 13.9, '+2SD': 15.1, '+3SD': 16.5 },
  { length: 91, '-3SD': 10.3, '-2SD': 11.1, '-1SD': 12, 'Median': 13, '+1SD': 14.1, '+2SD': 15.3, '+3SD': 16.7 },
  { length: 91.5, '-3SD': 10.4, '-2SD': 11.2, '-1SD': 12.1, 'Median': 13.1, '+1SD': 14.2, '+2SD': 15.4, '+3SD': 16.8 },
  { length: 92, '-3SD': 10.5, '-2SD': 11.3, '-1SD': 12.2, 'Median': 13.2, '+1SD': 14.3, '+2SD': 15.6, '+3SD': 17 },
  { length: 92.5, '-3SD': 10.6, '-2SD': 11.4, '-1SD': 12.3, 'Median': 13.3, '+1SD': 14.4, '+2SD': 15.7, '+3SD': 17.1 },
  { length: 93, '-3SD': 10.7, '-2SD': 11.5, '-1SD': 12.4, 'Median': 13.4, '+1SD': 14.6, '+2SD': 15.8, '+3SD': 17.3 },
  { length: 93.5, '-3SD': 10.7, '-2SD': 11.6, '-1SD': 12.5, 'Median': 13.5, '+1SD': 14.7, '+2SD': 16, '+3SD': 17.4 },
  { length: 94, '-3SD': 10.8, '-2SD': 11.7, '-1SD': 12.6, 'Median': 13.7, '+1SD': 14.8, '+2SD': 16.1, '+3SD': 17.6 },
  { length: 94.5, '-3SD': 10.9, '-2SD': 11.8, '-1SD': 12.7, 'Median': 13.8, '+1SD': 14.9, '+2SD': 16.3, '+3SD': 17.7 },
  { length: 95, '-3SD': 11, '-2SD': 11.9, '-1SD': 12.8, 'Median': 13.9, '+1SD': 15.1, '+2SD': 16.4, '+3SD': 17.9 },
  { length: 95.5, '-3SD': 11.1, '-2SD': 12, '-1SD': 12.9, 'Median': 14, '+1SD': 15.2, '+2SD': 16.5, '+3SD': 18 },
  { length: 96, '-3SD': 11.2, '-2SD': 12.1, '-1SD': 13.1, 'Median': 14.1, '+1SD': 15.3, '+2SD': 16.7, '+3SD': 18.2 },
  { length: 96.5, '-3SD': 11.3, '-2SD': 12.2, '-1SD': 13.2, 'Median': 14.3, '+1SD': 15.5, '+2SD': 16.8, '+3SD': 18.4 },
  { length: 97, '-3SD': 11.4, '-2SD': 12.3, '-1SD': 13.3, 'Median': 14.4, '+1SD': 15.6, '+2SD': 17, '+3SD': 18.5 },
  { length: 97.5, '-3SD': 11.5, '-2SD': 12.4, '-1SD': 13.4, 'Median': 14.5, '+1SD': 15.7, '+2SD': 17.1, '+3SD': 18.7 },
  { length: 98, '-3SD': 11.6, '-2SD': 12.5, '-1SD': 13.5, 'Median': 14.6, '+1SD': 15.9, '+2SD': 17.3, '+3SD': 18.9 },
  { length: 98.5, '-3SD': 11.7, '-2SD': 12.6, '-1SD': 13.6, 'Median': 14.8, '+1SD': 16, '+2SD': 17.5, '+3SD': 19.1 },
  { length: 99, '-3SD': 11.8, '-2SD': 12.7, '-1SD': 13.7, 'Median': 14.9, '+1SD': 16.2, '+2SD': 17.6, '+3SD': 19.2 },
  { length: 99.5, '-3SD': 11.9, '-2SD': 12.8, '-1SD': 13.9, 'Median': 15, '+1SD': 16.3, '+2SD': 17.8, '+3SD': 19.4 },
  { length: 100, '-3SD': 12, '-2SD': 12.9, '-1SD': 14, 'Median': 15.2, '+1SD': 16.5, '+2SD': 18, '+3SD': 19.6 },
  { length: 100.5, '-3SD': 12.1, '-2SD': 13, '-1SD': 14.1, 'Median': 15.3, '+1SD': 16.6, '+2SD': 18.1, '+3SD': 19.8 },
  { length: 101, '-3SD': 12.2, '-2SD': 13.2, '-1SD': 14.2, 'Median': 15.4, '+1SD': 16.8, '+2SD': 18.3, '+3SD': 20 },
  { length: 101.5, '-3SD': 12.3, '-2SD': 13.3, '-1SD': 14.4, 'Median': 15.6, '+1SD': 16.9, '+2SD': 18.5, '+3SD': 20.2 },
  { length: 102, '-3SD': 12.4, '-2SD': 13.4, '-1SD': 14.5, 'Median': 15.7, '+1SD': 17.1, '+2SD': 18.7, '+3SD': 20.4 },
  { length: 102.5, '-3SD': 12.5, '-2SD': 13.5, '-1SD': 14.6, 'Median': 15.9, '+1SD': 17.3, '+2SD': 18.8, '+3SD': 20.6 },
  { length: 103, '-3SD': 12.6, '-2SD': 13.6, '-1SD': 14.8, 'Median': 16, '+1SD': 17.4, '+2SD': 19, '+3SD': 20.8 },
  { length: 103.5, '-3SD': 12.7, '-2SD': 13.7, '-1SD': 14.9, 'Median': 16.2, '+1SD': 17.6, '+2SD': 19.2, '+3SD': 21 },
  { length: 104, '-3SD': 12.8, '-2SD': 13.9, '-1SD': 15, 'Median': 16.3, '+1SD': 17.8, '+2SD': 19.4, '+3SD': 21.2 },
  { length: 104.5, '-3SD': 12.9, '-2SD': 14, '-1SD': 15.2, 'Median': 16.5, '+1SD': 17.9, '+2SD': 19.6, '+3SD': 21.5 },
  { length: 105, '-3SD': 13, '-2SD': 14.1, '-1SD': 15.3, 'Median': 16.6, '+1SD': 18.1, '+2SD': 19.8, '+3SD': 21.7 },
  { length: 105.5, '-3SD': 13.2, '-2SD': 14.2, '-1SD': 15.4, 'Median': 16.8, '+1SD': 18.3, '+2SD': 20, '+3SD': 21.9 },
  { length: 106, '-3SD': 13.3, '-2SD': 14.4, '-1SD': 15.6, 'Median': 16.9, '+1SD': 18.5, '+2SD': 20.2, '+3SD': 22.1 },
  { length: 106.5, '-3SD': 13.4, '-2SD': 14.5, '-1SD': 15.7, 'Median': 17.1, '+1SD': 18.6, '+2SD': 20.4, '+3SD': 22.4 },
  { length: 107, '-3SD': 13.5, '-2SD': 14.6, '-1SD': 15.9, 'Median': 17.3, '+1SD': 18.8, '+2SD': 20.6, '+3SD': 22.6 },
  { length: 107.5, '-3SD': 13.6, '-2SD': 14.7, '-1SD': 16, 'Median': 17.4, '+1SD': 19, '+2SD': 20.8, '+3SD': 22.8 },
  { length: 108, '-3SD': 13.7, '-2SD': 14.9, '-1SD': 16.2, 'Median': 17.6, '+1SD': 19.2, '+2SD': 21, '+3SD': 23.1 },
  { length: 108.5, '-3SD': 13.8, '-2SD': 15, '-1SD': 16.3, 'Median': 17.8, '+1SD': 19.4, '+2SD': 21.2, '+3SD': 23.3 },
  { length: 109, '-3SD': 14, '-2SD': 15.1, '-1SD': 16.5, 'Median': 17.9, '+1SD': 19.6, '+2SD': 21.4, '+3SD': 23.6 },
  { length: 109.5, '-3SD': 14.1, '-2SD': 15.3, '-1SD': 16.6, 'Median': 18.1, '+1SD': 19.8, '+2SD': 21.7, '+3SD': 23.8 },
  { length: 110, '-3SD': 14.2, '-2SD': 15.4, '-1SD': 16.8, 'Median': 18.3, '+1SD': 20, '+2SD': 21.9, '+3SD': 24.1 },
];
// --- Length-for-Weight Z-Score Table (full data) ---
const lengthWeightTable = [
  { length: 45, '-3SD': 1.9, '-2SD': 2.1, '-1SD': 2.3, 'Median': 2.5, '+1SD': 2.7, '+2SD': 3, '+3SD': 3.3 },
  { length: 45.5, '-3SD': 2, '-2SD': 2.1, '-1SD': 2.3, 'Median': 2.5, '+1SD': 2.8, '+2SD': 3.1, '+3SD': 3.4 },
  { length: 46, '-3SD': 2, '-2SD': 2.2, '-1SD': 2.4, 'Median': 2.6, '+1SD': 2.9, '+2SD': 3.2, '+3SD': 3.5 },
  { length: 46.5, '-3SD': 2.1, '-2SD': 2.3, '-1SD': 2.5, 'Median': 2.7, '+1SD': 3, '+2SD': 3.3, '+3SD': 3.6 },
  { length: 47, '-3SD': 2.2, '-2SD': 2.4, '-1SD': 2.6, 'Median': 2.8, '+1SD': 3.1, '+2SD': 3.4, '+3SD': 3.7 },
  { length: 47.5, '-3SD': 2.2, '-2SD': 2.4, '-1SD': 2.6, 'Median': 2.9, '+1SD': 3.2, '+2SD': 3.5, '+3SD': 3.8 },
  { length: 48, '-3SD': 2.3, '-2SD': 2.5, '-1SD': 2.7, 'Median': 3, '+1SD': 3.3, '+2SD': 3.6, '+3SD': 4 },
  { length: 48.5, '-3SD': 2.4, '-2SD': 2.6, '-1SD': 2.8, 'Median': 3.1, '+1SD': 3.4, '+2SD': 3.7, '+3SD': 4.1 },
  { length: 49, '-3SD': 2.4, '-2SD': 2.6, '-1SD': 2.9, 'Median': 3.2, '+1SD': 3.5, '+2SD': 3.8, '+3SD': 4.2 },
  { length: 49.5, '-3SD': 2.5, '-2SD': 2.7, '-1SD': 3, 'Median': 3.3, '+1SD': 3.6, '+2SD': 3.9, '+3SD': 4.3 },
  { length: 50, '-3SD': 2.6, '-2SD': 2.8, '-1SD': 3.1, 'Median': 3.4, '+1SD': 3.7, '+2SD': 4, '+3SD': 4.5 },
  { length: 50.5, '-3SD': 2.7, '-2SD': 2.9, '-1SD': 3.2, 'Median': 3.5, '+1SD': 3.8, '+2SD': 4.2, '+3SD': 4.6 },
  { length: 51, '-3SD': 2.8, '-2SD': 3, '-1SD': 3.3, 'Median': 3.6, '+1SD': 3.9, '+2SD': 4.3, '+3SD': 4.8 },
  { length: 51.5, '-3SD': 2.8, '-2SD': 3.1, '-1SD': 3.4, 'Median': 3.7, '+1SD': 4, '+2SD': 4.4, '+3SD': 4.9 },
  { length: 52, '-3SD': 2.9, '-2SD': 3.2, '-1SD': 3.5, 'Median': 3.8, '+1SD': 4.2, '+2SD': 4.6, '+3SD': 5.1 },
  { length: 52.5, '-3SD': 3, '-2SD': 3.3, '-1SD': 3.6, 'Median': 3.9, '+1SD': 4.3, '+2SD': 4.7, '+3SD': 5.2 },
  { length: 53, '-3SD': 3.1, '-2SD': 3.4, '-1SD': 3.7, 'Median': 4, '+1SD': 4.4, '+2SD': 4.9, '+3SD': 5.4 },
  { length: 53.5, '-3SD': 3.2, '-2SD': 3.5, '-1SD': 3.8, 'Median': 4.2, '+1SD': 4.6, '+2SD': 5, '+3SD': 5.5 },
  { length: 54, '-3SD': 3.3, '-2SD': 3.6, '-1SD': 3.9, 'Median': 4.3, '+1SD': 4.7, '+2SD': 5.2, '+3SD': 5.7 },
  { length: 54.5, '-3SD': 3.4, '-2SD': 3.7, '-1SD': 4, 'Median': 4.4, '+1SD': 4.8, '+2SD': 5.3, '+3SD': 5.9 },
  { length: 55, '-3SD': 3.5, '-2SD': 3.8, '-1SD': 4.2, 'Median': 4.5, '+1SD': 5, '+2SD': 5.5, '+3SD': 6.1 },
  { length: 55.5, '-3SD': 3.6, '-2SD': 3.9, '-1SD': 4.3, 'Median': 4.7, '+1SD': 5.1, '+2SD': 5.7, '+3SD': 6.3 },
  { length: 56, '-3SD': 3.7, '-2SD': 4, '-1SD': 4.4, 'Median': 4.8, '+1SD': 5.3, '+2SD': 5.8, '+3SD': 6.4 },
  { length: 56.5, '-3SD': 3.8, '-2SD': 4.1, '-1SD': 4.5, 'Median': 5, '+1SD': 5.4, '+2SD': 6, '+3SD': 6.6 },
  { length: 57, '-3SD': 3.9, '-2SD': 4.3, '-1SD': 4.6, 'Median': 5.1, '+1SD': 5.6, '+2SD': 6.1, '+3SD': 6.8 },
  { length: 57.5, '-3SD': 4, '-2SD': 4.4, '-1SD': 4.8, 'Median': 5.2, '+1SD': 5.7, '+2SD': 6.3, '+3SD': 7 },
  { length: 58, '-3SD': 4.1, '-2SD': 4.5, '-1SD': 4.9, 'Median': 5.4, '+1SD': 5.9, '+2SD': 6.5, '+3SD': 7.1 },
  { length: 58.5, '-3SD': 4.2, '-2SD': 4.6, '-1SD': 5, 'Median': 5.5, '+1SD': 6, '+2SD': 6.6, '+3SD': 7.3 },
  { length: 59, '-3SD': 4.3, '-2SD': 4.7, '-1SD': 5.1, 'Median': 5.6, '+1SD': 6.2, '+2SD': 6.8, '+3SD': 7.5 },
  { length: 59.5, '-3SD': 4.4, '-2SD': 4.8, '-1SD': 5.3, 'Median': 5.7, '+1SD': 6.3, '+2SD': 6.9, '+3SD': 7.7 },
  { length: 60, '-3SD': 4.5, '-2SD': 4.9, '-1SD': 5.4, 'Median': 5.9, '+1SD': 6.4, '+2SD': 7.1, '+3SD': 7.8 },
  { length: 60.5, '-3SD': 4.6, '-2SD': 5, '-1SD': 5.5, 'Median': 6, '+1SD': 6.6, '+2SD': 7.3, '+3SD': 8 },
  { length: 61, '-3SD': 4.7, '-2SD': 5.1, '-1SD': 5.6, 'Median': 6.1, '+1SD': 6.7, '+2SD': 7.4, '+3SD': 8.2 },
  { length: 61.5, '-3SD': 4.8, '-2SD': 5.2, '-1SD': 5.7, 'Median': 6.3, '+1SD': 6.9, '+2SD': 7.6, '+3SD': 8.4 },
  { length: 62, '-3SD': 4.9, '-2SD': 5.3, '-1SD': 5.8, 'Median': 6.4, '+1SD': 7, '+2SD': 7.7, '+3SD': 8.5 },
  { length: 62.5, '-3SD': 5, '-2SD': 5.4, '-1SD': 5.9, 'Median': 6.5, '+1SD': 7.1, '+2SD': 7.8, '+3SD': 8.7 },
  { length: 63, '-3SD': 5.1, '-2SD': 5.5, '-1SD': 6, 'Median': 6.6, '+1SD': 7.3, '+2SD': 8, '+3SD': 8.8 },
  { length: 63.5, '-3SD': 5.2, '-2SD': 5.6, '-1SD': 6.2, 'Median': 6.7, '+1SD': 7.4, '+2SD': 8.1, '+3SD': 9 },
  { length: 64, '-3SD': 5.3, '-2SD': 5.7, '-1SD': 6.3, 'Median': 6.9, '+1SD': 7.5, '+2SD': 8.3, '+3SD': 9.1 },
  { length: 64.5, '-3SD': 5.4, '-2SD': 5.8, '-1SD': 6.4, 'Median': 7, '+1SD': 7.6, '+2SD': 8.4, '+3SD': 9.3 },
  { length: 65, '-3SD': 5.5, '-2SD': 5.9, '-1SD': 6.5, 'Median': 7.1, '+1SD': 7.8, '+2SD': 8.6, '+3SD': 9.5 },
  { length: 65.5, '-3SD': 5.5, '-2SD': 6, '-1SD': 6.6, 'Median': 7.2, '+1SD': 7.9, '+2SD': 8.7, '+3SD': 9.6 },
  { length: 66, '-3SD': 5.6, '-2SD': 6.1, '-1SD': 6.7, 'Median': 7.3, '+1SD': 8, '+2SD': 8.8, '+3SD': 9.8 },
  { length: 66.5, '-3SD': 5.7, '-2SD': 6.2, '-1SD': 6.8, 'Median': 7.4, '+1SD': 8.1, '+2SD': 9, '+3SD': 9.9 },
  { length: 67, '-3SD': 5.8, '-2SD': 6.3, '-1SD': 6.9, 'Median': 7.5, '+1SD': 8.3, '+2SD': 9.1, '+3SD': 10 },
  { length: 67.5, '-3SD': 5.9, '-2SD': 6.4, '-1SD': 7, 'Median': 7.6, '+1SD': 8.4, '+2SD': 9.2, '+3SD': 10.2 },
  { length: 68, '-3SD': 6, '-2SD': 6.5, '-1SD': 7.1, 'Median': 7.7, '+1SD': 8.5, '+2SD': 9.4, '+3SD': 10.3 },
  { length: 68.5, '-3SD': 6.1, '-2SD': 6.6, '-1SD': 7.2, 'Median': 7.9, '+1SD': 8.6, '+2SD': 9.5, '+3SD': 10.5 },
  { length: 69, '-3SD': 6.1, '-2SD': 6.7, '-1SD': 7.3, 'Median': 8, '+1SD': 8.7, '+2SD': 9.6, '+3SD': 10.6 },
  { length: 69.5, '-3SD': 6.2, '-2SD': 6.8, '-1SD': 7.4, 'Median': 8.1, '+1SD': 8.8, '+2SD': 9.7, '+3SD': 10.7 },
  { length: 70, '-3SD': 6.3, '-2SD': 6.9, '-1SD': 7.5, 'Median': 8.2, '+1SD': 9, '+2SD': 9.9, '+3SD': 10.9 },
  { length: 70.5, '-3SD': 6.4, '-2SD': 6.9, '-1SD': 7.6, 'Median': 8.3, '+1SD': 9.1, '+2SD': 10, '+3SD': 11 },
  { length: 71, '-3SD': 6.5, '-2SD': 7, '-1SD': 7.7, 'Median': 8.4, '+1SD': 9.2, '+2SD': 10.1, '+3SD': 11.1 },
  { length: 71.5, '-3SD': 6.5, '-2SD': 7.1, '-1SD': 7.7, 'Median': 8.5, '+1SD': 9.3, '+2SD': 10.2, '+3SD': 11.3 },
  { length: 72, '-3SD': 6.6, '-2SD': 7.2, '-1SD': 7.8, 'Median': 8.6, '+1SD': 9.4, '+2SD': 10.3, '+3SD': 11.4 },
  { length: 72.5, '-3SD': 6.7, '-2SD': 7.3, '-1SD': 7.9, 'Median': 8.7, '+1SD': 9.5, '+2SD': 10.5, '+3SD': 11.5 },
  { length: 73, '-3SD': 6.8, '-2SD': 7.4, '-1SD': 8, 'Median': 8.9, '+1SD': 9.6, '+2SD': 10.6, '+3SD': 11.7 },
  { length: 73.5, '-3SD': 6.9, '-2SD': 7.4, '-1SD': 8.1, 'Median': 8.9, '+1SD': 9.7, '+2SD': 10.7, '+3SD': 11.8 },
  { length: 74, '-3SD': 6.9, '-2SD': 7.5, '-1SD': 8.2, 'Median': 9, '+1SD': 9.8, '+2SD': 10.8, '+3SD': 11.9 },
  { length: 74.5, '-3SD': 7, '-2SD': 7.6, '-1SD': 8.3, 'Median': 9.1, '+1SD': 9.9, '+2SD': 10.9, '+3SD': 12 },
  { length: 75, '-3SD': 7.1, '-2SD': 7.7, '-1SD': 8.4, 'Median': 9.1, '+1SD': 10, '+2SD': 11, '+3SD': 12.2 },
  { length: 75.5, '-3SD': 7.1, '-2SD': 7.8, '-1SD': 8.5, 'Median': 9.2, '+1SD': 10.1, '+2SD': 11.1, '+3SD': 12.3 },
  { length: 76, '-3SD': 7.2, '-2SD': 7.8, '-1SD': 8.5, 'Median': 9.3, '+1SD': 10.2, '+2SD': 11.2, '+3SD': 12.4 },
  { length: 76.5, '-3SD': 7.3, '-2SD': 7.9, '-1SD': 8.6, 'Median': 9.4, '+1SD': 10.3, '+2SD': 11.4, '+3SD': 12.5 },
  { length: 77, '-3SD': 7.4, '-2SD': 8, '-1SD': 8.7, 'Median': 9.5, '+1SD': 10.4, '+2SD': 11.5, '+3SD': 12.6 },
  { length: 77.5, '-3SD': 7.4, '-2SD': 8.1, '-1SD': 8.8, 'Median': 9.6, '+1SD': 10.5, '+2SD': 11.6, '+3SD': 12.8 },
  { length: 78, '-3SD': 7.5, '-2SD': 8.2, '-1SD': 8.9, 'Median': 9.7, '+1SD': 10.6, '+2SD': 11.7, '+3SD': 12.9 },
  { length: 78.5, '-3SD': 7.6, '-2SD': 8.2, '-1SD': 9, 'Median': 9.8, '+1SD': 10.7, '+2SD': 11.8, '+3SD': 13 },
  { length: 79, '-3SD': 8.1, '-2SD': 8.7, '-1SD': 9.5, 'Median': 10.3, '+1SD': 11.2, '+2SD': 12.2, '+3SD': 13.3 },
  { length: 79.5, '-3SD': 8.2, '-2SD': 8.8, '-1SD': 9.5, 'Median': 10.4, '+1SD': 11.3, '+2SD': 12.3, '+3SD': 13.4 },
  { length: 80, '-3SD': 8.2, '-2SD': 8.9, '-1SD': 9.6, 'Median': 10.4, '+1SD': 11.4, '+2SD': 12.4, '+3SD': 13.6 },
  { length: 80.5, '-3SD': 8.3, '-2SD': 9, '-1SD': 9.7, 'Median': 10.5, '+1SD': 11.5, '+2SD': 12.5, '+3SD': 13.7 },
  { length: 81, '-3SD': 8.4, '-2SD': 9.1, '-1SD': 9.8, 'Median': 10.6, '+1SD': 11.6, '+2SD': 12.6, '+3SD': 13.8 },
  { length: 81.5, '-3SD': 8.5, '-2SD': 9.1, '-1SD': 9.9, 'Median': 10.7, '+1SD': 11.7, '+2SD': 12.7, '+3SD': 13.9 },
  { length: 82, '-3SD': 8.5, '-2SD': 9.2, '-1SD': 10, 'Median': 10.8, '+1SD': 11.8, '+2SD': 12.8, '+3SD': 14 },
  { length: 82.5, '-3SD': 8.6, '-2SD': 9.3, '-1SD': 10.1, 'Median': 10.9, '+1SD': 11.9, '+2SD': 13, '+3SD': 14.2 },
  { length: 83, '-3SD': 8.7, '-2SD': 9.4, '-1SD': 10.2, 'Median': 11, '+1SD': 12, '+2SD': 13.1, '+3SD': 14.3 },
  { length: 83.5, '-3SD': 8.8, '-2SD': 9.5, '-1SD': 10.3, 'Median': 11.2, '+1SD': 12.1, '+2SD': 13.2, '+3SD': 14.4 },
  { length: 84, '-3SD': 8.9, '-2SD': 9.6, '-1SD': 10.4, 'Median': 11.3, '+1SD': 12.2, '+2SD': 13.3, '+3SD': 14.6 },
  { length: 84.5, '-3SD': 9, '-2SD': 9.7, '-1SD': 10.5, 'Median': 11.4, '+1SD': 12.4, '+2SD': 13.5, '+3SD': 14.7 },
  { length: 85, '-3SD': 9.1, '-2SD': 9.8, '-1SD': 10.6, 'Median': 11.5, '+1SD': 12.5, '+2SD': 13.6, '+3SD': 14.9 },
  { length: 85.5, '-3SD': 9.2, '-2SD': 9.9, '-1SD': 10.7, 'Median': 11.6, '+1SD': 12.6, '+2SD': 13.7, '+3SD': 15 },
  { length: 86, '-3SD': 9.3, '-2SD': 10, '-1SD': 10.8, 'Median': 11.7, '+1SD': 12.8, '+2SD': 13.9, '+3SD': 15.2 },
  { length: 86.5, '-3SD': 9.4, '-2SD': 10.1, '-1SD': 11, 'Median': 11.9, '+1SD': 12.9, '+2SD': 14, '+3SD': 15.3 },
  { length: 87, '-3SD': 9.5, '-2SD': 10.2, '-1SD': 11.1, 'Median': 12, '+1SD': 13, '+2SD': 14.2, '+3SD': 15.5 },
  { length: 87.5, '-3SD': 9.6, '-2SD': 10.4, '-1SD': 11.2, 'Median': 12.1, '+1SD': 13.2, '+2SD': 14.3, '+3SD': 15.6 },
  { length: 88, '-3SD': 9.7, '-2SD': 10.5, '-1SD': 11.3, 'Median': 12.2, '+1SD': 13.3, '+2SD': 14.5, '+3SD': 15.8 },
  { length: 88.5, '-3SD': 9.8, '-2SD': 10.6, '-1SD': 11.4, 'Median': 12.4, '+1SD': 13.4, '+2SD': 14.6, '+3SD': 15.9 },
  { length: 89, '-3SD': 9.9, '-2SD': 10.7, '-1SD': 11.5, 'Median': 12.5, '+1SD': 13.5, '+2SD': 14.7, '+3SD': 16.1 },
  { length: 89.5, '-3SD': 10, '-2SD': 10.8, '-1SD': 11.6, 'Median': 12.6, '+1SD': 13.7, '+2SD': 14.9, '+3SD': 16.2 },
  { length: 90, '-3SD': 10.1, '-2SD': 10.9, '-1SD': 11.8, 'Median': 12.7, '+1SD': 13.8, '+2SD': 15, '+3SD': 16.4 },
  { length: 90.5, '-3SD': 10.2, '-2SD': 11, '-1SD': 11.9, 'Median': 12.8, '+1SD': 13.9, '+2SD': 15.1, '+3SD': 16.5 },
  { length: 91, '-3SD': 10.3, '-2SD': 11.1, '-1SD': 12, 'Median': 13, '+1SD': 14.1, '+2SD': 15.3, '+3SD': 16.7 },
  { length: 91.5, '-3SD': 10.4, '-2SD': 11.2, '-1SD': 12.1, 'Median': 13.1, '+1SD': 14.2, '+2SD': 15.4, '+3SD': 16.8 },
  { length: 92, '-3SD': 10.5, '-2SD': 11.3, '-1SD': 12.2, 'Median': 13.2, '+1SD': 14.3, '+2SD': 15.6, '+3SD': 17 },
  { length: 92.5, '-3SD': 10.6, '-2SD': 11.4, '-1SD': 12.3, 'Median': 13.3, '+1SD': 14.4, '+2SD': 15.7, '+3SD': 17.1 },
  { length: 93, '-3SD': 10.7, '-2SD': 11.5, '-1SD': 12.4, 'Median': 13.4, '+1SD': 14.6, '+2SD': 15.8, '+3SD': 17.3 },
  { length: 93.5, '-3SD': 10.7, '-2SD': 11.6, '-1SD': 12.5, 'Median': 13.5, '+1SD': 14.7, '+2SD': 16, '+3SD': 17.4 },
  { length: 94, '-3SD': 10.8, '-2SD': 11.7, '-1SD': 12.6, 'Median': 13.7, '+1SD': 14.8, '+2SD': 16.1, '+3SD': 17.6 },
  { length: 94.5, '-3SD': 10.9, '-2SD': 11.8, '-1SD': 12.7, 'Median': 13.8, '+1SD': 14.9, '+2SD': 16.3, '+3SD': 17.7 },
  { length: 95, '-3SD': 11, '-2SD': 11.9, '-1SD': 12.8, 'Median': 13.9, '+1SD': 15.1, '+2SD': 16.4, '+3SD': 17.9 },
  { length: 95.5, '-3SD': 11.1, '-2SD': 12, '-1SD': 12.9, 'Median': 14, '+1SD': 15.2, '+2SD': 16.5, '+3SD': 18 },
  { length: 96, '-3SD': 11.2, '-2SD': 12.1, '-1SD': 13.1, 'Median': 14.1, '+1SD': 15.3, '+2SD': 16.7, '+3SD': 18.2 },
  { length: 96.5, '-3SD': 11.3, '-2SD': 12.2, '-1SD': 13.2, 'Median': 14.3, '+1SD': 15.5, '+2SD': 16.8, '+3SD': 18.4 },
  { length: 97, '-3SD': 11.4, '-2SD': 12.3, '-1SD': 13.3, 'Median': 14.4, '+1SD': 15.6, '+2SD': 17, '+3SD': 18.5 },
  { length: 97.5, '-3SD': 11.5, '-2SD': 12.4, '-1SD': 13.4, 'Median': 14.5, '+1SD': 15.7, '+2SD': 17.1, '+3SD': 18.7 },
  { length: 98, '-3SD': 11.6, '-2SD': 12.5, '-1SD': 13.5, 'Median': 14.6, '+1SD': 15.9, '+2SD': 17.3, '+3SD': 18.9 },
  { length: 98.5, '-3SD': 11.7, '-2SD': 12},
  { length: 99, '-3SD': 11.4, '-2SD': 12.4, '-1SD': 13.5, 'Median': 14.8, '+1SD': 16.2, '+2SD': 17.8, '+3SD': 19.6 },
  { length: 99.5, '-3SD': 11.5, '-2SD': 12.5, '-1SD': 13.6, 'Median': 14.9, '+1SD': 16.3, '+2SD': 18, '+3SD': 19.8 },
  { length: 100, '-3SD': 11.6, '-2SD': 12.6, '-1SD': 13.7, 'Median': 15, '+1SD': 16.5, '+2SD': 18.1, '+3SD': 20 },
  { length: 100.5, '-3SD': 11.7, '-2SD': 12.7, '-1SD': 13.9, 'Median': 15.2, '+1SD': 16.6, '+2SD': 18.3, '+3SD': 20.2 },
  { length: 101, '-3SD': 11.8, '-2SD': 12.8, '-1SD': 14, 'Median': 15.3, '+1SD': 16.8, '+2SD': 18.5, '+3SD': 20.4 },
  { length: 101.5, '-3SD': 11.9, '-2SD': 13, '-1SD': 14.1, 'Median': 15.5, '+1SD': 17, '+2SD': 18.7, '+3SD': 20.6 },
  { length: 102, '-3SD': 12, '-2SD': 13.1, '-1SD': 14.3, 'Median': 15.6, '+1SD': 17.1, '+2SD': 18.9, '+3SD': 20.8 },
  { length: 102.5, '-3SD': 12.1, '-2SD': 13.2, '-1SD': 14.4, 'Median': 15.8, '+1SD': 17.3, '+2SD': 19, '+3SD': 21 },
  { length: 103, '-3SD': 12.3, '-2SD': 13.3, '-1SD': 14.5, 'Median': 15.9, '+1SD': 17.5, '+2SD': 19.2, '+3SD': 21.3 },
  { length: 103.5, '-3SD': 12.4, '-2SD': 13.5, '-1SD': 14.7, 'Median': 16.1, '+1SD': 17.6, '+2SD': 19.4, '+3SD': 21.5 },
  { length: 104, '-3SD': 12.5, '-2SD': 13.6, '-1SD': 14.8, 'Median': 16.2, '+1SD': 17.8, '+2SD': 19.6, '+3SD': 21.7 },
  { length: 104.5, '-3SD': 12.6, '-2SD': 13.7, '-1SD': 15, 'Median': 16.4, '+1SD': 18, '+2SD': 19.8, '+3SD': 21.9 },
  { length: 105, '-3SD': 12.7, '-2SD': 13.8, '-1SD': 15.1, 'Median': 16.5, '+1SD': 18.2, '+2SD': 20, '+3SD': 22.2 },
  { length: 105.5, '-3SD': 12.8, '-2SD': 14, '-1SD': 15.3, 'Median': 16.7, '+1SD': 18.4, '+2SD': 20.2, '+3SD': 22.4 },
  { length: 106, '-3SD': 13, '-2SD': 14.1, '-1SD': 15.4, 'Median': 16.9, '+1SD': 18.5, '+2SD': 20.5, '+3SD': 22.6 },
  { length: 106.5, '-3SD': 13.1, '-2SD': 14.3, '-1SD': 15.6, 'Median': 17.1, '+1SD': 18.7, '+2SD': 20.7, '+3SD': 22.9 },
  { length: 107, '-3SD': 13.2, '-2SD': 14.4, '-1SD': 15.7, 'Median': 17.2, '+1SD': 18.9, '+2SD': 20.9, '+3SD': 23.1 },
  { length: 107.5, '-3SD': 13.3, '-2SD': 14.5, '-1SD': 15.9, 'Median': 17.4, '+1SD': 19.1, '+2SD': 21.1, '+3SD': 23.4 },
  { length: 108, '-3SD': 13.5, '-2SD': 14.7, '-1SD': 16, 'Median': 17.6, '+1SD': 19.3, '+2SD': 21.3, '+3SD': 23.6 },
  { length: 108.5, '-3SD': 13.6, '-2SD': 14.8, '-1SD': 16.2, 'Median': 17.8, '+1SD': 19.5, '+2SD': 21.6, '+3SD': 23.9 },
  { length: 109, '-3SD': 13.7, '-2SD': 15, '-1SD': 16.4, 'Median': 18, '+1SD': 19.7, '+2SD': 21.8, '+3SD': 24.2 },
  { length: 109.5, '-3SD': 13.9, '-2SD': 15.1, '-1SD': 16.5, 'Median': 18.1, '+1SD': 20, '+2SD': 22, '+3SD': 24.4 },
  { length: 110, '-3SD': 14, '-2SD': 15.3, '-1SD': 16.7, 'Median': 18.3, '+1SD': 20.2, '+2SD': 22.3, '+3SD': 24.7 },
];

// --- Z-Score Calculator Component ---
export function ZScoreCalculator({ onBack, onBackToCategory }: { onBack?: () => void; onBackToCategory?: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [length, setLength] = React.useState('');
  const [weight, setWeight] = React.useState('');
  const [gender, setGender] = React.useState('male');
  const [result, setResult] = React.useState<string | null>(null);
  const [resultColor, setResultColor] = React.useState<string | null>(null);

  function calculateZScore() {
    const len = parseFloat(length);
    const wt = parseFloat(weight);
    if (isNaN(len) || isNaN(wt)) {
      setResult('Please enter valid numbers for length and weight.');
      setResultColor(null);
      return;
    }
    // Find closest length in the correct table
    const table = gender === 'male' ? lengthWeightTableBoys : lengthWeightTable;
    const row = table.reduce((prev, curr) => Math.abs(curr.length - len) < Math.abs(prev.length - len) ? curr : prev);
    // Find z-score by comparing weight to SD columns
    let z = null;
    const cols = ['-3SD','-2SD','-1SD','Median','+1SD','+2SD','+3SD'];
    for (let i = 0; i < cols.length - 1; i++) {
      const low = row[cols[i]];
      const high = row[cols[i+1]];
      if ((wt >= low && wt <= high) || (wt <= low && wt >= high)) {
        // Linear interpolation
        z = i - 3 + (wt - low) / (high - low);
        break;
      }
    }
    if (z === null) {
      if (wt < row['-3SD']) z = -3;
      else if (wt > row['+3SD']) z = 3;
    }
    // Determine color for result box and interpretation
    let color = isDark ? '#23272e' : '#f7faff';
    let interpretation = '';
    if (z !== null) {
      if (Math.abs(z) <= 1) {
        color = '#2ecc40'; // green
      } else if (Math.abs(z) === 2) {
        color = '#ffeb3b'; // yellow
        if (z === -2) interpretation = 'Malnutrition';
        if (z === 2) interpretation = 'Overweight';
      } else if (Math.abs(z) === 3) {
        color = '#ff5252'; // red
        if (z === -3) interpretation = 'Severe Malnutrition';
        if (z === 3) interpretation = 'Obese (Malnutrition)';
      } else {
        color = '#ff9800'; // orange for between 2 and 3
      }
    }
    let resultText = z !== null ? `Z-score: ${z.toFixed(2)}` : 'Weight out of table range.';
    if (interpretation) resultText += `\n${interpretation}`;
    setResult(resultText);
    setResultColor(color);
  }

  return (
    <View style={{ backgroundColor: isDark ? '#181c24' : '#fff', borderRadius: 12, padding: 20, width: '100%', maxWidth: 420, alignSelf: 'center', alignItems: 'center', marginTop: 12 }}>
      {(onBackToCategory || onBack) && (
        <View style={{ flexDirection: 'row', width: '100%', marginBottom: 12 }}>
          {onBackToCategory && (
            <TouchableOpacity onPress={onBackToCategory} style={{ flex: 1, backgroundColor: isDark ? '#23272e' : '#e3f2fd', borderRadius: 8, padding: 10, alignItems: 'center', marginRight: 4 }}>
              <Text style={{ color: '#0288d1', fontWeight: 'bold' }}>Back to Category</Text>
            </TouchableOpacity>
          )}
          {onBack && (
            <TouchableOpacity onPress={onBack} style={{ flex: 1, backgroundColor: isDark ? '#23272e' : '#e3f2fd', borderRadius: 8, padding: 10, alignItems: 'center', marginLeft: onBackToCategory ? 4 : 0 }}>
              <Text style={{ color: '#0288d1', fontWeight: 'bold' }}>Back</Text>
            </TouchableOpacity>
          )}
        </View>
      )}
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12, color: isDark ? '#90caf9' : '#1976d2' }}>Length-for-Weight Z-Score Calculator</Text>
      <TextInput
        style={{ backgroundColor: isDark ? '#23272e' : '#f7faff', color: isDark ? '#fff' : '#222', borderRadius: 8, padding: 10, marginBottom: 10, width: '100%' }}
        placeholder="Length (cm)"
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={length}
        onChangeText={setLength}
        keyboardType="numeric"
      />
      <TextInput
        style={{ backgroundColor: isDark ? '#23272e' : '#f7faff', color: isDark ? '#fff' : '#222', borderRadius: 8, padding: 10, marginBottom: 10, width: '100%' }}
        placeholder="Weight (kg)"
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={weight}
        onChangeText={setWeight}
        keyboardType="numeric"
      />
      <View style={{ flexDirection: 'row', marginBottom: 10 }}>
        <TouchableOpacity onPress={() => setGender('male')} style={{ flex: 1, backgroundColor: gender === 'male' ? (isDark ? '#1976d2' : '#90caf9') : (isDark ? '#23272e' : '#e3f2fd'), borderRadius: 8, marginRight: 4, padding: 10, alignItems: 'center' }}>
          <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: gender === 'male' ? 'bold' : 'normal' }}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setGender('female')} style={{ flex: 1, backgroundColor: gender === 'female' ? (isDark ? '#1976d2' : '#90caf9') : (isDark ? '#23272e' : '#e3f2fd'), borderRadius: 8, marginLeft: 4, padding: 10, alignItems: 'center' }}>
          <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: gender === 'female' ? 'bold' : 'normal' }}>Female</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity onPress={calculateZScore} style={{ backgroundColor: isDark ? '#1976d2' : '#90caf9', borderRadius: 8, padding: 12, marginTop: 8, width: '100%', alignItems: 'center' }}>
        <Text style={{ color: '#fff', fontWeight: 'bold' }}>Calculate Z-Score</Text>
      </TouchableOpacity>
      {result && (
        <View style={{ marginTop: 16, padding: 16, borderRadius: 8, backgroundColor: resultColor || (isDark ? '#23272e' : '#f7faff'), alignItems: 'center', width: '100%' }}>
          <Text style={{ color: isDark ? '#222' : '#222', fontWeight: 'bold', fontSize: 16 }}>{result}</Text>
        </View>
      )}
    </View>
  );
}
// --- APGAR Score Calculator ---
function ApgarScoreCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  type ApgarKey = 'appearance' | 'pulse' | 'grimace' | 'activity' | 'respiration';
  const timeOptions = ['1 min', '5 min', '10 min', '15 min', '20 min'];
  const defaultScores: Record<ApgarKey, number> = {
    appearance: 0,
    pulse: 0,
    grimace: 0,
    activity: 0,
    respiration: 0,
  };
  const [time, setTime] = React.useState(timeOptions[0]);
  const [allScores, setAllScores] = React.useState<Record<string, Record<ApgarKey, number>>>(
    Object.fromEntries(timeOptions.map(t => [t, { ...defaultScores }]))
  );
  const scores = allScores[time];
  const total = Object.values(scores).reduce((a, b) => a + b, 0);
  let interpretation = '';
  if (total >= 8) interpretation = 'Normal (7-10): Good condition.';
  else if (total >= 4) interpretation = 'Moderately depressed (4-6): Needs observation.';
  else interpretation = 'Severely depressed (0-3): Immediate resuscitation required!';
  const options = [2, 1, 0];
  const labels: Record<ApgarKey, string[]> = {
    appearance: ['Pink', 'Body pink, extremities blue', 'Blue, pale'],
    pulse: ['>100 bpm', '<100 bpm', 'Absent'],
    grimace: ['Cries, pulls away', 'Grimace/weak cry', 'No response'],
    activity: ['Active movement', 'Some flexion', 'Limp'],
    respiration: ['Strong cry', 'Weak/irregular', 'Absent'],
  };
  const handleScoreChange = (key: ApgarKey, val: number) => {
    setAllScores(prev => ({
      ...prev,
      [time]: { ...prev[time], [key]: val },
    }));
  };
  return (
    <View style={{ backgroundColor: isDark ? '#181c24' : '#fff', borderRadius: 12, padding: 20, width: '100%', maxWidth: 420, alignSelf: 'center', alignItems: 'center', marginTop: 12 }}>
      {/* Time row */}
      <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginBottom: 10, flexWrap: 'wrap' }}>
        {timeOptions.map(t => (
          <TouchableOpacity
            key={t}
            style={{
              backgroundColor: time === t ? (isDark ? '#1976d2' : '#90caf9') : (isDark ? '#23272e' : '#e3f2fd'),
              borderRadius: 16,
              paddingVertical: 6,
              paddingHorizontal: 14,
              marginHorizontal: 4,
              marginVertical: 2,
              borderWidth: time === t ? 2 : 1,
              borderColor: time === t ? (isDark ? '#90caf9' : '#1976d2') : (isDark ? '#444' : '#bbb'),
            }}
            onPress={() => setTime(t)}
          >
            <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: time === t ? 'bold' : 'normal', fontSize: 15 }}>{t}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Text style={{ fontWeight: 'bold', fontSize: 20, marginBottom: 12, color: isDark ? '#90caf9' : '#1976d2' }}>APGAR Score Calculator</Text>
      {(Object.keys(scores) as ApgarKey[]).map((key) => (
        <View key={key} style={{ marginBottom: 14, width: '100%' }}>
          <Text style={{ fontWeight: 'bold', color: isDark ? '#fff' : '#222', marginBottom: 4, fontSize: 16 }}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
            {options.map((val, idx) => (
              <TouchableOpacity
                key={val}
                style={{
                  flex: 1,
                  backgroundColor: scores[key] === val ? (isDark ? '#1976d2' : '#90caf9') : (isDark ? '#23272e' : '#e3f2fd'),
                  borderRadius: 8,
                  marginHorizontal: 4,
                  padding: 10,
                  alignItems: 'center',
                  borderWidth: scores[key] === val ? 2 : 1,
                  borderColor: scores[key] === val ? (isDark ? '#90caf9' : '#1976d2') : (isDark ? '#444' : '#bbb'),
                }}
                onPress={() => handleScoreChange(key, val)}
              >
                <Text style={{ color: isDark ? '#fff' : '#222', fontWeight: scores[key] === val ? 'bold' : 'normal' }}>{labels[key][idx]}</Text>
                <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontWeight: 'bold', fontSize: 16 }}>{val}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      ))}
      <View style={{ marginTop: 18, padding: 14, backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderRadius: 8, borderColor: isDark ? '#90caf9' : '#1976d2', borderWidth: 1 }}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 4 }}>Total Score: {total} / 10</Text>
        <Text style={{ fontSize: 15, color: isDark ? '#90caf9' : '#1976d2' }}>{interpretation}</Text>
      </View>
      <Text style={{ color: isDark ? '#bbb' : '#888', fontSize: 13, marginTop: 16, textAlign: 'center' }}>
        Appearance, Pulse, Grimace, Activity, Respiration. Score at 1, 5, 10, 15, and 20 minutes after birth.
      </Text>
    </View>
  );
}
// Haematologic lab values data
const haematologicLabValues = [
  { name: 'Bleeding time (template)', ref: '2–7 minutes', si: '2–7 minutes' },
  { name: 'Erythrocyte count (Male)', ref: '4.3–5.9 million/mm³', si: '4.3–5.9 x 10¹²/L' },
  { name: 'Erythrocyte count (Female)', ref: '3.5–5.5 million/mm³', si: '3.5–5.5 x 10¹²/L' },
  { name: 'Erythrocyte sedimentation rate (Westergren, Male)', ref: '0–15 mm/h', si: '0–15 mm/h' },
  { name: 'Erythrocyte sedimentation rate (Westergren, Female)', ref: '0–20 mm/h', si: '0–20 mm/h' },
  { name: 'Hematocrit (Male)', ref: '41%–53%', si: '0.41–0.53' },
  { name: 'Hematocrit (Female)', ref: '36%–46%', si: '0.36–0.46' },
  { name: 'Hemoglobin A1c', ref: '≤ 6%', si: '≤ 0.06%' },
  { name: 'Hemoglobin, blood (Male)', ref: '13.5–17.5 g/dL', si: '2.09–2.71 mmol/L' },
  { name: 'Hemoglobin, blood (Female)', ref: '12.0–16.0 g/dL', si: '1.86–2.48 mmol/L' },
  { name: 'Hemoglobin, plasma', ref: '1–4 mg/dL', si: '0.16–0.62 mmol/L' },
  { name: 'Leukocyte count', ref: '4500–11,000/mm³', si: '4.5–11.0 x 10⁹/L' },
  { name: 'Segmented neutrophils', ref: '54%–62%', si: '0.54–0.62' },
  { name: 'Bands', ref: '3%–5%', si: '0.03–0.05' },
  { name: 'Eosinophils', ref: '1%–3%', si: '0.01–0.03' },
  { name: 'Basophils', ref: '0%–0.75%', si: '0–0.0075' },
  { name: 'Lymphocytes', ref: '25%–33%', si: '0.25–0.33' },
  { name: 'Monocytes', ref: '3%–7%', si: '0.03–0.07' },
  { name: 'Mean corpuscular hemoglobin', ref: '25.4–34.6 pg/cell', si: '0.39–0.54 fmol/cell' },
  { name: 'Mean corpuscular hemoglobin concentration', ref: '31%–36% Hb/cell', si: '4.81–5.58 mmol Hb/L' },
  { name: 'Mean corpuscular volume', ref: '80–100 µm³', si: '80–100 fL' },
  { name: 'Partial thromboplastin time (activated)', ref: '25–40 seconds', si: '25–40 seconds' },
  { name: 'Platelet count', ref: '150,000–400,000/mm³', si: '150–400 x 10⁹/L' },
  { name: 'Prothrombin time', ref: '11–15 seconds', si: '11–15 seconds' },
  { name: 'Reticulocyte count', ref: '0.5%–1.5% of red cells', si: '0.005–0.015' },
  { name: 'Thrombin time', ref: '< 2 seconds deviation from control', si: '< 2 seconds deviation from control' },
  { name: 'Plasma volume (Male)', ref: '25–43 mL/kg', si: '0.025–0.043 L/kg' },
  { name: 'Plasma volume (Female)', ref: '28–45 mL/kg', si: '0.028–0.045 L/kg' },
  { name: 'Red cell volume (Male)', ref: '20–36 mL/kg', si: '0.020–0.036 L/kg' },
  { name: 'Red cell volume (Female)', ref: '19–31 mL/kg', si: '0.019–0.031 L/kg' },
];

function HaematologicLabGroupsTable({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const filtered = haematologicLabValues.filter(row => {
    const q = search.trim().toLowerCase();
    return (
      row.name.toLowerCase().includes(q) ||
      row.ref.toLowerCase().includes(q) ||
      row.si.toLowerCase().includes(q)
    );
  });
  const textColor = isDark ? '#fff' : '#222';
  const subTextColor = isDark ? '#aaa' : '#555';
  return (
    <View style={{ padding: 16, width: '100%', alignSelf: 'center' }}>
      <TouchableOpacity onPress={onBack} style={{ marginBottom: 16 }}>
        <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>Back</Text>
      </TouchableOpacity>
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 12, color: textColor }}>Haematologic Lab Values</Text>
      <TextInput
        style={{
          backgroundColor: isDark ? '#23272e' : '#f7faff',
          color: textColor,
          borderRadius: 8,
          paddingHorizontal: 18,
          paddingVertical: 14,
          borderWidth: 1.5,
          borderColor: '#90caf9',
          fontSize: 18,
          marginBottom: 16,
          width: 350,
          minWidth: 0,
          alignSelf: 'center',
        }}
        placeholder="Search for a value..."
        placeholderTextColor={subTextColor}
        value={search}
        onChangeText={setSearch}
        returnKeyType="search"
        clearButtonMode="while-editing"
        autoCorrect={false}
        autoCapitalize="none"
      />
      <View style={{ flexDirection: 'row', borderBottomWidth: 1, borderColor: '#90caf9', paddingBottom: 6, marginBottom: 8 }}>
        <Text style={{ flex: 2, fontWeight: 'bold', color: textColor }}>Hematologic</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: textColor }}>Reference Range</Text>
        <Text style={{ flex: 1, fontWeight: 'bold', color: textColor }}>SI Reference</Text>
      </View>
      {filtered.length === 0 ? (
        <Text style={{ color: subTextColor, textAlign: 'center', marginTop: 16 }}>No results found.</Text>
      ) : (
        filtered.map((row, idx) => (
          <View key={idx} style={{ flexDirection: 'row', borderBottomWidth: 0.5, borderColor: isDark ? '#333a45' : '#eee', paddingVertical: 4 }}>
            <Text style={{ flex: 2, color: textColor }}>{row.name}</Text>
            <Text style={{ flex: 1, color: textColor }}>{row.ref}</Text>
            <Text style={{ flex: 1, color: textColor }}>{row.si}</Text>
          </View>
        ))
      )}
    </View>
  );
}
// --- Obs/Gynae Calculators Page ---
function ObgynCalculators({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCalc, setActiveCalc] = useState<string | null>(null);
  // Get tools from calcCategories
  // Always include LMP/EDD calculator in Obs/Gynae
  const obgynCategory = (typeof calcCategories !== 'undefined' ? calcCategories.find(c => c.key === 'obgyn') : null);
  let tools = obgynCategory?.tools || [];
  if (!tools.find(t => t.key === 'lmp')) {
    tools = [
      {
        key: 'lmp',
        name: 'EDD & GBD Calculator',
        description: 'Calculate Estimated Due Date and Gestational/Biological Date from LMP.',
        method: 'EDD = LMP + 280 days (40 weeks).',
      },
      {
        key: 'apgar',
        name: 'APGAR Score',
        description: 'Assess newborn health at 1 and 5 minutes after birth.',
        method: 'Score each of 5 criteria 0-2; total 0-10.',
      },
      ...tools,
    ];
  }

  return (
    <View style={{ width: '100%', maxWidth: 480 }}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#c2185b" />
        <Text style={styles.backText}>Back to Categories</Text>
      </TouchableOpacity>
  {/* Only show the section title if no calculator is open */}
  {!activeCalc && (
    <Text style={[styles.toolDetailTitle, { marginTop: 0, color: isDark ? '#90caf9' : '#1976d2' }]}>Obs/Gynae Calculators</Text>
  )}
  {!activeCalc && (
        <View style={{ width: '100%' }}>
          {tools.map(tool => (
            <TouchableOpacity
              key={tool.key}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: isDark ? '#23272e' : '#f7faff',
                borderRadius: 10,
                paddingVertical: 16,
                paddingHorizontal: 16,
                borderWidth: 1.5,
                borderColor: isDark ? '#f8bbd0' : '#c2185b',
                marginBottom: 14,
                shadowColor: isDark ? '#f8bbd0' : '#c2185b',
                shadowOpacity: 0.08,
                shadowOffset: { width: 0, height: 2 },
                shadowRadius: 4,
                elevation: 1,
              }}
              onPress={() => setActiveCalc(tool.key)}
              activeOpacity={0.85}
            >
              <Ionicons name="calendar-outline" size={28} color={isDark ? '#f8bbd0' : '#c2185b'} style={{ marginRight: 14 }} />
              <View style={{ flex: 1 }}>
                <Text style={{
                  color: isDark ? '#f8bbd0' : '#c2185b',
                  fontWeight: 'bold',
                  fontSize: 16,
                }}>
                  {tool.name}
                </Text>
                <Text style={{
                  color: isDark ? '#aaa' : '#555',
                  fontSize: 13,
                  marginTop: 2,
                }}>
                  {tool.description}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={isDark ? '#f8bbd0' : '#c2185b'} />
            </TouchableOpacity>
          ))}
        </View>
      )}
      {activeCalc === 'lmp' && (
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.backButton} onPress={() => setActiveCalc(null)}>
            <Ionicons name="arrow-back" size={20} color="#c2185b" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <LmpEddCalculator />
        </View>
      )}
      {activeCalc === 'apgar' && (
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.backButton} onPress={() => setActiveCalc(null)}>
            <Ionicons name="arrow-back" size={20} color="#c2185b" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <ApgarScoreCalculator />
        </View>
      )}
      {/* Add more calculators here as you expand tools */}
    </View>
  );
}
// --- MANTRELS Calculator Interactive ---
import { useTheme } from '@/context/ThemeContext';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import DrugReferenceScreen from '../DrugReferenceScreen';
// Removed CheckBox for Expo Go compatibility
import { Picker } from '@react-native-picker/picker';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import GCSCalculator from '../../components/GCSCalculator';
import HaematologyToolsPage from '../../components/HaematologyToolsPage';
import PaedsToolsPage from '../../components/PaedsToolsPage';
import PottasiumCalculator from '../../components/PottasiumCalculator';
import SodiumCalculator from '../../components/SodiumCalculator';
import PaedsProtocol from '../guidelines/PaedsProtocol';
function MantrelsCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  // Each criterion and its score
  const criteria = [
    { key: 'migration', label: 'Migration of pain to RLQ', score: 1 },
    { key: 'anorexia', label: 'Anorexia', score: 1 },
    { key: 'nausea', label: 'Nausea/vomiting', score: 1 },
    { key: 'tenderness', label: 'Tenderness in RLQ', score: 2 },
    { key: 'rebound', label: 'Rebound pain', score: 1 },
    { key: 'temp', label: 'Elevated temperature (≥37.3°C)', score: 1 },
    { key: 'leukocytosis', label: 'Leukocytosis (WBC >10,000)', score: 2 },
    { key: 'shift', label: 'Left shift (neutrophilia)', score: 1 },
  ];
  const [checked, setChecked] = useState({
    migration: false,
    anorexia: false,
    nausea: false,
    tenderness: false,
    rebound: false,
    temp: false,
    leukocytosis: false,
    shift: false,
  });

  const total = criteria.reduce((sum, c) => sum + (checked[c.key] ? c.score : 0), 0);

  let interpretation = '';
  if (total >= 7) interpretation = 'High risk: Likely appendicitis.';
  else if (total >= 5) interpretation = 'Moderate risk: Consider appendicitis, observe or image.';
  else interpretation = 'Low risk: Unlikely appendicitis.';

  return (
  <View style={{ padding: 24, backgroundColor: isDark ? '#181c24' : '#fff', borderRadius: 12 }}>
      <Text style={{ fontWeight: 'bold', fontSize: 18, marginBottom: 12, color: isDark ? '#90caf9' : '#1976d2' }}>
        MANTRELS (Alvarado) Score
      </Text>
      <Text style={{ fontSize: 15, marginBottom: 16, color: isDark ? '#bbb' : '#222' }}>
        Check all present features. The score will update automatically.
      </Text>
      {criteria.map(c => (
        <TouchableOpacity
          key={c.key}
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
          onPress={() => setChecked(prev => ({ ...prev, [c.key]: !prev[c.key] }))}
        >
          <Ionicons
            name={checked[c.key] ? 'checkbox' : 'square-outline'}
            size={22}
            color={checked[c.key] ? '#1976d2' : '#888'}
            style={{ marginRight: 8 }}
          />
          <Text style={{ fontSize: 16, color: isDark ? '#fff' : '#222' }}>{c.label} <Text style={{ color: isDark ? '#bbb' : '#888' }}>({c.score})</Text></Text>
        </TouchableOpacity>
      ))}
      <View style={{ marginTop: 18, padding: 14, backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderRadius: 8, borderColor: isDark ? '#90caf9' : '#1976d2', borderWidth: 1 }}>
        <Text style={{ fontSize: 17, fontWeight: 'bold', color: isDark ? '#90caf9' : '#1976d2', marginBottom: 4 }}>Total Score: {total} / 10</Text>
        <Text style={{ fontSize: 15, color: isDark ? '#90caf9' : '#1976d2' }}>{interpretation}</Text>
      </View>
      <Text style={{ color: isDark ? '#bbb' : '#888', fontSize: 13, marginTop: 16 }}>
        Criteria: Migration of pain (1), Anorexia (1), Nausea/vomiting (1), Tenderness in RLQ (2), Rebound pain (1), Temp ≥37.3°C (1), Leukocytosis (2), Left shift (1).
      </Text>
      <Text style={{ color: isDark ? '#bbb' : '#888', fontSize: 13, marginTop: 4 }}>
        Score ≥7: likely appendicitis. 5–6: possible, observe or image. ≤4: unlikely.
      </Text>
    </View>
  );
}

// --- LMP/EDD Calculator ---
function LmpEddCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [lmpDay, setLmpDay] = useState('');
  const [lmpMonth, setLmpMonth] = useState('');
  const [lmpYear, setLmpYear] = useState('');
  const [result, setResult] = useState<string | null>(null);

  // Helper to format date as DD-MM-YYYY
  function formatDateDDMMYYYY(date: Date) {
    const dd = date.getDate().toString().padStart(2, '0');
    const mm = (date.getMonth() + 1).toString().padStart(2, '0');
    const yyyy = date.getFullYear();
    return `${dd}-${mm}-${yyyy}`;
  }

  function calculateEDD() {
    const dd = Number(lmpDay);
    const mm = Number(lmpMonth);
    const yyyy = Number(lmpYear);
    if (!dd || !mm || !yyyy) {
      setResult('Enter valid day, month, and year.');
      return;
    }
    if (dd < 1 || dd > 31) {
      setResult('Day must be between 1 and 31.');
      return;
    }
    if (mm < 1 || mm > 12) {
      setResult('Month must be between 1 and 12.');
      return;
    }
    if (lmpYear.length !== 4 || yyyy < 1000) {
      setResult('Year must be 4 digits.');
      return;
    }
    const lmpDate = new Date(yyyy, mm - 1, dd);
    if (isNaN(lmpDate.getTime())) {
      setResult('Invalid date.');
      return;
    }
    const today = new Date();
    // Remove time for comparison
    today.setHours(0,0,0,0);
    lmpDate.setHours(0,0,0,0);
    if (lmpDate > today) {
      setResult('LMP cannot be in the future.');
      return;
    }
    const eddDate = new Date(lmpDate);
    eddDate.setDate(eddDate.getDate() + 280);
    const gestDays = Math.floor((today.getTime() - lmpDate.getTime()) / (1000 * 60 * 60 * 24));
    const gestWeeks = Math.floor(gestDays / 7);
    const gestRemDays = gestDays % 7;
    let quip = '';
    let quipText = '';
    if (gestWeeks > 43) {
      const quips = [
        "That's a record-breaking pregnancy! 🏆",
        "Are you sure that's not an elephant? 🐘",
        "Time to call Guinness World Records! 📚",
        "This baby is taking 'fashionably late' to a new level! ⏰",
        "Longest pregnancy ever? Science wants to know! 🔬"
      ];
      quipText = quips[Math.floor(Math.random() * quips.length)];
    }
    setResult({
      main: `EDD: ${formatDateDDMMYYYY(eddDate)}\nGestational Age: ${gestWeeks}w ${gestRemDays}d (from LMP)`,
      quip: quipText
    });
  }

  return (
  <View style={[styles.toolDetailBox, { width: '100%', maxWidth: 420, backgroundColor: isDark ? '#181c24' : '#fff' }]}> 
  <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>EDD & GBD Calculator</Text>
  <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter last menstrual period (DD-MM-YYYY):</Text>
  <View style={{ flexDirection: 'row', gap: 8, marginBottom: 12 }}>
        <TextInput
          style={[
            styles.input,
            { flex: 1, textAlign: 'center', paddingHorizontal: 0 },
            isDark && {
              backgroundColor: '#23272e',
              color: '#fff',
              borderColor: '#90caf9',
            },
          ]}
          placeholder="DD"
          value={lmpDay}
          onChangeText={text => {
            // Only allow numbers and max 2 chars, and clamp to 31
            let val = text.replace(/[^0-9]/g, '').slice(0, 2);
            if (val && Number(val) > 31) val = '31';
            setLmpDay(val);
          }}
          keyboardType="numeric"
          maxLength={2}
          placeholderTextColor={isDark ? '#90caf9' : '#888'}
        />
        <TextInput
          style={[
            styles.input,
            { flex: 1, textAlign: 'center', paddingHorizontal: 0 },
            isDark && {
              backgroundColor: '#23272e',
              color: '#fff',
              borderColor: '#90caf9',
            },
          ]}
          placeholder="MM"
          value={lmpMonth}
          onChangeText={text => {
            // Only allow numbers and max 2 chars, and clamp to 12
            let val = text.replace(/[^0-9]/g, '').slice(0, 2);
            if (val && Number(val) > 12) val = '12';
            setLmpMonth(val);
          }}
          keyboardType="numeric"
          maxLength={2}
          placeholderTextColor={isDark ? '#90caf9' : '#888'}
        />
        <TextInput
          style={[
            styles.input,
            { flex: 2, textAlign: 'center', paddingHorizontal: 0 },
            isDark && {
              backgroundColor: '#23272e',
              color: '#fff',
              borderColor: '#90caf9',
            },
          ]}
          placeholder="YYYY"
          value={lmpYear}
          onChangeText={text => {
            // Only allow numbers and max 4 chars
            let val = text.replace(/[^0-9]/g, '').slice(0, 4);
            setLmpYear(val);
          }}
          keyboardType="numeric"
          maxLength={4}
          placeholderTextColor={isDark ? '#90caf9' : '#888'}
        />
      </View>
      <TouchableOpacity style={styles.calcButton} onPress={calculateEDD}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: '#e3f2fd', borderColor: '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: '#1976d2', textAlign: 'center' }]}>{typeof result === 'string' ? result : result.main}</Text>
          {typeof result === 'object' && result.quip ? (
            <Text style={{ color: 'red', textAlign: 'center', marginTop: 6, fontWeight: 'bold' }}>{result.quip}</Text>
          ) : null}
        </View>
      )}
      <Text style={{ color: '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        EDD = LMP + 280 days (40 weeks). Date format: DD-MM-YYYY.
      </Text>
    </View>
  );
}

// --- Modular Conversion Logic ---
type UnitCategory = {
  key: string;
  label: string;
  units: { key: string; label: string }[];
  formula: (from: string, to: string) => string;
  convert: (val: number, from: string, to: string, extra?: any) => number;
  defaultFrom: string;
  defaultTo: string;
  needsValence?: boolean;
};

const unitCategories: UnitCategory[] = [
  {
    key: 'length',
    label: 'Length',
    units: [
      { key: 'm', label: 'm' },
      { key: 'cm', label: 'cm' },
      { key: 'mm', label: 'mm' },
      { key: 'inch', label: 'inch' },
      { key: 'ft', label: 'ft' },
    ],
    formula: (from: string, to: string) => {
      if (from === to) return 'No conversion needed.';
      if ((from === 'cm' && to === 'inch') || (from === 'inch' && to === 'cm'))
        return 'inch = cm / 2.54; cm = inch × 2.54';
      if ((from === 'm' && to === 'cm') || (from === 'cm' && to === 'm'))
        return 'cm = m × 100; m = cm / 100';
      if ((from === 'm' && to === 'ft') || (from === 'ft' && to === 'm'))
        return 'ft = m × 3.28084; m = ft / 3.28084';
      if ((from === 'inch' && to === 'ft') || (from === 'ft' && to === 'inch'))
        return 'ft = inch / 12; inch = ft × 12';
      if ((from === 'cm' && to === 'ft') || (from === 'ft' && to === 'cm'))
        return 'ft = cm / 30.48; cm = ft × 30.48';
      if ((from === 'mm' && to === 'cm') || (from === 'cm' && to === 'mm'))
        return 'cm = mm / 10; mm = cm × 10';
      if ((from === 'mm' && to === 'm') || (from === 'm' && to === 'mm'))
        return 'm = mm / 1000; mm = m × 1000';
      return 'Standard SI length conversions.';
    },
    convert: (val: number, from: string, to: string) => {
      // Convert to meters first
      let meters = val;
      if (from === 'cm') meters = val / 100;
      else if (from === 'mm') meters = val / 1000;
      else if (from === 'inch') meters = val * 0.0254;
      else if (from === 'ft') meters = val * 0.3048;
      // Convert meters to target
      if (to === 'm') return meters;
      if (to === 'cm') return meters * 100;
      if (to === 'mm') return meters * 1000;
      if (to === 'inch') return meters / 0.0254;
      if (to === 'ft') return meters / 0.3048;
      return val;
    },
    defaultFrom: 'cm',
    defaultTo: 'inch',
  },
  {
    key: 'weight',
    label: 'Weight',
    units: [
      { key: 'kg', label: 'kg' },
      { key: 'g', label: 'g' },
      { key: 'mg', label: 'mg' },
      { key: 'lb', label: 'lb' },
    ],
    formula: (from: string, to: string) => {
      if (from === to) return 'No conversion needed.';
      if ((from === 'kg' && to === 'g') || (from === 'g' && to === 'kg'))
        return 'g = kg × 1000; kg = g / 1000';
      if ((from === 'kg' && to === 'lb') || (from === 'lb' && to === 'kg'))
        return 'lb = kg × 2.20462; kg = lb / 2.20462';
      if ((from === 'g' && to === 'mg') || (from === 'mg' && to === 'g'))
        return 'mg = g × 1000; g = mg / 1000';
      return 'Standard SI mass conversions.';
    },
    convert: (val: number, from: string, to: string) => {
      // Convert to kg first
      const { colors, dark } = useTheme();
      const isDark = dark;
      const headerBg = isDark ? '#222' : '#e3f2fd';
      const headerText = isDark ? '#90caf9' : '#1976d2';
      const rowBg1 = isDark ? '#181a20' : '#fff';
      const rowBg2 = isDark ? '#23272e' : '#f7faff';
      const borderColor = isDark ? '#333a45' : '#e3f2fd';
      const textColor = isDark ? '#fff' : '#222';
      return (
        <View style={{ marginTop: 16 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 8, color: textColor }}>Unit Converter</Text>
          <ScrollView horizontal style={{ borderRadius: 8, borderWidth: 1, borderColor: borderColor, backgroundColor: rowBg2 }}>
            <View>
              <View style={{ flexDirection: 'row', backgroundColor: headerBg, borderTopLeftRadius: 8, borderTopRightRadius: 8 }}>
                <Text style={{ flex: 1, fontWeight: 'bold', padding: 8, color: headerText }}>Test</Text>
                <Text style={{ flex: 1, fontWeight: 'bold', padding: 8, color: headerText }}>Conventional</Text>
                <Text style={{ flex: 1, fontWeight: 'bold', padding: 8, color: headerText }}>SI</Text>
                <Text style={{ flex: 1, fontWeight: 'bold', padding: 8, color: headerText }}>Conversion</Text>
              </View>
              {unitConverterData.map((row, idx) => (
                <View
                  key={row.test}
                  style={{
                    flexDirection: 'row',
                    backgroundColor: idx % 2 === 0 ? rowBg1 : rowBg2,
                    borderBottomWidth: 1,
                    borderColor: borderColor,
                  }}
                >
                  <Text style={{ flex: 1, padding: 8, color: textColor }}>{row.test}</Text>
                  <Text style={{ flex: 1, padding: 8, color: textColor }}>{row.conventional}</Text>
                  <Text style={{ flex: 1, padding: 8, color: textColor }}>{row.si}</Text>
                  <Text style={{ flex: 1, padding: 8, color: textColor }}>{row.conversion}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      );
    },
    convert: (val: number, from: string, to: string) => {
      let c = val;
      if (from === 'F') c = (val - 32) * 5 / 9;
      else if (from === 'K') c = val - 273.15;
      // Convert C to target
      if (to === 'C') return c;
      if (to === 'F') return c * 9 / 5 + 32;
      if (to === 'K') return c + 273.15;
      return val;
    },
    defaultFrom: 'C',
    defaultTo: 'F',
  },
  {
    key: 'electrolyte',
    label: 'mmol ↔ mEq',
    units: [
      { key: 'mmol', label: 'mmol/L' },
      { key: 'meq', label: 'mEq/L' },
    ],
    formula: () => 'mEq = mmol × valence; mmol = mEq / valence',
    convert: (val: number, from: string, to: string, valence: number) => {
      if (from === to) return val;
      if (from === 'mmol' && to === 'meq') return val * valence;
      if (from === 'meq' && to === 'mmol') return val / valence;
      return val;
    },
    defaultFrom: 'mmol',
    defaultTo: 'meq',
    needsValence: true,
  },
  {
    key: 'fio2',
    label: 'Oxygen Flow ↔ FiO₂',
    units: [
      { key: 'lmin', label: 'O₂ Flow (L/min)' },
      { key: 'fio2', label: 'FiO₂ (%)' },
    ],
    formula: (from: string, to: string) => {
      if (from === to) return 'No conversion needed.';
      if (from === 'lmin' && to === 'fio2')
        return 'FiO₂ (%) ≈ 20 + (4 × O₂ L/min)';
      if (from === 'fio2' && to === 'lmin')
        return 'O₂ L/min ≈ (FiO₂ (%) - 20) / 4';
      return 'Rule-of-thumb for nasal cannula: FiO₂ ≈ 20% + (4% × L/min)';
    },
    convert: (val: number, from: string, to: string) => {
      if (from === to) return val;
      if (from === 'lmin' && to === 'fio2') return 20 + 4 * val;
      if (from === 'fio2' && to === 'lmin') return (val - 20) / 4;
      return val;
    },
    defaultFrom: 'lmin',
    defaultTo: 'fio2',
  },
];

// --- Dropdown component ---
function Dropdown({
  value,
  options,
  onChange,
  style,
  testID,
}: {
  value: string;
  options: { key: string; label: string }[];
  onChange: (val: string) => void;
  style?: any;
  testID?: string;
}) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <View style={[{ borderWidth: 1, borderColor: '#90caf9', borderRadius: 8, backgroundColor: isDark ? '#23272e' : '#fff', marginBottom: 12 }, style]}>
      <Picker
        selectedValue={value}
        onValueChange={onChange}
        style={{ width: '100%', height: 44 }}
        testID={testID}
      >
        {options.map(opt => (
          <Picker.Item key={opt.key} label={opt.label} value={opt.key} />
        ))}
      </Picker>
    </View>
  );
}

// --- Modernized SearchableDropdown for Units ---
function SearchableDropdown({
  value,
  options,
  onChange,
  placeholder,
  testID,
}: {
  value: string;
  options: { key: string; label: string }[];
  onChange: (val: string) => void;
  placeholder?: string;
  testID?: string;
}) {
  const [search, setSearch] = useState('');
  const filtered = options.filter(opt =>
    opt.label.toLowerCase().includes(search.toLowerCase()) ||
    opt.key.toLowerCase().includes(search.toLowerCase())
  );
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  return (
    <View style={{ marginBottom: 0 }}>
      <TextInput
        style={{
          borderWidth: 1,
          borderColor: '#90caf9',
          borderRadius: 8,
          backgroundColor: isDark ? '#23272e' : '#fff',
          color: isDark ? '#fff' : '#111',
          padding: 8,
          fontSize: 15,
          marginBottom: 4,
        }}
        placeholder={placeholder || 'Search unit...'}
        placeholderTextColor={isDark ? '#aaa' : '#888'}
        value={search}
        onChangeText={setSearch}
        testID={testID ? `${testID}-search` : undefined}
      />
      <View style={{
        borderWidth: 1,
        borderColor: '#90caf9',
        borderRadius: 8,
        backgroundColor: isDark ? '#23272e' : '#fff',
      }}>
        <Picker
          selectedValue={value}
          onValueChange={onChange}
          style={{ width: '100%', height: 44 }}
          testID={testID}
        >
          {filtered.length === 0 ? (
            <Picker.Item label="No units found" value="" />
          ) : (
            filtered.map(opt => (
              <Picker.Item key={opt.key} label={opt.label} value={opt.key} />
            ))
          )}
        </Picker>
      </View>
    </View>
  );
}

const toolCategories = [
  {
    key: 'general',
    name: 'General Clinical Calculators',
    tools: [
      {
        key: 'bmi',
        name: 'BMI Calculator',
        description: 'Calculate Body Mass Index from height and weight.',
        method: 'BSA (m²) = sqrt([Height(cm) × Weight(kg)] / 3600)\nMosteller formula.',
      },
      {
        key: "mantrels",
        name: "MANTRELS (Alvarado) Score",
        description: "Appendicitis risk assessment (MANTRELS/Alvarado score).",
        method: "mantrels",
      },
      {
        key: 'protein-creatinine-ratio',
        name: 'Protein Creatinine Ratio Calculator',
        description: 'Calculate protein-to-creatinine ratio for kidney function assessment.',
        method: 'Protein-to-Creatinine Ratio = Urine Protein (mg/dL) / Urine Creatinine (mg/dL)\nNormal: <0.2 mg/mg (adults).',
      },
      {
        key: 'egfr',
        name: 'eGFR Calculator',
        description: 'Estimate glomerular filtration rate (CKD-EPI, adults).',
        method:
          'CKD-EPI formula (2021, non-race based):\n' +
          'eGFR = 142 × min(Scr/κ,1)^α × max(Scr/κ,1)^-1.200 × 0.9938^Age × [1.012 if female]\n' +
          'Scr = serum creatinine (mg/dL), κ = 0.7 (female) or 0.9 (male), α = -0.241 (female) or -0.302 (male)',
      },
      {
        key: 'corr-calcium',
        name: 'Corrected Calcium Calculator',
        description: 'Adjust serum calcium for albumin.',
        method:
          'Corrected Ca (mmol/L) = Measured Ca + 0.02 × (40 - Albumin)\n' +
          'Ca in mmol/L, Albumin in g/L.',
      },
      {
        key: 'anion-gap',
        name: 'Anion Gap Calculator',
        description: 'Calculate anion gap for metabolic acidosis.',
        method:
          'Anion gap = Na⁺ - (Cl⁻ + HCO₃⁻)\nNormal: 8–12 mmol/L.',
      },
      {
        key: 'chadsvasc',
        name: 'CHA₂DS₂-VASc Score',
        description: 'Stroke risk in atrial fibrillation.',
        method:
          'CHF, Hypertension, Age ≥75 (2), Diabetes, Stroke/TIA (2), Vascular disease, Age 65–74, Sex (female).',
      },
    ],
  },
  {
    key: 'obgyn',
    name: 'Obstetric & Gynaecology',
    tools: [
      {
        key: 'lmp',
        name: 'LMP & EDD Calculator',
        description: 'Calculate Estimated Due Date from Last Menstrual Period.',
        method: 'EDD is calculated by adding 280 days (40 weeks) to the first day of the last menstrual period (LMP). Gestational age is calculated from LMP to today.'
      },
    ],
  },
  {
    key: 'cardiology',
    name: 'Cardiology',
    tools: [],
  },
  {
    key: 'paediatrics',
    name: 'Paediatrics',
    tools: [
      {
        key: 'paed-weight',
        name: 'Paediatric Weight Estimation',
        description: 'Estimate child weight by age (Kenyan protocol, <9mo and >9mo).',
        method:
          'For 9 months and under: Weight (kg) = (Age in months × 0.5) + 4\n' +
          'Above 9 months: Weight (kg) = (Age in years × 2) + 8',
      },
      {
        key: 'holliday-segar',
        name: 'Holliday-Segar Method',
        description: 'Calculate daily maintenance fluid requirement for children.',
        method:
          '100 mL/kg for first 10 kg, 50 mL/kg for next 10 kg, 20 mL/kg for each kg above 20. Divide by 24 for hourly rate.',
      },
      {
        key: 'jones-criteria',
        name: 'Jones Criteria for Rheumatic Fever',
        description: 'Diagnostic criteria for acute rheumatic fever (major/minor, revised 2015).',
        method:
          'Diagnosis requires evidence of preceding Group A Strep infection plus:\n' +
          '2 major OR 1 major + 2 minor criteria.\n' +
          'Major: Carditis, Polyarthritis, Chorea, Erythema marginatum, Subcutaneous nodules.\n' +
          'Minor: Arthralgia, Fever, Elevated ESR/CRP, Prolonged PR interval.\n' +
          'Supporting: Recent strep infection (throat culture, rapid antigen, or elevated ASO).',
      },
    ],
  },
  {
    key: 'critical',
    name: 'Critical Care/ Emergency',
    tools: [
      {
        key: 'curb65',
        name: 'CURB-65 Score',
        description: 'Assess severity of community-acquired pneumonia.',
        method:
          'CURB-65: Confusion, Urea >7 mmol/L, Respiratory rate ≥30, BP <90/60 mmHg, Age ≥65.\n' +
          '1 point for each. Higher score = higher mortality risk.',
      },
      {
        key: 'parkland',
        name: 'Parkland Formula for Burns',
        description: 'Calculate fluid requirements for burn patients (first 24h).',
        method:
          'Total fluid (mL) = 4 × Weight (kg) × %TBSA burned\n' +
          'Give half in first 8h, remainder over next 16h.',
      },
      {
        key: 'gcs',
        name: 'Glasgow Coma Scale',
        description: 'Assess level of consciousness using GCS.',
        method:
          'GCS = Eye Opening (E) + Verbal Response (V) + Motor Response (M)\n' +
          'Score range: 3 (deep coma) to 15 (fully awake).',
      },
      {
        key: 'sofa',
        name: 'SOFA/qSOFA Score',
        description: 'Sepsis organ failure assessment (qSOFA bedside, SOFA simplified).',
        method:
          'qSOFA: RR ≥22/min, altered mentation (GCS<15), SBP ≤100 mmHg. 1 point each, ≥2 = high risk.\n' +
          'SOFA: Respiration (PaO2/FiO2), Coagulation (platelets), Liver (bilirubin), CV (MAP/vasopressors), CNS (GCS), Renal (creatinine/urine).',
      },
      {
        key: 'wells-dvt',
        name: 'Wells Score for DVT',
        description: 'Estimate probability of deep vein thrombosis.',
        method:
          'Active cancer, paralysis/immobilization, bedridden, localized tenderness, leg swelling, calf swelling ≥3cm, pitting edema, collateral veins, previous DVT (+1 each), alternative diagnosis as likely as DVT (-2).',
      },
      {
        key: 'blatchford',
        name: 'Glasgow Blatchford Score',
        description: 'Risk stratification for upper GI bleeding.',
        method:
          'BUN, Hb, SBP, HR, melena, syncope, hepatic/heart failure. Score ≥1 = risk of intervention.',
      },
      {
        key: 'iv-drip-rate',
        name: 'IV Drip Rate / Infusion Rate',
        description: 'Calculate gtt/min ↔ mL/hr and mcg/kg/min ↔ mL/hr for IV infusions.',
        method:
          'gtt/min = (mL/hr × drop factor) / 60\n' +
          'mL/hr = (gtt/min × 60) / drop factor\n' +
          'mL/hr = (dose (mcg/kg/min) × weight (kg) × 60) / concentration (mcg/mL)\n' +
          'dose (mcg/kg/min) = (mL/hr × concentration (mcg/mL)) / (weight (kg) × 60)',
      },
    ],
  },
  {
    key: 'neurology',
    name: 'Neurology',
    tools: [
      {
        key: 'gcs',
        name: 'Glasgow Coma Scale',
        description: 'Assess level of consciousness using GCS.',
        method:
          'GCS = Eye Opening (E) + Verbal Response (V) + Motor Response (M)\n' +
          'Score range: 3 (deep coma) to 15 (fully awake).',
      },
    ],
  },
  {
    key: 'haematology',
    name: 'Haematology',
    tools: [
      {
        key: 'prc-deficit',
        name: 'Packed Red Cells Deficit Calculator',
        description: 'Calculate PRC deficit and estimate transfusion requirement.',
        method:
          'PRC deficit (mL) = [Desired Hb (g/dL) - Actual Hb (g/dL)] × Weight (kg) × 4\n' +
          '1 unit PRC ≈ 250 mL, raises Hb by ~1 g/dL in adults.',
      },
      {
        key: 'whole-blood-calc',
        name: 'Whole Blood Transfusion Calculator',
        description: 'Calculate whole blood transfusion requirements.',
        method: 'Open the calculator for whole blood transfusion volume and dosing.',
      },
    ],
  },
];

// --- Widget definitions (move above ToolsScreen) ---
const widgets = [
  {
    key: 'calc',
    label: 'Calc',
    icon: <Ionicons name="calculator-outline" size={28} color="#1976d2" />,
  },
  {
    key: 'imaging',
    label: 'Imaging',
    icon: <Ionicons name="images-outline" size={28} color="#1976d2" />,
  },
  {
    key: 'reference',
    label: 'Reference',
    icon: <Ionicons name="book-outline" size={28} color="#1976d2" />,
  },
  {
    key: 'guidelines',
    label: 'Guidelines',
    icon: <Ionicons name="document-text-outline" size={28} color="#1976d2" />,
  },
  {
    key: 'clip',
    label: 'Clip',
    icon: <Ionicons name="clipboard-outline" size={28} color="#1976d2" />,
  },
  {
    key: 'favorites',
    label: 'Favorites',
    icon: <Ionicons name="star-outline" size={28} color="#1976d2" />,
  },
];

const referenceWidgets = [
  {
    key: 'labvalues',
    label: 'Lab Values',
    icon: <Ionicons name="flask-outline" size={28} color="#1976d2" />,
  },
  {
    key: 'drugs',
    label: 'Drug Reference',
    icon: <Ionicons name="medkit-outline" size={28} color="#1976d2" />,
  },
];

// --- BMI Calculator Component ---
function BMICalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculateBMI() {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) {
      setResult('Enter valid height and weight.');
      return;
    }
    const bmi = w / ((h / 100) * (h / 100));
    let category = '';
    if (bmi < 18.5) category = 'Underweight';
    else if (bmi < 25) category = 'Normal';
    else if (bmi < 30) category = 'Overweight';
    else category = 'Obese';
    setResult(`BMI: ${bmi.toFixed(1)} (${category})`);
  }

  return (
    <View style={[styles.toolDetailBox, { width: '100%', maxWidth: 420 }]}>
  <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>BMI Calculator</Text>
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter height (cm):</Text>
      <TextInput
        style={styles.input}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter weight (kg):</Text>
      <TextInput
        style={styles.input}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TouchableOpacity style={styles.calcButton} onPress={calculateBMI}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: '#e3f2fd', borderColor: '#1976d2', marginTop: 18 }]}>
          <Text style={[styles.bmiResultText, { color: '#1976d2' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        BMI = Weight (kg) / [Height (m)]²
      </Text>
    </View>
  );
}

// --- BSA Calculator Component ---
function BSACalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculateBSA() {
    const h = parseFloat(height);
    const w = parseFloat(weight);
    if (!h || !w) {
      setResult('Enter valid height and weight.');
      return;
    }
    const bsa = Math.sqrt((h * w) / 3600);
    setResult(`BSA: ${bsa.toFixed(3)} m²`);
  }

  return (
    <View style={[styles.toolDetailBox, {
      width: '100%',
      maxWidth: 420,
      backgroundColor: isDark ? '#181c24' : '#fff',
      borderColor: isDark ? '#333' : '#e3f2fd',
    }]}> 
      <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>BSA Calculator</Text>
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter height (cm):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Height (cm)"
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter weight (kg):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TouchableOpacity style={styles.calcButton} onPress={calculateBSA}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: isDark ? '#90caf9' : '#1976d2' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: isDark ? '#90caf9' : '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        BSA (m²) = √([Height(cm) × Weight(kg)] / 3600) {"\n"}Mosteller formula.
      </Text>
    </View>
  );
}

// --- CURB-65 Calculator Component ---
function CURB65Calculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [confusion, setConfusion] = useState(false);
  const [urea, setUrea] = useState('');
  const [resp, setResp] = useState('');
  const [bpSys, setBpSys] = useState('');
  const [bpDia, setBpDia] = useState('');
  const [age, setAge] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculateCURB65() {
    let score = 0;
    if (confusion) score += 1;
    if (parseFloat(urea) > 7) score += 1;
    if (parseFloat(resp) >= 30) score += 1;
    if (parseFloat(bpSys) < 90 || parseFloat(bpDia) <= 60) score += 1;
    if (parseFloat(age) >= 65) score += 1;

    let risk = '';
    if (score === 0 || score === 1) risk = 'Low risk (mortality <3%)';
    else if (score === 2) risk = 'Moderate risk (mortality ~9%)';
    else risk = 'High risk (mortality 15–40%)';

    setResult(`CURB-65 Score: ${score}\n${risk}`);
  }

  return (
    <View style={[styles.toolDetailBox, {
      width: '100%',
      maxWidth: 420,
      backgroundColor: isDark ? '#181c24' : '#fff',
      borderColor: isDark ? '#333' : '#e3f2fd',
    }]}> 
      <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>CURB-65 Calculator</Text>
      <View style={{ width: '100%', marginBottom: 8 }}>
        <TouchableOpacity
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 8,
          }}
          onPress={() => setConfusion(!confusion)}
        >
          <Ionicons
            name={confusion ? 'checkbox' : 'square-outline'}
            size={22}
            color={confusion ? '#1976d2' : '#888'}
            style={{ marginRight: 8 }}
          />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>
            Confusion (AMT ≤8/10 or disoriented)
          </Text>
        </TouchableOpacity>
        <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter urea (mmol/L):</Text>
        <TextInput
          style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
          placeholder="Urea (mmol/L)"
          keyboardType="numeric"
          value={urea}
          onChangeText={setUrea}
          placeholderTextColor={isDark ? '#90caf9' : '#888'}
        />
        <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter respiratory rate (/min):</Text>
        <TextInput
          style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
          placeholder="Respiratory Rate (/min)"
          keyboardType="numeric"
          value={resp}
          onChangeText={setResp}
          placeholderTextColor={isDark ? '#90caf9' : '#888'}
        />
        <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter blood pressure (mmHg):</Text>
        <View style={{ flexDirection: 'row', gap: 8 }}>
          <TextInput
            style={[styles.input, { flex: 1, color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
            placeholder="Systolic BP (mmHg)"
            keyboardType="numeric"
            value={bpSys}
            onChangeText={setBpSys}
            placeholderTextColor={isDark ? '#90caf9' : '#888'}
          />
          <TextInput
            style={[styles.input, { flex: 1, color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
            placeholder="Diastolic BP (mmHg)"
            keyboardType="numeric"
            value={bpDia}
            onChangeText={setBpDia}
            placeholderTextColor={isDark ? '#90caf9' : '#888'}
          />
        </View>
        <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter age (years):</Text>
        <TextInput
          style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
          placeholder="Age (years)"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
          placeholderTextColor={isDark ? '#90caf9' : '#888'}
        />
      </View>
      <TouchableOpacity style={styles.calcButton} onPress={calculateCURB65}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: isDark ? '#90caf9' : '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: isDark ? '#90caf9' : '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        1 point each: Confusion, Urea &gt;7 mmol/L, RR ≥30, SBP &lt;90 or DBP ≤60, Age ≥65.
      </Text>
    </View>
  );
}

// --- eGFR Calculator Component ---
function EGFRCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [age, setAge] = useState('');
  const [sex, setSex] = useState<'male' | 'female'>('male');
  const [scr, setScr] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculateEGFR() {
    const ageNum = parseFloat(age);
    const scrNum = parseFloat(scr);
    if (!ageNum || !scrNum) {
      setResult('Enter valid age and creatinine.');
      return;
    }
    // CKD-EPI 2021, non-race based
    const k = sex === 'female' ? 0.7 : 0.9;
    const alpha = sex === 'female' ? -0.241 : -0.302;
    const minScrK = Math.min(scrNum / k, 1);
    const maxScrK = Math.max(scrNum / k, 1);
    let egfr = 142 * Math.pow(minScrK, alpha) * Math.pow(maxScrK, -1.200) * Math.pow(0.9938, ageNum);
    if (sex === 'female') egfr *= 1.012;
    setResult(`eGFR: ${egfr.toFixed(1)} mL/min/1.73m²`);
  }

  return (
    <View style={[styles.toolDetailBox, {
      width: '100%',
      maxWidth: 420,
      backgroundColor: isDark ? '#181c24' : '#fff',
      borderColor: isDark ? '#333' : '#e3f2fd',
    }]}> 
      <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>eGFR Calculator</Text>
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>
        Enter patient age:
      </Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Age (years)"
        keyboardType="numeric"
        value={age}
        onChangeText={setAge}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>
        Select sex:
      </Text>
      <View style={{ flexDirection: 'row', marginBottom: 12, width: '100%' }}>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: sex === 'male' ? '#1976d2' : (isDark ? '#23272e' : '#e3f2fd'),
            borderRadius: 8,
            padding: 10,
            marginRight: 4,
            alignItems: 'center',
          }}
          onPress={() => setSex('male')}
        >
          <Text style={{ color: sex === 'male' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold' }}>Male</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: sex === 'female' ? '#1976d2' : (isDark ? '#23272e' : '#e3f2fd'),
            borderRadius: 8,
            padding: 10,
            marginLeft: 4,
            alignItems: 'center',
          }}
          onPress={() => setSex('female')}
        >
          <Text style={{ color: sex === 'female' ? '#fff' : (isDark ? '#90caf9' : '#1976d2'), fontWeight: 'bold' }}>Female</Text>
        </TouchableOpacity>
      </View>
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>
        Enter serum creatinine:
      </Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Serum Creatinine (mg/dL)"
        keyboardType="numeric"
        value={scr}
        onChangeText={setScr}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TouchableOpacity style={styles.calcButton} onPress={calculateEGFR}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: isDark ? '#90caf9' : '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: isDark ? '#90caf9' : '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        CKD-EPI 2021: eGFR = 142 × min(Scr/κ,1)
        <Text style={{ fontSize: 10 }}>α</Text> × max(Scr/κ,1)
        <Text style={{ fontSize: 10 }}>-1.200</Text> × 0.9938
        <Text style={{ fontSize: 10 }}>Age</Text> × [1.012 if female]
        {'\n'}Scr = serum creatinine (mg/dL), κ = 0.7 (female) or 0.9 (male), α = -0.241 (female) or -0.302 (male)
      </Text>
    </View>
  );
}

// --- Parkland Formula Calculator Component ---
function ParklandCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [weight, setWeight] = useState('');
  const [tbsa, setTbsa] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculateParkland() {
    const w = parseFloat(weight);
    const t = parseFloat(tbsa);
    if (!w || !t) {
      setResult('Enter valid weight and %TBSA.');
      return;
    }
    const total = 4 * w * t;
    const first8 = total / 2;
    const next16 = total / 2;
    setResult(
      `Total fluid: ${total.toLocaleString()} mL\n` +
      `First 8h: ${first8.toLocaleString()} mL\n` +
      `Next 16h: ${next16.toLocaleString()} mL`
    );
  }

  return (
    <View style={[styles.toolDetailBox, {
      width: '100%',
      maxWidth: 420,
      backgroundColor: isDark ? '#181c24' : '#fff',
      borderColor: isDark ? '#333' : '#e3f2fd',
    }]}> 
      <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>Parkland Formula</Text>
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter weight (kg):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter %TBSA burned:</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="%TBSA burned"
        keyboardType="numeric"
        value={tbsa}
        onChangeText={setTbsa}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TouchableOpacity style={styles.calcButton} onPress={calculateParkland}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: isDark ? '#90caf9' : '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: isDark ? '#90caf9' : '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        Total fluid (mL) = 4 × Weight (kg) × %TBSA burned.{"\n"}
        Give half in first 8h, remainder over next 16h.
      </Text>
    </View>
  );
}

// --- Hegar Formula Calculator Component ---
function HegarCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [weight, setWeight] = useState('');
  const [tbsa, setTbsa] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculateHegar() {
    const w = parseFloat(weight);
    const t = parseFloat(tbsa);
    if (!w || !t) {
      setResult('Enter valid weight and %TBSA.');
      return;
    }
    // Hegar formula: Fluid (mL) = weight (kg) × %TBSA × 5
    const total = w * t * 5;
    const first8 = total / 2;
    const next16 = total / 2;
    setResult(
      `Total fluid: ${total.toLocaleString()} mL in 24 hours\n` +
      `First 8h: ${first8.toLocaleString()} mL\n` +
      `Next 16h: ${next16.toLocaleString()} mL\n\n` +
      `Fluid distribution:\n- 1/2 in first 8 hours\n- 1/2 in next 16 hours\n- Use Ringer's lactate or Hartmann's solution`
    );
  }

  return (
    <View style={[styles.toolDetailBox, {
      width: '100%',
      maxWidth: 420,
      backgroundColor: isDark ? '#181c24' : '#fff',
      borderColor: isDark ? '#333' : '#e3f2fd',
    }]}> 
      <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>Hegar Formula (Hegar-Burn)</Text>
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter weight (kg):</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="Weight (kg)"
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 13, marginBottom: 2 }}>Enter %TBSA burned:</Text>
      <TextInput
        style={[styles.input, { color: isDark ? '#fff' : '#222', backgroundColor: isDark ? '#23272e' : '#f7faff', borderColor: isDark ? '#90caf9' : '#90caf9' }]}
        placeholder="%TBSA burned"
        keyboardType="numeric"
        value={tbsa}
        onChangeText={setTbsa}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TouchableOpacity style={styles.calcButton} onPress={calculateHegar}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: isDark ? '#90caf9' : '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: isDark ? '#90caf9' : '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        The Hegar formula (Hegar-Burn):{"\n"}
        Fluid (mL) = Body weight (kg) × %TBSA burned × 5{"\n"}
        Half in first 8h, half in next 16h.{"\n"}
        Used for initial resuscitation in children and adults.{"\n\n"}
        Example: 70 kg × 20% × 5 = 7000 mL in 24h (3500 mL in first 8h, 3500 mL in next 16h)
      </Text>
    </View>
  );
}

// --- CHA2DS2-VASc Score Calculator Component ---
function CHA2DS2VAScCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [chf, setChf] = useState(false);
  const [htn, setHtn] = useState(false);
  const [age, setAge] = useState('');
  const [diabetes, setDiabetes] = useState(false);
  const [stroke, setStroke] = useState(false);
  const [vascular, setVascular] = useState(false);
  const [female, setFemale] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function calculateCHA2DS2VASc() {
    let score = 0;
    if (chf) score += 1;
    if (htn) score += 1;
    const ageNum = parseInt(age);
    if (!isNaN(ageNum)) {
      if (ageNum >= 75) score += 2;
      else if (ageNum >= 65) score += 1;
    }
    if (diabetes) score += 1;
    if (stroke) score += 2;
    if (vascular) score += 1;
    if (female) score += 1;

    let risk = '';
    if (score === 0) risk = 'Low risk (no anticoagulation needed)';
    else if (score === 1) risk = 'Low-moderate risk (consider anticoagulation)';
    else risk = 'Moderate-high risk (anticoagulation recommended)';

    setResult(`CHA₂DS₂-VASc Score: ${score}\n${risk}`);
  }

  return (
    <View style={[styles.toolDetailBox, { width: '100%', maxWidth: 420 }]}>
  <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>CHA₂DS₂-VASc Score</Text>
      <View style={{ width: '100%', marginBottom: 8 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setChf(!chf)}
        >
          <Ionicons name={chf ? 'checkbox' : 'square-outline'} size={22} color={chf ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Congestive heart failure</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setHtn(!htn)}
        >
          <Ionicons name={htn ? 'checkbox' : 'square-outline'} size={22} color={htn ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Hypertension</Text>
        </TouchableOpacity>
        <TextInput
          style={styles.input}
          placeholder="Age (years)"
          keyboardType="numeric"
          value={age}
          onChangeText={setAge}
        />
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setDiabetes(!diabetes)}
        >
          <Ionicons name={diabetes ? 'checkbox' : 'square-outline'} size={22} color={diabetes ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Diabetes mellitus</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setStroke(!stroke)}
        >
          <Ionicons name={stroke ? 'checkbox' : 'square-outline'} size={22} color={stroke ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Stroke/TIA/thromboembolism</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setVascular(!vascular)}
        >
          <Ionicons name={vascular ? 'checkbox' : 'square-outline'} size={22} color={vascular ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Vascular disease (MI, PAD, aortic plaque)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setFemale(!female)}
        >
          <Ionicons name={female ? 'checkbox' : 'square-outline'} size={22} color={female ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Sex category (female)</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.calcButton} onPress={calculateCHA2DS2VASc}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: '#e3f2fd', borderColor: '#1976d2', marginTop: 18 }]}>
          <Text style={[styles.bmiResultText, { color: '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
  CHA₂DS₂-VASc formula:{"\n"}
  <Text style={{ fontWeight: 'bold' }}>CHF</Text> (1), <Text style={{ fontWeight: 'bold' }}>Hypertension</Text> (1), <Text style={{ fontWeight: 'bold' }}>Age ≥75</Text> (2), <Text style={{ fontWeight: 'bold' }}>Diabetes</Text> (1), <Text style={{ fontWeight: 'bold' }}>Stroke/TIA/thromboembolism</Text> (2),{"\n"}
  <Text style={{ fontWeight: 'bold' }}>Vascular disease</Text> (1), <Text style={{ fontWeight: 'bold' }}>Age 65–74</Text> (1), <Text style={{ fontWeight: 'bold' }}>Sex (female)</Text> (1).{"\n\n"}
  Example: 75yo female with hypertension and diabetes:{"\n"}
  2 (age) + 1 (female) + 1 (htn) + 1 (diabetes) = 5
      </Text>
    </View>
  );
}

// --- HAS-BLED Score Calculator Component ---
function HASBLEDCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [htn, setHtn] = useState(false);
  const [abnormal, setAbnormal] = useState(false);
  const [stroke, setStroke] = useState(false);
  const [bleeding, setBleeding] = useState(false);
  const [labileInr, setLabileInr] = useState(false);
  const [elderly, setElderly] = useState(false);
  const [drugsAlcohol, setDrugsAlcohol] = useState(false);
  const [result, setResult] = useState<string | null>(null);

  function calculateHASBLED() {
    let score = 0;
    if (htn) score += 1;
    if (abnormal) score += 1;
    if (stroke) score += 1;
    if (bleeding) score += 1;
    if (labileInr) score += 1;
    if (elderly) score += 1;
    if (drugsAlcohol) score += 1;

    let risk = '';
    if (score <= 2) risk = 'Low-moderate bleeding risk';
    else risk = 'High bleeding risk (≥3)';

    setResult(`HAS-BLED Score: ${score}\n${risk}`);
  }

  return (
    <View style={[styles.toolDetailBox, { width: '100%', maxWidth: 420 }]}>
  <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>HAS-BLED Score</Text>
      <View style={{ width: '100%', marginBottom: 8 }}>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setHtn(!htn)}
        >
          <Ionicons name={htn ? 'checkbox' : 'square-outline'} size={22} color={htn ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Hypertension (SBP &gt;160 mmHg)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setAbnormal(!abnormal)}
        >
          <Ionicons name={abnormal ? 'checkbox' : 'square-outline'} size={22} color={abnormal ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Abnormal renal/liver function</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setStroke(!stroke)}
        >
          <Ionicons name={stroke ? 'checkbox' : 'square-outline'} size={22} color={stroke ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Stroke history</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setBleeding(!bleeding)}
        >
          <Ionicons name={bleeding ? 'checkbox' : 'square-outline'} size={22} color={bleeding ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Bleeding history/predisposition</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setLabileInr(!labileInr)}
        >
          <Ionicons name={labileInr ? 'checkbox' : 'square-outline'} size={22} color={labileInr ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Labile INR</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setElderly(!elderly)}
        >
          <Ionicons name={elderly ? 'checkbox' : 'square-outline'} size={22} color={elderly ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Elderly (&gt;65 years)</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
          onPress={() => setDrugsAlcohol(!drugsAlcohol)}
        >
          <Ionicons name={drugsAlcohol ? 'checkbox' : 'square-outline'} size={22} color={drugsAlcohol ? '#1976d2' : '#888'} style={{ marginRight: 8 }} />
          <Text style={{ color: isDark ? '#fff' : '#222', fontSize: 16 }}>Drugs/alcohol (antiplatelets, NSAIDs, excess alcohol)</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.calcButton} onPress={calculateHASBLED}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: isDark ? '#222b38' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: isDark ? '#90caf9' : '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
  <Text style={{ color: isDark ? '#bbb' : '#888', fontSize: 12, marginTop: 12, textAlign: 'center' }}>
        HAS-BLED formula:{"\n"}
        <Text style={{ fontWeight: 'bold' }}>H</Text>ypertension (1), <Text style={{ fontWeight: 'bold' }}>A</Text>bnormal renal/liver function (1), <Text style={{ fontWeight: 'bold' }}>S</Text>troke (1), <Text style={{ fontWeight: 'bold' }}>B</Text>leeding (1),{"\n"}
        <Text style={{ fontWeight: 'bold' }}>L</Text>abile INR (1), <Text style={{ fontWeight: 'bold' }}>E</Text>lderly {'>'}65 (1), <Text style={{ fontWeight: 'bold' }}>D</Text>rugs/alcohol (1).{"\n\n"}
        Example: 70yo with hypertension, abnormal renal function, and on NSAIDs:{"\n"}
        1 (htn) + 1 (abnormal) + 1 (drugs) + 1 (elderly) = 4 (high risk)
      </Text>
    </View>
  );
}

// --- Shock Index Calculator Component ---
function ShockIndexCalculator() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [hr, setHr] = useState('');
  const [sbp, setSbp] = useState('');
  const [result, setResult] = useState<string | null>(null);

  function calculateShockIndex() {
    const hrNum = parseFloat(hr);
    const sbpNum = parseFloat(sbp);
    if (!hrNum || !sbpNum || sbpNum === 0) {
      setResult('Enter valid HR and SBP.');
      return;
    }
    const si = hrNum / sbpNum;
    let risk = '';
    if (si < 0.5) risk = 'Low (normal)';
    else if (si < 0.7) risk = 'Normal';
    else if (si < 1.0) risk = 'Elevated';
    else risk = 'High (possible shock)';
    setResult(`Shock Index: ${si.toFixed(2)} (${risk})`);
  }

  return (
    <View style={[styles.toolDetailBox, { width: '100%', maxWidth: 420, backgroundColor: isDark ? '#181c24' : '#fff', borderColor: isDark ? '#333' : '#e3f2fd' }]}> 
      <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>Shock Index</Text>
      <TextInput
        style={[
          styles.input,
          isDark && {
            backgroundColor: '#23272e',
            color: '#fff',
            borderColor: '#90caf9',
          },
        ]}
        placeholder="Heart Rate (bpm)"
        keyboardType="numeric"
        value={hr}
        onChangeText={setHr}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TextInput
        style={[
          styles.input,
          isDark && {
            backgroundColor: '#23272e',
            color: '#fff',
            borderColor: '#90caf9',
          },
        ]}
        placeholder="Systolic BP (mmHg)"
        keyboardType="numeric"
        value={sbp}
        onChangeText={setSbp}
        placeholderTextColor={isDark ? '#90caf9' : '#888'}
      />
      <TouchableOpacity style={styles.calcButton} onPress={calculateShockIndex}>
        <Text style={styles.calcButtonText}>Calculate</Text>
      </TouchableOpacity>
      {result && (
        <View style={[styles.bmiResultBox, { backgroundColor: isDark ? '#23272e' : '#e3f2fd', borderColor: isDark ? '#90caf9' : '#1976d2', marginTop: 18 }]}> 
          <Text style={[styles.bmiResultText, { color: isDark ? '#90caf9' : '#1976d2', textAlign: 'center' }]}>{result}</Text>
        </View>
      )}
      <Text style={{ color: isDark ? '#bbb' : '#888', fontSize: 12, marginTop: 12, textAlign: 'center', backgroundColor: isDark ? '#181c24' : undefined, padding: 4, borderRadius: 6 }}>
        Shock Index = HR / SBP. {"\n"}
        Normal: 0.5–0.7. {"\n"}
        {'>'}0.9 suggests increased risk of shock/mortality.
      </Text>
    </View>
  );
}

// --- Cardiology Calculators Page ---
function CardiologyCalculators({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCalc, setActiveCalc] = useState<string | null>(null);

  return (
    <View style={{ width: '100%', maxWidth: 480 }}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#1976d2" />
        <Text style={styles.backText}>Back to Categories</Text>
      </TouchableOpacity>
      {/* Only show the section title if no calculator is open */}
      {!activeCalc && (
        <Text style={[styles.toolDetailTitle, { marginTop: 0, color: isDark ? '#90caf9' : '#1976d2' }]}>Cardiology Calculators</Text>
      )}
      {!activeCalc && (
        <View style={{ width: '100%' }}>
          {/* HAS-BLED Calculator Placeholder */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('hasbled')}
            activeOpacity={0.85}
          >
            <Ionicons name="water-outline" size={28} color="#d32f2f" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#d32f2f',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                HAS-BLED Score
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Bleeding risk in atrial fibrillation.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#d32f2f'} />
          </TouchableOpacity>
          {/* Shock Index Calculator Placeholder */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('shockindex')}
            activeOpacity={0.85}
          >
            <Ionicons name="pulse-outline" size={28} color="#d32f2f" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#d32f2f',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                Shock Index
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                HR / SBP. Early marker of shock.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#d32f2f'} />
          </TouchableOpacity>
          {/* Add more cardiology calculators here */}
        </View>
      )}
      {activeCalc === 'hasbled' && (
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.backButton} onPress={() => setActiveCalc(null)}>
            <Ionicons name="arrow-back" size={20} color="#1976d2" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <HASBLEDCalculator />
        </View>
      )}
      {activeCalc === 'shockindex' && (
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.backButton} onPress={() => setActiveCalc(null)}>
            <Ionicons name="arrow-back" size={20} color="#1976d2" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          <ShockIndexCalculator />
        </View>
      )}
    </View>
  );
}

// --- General Clinical Calculators Page ---
function GeneralClinicalCalculators({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCalc, setActiveCalc] = useState<string | null>(null);

  return (
    <View style={{ width: '100%', maxWidth: 480 }}>
      {/* Back button */}
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#1976d2" />
        <Text style={styles.backText}>Back to Categories</Text>
      </TouchableOpacity>
  <Text style={[styles.toolDetailTitle, { marginTop: 0, color: isDark ? '#90caf9' : '#1976d2' }]}>General Clinical Calculators</Text>
      {/* Calculator List */}
      {!activeCalc && (
        <View style={{ width: '100%' }}>
          {/* BMI Calculator Placeholder */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('bmi')}
            activeOpacity={0.85}
          >
            <Ionicons name="body-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                BMI Calculator
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Calculate Body Mass Index from height and weight.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* BSA Calculator Placeholder */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('bsa')}
            activeOpacity={0.85}
          >
            <Ionicons name="resize-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                BSA Calculator
             
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Calculate Body Surface Area from height and weight.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* CURB-65 Calculator Placeholder */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical:  16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('curb65')}
            activeOpacity={0.85}
          >
            <Ionicons name="pulse-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                CURB-65 Calculator
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Assess pneumonia severity (confusion, urea, RR, BP, age).
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* eGFR Calculator Placeholder */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('egfr')}
            activeOpacity={0.85}
          >
            <Ionicons name="water-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                eGFR Calculator
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Estimate glomerular filtration rate (CKD-EPI 2021).
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* CHA2DS2-VASc Calculator Placeholder */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('chadsvasc')}
            activeOpacity={0.85}
          >
            <Ionicons name="medkit-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                CHA₂DS₂-VASc Score
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Stroke risk in atrial fibrillation.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* Add more calculator placeholders here */}
        </View>
      )}
      {activeCalc && (
        <View style={{ width: '100%' }}>
          <TouchableOpacity style={styles.backButton} onPress={() => setActiveCalc(null)}>
            <Ionicons name="arrow-back" size={20} color="#1976d2" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
          {activeCalc === 'bmi' && <BMICalculator />}
          {activeCalc === 'bsa' && <BSACalculator />}
          {activeCalc === 'curb65' && <CURB65Calculator />}
          {activeCalc === 'egfr' && <EGFRCalculator />}
          {activeCalc === 'chadsvasc' && <CHA2DS2VAScCalculator />}
          {activeCalc === 'hasbled' && <HASBLEDCalculator />}
          {activeCalc === 'shockindex' && <ShockIndexCalculator />}
        </View>
      )}
    </View>
  );
}

// --- Critical Care/Emergency Calculators Page ---
function CriticalCareCalculators({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [activeCalc, setActiveCalc] = useState<string | null>(null);

  return (
    <View style={{ width: '100%', maxWidth: 480 }}>
      <TouchableOpacity style={styles.backButton} onPress={onBack}>
        <Ionicons name="arrow-back" size={20} color="#1976d2" />
        <Text style={styles.backText}>Back to Categories</Text>
      </TouchableOpacity>
      {/* Only show the section title if no tool is open */}
      {!activeCalc && (
        <Text style={[styles.toolDetailTitle, { marginTop: 0, color: isDark ? '#90caf9' : '#1976d2' }]}>Critical Care / Emergency Calculators</Text>
      )}
      {!activeCalc && (
        <View style={{ width: '100%' }}>
          {/* MANTRELS Score Button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('mantrels')}
            activeOpacity={0.85}
          >
            <Ionicons name="medkit-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                MANTRELS (Alvarado) Score
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Appendicitis risk assessment (MANTRELS/Alvarado score).
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>

          {/* Glasgow Coma Scale Button */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('gcs')}
            activeOpacity={0.85}
          >
            <Ionicons name="eye-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                Glasgow Coma Scale
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Assess level of consciousness (GCS).
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* CURB-65 Calculator (duplicate for Critical Care) */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('curb65')}
            activeOpacity={0.85}
          >
            <Ionicons name="pulse-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                CURB-65 Calculator
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Assess pneumonia severity (confusion, urea, RR, BP, age).
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* Parkland Formula Calculator */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('parkland')}
            activeOpacity={0.85}
          >
            <Ionicons name="flame-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                Parkland Formula
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Calculate burn fluid requirements (first 24h).
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* Hegar Formula Calculator */}
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('hegar')}
            activeOpacity={0.85}
          >
            <Ionicons name="flame-outline" size={28} color="#388e3c" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#388e3c',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                Hegar Formula
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Alternative burn fluid calculation (first 24h).
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#388e3c'} />
          </TouchableOpacity>
      {/* Potassium Deficit Calculator Button */}
      {/* Sodium Deficit Calculator Button */}
      <TouchableOpacity
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          backgroundColor: isDark ? '#23272e' : '#f7faff',
          borderRadius: 10,
          paddingVertical: 16,
          paddingHorizontal: 16,
          borderWidth: 1.5,
          borderColor: '#90caf9',
          marginBottom: 14,
          shadowColor: '#1976d2',
          shadowOpacity: 0.08,
          shadowOffset: { width: 0, height: 2 },
          shadowRadius: 4,
          elevation: 1,
        }}
        onPress={() => setActiveCalc('sodium')}
        activeOpacity={0.85}
      >
        <Ionicons name="water-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
        <View style={{ flex: 1 }}>
          <Text style={{
            color: isDark ? '#90caf9' : '#1976d2',
            fontWeight: 'bold',
            fontSize: 16,
          }}>
            Sodium Deficit Calculator
          </Text>
          <Text style={{
            color: isDark ? '#aaa' : '#555',
            fontSize: 13,
            marginTop: 2,
          }}>
            Estimate sodium replacement for hyponatremia.
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
      </TouchableOpacity>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: isDark ? '#23272e' : '#f7faff',
              borderRadius: 10,
              paddingVertical: 16,
              paddingHorizontal: 16,
              borderWidth: 1.5,
              borderColor: '#90caf9',
              marginBottom: 14,
              shadowColor: '#1976d2',
              shadowOpacity: 0.08,
              shadowOffset: { width: 0, height: 2 },
              shadowRadius: 4,
              elevation: 1,
            }}
            onPress={() => setActiveCalc('potassium')}
            activeOpacity={0.85}
          >
            <Ionicons name="flask-outline" size={28} color="#1976d2" style={{ marginRight: 14 }} />
            <View style={{ flex: 1 }}>
              <Text style={{
                color: isDark ? '#90caf9' : '#1976d2',
                fontWeight: 'bold',
                fontSize: 16,
              }}>
                Potassium Deficit Calculator
              </Text>
              <Text style={{
                color: isDark ? '#aaa' : '#555',
                fontSize: 13,
                marginTop: 2,
              }}>
                Estimate potassium replacement for hypokalemia.
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={22} color={isDark ? '#90caf9' : '#1976d2'} />
          </TouchableOpacity>
          {/* Add more critical care calculators here */}
        </View>
      )}
      {activeCalc === 'mantrels' && <MantrelsCalculator />}
      {activeCalc === 'gcs' && (
        <GCSCalculator onBack={() => setActiveCalc(null)} />
      )}
      {activeCalc === 'curb65' && <CURB65Calculator />}
      {activeCalc === 'parkland' && <ParklandCalculator />}
      {activeCalc === 'hegar' && <HegarCalculator />}
  {activeCalc === 'potassium' && <PottasiumCalculator onBack={() => setActiveCalc(null)} />}
  {activeCalc === 'sodium' && <SodiumCalculator />}
    </View>
  );
}

export default function ToolsScreen() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  // Widget selection state
  const [selectedWidget, setSelectedWidget] = useState<'calc' | 'imaging' | 'reference' | 'notes' | 'favorites' | 'guidelines' | 'clip' | null>('calc');
  const navigation = useNavigation<any>();
  // Local clip "navigation" state for Clip widget screens
  const [clipRouteName, setClipRouteName] = useState<'Clip' | 'ClipForm' | 'ClipDetail'>('Clip');
  const [clipRouteParams, setClipRouteParams] = useState<any>(null);
  const [clipRefresh, setClipRefresh] = useState(0); // Trigger refresh
  const [calculatorSearch, setCalculatorSearch] = useState('');

  // Add guideline selection state for guidelines widget
  const [selectedGuideline, setSelectedGuideline] = useState<string | null>(null);

  // Reference sub-widget state
  const [selectedReference, setSelectedReference] = useState<
    'labvalues' | 'drugs' | null
  >(null);

  // Lab values subsections
  const [selectedLabSection, setSelectedLabSection] = useState<
    'blood' | 'haematologic' | 'csf' | 'sweaturine' | null
  >(null);

  // --- Redesigned Unit Converter State ---
  const [convCategory, setConvCategory] = useState(unitCategories[0].key);
  const [convValue, setConvValue] = useState('');
  const [convFrom, setConvFrom] = useState(unitCategories[0].defaultFrom);
  const [convTo, setConvTo] = useState(unitCategories[0].defaultTo);
  const [convValence, setConvValence] = useState('1');
  const [convResult, setConvResult] = useState<string | null>(null);
  const [convFormula, setConvFormula] = useState<string | null>(null);

  const currentCategory = unitCategories.find(c => c.key === convCategory)!;

  function handleCategoryChange(catKey: string) {
    const cat = unitCategories.find(c => c.key === catKey)!;
    setConvCategory(catKey);
    setConvFrom(cat.defaultFrom);
    setConvTo(cat.defaultTo);
    setConvValue('');
    setConvValence('1');
    setConvResult(null);
    setConvFormula(null);
  }

  function handleConvert() {
    const val = parseFloat(convValue);
    if (isNaN(val)) {
      setConvResult('Enter a valid number.');
      setConvFormula(null);
      return;
    }
    let result: number | null = null;
    let formula: string | null = null;
    if (currentCategory.needsValence) {
      const valence = parseFloat(convValence);
      if (!valence || valence <= 0) {
        setConvResult('Enter a valid valence.');
        setConvFormula(null);
        return;
      }
      result = currentCategory.convert(val, convFrom, convTo, valence);
      formula = currentCategory.formula(convFrom, convTo);
    } else {
      result = currentCategory.convert(val, convFrom, convTo);
      formula = currentCategory.formula(convFrom, convTo);
    }
    if (result === null || isNaN(result)) {
      setConvResult('Conversion not supported.');
      setConvFormula(null);
    } else {
      setConvResult(`${result.toFixed(4)} ${currentCategory.units.find(u => u.key === convTo)?.label || convTo}`);
      setConvFormula(formula);
    }
  }

  // Modernized calcCategories: add icon, color, and description for each category
  const calcCategories = [
    {
      key: 'general',
      label: 'General Clinical',
      icon: <Ionicons name="medkit-outline" size={22} color="#1976d2" />,
      color: '#1976d2',
      desc: 'Common clinical calculators (BMI, BSA, eGFR, etc.)',
      tools: [
        {
          key: 'mantrels',
          name: 'MANTRELS (Alvarado) Score',
          description: 'Appendicitis risk assessment (MANTRELS/Alvarado score).',
          method: 'mantrels',
        },
      ],
    },
    {
      key: 'obgyn',
      label: 'Obs/Gynae',
      icon: <Ionicons name="female-outline" size={22} color="#c2185b" />,
      color: '#c2185b',
      desc: 'Obstetric and gynaecology calculators',
      tools: [
        {
          key: 'lmp',
          name: 'LMP & EDD Calculator',
          description: 'Calculate Estimated Due Date from Last Menstrual Period.',
          method: 'EDD = LMP + 280 days (40 weeks).',
        },
      ],
    },
    {
      key: 'cardiology',
      label: 'Cardiology',
      icon: <Ionicons name="heart-outline" size={22} color="#d32f2f" />,
      color: '#d32f2f',
      desc: 'Cardiology risk scores and calculators',
    },
    {
      key: 'paediatrics',
      label: 'Paediatrics',
      icon: <Ionicons name="happy-outline" size={22} color="#0288d1" />,
      color: '#0288d1',
      desc: 'Paediatric calculators and growth tools',
      tools: [
        {
          key: 'paed-weight',
          name: 'Paediatric Weight Estimation',
          description: 'Estimate child weight by age (Kenyan protocol, <9mo and >9mo).',
          method:
            'For 9 months and under: Weight (kg) = (Age in months × 0.5) + 4\n' +
            'Above 9 months: Weight (kg) = (Age in years × 2) + 8',
        },
        {
          key: 'holliday-segar',
          name: 'Holliday-Segar Method',
          description: 'Calculate daily maintenance fluid requirement for children.',
          method:
            '100 mL/kg for first 10 kg, 50 mL/kg for next 10 kg, 20 mL/kg for each kg above 20. Divide by 24 for hourly rate.',
        },
        {
          key: 'jones-criteria',
          name: 'Jones Criteria for Rheumatic Fever',
          description: 'Diagnostic criteria for acute rheumatic fever (major/minor, revised 2015).',
          method:
            'Diagnosis requires evidence of preceding Group A Strep infection plus:\n' +
            '2 major OR 1 major + 2 minor criteria.\n' +
            'Major: Carditis, Polyarthritis, Chorea, Erythema marginatum, Subcutaneous nodules.\n' +
            'Minor: Arthralgia, Fever, Elevated ESR/CRP, Prolonged PR interval.\n' +
            'Supporting: Recent strep infection (throat culture, rapid antigen, or elevated ASO).',
        },
      ],
    },
    {
      key: 'critical',
      label: 'Critical Care',
      icon: <Ionicons name="pulse-outline" size={22} color="#388e3c" />,
      color: '#388e3c',
      desc: 'Emergency and ICU calculators',
    },
    {
      key: 'neurology',
      label: 'Neurology',
  icon: <Ionicons name="happy-outline" size={22} color="#7b1fa2" />, 
      color: '#7b1fa2',
      desc: 'Neurology scores and calculators',
    },
    {
      key: 'haematology',
      label: 'Haematology',
      icon: <Ionicons name="water-outline" size={22} color="#1976d2" />,
      color: '#1976d2',
      desc: 'Haematology calculators',
    },
  ];
  const [selectedCalcCategory, setSelectedCalcCategory] = useState<string>('general');

  // Add state to control if inside a category page
  const [showGeneralPage, setShowGeneralPage] = useState(false);
  const [showObgynPage, setShowObgynPage] = useState(false);
  const [showCriticalPage, setShowCriticalPage] = useState(false);
  const [showCardiologyPage, setShowCardiologyPage] = useState(false);
  const [showPaedsPage, setShowPaedsPage] = useState(false);
  const [showHaematologyPage, setShowHaematologyPage] = useState(false);

  // Search results or category tools
  return (
    <ScrollView
      contentContainerStyle={[
        styles.container,
        { backgroundColor: isDark ? '#181a20' : '#f7faff' }
      ]}
      style={{ backgroundColor: isDark ? '#181a20' : '#f7faff' }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={[styles.title, { color: isDark ? '#90caf9' : '#1976d2' }]}>Medical Tools</Text>
      {/* Widget Row */}
  <View style={[styles.widgetRow, { marginTop: 8, marginBottom: 8, gap: 4 }]}> 
        {widgets.filter(widget => widget.key !== 'favorites').map(widget => {
          const label = widget.label;
          const key = widget.key;
          return (
            <TouchableOpacity
              key={key}
              style={[
                styles.widgetButton,
                selectedWidget === key && styles.widgetButtonActive,
                isDark && { backgroundColor: selectedWidget === key ? '#1976d2' : '#23272e' },
                { paddingVertical: 6, minHeight: 48, flexDirection: 'column', justifyContent: 'center' }
              ]}
              onPress={() => {
                setSelectedWidget(key as any);
                setSelectedReference(null);
                if (key === 'calc') {
                  setSelectedCalcCategory('obgyn');
                  setShowObgynPage(true);
                  setShowGeneralPage(false);
                  setShowCriticalPage(false);
                  setShowCardiologyPage(false);
                  setShowPaedsPage(false);
                }
              }}
              activeOpacity={0.85}
            >
              <View style={{ alignItems: 'center', justifyContent: 'center' }}>{widget.icon}</View>
              <Text style={[
                styles.widgetButtonLabel,
                selectedWidget === key && styles.widgetButtonLabelActive,
                isDark && { color: selectedWidget === key ? '#fff' : '#90caf9' },
                { fontSize: 11, marginTop: 2, fontWeight: '600' }
              ]} numberOfLines={1}>
                {label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Calc Widget Content */}
      {selectedWidget === 'calc' && (
  <>
          {/* Modern, clean search bar at the top */}
          {(!showGeneralPage && !showCriticalPage && !showCardiologyPage && !showPaedsPage && !showObgynPage) && (
            <View style={{ marginBottom: 18, marginTop: 8, paddingHorizontal: 8 }}>
              <TextInput
                style={{
                  backgroundColor: isDark ? '#23272e' : '#f7faff',
                  borderRadius: 24,
                  paddingHorizontal: 18,
                  paddingVertical: 10,
                  color: isDark ? '#fff' : '#222',
                  fontSize: 16,
                  shadowColor: isDark ? '#000' : '#1976d2',
                  shadowOpacity: 0.06,
                  shadowOffset: { width: 0, height: 1 },
                  shadowRadius: 2,
                  elevation: 1,
                }}
                placeholder="Search calculators..."
                placeholderTextColor={isDark ? '#aaa' : '#888'}
                value={calculatorSearch}
                onChangeText={setCalculatorSearch}
                returnKeyType="search"
                clearButtonMode="while-editing"
              />
            </View>
          )}
          {/* Show flat list of matching calculators/tools if searching, else show category grid */}
          {(!showGeneralPage && !showCriticalPage && !showCardiologyPage && !showPaedsPage && !showObgynPage) && (
            calculatorSearch.trim()
              ? (() => {
                  const q = calculatorSearch.trim().toLowerCase();
                  // Gather all tools from all categories
                  const allTools = calcCategories.flatMap(cat =>
                    (cat.tools || []).map(tool => ({ ...tool, category: cat }))
                  );
                  const matches = allTools.filter(tool =>
                    tool.name.toLowerCase().includes(q) ||
                    (tool.description && tool.description.toLowerCase().includes(q)) ||
                    (tool.method && tool.method.toLowerCase().includes(q)) ||
                    tool.category.label.toLowerCase().includes(q)
                  );
                  if (matches.length === 0) {
                    return (
                      <Text style={{ color: isDark ? '#aaa' : '#888', textAlign: 'center', marginTop: 24 }}>
                        No calculators found for "{calculatorSearch}".
                      </Text>
                    );
                  }
                  return (
                    <View style={{ width: '100%', alignItems: 'center', marginBottom: 18 }}>
                      {matches.map(tool => (
                        <TouchableOpacity
                          key={tool.key}
                          style={{
                            width: 260,
                            backgroundColor: isDark ? '#23272e' : '#e3f2fd',
                            borderRadius: 14,
                            padding: 16,
                            marginBottom: 14,
                            borderWidth: 1,
                            borderColor: tool.category.color,
                            shadowColor: isDark ? '#000' : tool.category.color,
                            shadowOpacity: 0.08,
                            shadowOffset: { width: 0, height: 2 },
                            shadowRadius: 4,
                            elevation: 1,
                          }}
                          onPress={() => {
                            setSelectedCalcCategory(tool.category.key);
                            setShowGeneralPage(false);
                            setShowObgynPage(false);
                            setShowCriticalPage(false);
                            setShowCardiologyPage(false);
                            setShowPaedsPage(false);
                            // Open the tool directly if possible
                            setTimeout(() => {
                              if (tool.category.key === 'paediatrics') {
                                // Open paeds tool
                                setShowPaedsPage(true);
                                setTimeout(() => {
                                  // Use a custom event to signal PaedsToolsPage to open the tool
                                  const event = new CustomEvent('openPaedsTool', { detail: tool.key });
                                  window.dispatchEvent(event);
                                }, 0);
                              } else if (tool.category.key === 'general') {
                                setShowGeneralPage(true);
                                // Similar logic can be added for other categories if needed
                              } else if (tool.category.key === 'obgyn') {
                                setShowObgynPage(true);
                              } else if (tool.category.key === 'critical') {
                                setShowCriticalPage(true);
                              } else if (tool.category.key === 'cardiology') {
                                setShowCardiologyPage(true);
                              }
                            }, 0);
                          }}
                          activeOpacity={0.88}
                        >
                          <Text style={{ color: tool.category.color, fontWeight: 'bold', fontSize: 16 }}>{tool.name}</Text>
                          <Text style={{ color: isDark ? '#aaa' : '#555', fontSize: 13, marginTop: 2 }}>{tool.description}</Text>
                          {tool.method && (
                            <Text style={{ color: tool.category.color, fontSize: 12, marginTop: 8, fontStyle: 'italic' }}>{tool.method}</Text>
                          )}
                          <Text style={{ color: isDark ? '#90caf9' : '#1976d2', fontSize: 12, marginTop: 8 }}>{tool.category.label}</Text>
                        </TouchableOpacity>
                      ))}
                    </View>
                  );
                })()
              : (
                <View style={{
                  flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center',
                  gap: 20, paddingHorizontal: 0, marginBottom: 18,
                }}>
                  {calcCategories.map((cat, idx) => (
                    <TouchableOpacity
                      key={cat.key}
                      style={{
                        width: 240,
                        minHeight: 80,
                        maxHeight: 90,
                        backgroundColor: isDark ? '#23272e' : '#f7faff',
                        borderRadius: 18,
                        marginBottom: 4,
                        alignItems: 'center',
                        justifyContent: 'center',
                        paddingVertical: 10,
                        marginHorizontal: 4,
                        shadowColor: isDark ? '#000' : cat.color,
                        shadowOpacity: 0.10,
                        shadowOffset: { width: 0, height: 2 },
                        shadowRadius: 6,
                        elevation: 2,
                      }}
                      onPress={() => {
                        setSelectedCalcCategory(cat.key);
                        setShowGeneralPage(cat.key === 'general');
                        setShowObgynPage(cat.key === 'obgyn');
                        setShowCriticalPage(cat.key === 'critical');
                        setShowCardiologyPage(cat.key === 'cardiology');
                        setShowPaedsPage(cat.key === 'paediatrics');
                        setShowHaematologyPage(cat.key === 'haematology');
                      }}
                      activeOpacity={0.88}
                    >
                      <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', height: '100%', paddingHorizontal: 10 }}>
                        <View style={{
                          width: 48, height: 48, borderRadius: 24,
                          backgroundColor: cat.color + '22',
                          alignItems: 'center', justifyContent: 'center', marginRight: 16,
                        }}>
                          {React.cloneElement(cat.icon, {
                            color: cat.color,
                            size: 28,
                          })}
                        </View>
                        <View style={{ flex: 1, justifyContent: 'center' }}>
                          <Text style={{
                            color: isDark ? '#fff' : cat.color,
                            fontWeight: 'bold',
                            fontSize: 16,
                            textAlign: 'left',
                          }}>{cat.label}</Text>
                          <Text style={{
                            color: isDark ? '#aaa' : '#555',
                            fontSize: 13,
                            marginTop: 2,
                            textAlign: 'left',
                          }}>{cat.desc}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ))}
                </View>
              )
          )}
        {/* Category detail pages and placeholder */}
        {showGeneralPage ? (
          <GeneralClinicalCalculators onBack={() => setShowGeneralPage(false)} />
        ) : showObgynPage ? (
          <View style={{ width: '100%', maxWidth: 520, alignSelf: 'center' }}>
            <ObgynCalculators onBack={() => setShowObgynPage(false)} />
          </View>
        ) : showCriticalPage ? (
          <CriticalCareCalculators onBack={() => setShowCriticalPage(false)} />
        ) : showCardiologyPage ? (
          <CardiologyCalculators onBack={() => setShowCardiologyPage(false)} />
        ) : showPaedsPage ? (
          <PaedsToolsPage tools={calcCategories.find(c => c.key === 'paediatrics')?.tools || []} onBack={() => setShowPaedsPage(false)} />
        ) : showHaematologyPage ? (
          <HaematologyToolsPage tools={calcCategories.find(c => c.key === 'haematology')?.tools || []} onBack={() => setShowHaematologyPage(false)} />
        ) : null}
        {/* Placeholder for other categories */}
        {!showGeneralPage && !showCriticalPage && !showCardiologyPage && !showObgynPage && !showPaedsPage && !showHaematologyPage && selectedCalcCategory !== 'general' && selectedCalcCategory !== 'critical' && selectedCalcCategory !== 'cardiology' && selectedCalcCategory !== 'obgyn' && selectedCalcCategory !== 'paediatrics' && selectedCalcCategory !== 'haematology' && (
          <View style={styles.widgetPlaceholder}>
            {calcCategories.find(c => c.key === selectedCalcCategory)?.icon}
            <Text style={styles.widgetPlaceholderText}>
              {calcCategories.find(c => c.key === selectedCalcCategory)?.label} calculators coming soon.
            </Text>
          </View>
        )}
        </>
      )}

      {/* Imaging Widget */}
      {selectedWidget === 'imaging' && (
        <View style={[styles.toolDetailBox, { maxWidth: 480, width: '100%' }]}>
          <Text style={[styles.toolDetailTitle, { color: isDark ? '#90caf9' : '#1976d2' }]}>Imaging</Text>
          <Text style={{ color: '#888', fontSize: 13, marginTop: 8 }}>
            Open the imaging viewer to load and inspect DICOM files. Use the viewer to pan, zoom and review image series.
          </Text>
          <TouchableOpacity style={[styles.calcButton, { marginTop: 18 }]} onPress={() => navigation.navigate('DicomViewer' as any)}>
            <Text style={styles.calcButtonText}>Open Imaging Viewer</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Reference Widget Content */}
      {selectedWidget === 'reference' && (
        <>
          {!selectedReference ? (
            <View style={styles.referenceWidgetRow}>
              {referenceWidgets.map(ref => (
                <TouchableOpacity
                  key={ref.key}
                  style={styles.referenceWidgetButton}
                  onPress={() => setSelectedReference(ref.key as any)}
                >
                  {ref.icon}
                  <Text style={styles.referenceWidgetLabel}>{ref.label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          ) : null}

          {/* Reference sub-widget content */}
          {selectedReference === 'labvalues' && (
            <>
              {!selectedLabSection ? (
                <View style={styles.labSectionRow}>
                  {labSections.map(section => (
                    <TouchableOpacity
                      key={section.key}
                      style={styles.labSectionButton}
                      onPress={() => setSelectedLabSection(section.key as any)}
                    >
                      <Text style={styles.labSectionLabel}>{section.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              ) : null}

              {/* Blood lab values table */}
              {selectedLabSection === 'blood' && (
                <BloodLabGroupsTable onBack={() => setSelectedLabSection(null)} />
              )}
              {selectedLabSection === 'haematologic' && (
                <HaematologicLabGroupsTable onBack={() => setSelectedLabSection(null)} />
              )}
              {selectedLabSection === 'csf' && (
                <CSFLabGroupsTable onBack={() => setSelectedLabSection(null)} />
              )}
              {selectedLabSection === 'sweaturine' && (
                <SweatUrineLabGroupsTable onBack={() => setSelectedLabSection(null)} />
              )}
              {/* Back to Reference main */}
              {selectedLabSection && (
                <TouchableOpacity style={styles.referenceBackButton} onPress={() => { setSelectedLabSection(null); }}>
                  <Ionicons name="arrow-back" size={20} color="#1976d2" />
                  <Text style={styles.referenceBackText}>Back to Lab Values</Text>
                </TouchableOpacity>
              )}
              {!selectedLabSection && (
                <TouchableOpacity style={styles.referenceBackButton} onPress={() => setSelectedReference(null)}>
                  <Ionicons name="arrow-back" size={20} color="#1976d2" />
                  <Text style={styles.referenceBackText}>Back to Reference</Text>
                </TouchableOpacity>
              )}
            </>
          )}
          {selectedReference === 'drugs' && (
            <View style={{ flex: 1 }}>
              <DrugReferenceScreen />
              <TouchableOpacity style={styles.referenceBackButton} onPress={() => setSelectedReference(null)}>
                <Ionicons name="arrow-back" size={20} color="#1976d2" />
                <Text style={styles.referenceBackText}>Back to Reference</Text>
              </TouchableOpacity>
            </View>
          )}
        </>
      )}
      {selectedWidget === 'clip' && (
        <View style={{ width: '100%', paddingVertical: 8 }}>
          {(() => {
            // lazy require to avoid top-level imports
            const ClipComp = require('../../components/clip/Clip').default;
            const ClipForm = require('../../components/clip/ClipForm').default;
            const ClipDetail = require('../../components/clip/ClipDetail').default;

            // small navigation-like object
            const fakeNav = {
              navigate: (name: string, params?: any) => {
                setClipRouteName(name as any);
                setClipRouteParams(params || null);
              },
              goBack: () => {
                setClipRouteName('Clip');
                setClipRefresh(prev => prev + 1); // Trigger reload
              },
              addListener: (event: string, callback: any) => {
                // Trigger 'focus' callback immediately
                if (event === 'focus') {
                  callback();
                }
                // Return unsubscribe function
                return () => {};
              }
            } as any;

            if (clipRouteName === 'Clip') {
              return <ClipComp navigation={fakeNav} refreshTrigger={clipRefresh} />;
            }
            if (clipRouteName === 'ClipForm') {
              return <ClipForm navigation={fakeNav} route={{ params: clipRouteParams }} />;
            }
            return <ClipDetail navigation={fakeNav} route={{ params: clipRouteParams }} />;
          })()}
        </View>
      )}
      {selectedWidget === 'guidelines' && (
        <View style={{ width: '100%', alignItems: 'center', paddingVertical: 24 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 24, marginBottom: 18, color: isDark ? '#90caf9' : '#1976d2' }}>Clinical Guidelines</Text>
          {typeof selectedGuideline === 'string' ? (
            <>
              {selectedGuideline === 'paediatrics' && (
                <>
                  <PaedsProtocol />
                  <TouchableOpacity style={{ marginTop: 24, backgroundColor: isDark ? '#23272e' : '#e3f2fd', borderRadius: 8, padding: 12, alignItems: 'center' }} onPress={() => setSelectedGuideline(null)}>
                    <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>Back to Guidelines</Text>
                  </TouchableOpacity>
                </>
              )}
              {selectedGuideline === 'emergency' && (
                <>
                  {/* EmergencyGuidelines component for Emergency protocols */}
                  {(() => {
                    const EmergencyGuidelines = require('../guidelines/EmergencyGuidelines').default;
                    return <EmergencyGuidelines />;
                  })()}
                  <TouchableOpacity style={{ marginTop: 24, backgroundColor: isDark ? '#23272e' : '#e3f2fd', borderRadius: 8, padding: 12, alignItems: 'center' }} onPress={() => setSelectedGuideline(null)}>
                    <Text style={{ color: '#1976d2', fontWeight: 'bold' }}>Back to Guidelines</Text>
                  </TouchableOpacity>
                </>
              )}
              {/* Add similar blocks for other guidelines as you modularize them */}
            </>
          ) : (
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
              {[
                { key: 'paediatrics', label: 'Paediatrics Protocol 5th Edition 2022 (Children 5 yrs or less)' },
                { key: 'surgical', label: 'Surgical' },
                { key: 'obsgynae', label: 'Obs/Gynae' },
                { key: 'internal', label: 'Internal Medicine' },
                { key: 'emergency', label: 'Emergency' },
              ].map(widget => (
                <TouchableOpacity
                  key={widget.key}
                  style={{ width: 220, margin: 8, backgroundColor: isDark ? '#23272e' : '#f7faff', borderRadius: 12, padding: 20, alignItems: 'center', borderWidth: 1, borderColor: '#90caf9' }}
                  onPress={() => setSelectedGuideline(widget.key)}
                >
                  <Text style={{ fontWeight: 'bold', fontSize: 18, color: isDark ? '#90caf9' : '#1976d2', marginBottom: 8 }}>{widget.label}</Text>
                  <Text style={{ color: isDark ? '#bbb' : '#555', fontSize: 15 }}>Tap to open</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}
      {selectedWidget === 'favorites' && (
        <View style={styles.widgetPlaceholder}>
          <Ionicons name="star-outline" size={48} color="#90caf9" />
          <Text style={styles.widgetPlaceholderText}>Favorites will appear here.</Text>
        </View>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    // backgroundColor is set dynamically inline for dark mode
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1976d2',
    marginBottom: 18,
    marginTop: 12,
  },
  searchInput: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#fff',
  },
  noResults: {
    color: '#888',
    fontSize: 16,
    marginTop: 24,
    textAlign: 'center',
  },
  toolCard: {
    flexDirection: 'row',
    alignItems: 'center',
    // backgroundColor and shadowColor set inline for dark mode
    borderRadius: 10,
    padding: 18,
    marginBottom: 16,
    width: 320,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  toolName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1976d2',
  },
  toolDesc: {
    fontSize: 14,
    color: '#333',
    marginTop: 2,
  },
  toolDetailBox: {
    // backgroundColor set inline for theme
    borderRadius: 12,
    padding: 24,
    marginTop: 24,
    width: '100%',
    maxWidth: 420,
    alignSelf: 'center',
    alignItems: 'center',
    shadowColor: '#1976d2',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
    // No borderColor or borderWidth
  },
  toolDetailTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    // color set inline for theme
    marginBottom: 18,
    marginTop: 8,
  },
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f7faff',
    marginBottom: 12,
  },
  calcButton: {
    backgroundColor: '#1976d2',
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 32,
    marginTop: 8,
  },
  calcButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  bmiResultBox: {
    marginTop: 16,
    padding: 16,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: 'center',
    minWidth: 200,
    maxWidth: '100%',
    marginBottom: 8,
    // backgroundColor and borderColor set inline for theme
  },
  bmiResultText: {
    fontSize: 18,
    fontWeight: 'bold',
    // color set inline for theme
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  backText: {
    color: '#1976d2',
    fontSize: 16,
    marginLeft: 4,
  },
  widgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
    marginTop: 8,
    width: '100%',
    gap: 4,
  },
  widgetButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 6,
    borderRadius: 10,
    backgroundColor: '#e3f2fd',
    marginHorizontal: 1,
    minHeight: 44,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  widgetButtonActive: {
    backgroundColor: '#1976d2',
  },
  widgetButtonLabel: {
    marginTop: 4,
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 13,
  },
  widgetButtonLabelActive: {
    color: '#fff',
  },
  widgetPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 48,
    width: '100%',
  },
  widgetPlaceholderText: {
    color: '#90caf9',
    fontSize: 18,
    marginTop: 12,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  referenceWidgetRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 24,
    width: '100%',
    gap: 12,
  },
  referenceWidgetButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: '#e3f2fd',
    marginHorizontal: 4,
  },
  referenceWidgetLabel: {
    marginTop: 6,
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  referenceBackButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 28,
    alignSelf: 'center',
    padding: 8,
  },
  referenceBackText: {
    color: '#1976d2',
    fontSize: 15,
    marginLeft: 6,
    fontWeight: 'bold',
  },
  labSectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 18,
    marginTop: 24,
    width: '100%',
    gap: 12,
  },
  labSectionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    backgroundColor: '#e3f2fd',
    marginHorizontal: 4,
  },
  labSectionLabel: {
    color: '#1976d2',
    fontWeight: 'bold',
    fontSize: 15,
    textAlign: 'center',
  },
  labTableSearch: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#90caf9',
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  labTableHeaderRow: {
    flexDirection: 'row',
    backgroundColor: '#e3f2fd',
    borderRadius: 6,
    paddingVertical: 6,
    paddingHorizontal: 4,
    alignItems: 'center',
  },
  labTableHeader: {
    fontWeight: 'bold',
    color: '#1976d2',
    fontSize: 15,
    textAlign: 'left',
  },
  labTableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderColor: '#e3f2fd',
  },
  labTableCell: {
    fontSize: 14,
    color: '#222',
    paddingRight: 6,
  },
});

// Lab values subsections (top-level, outside the component)
const labSections = [
  { key: 'blood', label: 'Blood' },
  { key: 'haematologic', label: 'Haematologic' },
  { key: 'csf', label: 'Cerebrospinal' },
  { key: 'sweaturine', label: 'Sweat/Urine' },
];

// Blood lab value groups and data
const bloodLabGroups = [
  {
    key: 'bloodplasmaserum',
    label: 'Blood, Plasma, Serum',
    values: [
      { name: 'Alanine aminotransferase (ALT)', ref: '8–20 U/L', si: '8–20 U/L' },
      { name: 'Amylase, serum', ref: '25–125 U/L', si: '25–125 U/L' },
      { name: 'Aspartate aminotransferase (AST)', ref: '8–20 U/L', si: '8–20 U/L' },
      { name: 'Bilirubin, serum (adult) Total', ref: '0.1–1.0 mg/dL', si: '2–17 µmol/L' },
      { name: 'Bilirubin, serum (adult) Direct', ref: '0.0–0.3 mg/dL', si: '0–5 µmol/L' },
      { name: 'Calcium, serum (Ca2+)', ref: '8.4–10.2 mg/dL', si: '2.1–2.8 mmol/L' },
      { name: 'Cholesterol, serum', ref: 'Rec: <200 mg/dL', si: 'Rec: <5.2 mmol/L' },
      { name: 'Cortisol, serum 0800 h', ref: '5–23 µg/dL', si: '138–635 nmol/L' },
      { name: 'Cortisol, serum 1600 h', ref: '3–15 µg/dL', si: '82–413 nmol/L' },
      { name: 'Cortisol, serum 2000 h', ref: '≤ 50% of 0800 h', si: 'Fraction of 0800 h: ≤ 0.50' },
      { name: 'Creatine kinase, serum (Male)', ref: '25–90 U/L', si: '25–90 U/L' },
      { name: 'Creatine kinase, serum (Female)', ref: '10–70 U/L', si: '10–70 U/L' },
      { name: 'Creatinine, serum', ref: '0.6–1.2 mg/dL', si: '53–106 µmol/L' },
      { name: 'Ferritin, serum (Male)', ref: '15–200 ng/mL', si: '15–200 µg/L' },
      { name: 'Ferritin, serum (Female)', ref: '12–150 ng/mL', si: '12–150 µg/L' },
      { name: 'Follicle-stimulating hormone, serum/plasma (Male)', ref: '4–25 mIU/mL', si: '4–25 U/L' },
      { name: 'Follicle-stimulating hormone, serum/plasma (Female, premenopause)', ref: '4–30 mIU/mL', si: '4–30 U/L' },
      { name: 'Follicle-stimulating hormone, serum/plsma (midcycle peak)', ref: '10–90 mIU/mL', si: '10–90 U/L' },
      { name: 'Follicle-stimulating hormone, serum/plasma (postmenopause)', ref: '40–250 mIU/mL', si: '40–250 U/L' },
      { name: 'Lactate dehydrogenase, serum', ref: '45–90 U/L', si: '45–90 U/L' },
      { name: 'Luteinizing hormone, serum/plasma (Male)', ref: '6–23 mIU/mL', si: '6–23 U/L' },
      { name: 'Luteinizing hormone, serum/plasma (Female, follicular phase)', ref: '5–30 mIU/mL', si: '5–30 U/L' },
      { name: 'Luteinizing hormone, serum/plasma (midcycle)', ref: '75–150 mIU/mL', si: '75–150 U/L' },
      { name: 'Luteinizing hormone, serum/plasma (postmenopause)', ref: '30–200 mIU/mL', si: '30–200 U/L' },
      { name: 'Osmolality, serum', ref: '275–295 mOsmol/kg H2O', si: '275–295 mOsmol/kg H2O' },
      { name: 'Parathyroid hormone, serum, N-terminal', ref: '14-65 pg/mL', si: '230–630 ng/L' },
      { name: 'Phosphatase (alkaline), serum (p-NPP at 30°C)', ref: '20–70 U/L', si: '20–70 U/L' },
      { name: 'Phosphorus (inorganic), serum', ref: '3.0–4.5 mg/dL', si: '1.0–1.5 mmol/L' },
      { name: 'Prolactin, serum (hPRL)', ref: '< 20 ng/mL', si: '< 20 µg/L' },
      { name: 'Thyroid-stimulating hormone, serum or plasma', ref: '0.5–5.0 µU/mL', si: '0.5–5.0 mU/L' },
      { name: 'Thyroidal iodine (123I) uptake', ref: '8%–30% of administered dose/24 h', si: '0.08–0.30/24 h' },
      { name: 'Thyroxine (T4), serum', ref: '5–12 µg/dL', si: '64–155 nmol/L' },
      { name: 'Triglycerides, serum', ref: '35–160 mg/dL', si: '0.4–1.81 mmol/L' },
      { name: 'Triiodothyronine (T3), serum (RIA)', ref: '115–190 ng/dL', si: '1.8–2.9 nmol/L' },
      { name: 'Triiodothyronine (T3) resin uptake', ref: '25%–35%', si: '0.25–0.35' },
      { name: 'Urea nitrogen, serum', ref: '7–18 mg/dL', si: '1.2–3.0 mmol/L' },
      { name: 'Uric acid, serum', ref: '3.0–8.2 mg/dL', si: '0.18–0.48 mmol/L' },
    ],
  },
  {
    key: 'electrolytes',
    label: 'Electrolytes, serum',
    values: [
      { name: 'Sodium (Na+)', ref: '136–145 mEq/L', si: '136–145 mmol/L' },
      { name: 'Chloride (Cl−)', ref: '95–105 mEq/L', si: '95–105 mmol/L' },
      { name: 'Potassium (K+)', ref: '3.5–5.0 mEq/L', si: '3.5–5.0 mmol/L' },
      { name: 'Bicarbonate (HCO3−)', ref: '22–28 mEq/L', si: '22–28 mmol/L' },
      { name: 'Magnesium (Mg2+)', ref: '1.5–2.0 mEq/L', si: '0.75–1.0 mmol/L' },
    ],
  },
  {
    key: 'estriol',
    label: 'Estriol, total, serum (in pregnancy)',
    values: [
      { name: '24–28 wks', ref: '30–170 ng/mL', si: '104–590 nmol/L' },
      { name: '28–32 wks', ref: '40–220 ng/mL', si: '140–760 nmol/L' },
      { name: '32–36 wks', ref: '60–280 ng/mL', si: '208–970 nmol/L' },
      { name: '36–40 wks', ref: '80–350 ng/mL', si: '280–1210 nmol/L' },
    ],
  },
  {
    key: 'gases',
    label: 'Gases, arterial blood (room air)',
    values: [
      { name: 'pH', ref: '7.35–7.45', si: '[H+] 36–44 nmol/L' },
      { name: 'Pco2', ref: '33–45 mm Hg', si: '4.4–5.9 kPa' },
      { name: 'Po2', ref: '75–105 mm Hg', si: '10.0–14.0 kPa' },
    ],
  },
  {
    key: 'immunoglobulins',
    label: 'Immunoglobulins, serum',
    values: [
      { name: 'IgA', ref: '76–390 mg/dL', si: '0.76–3.90 g/L' },
      { name: 'IgE', ref: '0–380 IU/mL', si: '0–380 kIU/L' },
      { name: 'IgG', ref: '650–1500 mg/dL', si: '6.5–15 g/L' },
      { name: 'IgM', ref: '40–345 mg/dL', si: '0.4–3.45 g/L' },
    ],
  },
  {
    key: 'proteins',
    label: 'Proteins, serum',
    values: [
      { name: 'Total (recumbent)', ref: '6.0–7.8 g/dL', si: '60–78 g/L' },
      { name: 'Albumin', ref: '3.5–5.5 g/dL', si: '35–55 g/L' },
      { name: 'Globulin', ref: '2.3–3.5 g/dL', si: '23–35 g/L' },
    ],
  },
];

// Add haematologicLabGroups for the haematologic section
const haematologicLabGroups = [
  {
    key: 'general',
    label: 'General Hematologic',
    values: [
      { name: 'Bleeding time (template)', ref: '2–7 minutes', si: '2–7 minutes' },
      { name: 'Erythrocyte count (Male)', ref: '4.3–5.9 million/mm³', si: '4.3–5.9 x 10¹²/L' },
      { name: 'Erythrocyte count (Female)', ref: '3.5–5.5 million/mm³', si: '3.5–5.5 x 10¹²/L' },
      { name: 'Erythrocyte sedimentation rate (Westergren, Male)', ref: '0–15 mm/h', si: '0–15 mm/h' },
      { name: 'Erythrocyte sedimentation rate (Westergren, Female)', ref: '0–20 mm/h', si: '0–20 mm/h' },
      { name: 'Hematocrit (Male)', ref: '41%–53%', si: '0.41–0.53' },
      { name: 'Hematocrit (Female)', ref: '36%–46%', si: '0.36–0.46' },
      { name: 'Hemoglobin A1c', ref: '≤ 6%', si: '≤ 0.06%' },
      { name: 'Hemoglobin, blood (Male)', ref: '13.5–17.5 g/dL', si: '2.09–2.71 mmol/L' },
      { name: 'Hemoglobin, blood (Female)', ref: '12.0–16.0 g/dL', si: '1.86–2.48 mmol/L' },
      { name: 'Hemoglobin, plasma', ref: '1–4 mg/dL', si: '0.16–0.62 mmol/L' },
    ],
  },
  {
    key: 'leukocytes',
    label: 'Leukocyte Count and Differential',
    values: [
      { name: 'Leukocyte count', ref: '4500–11,000/mm³', si: '4.5–11.0 x 10⁹/L' },
      { name: 'Segmented neutrophils', ref: '54%–62%', si: '0.54–0.62' },
      { name: 'Bands', ref: '3%–5%', si: '0.03–0.05' },
      { name: 'Eosinophils', ref: '1%–3%', si: '0.01–0.03' },
      { name: 'Basophils', ref: '0%–0.75%', si: '0–0.0075' },
      { name: 'Lymphocytes', ref: '25%–33%', si: '0.25–0.33' },
      { name: 'Monocytes', ref: '3%–7%', si: '0.03–0.07' },
    ],
  },
  {
    key: 'redcellindices',
    label: 'Red Cell Indices',
    values: [
      { name: 'Mean corpuscular hemoglobin', ref: '25.4–34.6 pg/cell', si: '0.39–0.54 fmol/cell' },
      { name: 'Mean corpuscular hemoglobin concentration', ref: '31%–36% Hb/cell', si: '4.81–5.58 mmol Hb/L' },
      { name: 'Mean corpuscular volume', ref: '80–100 µm³', si: '80–100 fL' },
      { name: 'Reticulocyte count', ref: '0.5%–1.5% of red cells', si: '0.005–0.015' },
    ],
  },
  {
    key: 'coagulation',
    label: 'Coagulation',
    values: [
      { name: 'Partial thromboplastin time (activated)', ref: '25–40 seconds', si: '25–40 seconds' },
      { name: 'Prothrombin time', ref: '11–15 seconds', si: '11–15 seconds' },
      { name: 'Thrombin time', ref: '< 2 seconds deviation from control', si: '< 2 seconds deviation from control' },
      { name: 'Platelet count', ref: '150,000–400,000/mm³', si: '150–400 x 10⁹/L' },
    ],
  },
  {
    key: 'volume',
    label: 'Volume',
    values: [
      { name: 'Plasma (Male)', ref: '25–43 mL/kg', si: '0.025–0.043 L/kg' },
      { name: 'Plasma (Female)', ref: '28–45 mL/kg', si: '0.028–0.045 L/kg' },
      { name: 'Red cell (Male)', ref: '20–36 mL/kg', si: '0.020–0.036 L/kg' },
      { name: 'Red cell (Female)', ref: '19–31 mL/kg', si: '0.019–0.031 L/kg' },
    ],
  },
];

// CSF lab value groups and data
const csfLabGroups = [
  {
    key: 'general',
    label: 'General CSF',
    values: [
      { name: 'Opening pressure', ref: '70–180 mm H₂O', si: '70–180 mm H₂O' },
      { name: 'Appearance', ref: 'Clear', si: 'Clear' },
      { name: 'Color', ref: 'Colorless', si: 'Colorless' },
      { name: 'Clarity', ref: 'Clear', si: 'Clear' },
      { name: 'Odor', ref: 'None', si: 'None' },
      { name: 'Glucose', ref: '40–70 mg/dL', si: '2.2–3.9 mmol/L' },
      { name: 'Protein', ref: '15–45 mg/dL', si: '0.15–0.45 g/L' },
      { name: 'Lactate', ref: '≤ 2.1 mmol/L', si: '≤ 2.1 mmol/L' },
      { name: 'Chloride', ref: '118–132 mmol/L', si: '118–132 mmol/L' },
    ],
  },
];

// Sweat/Urine lab value groups and data
const sweatUrineLabGroups = [
  {
    key: 'sweat',
    label: 'Sweat',
    values: [
      { name: 'Sodium (sweat)', ref: '10–50 mmol/L', si: '10–50 mmol/L' },
      { name: 'Chloride (sweat)', ref: '10–35 mmol/L', si: '10–35 mmol/L' },
      { name: 'Potassium (sweat)', ref: '3–10 mmol/L', si: '3–10 mmol/L' },
    ],
  },
  {
    key: 'urine',
    label: 'Urine',
    values: [
      { name: 'pH (urine)', ref: '4.6–8.0', si: '4.6–8.0' },
      { name: 'Specific gravity', ref: '1.005–1.030', si: '1.005–1.030' },
      { name: 'Sodium (urine)', ref: '40–220 mmol/L', si: '40–220 mmol/L' },
      { name: 'Potassium (urine)', ref: '25–125 mmol/L', si: '25–125 mmol/L' },
      { name: 'Chloride (urine)', ref: '110–250 mmol/L', si: '110–250 mmol/L' },
      { name: 'Creatinine (urine)', ref: '500–2000 mg/dL', si: '4.4–17.6 mmol/L' },
    ],
  },
];

// CSFLabGroupsTable component
function CSFLabGroupsTable({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const filteredGroups = csfLabGroups
    .map(group => ({
      ...group,
      values: group.values.filter(
        v =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.ref.toLowerCase().includes(search.toLowerCase()) ||
          v.si.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(group => group.values.length > 0);

  const headerBg = isDark ? '#23272e' : '#e3f2fd';
  const headerText = isDark ? '#90caf9' : '#1976d2';
  const rowEven = isDark ? '#23272e' : '#f7faff';
  const rowOdd = isDark ? '#181a20' : '#fff';
  const cellText = isDark ? '#fff' : '#222';
  const borderColor = isDark ? '#333a45' : '#e3f2fd';
  const searchBg = isDark ? '#23272e' : '#fff';
  const searchText = isDark ? '#fff' : '#111';
  const placeholderText = isDark ? '#aaa' : '#888';
  const groupLabel = isDark ? '#90caf9' : '#1976d2';
  const noResults = isDark ? '#aaa' : '#888';

  return (
    <View style={{ width: '100%', marginTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity style={styles.referenceBackButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={headerText} />
          <Text style={[styles.referenceBackText, { color: headerText }]}>Back to Lab Values</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1 }} />
      </View>
      <TextInput
        style={[
          styles.labTableSearch,
          { backgroundColor: searchBg, color: searchText, borderColor: headerBg }
        ]}
        placeholder="Search CSF lab values..."
        placeholderTextColor={placeholderText}
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView>
        {filteredGroups.length === 0 ? (
          <Text style={{ color: noResults, textAlign: 'center', marginTop: 24 }}>No results found.</Text>
        ) : (
          filteredGroups.map(group => (
            <View key={group.key} style={{ marginBottom: 18 }}>
              <Text style={{ fontWeight: 'bold', color: groupLabel, fontSize: 16, marginBottom: 4 }}>
                {group.label}
              </Text>
              <View style={[
                styles.labTableHeaderRow,
                { backgroundColor: headerBg, borderRadius: 6 }
              ]}>
                <Text style={[styles.labTableHeader, { flex: 2, color: headerText }]}>Test</Text>
                <Text style={[styles.labTableHeader, { flex: 1, color: headerText }]}>Reference</Text>
                <Text style={[styles.labTableHeader, { flex: 1, color: headerText }]}>SI</Text>
              </View>
              <View style={{ borderBottomWidth: 1, borderColor, marginBottom: 4 }} />
              {group.values.map((v, i) => (
                <View
                  key={i}
                  style={[
                    styles.labTableRow,
                    { backgroundColor: i % 2 === 0 ? rowEven : rowOdd, borderColor }
                  ]}
                >
                  <Text style={[styles.labTableCell, { flex: 2, color: cellText }]}>{v.name}</Text>
                  <Text style={[styles.labTableCell, { flex: 1, color: cellText }]}>{v.ref}</Text>
                  <Text style={[styles.labTableCell, { flex: 1, color: cellText }]}>{v.si}</Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Replace BloodLabTable with BloodLabGroupsTable
function BloodLabGroupsTable({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const filteredGroups = bloodLabGroups
    .map(group => ({
      ...group,
      values: group.values.filter(
        v =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.ref.toLowerCase().includes(search.toLowerCase()) ||
          v.si.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(group => group.values.length > 0);

  const headerBg = isDark ? '#23272e' : '#e3f2fd';
  const headerText = isDark ? '#90caf9' : '#1976d2';
  const rowEven = isDark ? '#23272e' : '#f7faff';
  const rowOdd = isDark ? '#181a20' : '#fff';
  const cellText = isDark ? '#fff' : '#222';
  const borderColor = isDark ? '#333a45' : '#e3f2fd';
  const searchBg = isDark ? '#23272e' : '#fff';
  const searchText = isDark ? '#fff' : '#111';
  const placeholderText = isDark ? '#aaa' : '#888';
  const groupLabel = isDark ? '#90caf9' : '#1976d2';
  const noResults = isDark ? '#aaa' : '#888';

  return (
    <View style={{ width: '100%', marginTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity style={styles.referenceBackButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={headerText} />
          <Text style={[styles.referenceBackText, { color: headerText }]}>Back to Lab Values</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1 }} />
      </View>
      <TextInput
        style={[
          styles.labTableSearch,
          { backgroundColor: searchBg, color: searchText, borderColor: headerBg }
        ]}
        placeholder="Search blood lab values..."
        placeholderTextColor={placeholderText}
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView>
        {filteredGroups.length === 0 ? (
          <Text style={{ color: noResults, textAlign: 'center', marginTop: 24 }}>No results found.</Text>
        ) : (
          filteredGroups.map(group => (
            <View key={group.key} style={{ marginBottom: 18 }}>
              <Text style={{ fontWeight: 'bold', color: groupLabel, fontSize: 16, marginBottom: 4 }}>
                {group.label}
              </Text>
              <View style={[
                styles.labTableHeaderRow,
                { backgroundColor: headerBg, borderRadius: 6 }
              ]}>
                <Text style={[styles.labTableHeader, { flex: 2, color: headerText }]}>Test</Text>
                <Text style={[styles.labTableHeader, { flex: 1, color: headerText }]}>Reference</Text>
                <Text style={[styles.labTableHeader, { flex: 1, color: headerText }]}>SI</Text>
              </View>
              <View style={{ borderBottomWidth: 1, borderColor, marginBottom: 4 }} />
              {group.values.map((v, i) => (
                <View
                  key={i}
                  style={[
                    styles.labTableRow,
                  ]}
                >
                  <Text style={[styles.labTableCell, { flex: 2, color: cellText }]}>{v.name}</Text>
                  <Text style={[styles.labTableCell, { flex: 1, color: cellText }]}>{v.ref}</Text>
                  <Text style={[styles.labTableCell, { flex: 1, color: cellText }]}>{v.si}</Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// SweatUrineLabGroupsTable component
function SweatUrineLabGroupsTable({ onBack }: { onBack: () => void }) {
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const [search, setSearch] = useState('');
  const filteredGroups = sweatUrineLabGroups
    .map(group => ({
      ...group,
      values: group.values.filter(
        v =>
          v.name.toLowerCase().includes(search.toLowerCase()) ||
          v.ref.toLowerCase().includes(search.toLowerCase()) ||
          v.si.toLowerCase().includes(search.toLowerCase())
      ),
    }))
    .filter(group => group.values.length > 0);

  const headerBg = isDark ? '#23272e' : '#e3f2fd';
  const headerText = isDark ? '#90caf9' : '#1976d2';
  const rowEven = isDark ? '#23272e' : '#f7faff';
  const rowOdd = isDark ? '#181a20' : '#fff';
  const cellText = isDark ? '#fff' : '#222';
  const borderColor = isDark ? '#333a45' : '#e3f2fd';
  const searchBg = isDark ? '#23272e' : '#fff';
  const searchText = isDark ? '#fff' : '#111';
  const placeholderText = isDark ? '#aaa' : '#888';
  const groupLabel = isDark ? '#90caf9' : '#1976d2';
  const noResults = isDark ? '#aaa' : '#888';

  return (
   
    <View style={{ width: '100%', marginTop: 12 }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
        <TouchableOpacity style={styles.referenceBackButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={20} color={headerText} />
          <Text style={[styles.referenceBackText, { color: headerText }]}>Back to Lab Values</Text>
        </TouchableOpacity>
        <Text style={{ flex: 1 }} />
      </View>
      <TextInput
        style={[
          styles.labTableSearch,
          { backgroundColor: searchBg, color: searchText, borderColor: headerBg }
        ]}
        placeholder="Search sweat/urine lab values..."
        placeholderTextColor={placeholderText}
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView>
        {filteredGroups.length === 0 ? (
          <Text style={{ color: noResults, textAlign: 'center', marginTop: 24 }}>No results found.</Text>
        ) : (
          filteredGroups.map(group => (
            <View key={group.key} style={{ marginBottom: 18 }}>
              <Text style={{ fontWeight: 'bold', color: groupLabel, fontSize: 16, marginBottom: 4 }}>
                {group.label}
              </Text>
              <View style={[
                styles.labTableHeaderRow,
                { backgroundColor: headerBg, borderRadius: 6 }
              ]}>
                <Text style={[styles.labTableHeader, { flex: 2, color: headerText }]}>Test</Text>
                <Text style={[styles.labTableHeader, { flex: 1, color: headerText }]}>Reference</Text>
                <Text style={[styles.labTableHeader, { flex: 1, color: headerText }]}>SI</Text>
              </View>
              <View style={{ borderBottomWidth: 1, borderColor, marginBottom: 4 }} />
              {group.values.map((v, i) => (
                <View
                  key={i}
                  style={[
                    styles.labTableRow,
                    { backgroundColor: i % 2 === 0 ? rowEven : rowOdd, borderColor }
                  ]}
                >
                  <Text style={[styles.labTableCell, { flex: 2, color: cellText }]}>{v.name}</Text>
                  <Text style={[styles.labTableCell, { flex: 1, color: cellText }]}>{v.ref}</Text>
                  <Text style={[styles.labTableCell, { flex: 1, color: cellText }]}>{v.si}</Text>
                </View>
              ))}
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}
