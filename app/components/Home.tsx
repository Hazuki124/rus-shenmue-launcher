import React, { Component } from 'react';
import { Row, Col, Layout, message } from 'antd';
import { ipcRenderer, remote } from 'electron';
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
import Notificator from '../utils/Notificator';

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
  updateIsAvailable: boolean;
  updateIsDownloaded: boolean;
  updateDownloadInProgress: boolean;
  intervalId?: ReturnType<typeof setTimeout>;
};

export default class Home extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    const {
      downloadTranslationUpdateSuccess,
      downloadTranslationUpdateFailed,
      downloadTranslationUpdateProgress
    } = props;

    this.state = {
      updateIsAvailable: false,
      updateIsDownloaded: false,
      updateDownloadInProgress: false,
    };

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

    ipcRenderer.on(
      'download progress',
      (_event, progress, game, availableVersion) => {
        downloadTranslationUpdateProgress(game, availableVersion, progress);
      }
    );

    ipcRenderer.on(
      'update-available',
      () => {
        this.setState({
          updateIsAvailable: true,
          updateDownloadInProgress: true,
        })
      }
    );

    ipcRenderer.on(
      'update-downloaded',
      () => {
        this.setState({
          updateIsDownloaded: true
        })
        Notificator.notify(
          'Обновление доступно для установки',
          `${remote.app.name} будет автоматически обновлен при закрытии`
        );
      }
    );

    ipcRenderer.on(
      'update-error',
      (err) => {
        message.warn('Ошибка при загрузке обновления');
        console.log(err);
        this.setState({
          updateIsDownloaded: false,
          updateDownloadInProgress: false,
        })
      }
    );

    ipcRenderer.on(
      'update-error',
      (err) => {
        console.log(err)
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
    this.setState({
      intervalId,
    });
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
    const { updateIsAvailable, updateDownloadInProgress, updateIsDownloaded } = this.state;
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
        <Sidebar
          launcherUpdateInfo={launcherUpdateInfo}
          updateIsAvailable={updateIsAvailable}
          updateDownloadInProgress={updateDownloadInProgress}
          updateIsDownloaded={updateIsDownloaded}
        />
        <Content className={styles.content}>
          <Menu />
          <Header />
          <Row gutter={24}>{games}</Row>
        </Content>
      </Layout>
    );
  }
}
