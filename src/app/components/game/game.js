import React from 'react';

import GuideText from './guide-text/guide-text';
import InputField from './input-field/input-field';
import { dataBase } from '../../util/firebase';

const SRC_TEXT_API_URL = 'https://baconipsum.com/api/?type=meat&paras=3';

class Game extends React.Component {
  state = {
    srcText: '',
    textAreaValue: '',
    currentIndex: 0,
    timer: 0,
    timerDisplay: '3:00',
    gameDone: false,
    isLoading: true,
    error: null,
  };

  componentDidMount() {
    this.fetchData();
  }

  startGame() {
    const interval = setInterval(() => {
      this.startTimer();
      if (this.state.gameDone) {
        clearInterval(interval);
      }
    }, 1000);
  }

  startTimer = () => {
    const timeArray = this.state.timerDisplay.split(/[:]+/);
    let m = timeArray[0];
    let s = this.checkSecond(timeArray[1] - 1);
    if (+s === 59) {
      m = m - 1;
    }
    this.setState({ timer: this.state.timer + 1, timerDisplay: `${m}:${s}` });
    if (+m === 0 && +s === 0) {
      this.gameFinish();
    }
  };

  checkSecond = (sec) => {
    if (sec < 10 && sec >= 0) {
      sec = '0' + sec;
    }
    if (sec < 0) {
      sec = '59';
    }
    return sec;
  };

  gameFinish() {
    const { textAreaValue, timer, srcText } = this.state;
    const wordCount = Math.floor(textAreaValue.length / 5); // based on wiki
    const wpm = Math.ceil(wordCount / (timer / 60));
    const totalPercentage = (textAreaValue.length / srcText.length) * 100;
    const totalAverage = `${
      totalPercentage % 1 !== 0 ? totalPercentage.toFixed(2) : totalPercentage
    }%`;
    this.setState({ gameDone: true });
    this.saveGameDetails(totalAverage, wpm);
    this.props.onGameDone(totalAverage, wpm);
  }

  saveGameDetails(totalAverage, wpm) {
    dataBase.addNewData({
      userId: window.firebase.auth().currentUser.uid,
      wpm: wpm,
      completion: totalAverage,
      actualTime: this.state.timer,
      date: new Date().toString(),
    });
  }

  fetchData() {
    fetch(SRC_TEXT_API_URL)
      .then(this.handleRequestError)
      .then((data) => {
        this.setState({
          srcText: data[0].replace('  ', ' '),
          isLoading: false,
        });
        this.startGame();
      })
      .catch((e) => {
        this.setState({
          error: 'Something went wrong, please check your connection',
          isLoading: false,
        });
      });
  }

  handleRequestError = (res) => {
    if (res.ok) {
      return res.json();
    } else {
      this.setState({
        error: 'Error from the response.',
        isLoading: false,
      });
    }
  };

  handleKeypress = (event) => {
    const { srcText, currentIndex, textAreaValue } = this.state;
    if (event.key === srcText[currentIndex] && currentIndex < srcText.length) {
      this.setState({
        currentIndex: currentIndex + 1,
        textAreaValue: textAreaValue + event.key,
      });
    }
    if (textAreaValue.length === srcText.length) {
      this.gameFinish();
    }
  };

  renderContent() {
    return (
      <>
        <h3 style={{ textAlign: 'center' }}>{this.state.timerDisplay}</h3>
        <GuideText
          data={this.state.srcText}
          highlightedText={this.state.textAreaValue}
        />
        <InputField
          value={this.state.textAreaValue}
          onChangeHandler={this.handleKeypress}
        />
      </>
    );
  }

  render() {
    const { srcText, error, isLoading } = this.state;
    if (srcText) {
      return this.renderContent();
    }
    if (isLoading) {
      return <em>loading ...</em>;
    }
    if (error) {
      return <em style={{ color: 'red' }}>{error}</em>;
    }
    return <em>Something went wrong!</em>;
  }
}

export default Game;
