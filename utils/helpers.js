function getFilenameByCurrentTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0'); // ماه از 0 شروع میشه
  const day = String(now.getDate()).padStart(2, '0');

  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  // ساختن فرمت امن برای نام فایل
  const filename = `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;

  return filename;
}


module.exports = {
    getFilenameByCurrentTime
}
