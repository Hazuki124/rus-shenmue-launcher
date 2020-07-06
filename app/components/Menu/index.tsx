import { remote } from 'electron';
import React, { Component } from 'react';
import {
  CloseOutlined,
  MinusOutlined,
  ReloadOutlined
} from '@ant-design/icons';
import { Button } from 'antd';
import classNames from 'classnames';
import styles from './styles.css';

type Props = {};

type State = {
  show: boolean;
};

export default class Menu extends Component<Props, State> {
  private timeoutId;

  constructor(props: Readonly<Props>) {
    // Required step: always call the parent class' constructor
    super(props);

    // Set the state directly. Use props if necessary.
    this.state = {
      show: false
    };
  }

  componentDidMount() {
    this.timeoutId = setTimeout(() => {
      this.setState({ show: true });
    }, 420);
  }

  componentWillUnmount() {
    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  close() {
    const window = remote.getCurrentWindow();
    window.close();
  }

  hide() {
    const window = remote.getCurrentWindow();
    window.minimize();
  }

  reload() {
    const window = remote.getCurrentWindow();
    window.reload();
  }

  render() {
    const { show } = this.state;

    return (
      <div
        className={classNames({
          [styles.menu]: true,
          [styles.appear]: show
        })}
      >
        <Button
          className={classNames({
            [styles.menuBtn]: true,
            [styles.noAnimation]: !show
          })}
          ghost={!show}
          type="link"
          onClick={this.close}
        >
          <CloseOutlined />
        </Button>
        <Button
          className={classNames({
            [styles.menuBtn]: true,
            [styles.noAnimation]: !show
          })}
          ghost={!show}
          type="link"
          onClick={this.hide}
        >
          <MinusOutlined />
        </Button>
        {process.env.NODE_ENV === 'development' && (
          <Button
            className={classNames({
              [styles.menuBtn]: true,
              [styles.noAnimation]: !show
            })}
            ghost={!show}
            type="link"
            onClick={this.reload}
          >
            <ReloadOutlined />
          </Button>
        )}
      </div>
    );
  }
}
