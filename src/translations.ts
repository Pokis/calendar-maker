import type { Language } from './types';

interface Translations {
    months: string[];
    daysShort: string[];
    ui: {
        title: string;
        year: string;
        language: string;
        exportPdf: string;
        saveProject: string;
        loadProject: string;
        addPhoto: string;
        removePhoto: string;
        page: string;
        of: string;
        clickToAddPhoto: string;
        dragOrClick: string;
        generating: string;
    };
}

const en: Translations = {
    months: [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December',
    ],
    daysShort: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    ui: {
        title: 'Calendar Maker',
        year: 'Year',
        language: 'Language',
        exportPdf: 'Export PDF',
        saveProject: 'Save Project',
        loadProject: 'Load Project',
        addPhoto: 'Add Photo',
        removePhoto: 'Remove',
        page: 'Page',
        of: 'of',
        clickToAddPhoto: 'Click to add photo',
        dragOrClick: 'Drag & drop or click to add photo',
        generating: 'Generating PDF...',
    },
};

const lt: Translations = {
    months: [
        'Sausis', 'Vasaris', 'Kovas', 'Balandis',
        'Gegužė', 'Birželis', 'Liepa', 'Rugpjūtis',
        'Rugsėjis', 'Spalis', 'Lapkritis', 'Gruodis',
    ],
    daysShort: ['Pr', 'An', 'Tr', 'Kt', 'Pn', 'Št', 'Sk'],
    ui: {
        title: 'Kalendoriaus Kūrėjas',
        year: 'Metai',
        language: 'Kalba',
        exportPdf: 'Eksportuoti PDF',
        saveProject: 'Išsaugoti projektą',
        loadProject: 'Įkelti projektą',
        addPhoto: 'Pridėti nuotrauką',
        removePhoto: 'Pašalinti',
        page: 'Puslapis',
        of: 'iš',
        clickToAddPhoto: 'Paspauskite, kad pridėtumėte nuotrauką',
        dragOrClick: 'Vilkite arba paspauskite, kad pridėtumėte nuotrauką',
        generating: 'Generuojamas PDF...',
    },
};

const translations: Record<Language, Translations> = { en, lt };

export function t(lang: Language) {
    return translations[lang];
}
