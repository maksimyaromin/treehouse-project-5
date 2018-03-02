# Use a Public API to Create an Employee Directory
Task potential realization instance according to Unit 5 Treehouse Full-Stack 
JS Developer Program. 

Как и в задании #2, на которое это задание очень похоже, логику я организовал в виде маленького jQuery-плагина. Например, для того, чтобы инициализировать где-тодиректорию пользователей, нужно написать следующее:
```js
    $("{your selector here}").employees({ ...your options here });
```

#### Плагин имеет некоторые настройки (просто для того, чтобы было интересней).
| Setting | Description | Default value |
| --- | --- | --- |
| `dataSource` | настройка источника данных  | *null* |
| `dataSource.data` | задать синхронный источник данных (для нашего задания не годиться)  | ```js new Array(0) ``` |
| `dataSource.transport` | функция, которая принимает два коллбэка (success, error) и описывает AJAX-запрос за данными  | *null* |
| `filterable` | настройка, показывающая инициализировать ли поле поиска или нет | *false* |
| `detail` | настройка, показывающая инициализировать ли открытие окна с дополнительной информацией по клику на карточку пользователя | *false* |

Для верстки я использовал SCSS и Compass как и всегда прежде. По моему, получилось очень похоже на ваши макеты.

Если включена опция посика, то фильтроваться данные будет по наличию последовательности введенных символов в имени, фамилии или нике пользователя. Т. е. если введено 
*t*, то подошедшими к запросу будут следующие пользователи:
* ```js { name: { first: "Tom" } }```
* ```js { name: { last: "Skott" } }```
* ```js { login: { username: "skout56" } }```

To run the project one can start index.html file in its browser
or 
use the following commands:
```shell
    npm install
    npm start
```

### I hope you will enjoy it. Max Eremin