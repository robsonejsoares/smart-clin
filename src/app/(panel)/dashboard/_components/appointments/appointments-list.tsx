"use client"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

import { format } from 'date-fns'
import { useQuery } from '@tanstack/react-query'
import { useSearchParams } from 'next/navigation'
import { ScrollArea } from '@/components/ui/scroll-area'


interface AppointmentsListProps {
  times: string[]
}

export function AppointmentsList({ times }: AppointmentsListProps) {

  const searchParams = useSearchParams();
  const date = searchParams.get("date")

  const { data, isLoading } = useQuery({
    queryKey: ["get-appointments", date],
    queryFn: async () => {

      let activeDate = date;

      if (!activeDate) {
        const today = format(new Date(), "yyyy-MM-dd");
        activeDate = today;
      }

      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/appointments?date=${activeDate}`;
      const response = await fetch(url)
      const json = await response.json();

      if (!response.ok) {
        return []
      }

      return json;
    }
  })


  return (
    <Card>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xl md:text-2xl font-bold'>
          Agendamentos
        </CardTitle>

        <button>Selecionar Data</button>
      </CardHeader>

      <CardContent>
        <ScrollArea className='h-[calc(100vh-20rem)] lg:h-[calc(100vh-15rem)] pr-4'>
          {times.map((slot) => {

            return (
              <div
                key={slot}
                className='flex items-center py-2 border-t last:border-b'
              >
                <div className='w-16 text-sm font-semibold'>{slot}</div>
                <div className='flex-1 text-sm text-gray-500'>
                  Disponível
                </div>
              </div>
            )
          })}
        </ScrollArea>
      </CardContent>

    </Card>
  )
}