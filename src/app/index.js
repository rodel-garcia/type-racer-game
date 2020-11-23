import React from 'react';

import style from './index.module.scss';
import Game from './components/game/game';
import LoginForm from './components/login-form/login-form';
import Dashboard from './components/dashboard/dashboard';

import { auth } from './util/firebase';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSignedIn: undefined,
      isIdle: true,
      loginErrorMessage: '',
      totalAverage: 0,
      wpm: 0,
    };
  }

  componentDidMount() {
    this.onAuthStateChange();
  }

  componentWillUnmount() {
    this.fireBaseListener && this.fireBaseListener();
    this.onAuthStateChange = undefined;
  }

  onAuthStateChange() {
    this.fireBaseListener = window.firebase
      .auth()
      .onAuthStateChanged((user) => this.setState({ isSignedIn: !!user }));
  }

  handleLogin = (data) => {
    auth
      .signIn(data.email, data.password)
      .then(() => this.setState({ isSignedIn: true, errorMessage: '' }))
      .catch((error) => this.setState({ loginErrorMessage: error.message }));
  };

  startGame = () => {
    this.setState({ isIdle: false });
  };

  gameDone = (totalAverage, wpm) => {
    this.setState({ isIdle: true, totalAverage, wpm });
  };

  closeResult = () => {
    this.setState({ wpm: 0, totalAverage: 0 });
  };

  renderResult() {
    return (
      <div className={style['game-result-overlay']}>
        <div className={style['game-result']}>
          <h3>Game Result:</h3>
          <div>
            <span>
              Completed: <strong>{this.state.totalAverage}</strong>
            </span>
            <span>
              WPM Average: <strong>{this.state.wpm}</strong>
            </span>
          </div>
          <button onClick={() => this.setState({ isIdle: false })}>
            Try Again
          </button>
          <button onClick={this.closeResult}>Close</button>
        </div>
      </div>
    );
  }

  render() {
    return (
      <main className={style.app}>
        {this.state.isSignedIn === undefined ? (
          <em>loading ...</em>
        ) : this.state.isSignedIn && this.state.isIdle ? (
          <>
            {this.state.wpm && this.state.totalAverage
              ? this.renderResult()
              : null}
            <Dashboard onGameStart={this.startGame} />
          </>
        ) : this.state.isSignedIn && !this.state.isIdle ? (
          <Game onGameDone={this.gameDone} />
        ) : (
          <LoginForm
            handleLogin={this.handleLogin}
            errorMessage={this.state.loginErrorMessage}
          />
        )}
      </main>
    );
  }
}

export default App;
