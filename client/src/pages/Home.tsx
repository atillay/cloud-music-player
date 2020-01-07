import React, {useState} from 'react';
import LayoutAuthenticated from "../components/LayoutAuthenticated";
import {AppState} from "../reducers";
import {connect} from "react-redux";
import Login from "./Login";
import {getSoundsAction, loadPlayerAction} from "../actions";
import {Sound} from "../reducers/sound";
import {alphabeticalSort, getFormattedDuration} from "../utils/helpers";
import {Button, Empty, Table} from "antd";
import Icon from "antd/lib/icon";
import {PlayerState} from "../reducers/player";
import Search from "antd/es/input/Search";
import {Link} from "react-router-dom";

const Home: React.FC<HomeProps> = (props) => {

  const [searchVal, setSearchVal] = useState<string>('');

  if (!props.authenticated) {
    return <Login/>
  }

  if (!props.soundsFetched) {
    props.getSounds();
  }

  const soundsListFilter = (sounds: Array<Sound>) => {
    return searchVal
      ? sounds.filter(sound =>
        (sound.title && sound.title.toLowerCase().includes(searchVal)) ||
        (sound.artist && sound.artist.toLowerCase().includes(searchVal))
      )
      : sounds;
  };

  return (
    <LayoutAuthenticated>
      <Search
        placeholder="Search for title or artist"
        onChange={e => setSearchVal(e.target.value.trim().toLowerCase())}
        style={{ width: '100%', maxWidth: '300px' }}
      />
      <br/><br/>
      <Table
        rowKey="_id"
        locale={{emptyText: () => (
            <Empty description="No sounds, please choose a google drive folder in your account settings">
              <Link to="/settings"><Button type="primary" ghost>Go to settings</Button></Link>
            </Empty>
        )}}
        dataSource={soundsListFilter(props.sounds)}
        columns={[
          {title: '', dataIndex: 'sound', width: 60, render: (val, sound: Sound) => (
            <Button shape="circle" onClick={() => props.loadPlayer(sound)}>
              {props.player.playing && props.player.sound && props.player.sound['_id'] === sound['_id'] ? (
                <Icon type="pause" />
              ) : (
                <Icon type="caret-right" />
              )}
            </Button>
          )},
          {title: 'Title', dataIndex: 'title', ellipsis: true, sorter: (a, b) => alphabeticalSort(a.title, b.title)},
          {title: 'Artist', dataIndex: 'artist', width: 200, sorter: (a, b) => alphabeticalSort(a.artist, b.artist)},
          {title: 'Duration', dataIndex: 'duration', width: 90, render: d => getFormattedDuration(d)},
          {title: 'Genre', dataIndex: 'genre', width: 140, sorter: (a, b) => alphabeticalSort(a.genre, b.genre)},
          {title: 'BPM', dataIndex: 'bpm', width: 84, sorter: (a, b) => a.bpm - b.bpm},
          {title: 'Key', dataIndex: 'key', width: 84},
          {title: 'Year', dataIndex: 'year', width: 84, sorter: (a, b) => a.year - b.year},
        ]}
      />
    </LayoutAuthenticated>
  )
};

interface HomeProps {
  authenticated: boolean,
  sounds: Array<Sound>,
  soundsFetched: boolean,
  player: PlayerState,
  getSounds: () => void
  loadPlayer: (sound: Sound) => void
}

const mapStateToProps = (state: AppState) => ({
  authenticated: state.auth.token !== null,
  sounds: state.sound.list,
  soundsFetched: state.sound.listFetched,
  player: state.player,
});


const mapDispatchToProps = (dispatch: any) => ({
  getSounds: () => dispatch(getSoundsAction),
  loadPlayer: (sound: Sound) => dispatch(loadPlayerAction(sound)),
});

export default connect(mapStateToProps, mapDispatchToProps)(Home);

