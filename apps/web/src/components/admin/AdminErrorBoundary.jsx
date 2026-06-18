import React from 'react';
import { Button } from '@/components/ui/button';
import { ShieldAlert } from 'lucide-react';

class AdminErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("AdminErrorBoundary caught an error", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="flex flex-col items-center justify-center p-12 text-center bg-destructive/5 border border-destructive/20 rounded-2xl m-4 sm:m-8">
          <ShieldAlert className="w-16 h-16 text-destructive mb-6" />
          <h2 className="text-2xl font-bold text-foreground mb-3">Erreur du tableau de bord</h2>
          <p className="text-muted-foreground mb-8 max-w-md">
            Une erreur inattendue ou un problème d'authentification s'est produit lors du chargement des composants.
            <br/><br/>
            <span className="text-sm font-mono bg-background p-2 rounded block mt-2 text-destructive/80 text-left overflow-x-auto">
              {this.state.error?.message || 'Erreur inconnue'}
            </span>
          </p>
          <Button onClick={() => window.location.href = '/admin/login'} variant="default">
            Retour à la connexion
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AdminErrorBoundary;