function addToDo(idInput, idSlab)
{
    let toDoName= (document.getElementById(idInput)).value;
    if(toDoName !== '')
    {
        toDoContent(idSlab, toDoName);
        (document.getElementById(idInput)).value= '';
        
    }
    else
    {
        alert('Invalid Action, To Do Name not included!');
    }
}

function createClearBtn(containerElement)
{
    let clearBtn= document.createElement('button');
    clearBtn.className= 'clear-btn';
    clearBtn.innerText= 'Clear List';
    clearBtn.setAttribute('onclick', 'clearList()');
    containerElement.appendChild(clearBtn);
}

function toDoContent(id, name)
{
    let contentElement= document.getElementById(id);
    let num;
    let containerElement= document.getElementById('clear');
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
            {btnClass: 'remove-btn', btnID: '', imgClass: 'remove-icon', imgId: '', func: 'removeToDo("'+(num-1)+'")', imgSrc: 'Project icons/remove icon.png'},

        ]));
    
}

function removeToDo(id)
{   
    console.log('Removing');
    let clearBtn= document.getElementById('clear');
    let contentElement = document.getElementById('list');
    for(let i = 0; i<contentElement.children.length; i+=1)
        if(contentElement.children[i].getAttribute('id') == Number(id))
            contentElement.removeChild(contentElement.children[i]);
    if(contentElement.children.length==0)
    {
        contentElement.appendChild(createEmptyList());
        clearBtn.removeChild(clearBtn.children[0]);
    }
}
function clearList()
{
    let contentElement = document.getElementById('list');
    let clearBtn= document.getElementById('clear');
    while(contentElement.children.length>0)
        contentElement.removeChild(contentElement.children[0]);
    contentElement.appendChild(createEmptyList());
    clearBtn.removeChild(clearBtn.children[0]);
}

function createEmptyList()
{
    let emptyPar= document.createElement('p');
    emptyPar.className='empty-list';
    emptyPar.setAttribute('id', 'empty');
    emptyPar.innerText= 'Empty List';
    return emptyPar;
}

function editToDo(id)
{   
    let todoEle= document.getElementById('todo'+id);
    const newName= prompt('Editing To Do title:', todoEle.innerText);
    if(newName != null)
        todoEle.innerText= newName;
}

function updateStatus(id, btnID)
{
    let statBtn= document.getElementById(Number(id));
    
    if(statBtn.getAttribute('src') == '')
    {
        let resp= confirm('Click OK to confirm task is completed.');
        if(resp){
            statBtn.setAttribute('src', 'Project icons/status icon.png');
            (document.getElementById(Number(btnID))).className= 'completed';
        }
    }
    else
    {
        let resp= confirm('You are about to uncheck a\ncompleted task.');
        if(resp){
            statBtn.setAttribute('src', '');
            (document.getElementById(Number(btnID))).className= 'status-btn';
        }
    }
}

function clearContent(id)
{
    let contentElement= document.getElementById(id);
    while(contentElement.children.length > 0)
        contentElement.removeChild(contentElement.children[0]);
}

function buildToDoTab(name, num, schema)
{
    let todoElement= document.createElement('div');
    let todoTitleElement= document.createElement('p');
    todoElement.className= "to-do-content";
    todoElement.setAttribute('id', (num-1))
    todoTitleElement.className= 'to-do';
    todoTitleElement.innerText= name;
    todoTitleElement.setAttribute('id', "todo"+(num+1));
    todoElement.appendChild(todoTitleElement);

    //creating buttons
    let btnContainer= document.    createElement('div');
    btnContainer.className='container-btn';
   for(item of schema)
   {     
        let btn= document.createElement('button');
        let btnIcon= document.createElement('img');
        btn.className= item.btnClass;
        btn.setAttribute('onclick', item.func);
        btn.setAttribute('id', item.btnID);
        btnIcon.className= item.imgClass;
        btnIcon.setAttribute('id', item.imgId);
        btnIcon.src= item.imgSrc;
        btn.appendChild(btnIcon);
        btnContainer.appendChild(btn);
   }
   todoElement.appendChild(btnContainer);
   return todoElement;
}