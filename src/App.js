import React, { Component } from 'react';
import logo from './airplane.png';
import './App.css';
import Select from 'react-select';
import airlines from "./airlines";
import airports from "./airports"
import DatePicker from 'react-datepicker';
import moment from 'moment';
import {stringify} from "qs";
import checkmark from "./check-mark.svg"
import xmark from "./x-mark.svg"
import warning from "./warning.svg"

class App extends Component {
  state = {
    airline: '',
    airport: '',
    departure: moment(),
    results: undefined
  };

  onDepartureChange = (departure) => {
    this.setState({departure});
  };

  onAirlineChange = (airline) => {
    this.setState({airline});
  };

  onAirportChange = (airport) => {
    this.setState({airport});
  };

  airlineOptions = () => {
    return Object.keys(airlines).map((key) => {
      return {
        value: key,
        label: key + " - " + airlines[key],
      }
    });
  };

  airportOptions = () => {
    return airports.map((data) => {
      const { code, name, city, state } = data;
      return {
        value: code,
        label: code + " - " + name + " (" + city + ", " + state + ")"
      }
    });
  };

  onFormSubmit = (e) => {
    e.preventDefault();

    const { departure, airport, airline } = this.state;

    const airportValue = airport.value;
    const airlineValue = airline.value;

    const dayOfWeek = departure.day();
    const day = departure.date();
    const month = departure.month();

    const params = {
      Day: day,
      Month: month,
      DayOfWeek: dayOfWeek,
      Airport: airportValue,
      Airline: airlineValue,
    };

    fetch('http://localhost:1234/classify?' + stringify(params))
        .then(async (res) => {
          const json = JSON.parse(await res.text());
          this.setState({
            results: json
          })
        });
  };

  renderResult = () => {
    const { results } = this.state;

    if (!results)
      return null;

    const { classification, error } = results;


    if (error) {
      return (
          <div className='results'>
            <div className='result-text'>
              Please fill out every form field.
            </div>
          </div>
      )
    }
    else if (classification) {
      return (
          <div className='results'>
            <img src={warning} style={{width: "64px", height: "64px"}}/>
            <div className='result-text'>
              Based on our data, we predict your flight will be delayed!
            </div>
          </div>
      )
    }
    else {
      return (
          <div className='results'>
            <img src={checkmark} style={{width: "64px",  height: "64px"}}/>
            <div className='result-text'>
              Based on our data, we predict no delays for your flight.
            </div>
          </div>
      )
    }
  };

  render() {
    const { airline, airport, departure, results } = this.state;
    const airlineValue = airline && airline.value;
    const airportValue = airport && airport.value;

    return (
      <div className='App'>
        <header className='App-header'>
          <img src={logo} className='App-logo' alt='logo' />
          <h1 className='App-title'>
            Flight Delay Predictor
          </h1>
        </header>
        <div className='App-intro'>
          <p>
            Flights are delayed for a number of reasons and cause issues with millions of travelers every day.
          </p>
          <p>
            Using a data set of domestic flights in the United States we trained a decision tree to classify
            whether a flight is on time or delayed. We have a classification accuracy of ~70% when testing the
            tree on the training data set.
          </p>

          <form onSubmit={this.onFormSubmit}>
            <div className='field'>
              <label>Airline</label>
              <Select
                  placeholder='Select an airline...'
                  value={airlineValue}
                  onChange={this.onAirlineChange}
                  options={this.airlineOptions()}/>
            </div>

            <div className='field'>
              <label>Airport</label>
              <Select
                  placeholder='Select an airport...'
                  value={airportValue}
                  onChange={this.onAirportChange}
                  options={this.airportOptions()}/>
            </div>
            <div className='field'>
              <label>Departure</label>
              <DatePicker
                  placeholderText='Select your departure...'
                  className='date-picker'
                  selected={departure}
                  onChange={this.onDepartureChange}/>
            </div>
            <input className='submit-btn' type="submit" value="Submit"/>
          </form>

          <br/>

          {this.renderResult()}

          <pre className='data'>
            {JSON.stringify(results)}
          </pre>
        </div>

      </div>
    );
  }
}

export default App;
