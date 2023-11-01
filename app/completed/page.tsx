'use client';
import React, { useContext, useEffect, useState } from 'react';
import DataContext from '../../data/DataContext';
import mainStyle from '../../styles/Main.module.css';
import Image from 'next/image';
import moment from 'moment';

export function SessionCard(session) {
  const { uuid, useruuid, groupuuid, selections, timestamp } =
    session.session;
  const { currentSessionRange } = session;
  const { userThumbs, activityGroups, loadActivityGroups } =
    useContext(DataContext);
  if (userThumbs.length === 0 || activityGroups.length === 0) {
    loadActivityGroups();
  }

  let relUserThumb = '';
  let relUserName = '';
  if (userThumbs.length > 0) {
    //user thumbs available
    const relUser = userThumbs.filter(
      (thumb) => thumb.uuid === useruuid
    )[0];
    if (relUser) {
      relUserThumb = relUser.thumb;
      relUserName = relUser.name;
    }
  }
  let relActivityTitle = '';
  let relActivityThumb = '';
  if (activityGroups.length > 0) {
    const relGroup = activityGroups.filter(
      (group) => group.uuid === groupuuid
    )[0];
    if (relGroup) {
      relActivityThumb = relGroup.thumb;
      relActivityTitle = relGroup.title;
    }
  }
  // const timecode = Date.parse(timestamp);
  // const date = new Date(timecode);
  const momentDate = moment(timestamp);

  console.log(momentDate, currentSessionRange);
  // const sessionYear = date.getFullYear();
  // const sessionMonth = date.getMonth() + 1;
  // const sessionDate = date.getDate();
  // console.log(currentSessionRange);
  if (
    currentSessionRange.from !== null &&
    currentSessionRange.to !== null
  ) {
    if (
      momentDate.isBefore(currentSessionRange.from) ||
      momentDate.isAfter(currentSessionRange.to)
    )
      return;
  }

  return (
    <div className={mainStyle.completedSessionCard} key={uuid}>
      <div className={mainStyle.completedSessionDate}>
        {momentDate.toLocaleString()}
      </div>
      <Image
        src={'/file/' + relUserThumb}
        width={100}
        height={100}
        alt="relevant user thumbnail"
      />
      <div className={mainStyle.completedSessionText}>
        <b>{relUserName}</b> completed <b>{relActivityTitle}</b>
      </div>
      <Image
        src={'/file/' + relActivityThumb}
        width={100}
        height={100}
        alt="relevant activity thumbnail"
      />
      <div className={mainStyle.resultsBoxes}>
        {selections.map((sel) => (
          <div
            className={mainStyle.resultBox}
            style={{
              background:
                sel.split(':')[2] === 'true' ? 'green' : 'red',
            }}
            key={sel}
          ></div>
        ))}
      </div>
    </div>
  );
}

interface SessionRange {
  from: moment.Moment | null;
  to: moment.Moment | null;
}

export default function Page() {
  const {
    completedSessions,
    loadCompletedSessions,
    userThumbs,
    activityGroups,
    options,
  } = useContext(DataContext);

  const [currentSessionFilter, setCurrentSessionFilter] =
    useState('');
  const [currentSessionRange, setCurrentSessionRange] =
    useState<SessionRange>({
      from: null,
      to: null,
    });

  useEffect(() => {
    loadCompletedSessions();
  }, []);

  const selectSessionFilter = (filter: string) => {
    setCurrentSessionFilter(
      currentSessionFilter === filter ? '' : filter
    );
    const currSessFilter =
      currentSessionFilter === filter ? '' : filter;
    const date = new Date();
    const today = moment();
    console.log(today);
    switch (currSessFilter) {
      case '':
        setCurrentSessionRange({
          from: null,
          to: null,
        });
        break;
      case 'today':
        setCurrentSessionRange({
          from: today.startOf('day'),
          to: today.clone().add(1, 'day'),
        });
        break;
      case 'past7':
        setCurrentSessionRange({
          from: today.clone().startOf('day').subtract(7, 'days'),
          to: today.clone().add(1, 'day'),
        });
        break;
    }
  };

  return (
    <div className={mainStyle.main}>
      <div className={mainStyle.sessionFilterMenu}>
        <div
          className={mainStyle.sessionFilterButton}
          onClick={() => selectSessionFilter('today')}
          style={{
            background:
              currentSessionFilter === 'today' ? 'gray' : 'initial',
            color:
              currentSessionFilter === 'today' ? 'white' : 'black',
          }}
        >
          Today
        </div>
        <div
          className={mainStyle.sessionFilterButton}
          onClick={() => selectSessionFilter('past7')}
          style={{
            background:
              currentSessionFilter === 'past7' ? 'gray' : 'initial',
            color:
              currentSessionFilter === 'past7' ? 'white' : 'black',
          }}
        >
          Past 7 Days
        </div>
      </div>
      <div className={mainStyle.completedSessionsContainer}>
        {completedSessions.map((sess) => (
          <SessionCard
            session={sess}
            key={sess.uuid}
            currentSessionRange={currentSessionRange}
          />
        ))}
      </div>
    </div>
  );
}
