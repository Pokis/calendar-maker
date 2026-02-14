import { useRef } from 'react';
import { Download, Save, Upload, Calendar, Globe } from 'lucide-react';
import type { Language } from '../types';
import { t } from '../translations';

interface ControlsProps {
    year: number;
    language: Language;
    isGenerating: boolean;
    onYearChange: (year: number) => void;
    onLanguageChange: (lang: Language) => void;
    onExportPdf: () => void;
    onSave: () => void;
    onLoad: (file: File) => void;
}

export function Controls({
    year,
    language,
    isGenerating,
    onYearChange,
    onLanguageChange,
    onExportPdf,
    onSave,
    onLoad,
}: ControlsProps) {
    const loadInputRef = useRef<HTMLInputElement>(null);
    const trans = t(language);

    return (
        <header className="controls">
            <div className="controls-left">
                <div className="logo">
                    <Calendar size={28} />
                    <h1>{trans.ui.title}</h1>
                </div>
            </div>

            <div className="controls-center">
                <div className="control-group">
                    <label>{trans.ui.year}</label>
                    <input
                        type="number"
                        value={year}
                        min={2000}
                        max={2100}
                        onChange={(e) => onYearChange(parseInt(e.target.value, 10))}
                        className="year-input"
                    />
                </div>

                <div className="control-group">
                    <label>
                        <Globe size={14} />
                        {trans.ui.language}
                    </label>
                    <select
                        value={language}
                        onChange={(e) => onLanguageChange(e.target.value as Language)}
                        className="lang-select"
                    >
                        <option value="en">English</option>
                        <option value="lt">Lietuvių</option>
                    </select>
                </div>
            </div>

            <div className="controls-right">
                <button onClick={onSave} className="btn btn-secondary" title={trans.ui.saveProject}>
                    <Save size={16} />
                    <span>{trans.ui.saveProject}</span>
                </button>

                <button
                    onClick={() => loadInputRef.current?.click()}
                    className="btn btn-secondary"
                    title={trans.ui.loadProject}
                >
                    <Upload size={16} />
                    <span>{trans.ui.loadProject}</span>
                </button>
                <input
                    ref={loadInputRef}
                    type="file"
                    accept=".calendar"
                    onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                            onLoad(file);
                            e.target.value = '';
                        }
                    }}
                    className="hidden-input"
                />

                <button
                    onClick={onExportPdf}
                    className="btn btn-primary"
                    disabled={isGenerating}
                    title={trans.ui.exportPdf}
                >
                    <Download size={16} />
                    <span>{isGenerating ? trans.ui.generating : trans.ui.exportPdf}</span>
                </button>
            </div>
        </header>
    );
}
