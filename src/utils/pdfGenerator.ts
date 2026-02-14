import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate a PDF from the rendered calendar pages.
 * Each page element is captured as a canvas and added to the PDF.
 */
export async function generatePdf(
    pageElements: HTMLElement[],
    onProgress?: (current: number, total: number) => void
): Promise<void> {
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const a4Width = 210;
    const a4Height = 297;

    for (let i = 0; i < pageElements.length; i++) {
        if (i > 0) {
            pdf.addPage();
        }

        onProgress?.(i + 1, pageElements.length);

        const canvas = await html2canvas(pageElements[i], {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.95);
        pdf.addImage(imgData, 'JPEG', 0, 0, a4Width, a4Height);
    }

    pdf.save('calendar.pdf');
}
