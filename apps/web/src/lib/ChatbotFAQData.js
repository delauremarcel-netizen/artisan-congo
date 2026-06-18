export const chatbotFAQData = {
  welcome: {
    message: "Bienvenue sur ArtisanCongo. Je suis Assistant Kongo, votre assistant virtuel. Que puis-je faire pour vous aujourd'hui ?",
    options: [
      { label: "Je suis client", value: "client" },
      { label: "Je suis artisan", value: "artisan" },
      { label: "Questions générales", value: "general" }
    ]
  },

  clients: [
    {
      id: 'c1',
      question: "Comment trouver un artisan fiable ?",
      answer: "Nous vérifions rigoureusement chaque artisan inscrit sur ArtisanCongo.\n\nNotre processus inclut:\n- Vérification de l'identité\n- Validation des références\n- Examen des réalisations passées\n- Avis des clients précédents\n\nVous pouvez parcourir notre annuaire ou nous décrire votre besoin pour être mis en relation directement avec les professionnels qualifiés. Pour toute question, contactez-nous à contact@artisancongo.com.",
      cta: "Découvrir les artisans"
    },
    {
      id: 'c2',
      question: "Comment demander un devis ?",
      answer: "Demander un devis est simple et gratuit.\n\nVoici comment procéder:\n- Décrivez votre besoin en détail\n- Indiquez le lieu d'intervention\n- Précisez votre budget si possible\n\nNous transmettons votre demande aux artisans qualifiés de votre secteur. Ils vous contacteront directement avec une estimation personnalisée. Si vous avez besoin d'aide, écrivez-nous à contact@artisancongo.com.",
      cta: "Demander un devis"
    },
    {
      id: 'c3',
      question: "Les artisans sont-ils vérifiés ?",
      answer: "Oui, tous les artisans sont vérifiés par notre équipe.\n\nNous contrôlons:\n- L'identité et les coordonnées\n- Les références professionnelles\n- La qualité des réalisations\n- Les avis des clients\n\nAprès chaque intervention, nous encourageons les clients à laisser un avis pour garantir la transparence et la qualité du service. Pour plus d'informations, contactez contact@artisancongo.com.",
      cta: "Voir les artisans vérifiés"
    },
    {
      id: 'c4',
      question: "Quels sont les tarifs des interventions ?",
      answer: "Les tarifs varient selon le type de travaux et l'artisan choisi.\n\nPoints importants:\n- ArtisanCongo ne prend aucune commission sur vos travaux\n- Vous négociez directement avec l'artisan\n- Vous payez uniquement pour les services convenus\n- Les devis sont gratuits et sans engagement\n\nChaque artisan fixe ses propres tarifs en fonction de son expérience et de la complexité du projet. Pour des questions sur les tarifs, contactez-nous à contact@artisancongo.com.",
      cta: "Estimer mes travaux"
    },
    {
      id: 'c5',
      question: "Combien de temps pour trouver un artisan ?",
      answer: "Le délai dépend de votre localisation et du type de service demandé.\n\nEn général:\n- Réponses rapides dans les grandes villes (Brazzaville, Pointe-Noire)\n- Délai moyen de 24 à 48 heures\n- Certains artisans répondent en quelques heures\n\nPlus votre demande est précise, plus rapide sera la mise en relation avec les professionnels adaptés. Si vous avez des questions, écrivez à contact@artisancongo.com.",
      cta: "Soumettre ma demande"
    }
  ],

  artisans: [
    {
      id: 'a1',
      question: "Comment m'inscrire comme artisan ?",
      answer: "L'inscription est rapide, gratuite et sans engagement.\n\nVoici ce qu'il vous faut:\n- Une description claire de vos services\n- Votre ville ou région d'intervention\n- Quelques photos de vos réalisations\n- Votre numéro de téléphone\n\nNotre équipe valide votre profil sous 24 à 48 heures. Une fois approuvé, vous commencez à recevoir des demandes de clients. Pour toute question sur l'inscription, contactez contact@artisancongo.com.",
      cta: "M'inscrire maintenant"
    },
    {
      id: 'a2',
      question: "Y a-t-il une commission sur mes chantiers ?",
      answer: "Non, il n'y a aucune commission sur vos chantiers.\n\nVoici comment cela fonctionne:\n- Vous gardez 100% de vos revenus\n- Aucune retenue sur les paiements clients\n- Les abonnements optionnels augmentent votre visibilité\n- Vous restez maître de vos tarifs\n\nArtisanCongo gagne uniquement grâce aux abonnements volontaires des artisans qui souhaitent plus de visibilité. Pour plus de détails, écrivez à contact@artisancongo.com.",
      cta: "Voir les abonnements"
    },
    {
      id: 'a3',
      question: "Comment recevoir des demandes de clients ?",
      answer: "Une fois votre profil validé, vous recevez des demandes de plusieurs façons.\n\nVous bénéficiez de:\n- Accès direct aux demandes de votre région\n- Notifications pour les nouveaux projets\n- Mise en avant selon votre abonnement\n- Avis et recommandations des clients\n\nPlus votre profil est complet avec photos et avis, plus vous recevez de demandes qualifiées. Si vous avez besoin d'aide pour optimiser votre profil, contactez contact@artisancongo.com.",
      cta: "Compléter mon profil"
    },
    {
      id: 'a4',
      question: "Puis-je modifier mon profil ?",
      answer: "Oui, vous pouvez modifier votre profil à tout moment.\n\nVous pouvez mettre à jour:\n- Vos photos et réalisations\n- Votre description et services\n- Votre numéro de téléphone\n- Vos zones d'intervention\n- Vos tarifs et disponibilités\n\nLes modifications sont appliquées immédiatement. Nous vous recommandons de garder votre profil à jour pour attirer plus de clients. Pour des questions techniques, écrivez à contact@artisancongo.com.",
      cta: "Accéder à mon compte"
    },
    {
      id: 'a5',
      question: "Comment augmenter ma visibilité ?",
      answer: "Plusieurs actions augmentent votre visibilité sur la plateforme.\n\nStratégies efficaces:\n- Ajouter des photos de qualité de vos réalisations\n- Obtenir des avis positifs des clients\n- Compléter tous les champs de votre profil\n- Répondre rapidement aux demandes\n- Souscrire à un abonnement premium\n\nLes artisans avec profils complets et bons avis reçoivent 3 fois plus de demandes. Pour des conseils personnalisés, contactez contact@artisancongo.com.",
      cta: "Améliorer mon profil"
    }
  ],

  general: [
    {
      id: 'g1',
      question: "Qu'est-ce qu'ArtisanCongo ?",
      answer: "ArtisanCongo est une plateforme de mise en relation entre clients et artisans qualifiés au Congo.\n\nNotre mission:\n- Connecter les clients avec des professionnels vérifiés\n- Garantir la qualité et la fiabilité des services\n- Simplifier la recherche d'artisans\n- Soutenir les professionnels du bâtiment et des services\n\nNous opérons à Brazzaville, Pointe-Noire et dans d'autres villes du Congo. Pour en savoir plus, écrivez à contact@artisancongo.com.",
      cta: "En savoir plus"
    },
    {
      id: 'g2',
      question: "Comment fonctionne la plateforme ?",
      answer: "ArtisanCongo fonctionne en trois étapes simples.\n\nPour les clients:\n1. Décrivez votre besoin\n2. Recevez des devis d'artisans qualifiés\n3. Choisissez et travaillez directement avec l'artisan\n\nPour les artisans:\n1. Créez votre profil professionnel\n2. Recevez des demandes de clients\n3. Gérez vos chantiers et avis\n\nLa plateforme facilite la communication et la mise en relation. Pour des questions, contactez contact@artisancongo.com.",
      cta: "Commencer maintenant"
    },
    {
      id: 'g3',
      question: "Quelles sont les villes couvertes ?",
      answer: "Nous couvrons actuellement les principales villes du Congo.\n\nVilles principales:\n- Brazzaville\n- Pointe-Noire\n- Kinshasa\n- Lubumbashi\n- Kolwezi\n\nNous étendons progressivement notre couverture. Si votre ville n'est pas listée, contactez-nous à contact@artisancongo.com pour connaître les délais d'expansion.",
      cta: "Voir les artisans près de moi"
    },
    {
      id: 'g4',
      question: "Comment contacter le support ?",
      answer: "Nous sommes disponibles pour vous aider via plusieurs canaux.\n\nMoyens de contact:\n- Email: contact@artisancongo.com\n- Chat en direct: Utilisez notre assistant IA (Assistant Kongo)\n\nNous répondons généralement dans les 2 heures pendant les heures de bureau. N'hésitez pas à nous écrire à contact@artisancongo.com pour toute question ou problème.",
      cta: "Contacter le support"
    },
    {
      id: 'g5',
      question: "La plateforme est-elle sécurisée ?",
      answer: "Oui, la sécurité est notre priorité.\n\nMesures de sécurité:\n- Vérification d'identité de tous les artisans\n- Chiffrement des données personnelles\n- Système de notation transparent\n- Avis vérifiés des clients\n- Protection des paiements\n\nVous pouvez utiliser ArtisanCongo en toute confiance. Pour des questions de sécurité, écrivez à contact@artisancongo.com.",
      cta: "En savoir plus sur la sécurité"
    },
    {
      id: 'g6',
      question: "Quel est votre email de contact ?",
      answer: "Notre adresse email de contact est: contact@artisancongo.com\n\nVous pouvez nous écrire pour:\n- Des questions générales\n- Des problèmes techniques\n- Des suggestions d'amélioration\n- Des demandes de support\n- Toute autre question\n\nNous répondons à tous les emails dans les 24 heures. Contactez-nous à contact@artisancongo.com.",
      cta: "Envoyer un email"
    },
    {
      id: 'g7',
      question: "Comment puis-je vous joindre ?",
      answer: "Vous pouvez nous joindre de plusieurs façons:\n\nEmail: contact@artisancongo.com\nChat en direct: Utilisez Assistant Kongo sur notre plateforme\n\nNous sommes disponibles pour répondre à vos questions, résoudre vos problèmes et vous aider à trouver le meilleur artisan. Écrivez-nous à contact@artisancongo.com.",
      cta: "Nous contacter"
    },
    {
      id: 'g8',
      question: "J'ai un problème, comment obtenir de l'aide ?",
      answer: "Si vous rencontrez un problème, nous sommes là pour vous aider.\n\nVoici comment procéder:\n1. Utilisez le chat en direct avec Assistant Kongo\n2. Envoyez un email à contact@artisancongo.com\n3. Décrivez votre problème en détail\n4. Nous vous répondrons rapidement\n\nPour une assistance immédiate, contactez-nous à contact@artisancongo.com. Nous nous engageons à résoudre tous les problèmes dans les 24 heures.",
      cta: "Obtenir de l'aide"
    },
    {
      id: 'g9',
      question: "Où puis-je poser une question ?",
      answer: "Vous pouvez poser vos questions de plusieurs façons:\n\n1. Chat en direct: Utilisez Assistant Kongo pour une réponse immédiate\n2. Email: Écrivez à contact@artisancongo.com\n3. FAQ: Consultez notre section questions fréquentes\n\nQuelle que soit votre question, nous sommes prêts à vous aider. N'hésitez pas à nous contacter à contact@artisancongo.com.",
      cta: "Poser une question"
    },
    {
      id: 'g10',
      question: "Avez-vous une adresse email pour les demandes de support ?",
      answer: "Oui, notre adresse email pour le support est: contact@artisancongo.com\n\nVous pouvez nous envoyer:\n- Des demandes de support technique\n- Des questions sur votre compte\n- Des problèmes avec les paiements\n- Des suggestions ou des commentaires\n- Toute autre demande\n\nNous traitons tous les emails de support rapidement. Écrivez à contact@artisancongo.com et nous vous aiderons.",
      cta: "Envoyer une demande"
    },
    {
      id: 'g11',
      question: "C'est quoi ton adresse mail ?",
      answer: "Mon adresse email est: contact@artisancongo.com\n\nPour toute demande concernant ArtisanCongo, l'adresse à utiliser est : **contact@artisancongo.com**\n\nVous pouvez nous écrire pour:\n- Des questions sur la plateforme\n- Des problèmes techniques\n- Des demandes de support\n- Des suggestions\n\nNous répondons rapidement à tous les emails. Contactez-nous à contact@artisancongo.com.",
      cta: "Envoyer un email"
    },
    {
      id: 'g12',
      question: "Quelle est votre adresse de contact ?",
      answer: "Pour toute demande concernant ArtisanCongo, l'adresse à utiliser est : **contact@artisancongo.com**\n\nNous sommes disponibles pour:\n- Répondre à vos questions\n- Résoudre vos problèmes\n- Vous aider à trouver un artisan\n- Vous assister dans vos démarches\n\nN'hésitez pas à nous contacter à contact@artisancongo.com. Nous répondons généralement dans les 24 heures.",
      cta: "Nous contacter"
    },
    {
      id: 'g13',
      question: "Comment vous contacter par email ?",
      answer: "Vous pouvez nous contacter par email à: contact@artisancongo.com\n\nDans votre email, n'oubliez pas de:\n- Décrire clairement votre question ou problème\n- Fournir vos coordonnées de contact\n- Inclure tout détail pertinent\n\nNous nous engageons à répondre à tous les emails dans les 24 heures. Écrivez-nous à contact@artisancongo.com.",
      cta: "Envoyer un email"
    },
    {
      id: 'g14',
      question: "Quel est le meilleur moyen de vous contacter ?",
      answer: "Le meilleur moyen de nous contacter est par email: contact@artisancongo.com\n\nVous pouvez aussi:\n- Utiliser le chat en direct avec Assistant Kongo\n- Poser vos questions dans notre FAQ\n\nPour les demandes urgentes ou les problèmes techniques, écrivez directement à contact@artisancongo.com et nous vous répondrons rapidement.",
      cta: "Nous contacter"
    },
    {
      id: 'g15',
      question: "Avez-vous un numéro de téléphone ou une adresse email ?",
      answer: "Vous pouvez nous contacter par email à: contact@artisancongo.com\n\nNous répondons à tous les emails rapidement. Pour une assistance immédiate, vous pouvez aussi utiliser le chat en direct avec Assistant Kongo sur notre plateforme.\n\nÉcrivez-nous à contact@artisancongo.com pour toute question ou demande.",
      cta: "Envoyer un email"
    }
  ]
};