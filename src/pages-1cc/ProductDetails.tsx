import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui-1cc/card";
import { Button } from "@/components/ui-1cc/button";
import { Badge } from "@/components/ui-1cc/badge";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks-1cc/use-toast";
import {
  ArrowLeft,
  Package,
  DollarSign,
  TrendingUp,
  Users,
  Calendar,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui-1cc/table";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  image_url: string;
}

interface Sale {
  id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  sale_date: string;
  customers: {
    name: string;
  } | null;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [product, setProduct] = useState<Product | null>(null);
  const [sales, setSales] = useState<Sale[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalSales: 0,
    totalRevenue: 0,
    averagePrice: 0,
    uniqueCustomers: 0,
  });

  const fetchProductDetails = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      setProduct(data as unknown as Product);
    } catch (error) {
      console.error("Error fetching product:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger le produit",
        variant: "destructive",
      });
    }
  }, [id, toast]);

  const fetchSales = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("sales")
        .select(`
          *,
          customers(name)
        `)
        .eq("product_id", id)
        .order("sale_date", { ascending: false });

      if (error) throw error;

      const salesData = (data as unknown as Sale[]) || [];
      setSales(salesData);

      // Calculate statistics
      const totalSales = salesData.reduce((sum, sale) => sum + sale.quantity, 0);
      const totalRevenue = salesData.reduce((sum, sale) => sum + Number(sale.total_price), 0);
      const uniqueCustomers = new Set(salesData.map(sale => sale.customers?.name).filter(Boolean)).size;
      const averagePrice = totalSales > 0 ? totalRevenue / totalSales : 0;

      setStats({
        totalSales,
        totalRevenue,
        averagePrice,
        uniqueCustomers,
      });
    } catch (error) {
      console.error("Error fetching sales:", error);
      toast({
        title: "Erreur",
        description: "Impossible de charger l'historique des ventes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [id, toast]);

  useEffect(() => {
    if (id) {
      fetchProductDetails();
      fetchSales();
    }
  }, [id, fetchProductDetails, fetchSales]);



  if (loading) {
    return (
      <>
        <div className="flex items-center justify-center h-full">
          <div className="text-lg text-muted-foreground">Chargement...</div>
        </div>
      </>
    );
  }

  if (!product) {
    return (
      <>
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold mb-4">Produit non trouvé</h2>
          <Button onClick={() => navigate("/products")}>
            Retour aux produits
          </Button>
        </div>
      </>
    );
  }

  return (
    <>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => navigate("/products")}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-foreground">{product.name}</h1>
            <p className="text-muted-foreground mt-2">
              Détails et statistiques du produit
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <Card>
            <CardContent className="pt-6">
              {product.image_url ? (
                <img
                  src={product.image_url}
                  alt={product.name}
                  className="w-full h-64 object-cover rounded-lg mb-4"
                />
              ) : (
                <div className="w-full h-64 bg-muted rounded-lg flex items-center justify-center mb-4">
                  <Package className="h-16 w-16 text-muted-foreground" />
                </div>
              )}
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Description</h3>
                  <p className="text-sm text-muted-foreground">
                    {product.description || "Aucune description"}
                  </p>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Prix</span>
                  <span className="text-2xl font-bold text-success">
                    {product.price.toLocaleString("fr-FR")}€
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Stock</span>
                  <Badge variant="outline">{product.stock} unités</Badge>
                </div>
                {product.category && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Catégorie</span>
                    <Badge>{product.category}</Badge>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Statistiques de vente</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-success" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Revenu total</p>
                      <p className="text-xl font-bold">
                        {stats.totalRevenue.toLocaleString("fr-FR")}€
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ventes totales</p>
                      <p className="text-xl font-bold">{stats.totalSales}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-info/10 flex items-center justify-center">
                      <DollarSign className="h-5 w-5 text-info" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Prix moyen</p>
                      <p className="text-xl font-bold">
                        {stats.averagePrice.toLocaleString("fr-FR")}€
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                      <Users className="h-5 w-5 text-warning" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Clients uniques</p>
                      <p className="text-xl font-bold">{stats.uniqueCustomers}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Historique des ventes
            </CardTitle>
          </CardHeader>
          <CardContent>
            {sales.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucune vente enregistrée pour ce produit
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Client</TableHead>
                    <TableHead>Quantité</TableHead>
                    <TableHead>Prix unitaire</TableHead>
                    <TableHead>Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sales.map((sale) => (
                    <TableRow key={sale.id}>
                      <TableCell>
                        {new Date(sale.sale_date).toLocaleDateString("fr-FR")}
                      </TableCell>
                      <TableCell>{sale.customers?.name || "N/A"}</TableCell>
                      <TableCell>{sale.quantity}</TableCell>
                      <TableCell>
                        {Number(sale.unit_price).toLocaleString("fr-FR")}€
                      </TableCell>
                      <TableCell className="font-semibold">
                        {Number(sale.total_price).toLocaleString("fr-FR")}€
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default ProductDetails;
