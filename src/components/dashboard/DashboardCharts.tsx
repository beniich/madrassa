import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const attendanceData = [
  { classe: "6A", presence: 95 },
  { classe: "6B", presence: 88 },
  { classe: "5A", presence: 92 },
  { classe: "5B", presence: 87 },
  { classe: "4A", presence: 90 },
  { classe: "4B", presence: 78 },
  { classe: "3A", presence: 94 },
  { classe: "3B", presence: 91 },
];

const performanceData = [
  { month: "Sept", moyenne: 11.2 },
  { month: "Oct", moyenne: 12.1 },
  { month: "Nov", moyenne: 12.8 },
  { month: "Déc", moyenne: 13.4 },
  { month: "Jan", moyenne: 13.2 },
  { month: "Fév", moyenne: 13.8 },
];

const distributionData = [
  { name: "Excellent (>16)", value: 15, color: "hsl(var(--primary))" },
  { name: "Bien (14-16)", value: 25, color: "hsl(142, 76%, 36%)" },
  { name: "Moyen (10-14)", value: 40, color: "hsl(48, 96%, 53%)" },
  { name: "Insuffisant (<10)", value: 20, color: "hsl(var(--destructive))" },
];

const DashboardCharts = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {/* Attendance by Class */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Présence par Classe</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={attendanceData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis type="number" domain={[0, 100]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis dataKey="classe" type="category" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="presence"
                fill="hsl(var(--primary))"
                radius={[0, 4, 4, 0]}
                name="Présence %"
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Performance Evolution */}
      <Card className="lg:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Évolution Moyenne</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={performanceData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis dataKey="month" tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <YAxis domain={[10, 15]} tick={{ fill: "hsl(var(--muted-foreground))" }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="moyenne"
                stroke="hsl(var(--primary))"
                strokeWidth={3}
                dot={{ fill: "hsl(var(--primary))", strokeWidth: 2, r: 4 }}
                name="Moyenne /20"
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Grade Distribution */}
      <Card className="lg:col-span-2 xl:col-span-1">
        <CardHeader>
          <CardTitle className="text-lg">Répartition des Notes</CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                data={distributionData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                paddingAngle={2}
                dataKey="value"
              >
                {distributionData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          <div className="grid grid-cols-2 gap-2 mt-4">
            {distributionData.map((item, index) => (
              <div key={index} className="flex items-center gap-2 text-sm">
                <div
                  className="w-3 h-3 rounded-full"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-muted-foreground truncate">{item.name}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardCharts;
