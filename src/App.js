
import './App.css';

import Map from './components/Map.js';
import Calendar from './components/Calendar.js';

function App() {
  return (
    <main className="App">
      <section>
        <Map/>
      </section>
      <section className='calendar-container bg-dark shadow-lg'>
        <Calendar/>
      </section>
    </main>
  );
}

export default App;
