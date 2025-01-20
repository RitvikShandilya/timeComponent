import { useState } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { cn } from '@/lib/utils';

const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'] as const;
type Day = (typeof DAYS)[number];

// Generate realistic data pattern with peak around noon
const generateDayData = (day: Day) => {
  const times = [];
  const baseValues = {
    '11:00': 15, '11:15': 20, '11:30': 25, '11:45': 35,
    '12:00': 85, '12:15': 100, '12:30': 80, '12:45': 45,
    '13:00': 25, '13:15': 20, '13:30': 15
  };
  
  // Add some randomness while maintaining the general pattern
  for (let hour = 11; hour <= 13; hour++) {
    for (let minute = 0; minute < 60; minute += 15) {
      const timeKey = `${hour}:${minute.toString().padStart(2, '0')}`;
      const baseValue = baseValues[timeKey] || 20;
      const randomFactor = 0.9 + Math.random() * 0.2; // ±10% variation
      times.push({
        time: timeKey,
        value: Math.round(baseValue * randomFactor),
      });
    }
  }
  return times;
};

const DATA = DAYS.reduce((acc, day) => {
  acc[day] = generateDayData(day);
  return acc;
}, {} as Record<Day, { time: string; value: number }[]>);

export function PopularTimesChart() {
  const [selectedDay, setSelectedDay] = useState<Day>('TUE');

  return (
    <Card className="w-full max-w-3xl bg-white shadow-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-[28px] font-bold text-gray-900">Popular times</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs
          value={selectedDay}
          onValueChange={(value) => setSelectedDay(value as Day)}
          className="mb-12"
        >
          <TabsList className="w-full justify-between bg-transparent border-none">
            {DAYS.map((day) => (
              <TabsTrigger
                key={day}
                value={day}
                className={cn(
                  'relative px-4 py-2 text-base font-medium data-[state=active]:bg-transparent data-[state=active]:shadow-none',
                  selectedDay === day
                    ? 'text-gray-900 after:absolute after:bottom-[-2px] after:left-0 after:right-0 after:h-0.5 after:bg-[#F9A8A8]'
                    : 'text-gray-500'
                )}
              >
                {day}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>

        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={DATA[selectedDay]}
              margin={{ top: 10, right: 30, left: 0, bottom: 20 }}
              barSize={16}
            >
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="#E5E7EB"
                opacity={0.5}
              />
              <XAxis
                dataKey="time"
                axisLine={false}
                tickLine={false}
                tick={{ fill: '#6B7280', fontSize: 14 }}
                dy={10}
              />
              <YAxis hide={true} domain={[0, 100]} />
              <Tooltip
                cursor={{ fill: 'transparent' }}
                contentStyle={{
                  backgroundColor: '#FFF',
                  border: 'none',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  padding: '8px 12px',
                }}
                labelStyle={{ color: '#111827', marginBottom: '4px' }}
                itemStyle={{ color: '#F9A8A8', padding: 0 }}
              />
              <Bar
                dataKey="value"
                fill="#F9A8A8"
                radius={[4, 4, 0, 0]}
                animationDuration={300}
              >
                {DATA[selectedDay].map((entry, index) => (
                  <rect
                    key={`bar-${index}`}
                    fill={entry.value > 70 ? '#F9A8A8' : entry.value > 40 ? '#FBD5D5' : '#FEE2E2'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}