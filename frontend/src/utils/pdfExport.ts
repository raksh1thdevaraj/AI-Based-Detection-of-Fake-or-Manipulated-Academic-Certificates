export interface ExportPdfOptions {
  filename?: string;
  onStart?: () => void;
  onSuccess?: () => void;
  onError?: (err: Error) => void;
}

/**
 * Capture an authoritative certificate DOM node and compile into a standard A4 portrait 300DPI PDF.
 * Supports multi-page dossiers by detecting `.pdf-dossier-page` child elements.
 * Uses dynamic imports for html2canvas and jsPDF to prevent bundling heavy PDF libraries on initial page load.
 */
export async function exportCertificateElementToPdf(
  element: HTMLElement,
  options?: ExportPdfOptions
): Promise<void> {
  const filename =
    options?.filename || 'CertiShield_AI_Forensic_Verification_Audit_Dossier.pdf';

  try {
    options?.onStart?.();

    const [html2canvasModule, jspdfModule] = await Promise.all([
      import('html2canvas'),
      import('jspdf'),
    ]);
    const html2canvas = html2canvasModule.default;
    const jsPDF = jspdfModule.default;

    // Look for multi-page containers
    const pageElements = Array.from(
      element.querySelectorAll<HTMLElement>('.pdf-dossier-page')
    );

    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4',
      compress: true,
    });

    const pageWidth = 210;
    const pageHeight = 297;

    if (pageElements.length > 0) {
      // Multi-page export: render each page sequentially
      for (let i = 0; i < pageElements.length; i++) {
        const pageEl = pageElements[i];
        if (i > 0) {
          pdf.addPage('a4', 'portrait');
        }

        const canvas = await html2canvas(pageEl, {
          scale: 2, // 2x device pixel ratio for 300 DPI print crispness
          useCORS: true,
          logging: false,
          backgroundColor: '#fafaf9',
          windowWidth: pageEl.scrollWidth,
          windowHeight: pageEl.scrollHeight,
        });

        const imgData = canvas.toDataURL('image/jpeg', 0.98);
        const imgWidth = pageWidth;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;

        if (imgHeight <= pageHeight) {
          pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
        } else {
          const scale = pageHeight / imgHeight;
          const fittedWidth = imgWidth * scale;
          const xOffset = (pageWidth - fittedWidth) / 2;
          pdf.addImage(imgData, 'JPEG', xOffset, 0, fittedWidth, pageHeight, undefined, 'FAST');
        }
      }
    } else {
      // Single element fallback
      const canvas = await html2canvas(element, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: '#fafaf9',
        windowWidth: element.scrollWidth,
        windowHeight: element.scrollHeight,
      });

      const imgData = canvas.toDataURL('image/jpeg', 0.98);
      const imgWidth = pageWidth;
      const imgHeight = (canvas.height * imgWidth) / canvas.width;

      if (imgHeight <= pageHeight) {
        pdf.addImage(imgData, 'JPEG', 0, 0, imgWidth, imgHeight, undefined, 'FAST');
      } else {
        const scale = pageHeight / imgHeight;
        const fittedWidth = imgWidth * scale;
        const xOffset = (pageWidth - fittedWidth) / 2;
        pdf.addImage(imgData, 'JPEG', xOffset, 0, fittedWidth, pageHeight, undefined, 'FAST');
      }
    }

    pdf.save(filename);
    options?.onSuccess?.();
  } catch (err: unknown) {
    const error = err instanceof Error ? err : new Error('Failed to generate audit certificate PDF');
    options?.onError?.(error);
    throw error;
  }
}
