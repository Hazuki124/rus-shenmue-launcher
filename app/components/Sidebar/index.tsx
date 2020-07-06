import { remote, shell } from 'electron';
import React, { Component } from 'react';
import { Layout, Button, Badge, Tooltip } from 'antd';
import classNames from 'classnames';
import { TeamOutlined } from '@ant-design/icons';
import styles from './styles.css';
import FileDownloader from '../../utils/FileDownloader';

type Props = {
  launcherUpdateInfo: {
    url?: string;
    version?: string;
  };
};

type State = {
  show: boolean;
};

export default class Sidebar extends Component<Props, State> {
  private timeoutId;

  constructor(props: Readonly<Props>) {
    // Required step: always call the parent class' constructor
    super(props);

    this.openLauncherLink = this.openLauncherLink.bind(this);

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

  closeApp() {
    const window = remote.getCurrentWindow();
    window.close();
  }

  openOurVkGroupLink() {
    shell.openExternal('https://vk.com/shenmue3rus');
  }

  openDonateLink() {
    shell.openExternal('https://vk.com/app6887721_-186925092');
  }

  openPatronsLink() {
    shell.openExternal('https://vk.com/topic-186925092_40383085');
  }

  openLauncherLink() {
    const { launcherUpdateInfo } = this.props;
    if (
      launcherUpdateInfo &&
      FileDownloader.isValidURL(launcherUpdateInfo.url)
    ) {
      shell.openExternal(launcherUpdateInfo.url);
    }
  }

  render() {
    const { Header, Footer, Sider, Content } = Layout;
    const { show } = this.state;
    const { launcherUpdateInfo } = this.props;
    const appVersion = remote.app.getVersion();

    const isNewVersionAvailable =
      launcherUpdateInfo &&
      launcherUpdateInfo.version &&
      appVersion !== launcherUpdateInfo.version
        ? 1
        : 0;

    return (
      <Sider width={300} className={styles.container}>
        <Layout>
          <Header
            style={{ padding: '20px 10px 10px 10px' }}
            className={styles.common}
          >
            <h1
              className={classNames({
                [styles.title]: true,
                [styles.appear]: show
              })}
            >
              Shenmue Launcher
            </h1>
          </Header>
          <Content className={styles.common}>
            <ul
              style={{ opacity: 0 }}
              className={classNames({
                [styles.list]: true,
                [styles.appear]: show
              })}
            >
              <li>
                <Button
                  ghost={!show}
                  type="link"
                  onClick={this.openOurVkGroupLink}
                  className={classNames({
                    [styles.listLink]: true,
                    [styles.noAnimation]: !show
                  })}
                >
                  <i className="fab fa-vk" aria-hidden="true" />
                  <span style={{ marginLeft: '7px' }}>
                    Наша группа ВКонтакте
                  </span>
                </Button>
              </li>
              <li>
                <Button
                  ghost={!show}
                  type="link"
                  onClick={this.openDonateLink}
                  className={classNames({
                    [styles.listLink]: true,
                    [styles.noAnimation]: !show
                  })}
                >
                  <i className="fas fa-coins" />
                  <span style={{ marginLeft: '7px' }}>
                    Отблагодарить донатом
                  </span>
                </Button>
              </li>
              <li>
                <Button
                  ghost={!show}
                  type="link"
                  onClick={this.openPatronsLink}
                  className={classNames({
                    [styles.listLink]: true,
                    [styles.noAnimation]: !show
                  })}
                >
                  <TeamOutlined /> Список донатеров проекта
                </Button>
              </li>
              {/*
              <li>
                <Button
                  ghost={!show}
                  type="link"
                  onClick={this.closeApp}
                  className={classNames({
                    [styles.listLink]: true,
                    [styles.noAnimation]: !show
                  })}
                >
                  <LogoutOutlined /> Закрыть
                </Button>
              </li>
              */}
            </ul>
          </Content>
          <Footer
            className={classNames({
              [styles.common]: true,
              [styles.footer]: true,
              [styles.noAnimation]: true,
              [styles.canSelect]: true
            })}
          >
            <Tooltip placement="top" title="Доступно обновление">
              <Badge count={isNewVersionAvailable} color={isNewVersionAvailable ? 'cyan' : ''}>
                <div>
                  Версия: {appVersion}
                </div>
              </Badge>
            </Tooltip>
            <Button
              className={classNames({
                [styles.launcherDownloadLink]: true,
                [styles.invisible]: isNewVersionAvailable === 0
              })}
              type="link"
              onClick={this.openLauncherLink}
            >
              Ручное обновление лаунчера
            </Button>
          </Footer>
        </Layout>
      </Sider>
    );
  }
}
