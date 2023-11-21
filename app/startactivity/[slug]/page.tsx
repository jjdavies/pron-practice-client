'use client';
import React, {
  useContext,
  useEffect,
  useState,
  useRef,
  CSSProperties,
  ReactNode,
} from 'react';
import { color, motion } from 'framer-motion';
import mainStyle from '../../../styles/Main.module.css';
import { useRouter, usePathname } from 'next/navigation';
import DataContext from '../../../data/DataContext';
import Image from 'next/image';
import useSound from 'use-sound';
import { v4 as uuidv4 } from 'uuid';
import BlankAvatarImage from '../../../img/blankavatar.jpg';
import { Option } from '../../../interface/Option';

// import success from '../../../public/success.mp3';
// import click from '../../../public/click.mp3';

import AudioIcon from '../../../img/sound.svg';
import { Color } from 'sharp';

interface AudioCompProps {
  file: string;
}

const random = (min: number, max: number) =>
  Math.floor(Math.random() * (max - min)) + min;

const DEFAULT_COLOR = '#FFDF00';

const useRandomInterval = (
  callback: Function,
  minDelay: number,
  maxDelay: number
) => {
  const timeoutId = React.useRef<number>();
  const savedCallback = React.useRef(callback);
  React.useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);
  React.useEffect(() => {
    let isEnabled =
      typeof minDelay === 'number' && typeof maxDelay === 'number';
    if (isEnabled) {
      const handleTick = () => {
        const nextTickAt = random(minDelay, maxDelay);
        timeoutId.current = window.setTimeout(() => {
          savedCallback.current();
          handleTick();
        }, nextTickAt);
      };
      handleTick();
    }
    return () => window.clearTimeout(timeoutId.current);
  }, [minDelay, maxDelay]);
  const cancel = React.useCallback(function () {
    window.clearTimeout(timeoutId.current);
  }, []);
  return cancel;
};

interface SparkleType {
  createdAt: number;
  id: string;
  color: string;
  size: number;
  style: React.CSSProperties;
}

const generateSparkle = (color: string): SparkleType => {
  const sparkle = {
    id: uuidv4(),
    createdAt: Date.now(),
    color,
    size: random(60, 150),
    style: {
      top: random(0, 90) + '%',
      left: random(0, 90) + '%',
      zIndex: 2,
    },
  };
  return sparkle;
};

interface SparklesType {
  color: string;
  children: ReactNode;
}

function Sparkles(children: any) {
  const [sparkles, setSparkles] = useState<SparkleType[]>([]);

  useRandomInterval(
    () => {
      const sparkle = generateSparkle(DEFAULT_COLOR);
      const now = Date.now();

      const nextSparkles: SparkleType[] = sparkles.filter(
        (sparkle: SparkleType) => {
          const delta = now - sparkle.createdAt;
          console.log(delta);
          return delta < 1000;
          // return true;
        }
      );
      // console.log(sparkles);
      nextSparkles.push(sparkle);

      setSparkles(nextSparkles);
      // console.log(nextSparkles);
    },
    50,
    500
  );

  return (
    <div
      style={{
        position: 'relative',
        display: 'inline-block',
        height: '90%',
      }}
    >
      {sparkles.map((sparkle) => (
        <Sparkle
          id={sparkle.id}
          key={sparkle.id}
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
          createdAt={sparkle.createdAt}
        />
      ))}
      <div
        style={{
          position: 'relative',
          zIndex: 1,
          fontWeight: 'bold',
          height: '100%',
        }}
      >
        {children}
      </div>
    </div>
  );
}

function Sparkle(props: SparkleType) {
  return (
    <div className={mainStyle.sparkleContainer} style={props.style}>
      <svg
        className={mainStyle.sparkle}
        xmlns="http://www.w3.org/2000/svg"
        width={props.size}
        height={props.size}
        fill={props.color}
        viewBox="0 0 160 160"
      >
        <path
          fill="#FFC700"
          d="M80 0s4.285 41.292 21.496 58.504C118.707 75.715 160 80 160 80s-41.293 4.285-58.504 21.496S80 160 80 160s-4.285-41.293-21.496-58.504C41.292 84.285 0 80 0 80s41.292-4.285 58.504-21.496C75.715 41.292 80 0 80 0z"
        ></path>
      </svg>
    </div>
  );
}

const AudioComponent = (props: AudioCompProps) => {
  const [currentAudioProgress, setCurrentAudioProgress] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const [mounted, setMounted] = useState(true);

  const playAudio = () => {
    if (audioRef.current !== null) {
      audioRef.current.play();
      const progressInterval = setInterval(() => {
        if (audioRef.current) {
          const progress = mounted
            ? (audioRef.current.currentTime /
                audioRef.current.duration) *
              100
            : 0;
          setCurrentAudioProgress(progress);
          if (progress > 99) {
            clearInterval(progressInterval);
            setCurrentAudioProgress(0);
          }
        }
      }, 50);
    }
  };

  useEffect(() => {
    setTimeout(() => {
      playAudio();
    }, 500);
    return () => setMounted(false);
  }, [props]);

  return (
    <div className={mainStyle.audioButton} onClick={playAudio}>
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
        src={'/file/' + props.file}
        // controls
      ></audio>
    </div>
  );
};

interface OptionCompProps {
  activityOptions: Option[];
  optionUUID: string;
  selectOption: Function;
  selectedOption: string;
  result: string;
}
const AudioComp = React.memo(AudioComponent);

const OptionComp = (props: OptionCompProps) => {
  // console.log(props.activityOptions);
  const opt = props.activityOptions.filter(
    (opt) => opt.uuid === props.optionUUID
  )[0];

  // console.log(opt);

  return (
    <>
      {opt && (
        <motion.div
          className={mainStyle.option}
          key={opt.uuid}
          onClick={() => props.selectOption(opt.uuid)}
          style={{
            background:
              props.selectedOption === opt.uuid ? 'white' : 'white',
            border:
              props.selectedOption === opt.uuid
                ? '10px solid yellow'
                : 0,
            zIndex:
              props.selectedOption === opt.uuid ? 99 : 'initial',
          }}
          whileTap={{ scale: 0.9 }}
          animate={{
            scale:
              props.selectedOption === opt.uuid
                ? props.result === 'true'
                  ? 1.5
                  : props.result === 'false'
                  ? 0.5
                  : 1
                : 1,
            rotate:
              props.selectedOption !== '' && opt.correct
                ? [0, 5, 0, -5, 0]
                : [0, 0],
          }}
          // animate={{}}
          transition={{
            rotate: { repeat: 'Infinite' },
          }}
        >
          {opt.fileuuid !== '' ? (
            <>
              {props.selectedOption === opt.uuid &&
              props.result === 'true' ? (
                <Sparkles>
                  <Image
                    src={'/file/' + opt.fileuuid}
                    layout={'fill'}
                    objectFit={'contain'}
                    alt="option image"
                    // style={{ pointerEvents: 'none' }}
                  />
                </Sparkles>
              ) : (
                <Image
                  src={'/file/' + opt.fileuuid}
                  layout={'fill'}
                  objectFit={'contain'}
                  alt="option image"
                  // style={{ pointerEvents: 'none' }}
                />
              )}
            </>
          ) : (
            <div>Blank</div>
          )}
        </motion.div>
      )}
    </>
  );
};

export default function Page(props: any) {
  const [selectedOption, setSelectedOption] = useState<string>('');
  const [result, setResult] = useState<string>('none');

  const router = useRouter();

  const {
    currentActivityGroup,
    activityGroups,
    currentActivity,
    activities,
    selectCurrentActivityGroup,
    loadActivityGroups,
    options,
    nextActivity,
    prevActivity,
    nextFromActivity,
    userThumbs,
    currentUser,
    userSelected,
    recordSelection,
  } = useContext(DataContext);
  const slug = usePathname()?.split('/startactivity/').pop();

  if (activities.length === 0) {
    loadActivityGroups();
    selectCurrentActivityGroup(slug);
  }
  const activity = activities.filter(
    (act) => act.uuid === currentActivity
  )[0];
  const activityGroup = activityGroups.filter(
    (group) => group.uuid === currentActivityGroup
  )[0];

  //get order of the activities in the activity group
  const groupActivities = activities.filter((act) =>
    activityGroup.activities.includes(act.uuid)
  );
  const firstUUID = groupActivities.filter(
    (act) => act.preceding === ''
  )[0].uuid;
  let precedingsOrder = [firstUUID];
  for (var i = 0; i < groupActivities.length; i++) {
    for (var j = 0; j < groupActivities.length; j++) {
      if (
        groupActivities[j].preceding ===
        precedingsOrder[precedingsOrder.length - 1]
      ) {
        precedingsOrder.push(groupActivities[j].uuid);
      }
    }
  }

  // if (activities.length > 0) {
  //   const currentActivityIndex =
  //     activityGroup.activities.indexOf(currentActivity);
  //   const totalActivities = activityGroup.activities.length;
  // }

  const activityOptions = options
    ? options.filter((option) =>
        activity.options.includes(option.uuid)
      )
    : [];
  // console.log(activityOptions);
  //get order of the options in the activity
  const firstOption = activityOptions.filter(
    (opt) => opt.preceding === ''
  )[0];
  const firstOptionUUID = firstOption ? firstOption.uuid : '';
  // console.log('first option uuid', firstOptionUUID);
  let optionsOrder = [firstOptionUUID];
  for (var i = 0; i < activityOptions.length; i++) {
    for (var j = 0; j < activityOptions.length; j++) {
      if (
        activityOptions[j].preceding ===
        optionsOrder[optionsOrder.length - 1]
      ) {
        optionsOrder.push(activityOptions[j].uuid);
      }
    }
  }
  // console.log('optionsOrder: ', optionsOrder);

  const [playSuccess] = useSound('/sounds/success.mp3');
  const [playFail] = useSound('/sounds/fail.mp3');

  const selectOption = (uuid: string) => {
    setSelectedOption(uuid);
    const option = options.filter((opt) => opt.uuid === uuid)[0];
    setResult(option.correct ? 'true' : 'false');
    if (option.correct) {
      playSuccess();
    }
    if (!option.correct) {
      playFail();
    }
    recordSelection(activityGroup, activity, option);
    setTimeout(() => {
      setSelectedOption('');
      setResult('none');
      nextFromActivity(currentActivity);
    }, 2000);
  };

  const userSelectNext = () => {
    setSelectedOption('');
    setResult('none');
    nextActivity();
  };

  return (
    <div className={mainStyle.main}>
      {/* ACTIVITY DATA */}
      {/* <div>
        Current Activity Group: <b>{currentActivityGroup}</b>
      </div>
      <div>
        Current Activity: <b>{currentActivity}</b>
      </div>
      <div>
        Activity / Total Activities:{' '}
        <b>
          {currentActivityIndex + 1} / {totalActivities}
        </b>
      </div> */}
      {/* {user === '' && (
        <div className={mainStyle.userModal}>
          <div className={mainStyle.users}>
            {userThumbs.map((user) => (
              <div
                className={mainStyle.userAvatar}
                key={user.uuid}
              >
                {user.thumb === '' 
              ? <Image src={BlankAvatarImage} height={200} width={200} alt="blank avatar" /> 
              : <Image src={user.thumb} alt="user thumb" />
            ))}
          </div>
        </div>
      )} */}
      {currentUser === '' && (
        <div className={mainStyle.userModal}>
          <div className={mainStyle.userTitle}>Select user:</div>
          <div className={mainStyle.users}>
            {userThumbs.map((user) => (
              <div
                className={mainStyle.userAvatar}
                key={user.uuid}
                onClick={() => userSelected(user.uuid)}
              >
                {
                  <>
                    <Image
                      src={
                        user.thumb !== ''
                          ? '/file/' + user.thumb
                          : BlankAvatarImage
                      }
                      width={180}
                      height={180}
                      alt="user avatar"
                    />
                    <div className={mainStyle.userName}>
                      {user.name}
                    </div>
                  </>
                }
              </div>
            ))}
          </div>
        </div>
      )}
      {activity !== undefined && (
        <div className={mainStyle.player}>
          <div className={mainStyle.playerTitle}>
            {activity.title}
          </div>
          <div className={mainStyle.audioContainer}>
            {activity.fileuuid !== '' && (
              <>
                {currentUser !== '' && (
                  <AudioComp file={activity.fileuuid} />
                )}
              </>
            )}
          </div>

          <div className={mainStyle.optionsContainer}>
            {optionsOrder.map((opt) => (
              <OptionComp
                optionUUID={opt}
                activityOptions={activityOptions}
                key={opt}
                selectOption={selectOption}
                selectedOption={selectedOption}
                result={result}
              />
            ))}
          </div>
          <div className={mainStyle.navContainer}>
            <div
              className={mainStyle.navBox}
              onClick={() => prevActivity}
            >
              Prev
            </div>
            <div className={mainStyle.navBox}>
              {precedingsOrder.indexOf(currentActivity) + 1} /{' '}
              {precedingsOrder.length}
            </div>
            <div
              className={mainStyle.navBox}
              onClick={userSelectNext}
            >
              Next
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
