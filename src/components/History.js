import React, { useState, useRef, useEffect, useContext } from 'react';
import * as firebase from 'firebase';
import { TextField } from '@material-ui/core';
import firebaseConfig from './FirebaseConfig';
import Thumbnail from './Thumbnail';
import { HistoryContext } from '../context/HistoryContext';
import '../styles/History.scss';

const History = () => {
  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
  }
  const [selectedThumbnail, setSelectedThumbnail] = useState({});
  const database = firebase.database();
  const nameRef = useRef(null);
  const { state, dispatch } = useContext(HistoryContext);

  const getHistory = () => {
    database
      .ref(`/`)
      .once(`value`)
      .then(result => {
        if (result.val()) {
          dispatch({ type: 'update', data: result.val() });
        }
      });
  };

  useEffect(() => {
    getHistory();
  }, []);

  const filterThumbnail = evt => {
    const name = evt.target.value.trim();
    const hasThumbnail = state.thumbnails[name];

    if (hasThumbnail) {
      setSelectedThumbnail(name);
    } else {
      setSelectedThumbnail({});
      // nameRef.current.value = ``;
    }
  };

  return (
    <section className="history-container">
      <div className="title">이미지 목록</div>
      <TextField label="웹툰 제목" margin="dense" variant="outlined" onChange={filterThumbnail} />
      <ul>
        {selectedThumbnail.length ? (
          <Thumbnail name={selectedThumbnail} src={state.thumbnails[selectedThumbnail]} />
        ) : (
          Object.keys(state.thumbnails).map(key => (
            <Thumbnail key={key} name={key} src={state.thumbnails[key]} />
          ))
        )}
      </ul>
    </section>
  );
};

export default History;
