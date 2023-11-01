'use client';
import { ReactNode, useState, createContext } from 'react';
import { ActivityGroup } from '../interface/ActivityGroup';
import axios from 'axios';
import { Activity } from '../interface/Activity';
import { Option } from '../interface/Option';
import { redirect } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { User } from '../interface/User';
import { UserSessionSelection } from '../interface/UserSessionSelection';
import { UserSession } from '../interface/UserSession';

interface DataProviderState {
  currentActivityGroup: string;
  selectCurrentActivityGroup: Function;
  currentActivity: string;
  prevActivity: Function;
  nextActivity: Function;
  nextFromActivity: Function;
  activities: Activity[];
  activityGroups: ActivityGroup[];
  loadActivityGroups: Function;
  options: Option[];
  handlePendingActivityData: Function;
  pendingActivityData: string;
  newDesignPending: boolean;
  changeTitle: Function;
  addAudioFile: Function;
  addImageFile: Function;
  setOptionCorrect: Function;
  addOption: Function;
  addActivity: Function;
  deleteGroup: Function;
  userThumbs: User[];
  currentUser: string;
  userSelected: Function;
  cancelNewActivity: Function;
  clearUser: Function;
  updateSession: Function;
  recordSelection: Function;
  currentSession: UserSession;
  completedSessions: [];
  loadCompletedSessions: Function;
  uploadSessionData: Function;
  createNewUser: Function;
}

interface DataProviderProps {
  children: ReactNode;
}

const DataContext = createContext({} as DataProviderState);

export function DataProvider({ children }: DataProviderProps) {
  const router = useRouter();

  const [currentActivityGroup, setCurrentActivityGroup] =
    useState('blah');
  const [currentActivity, setCurrentActivity] = useState('');
  const [activityGroups, setActivityGroups] = useState<
    ActivityGroup[]
  >([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [pendingActivityData, setPendingActivityData] =
    useState<string>('');
  const [newDesignPending, setNewDesignPending] =
    useState<boolean>(false);
  const [userThumbs, setUserThumbs] = useState<User[]>([]);
  const [currentUser, setCurrentUser] = useState<string>('');
  const [currentSession, setCurrentSession] = useState<UserSession>({
    user: '',
    group: '',
    selections: [],
  });
  const [completedSessions, setCompletedSessions] = useState([]);

  const loadActivityGroups = () => {
    axios.get('/activity/group/all').then((res, err) => {
      setActivityGroups(res.data);
    });
    axios.get('/user').then((res, err) => {
      if (err) console.log(err);
      setUserThumbs(res.data);
    });
  };

  const selectCurrentActivityGroup = async (uuid: string) => {
    axios.get(`/activity/all/${uuid}`).then((res, err) => {
      // console.log(res.data);
      if (res.data.length === 0) return setCurrentActivityGroup(uuid);
      const uuids = activities.map((act) => {
        return act.uuid;
      });
      const newActs = [
        ...activities,
        ...res.data.filter(
          (act: Activity) => !uuids.includes(act.uuid)
        ),
      ];
      const optionUUIDs = newActs
        .map((act) => {
          return act.options;
        })
        .flat();
      axios
        .post('/option/multi', { optionUUIDs })
        .then((res, err) => {
          if (err) console.log(err);
          setOptions(res.data);
        });
      console.log(uuids, ...optionUUIDs);
      setActivities([
        ...activities,
        ...res.data.filter(
          (act: Activity) => !uuids.includes(act.uuid)
        ),
      ]);
      setCurrentActivity(
        res.data.filter((act) => act.preceding === '')[0].uuid
      );
    });
    setCurrentActivityGroup(uuid);
  };

  const prevActivity = () => {
    const currAct = activities.filter(
      (act) => act.uuid === currentActivity
    )[0];
    const nextAct =
      currAct.preceding !== '' ? currAct.preceding : currAct.uuid;
    console.log(nextAct);
    setCurrentActivity(nextAct);
  };

  const nextActivity = () => {
    const currAct = activities.filter(
      (act) => act.uuid === currentActivity
    )[0];
    const nextAct = activities.filter(
      (act) => act.preceding === currAct.uuid
    )[0];
    console.log(nextAct);
    setCurrentActivity(
      nextAct !== undefined ? nextAct.uuid : currentActivity
    );
  };

  const nextFromActivity = (fromAct: string) => {
    const currAct = activities.filter(
      (act) => act.uuid === fromAct
    )[0];
    const nextAct = activities.filter(
      (act) => act.preceding === currAct.uuid
    )[0];
    if (nextAct === undefined) {
      //end of activity has been reached

      //go to success page
      router.push('/success');
    }
    setCurrentActivity(
      nextAct !== undefined ? nextAct.uuid : currentActivity
    );
  };

  const uploadSessionData = () => {
    if (currentSession.group !== '' && currentSession.user !== '') {
      const sessionToUpload = {
        groupuuid: currentSession.group,
        useruuid: currentSession.user,

        selections: currentSession.selections.map((sel) => {
          return `${sel.activity}:${sel.selectionoption}:${
            options.filter((op) => op.uuid === sel.selectionoption)[0]
              .correct
              ? 'true'
              : 'false'
          }`;
        }),
      };
      axios.post('/session', sessionToUpload);
    }
  };

  const handlePendingActivityData = (name: string) => {
    // setPendingActivityData(name);
    setNewDesignPending(true);
    //make two new options (as a minimum)
    axios.get('/option/new/2').then((optRes, err) => {
      if (err) console.log(err);
      console.log(
        'options resdata ',
        optRes.data,
        optRes.data.map((opt) => opt.uuid)
      );
      //make a new activity
      const activityData = {
        options: optRes.data.map((opt) => opt.uuid),
        title: '',
      };
      console.log(activityData);
      axios.post('/activity', activityData).then((actRes, err) => {
        if (err) console.log(err);

        //set group
        const groupData = {
          title: name,
          activities: [actRes.data.uuid],
        };
        axios
          .post('/activity/setgroup', groupData)
          .then((res, err) => {
            if (err) console.log(err);
            console.log('group', res.data);

            setActivityGroups([
              ...activityGroups.filter(
                (group: ActivityGroup) => group.uuid !== res.data.uuid
              ),
              res.data,
            ]);
            setCurrentActivityGroup(res.data.uuid);
            console.log([
              ...activities.filter(
                (act) => act.uuid !== actRes.data.uuid
              ),
              actRes.data,
            ]);
            setActivities([
              ...activities.filter(
                (act) => act.uuid !== actRes.data.uuid
              ),
              actRes.data,
            ]);
            setCurrentActivity(actRes.data.uuid);

            console.log('setting data options', [
              ...options.filter(
                (opt) => opt.uuid !== optRes.data.uuid
              ),
              ...optRes.data,
            ]);
            console.log(optRes.data);
            setOptions([
              ...options.filter(
                (opt) => opt.uuid !== optRes.data.uuid
              ),
              ...optRes.data,
            ]);
            setNewDesignPending(false);
          });
      });
    });
  };

  const changeTitle = (actID: string, e: Event) => {
    setActivities(
      activities.map((act) => {
        if (act.uuid === actID) {
          return {
            ...act,
            title: e.target.value,
          };
        }
        return act;
      })
    );
  };

  const addAudioFile = (file: File, activityID: string) => {
    console.log(file, activityID);
    if (file.type.split('/')[0] === 'audio') {
      const data = new FormData();
      data.append('file', file);
      data.append('assignto', 'activity');
      data.append('assignmentuuid', activityID);
      data.append('filetype', 'audio');
      axios
        .post('file', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res, err) => {
          if (err) console.log(err);
          console.log(
            activities.map((act) => {
              if (act.uuid === activityID) {
                return {
                  ...act,
                  fileuuid: res.data.uuid,
                };
              }
              return act;
            })
          );
          setActivities(
            activities.map((act) => {
              if (act.uuid === activityID) {
                return {
                  ...act,
                  fileuuid: res.data.uuid,
                };
              }
              return act;
            })
          );
        });
    }
  };

  const addImageFile = (file: File, optionID: string) => {
    if (file.type.split('/')[0] === 'image') {
      const data = new FormData();
      data.append('file', file);
      data.append('assignto', 'option');
      data.append('assignmentuuid', optionID);
      data.append('filetype', 'image');
      axios
        .post('file', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        })
        .then((res, err) => {
          if (err) console.log(err);
          console.log(
            activities.map((act) => {
              if (act.uuid === optionID) {
                return {
                  ...act,
                  fileuuid: res.data.uuid,
                };
              }
              return act;
            })
          );
          setOptions(
            options.map((opt) => {
              if (opt.uuid === optionID) {
                return {
                  ...opt,
                  fileuuid: res.data.uuid,
                };
              }
              return opt;
            })
          );
        });
    }
  };

  const setOptionCorrect = (uuid: string, value: boolean) => {
    axios
      .post('/option', { uuid, correct: value })
      .then((res, err) => {
        if (err) console.log(err);
        setOptions(
          options.map((opt) => {
            if (opt.uuid === uuid) {
              return res.data;
            }
            return opt;
          })
        );
      });
  };

  const addOption = (uuid: string) => {
    const addToActivity: Activity = activities.filter(
      (act) => act.uuid === currentActivity
    )[0];
    const activityOptionUUIDs = addToActivity.options;
    const activityOptions = options.filter((opt) =>
      activityOptionUUIDs.includes(opt.uuid)
    );
    const precedings = activityOptions.map(
      (actOpt) => actOpt.preceding
    );
    const preceding = activityOptionUUIDs.filter(
      (actOptUUID) => !precedings.includes(actOptUUID)
    )[0];
    console.log(preceding);
    axios.post('/option', { preceding }).then((optRes, err) => {
      if (err) console.log(err);
      axios
        .post('/activity', {
          uuid,
          options: [...addToActivity.options, optRes.data.uuid],
        })
        .then((res, err) => {
          if (err) console.log(err);
          console.log([...options, optRes.data]);
          setOptions([...options, optRes.data]);
          setActivities(
            activities.map((act) => {
              if (act.uuid === uuid) {
                return {
                  ...act,
                  options: [
                    ...activities.filter(
                      (act) => act.uuid === uuid
                    )[0].options,
                    optRes.data.uuid,
                  ],
                };
              }
              return act;
            })
          );
        });
    });
  };

  const addActivity = async (uuid: string) => {
    const currentNextActivity = activities.filter(
      (act) => act.preceding === uuid
    )[0];
    const newOptionsPost = await axios.get('/option/new/2');
    //make a new activity
    const activityData = {
      options: newOptionsPost.data.map((opt) => opt.uuid),
      preceding: uuid,
    };
    const newActivityPost = await axios.post(
      '/activity',
      activityData
    );
    const group: ActivityGroup = activityGroups.filter(
      (grp: ActivityGroup) => grp.uuid === currentActivityGroup
    )[0];
    const groupActivities = activities.filter((act) =>
      group.activities.includes(act.uuid)
    );
    let thumb = '';
    const thumbOptions = options.filter((opt) =>
      groupActivities[0].options.includes(opt.uuid)
    );
    if (thumbOptions.length !== 0) {
      thumb = thumbOptions[0].fileuuid;
    }
    const groupData = {
      uuid: group.uuid,
      activities: [...group.activities, newActivityPost.data.uuid],
      thumb,
    };
    const groupPost = await axios.post(
      '/activity/setgroup',
      groupData
    );
    //alter next activity to change the preceding value to the new activity
    const alterResult: Activity | null = await alterCurrNextActivity(
      currentNextActivity,
      newActivityPost.data.uuid
    );
    setActivityGroups(
      activityGroups.map((group: ActivityGroup) => {
        if (group.uuid === currentActivityGroup) {
          return {
            ...group,
            activities: [
              ...group.activities,
              newActivityPost.data.uuid,
            ],
          };
        }
        return group;
      })
    );

    setActivities([
      ...activities.map((act) => {
        if (alterResult !== undefined) {
          if (act.uuid === alterResult?.uuid) {
            return alterResult;
          }
        }
        return act;
      }),
      newActivityPost.data,
    ]);
    setCurrentActivity(newActivityPost.data.uuid);
    setOptions([
      ...options.filter(
        (opt) => opt.uuid !== newOptionsPost.data.uuid
      ),
      ...newOptionsPost.data,
      // ...newOptionsPost.data.map((newOpt: Option) => {
      //   return {
      //     uuid: newOpt,
      //     preceding: '',
      //     fileuuid: '',
      //     correct: false,
      //   };
      // }),
    ]);
  };

  const alterCurrNextActivity = async (
    currentNextActivity: Activity,
    newActUUID: string
  ): Promise<Activity | null> => {
    return new Promise((resolve, reject) => {
      if (currentNextActivity === undefined) {
        resolve(null);
      }
      axios
        .post('/activity', {
          uuid: currentNextActivity.uuid,
          preceding: newActUUID,
        })
        .then((res, err) => {
          resolve(res.data);
        });
    });
  };

  const addActivityOld = async (uuid: string) => {
    axios.get('/option/new/2').then((optRes, err) => {
      if (err) console.log(err);
      const currentNextActivity = activities.filter(
        (act) => act.preceding === uuid
      )[0];

      //make a new activity
      const activityData = {
        options: optRes.data,
        preceding: uuid,
      };
      axios.post('/activity', activityData).then((actRes, err) => {
        if (err) console.log(err);
        //set group
        const group: ActivityGroup = activityGroups.filter(
          (grp: ActivityGroup) => grp.uuid === currentActivityGroup
        )[0];
        const groupData = {
          uuid: group.uuid,
          activities: [...group.activities, actRes.data.uuid],
        };
        axios
          .post('/activity/setgroup', groupData)
          .then((groupRes, err) => {
            if (err) console.log(err);
            //alter next activity to change the preceding value to the new activity
            axios
              .post('/activity', {
                uuid: currentNextActivity.uuid,
                preceding: actRes.data.uuid,
              })
              .then((alterActRes, err) => {
                if (err) console.log(err);
                setActivityGroups([
                  ...activityGroups.filter(
                    (group: ActivityGroup) =>
                      group.uuid !== groupRes.data.uuid
                  ),
                  groupRes.data,
                ]);
                // console.log(activities);
                // console.log([
                //   ...activities.map((act) => {
                //     if (act.uuid === alterActRes.data.uuid) {
                //       return alterActRes.data;
                //     }
                //     return act;
                //   }),
                //   actRes.data,
                // ]);
                setActivities([
                  ...activities.map((act) => {
                    if (act.uuid === alterActRes.data.uuid) {
                      return alterActRes.data;
                    }
                    return act;
                  }),
                  actRes.data,
                ]);
                // setActivities([
                //   ...activities.filter(
                //     (act) => act.uuid !== actRes.data.uuid
                //   ),
                //   actRes.data,
                // ]);
                setCurrentActivity(actRes.data.uuid);
                setOptions([
                  ...options.filter(
                    (opt) => opt.uuid !== optRes.data.uuid
                  ),
                  ...optRes.data.map((newOpt: Option) => {
                    return {
                      uuid: newOpt,
                      preceding: '',
                      fileuuid: '',
                      correct: false,
                    };
                  }),
                ]);
              });
          });
      });
    });
  };

  const deleteGroup = (uuid: string) => {
    axios.delete(`/activity/group/${uuid}`).then((res, err) => {
      if (err) console.log(err);
      activityGroups.filter((group) => group.uuid !== uuid);
      loadActivityGroups();
    });
  };

  const userSelected = (useruuid: string) => {
    setCurrentUser(useruuid);
  };

  const cancelNewActivity = () => {
    router.push('/prepared');
  };

  const clearUser = () => {
    setCurrentUser('');
  };

  const updateSession = (
    actUUID: string,
    optionSelected: string,
    correctOption: string
  ) => {};

  const recordSelection = (
    group: ActivityGroup,
    activity: Activity,
    option: Option
  ) => {
    console.log(group, currentSession.group);
    //check for a blank session or session from another activity group
    if (
      currentSession.group === '' ||
      currentSession.group !== group.uuid
    ) {
      //first time setting up session
      console.log(currentSession);
      return setCurrentSession({
        user: currentUser,
        group: group.uuid,
        selections: group.activities.map((act) => {
          if (act === activity.uuid) {
            return {
              activity: activity.uuid,
              selectionoption: option.uuid,
            };
          }
          return {
            activity: act,
            selectionoption: '',
          };
        }),
      });
    }
    //session is already underway for the current activity group
    console.log(currentSession, {
      ...currentSession,
      user: currentUser,
      selections: currentSession.selections.map((act) => {
        console.log(act, activity.uuid);
        if (act.activity === activity.uuid) {
          return {
            activity: activity.uuid,
            selectionoption: option.uuid,
          };
        }
        return act;
      }),
    });
    return setCurrentSession({
      ...currentSession,
      user: currentUser,
      selections: currentSession.selections.map((act) => {
        console.log(act, activity.uuid);
        if (act.activity === activity.uuid) {
          return {
            activity: activity.uuid,
            selectionoption: option.uuid,
          };
        }
        return act;
      }),
    });
  };

  const loadCompletedSessions = async () => {
    const sessionLoad = await axios.get('/session');
    if (sessionLoad.data.length > 0) {
      console.log(sessionLoad.data);
      setCompletedSessions(sessionLoad.data);
    }
  };

  const createNewUser = async (name: string, file: File) => {
    const newUser = await axios.post('/user', { name });
    if (newUser.data && newUser.data.uuid) {
      if (file === null) return loadActivityGroups();
      if (file.type.split('/')[0] === 'image') {
        const data = new FormData();
        data.append('file', file);
        data.append('assignto', 'user');
        data.append('assignmentuuid', newUser.data.uuid);
        data.append('filetype', 'image');

        const addThumb = await axios.post('file', data, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        return loadActivityGroups();
      }
    }
  };

  return (
    <DataContext.Provider
      value={{
        currentActivityGroup,
        selectCurrentActivityGroup,
        currentActivity,
        prevActivity,
        nextActivity,
        nextFromActivity,
        activities,
        activityGroups,
        loadActivityGroups,
        options,
        handlePendingActivityData,
        pendingActivityData,
        newDesignPending,
        changeTitle,
        addAudioFile,
        addImageFile,
        setOptionCorrect,
        addOption,
        addActivity,
        deleteGroup,
        userThumbs,
        currentUser,
        userSelected,
        cancelNewActivity,
        clearUser,
        updateSession,
        recordSelection,
        currentSession,
        completedSessions,
        loadCompletedSessions,
        uploadSessionData,
        createNewUser,
      }}
    >
      {children}
    </DataContext.Provider>
  );
}

export default DataContext;
