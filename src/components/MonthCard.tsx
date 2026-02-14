import { useRef, useCallback } from 'react';
import { ImagePlus, X } from 'lucide-react';
import type { Language, MonthData } from '../types';
import { CalendarGrid } from './CalendarGrid';
import { t } from '../translations';

interface MonthCardProps {
    data: MonthData;
    language: Language;
    image?: string;
    onImageSet: (monthIndex: number, file: File) => void;
    onImageRemove: (monthIndex: number) => void;
    isPrintMode?: boolean;
}

export function MonthCard({
    data,
    language,
    image,
    onImageSet,
    onImageRemove,
    isPrintMode = false,
}: MonthCardProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const trans = t(language);

    const handleDrop = useCallback(
        (e: React.DragEvent) => {
            e.preventDefault();
            const file = e.dataTransfer.files[0];
            if (file && file.type.startsWith('image/')) {
                onImageSet(data.monthIndex, file);
            }
        },
        [data.monthIndex, onImageSet]
    );

    const handleFileChange = useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            const file = e.target.files?.[0];
            if (file) {
                onImageSet(data.monthIndex, file);
                e.target.value = '';
            }
        },
        [data.monthIndex, onImageSet]
    );

    return (
        <div className="month-card">
            {/* Photo area */}
            <div
                className={`photo-area ${image ? 'has-image' : ''}`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={handleDrop}
                onClick={() => !isPrintMode && fileInputRef.current?.click()}
            >
                {image ? (
                    <>
                        <div
                            className="month-photo"
                            style={{
                                backgroundImage: `url(${image})`,
                            }}
                            role="img"
                            aria-label={data.name}
                        />
                        {!isPrintMode && (
                            <button
                                className="remove-photo-btn"
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onImageRemove(data.monthIndex);
                                }}
                                title={trans.ui.removePhoto}
                            >
                                <X size={14} />
                            </button>
                        )}
                    </>
                ) : (
                    !isPrintMode && (
                        <div className="photo-placeholder">
                            <ImagePlus size={24} />
                            <span>{trans.ui.dragOrClick}</span>
                        </div>
                    )
                )}
                {!isPrintMode && (
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden-input"
                    />
                )}
            </div>

            {/* Calendar grid */}
            <CalendarGrid data={data} />
        </div>
    );
}
