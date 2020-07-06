import React, { Component } from 'react';
import { Row, Col, Layout } from 'antd';
import { ipcRenderer } from 'electron';
import { get } from 'lodash';
import styles from './Home.css';
import Sidebar from './Sidebar';
import Menu from './Menu';
import GameCard, {
  AvailableVersionType,
  DownloadProgressType,
  GameType
} from './GameCard';
import Header from './Header';

type Props = {
  items: GameType[];
  availableVersions: AvailableVersionType[];
  isLoading: boolean;
  fetchIniFile: (INI_DOWNLOAD_URL: string) => {};
  fetchGameList: () => {};
  changeGameDirectory: () => {};
  downloadTranslationUpdate: () => {};
  uninstallTranslation: () => {};
  downloadTranslationUpdateSuccess: (
    file: string,
    game: GameType,
    availableVersion: AvailableVersionType
  ) => {};
  downloadTranslationUpdateFailed: (
    game: GameType,
    availableVersion: AvailableVersionType
  ) => {};
  downloadTranslationUpdateProgress: (
    game: GameType,
    availableVersion: AvailableVersionType,
    progress: DownloadProgressType
  ) => {};
};

type State = {
  intervalId: ReturnType<typeof setTimeout>;
};

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      downloadTranslationUpdateSuccess,
      downloadTranslationUpdateFailed,
      downloadTranslationUpdateProgress
    } = props;

    ipcRenderer.on('download complete', (_event, info) => {
      downloadTranslationUpdateSuccess(
        info.file,
        info.game,
        info.availableVersion
      );
    });

    ipcRenderer.on('download interrupted', (_event, info) => {
      downloadTranslationUpdateFailed(info.game, info.availableVersion);
    });

    ipcRenderer.on(
      'download progress',
      (_event, progress, game, availableVersion) => {
        downloadTranslationUpdateProgress(game, availableVersion, progress);
      }
    );
  }

  componentDidMount() {
    const { fetchIniFile, fetchGameList } = this.props;
    fetchGameList();
    fetchIniFile(process.env.INI_DOWNLOAD_URL);

    // set interval to check updates (once in an hour)
    const intervalId = setInterval(() => {
      fetchIniFile(process.env.INI_DOWNLOAD_URL);
    }, 3600000);
    this.setState({ intervalId });
  }

  componentWillUnmount() {
    const { intervalId } = this.state;
    clearInterval(intervalId);
  }

  render() {
    const {
      changeGameDirectory,
      downloadTranslationUpdate,
      uninstallTranslation,
      items,
      availableVersions
    } = this.props;
    const { Content } = Layout;

    const games = [];
    for (let i = 0; i < items.length; i++) {
      const game = items[i];
      const availableVersion = availableVersions[game.name] || null;
      games.push(
        <Col className="gutter-row" span={8} key={i}>
          <GameCard
            game={game}
            availableVersion={availableVersion}
            onGameChange={changeGameDirectory}
            onUninstall={uninstallTranslation}
            onDownloadUpdate={downloadTranslationUpdate}
          />
        </Col>
      );
    }

    const launcherUpdateInfo = get(availableVersions, 'Launcher', null);
    // const style = { background: '#0092ff', padding: '8px 0' };
    return (
      <Layout style={{ display: 'flex' }} className={styles.homePage}>
        <Sidebar launcherUpdateInfo={launcherUpdateInfo} />
        <Content className={styles.content}>
          <Menu />
          <Header />
          <Row gutter={24}>{games}</Row>
        </Content>
      </Layout>
    );
  }
}
