/* =========================================================
   Configuration du site — à personnaliser
   ========================================================= */

/* ---- Supabase --------------------------------------------
   1. Ouvrez votre projet Supabase
   2. Menu de gauche : Settings (⚙️) → API
   3. Recopiez les deux valeurs ci-dessous

   ⚠️ Ne JAMAIS utiliser la clé "service_role" ici.
      Seule la clé "anon / public" est conçue pour le navigateur.
   ---------------------------------------------------------- */
window.SITE_CONFIG = {
  supabase: {
    url: 'https://lpitleusqajllppzvhqn.supabase.co',
    anonKey: 'sb_publishable_BI7xA91xOM-AgBkTt66RBg_kOoSWgeb'
  },

  /* Langue par défaut si le navigateur n'en propose aucune */
  defaultLanguage: 'fr',

  /* Langues proposées dans le sélecteur */
  languages: [
    { code: 'fr', label: 'Français',  flag: '🇫🇷', dir: 'ltr' },
    { code: 'en', label: 'English',   flag: '🇬🇧', dir: 'ltr' },
    { code: 'ar', label: 'العربية',   flag: '🇩🇿', dir: 'rtl' }
  ]
};
