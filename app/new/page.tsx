'use client';
import React, { useContext, useState } from 'react';
import mainStyle from '../../styles/Main.module.css';
import DataContext from '../../data/DataContext';
import Link from 'next/link';

export default function Page() {
  const [newGroupName, setNewGroupName] = useState<string>('');

  const { handlePendingActivityData, cancelNewActivity } =
    useContext(DataContext);

  const setName = (e) => {
    setNewGroupName(e.target.value);
  };

  const setData = () => {
    handlePendingActivityData(newGroupName);
  };
  return (
    <div className={mainStyle.main}>
      <div className={mainStyle.formGroup}>
        <label htmlFor="groupTitle">New Activity Name:</label>
        <input
          className={mainStyle.textInput}
          type="text"
          value={newGroupName}
          onChange={setName}
        />
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <Link href="/design">
            <button
              className={mainStyle.formButton}
              onClick={setData}
            >
              Create Exercise and Enter Design Mode
            </button>
          </Link>
          <button
            className={mainStyle.formButton}
            style={{ background: 'pink' }}
            onClick={cancelNewActivity}
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
