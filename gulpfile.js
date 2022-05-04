// Основной модуль
import gulp from "gulp";

// Импорт путей
import { path } from "./gulp/config/path.js";

// Импорт общих плагинов
import { plugins } from "./gulp/config/plugins.js"

//  Передаём значения в глобальную переменную
global.app = {
  isBuild: process.argv.includes("--build"),
  isDev: !process.argv.includes("--build"),
  path: path,
  gulp: gulp,
  plugins: plugins,
}



// Импорт задач

import { copy } from "./gulp/tasks/copy.js"

import { reset } from "./gulp/tasks/reset.js"
import { html } from "./gulp/tasks/html.js"
import { server } from "./gulp/tasks/server.js"
import { scss } from "./gulp/tasks/scss.js"
import { js } from "./gulp/tasks/js.js"
import { images } from "./gulp/tasks/images.js";
import { otfToTtf, TtftoWoff, fontsStyle } from "./gulp/tasks/fonts.js"
import { svgSprite } from "./gulp/tasks/svg-sprite.js";
import { zip } from "./gulp/tasks/zip.js"
import { ftp } from "./gulp/tasks/ftp.js"
import { less } from "./gulp/tasks/less.js"


// Наблюдатель за изменениями в файлах

function watcher() {
  gulp.watch(path.watch.files, gulp.series(reset, copy))
  gulp.watch(path.watch.html, html) //gulp.series(html, ftp) Для постоянного обновления на хостинге
  gulp.watch(path.watch.less, less)
  gulp.watch(path.watch.js, js)
  gulp.watch(path.watch.images, images)

}
watcher()

export { svgSprite }
// Последовательная обработка шрифтов
const fonts = gulp.series(otfToTtf, TtftoWoff, fontsStyle)

// Чтобы переключаться между less и sass, надо менять в вотчере и в mainTasks сценарии.

// const mainTasks = (fonts, gulp.parallel(copy, html, less, js, images))
const mainTasks = (gulp.parallel(copy, html, less, js, images))

// Построение сценариев выполнения задач

const dev = gulp.series(reset, mainTasks, gulp.parallel(watcher, server));
const build = gulp.series(reset, mainTasks);
const deployZIP = gulp.series(reset, mainTasks, zip)
const deployFTP = gulp.series(reset, mainTasks, ftp)

export { dev }
export { build }
export { deployZIP }
export { deployFTP }


// Выполнение сценария по умолчанию

gulp.task("default", dev)