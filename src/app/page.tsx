import Image from 'next/image'
import styles from './page.module.css'
import * as React from 'react';
import * as ReactDOM from 'react-dom/client';
import { StyledEngineProvider } from '@mui/material/styles';
import Scoreboard from '../../Scoreboard';

export default function Home() {
  return (
    <main className={styles.main}>
      <div className={styles.description}>
      <Scoreboard />
      </div>
    </main>
  )
}
