import { StarsIcon } from 'lucide-react';
import { Button } from './components/ui/button';
import { BookmarkSquareIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import { persistKey } from './const/local-storage';
import Calendar from './features/Calendar';
import useCalendarDayView from './hooks/useCalendarDayView';
import useEvents from './hooks/useEvents';
import usePromptSubmission from './hooks/usePromptSubmission';
import { storeObjectInLocalStorage } from './repo/local-storage';
import './styles/App.css';
import { getCalendarWeek } from './utils';

export default function App() {
  const { day, nextDay, prevDay } = useCalendarDayView();
  const {events, insertEvent} = useEvents();
  const { submit, loading } = usePromptSubmission(insertEvent, day);

  return (
    <div className='h-svh box-border p-4  w-full grid grid-cols-4 grid-rows-[auto_1fr_auto]'>
      <div className='row-start-1 col-span-4 grid-cols-subgrid grid '>
        <div className='col-span-4 bg-secondary rounded-2xl p-4 text-left text-2xl flex flex-row justify-between items-center'>
          <p className='font-bold'>Prompt Calendar Transformer</p>
          <p className='font-semibold text-muted-foreground text-base'>Model: gemini-2.0-flash</p>
        </div>
      </div>
      <div className='col-span-4 row-start-2 py-4 overflow-hidden'>
        <div className='overflow-y-scroll h-full hide-scrollbar bg-secondary rounded-xl p-4'>
          <div className='flex flex-row items-center mb-2 sticky top-0 z-50'>
            <span className='flex-1'>Week {getCalendarWeek(day)}</span>
            <div className='flex gap-2'>
              <Button onClick={prevDay} 
              size={"icon-lg"}><ChevronLeftIcon/></Button>
              <Button onClick={nextDay} size={"icon-lg"}><ChevronRightIcon/></Button>
            </div>
          </div>
            <Calendar highlightedDay={day} />
        </div>
      </div>
      <div className='col-span-4 text-left row-start-3'>
       
        <form className='bg-secondary rounded-2xl p-4 flex flex-col gap-2 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]' onSubmit={submit}>
          <input className='flex-1 appearance-none outline-none' placeholder='What do you want to do today?' ></input>
          <div className='flex gap-2 justify-end'>
            <Button 
              onClick={()=>{
              console.log("persist");
              storeObjectInLocalStorage(persistKey, events);
            }}>
              persist
              <BookmarkSquareIcon fontVariant={'filled'}/>
              </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'loading': 'generate'}
              <StarsIcon fill=''/>
              </Button>
          </div>
        </form>
      </div>
    </div>
  )
}