import React, { Component } from 'react';
import { Layout } from 'antd';
import styles from './styles.css';

type Props = {};

type State = {};

export default class Header extends Component<Props, State>{
  render() {
    const { Header: AtdHeader } = Layout;
    return <AtdHeader className={styles.header} />;
  }
}
