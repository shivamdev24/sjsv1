"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  XAxis,
  YAxis,
} from "recharts";
import {
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

const revenueData = [
  { month: "May", revenue: 18000 },
  { month: "Jun", revenue: 24500 },
  { month: "Jul", revenue: 21000 },
  { month: "Aug", revenue: 32000 },
  { month: "Sep", revenue: 28500 },
  { month: "Oct", revenue: 42000 },
];

const activityData = [
  { month: "May", orders: 12, bookings: 18 },
  { month: "Jun", orders: 19, bookings: 24 },
  { month: "Jul", orders: 15, bookings: 21 },
  { month: "Aug", orders: 28, bookings: 32 },
  { month: "Sep", orders: 24, bookings: 29 },
  { month: "Oct", orders: 35, bookings: 41 },
];

const productData = [
  { name: "Physical", value: 45, fill: "var(--color-physical)" },
  { name: "Digital", value: 30, fill: "var(--color-digital)" },
  { name: "Service", value: 25, fill: "var(--color-service)" },
];

const revenueConfig = {
  revenue: { label: "Revenue", color: "var(--chart-1)" },
} satisfies ChartConfig;

const activityConfig = {
  orders: { label: "Orders", color: "var(--chart-1)" },
  bookings: { label: "Bookings", color: "var(--chart-2)" },
} satisfies ChartConfig;

const productConfig = {
  physical: { label: "Physical", color: "var(--chart-1)" },
  digital: { label: "Digital", color: "var(--chart-2)" },
  service: { label: "Service", color: "var(--chart-3)" },
} satisfies ChartConfig;

export function DashboardCharts() {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-lg font-semibold tracking-tight">
          Analytics overview
        </h2>
        <p className="text-sm text-muted-foreground">
          Revenue, orders, bookings and product distribution.
        </p>
      </div>

      <div className="grid gap-4 xl:grid-cols-7">
        <Card className="xl:col-span-4">
          <CardHeader>
            <CardTitle>Revenue trend</CardTitle>
            <CardDescription>Monthly revenue in INR</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={revenueConfig} className="h-[280px] w-full">
              <AreaChart data={revenueData} accessibilityLayer>
                <defs>
                  <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.3}
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--color-revenue)"
                      stopOpacity={0.02}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid vertical={false} strokeDasharray="3 3" />
                <XAxis
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `₹${value / 1000}k`}
                  width={55}
                />
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      formatter={(value) =>
                        `₹${Number(value).toLocaleString("en-IN")}`
                      }
                    />
                  }
                />
                <Area
                  dataKey="revenue"
                  type="monotone"
                  stroke="var(--color-revenue)"
                  fill="url(#revenueFill)"
                  strokeWidth={2}
                />
              </AreaChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card className="xl:col-span-3">
          <CardHeader>
            <CardTitle>Product distribution</CardTitle>
            <CardDescription>Products by type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={productConfig}
              className="mx-auto h-[280px] w-full"
            >
              <PieChart accessibilityLayer>
                <Pie
                  data={productData}
                  dataKey="value"
                  nameKey="name"
                  innerRadius={65}
                  outerRadius={100}
                  paddingAngle={4}
                  strokeWidth={3}
                >
                  {productData.map((entry) => (
                    <Cell key={entry.name} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
                <ChartLegend content={<ChartLegendContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Orders and bookings</CardTitle>
          <CardDescription>Monthly activity comparison</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={activityConfig} className="h-[300px] w-full">
            <BarChart data={activityData} accessibilityLayer>
              <CartesianGrid vertical={false} strokeDasharray="3 3" />
              <XAxis
                dataKey="month"
                tickLine={false}
                axisLine={false}
                tickMargin={8}
              />
              <YAxis tickLine={false} axisLine={false} allowDecimals={false} />
              <ChartTooltip content={<ChartTooltipContent />} />
              <ChartLegend content={<ChartLegendContent />} />
              <Bar
                dataKey="orders"
                fill="var(--color-orders)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="bookings"
                fill="var(--color-bookings)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </section>
  );
}
