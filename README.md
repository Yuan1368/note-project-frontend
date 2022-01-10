# 教程

## 安装

使用`npx create-react-app note-project`进行项目安装，`note-project`是项目名。

安装完成后的项目目录结构：

![image-20220106101218588](https://raw.githubusercontent.com/bearbaba/imgs-repo/main/202201061012381.png)

## 开始前的配置

开始前需要配置相关插件用于提交代码后格式化代码。

### prettier

使用 prettier （[https://prettier.io/docs/en/install.html](https://prettier.io/docs/en/install.html)）格式化代码：

```shell
npm install --save-dev --save-exact prettier
echo {}> .prettierrc.json // 最好手动配置 .prettierrc.json 文件， windows下使用 echo 会存在格式问题
```

根目录下创建一个 .prettierignore 文件，文件写入：

```reStructuredText
# Ignore artifacts:
build
coverage
```

使用 Pre-commit Hook
（[https://prettier.io/docs/en/precommit.html](https://prettier.io/docs/en/precommit.html)）在代码每次提交时自动进行格式化。

```shell
npx mrm lint-staged
// 有可能会安装失败，因为 mrm 需要单独安装，可以使用 npm install mrm
```

### ESlint

使用`eslint-config-prettier`避免 ESlint 与 Prettier 发生冲突：

```shell
npm install --save-dev eslint-config-prettier
```

再去`package`文件中修改`eslintConfig`配置，在`extends`这一条中添加`prettier`这一项：

```text
"eslintConfig": {
  "extends": [
        "react-app",
        "react-app/jest",
        "prettier"
    ]
}
```

同时还要添加：

```json
"husky": {
"hooks": {
"pre-commit": "lint-staged"
}
},
"lint-staged": {
"*.{js,css,md,ts,tsx}": "prettier --write"
}
```

### commitlint

全局安装：**npm install -g commitizen**；

项目安装： **npm install cz-conventional-changelog**；

在 package.json 中进行配置：

```text
"config": {
  "commitizen": {
  "path": "node_modules/cz-conventional-changelog"
  }
}
```

执行 **git add . ** ，再执行 **git cz **，出现提示如下，则说明配置成功:

![db882df6c49440b0b391e6c08507e540_tplv-k3u1fbpfcp-watermark](https://raw.githubusercontent.com/bearbaba/imgs-repo/main/202112121438768.webp)

校验 commit 格式：

```shell
npm i -D @commitlint/config-conventional @commitlint/cli
```

根目录下创建 commitlint.config.js 文件，写入配置：

```js
module.exports = {
  extends: ["@commitlint/config-conventional"],
  rules: {},
};
```

查看 husky 的版本；

- **如果版本 < 5.0.0 **，在 package.json 中配置：

```json
"husky": {
"hooks": {
"pre-commit": "lint-staged",
"commit-msg": "commitlint -e $GIT_PARAMS"
}
},
```

注：`"pre-commit"`在之前已经配置过，新增的是`"commit-msg"`这一条。

- **若 husky 版本 >=5.0.0：**

执行 **npx husky install** 安装 git 钩子

执行 **npx husky add .husky/commit-msg 'npx commitlint --edit $1'** 启用适配 commitlint 的 commit-msg hook

如果 **git commit** 不符合`commitlint`规范（https://github.com/conventional-changelog/commitlint），那么提交就会失败。

## 数据渲染

一开始在`index.js`中添加便笺内容：

```jsx
import ReactDOM from "react-dom";
import App from "./App";

const notes = [
  {
    id: 1,
    content: "HTML is easy",
    date: "2019-05-30T17:30:31.098Z",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    date: "2019-05-30T18:39:34.091Z",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    date: "2019-05-30T19:20:14.298Z",
    important: true,
  },
];

ReactDOM.render(<App notes={notes} />, document.getElementById("root"));
```

使用`props`将父组件内容传递给`App`组件。

```jsx
import "./App.css";

function App({ notes }) {
  return (
    <div className="App">
      <ul>
        {notes.map((note) => (
          <li>{note.content}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
```

我们采取 React 的建议为每一项添加独一无二的`key`值。

```jsx
{
  notes.map((note) => <li key={note.id}>{note.content}</li>);
}
```

但是并不推荐使用`map`的`index`作为`key`值。

我们可以将`map`渲染的每一项抽离出来作为`Note`组件，组件存放在`components`目录下：

```jsx
export const Note = ({ content }) => {
  return <li>{content}</li>;
};
```

`index.js`中的内容更新为：

```jsx
{
  notes.map((note) => <Note content={note.content} key={note.id} />);
}
```

## 表单

现在增加表单，让页面拥有获得添加新的便笺内容的功能。

从表现上看，添加输入框与添加按钮。

```jsx
import "./App.css";
import { Note } from "./components/note";
import { useState } from "react";

function App(props) {
  const [notes, setNotes] = useState([...props.notes]);
  const [newNote, setNewNote] = useState("new Note");

  const addNote = (event) => {
    event.preventDefault();
    console.log(newNote);
  };

  const handleOnChange = (event) => {
    setNewNote(event.target.value);
  };

  return (
    <div className="App">
      <h1>Note</h1>
      <ul>
        {notes.map((note) => (
          <Note content={note.content} key={note.id} />
        ))}
      </ul>
      <form>
        <input value={newNote} onChange={handleOnChange} />
        <button type={"submit"} onClick={addNote}>
          save
        </button>
      </form>
    </div>
  );
}

export default App;
```

`event`为 React 提供的合成事件，`event.target.value`能够获取输入框内容。

我们现在更新`addNote`函数，让它具有生成新的`note`功能。

```jsx
const addNote = (event) => {
  event.preventDefault();
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  };

  setNotes([...notes, noteObject]);
  setNewNote("");
};
```

现在添加一个新功能：增加一个按钮能自由切换展示`note.important`为`true`或者全部`note`。

```jsx
const [showAll, setShowAll] = useState(true);

const notesToShow = showAll ? notes : notes.filter((note) => note.important);

<form>
  <input value={newNote} onChange={handleOnChange} />
  <button type={"submit"} onClick={addNote}>
    save
  </button>
  <button type={"button"} onClick={setShowAll.bind(this, !showAll)}>
    {showAll ? "show important" : "show all"}
  </button>
</form>;
```

`onClick={setShowAll.bind(this, !showAll)`也可以写成箭头函数：`onClick = {()=>setShowAll(!showAll)}`。

## 服务端

为了更好地模拟服务端数据，使用`json-server`进行数据监视。

在`package.json`文件中配置：

```json
"scripts": {
"start": "react-scripts start",
"build": "react-scripts build",
"test": "react-scripts test",
"eject": "react-scripts eject",
"prepare": "husky install",
"json-server": "json-server -p 3001 --watch __json_server_mock__/db.json "
},
```

安装`axios`包用于获取数据。

有了`axios`后，可以使用`axios.get()`方法获取到所有的数据。

删除`index.js`中的`notes`，我们将在`App`组件中直接获取数据：

```jsx
useEffect(() => {
  axios.get("http://localhost:3001/notes").then((res) => {
    setNotes([...res.data]);
  });
}, []);
```

同时可以使用`axios.post()`方法增添新便笺：

```jsx
const addNote = (event) => {
  event.preventDefault();
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  };
  axios.post("http://localhost:3001/notes", noteObject).then((res) => {
    setNotes([...notes, res.data]);
    setNewNote("");
  });
};
```

增加一个新的功能：允许切换组件的`important`值。

```jsx
<Note
  content={note.content}
  onClick={() => taggleNoteImportant(note.id)}
  key={note.id}
/>
```

我们需要使用到`axios.put()`方法用于替换`notes`中的某一项：

```jsx
const taggleNoteImportant = (id) => {
  let _note = notes.find((note) => note.id === id);
  axios
    .put(`http://localhost:3001/notes/${id}`, {
      ..._note,
      important: !_note.important,
    })
    .then((res) => {
      let changedNote = res.data;
      setNotes([
        ...notes.map((note) =>
          note.id === changedNote.id ? changedNote : note
        ),
      ]);
    });
};
```

url 中的`/notes/${id}`用于表示`notes`中`id`值为`${id}`的一项。

## 封装网络请求

为了让整个目录更加清晰，将相关的网络请求方法封装进工具文件中。

首先新建`.env`文件，该文件写入服务端地址，

```text
REACT_APP_API_URL = http://localhost:3001
```

再新建`utils`工具文件夹。该文件下新建`http.js`用于封装对后端的请求方法：

```js
import axios from "axios";

const baseUrl = process.env.REACT_APP_URL_API;
const notesApi = baseUrl + "/notes";

const getAllNotes = () => {
  return axios.get(notesApi).then((res) => res.data);
};

const postNotes = (note) => {
  return axios.post(notesApi, note).then((res) => res.data);
};

const updateNote = (id, note) => {
  return axios.put(`${notesApi}/${id}`, note).then((res) => res.data);
};

export const http = {
  getAllNotes,
  postNotes,
  updateNote,
};
```

导出的`http`对象中包含了`getAllNotes`、`postNotes`、`updateNote`三个方法。现在能够在`App`组件中使用`http`对象方法：

```jsx
useEffect(() => {
  http.getAllNotes().then((res) => setNotes(res));
}, []);

const addNote = (event) => {
  event.preventDefault();
  const noteObject = {
    content: newNote,
    date: new Date().toISOString(),
    important: Math.random() < 0.5,
    id: notes.length + 1,
  };

  http.postNotes(noteObject).then((res) => {
    setNotes([...notes, res]);
    setNewNote("");
  });
};

const taggleNoteImportant = (id) => {
  let _note = notes.find((note) => note.id === id);

  http
    .updateNote(id, {
      ..._note,
      important: !_note.important,
    })
    .then((res) => {
      let changedNote = res;
      setNotes([
        ...notes.map((note) =>
          note.id === changedNote.id ? changedNote : note
        ),
      ]);
    });
};
```

## 添加样式

`App`中新建一个`notification`组件，该组件用于模拟显示新建便笺发生错误的通知，并使用`className`引入样式：

```jsx
// App.js
<Notification message={errorMessage} />
```

```jsx
// utils/components
export const Notification = ({ message }) => {
  if (message === null) {
    return;
  } else {
    return <div className={"error"}>{message}</div>;
  }
};
```

```css
/*App.css*/
.app .error {
  color: red;
  font-size: 20px;
  background: #e1dfdf;
  text-align: center;
  padding: 5px;
}
```

![image-20220107162303884](https://raw.githubusercontent.com/bearbaba/imgs-repo/main/202201071623267.png)

## 使用 Express 模拟真实环境

为了让我们前后端能有更多的交互，现在根目录下新建一个`Express`的后端项目。

先对项目进行初始化：

```shell
npm init
```

然后安装`express`:

```shell
npm install express
```

由于使用`node`在代码更改后无法热更新，所以我们安装`nodemon`:

```shell
npm install nodemon
```

在根目录下新建`index.js`,文件内容为：

```js
const express = require("express");
const { response, request } = require("express");
const app = express();

const notes = {
  notes: [
    {
      id: 1,
      content: "HTML is easy",
      date: "2019-05-30T17:30:31.098Z",
      important: true,
    },
    {
      id: 2,
      content: "Browser can execute only JavaScript",
      date: "2019-05-30T18:39:34.091Z",
      important: true,
    },
    {
      id: 3,
      content: "GET and POST are the most important methods of HTTP protocol",
      date: "2019-05-30T19:20:14.298Z",
      important: false,
    },
    {
      content: "new Note",
      date: "2022-01-07T08:13:20.132Z",
      important: false,
      id: 4,
    },
  ],
};

// 如果发送 get 请求，且 url 为 "/"，则响应发送"<h1>Hello world</h1>"
app.get("/", (req, res) => {
  res.send("<h1>Hello world</h1>");
});

// 如果发送 get 请求，且 url 为 "/notes"，则响应发送 notes
app.get("/notes", (req, res) => {
  res.json(notes);
});

// 表示监听 3001 端口，并在控制台上答应内容
app.listen(3001, () => {
  console.log("this is running...");
});
```

使用`nodemon index.js`来运行程序。

`express`中的`res.json()`会自动处理将 js 中的数据格式转换为`json`格式，所以响应发送`notes`并不需要 JSON 格式化处理。

现在我们希望得到单个便笺的内容，这里我们利用 RESTful 标准：

```js
app.get("/api/notes/:id", (req, res) => {
  const note = notes.find((note) => note.id === req.params.id);
  res.json(note);
});
```

这里的含义是：当我们发送`get`请求，且请求内容是类似`/api/notes/4`形式时，`request`的`params`将含有`id`值为 4 的属性。

但是上述是存在一个问题的，`params`的值是字符串类型，而在`notes`中`id`值类型为数字，所以我们需要把`params.id`值转换成`number`类型。

现在我们新增一个请求，删除指定`id`的便笺，这里就需要我们对`delete`做出响应：

```js
app.delete("/api/notes/:id", (req, res) => {
  notes = notes.filter((note) => note.id !== Number(req.params.id));
  res.status(202).end();
});
```

但是这里依然存在一个 bug，如果删除了不存在的便笺，返回的响应码依然是 202,并没有处理 404 的情况。

## express 处理 post 请求

`express`在上述中对`get`，`delete`都是对`request`的`params`数据的读取，`post`请求则是将数据发送给服务器，需要读取的是`request.body`。

由于发送请求的数据格式是 JSON ，我们需要使用`express`中的`json-parser`中间件，将`body`的数据格式转换成 js 数据格式。

```js
app.use(express.json());
```

这个时候我们就能够通过读取`req.body`的数据来实现 post 的过程：更新 notes，然后将新增的 note 作为响应信息发送出去。

这里的`app.use`使用了中间件函数`express.json()`，

事实上，我们可以自己定义一个我们想要的中间件函数，例如这里我们添加一个新的功能，在每次发送请求时，打印除请求的一些信息：

```js
// 定义一个中间件处理 打印请求日志
const requestLogger = (req, res, next) => {
  console.log("path:", req.path);
  console.log("method", req.method);
  console.log("body", req.body);
  next();
};

app.use(requestLogger);
```

由于这个中间件是在处理之前进行的，所以我们要把它的位置放在处理路由之前，还有一些中间件是放在处理路由之后，

例如，当我们没有找到匹配的路由时，我们就执行返回`status`为 404 的中间件：

```js
const unknownEndPoint = (req, res) => {
  res.status(404).send({ content: "error" }).end();
};

app.use(unknownEndPoint);
```

## 处理跨域

由于跨域问题的存在，我们的前端可能无法访问到后端内容，因而我们在后端上安装`cors`包，来处理前端请求跨域：

```js
const cors = require("cors");
app.use(cors());
```

## 部署到 heroku

我们可以把应用迁移到互联网上，我将使用 heroku 来进行部署，使用前需要下载 heroku 的脚手架，另外还需要一个 heroku 的账号。

然后首先需要在 github 上创建一个仓库用来存放后端代码，当我们的后端代码已经存放到了 github 仓库内我将进行下一步操作，

在后端项目中创建一个 Procfile 文件，文件内写入：

```text
web: npm start
```

事实上文件内容与`package.json`中启动项目的配置是一致的。

更改`index.js`关于端口的配置：

```js
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

然后我们执行`heroku create`命令创建一个 heroku 应用，

可能在执行这个命令前我们还需要使用`heroku login -i`以及 heroku 的账户来登录 heroku 应用。

再把项目部署到 heroku 上：

```git
git push heroku main
```

在这个命令执行后控制台会出现一个远程的 url ，如果没有可以使用`heroku logs`命令查看问题。

## 前端部署到 heroku

有了 heroku 后，我们可以使用`npm run build`来打包我们的前端项目，

不过我们可以先尝试着把 env 中关于`REACT_APP_URL_API`改成 heroku 生成的 url，然后再执行`build`命令。

build 后会生成一个`build`文件夹，将这个文件夹放进后端项目中，

然后在`index.js`文件中增加处理`build`后的文件的中间件：

```js
app.use(express.static("build"));
```

此时需要把更新后的文件`push`到`heroku`上。 然后再去访问`heroku`生成的 url ，得到将是构建的前端页面。

也可以把前端中的地址更改成相对地址，因为此时前端生成的内容与后端是相当于放在同一服务器上的（即 heroku）。

```text
REACT_APP_URL_API = /api
```

尽管我们的`api`实际上应当是`/api/notes`，但是我们之前有写过`const notesApi = baseUrl + "/notes"`，所以还是尽量区分开全部`api`与`api`下的`notes`接口为好。

我们现在每一次更新前端都需要 build 后部署到 heroku 上毕竟过于繁琐，但是我们如果不 build 而是像之前那样执行 serve ，现在又因为使用的是相对地址，获取不到实际后端的 api ，所以可以在`package.json`中配置 proxy：

```text
"proxy": "https://shielded-sierra-99726.herokuapp.com/"
```

代理的地址是 heroku 生成的 url 。

另外我们可以在后端项目中的`package.json`添加以下脚本，简化手动打包的复杂过程：

```text
{
  "scripts": {
     //...
    "build:ui": "rm -rf build && cd ../part2-notes/ && npm run build && cp -r build ../notes-backend",
    "deploy": "git push heroku main",
    "deploy:full": "npm run build:ui && git add . && git commit -m uibuild && git push && npm run deploy",
    "logs:prod": "heroku logs --tail"
  }
}
```

以上命令中出现的路径应该根据实际情况进行修改。

- `build:ui`命令是删除`build`文件后，在切到前端项目中执行 build 命令后，把`build`文件夹粘贴进后端库内；

- `deploy`命令则是进行 heroku 的部署；

- `deploy:ui`命令会将这两者结合起来，并包含更新后端存储库所需的 git 命令；

- `npm run logs:prod`用于显示 heroku 日志。

有了如上脚本能够快速进行 heroku 的部署活动。
