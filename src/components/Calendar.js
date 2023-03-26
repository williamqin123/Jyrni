
import './Calendar.css';

import Day from './Day.js';

import React, { Component } from "react";

class Calendar extends React.Component {

    constructor() {
        super();
        this.state = {
            arrival:null,
            departure:null,
            itinerary:[],
            days:[],
            daysBounds:[],

            grabIndex:null,
            grabProp:null,
            grabPos:0
        };
    }

    dateToDay(d) {
        return Math.floor((new Date(d)).getTime()/8.64e7);
    }

    onTimesChange() {
        if (!this.state.arrival || !this.state.departure) {
            return;
        }
        const d = [];
        for (let i = this.state.arrival; i <= this.state.departure; ++i) {
            d.push(i);
        }
        this.setState({days:d,daysBounds:d.map(_ => ({}))});
    }

    render() {

        return (
            <div className="Calendar">
                <div className='schedule' key={this.state.days && this.state.itinerary} onMouseDown={(e) => {
                    const clicked = document.elementFromPoint(e.clientX,e.clientY);
                    if (!clicked.classList.contains('calendar-block')) return;
                    const {top,bottom} = clicked.getBoundingClientRect();
                    this.setState({
                        grabProp:e.clientY <= ((top + bottom) / 2) ? 'head':'tail',
                        grabIndex:this.state.itinerary.findIndex(v => v.data.name == clicked.firstChild.innerHTML.trim()),
                        grabPos:e.clientY
                    });
                }} onMouseMove={(e) => {
                    if (this.state.grabIndex == null) return;
                    const delta = e.clientY - this.state.grabPos;
                    this.state.itinerary[this.state.grabIndex][this.state.grabProp] += delta / 25;
                    switch (this.state.grabProp) {
                        case 'head':
                            this.state.itinerary[this.state.grabIndex][this.state.grabProp] = Math.min(
                                this.state.itinerary[this.state.grabIndex][this.state.grabProp],
                                this.state.itinerary[this.state.grabIndex].tail
                            );
                            break;
                        case 'tail':
                            this.state.itinerary[this.state.grabIndex][this.state.grabProp] = Math.max(
                                this.state.itinerary[this.state.grabIndex][this.state.grabProp],
                                this.state.itinerary[this.state.grabIndex].head
                            );
                            break;
                    }
                    this.setState({
                        grabPos:e.clientY,
                        itinerary:this.state.itinerary,
                    });
                }}>
                    {
                        this.state.days.map((d,i) => {
                            return (
                                <div style={{display:'flex',alignItems:'center'}}>
                                    <Day date={d} itinerary={this.state.itinerary} daysBounds={this.state.daysBounds[i]} onMouseUp={() => {
                                        if (window.dragged) {
                                            this.state.itinerary.push({
                                                day:d,
                                                head:12,
                                                tail:14,
                                                data:window.dragged
                                            });
                                            window.dragged = null;
                                        } else {
                                            this.setState({
                                                grabIndex:null,
                                                grabProp:null,
                                                grabPos:0,
                                            });
                                        }
                                        this.setState({itinerary:this.state.itinerary});
                                    }}/>
                                    {
                                        (i < this.state.days.length - 1) ? (
                                            <div className='overnight-blob' onMouseUp={(e) => {
                                                this.state.daysBounds[i].night = window.dragged;
                                                this.state.daysBounds[i+1].morning = window.dragged;
                                                this.setState({daysBounds:this.state.daysBounds});
                                                e.target.style.backgroundImage = `url("${window.dragged.photoURL}")`;
                                            }}></div>
                                        ) : null
                                    }
                                </div>
                            );
                        })
                    }
                </div>
                <footer className='trip-dates'>
                    <div className="input-group text-light">
                        <div className="form-floating">
                            <input type="date" className="form-control bg-dark text-white" onChange={(e) => {
                                this.setState({arrival:this.dateToDay(e.target.value)},() => {
                                    this.onTimesChange();
                                });
                            }}/>
                            <label>Trip’s Start Date & Time</label>
                        </div>
                        <span className="input-group-text bg-dark text-light">to</span>
                        <div className="form-floating">
                            <input type="date" className="form-control bg-dark text-white" onChange={(e) => {
                                this.setState({departure:this.dateToDay(e.target.value)},() => {
                                    this.onTimesChange();
                                });
                                this.onTimesChange();
                            }}/>
                            <label>Trip’s End Date & Time</label>
                        </div>
                    </div>
                </footer>
            </div>
        );

    }
}

export default Calendar;
