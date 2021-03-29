# Cloutlayer Starter Theme

A boilerplate to kickstart creating [Cloutlayer](https://www.cloutlayer.com) themes!
Fork this repository and start your development here with all the main things you need to develop a custom Cloutlayer theme.

![screenshot-desktop](https://www.cloutlayer.com/media/2021/3/images/Cloutlayer-Starter-Theme-Share-Image.original.png)

## Cloutlayer Themes

Cloutlayer uses a simple templating language called [Handlebars](http://handlebarsjs.com/) for its themes.

[Read the Handlebars documentation](https://handlebarsjs.com/guide/). _It's super easy._ 😉

## Development

You'll need [Node](https://nodejs.org/), Java and [Gulp](https://gulpjs.com) installed globally. 
After that, from the theme's root directory:

```bash
# install dependencies
npm install

# run development server
gulp dev
```

### Commands

- ```gulp dev```: Runs the development server locally.
- ```gulp build```: Compiles CSS and JS files.
- ```gulp zip```: Packages the theme files into `dist/theme-<timestamp>.zip`, which you can then upload to your website.
- ```gulp zipAssets```: Packages the theme design assets into `dist/theme-assets-<timestamp>.zip`, which you can then upload to your website.

## Project Structure

- `assets`: design assets — example: styles, scripts, images, fonts and icons
- `assets/built`: compiled styles (CSS) and scripts (JS)
- `data`: data to apply to Handlebars templates
- `public`: robots.txt, humans.txt, favicon and manifests
- `templates`: entry templates — example: layouts and pages
- `templates/partials`: reusable templates — example: header, footer, etc

## Roadmap

| Status        | Feature                                                                                                                                 |
|---------------|-----------------------------------------------------------------------------------------------------------------------------------------|
| 🚧 in progress | VIDEO: Step by step tutorial for fellas who are not familiar with node and gulp.                                                        |
| 🚧 in progress | SASS                                                                                                                                    |
| submitted     | LESS                                                                                                                                    |
| submitted     | Assets deployment (to Cloutlayer Global CDN)                                                                                            |
| submitted     | Theme deployment                                                                                                                        |
| submitted     | Images and SVGs optimization                                                                                                            |
| submitted     | PWA Icons generator                                                                                                                     |
| submitted     | Preview with real data from Cloutlayer CMS                                                                                              |
| submitted     | Tool that checks for errors, deprecations and other compatibility issues                                                                |
| submitted     | Support for various front-end frameworks such as Bootstrap, Tailwind CSS, Foundation, Bulma, Materialize CSS, Pure, Skeleton, and more. |
| submitted     | Ready-to-use design blocks                                                                                                              |
| submitted     | Tests for templates                                                                                                                     |
| submitted     | Screenshots                                                                                                                             |
| submitted     | VIDEO: How to make the most out of Cloutlayer                                                                                           |

# Copyright & License

Copyright (c) 2020-2021 DGK Software House - Released under the [Apache 2.0 license](LICENSE).
