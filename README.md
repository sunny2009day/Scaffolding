# sun-cli

A simple CLI for scaffolding personal projects.

# environment
Environment node 8 is required

### Installation
 
``` bash
$ npm install -g sun-cli
```

### Usage

``` bash
$ sun
 
  Usage: sun <command> [options]
   
  Options:
    -V, --version  output the version number
    -h, --help     output usage information
    
  Commands:

    list           list available official templates
    init           generate a new project from a template
    create         generate new dao|service|store
    help [cmd]     display help for [cmd]
```

Example:

``` bash
$ sun list
  
  Available official templates:
  
  ★  Single - Single Page, Multi Module
  ★  Multi - Single Page Multi Module
  ★  Single - Single Page Single Module
```
This command list all official templates which can be used to generate new project.

```bash
$ sun init spmm my-project
```
This command pulls the template from [spmm](https://github.com/swj-git/spmm), prompts for some information, and generates the project at `./my-project/`.

```bash
$ sun create
  
  Usage: sun-create <dao|service|store>
 
  Options:
    -h, --help  output usage information
     
  Examples:
    # create a new dao|service|store
    $ sun create dao
```
Above example generates new dao file for current project.

```bash
$ sun cm
 
  Usage: sun-cm <template-name> [module-name]
 
  Options:
    -h, --help  output usage information
     
  Examples:
    # create a new module with an official template
    $ sun cm spmm module1

```
Above example generates new module in current project.

### Official Templates

The purpose of official Vue project templates are to provide opinionated, battery-included development tooling setups so that users can get started with actual app code as fast as possible. 

All official project templates are repos in the [GitHub](https://github.com/swj-git). When a new template is added to the organization, you will be able to run `sun init <template-name> <project-name>` to use that template. You can also run `sun list` to see all available official templates.

Current available templates include:

- [spsm](https://github.com/swj-git) - A single page application with only one module.
- [spmm](https://github.com/swj-git) - A single page application with multiple modules.
- [mpmm](https://github.com/swj-git) - A multiple page application with multiple modules.

### License

[MIT](http://opensource.org/licenses/MIT)
