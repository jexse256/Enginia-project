export interface AppTranslations {
  tagline: string;
  searchPlaceholder: string;
  gridTitle: string;
  featuredTitle: string;
  newArrivalsTitle: string;
  bestSellersTitle: string;
  homeNav: string;
  catNav: string;
  wishlistNav: string;
  notifNav: string;
  profileNav: string;
  emptyWishlist: string;
  stockIn: string;
  stockOut: string;
  priceTag: string;
}

export const TRANSLATIONS: Record<'EN' | 'FR' | 'SW', AppTranslations> = {
  EN: {
    tagline: 'Powering Your Electrical Solutions',
    searchPlaceholder: 'Search wires, MCBs, lighting, switches...',
    gridTitle: 'Accessory Categories Grid',
    featuredTitle: 'Featured Power Systems',
    newArrivalsTitle: 'New Enginia Hardware',
    bestSellersTitle: 'Top-Selling Electrical Items',
    homeNav: 'Home',
    catNav: 'Categories',
    wishlistNav: 'Wishlist',
    notifNav: 'Alerts',
    profileNav: 'Profile',
    emptyWishlist: 'Your electrical wishlist is empty.',
    stockIn: 'In Stock',
    stockOut: 'No stock',
    priceTag: 'Price'
  },
  FR: {
    tagline: 'Alimentation de Vos Solutions Électriques',
    searchPlaceholder: 'Articles câbles, disjoncteurs, éclairage...',
    gridTitle: 'Grille des Catégories d’Accessoires',
    featuredTitle: 'Systèmes d’Énergie Vedettes',
    newArrivalsTitle: 'Nouveau Matériel Enginia',
    bestSellersTitle: 'Articles Électriques les Mieux Vendus',
    homeNav: 'Accueil',
    catNav: 'Catégories',
    wishlistNav: 'Favoris',
    notifNav: 'Alertes',
    profileNav: 'Profil',
    emptyWishlist: 'Votre liste d’envies est vide.',
    stockIn: 'En Stock',
    stockOut: 'Pas de stock',
    priceTag: 'Prix'
  },
  SW: {
    tagline: 'Kuchochea Ufumbuzi Wako wa Umeme',
    searchPlaceholder: 'Tafuta nyaya, MCBs, taa, swichi...',
    gridTitle: 'Orodha ya Aina za Vifaa',
    featuredTitle: 'Mifumo ya Nguvu Iliyoangaziwa',
    newArrivalsTitle: 'Vifaa Vipya vya Enginia',
    bestSellersTitle: 'Bidhaa za Umeme Zinazouzwa Sana',
    homeNav: 'Mwanzo',
    catNav: 'Kategoria',
    wishlistNav: 'Vipendwa',
    notifNav: 'Arifa',
    profileNav: 'Wasifu',
    emptyWishlist: 'Orodha yako ya vifaa vya umeme ni tupu.',
    stockIn: 'Ipo Stock',
    stockOut: 'Hakuna stock',
    priceTag: 'Bei'
  }
};
