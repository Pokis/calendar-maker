import type { Language, MonthData } from '../types';
import { MonthCard } from './MonthCard';

interface PrintPageProps {
    months: MonthData[];  // exactly 4 months
    language: Language;
    images: Record<number, string>;
    onImageSet: (monthIndex: number, file: File) => void;
    onImageRemove: (monthIndex: number) => void;
    pageIndex: number;
    isPrintMode?: boolean;
}

export function PrintPage({
    months,
    language,
    images,
    onImageSet,
    onImageRemove,
    pageIndex,
    isPrintMode = false,
}: PrintPageProps) {
    return (
        <div className="print-page" id={`print-page-${pageIndex}`}>
            <div className="page-grid">
                {months.map((monthData) => (
                    <MonthCard
                        key={monthData.monthIndex}
                        data={monthData}
                        language={language}
                        image={images[monthData.monthIndex]}
                        onImageSet={onImageSet}
                        onImageRemove={onImageRemove}
                        isPrintMode={isPrintMode}
                    />
                ))}
            </div>
        </div>
    );
}
