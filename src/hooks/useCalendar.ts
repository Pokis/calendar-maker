import { useState, useRef, useCallback } from 'react';
import type { Language, CalendarProject } from '../types';
import { fileToBase64, saveProject, loadProject } from '../utils/fileHelpers';

export function useCalendar() {
    const [year, setYear] = useState(2026);
    const [language, setLanguage] = useState<Language>('lt');
    const [monthImages, setMonthImages] = useState<Record<number, string>>({});
    const [isGenerating, setIsGenerating] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const setImage = useCallback(async (monthIndex: number, file: File) => {
        const base64 = await fileToBase64(file);
        setMonthImages((prev) => ({ ...prev, [monthIndex]: base64 }));
    }, []);

    const removeImage = useCallback((monthIndex: number) => {
        setMonthImages((prev) => {
            const next = { ...prev };
            delete next[monthIndex];
            return next;
        });
    }, []);

    const save = useCallback(() => {
        const project: CalendarProject = { year, language, monthImages };
        saveProject(project);
    }, [year, language, monthImages]);

    const load = useCallback(async (file: File) => {
        const project = await loadProject(file);
        setYear(project.year);
        setLanguage(project.language);
        setMonthImages(project.monthImages || {});
    }, []);

    return {
        year,
        setYear,
        language,
        setLanguage,
        monthImages,
        setImage,
        removeImage,
        isGenerating,
        setIsGenerating,
        save,
        load,
        fileInputRef,
    };
}
