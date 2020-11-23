import React, { useEffect, useState } from 'react';
import { dataBase, auth } from '../../util/firebase';
import style from './dashboard.module.scss';

const Dashboard = ({ onGameStart }) => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    dataBase
      .getHistory()
      .then((snapshot) => {
        const src = snapshot.val();
        const data = [];
        setLoading(false);

        if (isMounted && !!src) {
          Object.keys(src).forEach((key) =>
            data.push({ ...src[key], id: key })
          );
          setHistory(
            data
              .filter(
                (d) => d.userId === window.firebase.auth().currentUser.uid
              )
              .sort(
                (a, b) =>
                  new Date(b.date).getTime() - new Date(a.date).getTime()
              )
          );
        }
      })
      .catch((error) => console.log(error));

    return () => (isMounted = false);
  });

  return (
    <div className={style.dashboard}>
      <div>
        <span>
          {window.firebase.auth().currentUser.email} |{' '}
          <button onClick={signOut}>Logout</button>
        </span>
        <h1>Type Racer game</h1>
        <ul>
          <li>Each game has 3 minutes to complete.</li>
          <li>Each will show the game result one finished.</li>
          <li>Once the start button is triggered, the timer will start.</li>
          <li>Once done ahead of given time, please press enter to submit</li>
        </ul>
        <h3>
          Test your typing skills{' '}
          <button onClick={onGameStart}>Start Now!</button>
        </h3>
      </div>
      {history.length ? (
        <HistoryTable historyList={history} />
      ) : loading ? (
        <em>loading ...</em>
      ) : (
        <>Game history is empty.</>
      )}
    </div>
  );
};

export default Dashboard;

const HistoryTable = ({ historyList }) => {
  return (
    <>
      <h3>Game history</h3>
      <table>
        <thead>
          <tr>
            <th>Actual Time (Seconds)</th>
            <th>Completed %</th>
            <th>Words per minute (WPM)</th>
            <th>Date</th>
          </tr>
        </thead>
        <tbody>
          {historyList.map((list) => (
            <tr key={list.id}>
              <td>{list.actualTime}</td>
              <td>{list.completion}</td>
              <td>{list.wpm}</td>
              <td>
                {new Date(list.date).toLocaleDateString()}{' '}
                {new Date(list.date).toLocaleTimeString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
};

const signOut = () => {
  auth
    .signOut()
    .then(() => console.log('successfully signed out!'))
    .catch((error) => this.setState({ errorMessage: error.message }));
};
