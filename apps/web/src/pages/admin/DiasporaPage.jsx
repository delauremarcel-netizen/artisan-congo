import React, { useState, useEffect } from 'react';
import { SEOHead } from '@/components/SEOHead.jsx';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Globe, TrendingUp, Users, DollarSign } from 'lucide-react';
import apiServerClient from '@/lib/apiServerClient';

const DiasporaPage = () => {
  const [diasporaData, setDiasporaData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDiaspora = async () => {
      try {
        const res = await apiServerClient.fetch('/admin/diaspora');
        const data = await res.json();
        if (data.success) {
          setDiasporaData(data.data);
        }
      } catch (error) {
        console.error("Error fetching diaspora stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiaspora();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <SEOHead title="Espace Diaspora | Admin" />
      
      <div>
        <h1 className="text-2xl font-bold text-foreground">Espace Diaspora</h1>
        <p className="text-muted-foreground">Analysez les commandes passées depuis l'étranger pour des proches au Congo.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="admin-card bg-indigo-600 text-white border-transparent">
          <CardContent className="p-6">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-indigo-100 font-medium mb-1">Total Commandes</p>
                <h3 className="text-3xl font-extrabold">{diasporaData.reduce((acc, curr) => acc + curr.total_demandes, 0)}</h3>
              </div>
              <Globe className="w-6 h-6 text-indigo-200" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="admin-card">
        <Tabs defaultValue={diasporaData[0]?.pays || "France"} className="w-full">
          <div className="p-4 border-b border-border bg-muted/10">
            <TabsList>
              {diasporaData.map(country => (
                <TabsTrigger key={country.pays} value={country.pays}>{country.pays}</TabsTrigger>
              ))}
              {diasporaData.length === 0 && <TabsTrigger value="France">France</TabsTrigger>}
            </TabsList>
          </div>

          {loading ? (
            <div className="p-12 text-center text-muted-foreground">Chargement des données pays...</div>
          ) : diasporaData.length === 0 ? (
            <div className="p-12 text-center text-muted-foreground">Aucune donnée diaspora disponible.</div>
          ) : (
            diasporaData.map(country => (
              <TabsContent key={country.pays} value={country.pays} className="m-0 p-6 space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card className="shadow-none border border-border">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Commandes ({country.pays})</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold">{country.total_demandes}</p></CardContent>
                  </Card>
                  <Card className="shadow-none border border-border">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Valeur Générée</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold text-primary">{country.total_montant} €</p></CardContent>
                  </Card>
                  <Card className="shadow-none border border-border">
                    <CardHeader className="pb-2"><CardTitle className="text-sm text-muted-foreground">Commissions (20%)</CardTitle></CardHeader>
                    <CardContent><p className="text-2xl font-bold text-success">{country.total_montant * 0.2} €</p></CardContent>
                  </Card>
                </div>

                <div className="border border-border rounded-xl overflow-hidden">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-muted-foreground uppercase text-xs font-semibold">
                      <tr>
                        <th className="px-4 py-3">Client</th>
                        <th className="px-4 py-3">Catégorie</th>
                        <th className="px-4 py-3">Montant</th>
                        <th className="px-4 py-3">Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {country.demandes?.map(d => (
                        <tr key={d.id}>
                          <td className="px-4 py-3 font-medium">{d.nom_client}</td>
                          <td className="px-4 py-3 text-muted-foreground">{d.categorie}</td>
                          <td className="px-4 py-3 font-semibold">{d.montant} €</td>
                          <td className="px-4 py-3"><span className="admin-badge badge-neutral">{d.statut}</span></td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </TabsContent>
            ))
          )}
        </Tabs>
      </Card>
    </div>
  );
};

export default DiasporaPage;