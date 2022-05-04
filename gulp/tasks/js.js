import webpack from "webpack-stream"
import sourcemaps from "gulp-sourcemaps"


export const js = () => {
    return app.gulp.src(app.path.src.js)
        .pipe(app.plugins.if(app.isDev, sourcemaps.init()))
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "JS",
                message: "Error: ${error.message}"
            })
        ))
        .pipe(webpack({
            mode: app.isBuild ? "production" : "development",
            output: {
                filename: 'app.min.js'
            }
        }
        ))
        .pipe(app.plugins.if(app.isDev, sourcemaps.write()))
        .pipe(app.gulp.dest(app.path.build.js))
        .pipe(app.plugins.browsersync.stream())

}