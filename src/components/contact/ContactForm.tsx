
"use client";

import type React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { sendEmail } from "@/services/email";
import { Send } from 'lucide-react';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, ingresa un email válido.",
  }),
  message: z.string().min(10, {
    message: "El mensaje debe tener al menos 10 caracteres.",
  }).max(500, {
    message: "El mensaje no puede exceder los 500 caracteres.",
  }),
});

type ContactFormValues = z.infer<typeof formSchema>;

const ContactForm: React.FC = () => {
  const { toast } = useToast();
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    try {
      await sendEmail({
        subject: `${data.name} se quiere comunicar con vos, te escribió desde el portfolio sección contacto`,
        body: `<p>Nombre: ${data.name}<br/>Email: ${data.email}<br/>Mensaje:<br/>${data.message}</p>`,
      });
      toast({
        title: "¡Mensaje Enviado!",
        description: "Gracias por contactarme. Te responderé pronto.",
      });
      form.reset();
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({
        title: "Error al Enviar",
        description: "No se pudo enviar tu mensaje. Por favor, inténtalo de nuevo más tarde o usa el chat de Inbox.",
        variant: "destructive",
      });
    }
  };

  const handleTextAreaKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === 'Enter' && event.ctrlKey) {
      event.preventDefault();
      form.handleSubmit(onSubmit)();
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 text-left">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/90">Nombre</FormLabel>
              <FormControl>
                <Input placeholder="Tu nombre" {...field} className="bg-white/10 border-white/20 placeholder:text-white/50 text-white focus:bg-white/20" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/90">Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="Tu email" {...field} className="bg-white/10 border-white/20 placeholder:text-white/50 text-white focus:bg-white/20" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-white/90">Mensaje</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Escribe tu mensaje aquí..."
                  {...field}
                  onKeyDown={handleTextAreaKeyDown}
                  className="bg-white/10 border-white/20 placeholder:text-white/50 text-white focus:bg-white/20 min-h-[120px]"
                />
              </FormControl>
               <p className="text-xs text-white/60 mt-1">Presiona Ctrl + Enter para enviar.</p>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={form.formState.isSubmitting}>
          <Send className="mr-2 h-4 w-4" />
          {form.formState.isSubmitting ? 'Enviando...' : 'Enviar Mensaje'}
        </Button>
      </form>
    </Form>
  );
};

export default ContactForm;
