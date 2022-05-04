import dartSass from "sass"
import gulpSass from "gulp-sass"
import rename from "gulp-rename"
import cleanCss from "gulp-clean-css"
import webpcss from "gulp-webpcss"
import autoPrefixer from "gulp-autoprefixer"
import groupCssMediaQueries from "gulp-group-css-media-queries"
import sourcemaps from "gulp-sourcemaps"

const sass = gulpSass(dartSass)

export const scss = () => {
    return app.gulp.src(app.path.src.scss)
        .pipe(app.plugins.if(app.isDev, sourcemaps.init()))
        .pipe(app.plugins.plumber(
            app.plugins.notify.onError({
                title: "SCSS",
                message: "Error: ${error.message}"
            })
        ))
        .pipe(app.plugins.replace(/@img\//g, "../img/"))
        .pipe(sass({
            outputStyle: 'expanded'
        }))
        .pipe(app.plugins.if(app.isBuild, groupCssMediaQueries()))
        .pipe(app.plugins.if(app.isBuild,
            webpcss({
                webpClass: ".webp",
                noWebpClass: ".no-webp"
            })
        ))
        .pipe(app.plugins.if(app.isBuild, autoPrefixer({
            grid: true,
            overrideBrowserslist: ["last 3 versions"],
            cascade: true,
        }

        )))
        .pipe(app.plugins.if(app.isBuild, cleanCss()))
        .pipe(app.plugins.if(app.isBuild, rename({
            extname: ".min.css"
        })))
        .pipe(app.plugins.if(app.isDev, sourcemaps.write()))
        .pipe(app.gulp.dest(app.path.build.css))
        .pipe(app.plugins.browsersync.stream())

}