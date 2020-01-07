import React, {useEffect} from 'react';
import {loadedPlayerAction, pausePlayerAction, playPlayerAction} from "../actions";
import {connect} from "react-redux";
import {AppState} from "../reducers";
import {PlayerState} from "../reducers/player";
import {getAudioStreamUrl, getFormattedDuration} from "../utils/helpers";
import {Button, Icon, Popover, Slider} from "antd";

const AudioPlayer: React.FC<AudioPlayerProps> = ({player, playAction, pauseAction, loadedAction}) => {

  const audioInstance = player.audioDom;

  useEffect(() => {
    if (audioInstance) {
       if (player.sound) {
         const audioStreamUrl = getAudioStreamUrl(player.sound.googleId);
         if (audioStreamUrl !== audioInstance.src) {
           audioInstance.src = audioStreamUrl;
         }
       }

       player.playing ? audioInstance.play() : audioInstance.pause();
    }
  });

  const togglePlayPause = () => {
    if (player.sound && audioInstance) {
      audioInstance.paused
        ? playAction()
        : pauseAction();
    }
  };

  const onProgressBar = (e: React.MouseEvent) => {
    if (audioInstance && audioInstance.readyState >= 1) {
      const progressBarDom: HTMLElement|null = document.querySelector('.audio-player .progress-bar');
      if (progressBarDom) {
        const ratio = e.nativeEvent.offsetX / progressBarDom.offsetWidth;
        audioInstance.currentTime = ratio * audioInstance.duration;
      }
    }
  };

  const onVolumeChange = (volume: any) => {
    if (audioInstance) {
      audioInstance.volume = volume/100;
    }
  };

  setInterval(function() {
    if (audioInstance) {

      if (player.loading && audioInstance.readyState >= 1) {
        loadedAction();

        const totalTimeDom: HTMLElement|null = document.querySelector('.audio-player .total-time');
        if (totalTimeDom) {
          totalTimeDom.innerHTML = getFormattedDuration(audioInstance.duration);
        }
      }

      const progressTrackDom: HTMLElement|null = document.querySelector('.audio-player .progress-track');
      if (progressTrackDom) {
        progressTrackDom.style.width = (audioInstance.currentTime / audioInstance.duration) * 100 + '%';
      }

      const elapsedTimeDom: HTMLElement|null = document.querySelector('.audio-player .elapsed-time');
      if (elapsedTimeDom) {
        elapsedTimeDom.innerHTML = getFormattedDuration(audioInstance.currentTime);
      }
    }
  },120);


  return (
    <div className="audio-player">
      <div className="audio-player-wrapper">
        <div className="left-controls">
          <div className="btn-play-pause">
            <Button shape="circle" ghost onClick={togglePlayPause}>
              {player.loading ? (
                <Icon type="loading"/>
              ) : player.playing ? (
                <Icon type="pause" />
              ) : (
                <Icon type="caret-right" />
              )}
            </Button>
          </div>
        </div>
        <div className="progress-bar-wrapper">
          <div className="elapsed-time">00:00</div>
          <div className="progress-bar" onClick={onProgressBar}>
            <div className="progress-track"/>
            <div className="audio-title">
              {player.sound ? player.sound.title + ' - ' + player.sound.artist : '- -'}
            </div>
          </div>
          <div className="total-time">00:00</div>
        </div>
        <div className="right-controls">
          <div className="volume-control">
            <Popover
              placement="top"
              content={
                <Slider
                  className="popover-volume-slider"
                  min={0}
                  max={100}
                  vertical
                  defaultValue={100}
                  onChange={onVolumeChange}
                />
              }>
              <Button type="link"><Icon type="sound"/></Button>
            </Popover>
          </div>
        </div>
      </div>
    </div>
  )
};

interface AudioPlayerProps {
  player: PlayerState,
  playAction: () => void,
  pauseAction: () => void,
  loadedAction: () => void,
}

const mapStateToProps = (state: AppState) => ({
  player: state.player,
});

const mapDispatchToProps = (dispatch: any) => ({
  playAction: () => dispatch(playPlayerAction),
  pauseAction: () => dispatch(pausePlayerAction),
  loadedAction: () => dispatch(loadedPlayerAction)
});

export default connect(mapStateToProps, mapDispatchToProps)(AudioPlayer);
