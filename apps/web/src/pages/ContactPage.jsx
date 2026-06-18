import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Mail, Phone, MapPin, MessageCircle, Send, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

const PLATFORM_PHONE_NUMBER = "+33605884875";

const ContactPage = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      toast.success("Votre message a bien été envoyé ! Nous vous répondrons dans les plus brefs délais.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 1500);
  };

  const handleWhatsAppClick = () => {
    const message = encodeURIComponent("Bonjour ArtisanCongo, je souhaite vous contacter.");
    window.open(`https://wa.me/${PLATFORM_PHONE_NUMBER.replace(/\s+/g, '')}?text=${message}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="min-h-screen bg-muted/20 pt-24 pb-12">
      <Helmet>
        <title>Contactez-nous | ArtisanCongo</title>
        <meta name="description" content="Une question, une suggestion ou besoin d'aide ? Contactez l'équipe d'ArtisanCongo par email, téléphone ou WhatsApp." />
      </Helmet>

      <div className="container mx-auto max-w-6xl px-4">
        {/* Header Section */}
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-extrabold text-foreground mb-4">Contactez-nous</h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Notre équipe est à votre disposition pour répondre à toutes vos questions. N'hésitez pas à nous écrire ou à nous appeler.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Contact Information */}
          <div className="lg:col-span-1 space-y-6">
            <h2 className="text-2xl font-bold mb-6">Nos Coordonnées</h2>
            
            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Téléphone</h3>
                  <a href={`tel:${PLATFORM_PHONE_NUMBER.replace(/\s+/g, '')}`} className="contact-link-muted block">
                    00 33 6 05 88 48 75
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">Lun-Ven, 8h-18h</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <a href="mailto:contact@artisancongo.com" className="contact-link-muted block break-all">
                    contact@artisancongo.com
                  </a>
                  <p className="text-sm text-muted-foreground mt-1">Nous répondons sous 24h</p>
                </div>
              </CardContent>
            </Card>

            <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
              <CardContent className="p-6 flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg mb-1">Localisation</h3>
                  <p className="text-muted-foreground">
                    Brazzaville & Pointe-Noire<br />
                    République du Congo
                  </p>
                </div>
              </CardContent>
            </Card>

            <Button 
              onClick={handleWhatsAppClick} 
              className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white h-14 text-lg font-medium shadow-md hover:-translate-y-1 transition-all"
            >
              <MessageCircle className="w-5 h-5 mr-2" />
              Discuter sur WhatsApp
            </Button>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <Card className="border-border shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-2xl font-bold mb-6">Envoyez-nous un message</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input 
                        id="name" 
                        name="name" 
                        placeholder="Votre nom" 
                        value={formData.name}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Adresse email</Label>
                      <Input 
                        id="email" 
                        name="email" 
                        type="email" 
                        placeholder="votre@email.com" 
                        value={formData.email}
                        onChange={handleChange}
                        required 
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet</Label>
                    <Input 
                      id="subject" 
                      name="subject" 
                      placeholder="Sujet de votre message" 
                      value={formData.subject}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="message">Message</Label>
                    <Textarea 
                      id="message" 
                      name="message" 
                      placeholder="Comment pouvons-nous vous aider ?" 
                      rows={6}
                      className="resize-none"
                      value={formData.message}
                      onChange={handleChange}
                      required 
                    />
                  </div>
                  
                  <Button 
                    type="submit" 
                    className="w-full md:w-auto px-8 h-12 text-base font-semibold"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Envoyer le message
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;