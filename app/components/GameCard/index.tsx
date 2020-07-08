import React, { Component } from 'react';
import { remote, shell } from 'electron';
import fs from 'fs';
import { Layout, Menu, Dropdown, Button, message, Progress } from 'antd';
import { isEmpty } from 'lodash';
import classNames from 'classnames';

import {
  EllipsisOutlined,
  CaretRightOutlined,
  CloudDownloadOutlined,
  LoadingOutlined,
  FolderOutlined,
  SyncOutlined,
  VerticalAlignBottomOutlined,
  FolderOpenOutlined,
  ExclamationCircleOutlined,
  CloseSquareOutlined,
  WarningOutlined,
  FileTextOutlined,
  DeleteOutlined
} from '@ant-design/icons';
import styles from './styles.css';
import Sound from '../../utils/Sound';
import FileDownloader from '../../utils/FileDownloader';

export type GameType = {
  id: number;
  name: string;
  displayName: string;
  image: string;
  directory: string | undefined;
  directoryHint: string | undefined;
  executablePath: string;
  currentVersion?: string;
};

export type AvailableVersionType = {
  size: number;
  url: string;
  version: string | null;
  reportTranslationIssue?: string | null;
  checkFile?: string | null;
  isDownloading?: boolean;
  isUnpacking?: boolean;
  isInstalling?: boolean;
  isUninstalling?: boolean;
  downloadProgress?: DownloadProgressType;
};

export type DownloadProgressType = {
  percent: number;
  totalBytes: number;
  transferredBytes: number;
};

type Props = {
  game: GameType;
  availableVersion: AvailableVersionType | null;
  onGameChange: (game: GameType) => {};
  onUninstall: (game: GameType) => {};
  onDownloadUpdate: (
    availableVersion: AvailableVersionType | null,
    game: GameType
  ) => {};
};

type State = {
  directoryIsSet: boolean;
};

export default class GameCard extends Component<Props, State> {
  constructor(props: Props) {
    super(props);

    this.selectDirectory = this.selectDirectory.bind(this);
    this.resetDirectory = this.resetDirectory.bind(this);
    this.uninstall = this.uninstall.bind(this);
    this.downloadAndUpdateTranslation = this.downloadAndUpdateTranslation.bind(
      this
    );
    this.runGame = this.runGame.bind(this);
    this.resetCurrentVersion = this.resetCurrentVersion.bind(this);
    this.openExternalLink = this.openExternalLink.bind(this);
    this.reportIssue = this.reportIssue.bind(this);
  }

  async runGame() {
    const { game } = this.props;
    const wasOpen: boolean = shell.openItem(
      `${game.directory}${game.executablePath}`
    );
    // TODO: exit launcher
    if (wasOpen) {
      // await Sound.playPlay();
    }
  }

  selectDirectory() {
    const { dialog } = remote;
    const { game, onGameChange } = this.props;
    // eslint-disable-next-line promise/catch-or-return
    dialog
      .showOpenDialog({
        title: `Выберите папку ${
          game.directoryHint ? game.directoryHint : 'с игрой'
        }`,
        // defaultPath: '',
        properties: ['openDirectory'],
        buttonLabel: 'Выбрать папку'
      })
      .then(result => {
        // eslint-disable-next-line promise/always-return
        if (!result.canceled) {
          const directory = result.filePaths[0];
          if (fs.existsSync(`${directory}${game.executablePath}`)) {
            onGameChange({
              ...game,
              directory
            });
          } else {
            message.error('Выбрана неверная директория', 5);
          }
        }
      });
  }

  downloadAndUpdateTranslation() {
    const { game, availableVersion, onDownloadUpdate } = this.props;
    if (isEmpty(availableVersion?.checkFile)) {
      onDownloadUpdate(availableVersion, game);
    } else if (
      fs.existsSync(`${game.directory}/${availableVersion?.checkFile}`)
    ) {
      onDownloadUpdate(availableVersion, game);
    } else {
      message.warning(
        'Выбранная версия не поддерживается. Обновите игру до версии 1.07',
        10
      );
    }
  }

  resetDirectory() {
    const { game, onGameChange } = this.props;
    onGameChange({
      ...game,
      directory: null
    });
  }

  resetCurrentVersion() {
    const { game, onGameChange } = this.props;
    onGameChange({
      ...game,
      currentVersion: null
    });
  }

  uninstall() {
    const { game, onUninstall } = this.props;
    onUninstall({
      ...game
    });
  }

  openExternalLink() {
    const {
      availableVersion: { url }
    } = this.props;
    shell.openExternal(url);
  }

  reportIssue() {
    const {
      availableVersion: { reportTranslationIssue }
    } = this.props;
    shell.openExternal(reportTranslationIssue);
  }

  // eslint-disable-next-line class-methods-use-this
  playClick() {
    Sound.playClick();
  }

  render() {
    const { Content, Footer } = Layout;
    const { game, availableVersion } = this.props;
    const directoryIsSelected = !!game.directory;
    const directoryIsSet = !!game.directory;
    const currentVersionIsSet = !!game.currentVersion;
    const anyActionIsInProgress = !!(
      availableVersion &&
      (availableVersion.isDownloading ||
        availableVersion.isInstalling ||
        availableVersion.isUnpacking ||
        availableVersion.isUninstalling)
    );
    const updateIsAvailable =
      availableVersion &&
      game.currentVersion !== availableVersion?.version &&
      FileDownloader.isValidURL(availableVersion.url);
    const translationInProgress =
      availableVersion && !isEmpty(availableVersion?.version);
    const updateIsUnavailable =
      directoryIsSelected &&
      availableVersion &&
      game.currentVersion !== availableVersion?.version &&
      !updateIsAvailable &&
      !(
        availableVersion.isDownloading ||
        availableVersion.isInstalling ||
        availableVersion.isUnpacking
      );

    const menu = (
      <Menu style={{ userSelect: 'none' }}>
        {!directoryIsSet && (
          <Menu.Item key="selectDirectory" onClick={this.selectDirectory}>
            <FolderOpenOutlined /> Указать директорию игры
          </Menu.Item>
        )}
        {directoryIsSet && (
          <Menu.Item key="changeDirectory" onClick={this.selectDirectory}>
            <FolderOpenOutlined /> Изменить директорию игры
          </Menu.Item>
        )}
        {availableVersion?.reportTranslationIssue && (
          <Menu.Item key="reportIssue" onClick={this.reportIssue}>
            <ExclamationCircleOutlined /> Сообщить о проблеме в переводе
          </Menu.Item>
        )}
        {availableVersion && availableVersion.url && (
          <Menu.Item key="manualInstall" onClick={this.openExternalLink}>
            <VerticalAlignBottomOutlined /> Ручное обновление перевода
          </Menu.Item>
        )}
        {/*
        {currentVersionIsSet && (
          <Menu.Item key="resetCurrentVersion" onClick={this.resetCurrentVersion}>
            <CloseCircleOutlined /> Сбросить текущую версию перевода
          </Menu.Item>
        )}
        */}
        {directoryIsSet && <Menu.Divider />}
        {directoryIsSet && (
          <Menu.Item key="resetDirectory" onClick={this.resetDirectory}>
            <CloseSquareOutlined /> Сбросить директорию игры
          </Menu.Item>
        )}
        {directoryIsSet && currentVersionIsSet && (
          <Menu.Item style={{ color: '#ff4d4f' }} key="uninstallTranslation" onClick={this.uninstall}>
            <DeleteOutlined /> Удалить перевод
          </Menu.Item>
        )}
      </Menu>
    );

    return (
      <Layout className={styles.game}>
        <Content>
          <div
            style={{
              height: '370px',
              overflow: 'hidden'
            }}
            className={classNames({
              [styles.gameDirIsNotPresent]: !directoryIsSet
            })}
            onClick={
              directoryIsSet && !anyActionIsInProgress ? this.runGame : () => {}
            }
          >
            <div
              onMouseEnter={
                directoryIsSet && !anyActionIsInProgress
                  ? this.playClick
                  : () => {}
              }
              style={{
                height: '100%',
                width: '100%',
                backgroundImage: `url(${game.image})`,
                backgroundColor: '#333',
                backgroundRepeat: 'no-repeat',
                backgroundSize: 'cover',
                transition: 'all 0.7s ease'
              }}
              className={classNames({
                [styles.gameDirIsNotPresent]:
                  !directoryIsSet || anyActionIsInProgress,
                [styles.gameDirIsPresent]:
                  directoryIsSet && !anyActionIsInProgress,
                [styles.updateAvailable]:
                  directoryIsSet && updateIsAvailable && !anyActionIsInProgress
              })}
            />
          </div>
          {availableVersion &&
            (availableVersion.isDownloading ||
              availableVersion.isInstalling) && (
              <Progress
                showInfo={false}
                size="small"
                status="active"
                percent={availableVersion?.downloadProgress?.percent}
              />
            )}
        </Content>
        <Footer className={styles.footer} style={{ display: 'flex' }}>
          <h4
            className={styles.title}
            style={{
              flex: 1,
              width: '100%',
              alignItems: 'center',
              marginBottom: 0
            }}
          >
            {game.displayName}
          </h4>
          <Dropdown
            className={styles.dropdown}
            style={{
              flex: 0,
              alignItems: 'center'
            }}
            overlay={menu}
            placement="bottomRight"
            overlayClassName={styles.dropdownItem}
          >
            <Button type="primary">
              <EllipsisOutlined />
            </Button>
          </Dropdown>
        </Footer>
        <div className={styles.common}>
          {directoryIsSelected &&
            availableVersion &&
            !anyActionIsInProgress &&
            (game.currentVersion != null || game.currentVersion !== '') &&
            game.currentVersion === availableVersion?.version && (
              <Button
                type="link"
                className={styles.btnDir}
                onClick={this.runGame}
              >
                <CaretRightOutlined /> Актуальная версия
              </Button>
            )}
          {!directoryIsSelected && (
            <Button
              type="link"
              className={styles.btnDir}
              onClick={this.selectDirectory}
            >
              <FolderOutlined /> Папка с игрой не выбрана
            </Button>
          )}
          {directoryIsSelected &&
            availableVersion &&
            updateIsAvailable &&
            !anyActionIsInProgress && (
              <Button
                type="link"
                className={styles.btnDir}
                onClick={this.downloadAndUpdateTranslation}
              >
                <CloudDownloadOutlined /> Доступно обновление
              </Button>
            )}
          {!translationInProgress && updateIsUnavailable && (
            <Button
              type="link"
              className={classNames({
                [styles.btnDir]: true,
                [styles.btnDirNoAction]: true
              })}
            >
              <WarningOutlined /> Нет доступных обновлений
            </Button>
          )}
          {translationInProgress && updateIsUnavailable && (
            <Button
              type="link"
              className={classNames({
                [styles.btnDir]: true,
                [styles.btnDirNoAction]: true
              })}
            >
              <FileTextOutlined /> В процессе перевода...
            </Button>
          )}
          {availableVersion && availableVersion.isDownloading && (
            <Button
              type="link"
              className={classNames({
                [styles.btnDir]: true,
                [styles.btnDirNoAction]: true
              })}
            >
              <LoadingOutlined /> Загрузка обновления
            </Button>
          )}
          {availableVersion && availableVersion.isInstalling && (
            <Button
              type="link"
              className={classNames({
                [styles.btnDir]: true,
                [styles.btnDirNoAction]: true
              })}
            >
              <SyncOutlined spin /> Установка обновления
            </Button>
          )}
          {availableVersion && availableVersion.isUninstalling && (
            <Button
              type="link"
              className={classNames({
                [styles.btnDir]: true,
                [styles.btnDirNoAction]: true
              })}
            >
              <SyncOutlined spin /> Удаление обновления
            </Button>
          )}
        </div>
      </Layout>
    );
  }
}
