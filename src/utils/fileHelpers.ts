import type { CalendarProject } from '../types';

const FILE_VERSION = 1;

interface SaveFile {
    version: number;
    project: CalendarProject;
}

/**
 * Save the calendar project as a .calendar JSON file
 */
export function saveProject(project: CalendarProject): void {
    const data: SaveFile = {
        version: FILE_VERSION,
        project,
    };
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);

    const a = document.createElement('a');
    a.href = url;
    a.download = `calendar-${project.year}-${project.language}.calendar`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Load a calendar project from a .calendar JSON file
 */
export function loadProject(file: File): Promise<CalendarProject> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const data: SaveFile = JSON.parse(e.target?.result as string);
                if (!data.project || !data.project.year) {
                    throw new Error('Invalid file format');
                }
                resolve(data.project);
            } catch (err) {
                reject(err);
            }
        };
        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsText(file);
    });
}

/**
 * Convert a File/Blob to a base64 data URL
 */
export function fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error('Failed to read image'));
        reader.readAsDataURL(file);
    });
}
