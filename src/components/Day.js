
import './Day.css';

function formatDate(daysSinceEpoch) {
    const date = new Date(daysSinceEpoch*8.64e7);
    const SEP = '/';
    return date.getUTCDate() + SEP + (date.getUTCMonth() + 1)+ SEP + date.getUTCFullYear();
}

function getTransportDuration(from,to,callback) {
    var request = {
        origin: from.geometry.location, // LatLng|string
        destination: to.geometry.location, // LatLng|string
        travelMode: window.google.maps.DirectionsTravelMode.DRIVING
    };
    
    window.DirectionsService.route( request, function( response, status ) {
    
        if ( status === 'OK' ) {
            var point = response.routes[ 0 ].legs[ 0 ];
            callback(point.duration,point.distance);
        }
    } );
}

function Day(props) {
    const todayItin = props.itinerary.filter(i => i.day === props.date);

    const dayUUID = crypto.randomUUID();

    document.querySelectorAll('.sun-indicator.hotel').forEach(e => {
        e.remove();
    });

    if (props.daysBounds.morning && todayItin.length) {
        getTransportDuration(props.daysBounds.morning.place,todayItin[0].data.place,(dur,dis) => {
            const el = document.getElementById(dayUUID);
            if (!el) return; // shouldn‘t happen but it does . FIX!
            const t = todayItin[0].head*60-dur.value/60;
            const line = document.createElement('div');
            line.className = 'sun-indicator hotel';
            line.style = `top:${(t/60-6)/18*100}%;border-color:cyan;color:cyan;`;
            line.innerHTML = `<small>
                Leave Hotel at ${Math.floor(t / 60) + ':' + Math.round(t % 60)}
            </small>`;
            el.appendChild(line);
        });
    }
    if (props.daysBounds.night && todayItin.length) {
        getTransportDuration(todayItin[0].data.place,props.daysBounds.night.place,(dur,dis) => {
            const el = document.getElementById(dayUUID);
            if (!el) return; // shouldn‘t happen but it does . FIX!
            const t = todayItin[0].tail*60+dur.value/60;
            const line = document.createElement('div');
            line.className = 'sun-indicator hotel';
            line.style = `top:${(t/60-6)/18*100}%;border-color:cyan;color:cyan;`;
            line.innerHTML = `<small>
                Arrive at Hotel at ${Math.floor(t / 60) + ':' + Math.round(t % 60)}
            </small>`;
            el.appendChild(line);
        });
    }

    return (
        <div className='Day' date={formatDate(props.date)} onMouseUp={props.onMouseUp} id={dayUUID}>
            <div className='sun-indicator' style={{top:'1.75rem'}}><small>Sunrise</small> ☀️ <small>7:25 AM</small></div>
            <div className='sun-indicator' style={{bottom:'3.5rem'}}><small>Sunset</small> ☀️ <small>8:17 PM</small></div>
            {
                [6.5,7.5,8.5,9.5,10.5,11.5,12.5,13.5,14.5,15.5,16.5,17.5,18.5,19.5,20.5,21.5,22.5,23.5].map((t) => {
                    const temp = Math.round((2+Math.sin(t/12*Math.PI/2))/3*85 * (50 + props.date % 5) / 55); // mock data
                    return (<div style={{fontSize:'0.75rem',width:'100%'}}>
                        <span style={{color:`hsl(${360-temp*4},100%,50%)`}}>{temp}º</span>
                        <div className='float-end text-muted' style={{position:'relative',bottom:'0.25rem'}}>
                            <sup>{Math.floor(t-1) % 12 +1}:00</sup>
                        </div>
                    </div>)
                })
            }
            {
                props.itinerary.map(i => {
                    if (props.date != i.day) return;
                    return (
                        <div className='calendar-block' style={{
                            top:(i.head-6)/18*100+'%',
                            height:(i.tail-i.head)/18*100+'%',
                        }}>
                            <h6>{i.data.name}</h6>
                            <p>
                                <small>Duration : {Math.round((i.tail-i.head)*10)/10} hours</small>
                            </p>
                        </div>
                    )
                })
            }
            {
                todayItin.sort((a,b) => a.head - b.head).map((item,index) => {
                    if (index === todayItin.length - 1) return;
                    const uuid = crypto.randomUUID();
                    const gapInMinutes = todayItin[index+1].head*60-item.tail*60;
                    const top = ((todayItin[index+1].head + item.tail) / 2 - 6) / 18;
                    getTransportDuration(todayItin[index+1].data.place,item.data.place,(dur,dis) => {
                        const el = document.getElementById(uuid);
                        if (!el) return; // shouldn‘t happen but it does . FIX!
                        el.innerHTML = `Min Travel Time : ${dur.text} ( ${dis.text} )`;
                        if (dur.value/60 > gapInMinutes)
                            el.style.color = 'red';
                    });
                    return (
                        <div className='travel-time-notice' style={{top:top*100+'%'}}><small id={uuid}></small></div>
                    );
                })
            }
        </div>
    );
}

export default Day;
