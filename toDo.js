let ToDo= [];
const  EMPTYLIST=0, LOADED=1, INVALIDJSON=2;
function saveToDoObject(toDoDetails)
{
    ToDo[ToDo.length]=toDoDetails;
    storeToDos();
}

function storeToDos()
{
    if(ToDo.length>=1)
    {
        let jsonString= JSON.stringify(ToDo);
        localStorage.setItem('friendlyToDo', jsonString);
    }
    else
    {
        localStorage.setItem('friendlyToDo', null);
    }
}

function loadToDos()
{
    let jsonString= localStorage.getItem('friendlyToDo');
    if(JSON.parse(jsonString) == null)
        return EMPTYLIST;
    try {
        ToDo=JSON.parse(jsonString);
        jsonString='';
    } catch{
        return INVALIDJSON;
    }
    return LOADED;
}

function buildLoadedToDos(idSlab, containerId)
{
    let contentElement= document.querySelector('#'+idSlab);
    let containerElement= document.querySelector('#'+containerId);
    switch(loadToDos())
    {
        case 0:
            alert('Empty storage created!');
            break;
        case 1:
            let todoObject={};
            clearContent(idSlab);
            createClearBtn(containerElement);
            for(let i=0; i<ToDo.length; i+=1)
            {   
                todoObject= ToDo[i];
                contentElement.appendChild(toDoTab(todoObject['tab'+(i+1)], i, [
                    {btnClass: 'status-btn', btnID: (i+3), imgClass: 'status-icon', imgId: i, func: 'updateStatus("'+i+'"\,"'+(i+3)+'")', imgSrc:''},
                    {btnClass: 'edit-btn', btnID: '', imgClass: 'edit-icon', imgId: '', func: 'editToDo("'+(i+1)+'")', imgSrc: 'Project icons/edit icon.png'},
                    {btnClass: 'remove-btn', btnID: '', imgClass: 'remove-icon', imgId: '', func: 'removeToDo("'+(i+1)+'")', imgSrc: 'Project icons/remove icon.png'},

                ]));
            }
            alert('Data loaded succesfully!');
            break;
        case 2:
            alert('Error!: Data is lost/corrupted');
            break;
    }
}

function toDoTab(title, num, schema)
{
    let todoElement= buildTab(title, num);
    todoElement.appendChild(tabButtons(schema));
    return todoElement;
}

function addToDo(idInput, idSlab)
{
    let toDoName= (document.querySelector('#'+idInput)).value;
    if(toDoName !== '')
    {
        toDoContent(idSlab, toDoName);
        toDoName.value= '';
        
    }
    else
    {
        alert('Invalid Action, To Do Name not included!');
    }
}

function createClearBtn(containerElement)
{
    let clearBtn= document.createElement('button');
    clearBtn.classList.add('clear-btn');
    clearBtn.innerText= 'Clear List';
    clearBtn.setAttribute('onclick', 'clearList()');
    containerElement.appendChild(clearBtn);
}

function toDoContent(id, name)
{
    let contentElement= document.getElementById(id);
    let num;
    let containerElement= document.querySelector('#clear');
    if(contentElement.children[0].getAttribute('id') === 'empty'){
        clearContent(id);
        num=0;
        createClearBtn(containerElement);
    }
    else
    {
        num=contentElement.children.length;
    }

    contentElement.appendChild(buildToDoTab(name, num ,[
        {btnClass: 'status-btn', btnID: (num+3), imgClass: 'status-icon', imgId: num, func: 'updateStatus("'+num+'"\,"'+(num+3)+'")', imgSrc:''},
        {btnClass: 'edit-btn', btnID: '', imgClass: 'edit-icon', imgId: '', func: 'editToDo("'+(num+1)+'")', imgSrc: 'Project icons/edit icon.png'},
        {btnClass: 'remove-btn', btnID: 'rem'+(num+3), imgClass: 'remove-icon', imgId: '', func: 'removeToDo("'+(num+1)+'")', imgSrc: 'Project icons/remove icon.png'},

    ]));
    
}

function removeToDo(id)
{   
    let clearBtn= document.querySelector('#clear');
    let contentElement = document.getElementById('list');
    let unDeleted=[];
    let todoObject={};

    //removing a selected task from parent element
    for(let i = 0; i<contentElement.children.length; i+=1)
        if(contentElement.children[i].getAttribute('id') == 'tab'+Number(id))
            contentElement.removeChild(contentElement.children[i]);

    //removing task from Storage
    for(let j=0; j<ToDo.length; j+=1)
        if((Object.getOwnPropertyNames((ToDo[j])))[0] != 'tab'+id)
            unDeleted[unDeleted.length]= ToDo[j];

    //updating property name
    for(let ind=0; ind<unDeleted.length; ind+=1)
    {
        let str=(Object.getOwnPropertyNames(unDeleted[ind]))[0];
        let idNum=Number(str[str.length-1]);
        if(idNum>Number(id))
        {
            todoObject['tab'+(idNum-1)]=(unDeleted[ind])[str];
            unDeleted[ind]= todoObject;
            todoObject={};
        }
    }

    //updating button id
    for(let childInd=0; childInd<contentElement.children.length; childInd+=1)
    {
        let todoTag= contentElement.children[childInd];
        let todoTitle= todoTag.children[0];
        let todoBtns= todoTag.children[1];
        let editBtn= todoBtns.children[1];
        let remBtn= todoBtns.children[2];

        let str= todoTag.getAttribute('id');
        let idNum= Number(str[str.length-1]);
        
        if(idNum > Number(id))
        {
            todoTag.setAttribute('id', 'tab'+(idNum-1));
            todoTitle.setAttribute('id', 'todo'+(idNum-1));
            editBtn.setAttribute('onclick', 'editToDo("'+(idNum-1)+'")');
            remBtn.setAttribute('onclick', 'removeToDo("'+(idNum-1)+'")');
        }
    }

    ToDo=unDeleted;
    storeToDos();

    //creating empty list element
    // and removing clear button if list empty
    if(contentElement.children.length==0)
    {
        contentElement.appendChild(createEmptyList());
        clearBtn.removeChild(clearBtn.children[0]);
    }
}
function clearList()
{
    let contentElement = document.querySelector('#list');
    let clearBtn= document.querySelector('#clear');

    //clearing to do list
    while(contentElement.children.length>0)
        contentElement.removeChild(contentElement.children[0]);
    // creating empty list element
    // and removing clear button
    contentElement.appendChild(createEmptyList());
    clearBtn.removeChild(clearBtn.children[0]);
    ToDo=[];
    storeToDos();   
}

function createEmptyList()
{
    let emptyPar= document.createElement('p');
    emptyPar.classList.add('empty-list')
    emptyPar.setAttribute('id', 'empty');
    emptyPar.innerText= 'Empty List';
    return emptyPar;
}

function editToDo(id)
{   
    let todoEle= document.querySelector('#todo'+id);
    const newName= prompt('Editing To Do title:', todoEle.innerText);
    if(newName != null)
    {
        todoEle.innerText= newName;
        for(let i=0; i<ToDo.length; i+=1)
            if((Object.getOwnPropertyNames(ToDo[i]))[0]== 'tab'+id)
                (ToDo[i])['tab'+id]=newName;
        storeToDos();
    }
    
}

function updateStatus(id, btnID)
{
    let statBtn= document.getElementById(id);
    
    if(statBtn.getAttribute('src') == '')
    {
        let resp= confirm('Click OK to confirm task is completed.');
        if(resp){
            statBtn.setAttribute('src', './Project icons/status icon.png');
            (document.getElementById(Number(btnID))).classList.add('completed');
        }
    }
    else
    {
        let resp= confirm('You are about to uncheck a\ncompleted task.');
        if(resp){
            statBtn.setAttribute('src', '');
            (document.getElementById(Number(btnID))).classList.remove('completed');
        }
    }
}

function clearContent(id)
{
    let contentElement= document.getElementById(id);
    while(contentElement.children.length > 0)
        contentElement.removeChild(contentElement.children[0]);
}

function buildTab(name,num)
{
    let todoElement= document.createElement('div');
    let todoTitleElement= document.createElement('p');
    todoElement.classList.add("to-do-content");
    todoElement.setAttribute('id', 'tab'+(num+1))
    todoTitleElement.classList.add('to-do');
    todoTitleElement.innerText= name;
    todoTitleElement.setAttribute('id', "todo"+(num+1));
    todoElement.appendChild(todoTitleElement);
    return todoElement;
}

function tabButtons(schema)
{
    let btnContainer= document.createElement('div');
    btnContainer.classList.add('container-btn');
    for(item of schema)
    {     
        let btn= document.createElement('button');
        let btnIcon= document.createElement('img');
        btn.classList.add(item.btnClass);
        btn.setAttribute('onclick', item.func);
        btn.setAttribute('id', item.btnID);
        btnIcon.classList.add(item.imgClass);
        btnIcon.setAttribute('id', item.imgId);
        btnIcon.src= item.imgSrc;
        btn.appendChild(btnIcon);
        btnContainer.appendChild(btn);
    }
    return btnContainer;
}

function buildToDoTab(name, num, schema)
{   
    let todoObject= {};

    //creating a ToDo tab
    let todoElement= buildTab(name, num);
    todoObject['tab'+(num+1)]=name;

    //creating buttons
    todoElement.appendChild(tabButtons(schema));

    //saving ToDo as an object
    saveToDoObject(todoObject);

    return todoElement;
}