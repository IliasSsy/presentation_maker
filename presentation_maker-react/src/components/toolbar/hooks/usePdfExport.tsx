import { useCallback, useRef } from 'react';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import { createRoot } from 'react-dom/client';
import { flushSync } from 'react-dom';
import type { Presentation } from '../../../../../types/presentation.ts';
import { SlidePreview } from '../../SlidePreview/SlidePreview.tsx';

const usePdfExport = () => {
    const isExporting = useRef(false);
    const exportToPdf = useCallback(async (presentation: Presentation) => {
        if (isExporting.current || !presentation.slides.length) return;
        isExporting.current = true;
        const rootElement = document.createElement('div');
        document.body.appendChild(rootElement);
        const root = createRoot(rootElement);
        flushSync(() => {
            root.render(
                <>
                    {presentation.slides.map(slide => (
                        <div
                            className="slide-canvas"
                            key={slide.id}
                            style={{ width: 960, height: 540 }}
                        >
                            <SlidePreview
                                slide={slide}
                                selectedIds={[]}
                                onObjectClick={() => {}}
                                onBackgroundClick={() => {}}
                            />
                        </div>
                    ))}
                </>
            );
        });
        const images = Array.from(rootElement.querySelectorAll('img'));
        await Promise.all([
            document.fonts.ready,
            ...images.map(img => new Promise(resolve => {
                if (img.complete) return resolve(null);
                img.onload = resolve;
                img.onerror = resolve;
            })),
        ]);
        const pdf = new jsPDF('l', 'mm', 'a4');
        const slides = rootElement.querySelectorAll('.slide-canvas');
        for (let i = 0; i < slides.length; i++) {
            const canvas = await html2canvas(slides[i] as HTMLElement, {
                scale: 2,
                useCORS: true,
                logging: false,
            });
            if (i > 0) pdf.addPage();
            pdf.addImage(
                canvas.toDataURL('image/png'),
                'PNG',
                0,
                0,
                297,
                210
            );
        }
        root.unmount();
        rootElement.remove();
        isExporting.current = false;
        pdf.save(`${presentation.name}.pdf`);
    }, []);
    return { exportToPdf };
};
export default usePdfExport;