
"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Linkedin, PlusSquare, MessageCircle, User, Send } from 'lucide-react';
import { cn } from '@/lib/utils';
import React from 'react';
import Image from 'next/image'; // Added missing import
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { sendEmail } from '@/services/email'; 

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


export function BottomNavBar() {
  const pathname = usePathname();
  const { toast } = useToast();
  const [comment, setComment] = React.useState('');
  const [isCommentDialogOpen, setIsCommentDialogOpen] = React.useState(false);
  
  const [isInboxDialogOpen, setIsInboxDialogOpen] = React.useState(false);
  const [inboxName, setInboxName] = React.useState('');
  const [inboxEmail, setInboxEmail] = React.useState('');
  const [inboxMessage, setInboxMessage] = React.useState('');

  const handleCommentSubmit = async () => {
    if (!comment.trim()) {
      toast({ title: "Oops!", description: "Comment cannot be empty.", variant: "destructive" });
      return;
    }
    // Here you would typically send the comment to a backend
    console.log("Comment submitted:", comment);
    toast({ title: "Success!", description: "Thank you for your comment!" });
    setComment('');
    setIsCommentDialogOpen(false);
  };

  const handleInboxSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inboxName.trim()) {
      toast({ title: "Oops!", description: "Por favor, ingresa tu nombre.", variant: "destructive" });
      return;
    }
    if (!inboxEmail.trim()) {
      toast({ title: "Oops!", description: "Por favor, ingresa tu email.", variant: "destructive" });
      return;
    }
    if (!inboxMessage.trim()) {
      toast({ title: "Oops!", description: "El mensaje no puede estar vacío.", variant: "destructive" });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(inboxEmail)) {
        toast({ title: "Oops!", description: "Por favor, ingresa un email válido.", variant: "destructive" });
        return;
    }

    try {
      await sendEmail({
        to: 'juancruzdillon1999@gmail.com',
        from: inboxEmail, // Use user's email as from
        subject: `Nuevo Mensaje de ${inboxName} desde PortfoliTok`,
        body: `Nombre: ${inboxName}\nEmail: ${inboxEmail}\nMensaje: ${inboxMessage}`,
      });
      toast({ title: "¡Mensaje Enviado!", description: "Gracias por escribirme, pronto te voy a contactar." });
      setInboxName('');
      setInboxEmail('');
      setInboxMessage('');
      setIsInboxDialogOpen(false);
    } catch (error) {
      console.error("Failed to send message:", error);
      toast({ title: "Error", description: "No se pudo enviar el mensaje. Por favor, inténtalo de nuevo más tarde.", variant: "destructive" });
    }
  };

  const navItems = [
    { href: '/', icon: Home, label: 'Inicio', isActive: pathname === '/' },
    { href: 'https://www.linkedin.com/in/juancruzdillon', icon: Linkedin, label: 'LinkedIn', target: '_blank' },
    { icon: PlusSquare, label: 'Comment', onClick: () => setIsCommentDialogOpen(true) },
    { icon: MessageCircle, label: 'Inbox', onClick: () => setIsInboxDialogOpen(true) },
    { href: '/profile', icon: User, label: 'Profile', isActive: pathname === '/profile' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 h-16 bg-card border-t border-border shadow-md flex justify-around items-center md:hidden z-50">
        {navItems.map((item) => (
          <NavItem key={item.label} {...item} />
        ))}
      </nav>

      {/* Desktop Sidebar (optional, for better desktop experience) */}
       <nav className="hidden md:fixed md:left-0 md:top-0 md:bottom-0 md:w-20 md:bg-card md:border-r md:border-border md:shadow-md md:flex md:flex-col md:items-center md:justify-center md:space-y-6 md:z-50">
        {navItems.map((item) => (
          <NavItem key={item.label + "-desktop"} {...item} />
        ))}
      </nav>

      {/* Comment Dialog */}
      <Dialog open={isCommentDialogOpen} onOpenChange={setIsCommentDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Dejame un comentario</DialogTitle>
            <DialogDescription>
              Your feedback is valuable. Please leave a comment below.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea
              id="comment"
              placeholder="Type your comment here..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsCommentDialogOpen(false)}>Cancel</Button>
            <Button type="submit" onClick={handleCommentSubmit}>Submit Comment</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Inbox Dialog */}
      <Dialog open={isInboxDialogOpen} onOpenChange={setIsInboxDialogOpen}>
        <DialogContent className="sm:max-w-md flex flex-col max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Inbox</DialogTitle>
            <DialogDescription>
              Envíame un mensaje directo. ¡Te responderé pronto! Por favor, completa tu nombre y email.
            </DialogDescription>
          </DialogHeader>
          
          <div className="flex-grow overflow-y-auto p-1 space-y-4 border rounded-md my-4">
            <div className="p-3">
              <div className="flex items-start space-x-2">
                <Image
                  src="https://picsum.photos/seed/profileavatar/40/40"
                  alt="Juan Cruz Dillon"
                  width={40}
                  height={40}
                  data-ai-hint="profile avatar"
                  className="w-10 h-10 rounded-full"
                />
                <div>
                  <p className="font-semibold text-foreground">Juan Cruz Dillon</p>
                  <div className="bg-muted p-2 rounded-lg mt-1 shadow">
                    <p className="text-sm text-muted-foreground">¡Hola! ¿En qué puedo ayudarte hoy?</p>
                  </div>
                </div>
              </div>
            </div>
            {/* Potential user messages would appear here */}
          </div>

          <form onSubmit={handleInboxSubmit} className="space-y-4 p-1">
            <div className="space-y-2">
              <Label htmlFor="inboxName" className="text-foreground">Nombre</Label>
              <Input
                id="inboxName"
                placeholder="Tu nombre completo"
                value={inboxName}
                onChange={(e) => setInboxName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inboxEmail" className="text-foreground">Email</Label>
              <Input
                id="inboxEmail"
                type="email"
                placeholder="tu@email.com"
                value={inboxEmail}
                onChange={(e) => setInboxEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inboxMessage" className="text-foreground">Mensaje</Label>
              <Textarea
                id="inboxMessage"
                placeholder="Escribe tu mensaje aquí..."
                value={inboxMessage}
                onChange={(e) => setInboxMessage(e.target.value)}
                className="min-h-[80px]"
                required
              />
            </div>
            <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsInboxDialogOpen(false)}>Cancelar</Button>
                <Button type="submit" className="flex items-center">
                    <Send className="w-4 h-4 mr-2" />
                    Enviar Mensaje
                </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
