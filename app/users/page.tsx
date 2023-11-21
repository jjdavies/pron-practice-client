'use client';
import React, { useContext, useEffect, useState } from 'react';
import mainStyle from '../../styles/Main.module.css';
import DataContext from '../../data/DataContext';
import Image from 'next/image';
import BlankAvatarImage from '../../img/blankavatar.jpg';
import { FileUploader } from 'react-drag-drop-files';

export default function Page() {
  useEffect(() => {
    loadActivityGroups();
  }, []);
  const { userThumbs, loadActivityGroups, createNewUser } =
    useContext(DataContext);
  const [makeNew, setMakeNew] = useState(false);
  const [newUserName, setNewUserName] = useState('');
  const [newUserThumb, setNewUserThumb] = useState<File | null>(null);
  const [thumbPreview, setThumbPreview] = useState<string | null>(
    null
  );

  const userSelected = (useruuid: string) => {};

  const addImageFile = (file: File) => {
    setNewUserThumb(file);
    const image = URL.createObjectURL(file);
    setThumbPreview(image);
  };

  const changeNewUserName = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setNewUserName(e.target.value);
  };

  const setNewUser = () => {
    if (newUserName !== '') {
      createNewUser(newUserName, newUserThumb);
      setMakeNew(false);
    }
  };

  return (
    <div className={mainStyle.main}>
      <div className={mainStyle.users}>
        <div className={mainStyle.userAvatar}>
          {makeNew && (
            <>
              <FileUploader
                handleChange={(file: File) => addImageFile(file)}
              >
                <div className={mainStyle.optionFileInput}>
                  {newUserThumb === null ? (
                    'Add Image'
                  ) : (
                    <Image
                      src={thumbPreview ? thumbPreview : ''}
                      width={80}
                      height={80}
                      alt="user thumb preview"
                    />
                  )}
                </div>
              </FileUploader>
              <input
                className={mainStyle.nameTextInput}
                value={newUserName}
                onChange={changeNewUserName}
              />
              <button
                className={mainStyle.formButton}
                onClick={setNewUser}
              >
                Create
              </button>
            </>
          )}
          {!makeNew && (
            <div
              style={{
                display: 'flex',
                height: '100%',
                width: '100%',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: 50,
              }}
              onClick={() => setMakeNew((s) => !s)}
            >
              +
            </div>
          )}
        </div>
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
                <div className={mainStyle.userName}>{user.name}</div>
              </>
            }
          </div>
        ))}
      </div>
    </div>
  );
}
