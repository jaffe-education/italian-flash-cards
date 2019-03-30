import React, { Component } from 'react';
import Tabletop from 'tabletop'
import './App.css';
const TIMEOUT = 2000;

class App extends Component {

  constructor(props) {
    super(props);
    this.state = {
      data: [],
      answer: '',
      language: '',
      index: null,
      correct: false,
      checking: false
    }
    this.onChange = this.onChange.bind(this);
    this.check = this.check.bind(this);
    this.getNewWord = this.getNewWord.bind(this);
    this.validate = this.validate.bind(this)
    this.init()
  }

  init() {
    let _this = this;
    Tabletop.init({
      key: 'https://docs.google.com/spreadsheets/d/1_aq3U_NKEGYHn1Tm9_QtYUhpdbiLdMpdxUocBsNgKbY/edit?usp=sharing',
      // key: 'https://docs.google.com/spreadsheets/d/1_aq3U_NKEGYHn1Tm9_QtYUhpdbiLdMpdxUocBsNgKbY',
      // key: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRfMvaUHHC2pEa1fWO5UEAivDUKeO2j9RZKwFMTG5hNJHTwmJ6lEsZIRNcZ2EeGYRTnKFFyJm9OoLRF/pubhtml',
      // key: 'https://docs.google.com/spreadsheets/d/0AmYzu_s7QHsmdDNZUzRlYldnWTZCLXdrMXlYQzVxSFE/pubhtml',
      callback: function(data, tabletop) {
        _this.setState({data: tabletop.sheets().Words.elements})
        _this.getNewWord();
      },
      simpleSheet: true
    })
  }

  getNewWord() {
    let language = (Math.random() > 0.50) ? 'English' : 'Italian';
    let index = parseInt(Math.random() * this.state.data.length, 10);
    this.setState({language, index, answer: ''})
  }

  onChange(evt) {
    this.setState({answer: evt.currentTarget.value})
  }

  check() {
    let _this = this

    if (this.validate()) {
      this.setState({
        checking: true,
        correct: true
      })
    } else {
      this.setState({
        checking: true,
        correct: false
      })
    }
    setTimeout(() => {
      if (_this.state.correct) {
        this.getNewWord()
      }
      _this.setState({
        checking: false,
        answer: ''
      })
    }, TIMEOUT)
  }

  validate() {
    let langToCheck = (this.state.language === 'English') ? 'Italian' : 'English'
    let key = this.state.data[this.state.index][langToCheck]
    return key === this.state.answer
  }

  render() {
    let statusText = null;
    if (this.state.checking) {
      statusText = (this.state.correct) ?
        <div className="correct"><span>Correct!</span></div> :
        <div className="incorrect"><span>Incorrect... try again</span></div>
    }
    if (this.state.data.length > 0 && this.state.index !== null) {
      return (
        <div className="App">
          <div className="word">
            <span>{this.state.data[this.state.index][this.state.language]}</span>
          </div>
          <div className="answer">
            <input type="text" value={this.state.answer} onChange={this.onChange}/>
          </div>
          <button disabled={this.state.answer.length === 0} onClick={this.check}>Check!</button>
          {statusText}
        </div>
      );
    } else {
      return (
        <div className="App">
          <header>Loading vocabulary</header>
        </div>
      )
    }
  }
}

export default App;
