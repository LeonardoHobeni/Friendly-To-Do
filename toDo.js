function addToDo(idInput, idSlab)
{
    let toDoName= (document.getElementById(idInput)).value;
    toDoContent(idSlab, toDoName);
}

function toDoContent(id, name)
{
    let contentElement= document.getElementById(id);
    let num= contentElement.children.length;
    if(contentElement.children[0].getAttribute('id') === 'empty')
        clearContent(id);
     contentElement.appendChild(buildToDoTab(name, num ,[
            {btnClass: 'status-btn', imgClass: 'status-icon', imgId: 'stat-icon', func: 'updateStatus()', imgSrc: ''},
            {btnClass: 'edit-btn', imgClass: 'edit-icon', imgId: '', func: 'editToDo("'+num+'")', imgSrc: 'Project icons/edit icon.png'},
            {btnClass: 'remove-btn', imgClass: 'remove-icon', imgId: '', func: 'removeToDo("'+(num-1)+'")', imgSrc: 'Project icons/remove icon.png'},

        ]));
    
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
    todoTitleElement.className= 'to-do';
    todoTitleElement.innerText= name;
    todoTitleElement.setAttribute('id', num);
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
        btnIcon.className= item.imgClass;
        btnIcon.setAttribute('id', item.imgId);
        btnIcon.src= item.imgSrc;
        btn.appendChild(btnIcon);
        btnContainer.appendChild(btn);
   }
   todoElement.appendChild(btnContainer);
   return todoElement;
}