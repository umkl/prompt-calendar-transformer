import Calendar from './features/Calendar';
import useCalendarDayView from './hooks/useCalendarDayView';
import useEvents from './hooks/useEvents';
import usePromptSubmission from './hooks/usePromptSubmission';
import './styles/App.css'
import { getCalendarWeek } from './utils';

export default function App() {
  const { day, nextDay, prevDay } = useCalendarDayView();
  const {insertEvent} = useEvents();
  const { submit, loading } = usePromptSubmission(insertEvent);

  return (
    <div className='h-svh box-border p-4 w-full grid grid-cols-4 grid-rows-[auto_1fr_auto]'>
      <div className='row-start-1 col-span-4 grid-cols-subgrid grid mb-4'>
        <div className='col-span-4'>
          <p>Prompt Calendar Transformer</p>
        </div>
      </div>
      <div className='col-span-4 row-start-2 overflow-y-auto'>
        {day.toDateString()}
        <Calendar />
      </div>
      <div className='col-span-4 text-left row-start-3'>
        <div className='flex flex-row items-center mb-2'>
          <span className='flex-1'>Week {getCalendarWeek(day)}</span>
          <div>
            <button onClick={prevDay} className='size-14'>{"<"}</button>
            <button onClick={nextDay} className='size-14'>{">"}</button>
          </div>
        </div>
        <form className='flex flex-row gap-4' onSubmit={submit}>
          <input type="text" className='flex-1' placeholder='What do you want to do today?' />
          <button type='submit' disabled={loading}>{loading ? 'loading': 'generate'}</button>
        </form>
      </div>
    </div>
  )
}