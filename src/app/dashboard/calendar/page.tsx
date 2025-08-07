'use client';
import { useState } from 'react';
import { Calendar, DateLocalizer, dateFnsLocalizer, View } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { tr } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';

interface Event {
  title: string;
  start: Date;
  end: Date;
  resourceId?: number;
  color?: string;
}

const locales = {
  'tr': tr,
};

const localizer: DateLocalizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek: () => startOfWeek(new Date(), { weekStartsOn: 1 }),
  getDay,
  locales,
});

// Örnek etkinlikler
const events: Event[] = [
  {
    title: 'Pilates Dersi - Ahmet Yılmaz',
    start: new Date(2024, 0, 15, 10, 0),
    end: new Date(2024, 0, 15, 11, 0),
    resourceId: 1,
    color: '#9333ea',
  },
  {
    title: 'Pilates Dersi - Ayşe Demir',
    start: new Date(2024, 0, 15, 14, 0),
    end: new Date(2024, 0, 15, 15, 0),
    resourceId: 2,
    color: '#ea4899',
  },
];

export default function CalendarPage() {
  const [view, setView] = useState<View>('week');

  // Takvim başlıklarını Türkçeleştirme
  const messages = {
    week: 'Hafta',
    day: 'Gün',
    month: 'Ay',
    previous: 'Önceki',
    next: 'Sonraki',
    today: 'Bugün',
    agenda: 'Ajanda',
    showMore: (total: number) => `+${total} daha`,
    noEventsInRange: 'Bu aralıkta ders bulunmuyor.',
    allDay: 'Tüm gün',
  };

  // Çalışma saatlerini belirleme (09:00 - 22:00)
  const minTime = new Date();
  minTime.setHours(9, 0, 0); // 09:00
  const maxTime = new Date();
  maxTime.setHours(22, 0, 0); // 22:00

  const handleSelectEvent = (event: Event) => {
    console.log('Seçilen etkinlik:', event);
  };

  const handleSelectSlot = (slotInfo: {
    start: Date;
    end: Date;
    slots: Date[];
    action: 'select' | 'click' | 'doubleClick';
  }) => {
    console.log('Seçilen zaman aralığı:', slotInfo);
  };

  // Pazar günü hariç günleri göster
  const views = {
    week: true,
    day: true,
  };

  return (
    <div className="h-[calc(100vh-2rem)]">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-900">Ders Programı</h1>
        <button
          className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          onClick={() => {/* Yeni ders ekleme modalını aç */}}
        >
          Yeni Ders Ekle
        </button>
      </div>

      <div className="bg-white p-4 rounded-lg shadow h-[calc(100vh-10rem)]">
        <Calendar
          localizer={localizer}
          events={events}
          startAccessor="start"
          endAccessor="end"
          defaultView="week"
          views={views}
          min={minTime}
          max={maxTime}
          messages={messages}
          formats={{
            timeGutterFormat: (date: Date) => format(date, 'HH:mm'),
            eventTimeRangeFormat: ({ start, end }: { start: Date; end: Date }) =>
              `${format(start, 'HH:mm')} - ${format(end, 'HH:mm')}`,
            dayFormat: (date: Date) => format(date, 'EEEE', { locale: tr }),
          }}
          eventPropGetter={(event: Event) => ({
            style: {
              backgroundColor: event.color,
            },
          })}
          onSelectEvent={handleSelectEvent}
          onSelectSlot={handleSelectSlot}
          selectable
          step={60}
          timeslots={1}
          culture="tr"
          className="h-full"
          workingDays={[1, 2, 3, 4, 5, 6]}
        />
      </div>
    </div>
  );
} 