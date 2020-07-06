export default class FileDownloader {
  static getDownloadLink(url: string) {
    if (url.includes('drive.google.com')) {
      return FileDownloader.getGoogleDriveDownloadLinkFromUrl(url);
    }

    if (url.includes('dropbox.com')) {
      return FileDownloader.getDropboxDownloadLinkFromUrl(url);
    }

    return url;
  }

  static getGoogleDriveDownloadLinkFromUrl(url: string) {
    let index: number = url.indexOf('id=');
    let closingIndex: number;
    if (index > 0) {
      index += 3;
      closingIndex = url.indexOf('&', index);
      if (closingIndex < 0) closingIndex = url.length;
    } else {
      index = url.indexOf('file/d/');
      if (index < 0) return ''; // url is not in any of the supported forms

      index += 7;

      closingIndex = url.indexOf('/', index);
      if (closingIndex < 0) {
        closingIndex = url.indexOf('?', index);
        if (closingIndex < 0) closingIndex = url.length;
      }
    }

    return 'https://drive.google.com/uc?id={0}&export=download'.replace(
      '{0}',
      url.substr(index, closingIndex - index)
    );
  }

  static getDropboxDownloadLinkFromUrl(url: string) {
    const link = new URL(url);
    const { searchParams } = link;
    searchParams.set('dl', '1');
    link.search = searchParams.toString();
    return link.toString();
  }

  static isValidURL(str: string = '') {
    const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
      '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
      '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
      '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
      '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
      '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
    return !!pattern.test(str);
  }
}
