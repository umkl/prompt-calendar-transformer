import { StarsIcon } from 'lucide-react';
import { Button } from './comps/ui/button';
import { BookmarkSquareIcon, ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/16/solid';
import Calendar from './features/Calendar';
import useCalendarDayView from './hooks/useCalendarDayView';
import useEvents from './hooks/useEvents';
import usePromptSubmission from './hooks/usePromptSubmission';
import './styles/App.css';
import { getCalendarWeek } from './utils';
import { IOSLoader } from './comps/loading';

export default function App() {
  const { day, nextDay, prevDay } = useCalendarDayView();
  const {insertEvent,isLocalStorageStale, persistInLocalStorageAction} = useEvents();
  const { submit, loading } = usePromptSubmission(insertEvent, day);

  return (
    <div className='h-svh box-border p-4  w-full grid grid-cols-4 grid-rows-[auto_1fr_auto]'>
      <div className='row-start-1 col-span-4 grid-cols-subgrid grid '>
        <div className='col-span-4 bg-secondary rounded-2xl p-4 text-left text-2xl flex flex-row justify-between items-center'>
          <p className='font-bold'>Prompt Calendar Transformer</p>
          <div className='text-right'>
            <p className='font-medium text-muted-foreground text-base'>Model: gemini-2.0-flash</p>
            <p className='font-medium text-muted-foreground text-base'>Version:  {__APP_VERSION__}</p>
          </div>
        </div>
      </div>
      <div className='col-span-4 row-start-2 py-4 overflow-hidden'>
        <div className='overflow-hidden h-full flex flex-col bg-secondary rounded-xl p-4'>
          <div className='flex flex-row items-center justify-between mb-2 z-50'>
            <span className=' text-2xl font-semibold text-secondary-foreground'>W {getCalendarWeek(day)}</span>
            <p className='text-xl'>{day.toDateString()}</p>
            <div className='flex gap-2'>
              <Button onClick={prevDay} size={"icon-lg"}><ChevronLeftIcon/></Button>
              <Button onClick={nextDay} size={"icon-lg"}><ChevronRightIcon/></Button>
            </div>
          </div>
          
          <div className='h-full overflow-scroll hide-scrollbar'>
            <Calendar highlightedDay={day} />
          </div>
        </div>
      </div>
      <div className='col-span-4 text-left row-start-3'>
       
        <form className='bg-secondary rounded-2xl p-4 flex flex-col gap-2 focus-within:border-ring focus-within:ring-ring/50 focus-within:ring-[3px]' onSubmit={submit}>
          <input type="text" className='flex-1 appearance-none outline-none' placeholder='What do you want to do today?' ></input>
          <div className='flex gap-2 justify-end'>
            <Button 
              disabled={isLocalStorageStale}
              onClick={persistInLocalStorageAction}>
              {isLocalStorageStale ? 'save changes' : 'all changes saved'}
              <BookmarkSquareIcon fontVariant={'filled'}/>
              </Button>
            <Button type='submit' disabled={loading}>
              {loading ? 'loading': 'generate'}
              {loading ? <IOSLoader/> :<StarsIcon fill=''/>}
              </Button>
          </div>
        </form>
      </div>
    </div>
  )
}