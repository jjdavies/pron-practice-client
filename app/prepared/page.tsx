'use client';
import React, { useContext, useState, useEffect } from 'react';
import mainStyle from '../../styles/Main.module.css';
import DataContext from '../../data/DataContext';
import Link from 'next/link';
import Image from 'next/image';

export default function Page() {
  const {
    currentActivityGroup,
    selectCurrentActivityGroup,
    activityGroups,
    loadActivityGroups,
    deleteGroup,
  } = useContext(DataContext);

  const [cardSelected, setCardSelected] = useState('');

  const sideBorderColors = [
    'green',
    'blue',
    'red',
    'yellow',
    'purple',
  ];

  const selectCard = (uuid: string) => {
    setCardSelected(uuid);
  };

  useEffect(() => {
    loadActivityGroups();
  }, []);

  return (
    <div className={mainStyle.main}>
      <button
        className={mainStyle.formButton}
        onClick={() => loadActivityGroups()}
      >
        Load Activities
      </button>
      <div className={mainStyle.activityCards}>
        {activityGroups.length !== 0 &&
          activityGroups.map((group, index) => (
            <>
              {group.deleted === false && (
                <div
                  className={mainStyle.groupCard}
                  style={{
                    borderLeft: `5px solid ${
                      sideBorderColors[
                        index % sideBorderColors.length
                      ]
                    }`,
                    width:
                      cardSelected === group.uuid ? '300px' : '200px',
                  }}
                  onClick={() => selectCard(group.uuid)}
                  key={group.uuid}
                >
                  <div className={mainStyle.groupTitle}>
                    {group.title}
                  </div>
                  {/* {group.thumb !== '' && ( */}
                  <div
                    style={{
                      display: 'flex',
                      width: '100%',
                      height: '100%',
                    }}
                  >
                    <div
                      style={{
                        position: 'relative',

                        height: '80%',
                        aspectRatio: '1/1',
                        justifyContent: 'flex-end',
                      }}
                    >
                      <Image
                        src={'/file/' + group.thumb}
                        layout={'fill'}
                        objectFit={'contain'}
                        alt="thumbnail"
                      />
                    </div>
                    {cardSelected === group.uuid && (
                      <div className={mainStyle.cardButtons}>
                        <Link
                          href={'/startactivity/' + group.uuid}
                          style={{
                            textDecoration: 'none',
                            color: 'black',
                            width: '100%',
                          }}
                        >
                          <div
                            className={mainStyle.startButton}
                            onClick={() =>
                              selectCurrentActivityGroup(group.uuid)
                            }
                          >
                            start
                          </div>
                        </Link>
                        <div
                          className={mainStyle.deleteButton}
                          onClick={() => deleteGroup(group.uuid)}
                        >
                          delete
                        </div>
                      </div>
                    )}
                  </div>
                  {/* )} */}
                </div>
              )}
            </>
            // </Link>
          ))}
      </div>
    </div>
  );
}
