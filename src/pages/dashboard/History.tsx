import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { usePredictions, useSensorHistory } from "@/hooks/useDashboardData";
import { Download } from "lucide-react";
import { toast } from "sonner";

function downloadCsv(filename: string, rows: Record<string, unknown>[]) {
  if (rows.length === 0) {
    toast.info("No data to export");
    return;
  }
  const headers = Object.keys(rows[0]);
  const csv = [
    headers.join(","),
    ...rows.map((r) => headers.map((h) => JSON.stringify(r[h] ?? "")).join(",")),
  ].join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function History() {
  const { data: predictions } = usePredictions(50);
  const { data: sensors } = useSensorHistory(100);

  const diseaseCounts = predictions.reduce<Record<string, number>>((acc, p) => {
    acc[p.predicted_class] = (acc[p.predicted_class] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="space-y-6 max-w-7xl">
      <div>
        <h2 className="font-display text-2xl font-bold">History & Reports</h2>
        <p className="text-sm text-muted-foreground">CNN predictions and sensor logs</p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base">Disease Prediction History</CardTitle>
              <CardDescription>{predictions.length} records</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => downloadCsv("predictions.csv", predictions)}>
              <Download className="w-3 h-3" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {Object.keys(diseaseCounts).length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {Object.entries(diseaseCounts).map(([k, v]) => (
                <Badge key={k} variant="outline">{k}: {v}</Badge>
              ))}
            </div>
          )}
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Image</TableHead>
                  <TableHead>Disease</TableHead>
                  <TableHead>Confidence</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Captured</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {predictions.length === 0 ? (
                  <TableRow><TableCell colSpan={5} className="text-center text-muted-foreground py-6">No predictions yet</TableCell></TableRow>
                ) : (
                  predictions.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        {p.image_url ? (
                          <img src={p.image_url} alt={p.predicted_class} className="w-12 h-12 rounded object-cover" />
                        ) : "—"}
                      </TableCell>
                      <TableCell className="font-medium">{p.predicted_class}</TableCell>
                      <TableCell>{(p.confidence * 100).toFixed(1)}%</TableCell>
                      <TableCell>
                        <Badge className={p.is_healthy ? "bg-primary text-primary-foreground" : "bg-destructive text-destructive-foreground"}>
                          {p.is_healthy ? "Healthy" : "Diseased"}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(p.created_at).toLocaleString()}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div>
              <CardTitle className="text-base">Sensor Logs</CardTitle>
              <CardDescription>Last {sensors.length} readings</CardDescription>
            </div>
            <Button variant="outline" size="sm" className="gap-1" onClick={() => downloadCsv("sensors.csv", sensors)}>
              <Download className="w-3 h-3" /> Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Time</TableHead>
                  <TableHead>Device</TableHead>
                  <TableHead>Soil %</TableHead>
                  <TableHead>Temp °C</TableHead>
                  <TableHead>Humidity %</TableHead>
                  <TableHead>Light lux</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sensors.length === 0 ? (
                  <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-6">No readings yet</TableCell></TableRow>
                ) : (
                  [...sensors].reverse().map((s) => (
                    <TableRow key={s.id}>
                      <TableCell className="text-sm">{new Date(s.recorded_at).toLocaleString()}</TableCell>
                      <TableCell className="font-mono text-xs">{s.device_id}</TableCell>
                      <TableCell>{s.soil_moisture ?? "—"}</TableCell>
                      <TableCell>{s.temperature ?? "—"}</TableCell>
                      <TableCell>{s.humidity ?? "—"}</TableCell>
                      <TableCell>{s.light_intensity ?? "—"}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}