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

```json
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

```json
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
