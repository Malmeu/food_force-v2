// Liste des principales villes du Maroc
export const moroccanCities = [
  { city: 'Casablanca', region: 'Casablanca-Settat' },
  { city: 'Rabat', region: 'Rabat-Salé-Kénitra' },
  { city: 'Fès', region: 'Fès-Meknès' },
  { city: 'Marrakech', region: 'Marrakech-Safi' },
  { city: 'Tanger', region: 'Tanger-Tétouan-Al Hoceima' },
  { city: 'Meknès', region: 'Fès-Meknès' },
  { city: 'Oujda', region: "L'Oriental" },
  { city: 'Kénitra', region: 'Rabat-Salé-Kénitra' },
  { city: 'Agadir', region: 'Souss-Massa' },
  { city: 'Tétouan', region: 'Tanger-Tétouan-Al Hoceima' },
  { city: 'Salé', region: 'Rabat-Salé-Kénitra' },
  { city: 'Mohammedia', region: 'Casablanca-Settat' },
  { city: 'Khouribga', region: 'Béni Mellal-Khénifra' },
  { city: 'El Jadida', region: 'Casablanca-Settat' },
  { city: 'Béni Mellal', region: 'Béni Mellal-Khénifra' },
  { city: 'Nador', region: "L'Oriental" },
  { city: 'Settat', region: 'Casablanca-Settat' },
  { city: 'Taza', region: 'Fès-Meknès' },
  { city: 'Khémisset', region: 'Rabat-Salé-Kénitra' },
  { city: 'Taourirt', region: "L'Oriental" },
  { city: 'Berkane', region: "L'Oriental" },
  { city: 'Larache', region: 'Tanger-Tétouan-Al Hoceima' },
  { city: 'Ksar El Kébir', region: 'Tanger-Tétouan-Al Hoceima' },
  { city: 'Khénifra', region: 'Béni Mellal-Khénifra' },
  { city: 'Safi', region: 'Marrakech-Safi' },
  { city: 'Essaouira', region: 'Marrakech-Safi' },
  { city: 'Ouarzazate', region: 'Drâa-Tafilalet' },
  { city: 'Guelmim', region: 'Guelmim-Oued Noun' },
  { city: 'Laâyoune', region: 'Laâyoune-Sakia El Hamra' },
  { city: 'Dakhla', region: 'Dakhla-Oued Ed-Dahab' },
  { city: 'Chefchaouen', region: 'Tanger-Tétouan-Al Hoceima' },
  { city: 'Ifrane', region: 'Fès-Meknès' },
  { city: 'Errachidia', region: 'Drâa-Tafilalet' },
  { city: 'Taroudant', region: 'Souss-Massa' },
  { city: 'Ouezzane', region: 'Tanger-Tétouan-Al Hoceima' },
  { city: 'Sefrou', region: 'Fès-Meknès' },
  { city: 'Youssoufia', region: 'Marrakech-Safi' },
  { city: 'Tan-Tan', region: 'Guelmim-Oued Noun' },
  { city: 'Azrou', region: 'Fès-Meknès' },
  { city: 'Tiznit', region: 'Souss-Massa' },
  { city: 'Zagora', region: 'Drâa-Tafilalet' },
  { city: 'Tinghir', region: 'Drâa-Tafilalet' },
  { city: 'Midelt', region: 'Drâa-Tafilalet' },
  { city: 'Figuig', region: "L'Oriental" },
  { city: 'Guercif', region: "L'Oriental" },
  { city: 'Jerada', region: "L'Oriental" },
  { city: 'Témara', region: 'Rabat-Salé-Kénitra' },
  { city: 'Skhirate', region: 'Rabat-Salé-Kénitra' },
  { city: 'Berrechid', region: 'Casablanca-Settat' },
  { city: 'Taounate', region: 'Fès-Meknès' }
];

// Fonction pour obtenir la liste des villes
export const getCities = () => {
  return moroccanCities.map(item => item.city);
};

// Fonction pour obtenir la région d'une ville
export const getRegionForCity = (city) => {
  const cityData = moroccanCities.find(item => item.city === city);
  return cityData ? cityData.region : '';
};
