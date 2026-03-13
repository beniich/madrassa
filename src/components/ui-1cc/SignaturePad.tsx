import { useRef, useState, useEffect } from 'react';
import { Button } from '@/components/ui-1cc/button';
import { Eraser, Check } from 'lucide-react';

interface SignaturePadProps {
    onSave: (signatureDataUrl: string | null) => void;
    initialData?: string | null;
}

export const SignaturePad = ({ onSave, initialData }: SignaturePadProps) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [isDrawing, setIsDrawing] = useState(false);
    const [isEmpty, setIsEmpty] = useState(!initialData);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000000';

        if (initialData) {
            const img = new Image();
            img.src = initialData;
            img.onload = () => {
                ctx.drawImage(img, 0, 0);
            };
        }
    }, [initialData]);

    const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        setIsDrawing(true);
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.beginPath();
        ctx.moveTo(offsetX, offsetY);
    };

    const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
        if (!isDrawing) return;
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const { offsetX, offsetY } = getCoordinates(e, canvas);
        ctx.lineTo(offsetX, offsetY);
        ctx.stroke();
        setIsEmpty(false);
    };

    const stopDrawing = () => {
        if (!isDrawing) return;
        setIsDrawing(false);
        save();
    };

    const getCoordinates = (e: React.MouseEvent | React.TouchEvent, canvas: HTMLCanvasElement) => {
        let clientX, clientY;
        if ('touches' in e) {
            clientX = e.touches[0].clientX;
            clientY = e.touches[0].clientY;
        } else {
            clientX = (e as React.MouseEvent).clientX;
            clientY = (e as React.MouseEvent).clientY;
        }

        const rect = canvas.getBoundingClientRect();
        return {
            offsetX: clientX - rect.left,
            offsetY: clientY - rect.top
        };
    };

    const clear = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setIsEmpty(true);
        onSave(null);
    };

    const save = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        if (isEmpty) {
            onSave(null);
        } else {
            onSave(canvas.toDataURL());
        }
    };

    return (
        <div className="space-y-2">
            <div className="border-2 border-dashed border-gray-300 rounded-lg overflow-hidden touch-none bg-white">
                <canvas
                    ref={canvasRef}
                    width={400}
                    height={200}
                    className="w-full h-[200px] cursor-crosshair block"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                    onTouchStart={startDrawing}
                    onTouchMove={draw}
                    onTouchEnd={stopDrawing}
                />
            </div>
            <div className="flex justify-between text-sm text-muted-foreground">
                <span>Signez dans le cadre ci-dessus</span>
                <Button variant="ghost" size="sm" onClick={clear} type="button" className="text-red-500 hover:text-red-600 hover:bg-red-50">
                    <Eraser className="w-4 h-4 mr-2" /> Effacer
                </Button>
            </div>
        </div>
    );
};
