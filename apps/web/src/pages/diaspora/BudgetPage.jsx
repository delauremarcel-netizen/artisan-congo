import React from 'react';
import DiasporaNav from './DiasporaNav.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Download, AlertCircle } from 'lucide-react';
import { mockExpenses } from '@/lib/diasporaMockData';

const BudgetPage = () => {
  return (
    <div className="w-full bg-muted/30 min-h-screen pb-16">
      <DiasporaNav />
      <div className="container mx-auto px-4 max-w-7xl pt-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-foreground">Suivi Financier</h1>
          <Button variant="outline" className="rounded-full gap-2 border-border bg-card">
            <Download className="w-4 h-4" /> Exporter PDF
          </Button>
        </div>

        {/* Selected project budget summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="bg-card border-border/50 premium-shadow rounded-2xl">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Budget Initial</p>
              <h3 className="text-2xl font-bold">45,000 €</h3>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 premium-shadow rounded-2xl">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Dépenses Réelles</p>
              <h3 className="text-2xl font-bold text-secondary">32,000 €</h3>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 premium-shadow rounded-2xl">
            <CardContent className="p-6">
              <p className="text-sm font-medium text-muted-foreground mb-1">Reste Disponible</p>
              <h3 className="text-2xl font-bold text-primary">13,000 €</h3>
            </CardContent>
          </Card>
          <Card className="bg-card border-border/50 premium-shadow rounded-2xl">
            <CardContent className="p-6 flex flex-col justify-center h-full">
               <div className="flex justify-between text-sm mb-2 font-medium">
                  <span>Utilisation</span>
                  <span>71%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div className="bg-secondary h-2 rounded-full" style={{ width: `71%` }} />
                </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border/50 premium-shadow rounded-2xl mb-8">
          <CardHeader>
            <CardTitle>Historique des Dépenses</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow className="border-border">
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Catégorie</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead className="text-right">Montant</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {mockExpenses.map((expense) => (
                  <TableRow key={expense.id} className="border-border/50">
                    <TableCell className="font-medium">{expense.date}</TableCell>
                    <TableCell>{expense.desc}</TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-md text-xs bg-muted text-muted-foreground">{expense.category}</span>
                    </TableCell>
                    <TableCell>
                      <span className="px-2 py-1 rounded-md text-xs bg-primary/10 text-primary font-medium">{expense.status}</span>
                    </TableCell>
                    <TableCell className="text-right font-bold">{expense.amount} €</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </div>
  );
};

export default BudgetPage;