import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

/**
 * Generate a PDF from the rendered calendar pages.
 *
 * Strategy: html2canvas doesn't preserve image quality (it rasterizes
 * background-images at DOM pixel size). So we:
 *   1. Hide all photos temporarily
 *   2. Capture calendar text/grids with html2canvas
 *   3. Overlay each original high-res image directly via jsPDF.addImage
 *   4. Restore photos
 */
export async function generatePdf(
    pageElements: HTMLElement[],
    monthImages: Record<number, string>,
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

        const pageEl = pageElements[i];
        const pageRect = pageEl.getBoundingClientRect();

        // Collect photo elements and their positions BEFORE hiding them
        const photoEntries: {
            monthIndex: number;
            xMm: number;
            yMm: number;
            wMm: number;
            hMm: number;
            dataUrl: string;
        }[] = [];

        const photoEls = pageEl.querySelectorAll<HTMLElement>('.photo-area.has-image .month-photo');
        photoEls.forEach((photoEl) => {
            const rect = photoEl.getBoundingClientRect();
            // Find the month index from the parent month-card
            const monthCard = photoEl.closest('.month-card');
            if (!monthCard) return;

            // The month index is stored as a data attribute or we infer it from
            // the card's position in the page grid
            const allCards = pageEl.querySelectorAll('.month-card');
            let cardIndex = -1;
            allCards.forEach((card, idx) => {
                if (card === monthCard) cardIndex = idx;
            });
            if (cardIndex === -1) return;

            const monthIndex = i * 4 + cardIndex;
            const dataUrl = monthImages[monthIndex];
            if (!dataUrl) return;

            // Convert pixel position relative to page element → mm on A4
            const xMm = ((rect.left - pageRect.left) / pageRect.width) * a4Width;
            const yMm = ((rect.top - pageRect.top) / pageRect.height) * a4Height;
            const wMm = (rect.width / pageRect.width) * a4Width;
            const hMm = (rect.height / pageRect.height) * a4Height;

            photoEntries.push({ monthIndex, xMm, yMm, wMm, hMm, dataUrl });
        });

        // 1. Temporarily hide all photos so html2canvas doesn't render them blurry
        const savedStyles: { el: HTMLElement; bg: string }[] = [];
        photoEls.forEach((el) => {
            savedStyles.push({ el, bg: el.style.backgroundImage });
            el.style.backgroundImage = 'none';
        });

        // 2. Capture just the text/grids
        const canvas = await html2canvas(pageEl, {
            scale: 3,
            useCORS: true,
            allowTaint: true,
            backgroundColor: '#ffffff',
            logging: false,
        });

        const canvasData = canvas.toDataURL('image/png');
        pdf.addImage(canvasData, 'PNG', 0, 0, a4Width, a4Height, undefined, 'FAST');

        // 3. Overlay each original high-res image directly
        for (const entry of photoEntries) {
            try {
                // Load the image to get its natural dimensions for proper aspect ratio cropping
                const imgDims = await getImageDimensions(entry.dataUrl);
                const containerAspect = entry.wMm / entry.hMm;
                const imgAspect = imgDims.width / imgDims.height;

                // Replicate "background-size: cover; background-position: center"
                // by cropping the source image to match the container aspect ratio
                const croppedDataUrl = await cropImageToAspect(
                    entry.dataUrl,
                    imgDims.width,
                    imgDims.height,
                    containerAspect,
                    imgAspect
                );

                pdf.addImage(
                    croppedDataUrl,
                    'JPEG',
                    entry.xMm,
                    entry.yMm,
                    entry.wMm,
                    entry.hMm,
                    `photo-${entry.monthIndex}`,
                    'NONE'
                );
            } catch (err) {
                console.warn(`Failed to add image for month ${entry.monthIndex}:`, err);
            }
        }

        // 4. Restore photos
        savedStyles.forEach(({ el, bg }) => {
            el.style.backgroundImage = bg;
        });
    }

    pdf.save('calendar.pdf');
}

/**
 * Get the natural dimensions of an image from its data URL
 */
function getImageDimensions(dataUrl: string): Promise<{ width: number; height: number }> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve({ width: img.naturalWidth, height: img.naturalHeight });
        img.onerror = reject;
        img.src = dataUrl;
    });
}

/**
 * Crop an image to match a target aspect ratio (replicating CSS background-size: cover).
 * Returns a high-quality JPEG data URL.
 */
function cropImageToAspect(
    dataUrl: string,
    imgW: number,
    imgH: number,
    containerAspect: number,
    imgAspect: number
): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => {
            let sx = 0, sy = 0, sw = imgW, sh = imgH;

            if (imgAspect > containerAspect) {
                // Image is wider — crop sides
                sw = Math.round(imgH * containerAspect);
                sx = Math.round((imgW - sw) / 2);
            } else {
                // Image is taller — crop top/bottom
                sh = Math.round(imgW / containerAspect);
                sy = Math.round((imgH - sh) / 2);
            }

            const canvas = document.createElement('canvas');
            // Use cropped dimensions at original resolution for maximum quality
            canvas.width = sw;
            canvas.height = sh;
            const ctx = canvas.getContext('2d')!;
            ctx.drawImage(img, sx, sy, sw, sh, 0, 0, sw, sh);

            resolve(canvas.toDataURL('image/jpeg', 0.95));
        };
        img.onerror = reject;
        img.src = dataUrl;
    });
}
