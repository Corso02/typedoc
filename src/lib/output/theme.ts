import type { Renderer } from "./renderer";
import type { ProjectReflection } from "../models/reflections/project";
import type { UrlMapping } from "./models/UrlMapping";
import type { NavigationItem } from "./models/NavigationItem";
import { RendererComponent } from "./components";
import { Component } from "../utils/component";
import type { PageEvent } from "./events";
import type { Reflection } from "../models";

/**
 * Base class of all themes.
 *
 * A theme defines the logical and graphical output of a documentation. Themes are
 * directories containing a ```theme.js``` file defining a {@link BaseTheme} subclass and a
 * series of subdirectories containing templates and assets. You can select a theme
 * through the ```--theme <path/to/theme>``` commandline argument.
 *
 * The theme class controls which files will be created through the {@link BaseTheme.getUrls}
 * function. It returns an array of {@link UrlMapping} instances defining the target files, models
 * and templates to use. Additionally themes can subscribe to the events emitted by
 * {@link Renderer} to control and manipulate the output process.
 *
 * The default file structure of a theme looks like this:
 *
 * - ```/assets/```<br>
 *   Contains static assets like stylesheets, images or javascript files used by the theme.
 *   The {@link AssetsPlugin} will deep copy this directory to the output directory.
 *
 * - ```/layouts/```<br>
 *   Contains layout templates that the {@link LayoutPlugin} wraps around the output of the
 *   page template. Currently only one ```default.hbs``` layout is supported. Layout templates
 *   receive the current {@link PageEvent} instance as their handlebars context. Place the
 *   ```{{{contents}}}``` variable to render the actual body of the document within this template.
 *
 * - ```/partials/```<br>
 *   Contains partial templates that can be used by other templates using handlebars partial
 *   syntax ```{{> partial-name}}```. The {@link PartialsPlugin} loads all files in this directory
 *   and combines them with the partials of the default theme.
 *
 * - ```/templates/```<br>
 *   Contains the main templates of the theme. The theme maps models to these templates through
 *   the {@link BaseTheme.getUrls} function. If the {@link Renderer.getTemplate} function cannot find a
 *   given template within this directory, it will try to find it in the default theme
 *   ```/templates/``` directory. Templates receive the current {@link PageEvent} instance as
 *   their handlebars context. You can access the target model through the ```{{model}}``` variable.
 *
 * - ```/theme.js```<br>
 *   A javascript file that returns the definition of a {@link Theme} subclass. This file will
 *   be executed within the context of TypeDoc, one may directly access all classes and functions
 *   of TypeDoc. If this file is not present, an instance of {@link DefaultTheme} will be used to render
 *   this theme.
 */
@Component({ name: "theme", internal: true })
export abstract class Theme extends RendererComponent {
    /**
     * Create a new BaseTheme instance.
     *
     * @param renderer  The renderer this theme is attached to.
     */
    constructor(renderer: Renderer) {
        super(renderer);
    }

    /**
     * Map the models of the given project to the desired output files.
     * It is assumed that with the project structure:
     * ```text
     * A
     * |- B
     *    |- C
     * ```
     * If `B` has a UrlMapping, then `A` also has a UrlMapping, and `C` may or
     * may not have a UrlMapping. If `B` does not have a UrlMapping, then `A`
     * may or may not have a UrlMapping, but `C` must not have a UrlMapping.
     *
     * @param project The project whose urls should be generated.
     * @returns A list of {@link UrlMapping} instances defining which models
     * should be rendered to which files.
     */
    abstract getUrls(project: ProjectReflection): UrlMapping[];

    /**
     * Create a navigation structure for the given project.
     *
     * A navigation is a tree structure consisting of {@link NavigationItem} nodes. This
     * function should return the root node of the desired navigation tree.
     *
     * The {@link NavigationPlugin} will call this hook before a project will be rendered.
     * The plugin will update the state of the navigation tree and pass it to the
     * templates.
     *
     * @param project  The project whose navigation should be generated.
     * @returns        The root navigation item.
     */
    abstract getNavigation(project: ProjectReflection): NavigationItem;

    /**
     * Renders the provided page to a string, which will be written to disk by the {@link Renderer}
     */
    abstract render(page: PageEvent<Reflection>): string;
}
