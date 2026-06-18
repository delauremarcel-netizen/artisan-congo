import React from 'react';
import { Button } from '@/components/ui/button';
import { AlertTriangle, RefreshCw } from 'lucide-react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center w-full">
          <div className="bg-destructive/10 p-6 rounded-full mb-6">
            <AlertTriangle className="w-12 h-12 text-destructive" />
          </div>
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">Oups ! Quelque chose s'est mal passé.</h2>
          <p className="text-muted-foreground max-w-md mb-8">
            Une erreur inattendue est survenue lors du chargement de cette page. Nous nous excusons pour la gêne occasionnée.
          </p>
          <Button onClick={() => window.location.reload()} size="lg" className="rounded-xl">
            <RefreshCw className="w-4 h-4 mr-2" />
            Recharger la page
          </Button>
          {import.meta.env.DEV && this.state.error && (
            <div className="mt-8 p-4 bg-muted rounded-lg text-left max-w-2xl overflow-auto text-sm text-muted-foreground">
              <p className="font-mono font-bold text-destructive mb-2">{this.state.error.toString()}</p>
              <pre className="font-mono text-xs">{this.state.error.stack}</pre>
            </div>
          )}
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;