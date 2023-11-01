'use client';
import React, {
  useContext,
  useState,
  useRef,
  useEffect,
} from 'react';
import mainStyle from '../../styles/Main.module.css';
import DataContext from '../../data/DataContext';
import Image from 'next/image';
import AudioIcon from '../../img/sound.svg';
import { motion } from 'framer-motion';
import { FileUploader } from 'react-drag-drop-files';
import { AudioRecorder } from 'react-audio-voice-recorder';

export default function Page() {
  const {
    currentActivityGroup,
    activityGroups,
    currentActivity,
    activities,
    selectCurrentActivityGroup,
    loadActivityGroups,
    options,
    prevActivity,
    nextActivity,
    newDesignPending,
    changeTitle,
    addAudioFile,
    addImageFile,
    setOptionCorrect,
    addOption,
    addActivity,
  } = useContext(DataContext);

  const [selectedOption, setSelectedOption] = useState<string>('');
  const [result, setResult] = useState<string>('none');
  const [currentAudioProgress, setCurrentAudioProgress] = useState(0);

  const activity = activities.filter(
    (act) => act.uuid === currentActivity
  )[0];

  const activityGroup = activityGroups.filter(
    (group) => group.uuid === currentActivityGroup
  )[0];

  const groupActivities = activities.filter((act) =>
    activityGroup
      ? activityGroup.activities.includes(act.uuid)
      : false
  );
  const firstAct = groupActivities.filter(
    (act) => act.preceding === ''
  )[0];
  const firstUUID = firstAct && firstAct.uuid ? firstAct.uuid : null;
  let precedingsOrder = firstUUID ? [firstUUID] : [];
  for (var i = 0; i < groupActivities.length; i++) {
    console.log('out', i);
    for (var j = 0; j < groupActivities.length; j++) {
      if (
        groupActivities[j].preceding ===
        precedingsOrder[precedingsOrder.length - 1]
      ) {
        console.log('hit');
        precedingsOrder.push(groupActivities[j].uuid);
      }
    }
  }

  // if (activities.length > 0) {
  //   const currentActivityIndex =
  //     activityGroup.activities.indexOf(currentActivity);
  //   const totalActivities = activityGroup.activities.length;
  // }

  const activityOptions =
    options.length > 0
      ? options.filter((option) =>
          activity.options.includes(option.uuid)
        )
      : [];

  const selectOption = (uuid: string) => {
    setSelectedOption(uuid);
    const option = options.filter((opt) => opt.uuid === uuid)[0];
    setResult(option.correct ? 'true' : 'false');
    setTimeout(() => {
      nextActivity();
    }, 3000);
  };

  const audioRef = useRef(null);

  const playAudio = () => {
    if (audioRef.current !== null) {
      audioRef.current.play();
      const progressInterval = setInterval(() => {
        const progress =
          (audioRef.current.currentTime / audioRef.current.duration) *
          100;
        setCurrentAudioProgress(progress);
        if (progress > 98) clearInterval(progressInterval);
      }, 50);
    }
  };

  const addAudioFileHandler = (file: File) => {
    console.log(file);
  };

  const addRecordedAudio = (blob: Blob) => {
    const file = new File([blob], 'audioclip.webm', {
      type: blob.type,
    });
    addAudioFile(file, currentActivity);
  };

  return (
    <div className={mainStyle.main}>
      <div
        style={{
          display: 'flex',
          border: '1px solid black',
          justifyContent: 'space-around',
        }}
      >
        <div
          style={{ border: '1px solid black' }}
          onClick={() => console.log(activityGroup)}
        >
          group UUID:{' '}
          {activityGroup && activityGroup.uuid
            ? activityGroup.uuid
            : '-'}
        </div>
        <div
          style={{ border: '1px solid black' }}
          onClick={() => console.log(activity)}
        >
          act UUID: {activity && activity.uuid ? activity.uuid : '-'}
        </div>
        <div
          style={{ border: '1px solid black' }}
          onClick={() => console.log(activityOptions)}
        >
          options:{' '}
          {activityOptions &&
            activityOptions.length > 0 &&
            activityOptions.map((opt) => opt.uuid)}
        </div>
      </div>
      <div
        style={{
          display: 'flex',
          border: '1px solid black',
          justifyContent: 'space-around',
        }}
      >
        <div
          style={{ border: '1px solid black' }}
          onClick={() => console.log(activityGroup)}
        >
          curr act: {currentActivity ? currentActivity : '-'}
        </div>
      </div>
      {newDesignPending ? (
        <div>Pending</div>
      ) : (
        <div>
          {activity !== undefined && (
            <div className={mainStyle.player}>
              <div className={mainStyle.playerTitle}>
                <input
                  className={mainStyle.textInput}
                  value={activity.title}
                  onChange={(e) => changeTitle(activity.uuid, e)}
                />
              </div>
              <div className={mainStyle.audioContainer}>
                <AudioRecorder
                  onRecordingComplete={addRecordedAudio}
                  audioTrackConstraints={{
                    noiseSuppression: true,
                    echoCancellation: true,
                  }}
                  downloadOnSavePress={false}
                  downloadFileExtension="webm"
                />
                <FileUploader
                  handleChange={(file: File) =>
                    addAudioFile(file, activity.uuid)
                  }
                >
                  <div className={mainStyle.audioFileInput}>
                    add audio
                  </div>
                </FileUploader>

                {activity.fileuuid !== '' && (
                  <div
                    className={mainStyle.audioButton}
                    onClick={playAudio}
                  >
                    <Image
                      src={AudioIcon}
                      layout={'fill'}
                      objectFit={'contain'}
                      alt="audio icon"
                      style={{
                        background: `linear-gradient(to left, #fff ${
                          100 - currentAudioProgress
                        }%, #66dd66 ${100 - currentAudioProgress}%)`,
                      }}
                    />
                    <audio
                      ref={audioRef}
                      src={'/file/' + activity.fileuuid}
                      // controls
                    ></audio>
                  </div>
                )}
              </div>

              <div className={mainStyle.optionsContainer}>
                {activityOptions.map((opt) => (
                  <motion.div
                    className={mainStyle.option}
                    key={opt.uuid}
                    onClick={() =>
                      setOptionCorrect(opt.uuid, !opt.correct)
                    }
                    style={{
                      background: opt.correct ? 'yellow' : 'white',
                    }}
                    whileTap={{ scale: 0.95 }}
                    animate={{ scale: [0, 1] }}
                  >
                    <FileUploader
                      handleChange={(file: File) =>
                        addImageFile(file, opt.uuid)
                      }
                    >
                      <div className={mainStyle.optionFileInput}>
                        Add image
                      </div>
                    </FileUploader>

                    {opt.fileuuid !== '' && (
                      <div
                        style={{
                          position: 'relative',
                          height: '80%',
                        }}
                      >
                        <Image
                          src={'/file/' + opt.fileuuid}
                          layout={'fill'}
                          objectFit={'contain'}
                          alt="option image"
                          // style={{ pointerEvents: 'none' }}
                        />
                      </div>
                    )}
                    {opt.preceding ? opt.preceding : 'noneprec'}
                  </motion.div>
                ))}
                <div
                  className={mainStyle.addOptionButton}
                  onClick={() => addOption(activity.uuid)}
                >
                  +
                </div>
              </div>
              <div className={mainStyle.navContainer}>
                <div
                  className={mainStyle.navBox}
                  onClick={prevActivity}
                >
                  Prev
                </div>
                <div className={mainStyle.navBox}>
                  {precedingsOrder.indexOf(currentActivity) + 1} /{' '}
                  {precedingsOrder.length}
                </div>
                <div
                  className={mainStyle.navBox}
                  onClick={nextActivity}
                >
                  Next
                </div>
                <div
                  className={mainStyle.navBox}
                  onClick={() => addActivity(activity.uuid)}
                >
                  Add
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
