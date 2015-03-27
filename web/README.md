# kepule 前端 #

## 前言 ##
这是一个前端开发的标准，它集成了 **样式库 组件库 自动打包** 等功能

为此你需要安装一些必要的运行环境

- nodejs: [http://nodejs.org/](http://nodejs.org/ "nodejs")<br>
- gruntjs: [http://www.gruntjs.org/](http://www.gruntjs.org/ "gruntjs")


any problems please [@csii_shaoyh](mailto:csii_shaoyh@spdbdv.com?subject=kepule "@csii_shaoyh")

**enjoy it**

2014/9/10 15:21:43 

## css ##
css文件结构如下

- themes
 - default
     - css
         - kepule.css
         - kepule_ie7_fix.css
         - base.css locallize

kepule.css是基础样式库，kepule_ie7_fix.css是为ie7打的补丁包，base.css是localize

example：施工中...

## js ##
js文件结构如下

- js
  - dev
  	 - lib
		 - angular.min.js
		 - es5-shim.min.js
		 - jquery-1.11.1.mini.js
		 - json3.min.js
		 - spin.js
	 - module
  		 - base.js
  		 - component.js
  		 - config.js
  		 - service.js
	 - controller
		 - projectA
			 - ctrlA-1.js
			 - ctrlA-2.js
  - pro

js分为 **dev** 和 **pro** 两部分，日常开发工作在 **dev** 下进行

lib中包含的是基础js库，module是angular所依赖的模块，controller顾名思义，这里就不做解释啦

example：施工中...

## 打包 ##
有了gruntjs，前端的打包任务也可以自动化了

来看看根目录下的Gruntfile.js
> 
	uglify : {
		options : {
				mangle : true,
				banner : "/** \n"
						+ " * -------------------------------------------------------------\n"
						+ " * @version: <%= pkg.version%> \n"
						+ " * @description: <%= pkg.description%> \n"
						+ " * ------------------------------------------------------------- \n"
						+ " */ \n\n"
		},
		demo: {
				files : [{
					expand: true,
                    cwd: "js/dev/module",
                    src: ["**/*.js"],
                    dest: "js/pro/module"
				}, {
					expand: true,
                    cwd: "js/dev/controller",
                    src: ["**/*.js"],
                    dest: "js/pro/controller"
				}]
		}
	},
	copy: {
		demo : {
			expand: true,
            cwd: "js/dev/lib",
            src: ["**/*.js"],
            dest: "js/pro/lib"
		}
	}

uglify任务：将 *js/dev/module* 和 *js/dev/controller* 的js文件分别打包至 *pro* 对应目录下

copy任务：将 *js/dev/lib* 中的js文件拷贝至  *js/pro/lib* 目录下

## ps ##
1. markdown真是好用，这里推荐一下，比word什么的方便省事多了
2. js和css的例子还在施工中，有兴趣的童鞋帮我一起写，邮箱在留在上面了
3. css的打包和gzip还没做，童鞋们也可以pull给我哈
4. 这是个永久测试版，出任何问题了我不负责