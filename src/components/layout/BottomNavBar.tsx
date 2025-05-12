
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Linkedin, PlusSquare, MessageCircle, User, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import React, { useState, useEffect, useRef } from 'react';
import Image from '@/components/ui/image'; // Use custom Image component
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { sendEmail } from '@/services/email';
import { ScrollArea } from '@/components/ui/scroll-area';
import ReCAPTCHA from 'react-google-recaptcha';

interface NavItemProps {
  href?: string;
  target?: string;
  icon: React.ElementType;
  label: string;
  isActive?: boolean;
  onClick?: () => void;
}

const NavItem: React.FC<NavItemProps> = ({ href, icon: Icon, label, isActive, onClick, target }) => {
  const content = (
    <div
      className={cn(
        "flex flex-col items-center justify-center space-y-1 p-2 cursor-pointer",
        isActive ? "text-primary" : "text-foreground/70 hover:text-foreground"
      )}
      onClick={onClick}
    >
      <Icon className="w-6 h-6" />
      <span className="text-xs font-medium">{label}</span>
    </div>
  );

  if (href && !onClick) {
    return <Link href={href} target={target} rel={target === "_blank" ? "noopener noreferrer" : undefined}>{content}</Link>;
  }
  return content;
};

type ChatMessage = {
  sender: 'user' | 'bot';
  text: string;
};

export function BottomNavBar() {
  const recaptcha = useRef<ReCAPTCHA | null>(null);

  const pathname = usePathname();
  const { toast } = useToast();
  const [comment, setComment] = React.useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = React.useState(false);
  
  const [isInboxDialogOpen, setIsInboxDialogOpen] = React.useState(false);

  // Chat states
  const [chatStage, setChatStage] = useState<'initial' | 'askingName' | 'askingEmail' | 'readyToMessage' | 'messageSent'>('initial');
  const [userName, setUserName] = useState('');
  const [userEmail, setUserEmail] = useState('');
  const [currentChatMessage, setCurrentChatMessage] = useState('');
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const chatEndRef = useRef<null | HTMLDivElement>(null);

  const resetChat = () => {
    setChatStage('initial');
    setUserName('');
    setUserEmail('');
    setCurrentChatMessage('');
    setChatMessages([{ sender: 'bot', text: '¡Hola! ¿En qué puedo ayudarte hoy? Primero, ¿cómo te llamas?' }]);
  };
  
  useEffect(() => {
    if (isInboxDialogOpen) {
      resetChat(); // Reset chat when dialog opens
    }
  }, [isInboxDialogOpen]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);


  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast({ title: "¡Ups!", description: "El comentario no puede estar vacío.", variant: "destructive" });
      return;
    }
    // Here you would typically send the comment to a backend service
    // For now, we'll just show a success toast
    try {
      const captchaValue = recaptcha?.current?.getValue();
      if (!captchaValue) {
        toast({ title: "¡Ups!", description: "Para continuar debes resolver primero el captcha.", variant: "destructive" });
        return;
      } else {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BACKEND}/api/verify`,
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ captchaValue }),
          }
        );
        if (!response.ok) {
          toast({
            title: "¡Ups!",
            description: "Hubo un error de red al verificar el captcha.",
            variant: "destructive",
          });
          return;
        }
        const data = await response.json();
        if (!data.success) {
          toast({
            title: "¡Ups!",
            description: "El captcha no es válido, intentá de nuevo.",
            variant: "destructive",
          });
          return;
        }
      }
      await sendEmail({
          subject: `Te escribieron un comentario desde el portfolio`,
          body: `<p>${comment}</p>`
      });
      toast({ title: "¡Éxito!", description: "¡Gracias por tu comentario!" });
    } catch(error) {
      console.error('error procesando comentario');
      toast({ title: "¡Ups!", description: "Ocurrió un error al enviar tu comentario. Intenta más tarde.", variant: "destructive" }); 
    }
    setComment('');
    setIsCommentDialogOpen(false);
    recaptcha.current?.reset();
  };

  const handleChatSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!currentChatMessage.trim() && chatStage !== 'messageSent' && chatStage !== 'initial' && chatStage !== 'askingEmail') {
        toast({ title: "¡Ups!", description: "El campo no puede estar vacío.", variant: "destructive" });
        return;
    }
     if (!currentChatMessage.trim() && (chatStage === 'initial' || chatStage === 'askingEmail')) {
      toast({ title: "¡Ups!", description: "El campo no puede estar vacío.", variant: "destructive" });
      return;
    }


    const userMessage: ChatMessage = { sender: 'user', text: currentChatMessage };
    setChatMessages(prev => [...prev, userMessage]);
    const submittedText = currentChatMessage; // Store before clearing
    setCurrentChatMessage(''); // Clear input immediately

    switch (chatStage) {
        case 'initial': // Bot asked for name, user submitted name
            setUserName(submittedText);
            setChatMessages(prev => [...prev, { sender: 'bot', text: `¡Hola ${submittedText}! ¿Cuál es tu email?` }]);
            setChatStage('askingEmail');
            break;
        case 'askingEmail': // Bot asked for email, user submitted email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(submittedText)) {
                setChatMessages(prev => [...prev, { sender: 'bot', text: 'Por favor, ingresa un email válido.' }]);
                // Keep stage as 'askingEmail'
                return; 
            }
            setUserEmail(submittedText);
            setChatMessages(prev => [...prev, { sender: 'bot', text: '¡Gracias! Ahora puedes escribirme tu mensaje.' }]);
            setChatStage('readyToMessage');
            break;
        case 'readyToMessage': // User submitted their actual message
             if (!userName || !userEmail) {
                // This case should ideally not be reached if flow is correct
                // but as a safeguard:
                setChatMessages(prev => [...prev, { sender: 'bot', text: 'Parece que nos saltamos algunos pasos. Empecemos de nuevo. ¿Cómo te llamas?' }]);
                resetChat(); // Full reset
                setChatMessages([{ sender: 'bot', text: 'Parece que nos saltamos algunos pasos. Empecemos de nuevo. ¿Cómo te llamas?' }]);
                return;
            }
            try {
                const captchaValue = recaptcha?.current?.getValue();
                if (!captchaValue) {
                  toast({ title: "¡Ups!", description: "Para continuar primero debes resolver el captcha.", variant: "destructive" });
                  return;
                } else {
                  const response = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND}/api/verify`,
                    {
                      method: 'POST',
                      headers: { 'Content-Type': 'application/json' },
                      body: JSON.stringify({ captchaValue }),
                    }
                  );
                  if (!response.ok) {
                    toast({
                      title: "¡Ups!",
                      description: "Hubo un error de red al verificar el captcha.",
                      variant: "destructive",
                    });
                    return;
                  }
                  const data = await response.json();
                  if (!data.success) {
                    toast({
                      title: "¡Ups!",
                      description: "El captcha no es válido, intentá de nuevo.",
                      variant: "destructive",
                    });
                    return;
                  }
                }
                await sendEmail({
                    subject: `${userName} se quiere comunicar con vos, te escribió desde el portfolio sección inbox`,
                    body: `<p>Nombre: ${userName}<br/>Email: ${userEmail}<br/>Mensaje:<br/>${submittedText}</p>`
                });
                setChatMessages(prev => [...prev, { sender: 'bot', text: '¡Mensaje Enviado! Gracias por escribirme, pronto te voy a contactar.' }]);
                setChatStage('messageSent');
                toast({ title: "¡Mensaje Enviado!", description: "Gracias por contactarme." });
              } catch (error) {
                console.error("Failed to send message:", error);
                setChatMessages(prev => [...prev, { sender: 'bot', text: 'No se pudo enviar el mensaje. Por favor, inténtalo de nuevo más tarde.' }]);
                toast({ title: "Error", description: "No se pudo enviar el mensaje.", variant: "destructive" });
              }
            recaptcha.current?.reset();
            break;
    }
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Inicio', isActive: pathname === '/' },
    { href: 'https://www.linkedin.com/in/juancruzdillon', icon: Linkedin, label: 'LinkedIn', target: '_blank' },
    { icon: PlusSquare, label: 'Comentar', onClick: () => setIsCommentDialogOpen(true) },
    { icon: MessageCircle, label: 'Inbox', onClick: () => setIsInboxDialogOpen(true) },
    { href: '/profile', icon: User, label: 'Perfil', isActive: pathname === '/profile' },
  ];

  let inputPlaceholder = '';
  let buttonText = 'Enviar';
  let InputComponent: React.ElementType = Input;

  if (chatStage === 'initial') {
      inputPlaceholder = 'Tu nombre...';
  } else if (chatStage === 'askingEmail') {
      inputPlaceholder = 'Tu email...';
  } else if (chatStage === 'readyToMessage') {
      inputPlaceholder = 'Escribe tu mensaje aquí...';
      InputComponent = Textarea;
  }


  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-md flex justify-around items-center lg:hidden z-50 mobile-nav-padding">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

       <nav className="hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:w-20 md:bg-card md:border-r md:border-border md:shadow-md md:flex md:flex-col md:items-center md:justify-center md:space-y-6 md:z-50">
        {navItems.map((item) => (
          <NavItem key={item.label + "-desktop"} {...item} />
        ))}
      </nav>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Déjame un comentario</DialogTitle>
            <DialogDescription>
              Tu feedback es valioso. Por favor, deja un comentario abajo.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-2 py-4">
            <Textarea
              id="comment"
              placeholder="Escribe tu comentario aquí..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
              onKeyDown={(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
                if (e.key === 'Enter' && e.ctrlKey) {
                  e.preventDefault();
                  handleCommentSubmit();
                }
              }}
            />
            <p className="text-xs text-muted-foreground">Presiona Ctrl + Enter para enviar el comentario.</p>
          </div>
          <ReCAPTCHA ref={recaptcha} sitekey={process.env.NEXT_PUBLIC_SITE_KEY || ""} />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCommentDialogOpen(false)}>Cancelar</Button>
            <Button type="submit" onClick={handleCommentSubmit}>Enviar Comentario</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inbox Dialog (Chat Flow) */}
      <Dialog open={isInboxDialogOpen} onOpenChange={(open) => {
          setIsInboxDialogOpen(open);
          if (open) { 
            resetChat();
          }
        }}>
        <DialogContent className="sm:max-w-md flex flex-col h-[70vh] max-h-[550px] min-h-[400px]">
          <DialogHeader>
            <DialogTitle>Inbox</DialogTitle>
            <DialogDescription>
              Comunícate conmigo directamente.
            </DialogDescription>
          </DialogHeader>
          
          <ScrollArea className="flex-grow p-1 my-2 border rounded-lg bg-muted/30">
            <div className="p-3 space-y-3">
              {chatMessages.map((msg, index) => (
                <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
                    {msg.sender === 'bot' && index === 0 && (
                         <div className="flex items-center space-x-2 mb-1">
                            <Image
                                src="https://picsum.photos/seed/chatavatar/32/32"
                                alt="Juan Cruz Dillon"
                                width={32}
                                height={32}
                                data-ai-hint="profile avatar"
                                containerClassName="w-8 h-8"
                                imgClassName="rounded-full object-cover w-full h-full"
                            />
                            <p className="text-xs text-muted-foreground font-medium">Juan Cruz Dillon</p>
                         </div>
                    )}
                  <div className={cn(
                    "p-2.5 rounded-lg max-w-[85%] text-sm shadow-sm break-words",
                    msg.sender === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-br-none' 
                        : 'bg-card text-card-foreground border rounded-bl-none'
                  )}>
                    {msg.text}
                  </div>
                </div>
              ))}
              <div ref={chatEndRef} />
            </div>
          </ScrollArea>

          <form onSubmit={handleChatSubmit} className="mt-auto pt-2 space-y-1">
            {chatStage !== 'messageSent' && (
              <>
                <InputComponent
                  id="chatInput"
                  placeholder={inputPlaceholder}
                  value={currentChatMessage}
                  onChange={(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => setCurrentChatMessage(e.target.value)}
                  required
                  autoFocus
                  className={cn(
                      "w-full",
                      chatStage === 'readyToMessage' ? "min-h-[70px] resize-none" : "h-10"
                  )}
                  onKeyDown={(e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
                    if (e.key === 'Enter' && e.ctrlKey) {
                      e.preventDefault();
                      handleChatSubmit(e as any);
                    } else if (e.key === 'Enter' && !e.shiftKey && InputComponent !== Textarea) {
                      e.preventDefault();
                      handleChatSubmit(e as any);
                    }
                  }}
                />
                <p className="text-xs text-muted-foreground">Presiona Ctrl + Enter para enviar.</p>
              </>
            )}
            <ReCAPTCHA ref={recaptcha} sitekey={process.env.NEXT_PUBLIC_SITE_KEY || ""} />
            <DialogFooter className="pt-2 sm:justify-between"> {/* Adjusted pt for spacing */}
                <Button type="button" variant="outline" onClick={() => setIsInboxDialogOpen(false)}>
                    {chatStage === 'messageSent' ? 'Cerrar' : 'Cancelar'}
                </Button>
                {chatStage !== 'messageSent' && (
                    <Button type="submit" className="flex items-center">
                        <Send className="w-4 h-4 mr-2" />
                        {buttonText}
                    </Button>
                )}
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
