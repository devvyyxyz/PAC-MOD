const TRANSLATIONS: Record<string, Record<string,string>> = {
  en: {
    settings_title: 'SETTINGS',
    settings_back: 'Back',
    settings_reset: 'Reset to defaults',
    settings_apply: 'Apply',
    settings_applied: 'Applied',
    settings_saved: 'Saved',
    send_crash: 'Send Crash Report',
    return_menu: 'Return To Menu',
    copy_details: 'Copy Details',
    coming_soon: 'Coming soon',
    setting_sound: 'Sound effects',
    setting_music: 'Music',
    setting_difficulty: 'Difficulty',
    setting_skin: 'Skin',
    setting_volume: 'Master Volume',
    setting_maxLives: 'Max Lives',
    setting_language: 'Language',
    error_title: 'Something went wrong',
    error_message: "We're sorry — the game encountered an error. You can send a crash report to the developer to help debug, or return to the main menu.",
    show_details: 'Show technical details',
    sending: 'Sending…',
    error_footer: 'If the issue persists, open an issue on the project repository with steps to reproduce.',
    menu_subtitle: 'A starter template for browser games built with React + TypeScript',
    start_game: 'Start Game',
    starting: 'Starting…',
    menu_settings: 'Settings',
    menu_credits: 'Credits',
    menu_simulate_error: 'Simulate Error',
    menu_footer: 'Press Enter or click to start',
    // Reporting feedback messages
    report_sent_title: 'Report sent',
    report_sent_message: 'Thanks — the report was submitted.',
    report_failed_title: 'Report failed',
    report_failed_message_prefix: 'Failed to send report: '
  },
  es: {
    settings_title: 'AJUSTES',
    settings_back: 'Volver',
    settings_reset: 'Restablecer',
    settings_apply: 'Aplicar',
    settings_applied: 'Aplicado',
    settings_saved: 'Guardado',
    send_crash: 'Enviar informe',
    return_menu: 'Volver al menú',
    copy_details: 'Copiar detalles',
    coming_soon: 'Próximamente',
    setting_sound: 'Efectos de sonido',
    setting_music: 'Música',
    setting_difficulty: 'Dificultad',
    setting_skin: 'Apariencia',
    setting_volume: 'Volumen maestro',
    setting_maxLives: 'Vidas máximas',
    setting_language: 'Idioma',
    error_title: 'Algo salió mal',
    error_message: 'Lo sentimos — el juego encontró un error. Puedes enviar un informe de fallos al desarrollador para ayudar a depurar, o volver al menú principal.',
    show_details: 'Mostrar detalles técnicos',
    sending: 'Enviando…',
    error_footer: 'Si el problema persiste, abre un issue en el repositorio del proyecto con pasos para reproducirlo.',
    menu_subtitle: 'Plantilla inicial para juegos en el navegador con React + TypeScript',
    start_game: 'Iniciar juego',
    starting: 'Iniciando…',
    menu_settings: 'Ajustes',
    menu_credits: 'Créditos',
    menu_simulate_error: 'Simular error',
    menu_footer: 'Pulsa Enter o haz clic para comenzar',
    // Reporting feedback messages
    report_sent_title: 'Informe enviado',
    report_sent_message: 'Gracias — el informe fue enviado.',
    report_failed_title: 'Error al enviar informe',
    report_failed_message_prefix: 'No se pudo enviar el informe: '
  },
  pl: {
    settings_title: 'USTAWIENIA',
    settings_back: 'Powrót',
    settings_reset: 'Przywróć domyślne',
    settings_apply: 'Zastosuj',
    settings_applied: 'Zastosowano',
    settings_saved: 'Zapisano',
    send_crash: 'Wyślij raport awarii',
    return_menu: 'Powrót do menu',
    copy_details: 'Kopiuj szczegóły',
    coming_soon: 'Wkrótce',
    setting_sound: 'Efekty dźwiękowe',
    setting_music: 'Muzyka',
    setting_difficulty: 'Trudność',
    setting_skin: 'Skórka',
    setting_volume: 'Głośność',
    setting_maxLives: 'Maksymalna liczba żyć',
    setting_language: 'Język',
    error_title: 'Coś poszło nie tak',
    error_message: 'Przepraszamy — gra napotkała błąd. Możesz wysłać raport awarii do dewelopera, aby pomóc w debugowaniu, lub wrócić do menu głównego.',
    show_details: 'Pokaż szczegóły techniczne',
    sending: 'Wysyłanie…',
    error_footer: 'Jeśli problem będzie się powtarzał, otwórz zgłoszenie w repozytorium projektu z instrukcjami reprodukcji.',
    menu_subtitle: 'Szablon startowy dla gier przeglądarkowych opartych na React + TypeScript',
    start_game: 'Rozpocznij grę',
    starting: 'Uruchamianie…',
    menu_settings: 'Ustawienia',
    menu_credits: 'Autorki i autorzy',
    menu_simulate_error: 'Zasymuluj błąd',
    menu_footer: 'Naciśnij Enter lub kliknij, aby rozpocząć',
    // Reporting feedback messages
    report_sent_title: 'Raport wysłany',
    report_sent_message: 'Dzięki — raport został wysłany.',
    report_failed_title: 'Wysyłanie nie powiodło się',
    report_failed_message_prefix: 'Nie udało się wysłać raportu: '
  }
};

// small subtitle for settings page
TRANSLATIONS.en.settings_subtitle = 'Configure gameplay, audio and appearance';
TRANSLATIONS.es.settings_subtitle = 'Configura jugabilidad, audio y apariencia';
TRANSLATIONS.pl.settings_subtitle = 'Konfiguruj rozgrywkę, dźwięk i wygląd';

// Additional keys for setup, gameplay, credits and language names
TRANSLATIONS.en.setup_title = 'Prepare your run';
TRANSLATIONS.en.choose_skin = 'Choose skin';
TRANSLATIONS.en.difficulty = 'Difficulty';
TRANSLATIONS.en.diff_easy = 'Easy';
TRANSLATIONS.en.diff_normal = 'Normal';
TRANSLATIONS.en.diff_hard = 'Hard';
TRANSLATIONS.en.audio = 'Audio';
TRANSLATIONS.en.sound = 'Sound';
TRANSLATIONS.en.music = 'Music';
TRANSLATIONS.en.summary = 'Summary';
TRANSLATIONS.en.summary_skin = 'Skin';
TRANSLATIONS.en.summary_difficulty = 'Difficulty';
TRANSLATIONS.en.summary_sound_on = 'On';
TRANSLATIONS.en.summary_sound_off = 'Off';
TRANSLATIONS.en.summary_music_on = 'On';
TRANSLATIONS.en.summary_music_off = 'Off';
TRANSLATIONS.en.play = 'Play';
TRANSLATIONS.en.back = 'Back';

TRANSLATIONS.es.setup_title = 'Prepara tu partida';
TRANSLATIONS.es.choose_skin = 'Elige aspecto';
TRANSLATIONS.es.difficulty = 'Dificultad';
TRANSLATIONS.es.diff_easy = 'Fácil';
TRANSLATIONS.es.diff_normal = 'Normal';
TRANSLATIONS.es.diff_hard = 'Difícil';
TRANSLATIONS.es.audio = 'Audio';
TRANSLATIONS.es.sound = 'Sonido';
TRANSLATIONS.es.music = 'Música';
TRANSLATIONS.es.summary = 'Resumen';
TRANSLATIONS.es.summary_skin = 'Aspecto';
TRANSLATIONS.es.summary_difficulty = 'Dificultad';
TRANSLATIONS.es.summary_sound_on = 'Activado';
TRANSLATIONS.es.summary_sound_off = 'Desactivado';
TRANSLATIONS.es.summary_music_on = 'Activada';
TRANSLATIONS.es.summary_music_off = 'Desactivada';
TRANSLATIONS.es.play = 'Jugar';
TRANSLATIONS.es.back = 'Volver';

TRANSLATIONS.pl.setup_title = 'Przygotuj rozgrywkę';
TRANSLATIONS.pl.choose_skin = 'Wybierz skórkę';
TRANSLATIONS.pl.difficulty = 'Trudność';
TRANSLATIONS.pl.diff_easy = 'Łatwy';
TRANSLATIONS.pl.diff_normal = 'Normalny';
TRANSLATIONS.pl.diff_hard = 'Trudny';
TRANSLATIONS.pl.audio = 'Audio';
TRANSLATIONS.pl.sound = 'Dźwięk';
TRANSLATIONS.pl.music = 'Muzyka';
TRANSLATIONS.pl.summary = 'Podsumowanie';
TRANSLATIONS.pl.summary_skin = 'Skórka';
TRANSLATIONS.pl.summary_difficulty = 'Trudność';
TRANSLATIONS.pl.summary_sound_on = 'Włączone';
TRANSLATIONS.pl.summary_sound_off = 'Wyłączone';
TRANSLATIONS.pl.summary_music_on = 'Włączona';
TRANSLATIONS.pl.summary_music_off = 'Wyłączona';
TRANSLATIONS.pl.play = 'Graj';
TRANSLATIONS.pl.back = 'Powrót';

// skin names
TRANSLATIONS.en.skin_classic = 'Classic';
TRANSLATIONS.en.skin_neon = 'Neon';
TRANSLATIONS.en.skin_ghost = 'Ghost';

TRANSLATIONS.es.skin_classic = 'Clásico';
TRANSLATIONS.es.skin_neon = 'Neón';
TRANSLATIONS.es.skin_ghost = 'Fantasma';

TRANSLATIONS.pl.skin_classic = 'Klasyczna';
TRANSLATIONS.pl.skin_neon = 'Neon';
TRANSLATIONS.pl.skin_ghost = 'Duch';

TRANSLATIONS.en.game_ready = 'Ready — game will mount below';
TRANSLATIONS.en.exit = 'Exit';
TRANSLATIONS.es.game_ready = 'Listo — el juego se montará abajo';
TRANSLATIONS.es.exit = 'Salir';
TRANSLATIONS.pl.game_ready = 'Gotowe — gra zostanie uruchomiona poniżej';
TRANSLATIONS.pl.exit = 'Wyjdź';

TRANSLATIONS.en.credits_title = 'Credits';
TRANSLATIONS.en.credits_subtitle = 'Thanks and acknowledgements';
TRANSLATIONS.en.visit = 'Visit →';
TRANSLATIONS.en.credits_footer = 'Thanks for playing — report bugs via the project repository.';
TRANSLATIONS.es.credits_title = 'Créditos';
TRANSLATIONS.es.credits_subtitle = 'Agradecimientos';
TRANSLATIONS.es.visit = 'Visitar →';
TRANSLATIONS.es.credits_footer = 'Gracias por jugar — reporta errores vía el repositorio del proyecto.';
TRANSLATIONS.pl.credits_title = 'Autorzy';
TRANSLATIONS.pl.credits_subtitle = 'Podziękowania i uznania';
TRANSLATIONS.pl.visit = 'Odwiedź →';
TRANSLATIONS.pl.credits_footer = 'Dzięki za granie — zgłaszaj błędy przez repozytorium projektu.';

TRANSLATIONS.en.lang_en = 'English';
TRANSLATIONS.en.lang_es = 'Español';
TRANSLATIONS.en.lang_pl = 'Polski';
TRANSLATIONS.es.lang_en = 'Inglés';
TRANSLATIONS.es.lang_es = 'Español';
TRANSLATIONS.es.lang_pl = 'Polaco';
TRANSLATIONS.pl.lang_en = 'Angielski';
TRANSLATIONS.pl.lang_es = 'Hiszpański';
TRANSLATIONS.pl.lang_pl = 'Polski';


let LOCALE = 'en';

export function t(key: string){
  return TRANSLATIONS[LOCALE]?.[key] ?? key;
}

export function setLocale(loc: string){ LOCALE = loc; }

export default { t, setLocale };

export function getLocale(){ return LOCALE; }
export { TRANSLATIONS };
