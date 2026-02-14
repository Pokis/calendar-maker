import { useMemo, useCallback } from 'react';
import { useCalendar } from './hooks/useCalendar';
import { getYearData } from './utils/calendarUtils';
import { generatePdf } from './utils/pdfGenerator';
import { Controls } from './components/Controls';
import { PrintPage } from './components/PrintPage';
import { t } from './translations';

function App() {
  const {
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
  } = useCalendar();

  const trans = t(language);
  const monthsData = useMemo(() => getYearData(year, language), [year, language]);

  // Split 12 months into pages of 4
  const pages = useMemo(() => {
    const result = [];
    for (let i = 0; i < monthsData.length; i += 4) {
      result.push(monthsData.slice(i, i + 4));
    }
    return result;
  }, [monthsData]);

  const handleExportPdf = useCallback(async () => {
    setIsGenerating(true);
    try {
      // Small delay to let UI update
      await new Promise((r) => setTimeout(r, 100));
      const pageElements = pages.map(
        (_, i) => document.getElementById(`print-page-${i}`) as HTMLElement
      ).filter(Boolean);
      await generatePdf(pageElements, monthImages);
    } catch (err) {
      console.error('PDF generation failed:', err);
    } finally {
      setIsGenerating(false);
    }
  }, [pages, setIsGenerating, monthImages]);

  return (
    <div className="app">
      <Controls
        year={year}
        language={language}
        isGenerating={isGenerating}
        onYearChange={setYear}
        onLanguageChange={setLanguage}
        onExportPdf={handleExportPdf}
        onSave={save}
        onLoad={load}
      />

      <main className="pages-container">
        {pages.map((pageMonths, pageIndex) => (
          <div key={pageIndex} className="page-wrapper">
            <div className="page-label">
              {trans.ui.page} {pageIndex + 1} {trans.ui.of} {pages.length}
            </div>
            <PrintPage
              months={pageMonths}
              language={language}
              images={monthImages}
              onImageSet={setImage}
              onImageRemove={removeImage}
              pageIndex={pageIndex}
            />
          </div>
        ))}
      </main>
    </div>
  );
}

export default App;
