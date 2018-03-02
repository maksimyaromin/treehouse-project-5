# Use a Public API to Create an Employee Directory
Task potential realization instance according to Unit 5 Treehouse Full-Stack 
JS Developer Program. 
In the Task #2 which resembles closely the giving Task, I have arranged the logic in the form of a small jQuery-plugin. For example, so as to initialize the Employee Directory one need to write the following:  
```js
    $("{your selector here}").employees({ ...your options here });
```

#### The plugin has certain setting-ups (just to make it more interesting) 
| Setting | Description | Default value |
| --- | --- | --- |
| `dataSource` | setting up of the data details   | *null* |
| `dataSource.data` |  specify simultaneous data details (not applicable for the Task)  | ``` new Array(0) ``` |
| `dataSource.transport` | function receiving two callbacks (success, error) and define AJAX-call of the data details | *null* |
| `filterable` | setting-up, showing whether to initialize the search box or not  | *false* |
| `detail` | setting-up showing whether to initialize the opening of the supply information window by clicking on the users card , | *false* |

As usual, for the slicing I used SCSS and Compass. I think it resembles closely your blueprints. If the search option turns on, the data will be refined according to the sequence of inserted symbols in names, surnames or the users nickname. For example, if you insert *t*, the list of suitable users will be the following:
* ``` { name: { first: "Tom" } } ```
* ``` { name: { last: "Skott" } } ```
* ``` { login: { username: "skout56" } } ```

To run the project one can start index.html file in its browser
or 
use the following commands:
```shell
    npm install
    npm start
```

### I hope you will enjoy it. Max Eremin

