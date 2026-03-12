'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { createNewsletterSubscriber } from '@/data/newsletterSubscribers/createNewsletterSubscriber';
import { newsLetterFormSchema } from '@/schemas/newsLetterSchemas/newsLetterFormSchema';

export default function NewsletterModal({ landingId }: { landingId: string }) {
  const [isClient, setIsClient] = useState(false);
  const [open, setOpen] = useState(false);
  const { toast } = useToast();

  const form = useForm<z.infer<typeof newsLetterFormSchema>>({
    resolver: zodResolver(newsLetterFormSchema),
    defaultValues: {
      email: '',
    },
  });

  useEffect(() => {
    setIsClient(true);
    if (landingId && typeof window !== 'undefined') {
      const hasSeen = window.localStorage.getItem('hasSeenNewsletterModal');
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setOpen(true);
        }, 15000); // 15 segundos
        return () => clearTimeout(timer);
      }
    }
  }, [landingId]);

  const onSubmit = async (values: z.infer<typeof newsLetterFormSchema>) => {
    try {
      const response = await fetch('/api/newsletterSubscribers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          source: 'landing-' + landingId,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        toast({
          title: 'Error',
          description:
            errorData.error || 'Hubo un error al suscribirte al newsletter.',
          variant: 'destructive',
        });
        return;
      }

      if (typeof window !== 'undefined') {
        window.localStorage.setItem('hasSeenNewsletterModal', 'true');
      }
      setOpen(false);
      toast({
        title: '¡Gracias por suscribirte!',
        description:
          'Recibirás novedades de la academia, tips de entrenamiento y promociones.',
        variant: 'success',
      });
    } catch (e) {
      toast({
        title: 'Error inesperado',
        description: 'No pudimos procesar tu solicitud. Inténtalo más tarde.',
        variant: 'destructive',
      });
    }
  };

  const onInvalid = (errors: any) => console.error(errors);

  const handleClose = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('hasSeenNewsletterModal', 'true');
    }
    setOpen(false);
  };

  if (!isClient) return null;
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl">
            ¡Recibe tips de Jiu Jitsu y novedades de la academia!
          </DialogTitle>
          <DialogDescription className="text-center">
            Suscríbete a nuestro newsletter y recibe noticias, seminarios,
            horarios y promociones exclusivas.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit, onInvalid)}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Correo electrónico</FormLabel>
                  <FormControl>
                    <Input placeholder="tu@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex flex-col sm:flex-row gap-2">
              <Button type="submit" className="flex-1">
                Suscribirme
              </Button>
              <Button type="button" variant="outline" onClick={handleClose}>
                No, gracias
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
