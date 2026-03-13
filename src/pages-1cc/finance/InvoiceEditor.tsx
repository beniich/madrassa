import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { DashboardLayout } from '@/components/DashboardLayout';
import { useFinanceStore, Invoice } from '@/stores/useFinanceStore';
import { Button } from '@/components/ui-1cc/button';
import { Input } from '@/components/ui-1cc/input';
import { Card, CardContent } from '@/components/ui-1cc/card';
import { Separator } from '@/components/ui-1cc/separator';
import { Textarea } from '@/components/ui-1cc/textarea';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui-1cc/form';
import { CalendarIcon, Plus, Trash2, Save, Printer, Palette, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui-1cc/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui-1cc/popover';
import { SignaturePad } from '@/components/ui-1cc/SignaturePad';
import { Label } from '@/components/ui-1cc/label';

// Schema Validation
const invoiceSchema = z.object({
    patientName: z.string().min(2, "Nom du patient requis"),
    date: z.date(),
    dueDate: z.date(),
    items: z.array(z.object({
        description: z.string().min(1, "Description requise"),
        quantity: z.coerce.number().min(0.01, "Min 0.01"),
        unitPrice: z.coerce.number().min(0, "Prix positif requis"),
    })).min(1, "Au moins une ligne requise"),
    notes: z.string().optional(),
    design: z.object({
        companyName: z.string().optional(),
        companyAddress: z.string().optional(),
        primaryColor: z.string().optional(),
        logo: z.string().optional(),
    }).optional(),
    signature: z.string().nullable().optional(),
});

type InvoiceFormValues = z.infer<typeof invoiceSchema>;

export const InvoiceEditor = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { invoices, addInvoice, updateInvoice } = useFinanceStore();

    // Find existing invoice or setup new
    const existingInvoice = id !== 'new' ? invoices.find(inv => inv.id === id) : null;

    const form = useForm<InvoiceFormValues>({
        resolver: zodResolver(invoiceSchema),
        defaultValues: existingInvoice ? {
            patientName: existingInvoice.patientName,
            date: new Date(existingInvoice.date),
            dueDate: new Date(existingInvoice.dueDate),
            items: existingInvoice.items,
            notes: existingInvoice.notes,
            design: existingInvoice.design || {
                companyName: "Cloud Industrie Hôpital",
                companyAddress: "123 Avenue de la Santé\n75000 Paris, France\nSIRET: 123 456 789 00012",
                primaryColor: "#0f172a", // Default slate-900
            },
            signature: existingInvoice.signature || null
        } : {
            patientName: "",
            date: new Date(),
            dueDate: new Date(),
            items: [{ description: "Consultation", quantity: 1, unitPrice: 50 }],
            notes: "",
            design: {
                companyName: "Cloud Industrie Hôpital",
                companyAddress: "123 Avenue de la Santé\n75000 Paris, France\nSIRET: 123 456 789 00012",
                primaryColor: "#0f172a",
            },
            signature: null
        }
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: "items"
    });

    // Real-time calculation and style
    const watchItems = form.watch("items");
    const watchPrimaryColor = form.watch("design.primaryColor") || "#0f172a";

    const totals = watchItems.reduce((acc, item) => {
        const lineTotal = (Number(item.quantity) || 0) * (Number(item.unitPrice) || 0);
        return {
            subtotal: acc.subtotal + lineTotal,
            tax: acc.tax + (lineTotal * 0.20)
        };
    }, { subtotal: 0, tax: 0 });

    const onSubmit = (data: InvoiceFormValues) => {
        const invoiceData = {
            patientId: existingInvoice?.patientId || 'pat-new',
            patientName: data.patientName,
            date: data.date.toISOString(),
            dueDate: data.dueDate.toISOString(),
            status: existingInvoice?.status || 'draft' as const,
            items: data.items.map((item, idx) => ({
                id: existingInvoice?.items[idx]?.id || `item-${Date.now()}-${idx}`,
                description: item.description,
                quantity: item.quantity,
                unitPrice: item.unitPrice,
                total: item.quantity * item.unitPrice
            })),
            subtotal: totals.subtotal,
            taxRate: 0.2,
            taxAmount: totals.tax,
            total: totals.subtotal + totals.tax,
            notes: data.notes,
            design: data.design,
            signature: data.signature
        };

        if (existingInvoice) {
            updateInvoice(existingInvoice.id, invoiceData);
        } else {
            addInvoice(invoiceData);
        }
        navigate('/finance/invoices');
    };

    return (
        <DashboardLayout>
            <div className="max-w-5xl mx-auto space-y-6 pb-12">
                <Form {...form}>
                    <div className="flex items-center justify-between sticky top-0 z-10 bg-background/80 backdrop-blur-sm py-4 border-b">
                        <div>
                            <h1 className="text-2xl font-bold tracking-tight">
                                {id === 'new' ? 'Nouvelle Facture' : `Facture ${existingInvoice?.number}`}
                            </h1>
                        </div>
                        <div className="flex gap-2">
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant="outline">
                                        <Palette className="w-4 h-4 mr-2" /> Style
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-80">
                                    <div className="space-y-4">
                                        <h4 className="font-medium">Personnalisation</h4>
                                        <div className="space-y-2">
                                            <Label>Couleur Principale</Label>
                                            <div className="flex gap-2">
                                                {['#0f172a', '#2563eb', '#dc2626', '#16a34a', '#d97706'].map(color => (
                                                    <div
                                                        key={color}
                                                        className={cn("w-8 h-8 rounded-full cursor-pointer border-2", watchPrimaryColor === color ? "border-black" : "border-transparent")}
                                                        style={{ backgroundColor: color }}
                                                        onClick={() => form.setValue('design.primaryColor', color)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </PopoverContent>
                            </Popover>
                            <Button variant="outline" onClick={() => window.print()}>
                                <Printer className="w-4 h-4 mr-2" /> Imprimer
                            </Button>
                            <Button onClick={form.handleSubmit(onSubmit)}>
                                <Save className="w-4 h-4 mr-2" /> Enregistrer
                            </Button>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-[1fr] gap-8">
                        {/* Invoice Preview / Editor */}
                        <div className="bg-white dark:bg-[#191919] min-h-[1000px] shadow-lg border rounded-lg p-12" id="invoice-preview">

                            {/* Header Section */}
                            <div className="flex justify-between mb-12">
                                <div className="space-y-2 w-1/2">
                                    <div
                                        className="w-16 h-16 rounded-lg flex items-center justify-center mb-4 text-white font-bold text-2xl"
                                        style={{ backgroundColor: watchPrimaryColor }}
                                    >
                                        CI
                                    </div>

                                    <FormField
                                        control={form.control}
                                        name="design.companyName"
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                className="text-xl font-bold border-none px-0 h-auto focus-visible:ring-0 rounded-none bg-transparent placeholder:text-muted-foreground/50"
                                                placeholder="Votre Nom d'Entreprise"
                                            />
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="design.companyAddress"
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                className="text-sm text-muted-foreground border-none px-0 min-h-[80px] focus-visible:ring-0 resize-none bg-transparent placeholder:text-muted-foreground/50"
                                                placeholder="Adresse de l'entreprise..."
                                            />
                                        )}
                                    />
                                </div>
                                <div className="text-right">
                                    <h3
                                        className="text-4xl font-light mb-2"
                                        style={{ color: watchPrimaryColor }}
                                    >
                                        FACTURE
                                    </h3>
                                    <div className="text-sm text-muted-foreground">
                                        <p className="font-medium">N°: {existingInvoice?.number || "Brouillon"}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Client & Dates */}
                            <div className="grid grid-cols-2 gap-12 mb-12">
                                <div className="space-y-4">
                                    <h4 className="font-semibold text-xs uppercase tracking-wider text-muted-foreground">Facturé à</h4>
                                    <FormField
                                        control={form.control}
                                        name="patientName"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormControl>
                                                    <Input placeholder="Nom du client" {...field} className="font-medium text-lg border-x-0 border-t-0 rounded-none px-0 focus-visible:ring-0 bg-transparent" />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <Input placeholder="Adresse du client (Optionnel)" className="text-sm border-x-0 border-t-0 rounded-none px-0 focus-visible:ring-0 bg-transparent" />
                                </div>
                                <div className="space-y-4 text-right">
                                    <div className="space-y-2">
                                        <div className="flex justify-end gap-4 items-center">
                                            <span className="text-sm text-muted-foreground">Date d'émission :</span>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn("w-[140px] pl-3 text-left font-normal border-none shadow-none hover:bg-muted/50", !form.watch("date") && "text-muted-foreground")}>
                                                        {form.watch("date") ? format(form.watch("date"), "P") : <span>Date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="end">
                                                    <Calendar mode="single" selected={form.watch("date")} onSelect={(date) => date && form.setValue("date", date)} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                        <div className="flex justify-end gap-4 items-center">
                                            <span className="text-sm text-muted-foreground">Date d'échéance :</span>
                                            <Popover>
                                                <PopoverTrigger asChild>
                                                    <Button variant={"outline"} className={cn("w-[140px] pl-3 text-left font-normal border-none shadow-none hover:bg-muted/50", !form.watch("dueDate") && "text-muted-foreground")}>
                                                        {form.watch("dueDate") ? format(form.watch("dueDate"), "P") : <span>Date</span>}
                                                    </Button>
                                                </PopoverTrigger>
                                                <PopoverContent className="w-auto p-0" align="end">
                                                    <Calendar mode="single" selected={form.watch("dueDate")} onSelect={(date) => date && form.setValue("dueDate", date)} initialFocus />
                                                </PopoverContent>
                                            </Popover>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Items Table Header */}
                            <div
                                className="grid grid-cols-12 gap-4 py-3 px-4 rounded-t-lg mb-4 text-white font-medium text-sm"
                                style={{ backgroundColor: watchPrimaryColor }}
                            >
                                <div className="col-span-6">Description</div>
                                <div className="col-span-2 text-right">Quantité</div>
                                <div className="col-span-2 text-right">Prix Unitaire</div>
                                <div className="col-span-2 text-right">Total</div>
                            </div>

                            {/* Items Rows */}
                            <div className="space-y-2 mb-8">
                                {fields.map((field, index) => (
                                    <div key={field.id} className="grid grid-cols-12 gap-4 items-center group py-2 px-4 hover:bg-muted/30 rounded-lg transition-colors">
                                        <div className="col-span-6">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.description`}
                                                render={({ field }) => (
                                                    <Input {...field} placeholder="Description de l'acte" className="border-none bg-transparent shadow-none px-0 focus-visible:ring-0" />
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.quantity`}
                                                render={({ field }) => (
                                                    <Input type="number" {...field} className="text-right border-none bg-transparent shadow-none px-0 focus-visible:ring-0" />
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-2">
                                            <FormField
                                                control={form.control}
                                                name={`items.${index}.unitPrice`}
                                                render={({ field }) => (
                                                    <Input type="number" {...field} className="text-right border-none bg-transparent shadow-none px-0 focus-visible:ring-0" />
                                                )}
                                            />
                                        </div>
                                        <div className="col-span-2 flex items-center justify-end gap-2">
                                            <span className="font-medium">
                                                {((form.watch(`items.${index}.quantity`) || 0) * (form.watch(`items.${index}.unitPrice`) || 0)).toFixed(2)}€
                                            </span>
                                            <Button type="button" variant="ghost" size="icon" onClick={() => remove(index)} className="opacity-0 group-hover:opacity-100 text-red-500 h-8 w-8 transition-opacity">
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}

                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => append({ description: "", quantity: 1, unitPrice: 0 })}
                                    className="mt-2 text-muted-foreground hover:text-foreground"
                                >
                                    <Plus className="w-4 h-4 mr-2" /> Ajouter une ligne
                                </Button>
                            </div>

                            <Separator className="mb-8" />

                            {/* Totals Section */}
                            <div className="flex justify-end mb-16">
                                <div className="w-1/3 space-y-3">
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>Sous-total</span>
                                        <span>{totals.subtotal.toFixed(2)}€</span>
                                    </div>
                                    <div className="flex justify-between text-muted-foreground">
                                        <span>TVA (20%)</span>
                                        <span>{totals.tax.toFixed(2)}€</span>
                                    </div>
                                    <Separator />
                                    <div
                                        className="flex justify-between font-bold text-xl pt-2"
                                        style={{ color: watchPrimaryColor }}
                                    >
                                        <span>Total TTC</span>
                                        <span>{(totals.subtotal + totals.tax).toFixed(2)}€</span>
                                    </div>
                                </div>
                            </div>

                            {/* Signature Section */}
                            <div className="grid grid-cols-2 gap-12 mb-12">
                                <div>
                                    <h4 className="font-semibold text-sm mb-4">Notes & Conditions</h4>
                                    <FormField
                                        control={form.control}
                                        name="notes"
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                placeholder="Conditions de paiement, merci, etc."
                                                className="bg-muted/20 border-0 resize-none min-h-[100px]"
                                            />
                                        )}
                                    />
                                </div>
                                <div>
                                    <h4 className="font-semibold text-sm mb-4">Signature</h4>
                                    <div className="border rounded-lg bg-white overflow-hidden relative group">
                                        <SignaturePad
                                            initialData={form.watch('signature')}
                                            onSave={(data) => form.setValue('signature', data)}
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="pt-8 border-t text-xs text-center text-muted-foreground">
                                <p>Merci pour votre confiance.</p>
                                <p>{form.watch('design.companyName')} - {form.watch('design.companyAddress')?.split('\n')[0]}</p>
                            </div>

                        </div>
                    </div>
                </Form>
            </div>
        </DashboardLayout>
    );
};
